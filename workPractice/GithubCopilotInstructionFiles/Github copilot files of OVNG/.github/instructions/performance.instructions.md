---
applyTo: '**/*.js'
---
# Performance & Scalability

TLDR: Minimize DB round trips, bound loops & payloads, batch & cache where safe.

## DB Access
- Prefer indexed queries; add index before deploying heavy filters.
- Avoid N+1: no population inside large loops; prefetch or batch.
- Limit projection: select only needed fields.
- For large result sets: stream or paginate (hard cap limit e.g. 200).

## Batching & Concurrency
- Use `Promise.allSettled` for independent operations; cap concurrency (e.g., p-limit 5–10) for external APIs.
- Chunk large arrays: `for (i=0;i<items.length;i+=BATCH)` slices.
- Use 207 response when partial batch outcomes.

## Caching
- Cache stable config / reference data (TTL). Invalidate on mutation.
- Do not cache per-user sensitive data without scoping + TTL.

## Memory
- Avoid building giant arrays; process stream-like where possible.
- Release large temp structures after use (`items = null`).

## Timeouts & Retries
- External HTTP: timeout < 5s, 3 retries max, exponential backoff.
- Log slow operations > threshold (e.g., 1s DB query).

## Feature Flags
- Gate new microservice integrations behind `sails.config.custom.*` flags.

## Metrics (If instrumentation available)
- Track: latency p95, error rate %, cache hit %, DB query count per request.

## Quick Rejects
- Unbounded `Promise.all` with user-sized input.
- Fetching all records to filter in memory.
- Adding cache without invalidation plan.
