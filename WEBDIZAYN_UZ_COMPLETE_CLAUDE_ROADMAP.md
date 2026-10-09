# WEBDIZAYN.UZ — COMPLETE CLAUDE CODE ROADMAP

## MAQSAD

WEBDIZAYN.UZ oddiy LMS emas. Bu:
**Learn → Understand → Practice → Code → Run → Check → Ask AI → Pass → Unlock → Assignment → Submit → Teacher Review → Feedback → Improve → Resubmit → Finalize → Portfolio → Analytics**

oqimini ta’minlaydigan Web Design/Web Development ta’lim platformasi.

## GLOBAL QOIDALAR

- Avval CURRENT repositoryni inspect qil.
- Ishlayotgan kodni qayta yozma.
- Eski Phase-0 archive'ni current repo deb qabul qilma.
- Har bir phase mustaqil bajarilsin va test qilinsin.
- Regression bo‘lmasa keyingi phasega o‘t.
- Server authorization authoritative.
- Strict sequential learning server-side enforced.
- RUN — local/browser preview; CHECK — authoritative server-side validation.
- AI teacher o‘rnini bosmaydi va avtomatik grade bermaydi.
- Hidden CHECK rules studentga berilmaydi.
- Student faqat o‘z protected resourcesiga kira oladi.
- Submission versions immutable.
- Secret/API key frontend, student context, logs yoki sandboxga chiqmasin.
- Real AI provider security/DPA/data-location tasdiqlanmaguncha Mock Provider default.
- Har phase oxirida STATUS: READY / READY_WITH_INFRASTRUCTURE_LIMITATIONS / NOT_READY.

---

# PHASE 11 — AI TUTOR

## 11A — FOUNDATION

Agar mavjud bo‘lmasa implement qil:

- TutorContext
- AiProvider interface
- Mock Provider
- AiTutorService
- controller/API
- tutor frontend panel
- server-side context builder
- bounded context limits
- rate limit
- security isolation

TutorContext:
- offering
- lesson/title
- bounded lesson text
- student's own project files
- progress
- requirement status
- CHECK summary
- optional RUN summary
- assignment context

Hech qachon password, session, API key, boshqa student, hidden CHECK implementation yoki unnecessary PII yuborilmasin.

## 11B-1 — HTTP AI PROVIDER

Implement:

- HttpAiProvider
- OpenAI-compatible chat-completions adapter
- vendor-SDK-independent interface
- API key faqat Authorization headerda
- timeout
- bounded retry
- safe provider errors
- response truncation
- AiUsageService
- ai_usage table/migration
- daily request/character quota
- estimated cost

Config:
AI_PROVIDER
AI_PROVIDER_URL
AI_PROVIDER_MODEL
AI_PROVIDER_API_KEY
AI_REQUEST_TIMEOUT_MS
AI_MAX_ATTEMPTS
AI_DAILY_REQUESTS
AI_DAILY_PROMPT_CHARS
AI_ALLOW_REAL_STUDENT_DATA

Real provider faqat explicit allow flag + URL + key + http mode bo‘lganda ishlasin. Aks holda Mock Provider.

## 11B-2 — PEDAGOGICAL ENGINE

Tutor modes:
- CODE_EXPLANATION
- HINT
- ERROR_EXPLANATION
- COMPREHENSION_QUESTION
- FLEXBOX_HELP
- ASSIGNMENT_GUIDANCE
- TEACHER_HANDOFF
- OUT_OF_SCOPE

Hint progression:
1. Hint 1 — concept/direction
2. Hint 2 — concrete direction
3. Hint 3 — specific next action

Full ready-to-submit assignment solution berilmasin. Hint state refresh bilan reset bo‘lmasin.

Code explanation:
- student's own code
- important blocks
- likely errors
- student level
- whole solutionni avtomatik rewrite qilmasin

RUN/CHECK error:
- meaning
- likely cause
- concept to inspect
- next debugging action
- hidden CHECK implementation berilmasin
- corrected full code berilmasin

Relevant responses uchun exactly ONE comprehension question. Automatic grading yo‘q.

Assignment solution so‘ralsa:
- guided refusal
- next hint
- one comprehension question

Levels:
- BEGINNER
- INTERMEDIATE
- ADVANCED

Teacher handoff:
- event/record
- short reason/category
- no grade/progress/submission mutation

AI feedback:
- helpful/not helpful
- optional reason
- grade/progressga ta’sir qilmasin

Output guard:
- system prompt leakage
- hidden CHECK leakage
- secret/session leakage
- other-student data
- obvious ready-to-submit solution

Regexni yagona security deb hisoblama.

## 11B-3 — AI TUTOR UX

Responsive tutor panel:
- current interaction
- hint number
- comprehension question
- teacher handoff
- helpful/not helpful
- loading/error/quota/access-denied states
- dark mode
- keyboard/accessibility

Assignment full-solution response UI orqali ham block qilinsin.

---

# PHASE 12 — PRACTICE / IDE / ASSIGNMENTS

## 12A — EXERCISES

Exercise:
- lesson
- title
- description
- instructions
- starter files
- expected behavior
- difficulty
- order
- active status

Progress:
NOT_STARTED / IN_PROGRESS / PASSED / NEEDS_IMPROVEMENT

Teacher exercise yaratadi/tahrirlaydi. Student faqat o‘z workspace'iga ega.

## 12B — WEB IDE / PLAYGROUND

Monaco playground:
- HTML/CSS/JS
- project tree
- create/delete/rename file
- editor
- preview
- console
- RUN
- reset starter code

Sandbox:
- isolated origin
- iframe sandbox
- CSP
- validated postMessage
- parent DOM/navigation yo‘q
- restricted network
- watchdog timeout

RUN authoritative grade emas.

## 12C — CHECK ENGINE

Playwright authoritative validation:
- page load
- DOM
- text
- attributes
- CSS/computed style
- responsive conditions
- JS behavior

Result:
PASSED / FAILED / ERROR / TIMEOUT

Studentga safe summary berilsin. Hidden checks clientga yuborilmasin.

## 12D — ASSIGNMENTS

Assignment:
DRAFT → PUBLISHED → CLOSED

Submission:
DRAFT → SUBMITTED → IN_REVIEW → REVISION_REQUESTED → GRADED → FINALIZED

Assignment:
- instructions
- deadline
- attempts
- lesson
- rubric
- requirements
- starter project
- grading policy

Har resubmit yangi immutable version.

## 12E — TEACHER REVIEW

Teacher:
- submission
- project/code preview
- CHECK results
- rubric
- score
- feedback
- revision request
- finalize

Teacher review authorization bilan scope qilinsin. Grade faqat teacher workflow orqali o‘zgarsin. Audit event yaratilishi kerak.

---

# PHASE 13 — PROGRESS / PORTFOLIO / ANALYTICS

## 13A — COURSE MAP & PROGRESS

Course map:
- modules
- lessons
- exercises
- quizzes
- assignments
- lock/completion states
- progress percentage

States:
LOCKED / AVAILABLE / IN_PROGRESS / COMPLETED / NEEDS_IMPROVEMENT

Server authoritative.

## 13B — PORTFOLIO

Student portfolio:
- completed projects
- selected assignments
- skills
- achievements
- course completion
- screenshots
- descriptions

Public portfolio faqat explicit publish qilinganda. Private data chiqmasin.

## 13C — ANALYTICS

Student:
- course progress
- completion
- exercise performance
- CHECK success
- assignment performance
- weak topics
- trends
- AI usage

Teacher:
- class progress
- bottlenecks
- common errors
- assignment status
- struggling students
- revision rate

Organization:
- course activity
- completion
- engagement
- teacher activity

Authorization scope saqlansin.

---

# PHASE 14 — SECURITY / PRODUCTION

## 14A — SECURITY HARDENING

Audit:
- session expiry
- cookie flags
- Argon2id
- login rate limit
- neutral auth errors
- role/permission forgery
- x-user-id forgery
- cross-student
- cross-teacher
- cross-org
- ownership
- validation
- XSS
- injection
- path traversal
- file limits
- AI prompt injection
- context isolation
- hidden CHECK leakage
- quota abuse
- safe provider errors

## 14B — SANDBOX SECURITY

Verify:
- isolated origin
- CSP
- iframe restrictions
- postMessage origin checks
- no parent navigation/DOM
- restricted network
- execution timeout
- CPU/memory limits
- Playwright timeout
- filesystem isolation
- secrets isolation

Production:
- non-root
- minimal image
- resource limits
- read-only filesystem where possible
- gVisor/equivalent if infrastructure supports it

Unsupported local infrastructureni fake qilib PASS qilma.

## 14C — PRODUCTION READINESS

Check:
- env vars
- secrets
- migrations
- indexes
- health/readiness
- Redis/BullMQ
- logging
- errors
- monitoring hooks
- backups strategy
- rate limits
- CORS
- security headers
- production build
- Docker build
- migration deployment
- secret scan

---

# PHASE 15 — FINAL VALIDATION

## 15A — FULL E2E

Student:
Register → Login → Course → Lesson → Practice → Playground → RUN → CHECK → Pass → Unlock → AI Tutor → Assignment → Submit → Revision → Resubmit → Finalize → Portfolio

Teacher:
Login → Course → Assignment → Submission → Review → Rubric → Feedback → Revision → Grade → Finalize

Security:
- cross-student denied
- cross-teacher denied
- cross-org denied
- forged role denied
- forged permission denied
- unauthorized AI context denied
- hidden CHECK inaccessible

## 15B — REGRESSION AUDIT

Run:
- lint
- typecheck
- build
- unit
- integration
- E2E
- format
- secret scan

Database:
- migrations
- seed
- constraints
- indexes
- foreign keys

Frontend:
- responsive
- dark mode
- keyboard
- accessibility
- loading
- empty
- error
- locked
- unauthorized
- network failure

Backend:
- validation
- authorization
- safe errors
- safe logs

## 15C — FINAL RELEASE AUDIT

Do not add new features.

Audit:
1. Authentication
2. RBAC
3. Course foundation
4. Sequential learning
5. Lesson player
6. Course map
7. Exercises
8. Playground
9. RUN
10. CHECK
11. Assignments
12. Submission versions
13. Teacher review
14. AI Tutor
15. AI pedagogical policy
16. AI security
17. Portfolio
18. Analytics
19. Sandbox security
20. Production readiness
21. E2E
22. Accessibility
23. Responsive UI
24. Dark mode
25. Error handling
26. Secret scan

Produce:
- FINAL_STATUS
- implemented features
- known limitations
- infrastructure blockers
- migration status
- test counts
- E2E status
- security status
- production blockers

Never report READY if critical security, data-isolation, authorization or core-learning-flow tests fail.

---

# EXECUTION PROTOCOL

Execute sequentially:

11B-2
→ 11B-3
→ 12A
→ 12B
→ 12C
→ 12D
→ 12E
→ 13A
→ 13B
→ 13C
→ 14A
→ 14B
→ 14C
→ 15A
→ 15B
→ 15C

For EVERY phase:

1. Inspect current repository.
2. Identify what already exists.
3. Implement ONLY current phase.
4. Do not start future phases.
5. Add migrations only when necessary.
6. Add focused tests.
7. Run targeted tests.
8. Run regression.
9. Run lint/typecheck/build.
10. Run formatting.
11. Run security/secret scan where relevant.
12. Review authorization and ownership.
13. Report files changed.
14. Report tests.
15. Report limitations.
16. Report STATUS.

If already implemented:
- audit it;
- do not duplicate;
- fix only verified gaps;
- continue.

If tests fail:
- stop;
- fix current phase;
- rerun;
- only then continue.

If an architecture conflict appears:
- preserve working architecture;
- make the smallest compatible change;
- explain the conflict.

## COMMIT PROTOCOL

Prefer one focused commit per subphase:

phase(11b-2): add pedagogical ai tutor engine
phase(11b-3): improve ai tutor ux
phase(12a): add exercises
phase(12b): add web playground
phase(12c): add check engine
phase(12d): add assignments and submissions
phase(12e): add teacher review
phase(13a): finalize course progress
phase(13b): add portfolio
phase(13c): add analytics
phase(14a): security hardening
phase(14b): sandbox security
phase(14c): production readiness
phase(15a): full e2e
phase(15b): regression audit
phase(15c): final release audit

## CURRENT INSTRUCTION

Start from the CURRENT repository.

Do not assume `webdizayn-phase0-restored.tar.gz` is the current implementation.

Inspect the current repository first.

If 11B-1 is complete, start 11B-2.
If 11B-2 is complete, audit it and continue 11B-3.
Continue sequentially.

Do not implement all phases in one pass.
Do not skip verification.
Do not rewrite working code.
