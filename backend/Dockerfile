FROM rust:trixie
WORKDIR /backend
COPY . .

RUN rustup toolchain install stable --profile minimal --component clippy,rust-analyzer,rust-src,rustfmt
RUN rustup default stable
RUN cargo install cargo-binstall
RUN cargo binstall -y cargo-cache cargo-edit cargo-update cargo-outdated cargo-watch

EXPOSE 3001
