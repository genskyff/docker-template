FROM rust:slim-trixie
RUN rustup component add clippy rust-analyzer rust-src rustfmt && \
    cargo install --locked cargo-binstall && \
    cargo binstall --locked -y cargo-edit cargo-expand cargo-outdated cargo-update watchexec-cli && \
    rm -rf /usr/local/cargo/registry/cache /usr/local/cargo/registry/src
