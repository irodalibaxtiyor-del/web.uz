# WEBDIZAYN.UZ — Loyiha qo'llanmasi va ish jurnali

Asosiy texnik topshiriq: [WEBDIZAYN_UZ_COMPLETE_CLAUDE_ROADMAP.md](WEBDIZAYN_UZ_COMPLETE_CLAUDE_ROADMAP.md).
Bu fayl ikki qismdan iborat: (1) loyiha qoidalari va arxitektura, (2) bajarilgan har bir amalning xronologik jurnali.

## 1. Arxitektura

| Qatlam     | Texnologiya                                                                          |
| ---------- | ------------------------------------------------------------------------------------ |
| Monorepo   | pnpm workspace (`apps/*`, `packages/*`)                                              |
| Backend    | NestJS 11 (CommonJS), TypeScript 5.9 — `apps/api`                                    |
| Frontend   | Next.js 16 + React 19 + Tailwind 4 — `apps/web`                                      |
| Umumiy kod | `packages/shared` — zod sxemalar, enumlar                                            |
| DB         | PostgreSQL + Drizzle ORM. Lokal/test: PGlite (in-process Postgres), production: `pg` |
| Test       | Vitest (+ unplugin-swc, decorator metadata uchun), Supertest                         |
| CHECK      | `packages/check-engine`: playwright-core + o'rnatilgan Chrome, alohida child process |
| Parol      | Argon2id (`@node-rs/argon2`)                                                         |
| Sessiya    | Server-side session jadvali, httpOnly cookie, token DB'da SHA-256 hash ko'rinishida  |

## 2. Qat'iy qoidalar (roadmapdan)

- Avtorizatsiya faqat serverda. Klientdan kelgan rol, ruxsat yoki `x-user-id` hech qachon ishonchli emas.
- Har bir protected resurs uchun ownership va org-scope tekshiriladi.
- Darslarning ketma-ket ochilishi serverda tekshiriladi.
- RUN: brauzerdagi preview. CHECK: serverdagi rasmiy tekshiruv. Yashirin CHECK qoidalari klientga yuborilmaydi.
- AI baho qo'ymaydi va tayyor yechim bermaydi. Mock Provider default.
- Topshiriq versiyalari immutable.
- Secret va kalitlar frontendga, loglarga yoki sandboxga chiqmaydi.
- Mavjud infratuzilma yo'q bo'lsa, PASS deb soxtalashtirilmaydi.

## 3. Buyruqlar

```bash
pnpm install
pnpm -r typecheck
pnpm -r lint
pnpm -r test
pnpm -r build
pnpm --filter @webdizayn/api dev   # API: http://localhost:4000
pnpm --filter @webdizayn/web dev   # Web: http://localhost:3000
# Typecheck/API'dan oldin build: shared va check-engine
pnpm --filter @webdizayn/shared build && pnpm --filter @webdizayn/check-engine build
```

## 4. Fazalar tartibi (kelishilgan)

Foundation (F0 skelet → F1 auth/RBAC → F2 kurs tuzilmasi va ketma-ket ochilish) → 12A → 12B → 12C → 13A → 12D → 12E → 11 (AI Tutor) → 13B → 13C → 14 → 15.

Sabab: AI Tutor konteksti (fayllar, CHECK summary, topshiriq) 12-fazada paydo bo'ladi.

---

# ISH JURNALI

Har bir amal shu yerga qo'shib boriladi (eng yangisi pastda).

## 2026-10-08

### Boshlang'ich holat

- Repository'da faqat roadmap fayli bor edi, commitlar yo'q.
- Muhit: Node 24.19, pnpm 12.9, git 2.55. Docker, PostgreSQL va Redis o'rnatilmagan.
- Qaror: lokal DB uchun PGlite, production uchun `pg`. Redis/BullMQ 12C fazasiga qoldirildi.
- Qaror: Nest 11 + TS 5.9 (Nest 12 ESM-only va TS 7 juda yangi, xavf kamroq bo'lsin).
- `CLAUDE.md` yaratildi (qoidalar va jurnal).

### F0 — Monorepo skeleti

- Ildiz fayllari: `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `.gitignore`, `.editorconfig`, `.prettierrc.json`, `.gitattributes`.
- pnpm 12 native build skriptlarni bloklaydi, shuning uchun `pnpm-workspace.yaml` ga `allowBuilds` (`@swc/core`, `esbuild`) qo'shildi.
- `packages/shared`: `ROLES` (STUDENT/TEACHER/ORG_ADMIN), zod sxemalar (`registerSchema`, `loginSchema`), `MeResponse` tipi. CJS'ga build qilinadi, API va web uni `dist` orqali ishlatadi. **Avval `pnpm --filter @webdizayn/shared build` qilish kerak.**

### F1 — Auth va RBAC (API)

- `apps/api`: NestJS 11 + Drizzle. DB drayveri `DATABASE_URL` bo'yicha tanlanadi (`pglite://memory`, `pglite://<papka>` yoki `postgres://`). Production'da PGlite taqiqlangan.
- Migratsiya `drizzle/0000_init.sql`: `organizations`, `users` (`lower(email)` bo'yicha unique), `memberships` (user+org unique, role enum), `sessions` (token SHA-256 hash), `audit_events`.
- Auth: `POST /auth/register` (doim STUDENT, default org; klient yuborgan `role` e'tiborga olinmaydi), `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`.
- Argon2id (m=19 MiB, t=2, p=1). Login'da neytral xato, foydalanuvchi topilmasa ham dummy hash bilan verify qilinadi (vaqt orqali email aniqlanmasligi uchun).
- Sessiya: 32 bayt tasodifiy token, `wd_session` cookie (HttpOnly, SameSite=Lax, prod'da Secure). Muddati 7 kun, 24 soat faolsizlikdan keyin bekor bo'ladi.
- Login rate limit: email+IP bo'yicha 15 daqiqada 5 xato, IP bo'yicha 50.
- Global `AuthGuard` (`@Public()` bo'lmagan hamma route sessiya talab qiladi) va `OrgRoleGuard` (`@OrgRoles(...)`, rol DB'dan olinadi; a'zo bo'lmaganga 404, roli yetmaganga 403).
- `GET /orgs/:orgId/members` faqat TEACHER va ORG_ADMIN uchun (RBAC namunasi).
- Xavfsizlik: helmet header'lari, CORS faqat `WEB_ORIGINS`, holatni o'zgartiruvchi so'rovlarda Origin tekshiruvi (CSRF), `x-powered-by` o'chirilgan. Config xatolarida qiymat emas, faqat o'zgaruvchi nomi chiqariladi.
- `GET /health` va `GET /health/ready` (DB ping).
- Skriptlar: `db:generate`, `db:migrate`, `db:seed` (seed parolni `SEED_PASSWORD` env'dan oladi, repo'da parol yo'q).
- Testlar (Vitest + Supertest + in-memory PGlite): **26/26 o'tdi**. Qamrov: cookie flaglari, Argon2id hash, rolni soxtalashtirish, dublikat email, neytral xato, rate limit 429, logout, muddati o'tgan va faolsiz sessiya, soxta cookie, x-user-id/x-role soxtalashtirish, cross-org 404, student 403, begona Origin 403, config.
- Lint toza, typecheck toza, build ishladi. `dist/main.js` haqiqiy portda ishga tushirilib smoke-test qilindi.
- Cheklov: rate limiter faqat bitta process ichida ishlaydi (bir nechta instance uchun Redis kerak). Ro'yxatdan o'tishda 409 email band ekanini bildiradi (to'liq himoya uchun email tasdiqlash kerak, keyingi bosqichga qoldirildi).

### F1 — Web (apps/web)

- Next.js 16 (Turbopack) + React 19 + Tailwind 4. Interfeys o'zbek tilida, `lang="uz"`.
- Sahifalar: `/` (landing), `/login`, `/register`, `/dashboard` (`/auth/me` orqali foydalanuvchi va tashkilotlar, chiqish tugmasi; 401 bo'lsa `/login` ga yo'naltiradi).
- Brauzer API'ga faqat `/api/*` orqali murojaat qiladi (Next rewrite → `API_URL`). Shuning uchun sessiya cookie'si first-party bo'ladi.
- Accessibility: skip-link, label/`aria-describedby`, `role="alert"` va `role="status"`, `:focus-visible` outline. Dark mode `prefers-color-scheme` orqali.
- Header'lar: `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `x-powered-by` o'chirilgan.
- pnpm `allowBuilds` ga `unrs-resolver` va `sharp` qo'shildi.
- Eslatma: `npx eslint` paket o'rnatilmaganda interaktiv so'rov bilan osilib qoldi. Doim `pnpm exec` ishlatilsin.

### Infratuzilma va CI

- `.env.example` (barcha o'zgaruvchilar, secret qiymatlarsiz), `docker-compose.yml` (Postgres 17 + Redis 7, Docker bor bo'lganda ishlatish uchun).
- `.github/workflows/ci.yml`: install → shared build → format:check → typecheck → lint → test → build → gitleaks.
- `apps/web/next-env.d.ts` Next tomonidan generatsiya qilinadi, shuning uchun `.prettierignore` ga qo'shildi.

### F0+F1 yakuniy tekshiruv

- `pnpm -r typecheck` ✅, `pnpm -r lint` ✅, `pnpm -r test` ✅ (shared 4 + api 26 = **30 test**), `pnpm -r build` ✅, `prettier --check` ✅.
- Smoke: API (`dist/main.js`) va `next start` birga ishga tushirildi. Hamma sahifa 200; proxy orqali register 201 → me 200; begona Origin 403. Dev runner (`@swc-node/register`) ham ishlaydi.
- Secret skan (grep bilan, chunki gitleaks lokal o'rnatilmagan): faqat test fixture parollari topildi, haqiqiy secret yo'q.
- **STATUS: READY_WITH_INFRASTRUCTURE_LIMITATIONS.** Docker, Postgres va Redis lokal muhitda yo'q. Real Postgres'ga qarshi test va Docker build hali tekshirilmagan. Rate limiter in-memory. Brauzer E2E (Playwright) hali yo'q.
- Keyingi qadam: **F2 — kurs tuzilmasi (Course → Module → Lesson), enrollment va serverda tekshiriladigan ketma-ket ochilish.**

### F2 — Kurs tuzilmasi va ketma-ket ochilish (boshlandi)

- Git identity (email) sozlanmagan, shuning uchun F0+F1 hali commit qilinmagan (69 fayl staged).
- Reja: `courses`, `course_teachers`, `modules`, `lessons`, `enrollments`, `lesson_progress` jadvallari; xodimlar uchun CRUD; talaba uchun yozilish, kurs xaritasi (LOCKED/AVAILABLE/IN_PROGRESS/COMPLETED), serverda tekshiriladigan dars ochilishi va tugatish.
- Qoida: dars ochiq bo'ladi, agar u tugatilgan bo'lsa YOKI tartib bo'yicha birinchi tugatilmagan dars bo'lsa. Qolganlari LOCKED.
- TEACHER faqat `course_teachers` da biriktirilgan kurslarni boshqaradi (cross-teacher himoyasi), ORG_ADMIN esa tashkilotdagi hamma kursni.

### F2 — API qismi

- `packages/shared`: `courses.ts` (zod sxemalar, `CourseMap`, `LessonView`, `CourseStructure` tiplari), `progress.ts` (`computeLessonStates`, `progressPercent`) va 6 ta unit test.
- Migratsiya `drizzle/0001_courses.sql`: `courses` (org+slug unique, status enum DRAFT/PUBLISHED/ARCHIVED), `course_teachers` (PK course+user), `modules`, `lessons` (`course_id` denormalizatsiya qilingan, position >= 0 CHECK), `enrollments` (user+course unique), `lesson_progress` (user+lesson unique, status enum).
- `CourseAccessService`: URL'dagi har bir ID org va kursga qayta bog'lanadi (IDOR himoyasi), `canManage` (ORG_ADMIN hammasini, TEACHER faqat biriktirilgan kursni boshqaradi), talabalar uchun `publishedCourse` (draft va archive 404 qaytaradi), kanonik dars tartibi.
- Endpoint'lar (`/orgs/:orgId/courses`): `GET /` (talabaga faqat published, `enrolled` va `progressPercent` bilan; xodimga `canManage` bilan), `POST /`, `PATCH /:courseId`, `GET /:courseId/structure`, `POST /:courseId/modules`, `PATCH /:courseId/modules/:moduleId`, `POST /:courseId/modules/:moduleId/lessons`, `GET /:courseId/lessons/:lessonId/edit`, `PATCH /:courseId/lessons/:lessonId`, `POST /:courseId/enroll`, `GET /:courseId/map`, `GET /:courseId/lessons/:lessonId`, `POST /:courseId/lessons/:lessonId/complete`.
- Yopiq darsga 403 `LESSON_LOCKED` qaytadi va kontent berilmaydi. Yozilmagan foydalanuvchiga 403 `NOT_ENROLLED`. Keyingi darsning ID'si faqat joriy dars tugatilgandan keyin ko'rsatiladi. Noto'g'ri formatdagi UUID'ga 404.
- Audit: `course.create`, `course.status_change`.
- **Topilgan xato va tuzatish:** `complete()` tranzaksiya ichida `orderedLessons()` ni tranzaksiyadan tashqaridagi ulanish orqali chaqirardi. PGlite'da bu deadlock berdi (testlar osilib qoldi), Postgres'da esa so'rov tranzaksiyadan tashqarida bajarilgan bo'lardi. Endi `orderedLessons(courseId, db)` tx handle'ni qabul qiladi. **Qoida: tranzaksiya ichida faqat `tx` ishlatilsin.**
- Vaqtinchalik qoida: hozircha darsni talabaning o'zi "tugatdim" deb belgilaydi. 12A'da bu exercise PASSED sharti bilan almashtiriladi.
- Testlar: `test/courses.test.ts` (25 ta). Qamrov: cross-teacher 403, cross-org 404, ID'ni boshqa org'ga qayta bog'lash 404, boshqa kursning moduli yoki darsi 404, draft talabadan yashirilgan, ro'yxatdan o'tishsiz kirish 403, yopiq dars 403 va kontent oshkor bo'lmaydi, modullar orasida ketma-ketlik, cross-student izolyatsiya, oldinga yangi dars qo'shilganda bajarilgan ishlar qayta yopilmaydi, soxta header'lar, archive yashirinadi. API jami: **51/51**.

### F2 — Web qismi

- `react-markdown` + `remark-gfm` qo'shildi (xom HTML render qilinmaydi). `components/markdown.tsx` va dars tipografiyasi (`.lesson-content`) `globals.css` da.
- `lib/api.ts`: xato javobida `code` maydoni (`LESSON_LOCKED`, `NOT_ENROLLED`) va `send()` yordamchisi. `lib/use-api.ts`: GET hook (loading/error/ready, 401 bo'lsa `/login` ga yo'naltiradi).
- `components/ui.tsx`: `Button`, `ErrorText`, `LoadState`, `ProgressBar` (`role="progressbar"`), `StateBadge` (holat faqat rang bilan emas, matn va ikonka bilan ham ko'rsatiladi).
- Sahifalar:
  - `/dashboard`: har bir tashkilot uchun kurslar ro'yxati. Talabaga progress va "Davom etish", xodimga holat, "Boshqarish" yoki "Sizga biriktirilmagan", hamda "+ Yangi kurs" formasi.
  - `/orgs/[orgId]/courses/[courseId]`: kurs xaritasi (modullar, dars holatlari, progress). Yozilmagan bo'lsa "Kursga yozilish" ko'rsatiladi.
  - `/orgs/[orgId]/courses/[courseId]/lessons/[lessonId]`: dars pleyeri (markdown, oldingi/keyingi, "Darsni tugatdim"). Yopiq dars uchun alohida holat.
  - `/orgs/[orgId]/courses/[courseId]/manage`: tuzilma muharriri (modul va dars qo'shish, e'lon qilish, qoralamaga qaytarish, arxivlash). Dars bo'lmasa e'lon qilish o'chirilgan.
  - `/orgs/[orgId]/courses/[courseId]/manage/lessons/[lessonId]`: dars muharriri (nom, Markdown, ko'rib chiqish, belgilar hisoblagichi).
- `apps/web/vitest.config.mts` va `markdown.test.tsx` (3 ta test): `<script>`, `<img onerror>` va `javascript:` havolalari chiqmasligi tekshiriladi.

### F2 yakuniy tekshiruv

- typecheck ✅, lint ✅, test ✅ (shared 10 + api 51 + web 3 = **64**), build ✅, format ✅.
- Real smoke (seed qilingan o'qituvchi, `next start` + `dist/main.js`, `/api` proxy orqali): kurs yaratish → modul → 2 dars → e'lon qilish → talaba ro'yxatdan o'tadi → kurs ro'yxatda → yozilish (AVAILABLE, LOCKED) → 2-dars 403 LESSON_LOCKED → 1-dars IN_PROGRESS → tugatish (COMPLETED, AVAILABLE, 50%). Barcha yangi sahifalar 200 qaytardi.
- **STATUS: READY_WITH_INFRASTRUCTURE_LIMITATIONS** (F1 dagi infratuzilma cheklovlari saqlanib qolgan).
- Ma'lum cheklovlar: kurs, modul va darsni o'chirish hali yo'q. O'qituvchini kursga biriktirish endpoint'i hali yo'q (hozir faqat kursni yaratgan o'qituvchi biriktiriladi, ORG_ADMIN hammasini boshqaradi). Pozitsiyalarni o'zgartirish faqat API orqali (UI'da drag-and-drop yo'q). Brauzerda klik orqali E2E test (Playwright) hali yo'q, sahifalar faqat HTTP 200 darajasida tekshirildi.
- Keyingi qadam: **12A — Exercises** (dars mashqlari, boshlang'ich fayllar, NOT_STARTED/IN_PROGRESS/PASSED/NEEDS_IMPROVEMENT progress; darsni tugatish exercise PASSED shartiga o'tkaziladi).

### 12A — Exercises (boshlandi)

- Git email hali sozlanmagan, F0–F2 commit qilinmagan (89 fayl staged).
- Reja:
  - `exercises` jadvali: dars, nom, tavsif, ko'rsatma, boshlang'ich fayllar, kutilgan natija, qiyinlik, tartib, faollik.
  - `student_exercises` jadvali: talabaning o'z workspace fayllari va statusi (NOT_STARTED/IN_PROGRESS/PASSED/NEEDS_IMPROVEMENT).
- Qaror: CHECK engine (12C) hali yo'q, shuning uchun statusni hozircha o'qituvchi qo'lda belgilaydi (audit bilan). 12C da shu servis metodi (`setStatus`) CHECK natijasidan chaqiriladi.
- Qaror: darsda faol mashq bo'lsa, "Darsni tugatdim" ishlamaydi (409 `EXERCISES_REQUIRED`). Dars barcha faol mashqlar PASSED bo'lganda avtomatik tugatiladi.
- Qaror: fayl yo'llari qat'iy validatsiya qilinadi (faqat `.html/.css/.js`, `..` yo'q, 20 tagacha fayl, har biri 100 KB, jami 500 KB). JSON body limiti 1 MB ga oshiriladi.

### 12A — API qismi

- `packages/shared/src/exercises.ts`:
  - `projectFilesSchema`: yo'l regex'i (`..`, absolyut yo'l va backslash yo'q, faqat html/css/js, 5 darajagacha papka), registrga qaramay dublikat yo'q, 20 fayl, 100 KB/fayl, jami 500 KB.
  - Exercise CRUD sxemalari, `saveWorkspaceSchema`, `setExerciseStatusSchema` (faqat PASSED va NEEDS_IMPROVEMENT).
  - Tiplar: `ExerciseView` (talabaga, `starterFiles` yo'q), `ExerciseAdmin`, `ExerciseStudentProgress`.
  - 4 ta yangi test (path traversal va limitlar). `LessonView.exercises` qo'shildi.
- Migratsiya `drizzle/0002_exercises.sql`: `exercises` (lesson va course FK, `starter_files` jsonb, difficulty enum, `is_active`, position CHECK) va `student_exercises` (user+exercise unique, status enum, `files` jsonb, `teacher_note`, `passed_at`).
- `ExercisesService` (`src/exercises/`):
  - Xodim: create, listForLesson, getForEdit, update, studentProgress (fayl va email qaytarmaydi), setStatusByTeacher (talaba shu kursga yozilgan bo'lishi shart, audit `exercise.status_set`).
  - `applyStatus()`: statusni o'zgartirishning yagona kirish nuqtasi. 12C'da CHECK ham shuni chaqiradi.
  - Talaba: view (workspace starter fayllardan yaratiladi), saveWorkspace (NOT_STARTED → IN_PROGRESS), resetWorkspace.
  - Kirish sharti: kurs e'lon qilingan, talaba yozilgan, mashq faol va darsi yopiq emas.
- `LearningService`:
  - `lesson()` endi mashqlar ro'yxatini qaytaradi.
  - `complete()` mashqlar PASSED bo'lmasa 409 `EXERCISES_REQUIRED` qaytaradi.
  - Yangi `completeIfExercisesPassed()`: oxirgi mashq PASSED bo'lganda darsni avtomatik tugatadi, lekin dars LOCKED bo'lsa tugatmaydi.
- Endpoint'lar (`/orgs/:orgId/courses/:courseId`): `POST|GET lessons/:lessonId/exercises`, `GET exercises/:id/edit`, `PATCH exercises/:id`, `GET exercises/:id/students`, `PUT exercises/:id/students/:studentId/status`, `GET exercises/:id`, `PUT exercises/:id/workspace`, `POST exercises/:id/workspace/reset`.
- `common/params.ts`: umumiy `Id` (UUID → 404) pipe. JSON body limiti 1 MB (`bodyParser: false` + `useBodyParser`).
- Testlar: `test/exercises.test.ts` (23 ta). Qamrov:
  - xavfsiz bo'lmagan starter yo'llari 400, student/begona o'qituvchi 403, boshqa org 404, boshqa kursning darsi 404, draft kurs 404;
  - yopiq darsdagi mashq 403, saqlash va validatsiya, 1.2 MB body 413, cross-student workspace izolyatsiyasi, reset;
  - 409 `EXERCISES_REQUIRED`; status faqat xodim tomonidan, yozilmagan talabaga 404, NEEDS_IMPROVEMENT va izoh;
  - progress ro'yxatida fayl va email yo'q, oxirgi PASSED darsni tugatadi va keyingisini ochadi, yopiq darsdagi PASSED darsni tugatmaydi;
  - faolsizlantirilgan mashq yashirinadi va talab qilinmaydi; soxta `x-user-id`.
- API jami: **74/74**.

### 12A — Web qismi

- `components/files-editor.tsx`: tab'li ko'p faylli muharrir (ARIA tablist/tabpanel). Muallif uchun fayl qo'shish va o'chirish, yo'l mijoz tomonida ham `PROJECT_PATH_RE` bilan tekshiriladi. 12B'da Monaco va preview bilan almashtiriladi.
- `components/ui.tsx`: `ExerciseStatusBadge` (ikonka + matn) va `DIFFICULTY_LABEL`.
- `lib/api.ts`: `send()` endi `PUT` ni ham qo'llaydi.
- Dars pleyeri mashqlar ro'yxatini status bilan ko'rsatadi. Mashqlar o'tilmagan bo'lsa, "Darsni tugatdim" o'rniga izoh chiqadi.
- Yangi sahifalar:
  - `/orgs/[orgId]/courses/[courseId]/exercises/[exerciseId]`: talaba workspace'i. Topshiriq, kutilgan natija, o'qituvchi izohi, fayllar, saqlash, boshlang'ich kodga qaytarish (tasdiq bilan).
  - `/orgs/[orgId]/courses/[courseId]/manage/exercises/[exerciseId]`: mashq muharriri (barcha maydonlar va boshlang'ich fayllar) va talabalar natijalari jadvali ("O'tdi" yoki "Tuzatish kerak" + izoh).
- Dars muharririga `ExercisesPanel` qo'shildi (mashqlar ro'yxati va yangi mashq yaratish).

### 12A yakuniy tekshiruv

- typecheck ✅, lint ✅, test ✅ (shared 14 + api 74 + web 3 = **91**), build ✅, format ✅, secret skan (grep) ✅.
- Real smoke (scratchpad'dagi `smoke-12a.mjs`, `/api` proxy orqali) 14/14:
  - o'qituvchi mashq yaratadi → talaba darsda NOT_STARTED ko'radi → qo'lda tugatish 409;
  - workspace starter fayllardan boshlanadi → saqlash IN_PROGRESS → `../x.html` 400;
  - o'qituvchi PASSED qo'yadi → dars avtomatik COMPLETED, keyingi dars AVAILABLE;
  - 4 ta yangi sahifa 200.
- **STATUS: READY_WITH_INFRASTRUCTURE_LIMITATIONS.**
- Ma'lum cheklovlar:
  - PASSED hozircha faqat o'qituvchi orqali qo'yiladi (12C CHECK `applyStatus()` ga ulanadi).
  - Talaba hozircha faqat mavjud fayllarni tahrirlay oladi (fayl yaratish, o'chirish va nomini o'zgartirish 12B IDE'da).
  - PASSED'dan keyin tahrir qilinsa status o'zgarmaydi (12C qayta tekshiradi).
  - Mashqni o'chirish yo'q (faolsizlantirish bor).
  - Brauzerda bosib tekshiradigan Playwright E2E hali yo'q.
- Keyingi qadam: **12B — Web IDE / Playground** (Monaco, fayl daraxti, preview, console, RUN, alohida origin'li sandbox).

### Lokal demo ishga tushirildi (dizaynni ko'rish uchun)

- API: `DATABASE_URL=pglite://./.data/pg node dist/main.js` (port 4000), web: `next dev -p 3000`.
- Seed: `SEED_PASSWORD=<lokal parol> node dist/db/seed.js` (teacher@ va admin@webdizayn.local).
- Demo kontent API orqali yuklandi (scratchpad'dagi `demo-content.mjs`):
  - "HTML asoslari" kursi (e'lon qilingan): 2 modul, 4 dars, 3 mashq;
  - "CSS bilan bezash" kursi (qoralama);
  - talaba `talaba@webdizayn.local` (Aziza Karimova): 1-dars tugatilgan, 1-mashq "Tuzatish kerak" izohi bilan.
- Demo akkauntlar paroli faqat lokal `.data/pg` uchun. U repoga yozilmaydi (lokal Claude xotirasida saqlangan).

### Dizayn yangilanishi: Loms uslubi (boshlandi)

- Foydalanuvchi talabi: https://loms-moodle.envytheme.com/ ga o'xshash dizayn.
- Referens tahlili (HTML yuklab olinib ko'rildi):
  - ko'k top-bar (`#0071DC`), oq navbar (logo, qidiruv, havolalar, Kirish);
  - katta hero (sarlavha, CTA, illyustratsiya, dekorativ shakllar);
  - kurs kartalari (rasm, badge, muallif), ikonali kategoriyalar to'ri, 4 ustunli "sifatlar";
  - och ko'k bo'limlar (`#F5FAFF`), "Join students" CTA bandi, ko'p ustunli footer, sariq aksent (`#FEC400`).
- Qaror: faqat uslub, ya'ni ranglar, layout va komponent shakllari olinadi. EnvyTheme'ning rasmlari, logotipi va matnlari ko'chirilmaydi (pullik tema). Kontent o'zbekcha va o'zimizniki, soxta statistika ("5M+ talaba") ishlatilmaydi. Illyustratsiyalar CSS/SVG bilan chiziladi. Dark mode saqlanadi.

### Dizayn yangilanishi: Loms uslubi (yakunlandi)

- Route group'lar: `app/(app)/` (dashboard, orgs/...) va `app/(auth)/` (login, register). URL'lar o'zgarmadi.
  - `(app)/layout.tsx`: och ko'k fon va konteyner.
  - `(auth)/layout.tsx`: split karta (chapda ko'k brend paneli, o'ngda forma).
- `globals.css`:
  - `@theme` tokenlari: `brand-50..950` (asosiy `#0071DC`), `accent-300..500` (`#FEC400`), `surface` (`#F5FAFF`), `ink` (`#0E1133`), `shadow-card`;
  - komponent klasslari: `.container-page`, `.btn` + `.btn-primary/.btn-accent/.btn-outline`, `.card`, `.card-hover`, `.section-eyebrow`, `.field`, `.dots-pattern`; `prefers-reduced-motion` qo'llab-quvvatlanadi;
  - dars tipografiyasi yangilandi (kod, jadval, blockquote).
  - **Muhim:** h1–h4 base uslublari `@layer base` ichida bo'lishi shart, aks holda layer'siz CSS utility'larni (masalan `text-white`) bosib ketadi.
- Shriftlar: `next/font/google` orqali Inter (matn) va Jost (sarlavhalar).
- Barcha `indigo-*` klasslari `brand-*` ga almashtirildi.
- Yangi komponentlar:
  - `logo.tsx`;
  - `site-header.tsx`: ko'k top-bar, sticky navbar, mobil menyu; sessiya bo'lsa "Shaxsiy kabinet", bo'lmasa "Kirish" va "Ro'yxatdan o'tish". Sessiya borligi faqat UI uchun, server tomonda `cookies()` orqali olinadi;
  - `site-footer.tsx`;
  - `icons.tsx`: inline SVG ikonkalar to'plami;
  - `ui.tsx`: `PageHeader` (breadcrumb'li ko'k banner), yangi `Button` variantlari, spinner'li `LoadState`, gradient `ProgressBar`.
- Sahifalar:
  - landing: hero (CSS'da chizilgan kod muharriri mockup'i), "4 qadam", yo'nalishlar to'ri (8 ta), afzalliklar, CTA bandi;
  - dashboard: banner va kurs kartalari (rasm o'rnida nomdan barqaror gradient va bosh harflar);
  - kurs xaritasi: modul kartalari, holat doirachalari, sticky progress paneli;
  - dars, mashq va muharrir sahifalari karta ichiga olindi.
- Login'dan keyin header yangilanishi uchun `router.refresh()` qo'shildi.
- Vizual tekshiruv: headless Chrome + DevTools protocol orqali skrinshotlar olindi (scratchpad'dagi `shots.mjs`): landing, login, dashboard, kurs xaritasi, dars, mashq, mobil (390px) va dark mode. Topilgan va tuzatilgan muammolar: ko'k fondagi sarlavhalar qora chiqardi (layer muammosi), JS ikonkasi kvadrat chiqardi, yarim shaffof sariq doiralar ko'k ustida loyqa ko'rindi, dekor halqa tugma ustiga tushdi.
- Tekshiruv: typecheck ✅, lint ✅, web test 3/3 ✅, build ✅, format ✅.
- Eslatma: Git Bash `/` bilan boshlanadigan argumentlarni Windows yo'liga aylantiradi. Skriptga URL yo'l uzatganda `MSYS_NO_PATHCONV=1` ishlatilsin. Dev server ishlab turganda fayl ko'chirib bo'lmaydi (Windows lock), avval serverni to'xtatish kerak.

### 12B — Web IDE / Playground (boshlandi)

- Foydalanuvchi so'rovi: bundan buyon javoblar o'zbek tilida (kod kommentlari inglizcha qoladi).
- Sandbox arxitekturasi:
  1. **Alohida origin va alohida site.** `apps/sandbox`, kichik Node HTTP server. Lokalda `http://127.0.0.1:3100` (web esa `localhost:3000`, ya'ni boshqa site). Production'da alohida ro'yxatdan o'tgan domen kerak (masalan `webdizayn-usercontent.uz`), `sandbox.webdizayn.uz` emas. Sabab: Chrome site isolation faqat boshqa site'ni alohida processga ajratadi, shunda cheksiz sikl asosiy tabni muzlatmaydi.
  2. **Ikki qavatli iframe.** Web sahifa → `<iframe sandbox="allow-scripts">` runner (opaque origin) → runner ichida `srcdoc` preview iframe (`sandbox="allow-scripts"`, opaque origin). `allow-same-origin`, `allow-top-navigation`, `allow-forms`, `allow-popups` yo'q.
  3. **CSP** (runner header'i, srcdoc unga meros oladi): `default-src 'none'`, `connect-src 'none'` (fetch/XHR/WebSocket yo'q), `img-src data: blob:`, `form-action 'none'`, `frame-ancestors` faqat web origin'lar. Shuningdek `Permissions-Policy` (kamera, mikrofon va boshqalar o'chiq) va `Referrer-Policy: no-referrer`.
  4. **postMessage.** Xabar faqat kutilgan `event.source` dan qabul qilinadi. Sxema qat'iy tekshiriladi (tip, `runId`, fayllar, o'lcham). Konsol xabarlari kesiladi (2000 belgi) va soni cheklanadi (200 ta/run).
  5. **Watchdog.** RUN'dan keyin 3 soniyada `loaded` kelmasa, iframe butunlay qayta yaratiladi va TIMEOUT ko'rsatiladi.
  6. **Fayllarni yig'ish sandbox ichida bo'ladi.** Web sahifa faqat fayllar ro'yxatini yuboradi, talaba HTML'i hech qachon web origin'da render qilinmaydi.
- RUN rasmiy baho emas (rasmiy tekshiruv 12C CHECK'da). Monaco lokal hostlanadi (`public/monaco`, CDN'siz).

### 12B — natija

- **`apps/sandbox`** (yangi paket, bog'liqliksiz Node HTTP server, ESM, `// @ts-check` bilan JS):
  - `public/protocol.js`: `parseRunMessage` (`runId` regex, 20 fayl, yo'l regex'i, 100 KB/500 KB, registrga qaramay dublikat yo'q) va `parsePreviewMessage` (level oq ro'yxati, matn 2000 belgigacha kesiladi);
  - `public/build.js`: `buildDocument()` — `<link rel=stylesheet>` va `<script src>` larni virtual fayllardan inline qiladi (`./`, `/`, nisbiy yo'llar), `</script>` va `</style>` ni escape qiladi, bridge skriptini `<head>` boshiga qo'yadi. Bridge `console.*`, `error`, `unhandledrejection` va `load` ni yuboradi, `alert/confirm/prompt` ni konsolga yo'naltiradi, havolalarga bosishni bloklaydi;
  - `public/runner.js`: faqat `window.parent` dan va ruxsat etilgan origin'dan RUN qabul qiladi, har RUN'da yangi `srcdoc` iframe yaratadi (`sandbox="allow-scripts"`), preview xabarlarini faqat joriy iframe'dan va joriy `runId` uchun qabul qiladi, ularni sanaydi (200 ta) va web'ga uzatadi;
  - `src/server.js`: faqat 4 ta fayl oq ro'yxatda, qolgani 404 (traversal yo'q), faqat GET/HEAD. CSP: `default-src 'none'`, `connect-src 'none'`, `img-src data: blob:`, `form-action 'none'`, `worker-src 'none'`, `frame-ancestors <web>`, `unsafe-eval` yo'q. Shuningdek `Permissions-Policy`, `Referrer-Policy: no-referrer`, `nosniff`, `no-store`. JS fayllarga `Access-Control-Allow-Origin: *`, chunki runner opaque origin'da va module skriptlar CORS orqali yuklanadi;
  - `SANDBOX_PARENT_ORIGINS` qat'iy validatsiya qilinadi (CSP injection yo'q);
  - testlar 15 ta (protocol, build, server header'lari va traversal).
- **Web IDE** (`apps/web/src/components/ide/`):
  - `code-editor.tsx`: Monaco `/monaco/vs` dan lokal yuklanadi (CDN yo'q), `scripts/copy-monaco.mjs` `predev`/`prebuild` da ishlaydi, `public/monaco` git'ga kirmaydi. Har fayl uchun alohida model, Ctrl+Enter = RUN;
  - `file-tree.tsx`: fayl yaratish, nomini o'zgartirish va o'chirish (oxirgi fayl o'chmaydi), yo'l `PROJECT_PATH_RE` bilan tekshiriladi;
  - `use-runner.ts`: `ready` handshake, faqat runner iframe'ning `contentWindow` idan xabar, `runId` mosligi, 3 soniyalik watchdog (iframe qayta yaratiladi), konsolda 200 qatorgacha;
  - `playground.tsx`: toolbar (RUN, holat, qo'shimcha tugmalar), fayllar | Monaco | preview + konsol. Konsol matni React matni sifatida chiqadi (HTML emas).
- `lib/sandbox.ts`: `NEXT_PUBLIC_SANDBOX_URL` va `parseRunnerMessage` (3 ta test).
- Sahifalar: mashq sahifasida IDE (Saqlash/Saqlangan, Boshlang'ich kod), o'qituvchining mashq muharririda boshlang'ich fayllar ham IDE'da, yangi ochiq `/playground` (localStorage'da saqlanadi) va navbar'da havola. Eski `files-editor.tsx` o'chirildi. `app/icon.svg` favicon qo'shildi.
- `.env.example` ga sandbox o'zgaruvchilari, root'ga `pnpm dev:sandbox` qo'shildi.
- **Brauzerda xavfsizlik E2E**: `apps/sandbox/e2e/security.e2e.mjs` (headless Chrome + CDP, `pnpm --filter @webdizayn/sandbox e2e`). Natija **16/16**:
  - parent va top DOM, cookie, localStorage, popup, API'ga fetch, credentials bilan fetch va masofaviy rasm bloklangan;
  - boshqa `runId` bilan soxta xabar tashlab yuboriladi, top navigatsiya yo'q, web cookie'lari daxlsiz;
  - `while(true){}` paytida web sahifa javob beradi, watchdog TIMEOUT ko'rsatadi va keyingi RUN ishlaydi.
- Topilgan va tuzatilgan muammolar:
  - `<script  defer>` qo'sh bo'sh joy;
  - JSDoc type-guard;
  - runner'dagi scrollbar;
  - favicon 404;
  - fayl daraxtida nom qisqarishi;
  - vaqtinchalik hydration xatosi (eskirgan dev bundle, qayta tekshiruvda 0 ta).
- Regressiya: typecheck ✅, lint ✅, test ✅ (sandbox 15 + shared 14 + web 6 + api 74 = **109**), build ✅, format ✅.
- **STATUS: READY_WITH_INFRASTRUCTURE_LIMITATIONS.**
- Ochiq savollar va cheklovlar:
  - WebSocket CSP bloki alohida isbotlanmadi (`connect-src 'none'` bor, lekin testda ws server yo'q edi).
  - Watchdog faqat yuklanish vaqtini kuzatadi. Yuklangandan keyingi og'ir sikl (masalan, click handler'da) faqat site isolation'ga tayanadi.
  - Cheksiz sikl himoyasi alohida site'ga bog'liq. Production'da sandbox **alohida registrable domen**da bo'lishi shart.
  - Masofaviy rasm va shriftlar ataylab bloklangan (keyin data-URL yoki o'zimizning asset proxy kerak bo'lishi mumkin).
  - `eval` yo'q. Monaco worker'lari web origin'da ishlaydi.
  - Mobil uchun IDE ustunlari bitta ustunga tushadi (to'liq mobil UX keyinroq).
- Keyingi qadam: **12C — CHECK engine** (Playwright, serverda rasmiy tekshiruv, yashirin qoidalar, PASSED/FAILED/ERROR/TIMEOUT, `applyStatus()` ga ulanadi).

## 2026-10-09

### 12C — CHECK engine

- Tozalash: tasodifan yaratilgan bo'sh `apps/api/=` fayli olib tashlandi.
- **`packages/shared/src/checks.ts`**: qoida sxemasi (`checkRuleSchema`, `checkRulesSchema`, 30 tagacha, id unique).
  - Assertion'lar: `count` (min/max, `max: 0` = yo'qligi), `text` (contains/equals, registr), `attribute`, `style` (computed style), `noConsoleErrors`.
  - Har qoidada: `viewport` (responsive), `actions` (click/hover/fill/press/wait, 10 tagacha), `hidden`, `title`, `hint`.
  - Tiplar: `CheckEngineResult` (faqat xodim), `CheckRunView` (talabaga xavfsiz), `CheckPreviewResult`. Statuslar: PASSED/FAILED/ERROR/TIMEOUT (+ QUEUED/RUNNING). Xato kodlari: NO_ENTRY, LOAD_TIMEOUT, BUDGET, PAGE_CRASHED, ENGINE.
  - `exercises.ts`: `checks` maydoni, `previewChecksSchema`, `ExerciseView.checkAvailable` (qoidalarning o'zi emas).
- **`packages/check-engine`** (yangi paket, `playwright-core` 1.64, o'rnatilgan Google Chrome; `CHROME_PATH` bilan almashtirsa bo'ladi):
  - `engine.ts`: har qoida uchun yangi browser context va sahifa. Loyiha `http://check.invalid` dan route interception orqali beriladi, **boshqa hamma so'rov abort** qilinadi. Qo'shimcha himoya: `--host-resolver-rules=MAP * ~NOTFOUND`, o'lik proxy, CSP (`connect-src 'none'`), WebSocket yopiladi, service worker bloklangan, dialog/popup yopiladi, `--max-old-space-size=128`, `chromiumSandbox: true`.
  - Timeout'lar: run 20 s, yuklanish 5 s, har qadam 2 s. Qadam muvaffaqiyatsiz bo'lsa, sahifa javob berishi tekshiriladi: element yo'q bo'lsa FAILED, sahifa osilib qolsa TIMEOUT. Brauzer ishga tushmasa ERROR (hech qachon soxta PASS emas).
  - `style`: kutilgan qiymat brauzerning o'zida probe element orqali normalizatsiya qilinadi (`red` → `rgb(255, 0, 0)`).
  - `worker.ts` + `isolated.ts`: alohida Node process (stdin/stdout JSON), **env allowlist** (DATABASE_URL va secret'lar o'tmaydi), o'z watchdog'i va parent tomonidan SIGKILL. Natija qayta validatsiya qilinadi: PASSED faqat hamma qoida o'tganda qabul qilinadi.
  - Testlar 12 ta (haqiqiy Chrome): barcha assertion turlari, responsive, click/fill/press, FAILED tafsilotlari, JS xatosi, index.html yo'qligi, yuklanishdagi va click handler'dagi cheksiz sikl, tarmoq bloki (fetch, WebSocket, tashqi rasm), brauzer topilmasa ERROR, qattiq kill'dan keyin yetim Chrome qolmasligi, env filtrlash.
- **API** (`src/checks/`):
  - Migratsiya `0003_checks.sql`: `exercises.checks` (jsonb, default `[]`) va `check_runs` (fayllar va qoidalar snapshot'i, natijalar, vaqtlar). Run immutable dalil sifatida saqlanadi.
  - `CheckExecutor` interfeysi: `ProcessCheckExecutor` (default) va `DisabledCheckExecutor` (`CHECK_ENGINE=disabled`, doim ERROR). Testlarda fake executor DI orqali beriladi.
  - `CheckQueue`: process ichidagi FIFO, `CHECK_CONCURRENCY` (default 2). Shutdown'da ishlayotgan joblar tugashi kutiladi.
  - `ChecksService`:
    - `start`: faqat **serverdagi saqlangan workspace** tekshiriladi (so'rov body'sidagi fayllar e'tiborga olinmaydi). `FOR UPDATE` bilan bitta mashq uchun bitta faol run (409 `CHECK_IN_PROGRESS`), 10 daqiqada `CHECK_RATE_LIMIT` ta (default 20, 429 `CHECK_RATE_LIMITED`), qoida yo'q bo'lsa 409 `CHECK_NOT_CONFIGURED`.
    - Natija: PASSED → `applyStatus(PASSED)` (darsni avtomatik tugatadi, audit `exercise.status_set`, actor null, `source: 'check'`). FAILED → NEEDS_IMPROVEMENT, lekin PASSED'ni hech qachon pasaytirmaydi. ERROR/TIMEOUT statusni o'zgartirmaydi.
    - `applyStatus` endi `teacherNote: undefined` bo'lsa o'qituvchi izohini saqlab qoladi.
    - Restart'da QUEUED/RUNNING qolgan run'lar ERROR/ENGINE bilan yopiladi.
    - `toView`: talabaga faqat ko'rinadigan qoidalar nomi, natijasi, maslahati (faqat FAILED'da) va yashirin qoidalar soni. Selector, kutilgan qiymat, qoida id'si va yashirin nomlar yuborilmaydi.
  - Endpoint'lar (`/orgs/:orgId/courses/:courseId/exercises/:exerciseId`): `POST checks` (202), `GET checks/latest`, `GET checks/:runId` (faqat egasi), `POST checks/preview` (xodim; saqlanmagan qoidalar + namuna yechim, to'liq natija, DB'ga yozilmaydi).
  - Config: `CHECK_ENGINE`, `CHECK_CHROME_PATH`, `CHECK_CHROMIUM_SANDBOX`, `CHECK_CONCURRENCY`, `CHECK_BUDGET_MS`, `CHECK_RATE_LIMIT` (`.env.example` ga qo'shildi).
  - Testlar `test/checks.test.ts` (20 ta): qoidalar validatsiyasi va RBAC, talabaga qoidalar chiqmasligi (view, lesson, run), FAILED/PASSED/ERROR/TIMEOUT/throw, saqlangan fayl tekshirilishi, PASSED → dars tugaydi + audit, PASSED pasaymaydi, o'qituvchi izohi saqlanadi, parallel so'rovlarda bitta run, run'lar faqat egasiga ochiq, yozilmagan/yopiq dars/faolsiz/boshqa org, rate limit, restart'dan keyin tiklanish, preview RBAC.
- **Web**:
  - `components/check-result.tsx`: `useCheckRun` (oxirgi run, start, 1 s polling) va `CheckResultPanel` (`aria-live`, ikonka + matn, xato kodlari uchun tushunarli matn).
  - Mashq sahifasi: "Tekshirish" tugmasi (faqat `checkAvailable` bo'lsa). Saqlanmagan o'zgarish bo'lsa avval saqlaydi, natijadan keyin status yangilanadi.
  - `components/checks-editor.tsx`: JSON muharrir, jonli validatsiya (`lib/check-rules.ts`), qoidalarning o'qiladigan ro'yxati, namuna qoidalar, qoida turlari ma'lumotnomasi, **namuna yechim** IDE'si va "Sinab ko'rish".
  - `Playground` ga `namespace` prop qo'shildi (bitta sahifada ikkita IDE bo'lsa Monaco modellari to'qnashmasin).
  - Vitest'ga `@` alias qo'shildi. 5 ta yangi test (`check-rules.test.ts`, `check-result.test.tsx`).
- CI: `check-engine` build qadami va Chrome versiyasi tekshiruvi qo'shildi.
- Regressiya: typecheck ✅, lint ✅, test ✅ (shared 18 + sandbox 15 + web 11 + check-engine 12 + api 94 = **150**), build ✅, format ✅, secret skan (grep) ✅.
- Real smoke (scratchpad'dagi `smoke-12c.mjs`, `/api` proxy, haqiqiy Chrome) **18/18**:
  - o'qituvchi demo "Birinchi sahifam" mashqiga 6 ta qoida qo'ydi (2 tasi yashirin);
  - preview'da namuna yechim PASSED (~3 s), boshlang'ich fayllar FAILED;
  - yangi talaba: qisman sahifa FAILED 3/6 + maslahatlar, yashirin qoidalar sizib chiqmaydi;
  - cheksiz sikl TIMEOUT (~6 s), status o'zgarmadi; to'liq yechim PASSED → mashq PASSED;
  - smoke talabalari keyin demo bazadan o'chirildi.
- Brauzerda bosib tekshirildi (Playwright, `ui-12c.cjs`): talaba "Tekshirish" → natija paneli, o'qituvchi "Sinab ko'rish", noto'g'ri JSON xabari, mobil + dark. Konsol xatolari 0.
- Demo: "Birinchi sahifam" mashqida endi CHECK qoidalari bor. Aziza'ning tekshiruvi FAILED (3/6), statusi "Tuzatish kerak" ligicha qoldi.
- **STATUS: READY_WITH_INFRASTRUCTURE_LIMITATIONS.**
- Cheklovlar:
  - Navbat process ichida va bitta instance uchun (Redis/BullMQ yo'q). Restart'dagi tiklash ham bitta instance deb hisoblaydi.
  - CHECK API host'ida child process sifatida ishlaydi. Production'da alohida worker konteyner (non-root, resurs limitlari, read-only FS, gVisor) kerak — 14B fazasida.
  - CPU/xotira limitlari faqat V8 heap darajasida (`--max-old-space-size`). OS darajasidagi cgroup limitlari yo'q.
  - Talaba JS'i sahifa ichida ishlaydi, shuning uchun nazariy jihatdan DOM API'larni almashtirib (masalan `getComputedStyle`) tekshiruvni aldashi mumkin. Isolated world ishlatilmaydi.
  - CI'da (ubuntu) Chrome renderer sandbox amalda tekshirilmagan: lokal faqat Windows'da ishga tushirildi, git remote yo'q.
  - O'qituvchining talabalar jadvalida oxirgi CHECK natijasi hali ko'rsatilmaydi (12E teacher review'da).
  - Qoidalar muharriri JSON ko'rinishida (vizual konstruktor yo'q).
- Keyingi qadam: **12D — Assignments** (DRAFT → PUBLISHED → CLOSED, immutable submission versiyalari).

### 12D — Assignments

- Chegara: 12D topshiriqni yaratish, boshqarish va talabaning topshirishini qamraydi. IN_REVIEW / REVISION_REQUESTED / GRADED / FINALIZED o'tishlari 12E (teacher review) ga qoldirildi, lekin enum va ularga bog'liq qoidalar hozirdan ishlaydi.
- **`packages/shared/src/assignments.ts`**:
  - `ASSIGNMENT_STATUSES` (DRAFT/PUBLISHED/CLOSED), `SUBMISSION_STATUSES` (DRAFT → SUBMITTED → IN_REVIEW → REVISION_REQUESTED → GRADED → FINALIZED), `SUBMITTABLE_STATUSES` (DRAFT, SUBMITTED, REVISION_REQUESTED).
  - Sxemalar: rubrika (20 mezongacha, id unique), `gradingPolicy` (maxScore, passingScore ≤ maxScore, allowLate), talablar (30 tagacha), muddat (ISO, offset bilan), urinishlar 1–20, ixtiyoriy CHECK qoidalari. Rubrika bo'lsa, ballar yig'indisi maxScore'ga teng bo'lishi shart.
  - Tiplar: `AssignmentAdmin`, `AssignmentView` (talabaga, CHECK qoidalarisiz), `AssignmentSummary` (`LessonView.assignments`), `SubmissionVersionSummary`, `SubmissionVersionView`, `AssignmentSubmissionRow`, `SubmitBlocker`.
  - 3 ta yangi test.
- Migratsiya `0004_assignments.sql`: `assignments`, `submissions` (talaba+topshiriq unique, o'zgaruvchan qoralama), `submission_versions` (talaba+versiya unique, version >= 1) va `submission_checks`.
  - **DB trigger** `submission_versions_no_update`: versiya qatorini UPDATE qilish taqiqlangan. CHECK natijasi shuning uchun alohida jadvalda saqlanadi.
- **API** (`src/assignments/`):
  - Xodim: yaratish (doim DRAFT), ro'yxat, tahrir, `publish` (faqat DRAFT'dan, ko'rsatma bo'sh bo'lmasa), `close` (faqat PUBLISHED'dan). O'tishlar guarded update orqali, faqat oldinga, audit `assignment.publish/close`. Javoblar jadvali fayl va emailsiz. CHECK preview.
  - Kamida bitta talaba topshirgandan keyin rubrika va baholash siyosati qulflanadi (409 `GRADING_LOCKED`). Muddat, urinishlar va ko'rsatmani o'zgartirish mumkin.
  - Talaba: ko'rish (qoralama boshlang'ich fayllardan yaratiladi), qoralamani saqlash, `submit`, o'z versiyasini ko'rish. Kirish sharti: kurs e'lon qilingan, talaba yozilgan, topshiriq DRAFT emas, dars yopiq emas.
  - `submit`: serverdagi qoralamadan yangi immutable versiya yaratadi. `FOR UPDATE` bilan serializatsiya qilinadi. `submitState()` tartibi: ASSIGNMENT_CLOSED → SUBMISSION_LOCKED → ATTEMPTS_EXHAUSTED → DEADLINE_PASSED.
    - Muddat o'tgan bo'lsa: `allowLate` bo'lsa kechikkan deb belgilanadi, aks holda 409.
    - REVISION_REQUESTED holatida asl muddat qo'llanmaydi.
    - Oldingi versiya bilan bir xil bo'lsa 409 `NO_CHANGES` (urinish sarflanmaydi).
    - Audit `submission.submit`.
  - Topshiriqda CHECK qoidalari bo'lsa, har versiya navbat orqali tekshiriladi (`runSafely`). Natija talabaga xavfsiz ko'rinishda chiqadi, statusni o'zgartirmaydi (baho emas). Restart'da tugallanmagan tekshiruvlar ERROR qilib yopiladi.
  - Refaktor: `runSafely` `check-executor.ts` ga, `ChecksService.previewRules` umumiy qilindi, `toView` endi `StoredCheck` tipini qabul qiladi.
  - `LessonView.assignments`: talabaga faqat PUBLISHED va CLOSED topshiriqlar, o'z holati bilan. Topshiriq darsning ketma-ket ochilishiga ta'sir qilmaydi.
  - Testlar `test/assignments.test.ts` (22 ta):
    - `submitState` unit testlari, yaratish va rubrika validatsiyasi, RBAC (talaba, begona o'qituvchi, boshqa org);
    - DRAFT yashirilishi, publish/close qoidalari va audit;
    - yozilmagan talaba va yopiq dars, versiya 1/2 va eski versiya o'zgarmasligi, DB trigger UPDATE'ni rad etishi;
    - urinishlar limiti, maxfiylik, parallel submit'da bitta versiya, grading lock, xodim jadvalida fayl va email yo'qligi;
    - muddat (rad etish va kechikkan), REVISION_REQUESTED muddatdan ozod, IN_REVIEW qulfi, CLOSED holati;
    - versiyadagi CHECK (yashirin qoidalar sizmaydi, status o'zgarmaydi), preview RBAC, restart tiklanishi.
- **Web**:
  - `AssignmentsPanel` dars muharririda.
  - O'qituvchining topshiriq muharriri (`/manage/assignments/[id]`): holat paneli (tasdiq bilan e'lon qilish va yopish), ko'rsatma, talablar, `datetime-local` muddat, urinishlar, baholash siyosati, rubrika muharriri (jami ball nazorati), boshlang'ich loyiha IDE'si, CHECK muharriri (`purpose="assignment"`), javoblar jadvali. Javob topshirilgandan keyin baholash bo'limi qulflanadi.
  - Talaba sahifasi (`/assignments/[id]`): muddat, urinishlar, baholash, ko'rsatma, talablar, rubrika; qoralama IDE'si; "Topshirish" (urinish raqami va kechikish haqida tasdiq so'raladi); blokerlar matni; versiyalar ro'yxati (sana, kechikkan belgisi, CHECK natijasi avtomatik polling bilan, faqat o'qish uchun kod).
  - Dars sahifasida "Topshiriqlar" bo'limi.
  - `Playground` va `FileTree` ga `readOnly` qo'shildi, `ChecksEditor` endi `previewUrl` va `purpose` qabul qiladi, `CheckResultPanel` sarlavha ID'si `useId` bilan (bir sahifada bir nechta panel).
  - `lib/dates.ts`: o'zbekcha oy nomlari qo'lda (brauzerning `uz` lokali "2026 M10 9" chiqaradi — vizual tekshiruvda topildi), `datetime-local` konvertatsiyasi.
  - 4 ta yangi web test.
- Regressiya: typecheck ✅, lint ✅, test ✅ (shared 21 + sandbox 15 + web 15 + check-engine 12 + api 116 = **179**), build ✅, format ✅, secret skan (grep) ✅.
- Real smoke (scratchpad'dagi `smoke-12d.mjs`, `/api` proxy, haqiqiy Chrome) **17/17**: yaratish → namuna yechim preview PASSED → e'lon qilish → darsda ko'rinadi → v1 (CHECK 1/3 FAILED, status SUBMITTED qoladi) → o'zgarishsiz qayta topshirish rad etiladi → v2 (CHECK PASSED) → v1 o'zgarmagan → o'qituvchi jadvali → grading lock. Smoke talabasi keyin bazadan o'chirildi.
- Brauzerda bosib tekshirildi (`ui-12d.cjs`): darsdan topshiriqqa o'tish, "Topshirish" tasdiq oynasi, versiya CHECK paneli, versiya kodi, o'qituvchi sahifasidagi qulf izohi, mobil + dark. Konsol xatolari 0.
- Demo: "HTML nima?" darsida "Shaxsiy vizitka sahifasi" topshirig'i bor (e'lon qilingan, muddat bir hafta, 3 urinish, rubrika 40/30/30, 3 ta CHECK qoidasi). Aziza 1-versiyani topshirgan (CHECK 1/3), shuning uchun rubrika qulflangan.
- **STATUS: READY_WITH_INFRASTRUCTURE_LIMITATIONS** (12C dagi CHECK infratuzilma cheklovlari saqlanib qolgan).
- Cheklovlar:
  - Review o'tishlari (IN_REVIEW, REVISION_REQUESTED, GRADED, FINALIZED) va ball qo'yish 12E'da. Hozir ular faqat testlarda DB orqali simulyatsiya qilingan.
  - REVISION_REQUESTED holatida ham urinishlar limiti amal qiladi (12E'da qayta ko'rib chiqiladi).
  - Yopilgan topshiriqni qayta ochish yo'q (roadmap bo'yicha faqat oldinga).
  - Topshiriqni o'chirish yo'q. Muddat avtomatik yopmaydi (faqat qabul qilish qoidasini o'zgartiradi).
  - Topshiriq darsni tugatishga ta'sir qilmaydi.
- Keyingi qadam: **12E — Teacher review** (javobni ko'rish, kod preview, CHECK natijalari, rubrika bo'yicha ball, feedback, qayta ishlash so'rovi, yakunlash, audit).

### Git va GitHub

- Foydalanuvchi GitHub token berdi va push'ni so'radi. Token GitHub API orqali tekshirildi: egasi `irodalibaxtiyor-del`, unda bo'sh **public** repo `web.uz` bor.
- Public repo bo'lgani uchun lokal demo paroli CLAUDE.md dan olib tashlandi (lokal Claude xotirasiga ko'chirildi).
- Git config o'zgartirilmadi. Muallif faqat commit buyrug'ida `-c` bilan berildi: `irodalibaxtiyor-del` va GitHub noreply email.
- Branch `master` → `main`. Birinchi commit `2d639c8`: `phase(f0-12d)`. Fazalar git sozlanishidan oldin qilingani uchun bitta commitga tushdi.
- `origin` = `https://github.com/irodalibaxtiyor-del/web.uz.git` (tokensiz). Token faqat bitta buyruqda vaqtinchalik HTTP header sifatida ishlatildi, hech qayerda saqlanmadi.
- **Push 403 bilan rad etildi:** fine-grained tokenda faqat `metadata=read` bor. Foydalanuvchi tokenga `Contents: Read and write` ruxsatini berishi kerak. Token chatda ochiq bo'lgani uchun uni revoke qilib, yangisini yaratish tavsiya etildi.

### 12E — Teacher review

- **Holatlar mashinasi** (faqat o'qituvchi workflow orqali, kurs xodimi bo'lishi shart):
  - `start-review`: SUBMITTED → IN_REVIEW (talaba endi javobni almashtira olmaydi);
  - `request-revision`: IN_REVIEW / GRADED → REVISION_REQUESTED (feedback majburiy, ball tozalanadi);
  - `grade`: IN_REVIEW / GRADED → GRADED (FINALIZED'gacha qayta baholash mumkin);
  - `finalize`: GRADED → FINALIZED (oxirgi baho va feedback ko'chiriladi, keyin hech narsa o'zgarmaydi).
  - Har amalda o'qituvchi ko'rgan versiya raqami yuboriladi. U eng yangisi bo'lmasa 409 `STALE_VERSION`.
  - Submission qatori `FOR UPDATE` bilan qulflanadi: parallel finalize'da faqat bittasi o'tadi.
- **Ochiq masala yechildi:** o'qituvchi qayta ishlashni so'raganda talaba urinishlar limitidan tashqari qayta topshira oladi (umumiy cheklov `SUBMISSION_MAX_VERSIONS` = 40). Qayta topshirilgach, oddiy limit yana amal qiladi.
- **Shared** (`reviews.ts`): `requestRevisionSchema`, `gradeSubmissionSchema` (`scores` yoki `score` — faqat bittasi), `reviewVersionSchema`. `scoreTotal()` API va UI uchun umumiy: har mezon bir marta, 0..maxPoints; rubrikasiz bo'lsa 0..maxScore. Tiplar: `SubmissionReviewView`, `StudentReview`, `StudentGrade`, `ReviewEntry`, `StaffVersionView`. 4 ta yangi test.
- Migratsiya `0005_reviews.sql`: `submission_reviews` (append-only tarix: harakat, versiya, reviewer, feedback, ball, rubrika ballari) va `submissions.score`.
  - Trigger UPDATE'ni taqiqlaydi. Yagona istisno: reviewer akkaunti o'chirilganda `ON DELETE SET NULL` (aks holda o'qituvchini o'chirib bo'lmay qolardi — testda tekshirildi).
- **API** (`ReviewsService`, `ReviewsController`, `/assignments/:id/submissions/:studentId`):
  - `GET`: versiyalar, to'liq CHECK tafsiloti (yashirin qoidalar bilan), review tarixi (reviewer ismi bilan).
  - `GET versions/:n`: kod preview.
  - `POST start-review | request-revision | grade | finalize`.
  - Audit: `submission.review_start`, `submission.revision_request`, `submission.grade`, `submission.finalize` (studentId, versiya, ball bilan).
  - Talaba ko'rinishiga `review` qo'shildi: oxirgi feedback va baho (ball, o'tdi yoki yo'q, yakuniymi, rubrika ballari). Reviewer kimligi talabaga ko'rsatilmaydi.
  - Xodimlar jadvaliga `score` qo'shildi.
  - Testlar `test/reviews.test.ts` (13 ta): RBAC (talaba 403, begona o'qituvchi 403, boshqa org 404, javobi yo'q talaba 404); to'liq CHECK va kod; noto'g'ri holatdan o'tish 409; eskirgan versiya 409; review paytida talaba bloklanadi; rubrika validatsiyasi; feedback majburiy; reviewer talabaga ko'rinmaydi; revision'dan keyin limitdan tashqari qayta topshirish; qayta baholash; parallel finalize; FINALIZED'dan keyin hech narsa o'zgarmaydi; immutable tarix va audit; rubrikasiz baholash; reviewer akkauntini o'chirish.
- **Web**:
  - Javoblar jadvalida "Ball" ustuni va "Ko'rib chiqish" havolasi.
  - Yangi sahifa `/manage/assignments/[id]/submissions/[studentId]`:
    - versiya tanlash, faqat o'qish uchun kod + sandbox preview;
    - to'liq CHECK ("baho emas" izohi bilan);
    - holatga qarab amallar: boshlash; rubrika bo'yicha ball (jami va o'tish balini jonli hisoblaydi) yoki bitta ball; feedback; baholash/yangilash; qayta ishlashni so'rash; yakunlash (tasdiq bilan);
    - review tarixi.
  - Talaba sahifasida feedback/baho paneli: qayta ishlash so'rovi (kutilayotgan yoki "oldingi izoh"), ball, o'tdi/o'tmadi, rubrika bo'yicha ballar, yakuniy yoki o'zgarishi mumkinligi.
- Regressiya: typecheck ✅, lint ✅, test ✅ (shared 25 + sandbox 15 + web 15 + check-engine 12 + api 129 = **196**), build ✅, format ✅.
- Brauzerda to'liq oqim bosib tekshirildi (`ui-12e.cjs`, demo topshiriq): o'qituvchi jadvaldan javobga o'tdi → ko'rib chiqishni boshladi → izoh bilan qayta ishlashni so'radi → Aziza panelda izohni ko'rdi va 2-versiyani topshirdi (CHECK 3/3) → o'qituvchi 2-versiyani rubrika bo'yicha baholadi (36+27+22 = 85) → Aziza bahoni, mezonlar bo'yicha ballarni va izohni ko'rdi. Konsol xatolari 0. Yakunlash API testlarida tekshirilgan.
- Demo: Aziza'ning "Shaxsiy vizitka sahifasi" javobi **GRADED (85/100)**, yakunlanmagan. "Yakunlash" tugmasini o'qituvchi sifatida o'zingiz sinab ko'rishingiz mumkin.
- **STATUS: READY_WITH_INFRASTRUCTURE_LIMITATIONS** (CHECK infratuzilma cheklovlari saqlanib qolgan).
- Cheklovlar:
  - Bitta javobni bir vaqtda ikki o'qituvchi tahrirlasa, faqat versiya va holat himoyalangan: ikkinchi `grade` birinchisini ustiga yozadi (tarixda ikkalasi ham qoladi).
  - Talabaga baho/izoh haqida bildirishnoma (email yoki notification) yo'q.
  - Satr darajasidagi izohlar (kod qatoriga comment) yo'q, feedback umumiy matn.
  - FINALIZED bahoni bekor qilish mexanizmi yo'q (ataylab).
- Keyingi qadam: **13A — Course map & progress**.
