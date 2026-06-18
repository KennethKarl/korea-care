# Safedoc Global Service

**English** · [한국어](./README.ko.md)

Team workspace for Safedoc's global service. This repo ships the shared Claude Code configuration so every teammate works under the same environment. Project source code lives alongside `.claude/`.

## Setup

Run these three steps once per machine.

### 1. Clone

```bash
git clone https://github.com/williamlee-rgb/global-service.git
cd global-service
```

### 2. Add the ECC plugin marketplace

Inside Claude Code:

```
/plugin marketplace add https://github.com/affaan-m/everything-claude-code
```

### 3. Install the ECC plugin

```
/plugin install everything-claude-code@everything-claude-code
```

That's it. `.claude/settings.json` in this repo grants the shared permissions your Claude Code session needs; personal overrides go in `.claude/settings.local.json` (gitignored).

## What's in this repo

- `.claude/settings.json` — team-shared Claude Code permissions
- `.gitignore` — excludes the ECC plugin clone, env files, build output, and OS cruft

Everything else (application code, docs, infra) gets added here as the project grows.
