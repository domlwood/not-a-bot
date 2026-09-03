# NotABot

### A Ticket-Drop Bot-Defense System

A backend for a single flash-sale "drop" event (concert/sneaker style) that survives a massive concurrent crowd, guarantees zero overselling, and detects bot traffic — inspired by real-world systems like Ticketmaster's queue-it style waiting rooms.

Named after the classic "I'm not a robot" checkbox — except here, the backend is the one doing the checking, on every single request.

## Product Scope

One event, fixed ticket/seat inventory, a queue that admits people in controlled waves, and a purchase flow that can't be gamed or overwhelmed.

---

## Acceptance Criteria

### 1. Virtual Waiting Room
- When traffic exceeds a configurable threshold, new arrivals are placed in a queue instead of hitting the purchase endpoint directly.
- Each queued user gets a position and an estimated wait, retrievable via polling or a WebSocket push.
- Users are admitted from the queue in controlled batches (e.g. every N seconds, M users let through) so the purchase endpoint never receives more concurrent traffic than it's rated for.
- Admission issues a short-lived, signed token; only requests with a valid token can hit the purchase endpoint.
- A user who never returns doesn't block the queue — admitted slots expire and recycle if unused within a time window.

### 2. No Overselling, Under Real Concurrency
- Given exactly K tickets available, launching K+N simultaneous purchase requests results in exactly K successes and N correctly-rejected failures — proven with an actual concurrent load test, not just reasoning about it.
- Inventory decrement is atomic (e.g. Redis `DECR`/Lua script, or DB row locking with proper isolation level) — no read-then-write race window.
- A failed payment/checkout step releases the held ticket back to inventory within a bounded time (no "ticket limbo").
- Idempotency: if a client retries a purchase request (double-click, network retry), it doesn't consume two tickets.

### 3. Bot Detection
- Request timing patterns (inhumanly fast form completion, perfectly regular intervals between requests, no mouse/interaction signal if captured) are scored, not just binary allow/block.
- A configurable threshold flags/throttles suspicious sessions differently from trusted ones (e.g. bot-suspected traffic gets pushed to the back of the queue or hit with a challenge, not necessarily a hard ban — fewer false-positive support tickets).
- The system logs *why* something was flagged (score breakdown), so behavior is explainable, not a black box.
- At least one deliberately scripted bot client is included in the repo, and the demo shows it getting caught.

### 4. Survives the Actual Flash Crowd
- A load-testing script (k6, Artillery, or custom) simulates ~200k requests arriving in a tight window.
- p99 latency and error rate stay within defined bounds (set your own SLO, e.g. "p99 < 500ms, error rate < 0.1% for legitimate requests") — and you can show the graph.
- System degrades gracefully under overload (returns fast "come back later" / queue position, not hanging connections or 500s).

### 5. Observability
- A live dashboard (even a simple one) showing: current queue length, admission rate, tickets remaining, requests/sec, bot-flagged %.
- This is what makes the demo watchable instead of just a terminal full of logs.

---

## Suggested Build Plan

| Days | Focus |
|------|-------|
| 1–2 | Data model + atomic inventory logic (the core "no oversell" guarantee) with unit + concurrency tests first, before any queue exists. |
| 3–5 | Virtual waiting room — queue, admission batching, token issuance, expiry/recycling. |
| 6–7 | Purchase flow wired to the queue token, idempotency, payment-fail rollback. |
| 8–9 | Bot scoring — timing heuristics, scoring pipeline, differential treatment. |
| 10–11 | Load test harness + bot simulation client; tune thresholds against real results. |
| 12–13 | Dashboard for the demo. |
| 14 | Buffer / write-up (README with proof points, e.g. "we killed a node mid-drop and no ticket was lost"). |

---
