FROM rust:trixie

ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8

WORKDIR /app-server

RUN rustup toolchain install stable --profile minimal --component clippy,rust-analyzer,rust-src,rustfmt && \
    rustup default stable && \
    cargo install cargo-binstall && \
    cargo binstall -y cargo-cache cargo-edit cargo-update cargo-outdated cargo-watch && \
    cargo cache --autoclean

EXPOSE 3001
