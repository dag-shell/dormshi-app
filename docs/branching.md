# Branching pitfalls we hit

Notes from implementing endpoints across feature branches (`identity_and_setup`, `discovery_and_vendors`, `orders_placement`, `offers_delivery`, …).

---

## 1. `tgcloud push` is not git-branch aware

Git branches can each hold only that phase’s endpoints. That is fine for GitHub.

`npx tgcloud push` uploads **the whole local `tgcloud/` folder** as the bot’s module set. Anything not on disk is treated as deleted in the cloud.

So if you push from `discovery_and_vendors` while `users_me.js` / `users_update.js` only live on `identity_and_setup`, the CLI warns that those cloud modules will be **DELETED**. Answer **N**.

Push cloud from `main` after the PRs you care about are merged (when every endpoint you want live exists locally).

---

## 2. Shared `tgcloud/lib/` on multiple branches

`orders_placement` added `lib/` (`auth`, `pagination`, `time`, …). `offers_delivery` needed those imports too, but that branch didn’t have `lib/`, so the same helpers were added again.

That is temporary duplication across branches, not two permanent copies on `main`. **Keep `lib/` on any branch that imports it.**

When those branches merge, Git may conflict on `lib/` (“both added” / content conflict). Keep **one** clean file that has all needed helpers, `git add tgcloud/lib/`, continue the merge. Same idea for future phases that add more lib files.

---

## 3. Endpoint file names

Platform names allow letters, digits, `_` only — not dots. Use `users_me.js` / call `'users_me'`, not `users.me.js`.
