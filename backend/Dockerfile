FROM rust:latest
WORKDIR /backend
COPY . .
RUN cargo build -r
EXPOSE 3000
CMD ["cargo", "run", "-r"]
