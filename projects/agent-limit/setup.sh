#!/bin/bash
# Install agent-limits CLI tool via cargo
if command -v cargo &> /dev/null; then
    cargo install agent-limits
else
    echo "Rust/Cargo is required to install agent-limits. Please install Rust from https://rustup.rs"
    exit 1
fi
