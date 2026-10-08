# AGENTS.md — orizonCP

Follow these rules in every session.

## PROJECT
- Product: orizonCP (self-hosted deployment control plane, part of the Orizon / orzn.io ecosystem)
- Stack: PHP/Laravel, Next.js, React, Tailwind CSS, MySQL/PostgreSQL, Docker
- Domain: cp.orzn.io (one config var: APP_URL / BASE_DOMAIN, never hardcode)
- Mail: MAIL_FROM_ADDRESS=no-reply@orzn.io, MAIL_FROM_NAME=orizonCP, SUPPORT_EMAIL=support@orzn.io (env only)
- Repo: github.com/learnwithrichuncle/orizoncp | Image: ghcr.io/learnwithrichuncle/orizoncp (env: IMAGE_REPO)
- Commands: see README or package.json/composer.json. Do not guess; read them once.

## BRAND (never break)
- Names: display `orizonCP` | lowercase `orizoncp` | UPPER `ORIZONCP` | Pascal `OrizonCP`
- NEVER write "Aeroplane" or "xt42io" in new code, text, config, or docs.
- Old `AEROPLANE_*` env vars and the old CLI command stay only as backward-compatible fallbacks.
- Don't rename DB tables/columns, past migrations, or API routes that clients depend on.
- No hardcoded domains, emails, or registry paths. Use env/config vars.

## TOKEN SAVING

### Output
- No greetings, no summaries, no explanations unless asked. Fewest words possible.
- Never repeat my request or the code back to me.
- Show only changed code (diff or changed function), never whole files unless asked.
- Don't list options. Pick the best one and do it. Ask only if truly blocked, one line max.
- Don't narrate the plan. Do the work, then reply "Done: <10 words>".
- Exception: for a bug I don't understand, explain the cause once, briefly.

### Reading
- Don't read the whole repo. grep/search for the exact file and lines first, then read only those lines.
- Don't re-read a file already read this session.
- Never print large outputs. For logs, tests, builds: show only errors and the last 20 lines.
- Ignore vendor/, node_modules/, .git/, build/dist, lockfiles, binary files.

### Writing
- Bulk edits: use scripts or sed/regex, not file by file.
- Small targeted patches in place. Never rewrite a whole file for a small change.
- Batch related changes in one tool call.
- No comments, docs, or tests unless asked.
- Fix only what was asked. No refactors, no extra features.

### Context
- One task per session. Stop when the task is done.
- At 50% context: write `HANDOFF.md` (done, remaining, next step), commit, stop.
- Run build/tests once at the end of the task, not after every edit.

## SAFETY
- Never commit secrets, `.env` files, or keys. Flag any found, without printing the value.
- Never push to main without being told. Commit small, one step per commit: `type: short message`.
- Never run destructive commands (drop DB, rm -rf, force push) without explicit approval.