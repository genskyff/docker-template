FROM rust:slim-trixie

RUN apt-get update && \
    apt-get install -y --no-install-recommends libssl-dev mold pkg-config && \
    rustup component add clippy rust-analyzer rustfmt rust-src && \
    cargo install --locked cargo-binstall && \
    cargo binstall --locked -y cargo-edit cargo-expand cargo-outdated cargo-update watchexec-cli && \
    rm -rf /tmp/* /usr/local/cargo/git/* /usr/local/cargo/registry/* /var/lib/apt/lists/*
