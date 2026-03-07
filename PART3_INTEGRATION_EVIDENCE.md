# Part 3: Integration and Evidence

## 1) Branch Protection Update (main)

`main` is protected (`"protected": true` from `GET /repos/jrwaka/study-link/branches/main`).

Required CI checks to enforce before merge:
- `Lint`
- `Test`
- `Docker Build`

Manual update path (repo admin):
1. Open `https://github.com/jrwaka/study-link/settings/branches`.
2. Edit the branch protection rule for `main`.
3. Enable `Require status checks to pass before merging`.
4. Select checks: `Lint`, `Test`, `Docker Build`.
5. Save changes.

API alternative (repo admin token required):
```bash
curl -L -X PUT \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer <YOUR_GITHUB_TOKEN>" \
  https://api.github.com/repos/jrwaka/study-link/branches/main/protection \
  -d '{
    "required_status_checks": {
      "strict": true,
      "checks": [
        {"context": "Lint"},
        {"context": "Test"},
        {"context": "Docker Build"}
      ]
    },
    "enforce_admins": true,
    "required_pull_request_reviews": {
      "required_approving_review_count": 1
    },
    "restrictions": null,
    "required_linear_history": false,
    "allow_force_pushes": false,
    "allow_deletions": false,
    "block_creations": false,
    "required_conversation_resolution": true,
    "lock_branch": false,
    "allow_fork_syncing": true
  }'
```

## 2) CI Evidence

### Successful CI runs (at least 3)
- Run #13 (success, push to feature/ci-pipeline, 2026-03-06 20:54:08 UTC): https://github.com/jrwaka/study-link/actions/runs/22781573275
- Run #14 (success, pull_request to feature/ci-pipeline, 2026-03-06 20:54:10 UTC): https://github.com/jrwaka/study-link/actions/runs/22781574434
- Run #20 (success, push to feature/branch-protection, 2026-03-07 11:53:04 UTC): https://github.com/jrwaka/study-link/actions/runs/22798554684

### Failed CI run sequence (then fixed)
**Failure sequence** (feature/branch-protection branch):
- Run #15 (failure, 2026-03-07 11:03:41 UTC): https://github.com/jrwaka/study-link/actions/runs/22797838773
- Run #16 (failure, 2026-03-07 11:15:39 UTC): https://github.com/jrwaka/study-link/actions/runs/22797943849
- Run #17 (failure, 2026-03-07 11:18:01 UTC): https://github.com/jrwaka/study-link/actions/runs/22797965165
- Run #18 (failure, 2026-03-07 11:26:33 UTC): https://github.com/jrwaka/study-link/actions/runs/22798073769
- Run #19 (failure, 2026-03-07 11:50:22 UTC): https://github.com/jrwaka/study-link/actions/runs/22798438898

**Fixed in**:
- Run #20 (success, 2026-03-07 11:53:04 UTC): https://github.com/jrwaka/study-link/actions/runs/22798554684
  - Resolution: Removed intentional CI test error from `backend/quiz/views.py`
  - Commit: `e6a1d34` - fix: remove intentional CI test error from views

## 3) Pull Request + CI + Code Review Evidence

- PR #17 (merged): https://github.com/jrwaka/study-link/pull/17
- PR includes CI pipeline checks (`CI Pipeline`) and an approved review.
- Review evidence: https://github.com/jrwaka/study-link/pull/17#pullrequestreview-3906230845
