FROM rust:latest
WORKDIR /backend
COPY . .
RUN cargo build -r
EXPOSE 8333
CMD ["cargo", "run", "-r"]
