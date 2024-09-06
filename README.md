# WIP

pkg build command:

```zsh
wasm-pack build --target web
```

minified build (requires nightly build)
```zsh
wasm-pack build --target web --release --manifest-path Cargo.toml -Z build-std=panic_abort,std -Z build-std-features=panic_immediate_abort
```
