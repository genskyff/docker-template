//! Provides a RESTful web server managing some Todos.
//!
//! API will be:
//!
//! - `GET /api/todos`: return a JSON list of Todos.
//! - `POST /api/todos`: create a new Todo.
//! - `PATCH /api/todos/{id}`: update a specific Todo.
//! - `DELETE /api/todos/{id}`: delete a specific Todo.

use axum::{
    Json, Router,
    error_handling::HandleErrorLayer,
    extract::{Path, Query, State},
    http::StatusCode,
    routing::{get, patch},
};
use mimalloc::MiMalloc;
use serde::{Deserialize, Serialize};
use sqlx::postgres::{PgPool, PgPoolOptions};
use std::time::Duration;
use tower::{BoxError, ServiceBuilder};
use tower_http::trace::TraceLayer;
use tracing_subscriber::fmt::time::OffsetTime;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use uuid::Uuid;

#[global_allocator]
static GLOBAL: MiMalloc = MiMalloc;

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| {
                format!("{}=debug,tower_http=debug", env!("CARGO_CRATE_NAME")).into()
            }),
        )
        .with(tracing_subscriber::fmt::layer().with_timer(
            OffsetTime::local_rfc_3339().expect("could not determine local time offset"),
        ))
        .init();

    let database_url =
        std::env::var("DATABASE_URL").expect("DATABASE_URL environment variable must be set");
    let db = PgPoolOptions::new()
        .max_connections(5)
        .acquire_timeout(Duration::from_secs(3))
        .connect(&database_url)
        .await
        .expect("can't connect to database");

    sqlx::migrate!()
        .run(&db)
        .await
        .expect("can't run database migrations");

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3100").await.unwrap();
    tracing::debug!("listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app(db)).await.unwrap();
}

fn app(db: PgPool) -> Router {
    // Compose the routes
    Router::new()
        .route("/api/todos", get(todos_index).post(todos_create))
        .route("/api/todos/{id}", patch(todos_update).delete(todos_delete))
        // Add middleware to all routes
        .layer(
            ServiceBuilder::new()
                .layer(HandleErrorLayer::new(|error: BoxError| async move {
                    if error.is::<tower::timeout::error::Elapsed>() {
                        Ok(StatusCode::REQUEST_TIMEOUT)
                    } else {
                        Err((
                            StatusCode::INTERNAL_SERVER_ERROR,
                            format!("Unhandled internal error: {error}"),
                        ))
                    }
                }))
                .timeout(Duration::from_secs(10))
                .layer(TraceLayer::new_for_http())
                .into_inner(),
        )
        .with_state(db)
}

// The query parameters for todos index
#[derive(Debug, Deserialize, Default)]
pub struct Pagination {
    pub offset: Option<u32>,
    pub limit: Option<u32>,
}

async fn todos_index(
    pagination: Query<Pagination>,
    State(db): State<PgPool>,
) -> Result<Json<Vec<Todo>>, AppError> {
    let todos = sqlx::query_as::<_, Todo>(
        r#"
        SELECT id, text, completed
        FROM todos
        ORDER BY created_at, id
        LIMIT $1 OFFSET $2
        "#,
    )
    .bind(i64::from(pagination.limit.unwrap_or(u32::MAX)))
    .bind(i64::from(pagination.offset.unwrap_or(0)))
    .fetch_all(&db)
    .await
    .map_err(internal_error)?;

    Ok(Json(todos))
}

#[derive(Debug, Deserialize)]
struct CreateTodo {
    text: String,
}

async fn todos_create(
    State(db): State<PgPool>,
    Json(input): Json<CreateTodo>,
) -> Result<(StatusCode, Json<Todo>), AppError> {
    let todo = sqlx::query_as::<_, Todo>(
        r#"
        INSERT INTO todos (id, text)
        VALUES ($1, $2)
        RETURNING id, text, completed
        "#,
    )
    .bind(Uuid::new_v4())
    .bind(input.text)
    .fetch_one(&db)
    .await
    .map_err(internal_error)?;

    Ok((StatusCode::CREATED, Json(todo)))
}

#[derive(Debug, Deserialize)]
struct UpdateTodo {
    text: Option<String>,
    completed: Option<bool>,
}

async fn todos_update(
    Path(id): Path<Uuid>,
    State(db): State<PgPool>,
    Json(input): Json<UpdateTodo>,
) -> Result<Json<Todo>, AppError> {
    let todo = sqlx::query_as::<_, Todo>(
        r#"
        UPDATE todos
        SET
            text = COALESCE($2, text),
            completed = COALESCE($3, completed)
        WHERE id = $1
        RETURNING id, text, completed
        "#,
    )
    .bind(id)
    .bind(input.text)
    .bind(input.completed)
    .fetch_optional(&db)
    .await
    .map_err(internal_error)?
    .ok_or_else(not_found)?;

    Ok(Json(todo))
}

async fn todos_delete(
    Path(id): Path<Uuid>,
    State(db): State<PgPool>,
) -> Result<StatusCode, AppError> {
    let result = sqlx::query("DELETE FROM todos WHERE id = $1")
        .bind(id)
        .execute(&db)
        .await
        .map_err(internal_error)?;

    if result.rows_affected() == 1 {
        Ok(StatusCode::NO_CONTENT)
    } else {
        Err(not_found())
    }
}

type AppError = (StatusCode, String);

fn internal_error(error: sqlx::Error) -> AppError {
    tracing::error!(%error, "database operation failed");
    (
        StatusCode::INTERNAL_SERVER_ERROR,
        "Internal server error".to_owned(),
    )
}

fn not_found() -> AppError {
    (StatusCode::NOT_FOUND, "Todo not found".to_owned())
}

#[derive(Debug, Serialize, sqlx::FromRow)]
#[cfg_attr(test, derive(Deserialize, PartialEq))]
struct Todo {
    id: Uuid,
    text: String,
    completed: bool,
}

#[cfg(test)]
mod tests {
    use super::*;
    use axum::body::{Body, Bytes, to_bytes};
    use axum::http::{Method, Request, header};
    use tower::ServiceExt;

    async fn send(
        app: &Router,
        method: Method,
        uri: &str,
        json: &'static str,
    ) -> (StatusCode, Bytes) {
        let request = Request::builder()
            .method(method)
            .uri(uri)
            .header(header::CONTENT_TYPE, "application/json")
            .body(Body::from(json))
            .unwrap();
        let response = app.clone().oneshot(request).await.unwrap();
        let status = response.status();
        let body = to_bytes(response.into_body(), usize::MAX).await.unwrap();
        (status, body)
    }

    #[sqlx::test]
    async fn todo_lifecycle(db: PgPool) {
        let app = app(db);

        let (status, body) = send(
            &app,
            Method::POST,
            "/api/todos",
            r#"{"text":"Write tests"}"#,
        )
        .await;
        assert_eq!(status, StatusCode::CREATED);
        let Json(created) = Json::<Todo>::from_bytes(&body).unwrap();
        assert_eq!(created.text, "Write tests");
        assert!(!created.completed);
        let uri = format!("/api/todos/{}", created.id);

        let (status, _) = send(&app, Method::PATCH, &uri, r#"{"completed":true}"#).await;
        assert_eq!(status, StatusCode::OK);

        let (status, body) = send(&app, Method::GET, "/api/todos", "").await;
        assert_eq!(status, StatusCode::OK);
        let Json(todos) = Json::<Vec<Todo>>::from_bytes(&body).unwrap();
        let updated = Todo {
            completed: true,
            ..created
        };
        assert_eq!(todos, [updated]);

        let (status, _) = send(&app, Method::DELETE, &uri, "").await;
        assert_eq!(status, StatusCode::NO_CONTENT);
        let (status, _) = send(&app, Method::DELETE, &uri, "").await;
        assert_eq!(status, StatusCode::NOT_FOUND);
    }
}
