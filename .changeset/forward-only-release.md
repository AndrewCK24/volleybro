---
"volleybro": patch
---

### Changed

#### Infrastructure

- Releases that change persisted data contracts without compatibility proof now ship as forward-only instead of being blocked; they cannot be rolled back or recovered to the previous production version.
