# AGENTS.md

## Cursor Cloud specific instructions

### Repository state

This repository is currently a placeholder. The only tracked content is `hello.txt`
(contents: `hello`). There is:

- No application source code.
- No dependency manifests (no `package.json`, `requirements.txt`, `go.mod`, etc.).
- No build, lint, or test tooling.
- No active git hooks (only default `*.sample` hooks).
- No `.cursor/environment.json`.

### Consequences for setup

- There are no dependencies to install, so the environment update script is a no-op.
- There is nothing to build, lint, or test yet. Standard commands (build/lint/test/run)
  do not exist until real application code and its manifests are added.
- Once application code is introduced, update the environment: add the appropriate
  install command (e.g. `npm ci`, `pip install -r requirements.txt`, `uv sync`) to the
  Cloud Agent update script, and document how to run/lint/test the app here.
