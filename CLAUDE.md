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

### 13A — Course map & progress

- Audit: kurs xaritasi (modullar, darslar, LOCKED/AVAILABLE/IN_PROGRESS/COMPLETED, foiz) F2'dan beri bor edi. Roadmap talabiga ko'ra bo'shliqlar:
  - xaritada mashqlar va topshiriqlar yo'q edi;
  - `NEEDS_IMPROVEMENT` holati yo'q edi;
  - **quizzes umuman yo'q edi.**
- **Qaror (quiz):** quiz roadmap'da faqat 13A xarita ro'yxatida tilga olingan, uni yaratadigan alohida faza yo'q. Xaritada ko'rsatish uchun minimal quiz shu fazada qo'shildi: dars testi, server baholaydi, to'g'ri javoblar klientga chiqmaydi.
- **Shared** (`quizzes.ts`):
  - savol (SINGLE/MULTIPLE, 2–8 variant, to'g'ri javoblar variantlarga ishora qilishi shart, SINGLE'da aniq bitta);
  - test (30 tagacha savol, o'tish foizi 1–100, yangi test faol emas, faol test savolsiz bo'lolmaydi);
  - `gradeQuiz()`: savol faqat to'g'ri to'plam aynan tanlansa hisoblanadi.
  - Tiplar: `QuizView` (javoblarsiz), `QuizAdmin`, `QuizSummary`, `QuizAttemptResult`.
  - `courses.ts`: `LESSON_STATES` ga `NEEDS_IMPROVEMENT`; `CourseMapLesson` endi `exercises`, `quizzes`, `assignments` ni o'z ichiga oladi; `CourseMap.stats` (darslar, mashqlar, testlar, baholangan topshiriqlar: bajarilgan/jami); `LessonView.quizzes`.
  - 4 ta yangi test.
- Migratsiya `0006_quizzes.sql`: `quizzes` (savollar to'g'ri javoblar bilan, faqat xodim uchun) va `quiz_attempts` (javoblar, to'g'ri soni, foiz, o'tdi/o'tmadi).
- **API**:
  - `QuizzesService` va `QuizzesController`:
    - xodim: yaratish, ro'yxat, tahrir (faol test savolsiz bo'lsa 400), statistika (urinib ko'rgan va o'tgan talabalar);
    - talaba: ko'rish (savol id, matn va variantlar, `correct` yo'q) va urinish. Javob faqat jami natijani qaytaradi — qaysi savol to'g'ri ekani aytilmaydi.
    - 10 daqiqada 10 urinish (429 `QUIZ_RATE_LIMITED`). Bir marta o'tilsa, keyingi mashq urinishlari statusni tushirmaydi.
  - `LearningService` qayta tuzildi:
    - `items()` bitta dars yoki butun kurs bo'yicha mashq, test va topshiriqlarni bitta so'rov to'plamida oladi;
    - `completeIfRequirementsMet()` (oldingi `completeIfExercisesPassed`): dars barcha faol mashq **va** testlar o'tilganda tugaydi;
    - qo'lda tugatishda ham shu shart (kod `EXERCISES_REQUIRED` moslik uchun saqlandi, matn yangilandi);
    - `decorate()`: ochiq darsda tuzatish kerak bo'lgan mashq yoki o'tilmagan test bo'lsa `NEEDS_IMPROVEMENT`. Kirish qoidalari o'zgarmagan (faqat LOCKED tekshiriladi).
  - Eski test yangilandi: tuzatish kerak bo'lgan mashqi bor dars endi `NEEDS_IMPROVEMENT` (13A'ning maqsadli o'zgarishi).
  - Testlar `test/quizzes.test.ts` (11 ta):
    - authoring (faol emas default, savolsiz faollashtirish 400, savol validatsiyasi, RBAC);
    - javoblar talabaga chiqmasligi;
    - yopiq dars, faol emas test, yozilmagan talaba, boshqa org;
    - FAILED → `NEEDS_IMPROVEMENT` va qo'lda tugatish 409; PASSED → dars tugaydi, keyingisi ochiladi; keyingi xato urinish o'tganlikni o'chirmaydi;
    - mashq + test birga talab qilinadi; rate limit; xodim statistikasi;
    - xaritada elementlar, statistika va foiz; qoralama topshiriq va faol emas test yashirin.
- **Web**:
  - `StateBadge` va xarita nuqtalarida `NEEDS_IMPROVEMENT` (sariq, "Tuzatish kerak").
  - Xarita: har dars ostida mashq, test va topshiriq belgilari (ikonka + matn, ochiq darsda havola), yon panelda mashqlar, testlar va baholangan topshiriqlar hisobi. "Davom etish" `NEEDS_IMPROVEMENT` darsni ham topadi.
  - Dars sahifasi: "Testlar" bo'limi. "Darsni tugatdim" testlarni ham hisobga oladi.
  - Talaba test sahifasi `/quizzes/[id]`: radio/checkbox savollar (fieldset/legend), javob berilgan savollar hisobi, natija (`role=status`), qaysi javob noto'g'ri ekani aytilmaydi.
  - O'qituvchi: dars muharririda `QuizzesPanel`; `/manage/quizzes/[id]` savollar konstruktori (savol turi, variantlar qo'shish/o'chirish, to'g'ri javob belgilash, faollashtirish, o'tish foizi, statistika).
- Regressiya: typecheck ✅, lint ✅, test ✅ (shared 29 + sandbox 15 + web 15 + check-engine 12 + api 140 = **211**), build ✅, format ✅.
- Brauzerda bosib tekshirildi (`ui-13a.cjs`):
  - o'qituvchi demo'dagi "Sahifa tuzilishi" darsiga UI orqali 2 savolli test yaratdi (bitta va bir nechta javobli), faollashtirdi;
  - Aziza xaritada test belgisini va `Tuzatish kerak` holatini ko'rdi;
  - sahifa HTML'ida `correct` yo'q;
  - xato urinish 0%, xaritada "Test · 0%"; to'g'ri urinish 100% → "O'tdi".
  - Konsol xatolari 0.
- Demo: "Sahifa tuzilishi" darsida "HTML tuzilmasi testi" bor, Aziza uni o'tgan. Dars hali `Tuzatish kerak`, chunki "Birinchi sahifam" mashqi tuzatilmagan.
- **STATUS: READY_WITH_INFRASTRUCTURE_LIMITATIONS** (avvalgi infratuzilma cheklovlari saqlanib qolgan).
- Cheklovlar:
  - Quiz minimal: faqat yopiq savollar (bitta yoki bir nechta javob), savollar aralashtirilmaydi, vaqt chegarasi va tushuntirishlar yo'q.
  - Faqat test yechilganda dars `IN_PROGRESS` ga o'tmaydi (dars sahifasi ochilganda o'tadi).
  - Progress foizi darslar bo'yicha hisoblanadi (ketma-ket ochilish birligi). Elementlar bo'yicha hisob alohida ko'rsatiladi.
  - Testni o'chirish yo'q (faolsizlantirish bor).
- Keyingi qadam: **13B — Portfolio**.

### HTML kursi (W3Schools tartibida) — to'xtatildi, davom ettiriladi

- So'rov: w3schools.com/html materiallarini o'zbekchaga o'girib joylashtirish. Qaror: W3Schools kontenti mualliflik huquqi bilan himoyalangan (tarjima ham hosila asar), shuning uchun faqat mavzular tartibi olinib, **original o'zbekcha** kurs yozilmoqda.
- Tuzilma: 12 modul, 60 dars. 48 ta dars matni yozildi (`apps/api/content/html-course/*.md`). Media (5) va Web API (7) darslari qoldi.
- Foydalanuvchi so'rovi bilan ish to'xtatildi. To'liq holat, qolgan vazifalar (manifest, mashqlar va CHECK qoidalari, testlar, seed, haqiqiy Chrome bilan tekshiruv) va ochiq savollar: [HTML_KURS_HOLATI.md](HTML_KURS_HOLATI.md).

## 2026-10-10

### HTML kursi — yakunlandi

- Davom ettirildi: [HTML_KURS_HOLATI.md](HTML_KURS_HOLATI.md) dagi reja bo'yicha.
- **Qolgan 12 dars yozildi** (jami 60/60): Media (`media`, `video`, `audio`, `plugins`, `youtube`) va Web API (`web-apis`, `geolocation`, `drag-drop`, `popover`, `web-storage`, `web-workers`, `sse`). Sandbox'da ishlamaydigan API'lar (Geolocation, Worker, SSE, localStorage, tashqi media) uchun "kompyuteringizda sinab ko'ring" eslatmasi bor.
- **Manifest** `apps/api/src/db/html-course/`:
  - `manifest.ts`: kurs `html` ("HTML: to'liq kurs"), 12 modul, 60 dars, **49 mashq** (har biri CHECK qoidalari bilan) va **12 modul testi** (har modulning oxirgi darsida, 4–5 savol, o'tish 70%). 11 ta nazariy dars mashqsiz.
  - `helpers.ts`: `page()`, `has()`, `text()`, `attr()`, `style()`, `clean()`, `after()` (actions), `at()` (viewport), `q()`, `quiz()`.
  - Interaktiv CHECK'lar ham bor: tugma bosilgandan keyingi matn, `details` ochilishi, `:invalid` (min/max/pattern), `:popover-open`, media so'rov (375 va 1024 px).
  - Qoida: tashqi resurs (rasm, video, iframe) bloklanganda Chrome konsolga xato yozadi, shuning uchun `noConsoleErrors` faqat tashqi resurssiz JS mashqlarida ishlatiladi.
- **Seed** (`seed.ts` + CLI `src/db/seed-html-course.ts`, skript `db:seed:html`):
  - avval butun manifest `createExerciseSchema`/`createQuizSchema` bilan validatsiya qilinadi va md fayllar o'qiladi, xatolar bitta ro'yxatda chiqadi;
  - kurs PUBLISHED, egasi `SEED_TEACHER_EMAIL` (TEACHER yoki ORG_ADMIN bo'lishi shart), hammasi bitta tranzaksiyada;
  - `html` slug'i bor bo'lsa to'xtaydi; `--replace` bilan qayta yaratadi (ogohlantirish bilan, progress o'chadi).
- **Tekshiruv** `verify.ts` (skript `content:verify`): har mashq haqiqiy Chrome'da — namunaviy yechim (`solutions.ts`) PASSED, boshlang'ich kod PASSED emas. Natija **49/49**.
- **Testlar** `test/html-course.test.ts` (12 ta): 12 modul/60 dars, har md fayl aynan bir marta ishlatilgan, har modulda bitta test, har mashqning yechimi bor, yetishmayotgan fayl xatosi, seed soni, qayta seed rad etiladi, talaba egasi bo'lolmaydi, `--replace`, talabaga faqat 1-dars ochiq, yashirin CHECK qoidalari va test javoblari chiqmaydi, ketma-ket ochilish.
- Regressiya: typecheck ✅, lint ✅, test ✅ (shared 29 + sandbox 15 + web 15 + check-engine 12 + api 152 = **223**), build ✅, format ✅.
- Demo bazaga yuklandi: 12 modul, 60 dars, 49 mashq, 12 test. Aziza kursga yozildi (brauzerda bosib tekshirildi: kabinet → kurs → yozilish → xarita → 1-dars → mashq IDE). Konsoldagi yagona xato — yozilishdan oldingi kutilgan 403 `NOT_ENROLLED`.
- Real smoke (vaqtinchalik talaba, `/api` proxy, haqiqiy CHECK): noto'g'ri sahifa FAILED 1/3, to'g'ri sahifa PASSED 3/3 → 1-dars COMPLETED, 2-dars AVAILABLE. Smoke talabasi keyin bazadan o'chirildi.
- Cheklovlar va ochiq savollar:
  - CHECK qoidalari va namunaviy yechimlar public repoda ochiq (boshlang'ich mashqlar uchun qabul qilindi, foydalanuvchi qaroriga qoldirildi).
  - Eski demo kurs "HTML asoslari" saqlab qolindi.
  - Canvas va drag-drop mashqlarida chizma yoki sudrashning o'zi tekshirilmaydi (engine'da drag action yo'q), faqat tuzilma va konsol xatolari.
  - 1-darsda sahifa sarlavhasi va birinchi bo'lim sarlavhasi bir xil ("HTML nima?").
- Keyingi qadam: **13B — Portfolio**.

### 13B — Portfolio

- Roadmap talabi: tugatilgan loyihalar, tanlangan topshiriqlar, ko'nikmalar, yutuqlar, kurs yakunlari, skrinshotlar, tavsiflar. Ochiq portfolio faqat aniq e'lon qilinganda, maxfiy ma'lumot chiqmaydi.
- **Qarorlar:**
  - Portfolio har foydalanuvchida bitta (tashkilotdan qat'i nazar) va default holatda **yashirin**.
  - Qo'shish mumkin bo'lgan ishlar: **PASSED** mashqlar va **GRADED/FINALIZED** topshiriqlar. Bu shart serverda qayta tekshiriladi, begona yoki tugallanmagan ish 404 `NOT_ELIGIBLE` oladi.
  - Ish qo'shilganda fayllar, nom va kurs nomi **snapshot** qilinadi. Manbaga FK yo'q, keyingi tahrirlar va o'chirishlar portfolioga ta'sir qilmaydi. Topshiriqdan oxirgi (baholangan) versiya olinadi.
  - Yutuqlar va tugatilgan kurslar har o'qishda o'quv ma'lumotlaridan hisoblanadi, saqlanmaydi va klient ularni o'zgartira olmaydi. Yutuqlar: FIRST_EXERCISE, TEN_EXERCISES, QUIZ_MASTER (5 test), FIRST_GRADED_ASSIGNMENT, COURSE_COMPLETED.
  - "Skrinshot" o'rnida loyihaning jonli ko'rinishi sandbox runner'da chiqadi (alohida site, opaque origin, faqat `allow-scripts`). Fayllar faqat "Natijani ko'rish" bosilganda yuklanadi.
  - Ochiq ko'rinishda ism (o'zgartirsa bo'ladigan `displayName`), tavsif, ko'nikmalar, yutuqlar, kurslar va tanlangan ishlar bor. Email, user/org/course/source ID'lari, ball va o'qituvchi izohlari **yo'q**.
- **Shared** (`portfolio.ts`): `updatePortfolioSchema` (slug 3–40, `a-z0-9-`, `--` yo'q, kichik harfga o'tkaziladi; 20 tagacha ko'nikma, registrga qaramay takrorlanmaydi), `addPortfolioItemSchema`, `updatePortfolioItemSchema`, `ACHIEVEMENTS`, tiplar. 3 ta test.
- Migratsiya `0007_portfolio.sql`:
  - `portfolios`: PK user, unique slug, CHECK "e'lon qilingan bo'lsa slug bor";
  - `portfolio_items`: unique (user, kind, source), 20 ta limit.
- **API** (`src/portfolio/`), egasi doim sessiyadan olinadi:
  - `GET/PUT /portfolio/me`, `POST /portfolio/me/publish|unpublish`;
  - `POST /portfolio/me/items`, `GET|PATCH|DELETE /portfolio/me/items/:id`;
  - ochiq: `GET /portfolio/public/:slug`, `GET /portfolio/public/:slug/items/:id`. E'lon qilinmagan va mavjud bo'lmagan portfolio bir xil 404 qaytaradi.
  - Xatolar: 409 `SLUG_REQUIRED`, `SLUG_TAKEN`, `ALREADY_ADDED`, `PORTFOLIO_FULL`.
  - Qo'shish egasi qatori bo'yicha `FOR UPDATE` bilan ketma-ket bajariladi.
  - Audit: `portfolio.publish`, `portfolio.unpublish`.
- Testlar `test/portfolio.test.ts` (14 ta): sessiyasiz 401; default yashirin; nomzodlar faqat o'z tugatgan ishlari; begona, tugallanmagan va noto'g'ri turdagi manbalar rad etiladi; snapshot keyingi tahrirdan o'zgarmaydi; dublikat 409; begona item 404 (soxta `x-user-id` bilan ham); tahrir va tartib; 20 ta limit; slug'siz e'lon qilib bo'lmaydi; yashirin va mavjud bo'lmagan portfolio bir xil 404; slug unique; ochiq JSON'da email, ID'lar, `score`, izohlar va fayllar yo'q; boshqa egasining item'i 404; e'lon qilinganda slug'ni o'chirib bo'lmaydi; tugatilgan kurs va yutuq; yashirilgandan keyin 404 va audit.
- **Web:**
  - `/portfolio`: holat paneli (e'lon qilishdan oldin nima ko'rinishini va nima ko'rinmasligini aytadigan tasdiq), profil formasi, ishlar (ko'rish, tahrirlash, ↑↓ tartib, o'chirish), qo'shish mumkin bo'lgan ishlar, yutuqlar va kurslar;
  - ochiq `/p/[slug]` (login shart emas);
  - kabinetda "Portfolio" tugmasi; `components/portfolio-ui.tsx`, `formatDate()`, `send()` endi `DELETE` ni ham qo'llaydi.
  - 3 ta yangi web test.
- Regressiya: typecheck ✅, lint ✅, test ✅ (shared 32 + sandbox 15 + web 18 + check-engine 12 + api 166 = **243**), build ✅, format ✅, secret skan (grep) ✅.
- Brauzerda bosib tekshirildi (`ui-13b.cjs`, demo baza): Aziza kabinetdan portfolioga o'tdi, slug'siz "E'lon qilish" o'chiq, profilni to'ldirdi, baholangan "Shaxsiy vizitka sahifasi"ni qo'shdi va e'lon qildi. Login'siz mehmon `/p/aziza-karimova` da sahifani va sandbox'dagi jonli loyihani ko'rdi. Ochiq JSON'da email va ball yo'q. Yashirilgandan keyin "Portfolio topilmadi". Mobil va dark mode ko'rildi. Topilib tuzatildi: yon paneldagi yutuq kartasi siqilgan edi; saqlangandan keyin slug maydonida normallashmagan qiymat qolardi. Konsoldagi yagona xato — yashirishdan keyingi kutilgan 404.
- Demo: Aziza'ning portfoliosi **e'lon qilingan** (`/p/aziza-karimova`, 1 ta loyiha). Yashirish uchun: `/portfolio` → "Yashirish".
- **STATUS: READY_WITH_INFRASTRUCTURE_LIMITATIONS** (avvalgi infratuzilma cheklovlari saqlanib qolgan).
- Cheklovlar:
  - Haqiqiy PNG skrinshot yo'q, jonli sandbox preview bor. Server tomonda Chrome bilan skrinshot olish keyinroq qo'shilishi mumkin.
  - Ochiq sahifa klient tomonda render qilinadi, shuning uchun SEO/OpenGraph meta yo'q.
  - Ochiq endpoint'larda rate limit yo'q (14A xavfsizlik fazasida ko'rib chiqiladi).
  - Ishni yangilash (snapshot'ni yangi kod bilan almashtirish) yo'q: olib tashlab, qayta qo'shish kerak.
  - Ko'nikmalar erkin matn, kurslardan avtomatik olinmaydi.
- Keyingi qadam: **13C — Analytics**.

### CSS kursi (W3Schools tartibida) — boshlandi, to'xtatildi

- So'rov: w3schools.com/css darsligini o'zbek tilida joylash. HTML kursidagi qaror saqlandi: faqat mavzular tartibi olinadi, matnlar, misollar va mashqlar **original o'zbekcha** yoziladi.
- **CHECK engine kengaytirildi** (CSS mashqlari uchun):
  - `style` tekshiruvida ixtiyoriy `pseudo` (`::before`, `::after`, `::first-letter`, `::first-line`, `::marker`, `::placeholder`);
  - `property` CSS o'zgaruvchisi bo'lishi mumkin (`--rang`). O'zgaruvchilar va `content` yozilganidek solishtiriladi.
  - **Topilgan xato va tuzatish:** probe elementda `border-style` yo'q, shuning uchun `border-width: 4px` 0px ga normallashardi. Endi qiymat hisoblangan qiymat bilan aynan mos kelsa, probe ishlatilmaydi.
  - Engine testi qo'shildi (13 ta). Muharrirdagi qoidalar ma'lumotnomasi yangilandi.
- **Kontent infratuzilmasi umumlashtirildi** (`apps/api/src/db/content/`):
  - `helpers.ts`: `CourseMeta`, `CourseDef`, yangi `site(body, css)` (index.html + style.css);
  - `seed.ts`: `prepareCourse()`, `seedCourse()`, `CourseExistsError` — har qanday kurs uchun;
  - `registry.ts`: `CONTENT_COURSES` (html, css);
  - `verify.ts`: `content:verify [kurs] [darslar...]`;
  - HTML kursi `content/html/` ga ko'chirildi (manifest va yechimlar o'zgarmadi);
  - CLI `src/db/seed-course.ts`, skriptlar `db:seed:course <slug>`, `db:seed:html`, `db:seed:css`.
- Test `test/html-course.test.ts` → `test/content-courses.test.ts`: har bir kurs uchun manifest testlari (`describe.each`), HTML seed va o'quvchi oqimi testlari saqlandi.
- **CSS kursi:** 15 modul, ~101 dars rejasi. Tayyor: **3 modul, 23 dars, 23 mashq, 3 test** (`content/css/modules/01..03`, `solutions/01..03`). Haqiqiy Chrome tekshiruvi **23/23** (yechim PASSED, boshlang'ich kod o'tmaydi).
- Tajriba: bir mashqda 5 tadan ortiq qoida bo'lsa, yuklama ostida 20 s budjetdan oshib ketishi mumkin. Shu sabab `outline` mashqi qisqartirildi.
- Regressiya: typecheck ✅, lint ✅, format ✅, api test **170/170** ✅, check-engine **13/13** ✅.
- Demo bazaga CSS kursi hali **yuklanmagan** (kurs tugagandan keyin `db:seed:css`).
- To'liq holat, qolgan 12 modul va mashq yozish qoidalari: [CSS_KURS_HOLATI.md](CSS_KURS_HOLATI.md).

## 2026-10-12

### CSS kursi — yakunlandi

- [CSS_KURS_HOLATI.md](CSS_KURS_HOLATI.md) bo'yicha davom ettirildi. Qolgan 12 modul (4–15) yozildi: matn va shriftlar, havola/ro'yxat/jadval, joylashuv, selektorlar va kaskad, amaliy komponentlar, birliklar va funksiyalar, bezak effektlari, transformatsiya va animatsiya, rasmlar va interfeys, Flexbox, Grid, moslashuvchan dizayn.
- Jami: **15 modul, 101 dars, 101 mashq (har biri CHECK qoidalari bilan), 15 modul testi**. Matnlar, misollar va mashqlar original o'zbekcha (W3Schools'dan faqat mavzular tartibi).
- `helpers.ts`: `style()` ga `pseudo` opsiyasi qo'shildi; `@webdizayn/shared` dan `CheckPseudoElement` tipi eksport qilinadi.
- Modul fayllari markup'ni (`BODYNN`) va boshlang'ich CSS'ni eksport qiladi, yechimlar ularni qayta ishlatadi (dublikat yo'q). Tashqi rasmlar o'rniga `data:` SVG (`pic()` 08-modulda).
- Haqiqiy Chrome tekshiruvi (`content:verify css`): **101/101** — har yechim PASSED, boshlang'ich kod o'tmaydi.
- Topilgan va tuzatilgan holatlar (qoidalar CSS_KURS_HOLATI.md ga yozildi): ko'p qatlamli fonda computed qiymat har qatlam uchun takrorlanadi; `grid-row: span 2` `grid-row-start` ga yoziladi; `has(..., {max: 0})` uchun `min: 0` kerak; content-box'da `margin: auto` padding'ni hisobga oladi; transition'li holatlarda `wait` kerak.
- Regressiya: typecheck ✅, lint ✅, format ✅, build ✅, test ✅ (shared 32 + sandbox 15 + web 18 + check-engine 13 + api 170 = **248**).
- Demo bazaga yuklandi (`db:seed:css`): "CSS: to'liq kurs" e'lon qilingan.
- Cheklovlar: CHECK faqat hisoblangan uslublarni tekshiradi — ba'zi mashqlarda (masalan `@supports`, `@layer`, `!important`) yechim usuli emas, natija tekshiriladi. `prefers-reduced-motion`, `hover` media va print'ni engine emulyatsiya qilmaydi, shuning uchun ular faqat darsda. CHECK qoidalari va yechimlar public repoda ochiq (HTML kursidagidek).

### 13C — Analytics

- Qaror: yangi jadval yoki migratsiya yo'q. Analitika har so'rovda mavjud o'quv yozuvlaridan (lesson_progress, check_runs, student_exercises, quiz_attempts, submissions, submission_reviews) hisoblanadi, shuning uchun ular bilan hech qachon farq qilmaydi.
- **Shared** (`analytics.ts`): `StudentAnalytics`, `CourseAnalytics`, `OrgAnalytics` tiplari; `rate()` (ma'lumot bo'lmasa `null`, soxta 0% emas), `weekStartOf`/`trendWeeks` (UTC dushanba, 8 hafta), `progressBucket`, `struggleReasons()` — har bir sabab tekshirsa bo'ladigan aniq fakt: INACTIVE (7 kun), BEHIND (o'rtachadan 25 punkt past), STUCK_ON_CHECK (o'tilmagan mashqda ≥3 FAILED), NEEDS_IMPROVEMENT, REVISION_REQUESTED, QUIZ_NOT_PASSED. Kursni tugatgan talaba belgilanmaydi. 6 ta test.
- **API** (`src/analytics/`):
  - `analytics-facts.ts`: `loadFacts()` — kurslar (va ixtiyoriy talabalar) to'plami uchun 10 ta agregat so'rov; `FactsIndex.stats(user, course)` — progress, frontier dars, mashqlar, CHECK (ERROR/TIMEOUT foizga kirmaydi, birinchi urinishda o'tish), testlar, topshiriqlar, zaif mavzular (faqat hozir hal qilinmaganlari), oxirgi faollik.
  - `GET /analytics/me` — faqat sessiya egasi; faqat a'zo bo'lgan tashkilotlar kurslari, qoralama kurslar yo'q. Zaif mavzularda faqat dars/modul nomi — CHECK qoida nomlari, selektorlar va yashirin qoidalar chiqmaydi. `aiUsage: { available: false }` (AI Tutor, 11-faza, hali qurilmagan — soxta ma'lumot berilmaydi).
  - `GET /orgs/:orgId/courses/:courseId/analytics` — TEACHER (faqat biriktirilgan kurs) va ORG_ADMIN: progress taqsimoti, tiqilib qolgan darslar, ko'p uchraydigan xatolar (xodim uchun yashirin qoida nomi `hidden` belgisi bilan), texnik natijalar (TIMEOUT/ERROR), topshiriqlar holati, qayta ishlash ulushi, yordam kerak bo'lishi mumkin bo'lgan talabalar (ism bilan, emailsiz), haftalik trend.
  - `GET /orgs/:orgId/analytics` — faqat ORG_ADMIN: a'zolar, faol talabalar (7/30 kun), kursni tugatish ulushi, kurslar faolligi, o'qituvchilar faolligi (biriktirilgan kurslar, ko'rib chiqishlar, kutayotgan javoblar), haftalik faol talabalar.
  - Testlar `test/analytics.test.ts` (10 ta): sessiyasiz 401; talabaning o'z raqamlari; zaif mavzular va yashirin qoidalar sizmasligi; boshqa talaba/tashkilot aralashmasligi va soxta `x-user-id`; kurs analitikasi RBAC (talaba 403, begona o'qituvchi 403, boshqa org 404, admin 200); progress, tiqilish, xatolar, topshiriqlar, qayta ishlash va qiynalayotgan talabalar; javoblarda email yo'q; org analitikasi faqat admin uchun va tashkilotlar ajratilgan.
- **Web**:
  - `components/analytics-ui.tsx`: `StatTile`, `Section`, `RateMeter`, `ColumnChart` (bitta seriya, legendasiz, ustun ≤24px, 4px yumaloq uch, faqat oxirgi ustunda qiymat; har ustun fokuslanadi va hover/fokusda tooltip; "Jadval ko'rinishi"). Grafik rangi `--color-chart` — yorug'da `#0071dc`, qorong'ida `#3b8eea` (dataviz validatori bilan tekshirildi). 3 ta test.
  - Sahifalar: `/analytics` (talaba, kabinetda "Natijalarim"), `/orgs/[orgId]/courses/[courseId]/manage/analytics` (kurs boshqaruvida "Analitika"), `/orgs/[orgId]/analytics` (admin uchun kabinetda "Tashkilot analitikasi").
- Regressiya: typecheck ✅, lint ✅, format ✅, build ✅, test ✅ (shared 38 + sandbox 15 + web 21 + check-engine 13 + api 180 = **267**).
- Brauzerda bosib tekshirildi (`ui-13c.cjs`, demo baza) **10/10**: talaba, o'qituvchi va admin sahifalari; fokusdagi tooltip; talabaga org analitikasi 403; mobil (390px) va dark rejimda gorizontal aylanish yo'q. Konsol xatolari 0. Raqamlar uch ko'rinishda bir-biriga mos.
- **STATUS: READY_WITH_INFRASTRUCTURE_LIMITATIONS** (avvalgi cheklovlar saqlanib qolgan).
- Cheklovlar:
  - AI usage hozircha yo'q (11-faza bajarilmagan — fazalar tartibida 12E dan keyin 11 turishi kerak edi, lekin 13A/13B oldin qilingan).
  - Faollikka CHECK, dars progressi, test urinishlari va topshirishlar kiradi; workspace'ni saqlash kirmaydi (`student_exercises.updated_at` ni o'qituvchi status qo'yganda ham o'zgartiradi).
  - Hisob har so'rovda bajariladi; katta tashkilotlar uchun kesh yoki materialized view kerak bo'ladi. Ko'p uchraydigan xatolar oxirgi 5000 ta FAILED run bo'yicha.
  - Haftalar UTC bo'yicha (Toshkent vaqti bilan dushanba 00:00–05:00 orasidagi faollik oldingi haftaga tushadi).
  - Sana oralig'ini tanlash filtri yo'q (doim 8 hafta / 7 va 30 kun).
- Keyingi qadam: roadmap tartibida **11 — AI Tutor** (o'tkazib yuborilgan), keyin **14A — Security hardening**.

### 11 — AI Tutor (11A, 11B-1, 11B-2, 11B-3)

- Faza tartibi: 11 roadmap bo'yicha 12E dan keyin bo'lishi kerak edi, lekin oldin 13A–13C qilingan. Foydalanuvchi so'rovi bilan 11 va 14A ketma-ket bajarildi (14A AI endpoint'larini ham qamrashi uchun avval 11).
- Asosiy tamoyil: model konteksti faqat **talabaga xavfsiz mavjud ko'rinishlardan** quriladi (`ExercisesService.view`, `ChecksService.latest` → `CheckRunView`, `AssignmentsService.view`). Yashirin CHECK qoidalari, boshqa talabalar, parollar, sessiyalar, email va ismlar kontekstga umuman tushmaydi. Output guard — ikkinchi qatlam.
- **Shared** (`ai.ts`): so'rov rejimlari (HINT, CODE_EXPLANATION, ERROR_EXPLANATION, COMPREHENSION_QUESTION, FLEXBOX_HELP, ASSIGNMENT_GUIDANCE, TEACHER_HANDOFF; OUT_OF_SCOPE faqat server qaroridan), darajalar, `tutorAskSchema` (xabar 2000, RUN xatolari 5 × 300 belgi — klient ma'lumoti, ishonchsiz), `tutorFeedbackSchema`, tiplar. `StudentAnalytics.aiUsage` endi haqiqiy raqamlar.
- Migratsiya `0008_ai.sql`: `ai_interactions` (so'rov va himoyalangan javob, faqat egasi o'qiydi; guard sabablari faqat audit uchun), `ai_hint_states` (maslahat bosqichi yangilashda yo'qolmaydi, 0..3 CHECK), `ai_usage` (har bir provayder chaqiruvi, kvota va narx), `ai_feedback`, `ai_handoffs`.
- **API** (`src/ai/`):
  - `provider.ts`: `AiProvider`; `MockProvider` (default, offline, rejadan javob quradi); `HttpAiProvider` — vendor SDK'siz OpenAI-mos chat-completions, kalit faqat `Authorization` sarlavhasida, timeout (AbortController), faqat vaqtinchalik xatolarda cheklangan retry, xavfsiz xato kodlari (TIMEOUT/UNAVAILABLE/RATE_LIMITED/BAD_RESPONSE — provayder javobi va kalit hech qayerga chiqmaydi), javob 6000 belgigacha kesiladi, `redirect: 'error'`.
  - Config: `AI_PROVIDER`, `AI_PROVIDER_URL`, `AI_PROVIDER_MODEL`, `AI_PROVIDER_API_KEY`, `AI_REQUEST_TIMEOUT_MS`, `AI_MAX_ATTEMPTS`, `AI_DAILY_REQUESTS`, `AI_DAILY_PROMPT_CHARS`, `AI_RATE_PER_MINUTE`, `AI_ALLOW_REAL_STUDENT_DATA`, `AI_COST_PER_1K_CHARS_MICROUSD`. HTTP faqat `http` + ruxsat + URL + kalit bo'lganda; production'da https majburiy.
  - `pedagogy.ts`: to'liq yechim so'rovini tanish (o'zbek/ingliz/rus) → ehtiyotkor rad + keyingi maslahat + bitta savol; mavzudan tashqari savol (so'z boshlanishi bo'yicha lug'at); maslahat 1 (tushuncha) → 2 (aniq yo'nalish) → 3 (keyingi qadam), 3 dan oshmaydi; darajaga mos savollar banki; prompt (o'zbekcha javob, ≤6 qatorli snippet, baho yo'q, `<<< >>>` ichidagi hamma narsa ma'lumot, delimiter injection neytrallanadi); JSON javobni tahlil — har doim aynan bitta savol.
  - `guard.ts`: system prompt (per-process canary + 40 belgilik siljuvchi oyna), yashirin CHECK satrlari (talabaga ko'rinadigan matnda bo'lganlari bundan mustasno), kalit/sessiya/DB URL/`sk-`/uzun hex/private key, email, tayyor yechim (kod qatorlari: mashq 12, topshiriq 8; to'liq HTML hujjat). Bloklangan javob xavfsiz matn bilan almashtiriladi, maslahat sarflanmaydi, audit `ai.output_blocked`.
  - `usage.service.ts`: daqiqalik limit (`AI_RATE_LIMITED`), kunlik so'rov/belgi kvotasi (`AI_QUOTA_EXCEEDED`, UTC kun), narx bahosi.
  - `tutor.service.ts`: kirish shartlari mashq/topshiriq sahifalari bilan bir xil; handoff (audit `ai.handoff`) va mavzudan tashqari javob provayderga chiqmaydi; provayder xatosida 503 `AI_UNAVAILABLE` va `ai_usage` ERROR yozuvi.
  - Endpoint'lar (`/orgs/:orgId/courses/:courseId/tutor`): `GET ?targetKind&targetId` (holat, kvota, oxirgi 20 ta suhbat — faqat o'zi), `POST ask`, `POST interactions/:id/feedback`, `GET handoffs` (xodim, emailsiz).
  - Testlar: unit 25 ta (`src/ai/*.test.ts`) va integratsion 18 ta (`test/tutor.test.ts`): kirish (401/403 yozilmagan/403 yopiq dars/404 boshqa org/404 noma'lum/400 noto'g'ri rejim), maslahat 1→2→3→3 va yangilashdan keyin saqlanishi, talaba va maqsad bo'yicha ajratilishi, kontekstda yashirin qoida/boshqa talaba fayli/email/parol/hash/cookie/ID yo'qligi, prompt injection fence'da, to'liq yechimni rad etish, mavzudan tashqari javob provayderga chiqmasligi, 4 xil sizib chiqishni bloklash, bloklanganda maslahat sarflanmasligi va audit, provayder xatosi 503, feedback faqat o'z javobiga, handoff baho/progressni o'zgartirmasligi, analitikada AI usage, daqiqalik va kunlik kvota.
- **Web**: `components/tutor-panel.tsx` (mashq va topshiriq sahifalarida): rejim tugmalari, "Maslahat (n/3)", daraja (localStorage, try/catch), RUN xatolari avtomatik qo'shiladi (`Playground.onRunErrors`, 300 belgigacha), suhbat tarixi, savol bloki, foydali/foydali emas (`aria-pressed`), o'qituvchiga murojaat (kategoriya + izoh), yuklanish/xato/kvota/ruxsat yo'q holatlari, `aria-live`, dark mode. Topshiriqda uzun kodli javob klientda ham ko'rsatilmaydi. O'qituvchining kurs analitikasida "O'qituvchiga murojaatlar" bo'limi; talaba analitikasida AI foydalanish raqamlari. 2 ta yangi web test.
- `.env.example` ga AI o'zgaruvchilari (sirsiz) qo'shildi.
- Regressiya: typecheck ✅, lint ✅, format ✅, build ✅, test ✅ (shared 38 + sandbox 15 + web 23 + check-engine 13 + api 223 = **312**).
- Brauzerda bosib tekshirildi (`ui-11.cjs`, demo baza, mock provayder): panel, maslahat + savol, to'liq yechim rad etildi, yangilashdan keyin tarix va hisoblagich saqlandi, handoff yuborildi va o'qituvchi uni ko'rdi, topshiriq yo'l-yo'rig'i, tez-tez so'rovda "Juda tez-tez…" xabari (kutilgan 429), mobil + dark'da gorizontal aylanish yo'q. Feedback tugmasi alohida tekshirildi (200, `aria-pressed` almashadi).
- Topilgan va tuzatilgan: RUN konsol qatorlari 2000 belgigacha bo'lishi mumkin, server esa uzunlarini 400 bilan rad etardi — klient 300 belgigacha qisqartiradi; o'qituvchi izohidan keyin nuqta yo'qligi; `isOutOfScope` so'z ichidagi kalit so'zni topardi ("ertaga" ⊃ "tag"); CSS xususiyat nomi (`color`) yashirin satr deb bloklanardi.
- Yangi topilma (14A'da tuzatiladi): JS yuklanmaganda login formasi parolni URL query'da GET bilan yuborishi mumkin.
- **STATUS: READY_WITH_INFRASTRUCTURE_LIMITATIONS.**
- Cheklovlar:
  - Haqiqiy AI provayderi faqat soxta `fetch` bilan sinovdan o'tgan; tashqi xizmatga ulanib tekshirilmagan (DPA/ma'lumot joylashuvi tasdiqlanmagan — mock default).
  - Mock javoblari shablonli (kodni chuqur tushunmaydi), faqat UX va xavfsizlik oqimini ko'rsatadi.
  - Intent va guard evristik (regex/so'z ro'yxati) — yagona himoya emas; asosiy himoya strukturaviy (kontekstga maxfiy ma'lumot qo'yilmaydi).
  - Kvota va daqiqalik limit DB orqali, lekin parallel so'rovlarda qat'iy atomik emas (bir nechta so'rov bir vaqtda o'tib ketishi mumkin).
  - Handoff'larni "hal qilindi" deb belgilash yo'q.

### 14A — Security hardening

- Roadmap ro'yxati bo'yicha audit. Mavjud testlar bilan tasdiqlangan (o'zgartirilmadi): sessiya muddati va faolsizlik, cookie flaglari, Argon2id, login rate limit, neytral auth xatolari, rol/`x-user-id` soxtalashtirish, cross-student/teacher/org, ownership, zod validatsiya, XSS (markdown, React escaping; `dangerouslySetInnerHTML`/`innerHTML` yo'q), injection (raw SQL yo'q, drizzle parametrlari), path traversal va fayl limitlari, AI prompt injection, kontekst izolyatsiyasi, yashirin CHECK sizishi, xavfsiz provayder xatolari, CSRF (Origin tekshiruvi + SameSite=Lax).
- **Topilgan va tuzatilgan:**
  1. **IP bo'yicha limitlar amalda umumiy edi.** Brauzer API'ga Next `/api` rewrite orqali kiradi, API `trust proxy`siz har bir so'rovni Next serveridan deb ko'rardi. Oqibat: 50 ta xato login barcha foydalanuvchilarni bloklardi va hujumchi istalgan emailga 5 ta xato bilan **qurbonni 15 daqiqaga bloklay olardi**. Tekshiruv: Next `X-Forwarded-For` ni o'zi qo'shmaydi, mijoznikini o'zgartirmay uzatadi. Tuzatish: `TRUST_PROXY` (Express "trust proxy", default `loopback`, qat'iy validatsiya). Production talabi: Next oldidagi proksi `X-Forwarded-For` ni haqiqiy IP bilan **almashtirishi** shart (`.env.example` va config izohida).
  2. **Login formasi** JS yuklanmaganda native GET bilan parolni URL'ga qo'yishi mumkin edi (11-fazada brauzerda kuzatilgan). Tuzatish: `method="post"`.
  3. **Ro'yxatdan o'tish** limitsiz edi (ommaviy akkaunt ochish, 409 orqali email tekshirish). Tuzatish: IP bo'yicha soatiga `REGISTER_MAX_PER_HOUR` (default 10), 429 `REGISTER_RATE_LIMITED`.
  4. **Ochiq portfolio endpoint'lari** limitsiz edi (13B'dan qoldirilgan). Tuzatish: IP bo'yicha daqiqasiga `PUBLIC_RATE_PER_MINUTE` (default 120), 429 `PUBLIC_RATE_LIMITED`. Umumiy `common/rate-limiter.ts` (sliding window, xotira chegarasi bilan).
  5. **AI kvotasi parallel so'rovlarda atomik emas edi.** Tuzatish: provayder chaqiruvidan oldin `ai_usage` qatori per-user `pg_advisory_xact_lock` ostidagi tranzaksiyada band qilinadi (`reserve` → `finish`); daqiqalik limit band qilingan chaqiruvlar + provayderga chiqmagan javoblardan hisoblanadi.
  6. **Web ilovada CSP va HSTS yo'q edi.** Tuzatish (`next.config.ts`): CSP (`default-src 'self'`, `frame-src` faqat sandbox origin, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`, `worker-src 'self' blob:`, `connect-src 'self'`), `Permissions-Policy`, production'da HSTS. Brauzerda tekshirildi: Monaco, sandbox RUN, tutor, analitika sahifalari — CSP buzilishi 0.
  7. **Bog'liqliklar:** `pnpm audit --prod` 2 ta past darajali DOMPurify (≤3.4.15, Monaco orqali) maslahatini ko'rsatdi. `overrides: dompurify >=3.4.16` qo'shildi, audit toza. Lekin Monaco `min` build'i 3.4.15 ni ichiga o'rab olgan — ishlovchi kod o'zgarmadi; zaiflik `IN_PLACE` rejimiga tegishli, u bundle'da faqat bir marta uchraydi (ehtimol konfiguratsiyani o'qiydigan kutubxona kodi). Monaco bu rejimni ishlatmasligini chaqiruv joylarini ko'rib tasdiqlamadim. Monaco yangilanganda qayta tekshirish kerak.
- Sirlar skani (grep, gitleaks lokal yo'q): repoda kalit, token, parol yoki `.env` yo'q (faqat `.env.example`).
- Testlar `test/security.test.ts` (6 ta): boshqa IP'dagi hujumchi qurbonni bloklay olmaydi; `TRUST_PROXY=false` da eski umumiy bucket xatti-harakati; `TRUST_PROXY` validatsiyasi; ro'yxatdan o'tish va ochiq portfolio IP limitlari (boshqa IP ta'sirlanmaydi); 6 ta parallel AI so'rovidan aynan kunlik limitcha (2 ta) o'tadi.
- Regressiya: typecheck ✅, lint ✅, format ✅, build ✅, test ✅ (shared 38 + sandbox 15 + web 23 + check-engine 13 + api 229 = **318**), sandbox xavfsizlik E2E ✅ (ALL PASSED), `pnpm audit --prod` ✅.
- **STATUS: READY_WITH_INFRASTRUCTURE_LIMITATIONS.**
- Cheklovlar va ochiq masalalar:
  - Barcha limiterlar (login, register, public) process ichida — bir nechta API instance uchun Redis kerak.
  - To'g'ri mijoz IP'si production'dagi edge proksiga bog'liq (Next o'zi XFF qo'shmaydi). Proksisiz deploy qilinsa, `TRUST_PROXY=loopback` da mijoz XFF'ni soxtalashtira oladi — bunday holatda `TRUST_PROXY=false` qo'yish kerak (limitlar yana umumiy bo'ladi).
  - CSP'da `script-src 'unsafe-inline'` (Next bootstrap) va `style-src 'unsafe-inline'` qoldi; nonce'ga o'tish keyingi qadam.
  - Ro'yxatdan o'tishda 409 hali ham email band ekanini bildiradi (endi limit bilan); to'liq yechim — email tasdiqlash.
  - Restart'da `PENDING` holatida qolgan `ai_usage` qatorlari shu kun kvotasiga kiradi.
  - Kirish jurnallari (access log) va xavfsizlik monitoringi yo'q (14C production readiness).
- Keyingi qadam: **14B — Sandbox security**.

### 14A — kamchiliklar tuzatildi

- **Limitlar endi PostgreSQL'da** (`0009_rate_limits.sql`, `rate_limit_events`): login (IP+email, IP), ro'yxatdan o'tish va ochiq endpoint limitlari bir nechta API instance o'rtasida umumiy. Kalitlar SHA-256 xesh (email va IP ochiq saqlanmaydi), tekshirish+yozish per-key `pg_advisory_xact_lock` bilan atomik, 24 soatdan eski qatorlar muntazam o'chiriladi. Redis kerak emas.
- **CSP nonce bilan** (`apps/web/src/proxy.ts`, Next 16 proxy): har so'rovda yangi nonce, `script-src 'self' 'nonce-…' 'strict-dynamic'` — skriptlar uchun `'unsafe-inline'` olib tashlandi. Barcha sahifalar dinamik (root layout cookie o'qiydi), Next o'z skriptlariga nonce qo'yadi. Monaco loader `'strict-dynamic'` orqali ishlaydi. Uslublar uchun `'unsafe-inline'` qoldi (Monaco va next/font runtime'da style qo'shadi).
- **Monaco ichidagi DOMPurify**: yangi Monaco versiyasi yo'q (0.57.0 eng oxirgisi). Bundle tahlili: Monaco `sanitize` ni faqat `RETURN_DOM_FRAGMENT`/`RETURN_TRUSTED_TYPE` bilan chaqiradi, `IN_PLACE` ni hech qachon ishlatmaydi — advisory'larga yetib bo'lmaydi. `src/lib/monaco-bundle.test.ts` Monaco yangilanganda buni qayta tekshiradi.
- **Haqiqiy HTTP provayder** to'liq tarmoq yo'li orqali sinaldi (`test/ai-http.test.ts`, mahalliy soxta OpenAI-mos server, `AI_PROVIDER=http`): kalit faqat `Authorization` da, so'rov body'sida kalit/yashirin selektor/email yo'q, 503/502 dan keyin 3-urinishda muvaffaqiyat va `attempts: 3`, upstream xatosi xavfsiz 503 (tafsilot va kalit sizmaydi), real model javobidagi yashirin qoida bloklanadi.
- **Osilib qolgan AI band qilishlari**: ishga tushishda maksimal so'rov vaqtidan (`timeout × attempts + 60 s`) eski `PENDING` qatorlar `ERROR` qilinadi; yoshroqlari boshqa instance'ga tegishli bo'lishi mumkinligi uchun qoldiriladi.
- Testlar: `security.test.ts` 9 ta (+ikki instance umumiy limit, xeshlangan kalitlar, eski band qilishlarni yopish), `ai-http.test.ts` 4 ta, web `proxy.test.ts` 2 ta va `monaco-bundle.test.ts` 1 ta.
- Regressiya: typecheck ✅, lint ✅, format ✅, build ✅, test ✅ (shared 38 + sandbox 15 + web 26 + check-engine 13 + api 236 = **328**), `pnpm audit --prod` ✅. Brauzerda nonce CSP bilan Monaco, sandbox RUN, tutor va analitika oqimlari — CSP buzilishi 0.
- Hal qilinmagan (infratuzilma/tashkiliy): production'da Next oldidagi proksi `X-Forwarded-For` ni almashtirishi kerak; haqiqiy AI provayder uchun DPA; email tasdiqlash (ro'yxatdan o'tishdagi 409 enumeration).

### 14B — Sandbox security

- Ikki sandbox tekshirildi: brauzerdagi RUN (`apps/sandbox`) va serverdagi CHECK (`packages/check-engine`). Qoida: mavjud bo'lmagan infratuzilma PASS deb ko'rsatilmaydi.
- **RUN sandbox (haqiqiy Chrome E2E, `pnpm --filter @webdizayn/sandbox e2e`) — 21/21:**
  - avvalgi 16 ta: izolyatsiya qilingan origin (alohida site), CSP, iframe cheklovlari (`allow-scripts` faqat), postMessage `runId`/manba tekshiruvi, parent/top DOM, cookie, localStorage, popup, top navigatsiya, fetch, rasm, cheksiz sikl va watchdog;
  - **yangi:** IP literal'dagi "kanareyka" server (nazorat so'rovi bilan) — fetch, XHR, sendBeacon, EventSource, WebSocket, Worker, rasm, CSS `url()`, prefetch, iframe, forma, popup va preview'ni o'zi yo'naltirish (`location.href`) — **birorta so'rov yetib bormadi** (preview navigatsiyasini runner CSP `frame-src` bloklaydi); yuklangandan keyin boshlangan cheksiz siklda web ilova javob beradi (site isolation); begona sayt runner'ni embed qilib boshqara olmaydi (`frame-ancestors` + origin tekshiruvi).
- **CHECK sandbox (haqiqiy Chrome, `test/sandbox.test.ts`):** kanareyka barcha kanallar bo'yicha 0 so'rov oldi (nazorat so'rovi bilan); `file://` (fetch va iframe) o'qilmaydi; xotira bombasi (renderer V8 heap 128 MB) PASS bermaydi, byudjet ichida tugaydi va keyingi tekshiruv normal ishlaydi. Mavjud testlar: Playwright/yuklanish/qadam timeout'lari, qattiq kill va yetim Chrome yo'qligi, env allowlist.
- **Sirlar izolyatsiyasi — masofaviy CHECK worker:** API konteynerida Chrome ishlasa va renderer sandbox o'chiq bo'lsa, eksploit bir xil uid ostida API sirlarini (`/proc/*/environ`) o'qishi mumkin edi. Yangi:
  - `packages/check-engine/src/server.ts` + `server-main.ts` (`pnpm --filter @webdizayn/check-engine start:worker`): faqat `POST /run` va `GET /health`; `Bearer` token (≥32, timing-safe); body ≤1.5 MB (413, ulanish yopiladi); fayl va qoidalar shared sxemalar bilan validatsiya; parallellik + navbat chegarasi (503); har run avvalgidek alohida o'ldirsa bo'ladigan jarayonda; token process env'dan o'chiriladi; config xatolarida faqat o'zgaruvchi nomi.
  - API: `CHECK_ENGINE=remote`, `CHECK_WORKER_URL`, `CHECK_WORKER_TOKEN` (remote'da majburiy). `RemoteCheckExecutor` javobni `parseResult` bilan qayta tekshiradi: PASSED faqat barcha qoida o'tganda; noto'g'ri token, o'chiq worker yoki buzilgan javob — ERROR (hech qachon PASS emas).
  - Testlar: check-engine `server.test.ts` 5 ta (zaif token, faqat /run, 401, 400/413, haqiqiy Chrome'da PASSED), api `check-worker.test.ts` 5 ta (config, haqiqiy verdict, soxta PASS → FAILED, noto'g'ri token/o'chiq worker, API orqali to'liq oqim → mashq PASSED). Kompilyatsiya qilingan `server-main.js` bilan HTTP smoke ham o'tdi.
- **Production artefaktlari (TEKSHIRILMAGAN — lokal Docker yo'q):** `deploy/Dockerfile` (api, check-worker, web, sandbox target'lari; non-root `node`, slim image, API'da brauzer yo'q), `deploy/docker-compose.prod.yml` (read-only root FS + tmpfs, `cap_drop: ALL`, `no-new-privileges`, CPU/xotira/pids limitlari, `checks` va `backend` tarmoqlari `internal: true`, check-worker'da faqat token, ixtiyoriy `runtime: runsc` — gVisor), `deploy/README.md` (haqiqiy infratuzilmada bajariladigan 10 bandlik tekshiruv ro'yxati), `.dockerignore`, `deploy/*.env` gitignore'da.
- Regressiya: typecheck ✅, lint ✅, format ✅, build ✅, test ✅ (shared 38 + sandbox 15 + web 26 + check-engine 21 + api 241 = **341**), sandbox E2E 21/21 ✅.
- **STATUS: READY_WITH_INFRASTRUCTURE_LIMITATIONS.**
- Tekshirilmagan / cheklovlar:
  - Konteynerlar (non-root, read-only, resurs limitlari, tarmoq izolyatsiyasi, gVisor) build qilinmagan va ishga tushirilmagan — `deploy/README.md` ro'yxati bajarilmaguncha PASS emas.
  - OS darajasidagi CPU/xotira limitlari (cgroups) lokal Windows'da yo'q; faqat V8 heap limiti va vaqt byudjeti tekshirildi. ArrayBuffer kabi heap'dan tashqari xotira faqat konteyner limiti bilan cheklanadi.
  - Chromium renderer sandbox konteynerda user namespace yoki gVisor talab qiladi — CI (ubuntu) va production'da hali tekshirilmagan.
  - Sandbox E2E production domenlarida (alohida registrable domen) ishga tushirilmagan.
- Keyingi qadam: **14C — Production readiness**.

### 14C — Production readiness

Roadmap ro'yxati bo'yicha audit va tuzatishlar:

| Band                                  | Holat                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| env vars                              | ✅ Barcha config kalitlari `.env.example` da; test ularning mosligini tekshiradi (topib tuzatildi: 4 ta hujjatsiz o'zgaruvchi). `KEY=` bo'sh qiymat endi "berilmagan" deb olinadi — shablonni o'zgartirmay nusxalash ishlaydi (avval `METRICS_TOKEN=`/`CHECK_WORKER_URL=` validatsiyadan yiqilardi).                                                                                                                                                                                                                        |
| secrets                               | ✅ Production'da: `WEB_ORIGINS` faqat https, PGlite taqiqlangan, AI URL https; config xatolarida faqat nom; worker tokeni process env'dan o'chiriladi; `deploy/*.env` gitignore'da; grep skan toza; CI'da gitleaks.                                                                                                                                                                                                                                                                                                         |
| migrations                            | ✅ `db:migrate:prod` (`node dist/db/migrate.js`, dev bog'liqliksiz); Postgres yo'lida advisory lock (parallel deploy); CI'da schema↔migratsiya drift tekshiruvi.                                                                                                                                                                                                                                                                                                                                                            |
| indexes                               | ✅ `0010_analytics_indexes.sql`: kurs bo'yicha o'qiladigan jadvallar (check_runs, lesson_progress, student_exercises, quiz_attempts, submissions, submission_versions, submission_reviews.reviewer).                                                                                                                                                                                                                                                                                                                        |
| health/readiness                      | ✅ `/health` (liveness), `/health/ready` — DB majburiy, masofaviy CHECK worker holati ko'rsatiladi lekin trafikni to'xtatmaydi.                                                                                                                                                                                                                                                                                                                                                                                             |
| Redis/BullMQ                          | ⚠️ Kerak bo'lgan joylar boshqacha hal qilindi: limitlar Postgres'da (14A); CHECK navbati instance ichida, lekin **ko'p instance xatosi tuzatildi** — avval har bir restart boshqa instance'larning ishlayotgan CHECK'larini ham ERROR qilardi. Endi faqat maksimal ishlash vaqtidan eski run'lar yopiladi va har daqiqada davriy tozalash bor (CHECK, submission CHECK, AI band qilishlari). BullMQ'siz qolgan cheklov: ishdan chiqqan instance navbatidagi ishlar qayta bajarilmaydi (ERROR bo'ladi, talaba qayta bosadi). |
| logging                               | ✅ `common/observability.ts`: JSON qatorlar (`LOG_FORMAT`, production'da default `json`), `LOG_LEVEL`, har so'rov uchun bitta qator (method, path — query'siz, status, ms, requestId). Cookie, body, query, IP loglanmaydi. Nest'ning o'z loglari ham JSON (`NestLogAdapter`).                                                                                                                                                                                                                                              |
| errors                                | ✅ `AllExceptionsFilter`: kutilmagan xato → umumiy 500 `{statusCode, message, requestId}`, tafsilot faqat logda; middleware 4xx (body-parser 413/400) o'z statusini saqlaydi (tuzatish jarayonida topilgan regressiya). `X-Request-Id` (to'g'ri formatdagi kiruvchi qiymat saqlanadi).                                                                                                                                                                                                                                      |
| monitoring hooks                      | ✅ `/metrics` (Prometheus, `METRICS_TOKEN` bo'lmasa 404, noto'g'ri token 401): so'rovlar soni (status sinfi), davomiylik, CHECK navbati, xotira, uptime. Tavsiya etilgan alertlar README'da.                                                                                                                                                                                                                                                                                                                                |
| backups                               | 📄 Strategiya va oylik tiklash mashqi `deploy/README.md` da, `deploy/backup.sh` (`pg_dump -Fc` + `pg_restore --list` tekshiruvi, saqlash muddati) — **haqiqiy infratuzilmada sinalmagan**.                                                                                                                                                                                                                                                                                                                                  |
| rate limits / CORS / security headers | ✅ 14A'da; production smoke'da qayta tekshirildi: begona Origin POST 403, cookie `HttpOnly; Secure; SameSite=Lax`, HSTS, nosniff, CSP (helmet).                                                                                                                                                                                                                                                                                                                                                                             |
| production build                      | ✅ `pnpm -r build`; compiled API production rejimida ishga tushirildi.                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Docker build                          | ⚠️ Lokal Docker yo'q — CI'ga `images` job qo'shildi (4 target build + root emasligini tekshirish); birinchi marta GitHub'da tekshiriladi.                                                                                                                                                                                                                                                                                                                                                                                   |
| migration deployment                  | ✅ README'da tartib; compiled `migrate.js` Postgres protokoli orqali ishga tushirildi.                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| secret scan                           | ✅ grep toza, CI gitleaks.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

- **Haqiqiy `pg` drayveri yo'li birinchi marta sinaldi** (`@electric-sql/pglite-socket@0.2.11`, dev): `test/postgres-driver.test.ts` — migratsiya idempotentligi, ro'yxatdan o'tish→kurs→yozilish→CHECK (FOR UPDATE)→dars tugashi→AI tutor (advisory lock)→analitika, DB limitlari; **pool = 1 ulanish** (tranzaksiyadan tashqarida so'rov bo'lsa test osilib qolardi). `DATABASE_POOL_MAX` sozlamasi qo'shildi.
- **Production smoke** (compiled `dist`, `NODE_ENV=production`, `postgres://` pglite-socket orqali): `migrate.js` → "Migrations applied"; `/health/ready` ok; `/metrics` 401/200; begona Origin 403; Secure cookie; 95 ta log qatorining hammasi JSON.
- CI: migratsiya drift, `pnpm audit --prod`, Docker image'lar (matrix) qo'shildi.
- Testlar: `test/production.test.ts` 9 ta (request-id, log redaksiyasi, umumiy 500, middleware 4xx, metrics 404/401/200, readiness, `.env.example` mosligi va nusxalab yuklash), `postgres-driver.test.ts` 3 ta, config va tiklash testlari yangilandi.
- Regressiya: typecheck ✅, lint ✅, format ✅, build ✅, test ✅ (shared 38 + sandbox 15 + web 26 + check-engine 21 + api 253 = **353**), `pnpm audit --prod` ✅, drift yo'q.
- **STATUS: READY_WITH_INFRASTRUCTURE_LIMITATIONS.**
- Infratuzilmaga bog'liq (soxta PASS qo'yilmadi): Docker image'lar va `deploy/README.md` tekshiruv ro'yxati; real managed Postgres (wire protokoli PGlite orqali sinaldi, lekin haqiqiy Postgres server emas); backup/restore mashqi; edge proksi (`X-Forwarded-For`); BullMQ'siz instance ichidagi CHECK navbati.
- Keyingi qadam: **15A — Full E2E**.
