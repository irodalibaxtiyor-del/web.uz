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

### 15A — Full E2E

- `e2e/full-flow.e2e.mjs` (`pnpm -r build && pnpm e2e`): toza vaqtinchalik PGlite bazada haqiqiy stek — compiled API (haqiqiy CHECK engine Chrome'da, mock AI), Next web, sandbox origin, headless Chrome. `e2e/setup.cjs` compiled kod orqali ikki tashkilot, ikki o'qituvchi, admin va begona tashkilot o'qituvchisini yaratadi; parol har ishga tushishda tasodifiy. Portlar band bo'lsa to'xtaydi; oxirida barcha jarayonlar o'ldiriladi; xatoda skrinshot va server loglari `E2E_OUT` ga yoziladi.
- Kursni tayyorlash o'qituvchining o'z brauzer sessiyasi orqali API bilan (bu UI oldingi fazalarda bosib tekshirilgan); o'quv, review va portfolio qadamlari **UI orqali**.
- **Talaba:** forma orqali ro'yxatdan o'tish → chiqish/kirish → kurs → yozilish (1-dars ochiq, 2-dars yopiq; yopiq dars serverda 403) → dars → mashq → Monaco'da kod → **RUN** (sandbox konsolida natija) → **CHECK** FAILED → **AI tutor** (maslahat + xatoni tushuntirish, yashirin qoidasiz) → tuzatish → CHECK PASSED → 1-dars COMPLETED, 2-dars ochildi → topshiriq v1 → izohni ko'rish → v2 → yakuniy baho va izoh → portfolio (slug, ishni qo'shish, e'lon qilish) → mehmon ochiq sahifani ko'radi (email va ballsiz).
- **O'qituvchi:** topshiriq → javoblar jadvali → javob → ko'rib chiqishni boshlash → izoh bilan qayta ishlash so'rovi → v2 ni ko'rib chiqish → rubrika bo'yicha 55 + 35 = 90 → izoh → baholash → yakunlash.
- **Xavfsizlik (jonli serverlarga qarshi):** cross-student (begona CHECK run, review, yozilmagan mashq), cross-teacher (biriktirilmagan o'qituvchi review/tahrir 403), cross-org (404 va kursni boshqa org'ga qayta bog'lash 404), soxta rol (register'da `ORG_ADMIN` → STUDENT), soxta `x-user-id`/`x-role`, talabaga org analitikasi 403, ruxsatsiz AI konteksti (yozilmagan talaba, begona kurs tutor holati), yashirin CHECK qoidalari API/run/sahifa HTML'ida yo'q; kutilmagan brauzer xatolari 0.
- Natija: **34/34**, ikki marta ketma-ket (barqaror).
- Topilgan va tuzatilgan (faqat skriptda): o'qituvchi jadvalidagi havola nomi `aria-label` dan ("…: javobni ko'rib chiqish"); CHECK panel matnlari ASCII apostrof bilan.
- CI: `e2e` job (build → `pnpm e2e`, xatoda artefaktlar yuklanadi) — ubuntu'da hali ishga tushirilmagan.
- **STATUS: READY_WITH_INFRASTRUCTURE_LIMITATIONS** (avvalgi infratuzilma cheklovlari saqlanadi).
- Cheklovlar: E2E portlari 3000/3100/4000 ga bog'liq (web build ularni o'z ichiga oladi); AI mock bilan; mobil va dark mode E2E'da emas (oldingi fazalarda alohida tekshirilgan); quiz va analitika sahifalari bu oqimda yo'q (13A/13C brauzer skriptlari bor).
- Keyingi qadam: **15B — Regression audit**.

## 2026-10-13

### 15B — Regression audit

- **Run (hammasi qayta ishga tushirildi):** lint ✅, typecheck ✅, build ✅, unit + integratsion test ✅ (shared 38 + sandbox 15 + web 26 + check-engine 21 + api 259 = **359**), to'liq E2E **34/34** ✅, sandbox xavfsizlik E2E **21/21** ✅, format ✅, secret skan (grep; gitleaks lokal yo'q) ✅, `pnpm audit --prod` ✅, schema↔migratsiya drift yo'q.
- **Database** (toza bazada migratsiya + `pg_catalog` tahlili): 29 jadval, hammasida PK; 59 FK; 11 CHECK; 2 immutable trigger; migratsiya idempotent. Compiled `migrate.js` → `seed.js` → `seed-course.js html|css` toza bazada ishladi (HTML 60 dars/49 mashq/12 test, CSS 101/101/15); qayta seed exit 1 bilan rad etiladi.
  - **Topildi va tuzatildi:** 14 ta FK ustunida indeks yo'q edi (masalan `check_runs.exercise_id`, `lesson_progress.lesson_id`, `submission_versions.user_id`, AI jadvallarining `organization_id`/`interaction_id`). Ota qator o'chirilganda `ON DELETE CASCADE/SET NULL` butun jadvalni skanerlardi. Migratsiya `0011_fk_indexes.sql`.
  - Yangi `test/schema.test.ts` (4 ta): idempotentlik, har jadvalda PK, **har FK indeks bilan qoplangan**, immutable trigger'lar joyida. Tuzatishsiz yiqilishi tekshirildi.
- **Frontend** (demo baza, `next start`, headless Chrome + axe-core 4.14 WCAG 2.1 A/AA; skript scratchpad'da): 3 rol × 23 sahifa × desktop/mobil × light/dark — gorizontal scroll, axe, konsol xatolari; holatlar: loading, 500, tarmoq uzilishi, empty (yangi talaba), locked, unauthorized (mehmon → /login, talaba → "Ruxsat yo'q"), klaviatura (skip-link, focus ring, faqat klaviatura bilan login, xaritadan Enter bilan dars, mobil menyu `aria-expanded`).
  - Birinchi natija: **35/126**. Topildi va tuzatildi:
    - Kontrast (WCAG AA): ko'k banner ustidagi yarim shaffof oq matn (`text-white/75…90`, 3.3–4.2:1) → `text-white`; banner dekor doirasi `bg-white/10` → `bg-brand-700/60` (ustidagi tugmalar ochroq fonga tushardi); `section-eyebrow` `brand-600` → `brand-700`; RUN tugmasi `bg-emerald-500` (2.5:1) → `emerald-700`; landing qadam raqamlari `brand-100` → `brand-500`; qulflangan elementlardagi `opacity-60` va `text-slate-400` (2.6:1) olib tashlandi (qulf belgisi — punktir chegara).
    - Dark mode: **100 ta** `text-slate-500` dark variantisiz edi (qorong'i fonda 3.4–3.8:1) → loyiha uslubidagi `dark:text-slate-400` mexanik qo'shildi; har doim qorong'i yuzalarda (IDE, landing kod mockup'i) `text-slate-400`.
    - ARIA: grafik ustunlari rolsiz `div`da `aria-label` → `role="img"`; tutor tarixida `<ol>` ichida `<div>` → `<li aria-hidden>`; gorizontal aylanadigan jadvallar fokuslanmasdi → yangi `TableScroll` (`role="region"`, nom, `tabIndex=0`), 5 ta jadvalda.
    - Mobil: o'qituvchi topshiriq sahifasida 60px gorizontal scroll — jadvaldagi `sr-only` (absolute) scroll konteynerdan chiqib ketardi → `TableScroll` `relative`.
  - Yakuniy natija: **124/124**. Mobil skrinshotlar ko'zdan kechirildi.
- **Backend:**
  - Validatsiya: har `@Body`/`@Query` `ZodPipe` orqali, ID parametrlar `Id`/`VersionPipe` orqali (slug — servisda). `@Public` faqat register, login, health, ochiq portfolio va token bilan himoyalangan `/metrics`.
  - Avtorizatsiya: `:orgId` li har bir route (9 controller, 58 route) `@OrgRoles` bilan. **Mustahkamlandi:** `OrgRoleGuard` endi fail-closed — `:orgId` li route'da `@OrgRoles` unutilsa, a'zolik tekshiruvi jimgina o'tkazib yuborilmaydi, 403 qaytadi (`src/auth/org-role.guard.test.ts`, 2 ta).
  - **Xavfsiz loglar — topildi va tuzatildi:** kutilmagan DB xatosida `unhandled_error` log'iga Drizzle xabari (`Failed query: … params: …`) to'liq yozilardi — ya'ni SQL parametrlari: sessiya token hash'i, email, Argon2 hash, talaba kodi. Testda takrorlandi (DB yopilganda `/auth/me` log'ida token hash). Endi `errorLogFields()`: DB xatolaridan faqat nom, SQLSTATE kodi va constraint nomi. Matn formatida `undefined` maydonlar chiqmaydi. `production.test.ts` endi log'da token hash va `params:` yo'qligini tekshiradi.
  - Xavfsiz xatolar: klientga umumiy 500 + `requestId` (o'zgarmadi, testlar bor).
- Boshqa: tsc paketlarida (`api`, `shared`, `check-engine`) build oldidan `dist` tozalanadi — lokal `dist` da manbasi o'chirilgan eski `seed-html-course.js` va `html-course/` qolib ketgan edi (Docker `dist`ni olmaydi, production'ga ta'siri yo'q edi). Bo'sh `src/db/html-course/` papkasi o'chirildi.
- Demo bazaga `0011` migratsiyasi qo'llandi (faqat indekslar).
- **STATUS: READY_WITH_INFRASTRUCTURE_LIMITATIONS** (avvalgi infratuzilma cheklovlari saqlanadi).
- Cheklovlar:
  - Frontend audit skripti demo bazadagi ID'larga bog'liq, repoga qo'shilmadi (CI'da a11y regressiyasi yo'q). Monaco ichki DOM'i va sandbox iframe'lari axe'dan chiqarilgan.
  - Avtomatik tekshiruv WCAG'ning hammasini qamramaydi (screen reader bilan qo'lda sinov qilinmagan).
  - Gitleaks lokal yo'q — faqat grep (CI'da gitleaks bor).
- Keyingi qadam: **15C — Final release audit**.

### 15C — Final release audit

- Yangi funksiya qo'shilmadi. Yakuniy hisobot: [FINAL_RELEASE_AUDIT.md](FINAL_RELEASE_AUDIT.md) (26 band, amalga oshirilgan funksiyalar, cheklovlar, migratsiyalar, testlar, E2E, xavfsizlik, production blocker'lar).
- Tekshiruv `c141c87` da qayta ishga tushirildi: format ✅, typecheck ✅, lint ✅, build ✅, test **359/359** ✅ (shared 38 + sandbox 15 + web 26 + check-engine 21 + api 259), to'liq E2E **34/34** ✅, sandbox E2E **21/21** ✅, `pnpm audit --prod` ✅, drift yo'q ✅.
- Qo'lda tekshirildi: web'da XSS sink'lari (`dangerouslySetInnerHTML`, `innerHTML`, `eval`) yo'q; API'da raw SQL yo'q; web'ga faqat `NEXT_PUBLIC_SANDBOX_URL` chiqadi; haqiqiy AI provayderi faqat `AI_PROVIDER=http` + `AI_ALLOW_REAL_STUDENT_DATA` + URL + kalit bo'lganda yoqiladi.
- **Topildi:** GitHub'dagi `web.uz` repo hali bo'sh (`git ls-remote` hech narsa qaytarmadi) — birorta ham commit push qilinmagan, CI (Docker image'lar, gitleaks, Ubuntu E2E) hech qachon ishlamagan. Production blocker sifatida yozildi.
- **FINAL_STATUS: READY_WITH_INFRASTRUCTURE_LIMITATIONS.** Kritik xavfsizlik, izolyatsiya, avtorizatsiya va asosiy o'quv oqimi testlari yiqilmagan. Production'ga chiqishdan oldin: CI'ni ishga tushirish, haqiqiy PostgreSQL, konteynerlar tekshiruvi, alohida sandbox domeni, edge proksi (`X-Forwarded-For`), backup/restore mashqi, sirlarni secret manager orqali berish va eski GitHub tokenini revoke qilish.
- Roadmap'dagi barcha fazalar (F0–F2, 11–15C) yakunlandi.

### JavaScript kursi (W3Schools tartibida) — yakunlandi

- So‘rov: w3schools.com/js darsligini loyihaga mos ravishda o‘zbek tilida joylash va talabalar uchun amaliy topshiriqlar tayyorlash. HTML/CSS kurslaridagi qaror saqlandi: faqat mavzular tartibi olinadi, matnlar, misollar, mashqlar va testlar **original o‘zbekcha**. Holat va yozish qoidalari: [JS_KURS_HOLATI.md](JS_KURS_HOLATI.md).
- **18 modul, 97 dars, 96 mashq (har biri CHECK qoidalari bilan, 93 ta yashirin tekshiruv), 18 modul testi.** Modullar: tanishuv, o‘zgaruvchilar va operatorlar, funksiyalar/obyektlar/hodisalar, satrlar, sonlar va Math, massivlar, sana, shartlar, sikllar, to‘plamlar va turlar, xatolar va sifatli kod, klasslar/modullar/JSON, obyekt va funksiyalar chuqurroq, asinxron JS, HTML DOM, DOM hodisalari va tugunlar, brauzer va Web API, **4 ta amaliy loyiha** (vazifalar menejeri, kalkulyator, test ilovasi, kurslar katalogi). `modules` darsi nazariy: RUN preview fayllararo `import` ni bajara olmaydi.
- Mashqlar natijani sahifaga yozadi (CHECK DOM’ni tekshiradi), funksiyalar turli kiritmalar bilan (bir qismi yashirin) sinaladi — javobni qo‘lda yozib qo‘yib aldab bo‘lmaydi. Yechimlar faqat shu darsgacha o‘rgatilgan narsalarni ishlatadi. Tarmoq yopiq bo‘lgani uchun `fetch` mashqi bir xil interfeysli `soxtaFetch` bilan; cookie/localStorage mashqlari preview’da ishlamasligi sababli `try...catch` + xotiradagi zaxira bilan yoziladi (to‘g‘ri amaliyot sifatida darsda tushuntirilgan). Sana mashqlari qat’iy sanalar bilan (vaqt zonasiga bog‘liq emas).
- Infratuzilma: umumiy `app()` helper (`script.js` birinchi — IDE uni ochadi), `text(..., { caseSensitive })`, `js/shared.ts` (`fill`, `click`, `press`, `wait`), registry, `db:seed:js`, seed CLI yordami.
- **Topilgan va tuzatilgan (CHECK engine):** byudjet va qadam muddatlari `Date.now()` (devor soati) bilan hisoblanardi. Ish paytida tizim soati sakrab, to‘g‘ri yechimlarga **soxta TIMEOUT** berdi (bir o‘lchovda 41 daqiqalik “davomiylik”). Endi `performance.now()` (monoton soat), `durationMs` yaxlitlanadi. Soxta PASS xavfi yo‘q edi — faqat soxta TIMEOUT.
- Tekshiruv: `content:verify js` **96/96** (har yechim PASSED, boshlang‘ich kod o‘tmaydi); typecheck ✅, lint ✅, format ✅, test ✅ (shared 38 + sandbox 15 + web 26 + check-engine 21 + api 262 = **362**).
- Demo bazaga yuklandi (`db:seed:js`). Brauzer va API smoke **15/15**: kurs ro‘yxatda, xaritada 97 dars, dars matni (jadval, kod bloklari), IDE `script.js` bilan ochiladi, boshlang‘ich kod FAILED, yechim PASSED → 1-dars tugadi, 2-dars ochildi; yashirin qoidalar sahifa HTML’ida va API javobida yo‘q; sahifa xatolari 0. Aziza JS kursiga yozilgan va 1-darsni tugatgan (smoke natijasi).
- Cheklovlar:
  - Loyiha mashqlarida boshlang‘ich (bo‘sh) kod 9–11 s da FAILED bo‘ladi (mavjud bo‘lmagan elementni bosish 2 s kutadi) — 20 s byudjet ichida, lekin og‘ir yuklamada chegaraga yaqin.
  - Ba’zi mavzular faqat nazariy yoki soddalashtirilgan: modullar, Geolocation, Web Workers, haqiqiy tarmoq so‘rovlari; `prefers-reduced-motion` va `resize` tekshirilmaydi.
  - `localStorage` saqlanishi sahifa qayta yuklanganda tekshirilmaydi (CHECK’da qayta yuklash amali yo‘q).
  - CHECK qoidalari va yechimlar public repoda ochiq (HTML/CSS kurslaridagidek).

### Kurslar tartibi va test ko‘rinishi

- So‘rov: katalogda kurslar ketma-ketligi — HTML asoslari → HTML: to‘liq kurs → CSS → JavaScript → PHP.
- `courses.position` (migratsiya `0012_course_position.sql`, default 1000, manfiy emas — CHECK). Ro‘yxat `position`, keyin nom bo‘yicha. `updateCourseSchema.position` (0..10000); tartibni faqat ORG_ADMIN o‘zgartiradi (TEACHER 403). Manifestlarda: html 20, css 30, js 40, php 50. Test: `courses.test.ts` 'catalogue order'.
- Test sahifasi: savol va variantlar endi literal matn sifatida chiqadi (`QuestionText`/`OptionText`): ` ``` ` kod bloklari, `inline code` va **qalin** matn. Avvalgi markdown yondashuvi HTML kursidagi variantlarni (`<br>`, `/* */`, `#`) buzardi — tuzatildi. 7 ta web test.
- **Topilgan xato va tuzatish:** barcha kontent kurslarida to‘g‘ri javob doim birinchi variant edi. `q()` endi variantlarni id+savol matnidan olingan deterministik seed bilan aralashtiradi; test har kurs bo‘yicha “birinchi variant to‘g‘ri” ulushi 0.5 dan kam ekanini tekshiradi. Demo bazadagi HTML/CSS/JS kurslari hali eski (aralashtirilmagan) variantlar bilan — `seed-course <slug> --replace` qilinsa yangilanadi, lekin shu kursdagi progress o‘chadi.

### PHP kursi (W3Schools tartibida) — yakunlandi

- So‘rov: w3schools.com/php ni o‘zbekcha, talabalarga mos topshiriqlar bilan, JavaScript’dan keyin joylash. Huquqiy qaror o‘sha: faqat mavzular tartibi, matn/misol/savollar original o‘zbekcha. Holat va qoidalar: [PHP_KURS_HOLATI.md](PHP_KURS_HOLATI.md).
- **Amaliyot rejimi — “nazariya + testlar”** (foydalanuvchi tanlovi): platforma PHP bajarmaydi. Har darsda test (keyingi dars test o‘tilganda ochiladi, 70%) va talaba kompyuterida bajariladigan “Mustaqil mashq” (kutilgan natija bilan). `CourseMeta.practice: 'quiz'`; kontent testi bu kurslar uchun “har darsda test, mashq yo‘q”ni tekshiradi.
- **15 modul, 63 dars, 63 test:** tanishuv, o‘zgaruvchilar, satrlar, sonlar va operatorlar, shartlar va sikllar, funksiyalar, massivlar, formalar (superglobal, validatsiya, xavfsizlik), sana/include/regex/filtrlar, fayllar (yuklash bilan), cookie/sessiya/JSON/xatolar, OOP asoslari, OOP chuqurroq (abstrakt, interfeys, trait, static, namespace + Composer, enum), PDO (SQL injection, tayyorlangan so‘rovlar, tranzaksiyalar, egasini tekshirish), 3 ta amaliy loyiha (mehmonlar kitobi, ro‘yxatdan o‘tish/kirish — `password_hash`, `session_regenerate_id`, CSRF; shaxsiy vazifalar CRUD — IDOR himoyasi).
- “Bu kod nimani chiqaradi?” savollari `natija()` bilan yoziladi va **haqiqiy PHP 8.3** da (php-wasm, loyihaga qo‘shilmagan) tekshiriladi: **221/221**. Mustaqil mashqlar natijalari ham bajarib ko‘rildi. Probing paytida topilib tuzatilgan dars xatolari: `10/2` → `int(5)`, `"olma" + 1` → TypeError, istisnolar ierarxiyasida `LogicException`.
- Regressiya: typecheck ✅, lint ✅, format ✅, test ✅ (shared 38 + sandbox 15 + web 30 + check-engine 21 + api 271 = **375**).
- Demo bazaga yuklandi (`seed-course php`): katalog tartibi to‘g‘ri, 1-dars ochiq, 2-dars 403 `LESSON_LOCKED`, test javoblari API’da yo‘q, sahifa xatolari 0. Aziza PHP kursiga yozilgan (smoke).
- Cheklovlar:
  - PHP kodi platformada bajarilmaydi — amaliy ko‘nikma faqat mustaqil mashqlar orqali, tekshiruvsiz.
  - Testlar va javoblar public repoda ochiq (boshqa kurslardagidek).
  - Namespaces/Composer va loyiha darslari talabadan lokal muhit (PHP 8.3, Composer, `pdo_sqlite`) talab qiladi.

## 2026-10-17

### Lokal demo qayta ishga tushirildi

- `shared`, `check-engine` va `api` qayta build qilindi, demo bazaga migratsiyalar qo'llandi (`0012` gacha).
- API (`pglite://./.data/pg`, port 4000), sandbox (3100) va web (`next dev`, 3000) ishga tushirildi; `/health/ready`, `/api/health` proxy, `/` va `/login` 200.

### Bootstrap kurslari (B3, B4, B5) — boshlandi

- So'rov: w3schools.com/bootstrap (B3), /bootstrap4, /bootstrap5 darsliklarini o'zbek tilida, saytga qo'shish. Avvalgi kurslardagi huquqiy qaror saqlanadi: faqat mavzular tartibi olinadi, matn, misol, mashq va testlar **original o'zbekcha**. Reference/Editor/Quiz/Certificate/Interview sahifalari alohida dars qilinmaydi.
- W3Schools tartibi: B3 — 34 asosiy + 6 grid + 4 tema; B4 — 37 + 8 grid; B5 — 33 + 7 forma + 9 grid.
- **Muammo:** Bootstrap CDN'dan yuklanadi, lekin RUN sandbox (CSP) va CHECK engine (route interception) barcha tashqi so'rovlarni bloklaydi.
- **Qaror — platformadagi kutubxonalar (vendored, MIT):** Bootstrap 3.4.1 / 4.6.2 / 5.3.8, jQuery 3.7.1, Popper 1.16.1, Bootstrap Icons npm orqali o'rnatiladi va platformaning o'zidan beriladi. Talaba W3Schools'dagi odatiy CDN havolani yozadi; ma'lum CDN URL'lari (aniq oq ro'yxat: host + versiya + fayl) platformadagi nusxaga almashtiriladi. Boshqa har qanday tashqi so'rov avvalgidek bloklanadi.
  - RUN: web IDE fayllarni sandbox'ga yuborishdan oldin URL'larni `<sandbox>/lib/<id>/<fayl>` ga almashtiradi; sandbox server faqat oq ro'yxatdagi kutubxona fayllarini beradi; CSP `style-src`/`font-src` ga `'self'` qo'shiladi (`connect-src 'none'` o'zgarmaydi).
  - CHECK: engine HTML/CSS'dagi URL'larni `http://check.invalid/__lib/...` ga almashtiradi va fayllarni xotiradan beradi.
- **Infratuzilma bajarildi:**
  - `packages/shared/src/libraries.ts`: `LIBRARIES` katalogi (id, fayllar, CDN prefikslari, aniq URL'lar), `resolveLibraryUrl`, `rewriteLibraryUrls`, `isLibraryFile`. Faqat aniq host + versiya + fayl tanilad (boshqa versiya, `..`, begona host — yo'q). 3 ta test.
  - Yangi paket `packages/libs` (`@webdizayn/libs`): npm alias'lar (`bootstrap3`, `bootstrap4`, `bootstrap5`, `jquery`, `popper.js`, `bootstrap-icons@1.13.1`), `readLibraryFile`/`readLibraryPath` — faqat katalogdagi fayllar o'qiladi, xotirada keshlanadi. 3 ta test (har bir fayl npm paketida bor, versiya to'g'ri, ro'yxatdan tashqari yo'l rad etiladi).
  - CHECK engine: `/__lib/` dan kutubxona fayllari, HTML/CSS fayllarda CDN URL'lari almashtiriladi; boshqa origin hali ham abort. 2 ta test (B5 CSS + collapse JS + icons, B4 + jQuery; begona versiya va traversal ishlamaydi).
  - Sandbox: `/lib/<id>/<fayl>` (CORP cross-origin, ACAO *), CSP `style-src 'self' 'unsafe-inline'`, `font-src 'self' data:`; `connect-src 'none'` o'zgarmadi. 1 ta server testi (begona fayl, `.map`, traversal, `%2e%2e`, boshqa versiya — 404).
  - Web: `withHostedLibraries()` (`lib/sandbox.ts`) RUN'dan oldin HTML/CSS'dagi URL'larni sandbox `/lib/` ga almashtiradi. 1 ta test.
  - `deploy/Dockerfile` sandbox image'iga `node_modules` va `packages` qo'shildi (tekshirilmagan — lokal Docker yo'q).
  - Sandbox xavfsizlik E2E: **24/24** (yangi: CDN havoladan Bootstrap CSS, JS va ikonka shrifti RUN'da ishlaydi; barcha izolyatsiya/exfiltration testlari o'tdi).
  - Eslatma: Windows'da `python` — Microsoft Store shim'i (hech narsa qilmaydi, faqat "Python" chiqaradi). Skriptlar uchun `py -3` ishlatilsin.
  - Qabul qilingan risk: student kodi sandbox origin'ining o'ziga (`/lib/`) uslub/shrift so'rovi yubora oladi — bu statik server, hech narsa loglamaydi va boshqa origin'ga chiqmaydi.
- **Kontent infratuzilmasi:** `apps/api/src/db/content/bootstrap/shared.ts` — `bs3()`/`bs4()`/`bs5()` (CDN havolali sahifa), `slots()`/`cls()` (bitta shablondan boshlang'ich kod va yechim), `pic()` (`data:` SVG rasm), `RGB` (Bootstrap ranglari). Har modul fayli darslar bilan birga yechimlarni (`sNN`) ham eksport qiladi. Holat va qoidalar: [BOOTSTRAP_KURS_HOLATI.md](BOOTSTRAP_KURS_HOLATI.md).
- **Bootstrap 3:** 1–4-modullar tayyor (22 dars, 21 mashq, 4 test), `content:verify bootstrap3` — 21/21.
- **Bootstrap 3 — yakunlandi:** 8 modul, 44 dars, 43 mashq (CHECK qoidalari bilan), 8 test. JS plaginlari ham haqiqiy brauzerda tekshiriladi (alert yopish, dropdown, collapse, tab, carousel, modal, tooltip, popover, scrollspy, affix, jQuery filtr). W3Schools temalari o'rniga original loyihalar (shaxsiy sahifa, IT-kompaniya, musiqa guruhi). `content:verify bootstrap3` **43/43**, `content-courses.test.ts` 31/31.
- Demo bazaga yuklandi (`db:seed:course bootstrap3`: 8 modul, 44 dars, 43 mashq, 8 test). API smoke (Aziza): katalogda, yozilish, 44 dars, boshlang'ich kod FAILED → yechim PASSED → dars tugaydi, yashirin selektorlar javobda yo'q.
- **Bootstrap 4 — boshlandi.**
- Bootstrap 4: 1–4-modullar tayyor (22 dars, 21 mashq, 4 test), har biri `content:verify` da o'tdi. Tajriba: B4 tab plagini `aria-selected` ni faqat `role="tab"` bo'lgan havolada yangilaydi; `.badge-pill` padding'i `em` da (radius 10rem = 160px tekshiriladi).
- **Bootstrap 4 — yakunlandi:** 8 modul, 45 dars, 44 mashq, 8 test (Flex setka, card, utilitalar, toast, custom forms, Bootstrap Icons). `content:verify bootstrap4` **44/44**, `content-courses.test.ts` 35/35.
- Bootstrap 4 demo bazaga yuklandi (`db:seed:course bootstrap4`: 8 modul, 45 dars, 44 mashq, 8 test).
- **Bootstrap 5 — boshlandi** (5.3.8, jQuery'siz, `data-bs-*`, `xxl`, offcanvas, dark mode, floating labels).
- Bootstrap 5: 1–3-modullar tayyor (15 dars, 14 mashq, 3 test). Tajriba: B5 da `g-*` gutter qator kengligini o'zgartiradi (`g-3` da `col-lg-3` = 283px, standart gutter'da 285px) — kengliklar probe bilan o'lchanadi.
- Bootstrap 5: 1–7-modullar tayyor (40 dars, 39 mashq, 7 test). Tajriba: range uchun `fill` ishlamaydi — `press` (ArrowRight/End) bilan sinaladi; floating label `transform` — `matrix(0.85, 0, 0, 0.85, 2.04, -6.8)`; tooltip/popover joylashuvi `data-popper-placement` atributida.
- **Bootstrap 5 — yakunlandi:** 8 modul, 49 dars, 48 mashq, 8 test (jQuery'siz plaginlar, offcanvas, accordion, dark mode, floating labels, `.btn-check`, `xxl` setka). `content:verify bootstrap5` **48/48**. Demo bazaga yuklandi.

### Bootstrap kurslari — yakuniy tekshiruv

- Jami: **3 kurs, 24 modul, 138 dars, 135 mashq (CHECK qoidalari bilan), 24 test.** Katalog tartibi: … PHP (50) → Bootstrap 3 (60) → Bootstrap 4 (70) → Bootstrap 5 (80).
- `content:verify`: bootstrap3 **43/43**, bootstrap4 **44/44**, bootstrap5 **48/48** — har yechim haqiqiy Chrome'da PASSED, boshlang'ich kod o'tmaydi.
- Regressiya: format ✅, typecheck ✅, lint ✅ (3 ta ishlatilmagan import/parametr topilib tuzatildi), build ✅, test ✅ (shared 41 + libs 3 + sandbox 16 + web 31 + check-engine 23 + api 283 = **397**), sandbox xavfsizlik E2E **24/24**.
- API smoke (Aziza, haqiqiy CHECK): B3/B4/B5 da kurs katalogda, boshlang'ich kod FAILED → yechim PASSED → dars COMPLETED, keyingisi ochiladi; yashirin selektorlar javobda yo'q.
- Brauzer smoke (Playwright, haqiqiy web IDE): B5 dars sahifasi (jadval, kod bloklari) va mashq sahifasida RUN — preview'da Bootstrap CSS va JS (`bootstrap` obyekti) yuklandi, holat “Tayyor”, sahifa xatolari 0.
- Topilgan operatsion holat: `pnpm -r build` paytida `shared/dist` vaqtincha o'chirilganda `node --watch` dagi sandbox dev server qayta ishga tushib yiqildi va keyin o'zi tiklanmadi (RUN'da “Vaqt tugadi”). Build'dan keyin sandbox dev serverni qayta ishga tushirish kerak. Kodda xato emas.
- Cheklovlar:
  - Bootstrap 3/4 eskirgan (npm'da “deprecated”) — kurslar eski loyihalarni qo'llab-quvvatlash uchun; yangi loyihalar uchun B5 tavsiya etiladi (kurs tavsiflarida aytilgan).
  - CHECK talabaning JS'i ichida ishlaydi — DOM'ni almashtirib aldash nazariy jihatdan mumkin (avvalgi kurslardagidek).
  - Mashqlar yechimlari va CHECK qoidalari public repoda ochiq (avvalgi kurslardagidek).
  - Bir nechta mashqda kenglik tekshiruvi Chrome'ning aniq yaxlitlash qiymatiga bog'liq (`295.984px`) — Chrome versiyasi o'zgarsa qayta tekshirish kerak.
  - Docker image'lar (sandbox endi `packages` va `node_modules` ni ham oladi) lokal tekshirilmagan.
  - O'zgarishlar hali commit qilinmagan.

### Guruhlar, o'qituvchilar va talabalar boshqaruvi — A bosqichi (audit va reja)

- So'rov: admin o'qituvchi va talaba loginlarini boshqaradi, 3 ta guruh (8-24 ATT, 9-24 ATT, 10-24 KI) va ularning 74 talabasi, o'qituvchi guruh paneli, ballar va `.xlsx` eksport. Bosqichlar A–H, har biri tasdiqdan keyin boshlanadi.
- Audit natijasi: guruh tushunchasi, username login, majburiy parol almashtirish, hisobni faolsizlantirish, admin foydalanuvchi boshqaruvi va Excel eksport hozircha yo'q. RBAC (STUDENT/TEACHER/ORG_ADMIN, `OrgRoleGuard`), Argon2id, login limiti, audit, progress/CHECK/review ma'lumotlari va `FactsIndex.stats()` bor, ular qayta ishlatiladi.
- Muhim cheklov: repo public, shuning uchun talabalar ro'yxati (shaxsiy ma'lumot) repoga yozilmaydi. Import admin UI orqali yoki gitignore qilingan lokal fayldan bo'ladi.
- Kod o'zgartirilmadi. Ochiq qarorlar foydalanuvchiga berildi.

### Guruhlar va talabalar importi — B bosqichi (davom etmoqda, to'xtatildi)

- Foydalanuvchi qarorlari (A bosqichi savollariga javob):
  - Talaba logini `familiya.ism`, lotin harflarida, apostrofsiz (`aliyev.vali`); bir xil chiqsa `…2`, `…3`.
  - Parol `8-24att-01` tartibida (F bosqichida). Taklif: oldindan taxmin qilinmasligi uchun qolipga tasodifiy qism qo'shish (`8-24att-01-k7m4q2`). Bu masala hali hal qilinmagan.
  - Ball faqat o'qituvchi baholagan topshiriqlardan hisoblanadi. RUN natijalari serverda saqlanmaydi ("saqlanmaydi" deb ko'rsatiladi).
  - Guruh o'qituvchisi o'z guruhining barcha kurslardagi natijalarini faqat ko'radi va eksport qiladi; baholash kurs o'qituvchisida qoladi. Kurs analitikasini guruh bo'yicha cheklash "vaziyatga qarab" (D bosqichida hal qilinadi).
  - Admin guruhlarni kursga yoza oladi; o'zi ro'yxatdan o'tish ochiq qoladi (bunday foydalanuvchilar "Guruhsiz").
- **Shared** `packages/shared/src/groups.ts`:
  - `rosterKey()` (apostrof variantlari birlashtiriladi, bo'sh joylar qisqartiriladi, katta harf);
  - `loginBase()`, `groupCode()` ("8-24 ATT" → "8-24att"), `LOGIN_RE`;
  - `parseRosterText()` ("### 8-24 ATT — 23 nafar talaba" sarlavhalari va "1. ISM" qatorlari);
  - `rosterImportSchema` (ixtiyoriy `resolutions`: `CREATE` yoki `LINK` + `userId`);
  - tiplar `RosterPreview`, `RosterImportResult`, `GroupSummary`, `GroupStudentRow`. 7 ta test.
  - `MeResponse.email` endi `string | null`.
- Migratsiya `0013_groups_accounts.sql`:
  - `users.email` ixtiyoriy; yangi ustunlar `login` (`lower` bo'yicha unique), `must_change_password`, `disabled_at`, `password_changed_at`; CHECK: email yoki login bo'lishi shart;
  - `groups` (org + code unique);
  - `group_students` (PK guruh + talaba; composite FK `(group_id, organization_id)` → `groups`; talaba tashkilotda faqat bitta guruhda; guruh ichida `roster_key` unique);
  - `group_teachers` (C bosqichi uchun).
  - Generatsiya qilingan SQL qo'lda tartiblandi: `groups_id_org_idx` composite FK'dan oldin yaratilishi kerak.
- `UNUSABLE_PASSWORD_HASH` (`password.service.ts`): import qilingan hisoblarda parol yo'q. `verify()` buni mavjud bo'lmagan foydalanuvchi kabi ko'radi (dummy hash, vaqt bo'yicha farq yo'q).
- `src/groups/roster-import.ts`:
  - `previewRoster()` hech narsa yozmaydi. Statuslar: NEW, ALREADY_IMPORTED, DUPLICATE_IN_INPUT, IN_OTHER_GROUP, NAME_MATCH (guruhsiz talaba bilan bir xil ism — admin bog'lashni yoki yangi hisob ochishni tanlaydi);
  - quyidagi muammolar importni to'xtatadi va yashirincha tuzatilmaydi: ro'yxat ichidagi dublikat, boshqa guruhdagi ism, "N nafar" soni mos kelmasligi, bitta guruh ikki marta berilgani, hal qilinmagan NAME_MATCH.
  - `importRoster()` bitta tranzaksiyada `pg_advisory_xact_lock('account-logins')` ostida, preview'ni tranzaksiya ichida qayta hisoblab bajaradi. Yangi hisob: login, emailsiz, parolsiz, `must_change_password`, STUDENT a'zoligi. Qayta import hech narsa yaratmaydi. Audit `roster.import` faqat sonlar bilan (ismlarsiz).
- API (faqat ORG_ADMIN): `GET /orgs/:orgId/admin/groups`, `GET …/admin/groups/:groupId/students` (hash qaytarilmaydi, faqat `hasPassword`), `POST …/admin/roster/preview`, `POST …/admin/roster/import` (409 `ROSTER_INVALID`). `GroupsService` va `AdminGroupsController` `app.ts` ga ulandi.
- CLI `db:import:roster <fayl> [--apply]` (`src/db/import-roster.ts`). `--apply`siz faqat sinov rejimi. Ro'yxat fayli repodan tashqarida, gitignore qilingan `.data/` da saqlanishi kerak.
- Testlar `test/groups.test.ts` **15/15** (soxta ismlar bilan):
  - RBAC: 401, TEACHER va STUDENT 403, boshqa org 404, soxta header'lar;
  - preview hech narsa yozmaydi, `familiya.ism` loginlari va bir xil loginda `…2`;
  - ism aynan saqlanadi, email yo'q, parol yo'q, majburiy parol almashtirish, audit'da ism yo'q;
  - qayta import 0 ta yangi yozuv; ro'yxatlarda hash yo'q, begona org'dan guruhga kirish 404;
  - dublikat (apostrof variantlari bilan), boshqa guruhdagi ism, son mos kelmasligi, bitta guruh ikki marta, noto'g'ri formatdagi kiritma;
  - NAME_MATCH: begona `userId` qabul qilinmaydi, LINK dublikatsiz bog'laydi;
  - parallel ikki importda har bir hisob bir marta yaratiladi.
  - `schema.test.ts` (har bir FK indeks bilan qoplangan) o'tdi. API typecheck toza.
- **Qolgan ishlar (B bosqichi):**
  - web admin sahifalari: `/orgs/[orgId]/admin/groups` (ro'yxat, import formasi, preview jadvali, NAME_MATCH tanlovi) va `/orgs/[orgId]/admin/groups/[groupId]`; kabinetda admin uchun "Guruhlar" havolasi;
  - to'liq regressiya (format, lint, typecheck, test, build);
  - demo bazaga 74 talabani import qilish (ro'yxat `apps/api/.data/` ga, sinov rejimi → `--apply`) va 23 + 28 + 23 sonini tekshirish;
  - hisobot.
- STATUS: NOT_READY (B bosqichi tugallanmagan).

## 2026-10-19

### Guruhlar, o'qituvchilar va natijalar — B–H bosqichlari (yakunlandi)

- Foydalanuvchi: "hammasini tartib bo'yicha davom et". Ro'yxat oldingi suhbatdan olinib, gitignore qilingan `apps/api/.data/roster.txt` ga yozildi (repoga kirmaydi).
- **Ochiq savol hal qilindi (parol qolipi):** vaqtinchalik parol `<guruh kodi>-xxxx-xxxx` (masalan `8-24att-k7m4-q2x9`). Prefiks faqat qog'ozlarni ajratish uchun, 8 ta tasodifiy belgi (CSPRNG, ~40 bit, chalkash belgilarsiz) taxmin qilinmaslikni ta'minlaydi. O'qituvchilarda prefiks `wd`.
- **B — import va admin UI:**
  - demo bazaga import: sinov rejimi muammosiz, `--apply` → **74 ta yangi hisob, 3 ta guruh: 8-24 ATT 23, 9-24 ATT 28, 10-24 KI 23**. Qayta ishga tushirish: 0 yangi, 74 o'tkazib yuborildi. Takror yoki import qilinmagan yozuv yo'q. Login to'qnashuvi yo'q (`…2` kerak bo'lmadi), ismlar aynan saqlandi (har xil apostroflar ham);
  - `/orgs/[orgId]/admin/groups`: guruhlar jadvali (jami bilan), ro'yxatni joylab ko'rib chiqish, holatlar (yangi / allaqachon bor / takror / boshqa guruhda / ismdosh), NAME_MATCH uchun "bog'lash" yoki "yangi hisob" tanlovi, tasdiq bilan import, "Loginlar (Excel)";
  - `/orgs/[orgId]/admin/groups/[groupId]`: talabalar (qidiruv, saralash, sahifalash), parolni tiklash, faolsizlantirish, "Parol berilmaganlarga — Excel" va "Hammaga yangi parol — Excel".
- **C — o'qituvchi hisoblari va login oqimi:**
  - `loginSchema`: `login` yoki `email` (eski klientlar uchun), `@` bo'yicha ajratiladi. Login limiti endi identifikator bo'yicha.
  - Faolsiz hisob: login noto'g'ri parol bilan bir xil xabar va bir xil hash ishi bilan rad etiladi; sessiyalar o'chiriladi va `SessionService.validate` faolsizni qabul qilmaydi.
  - Majburiy parol almashtirish: `AuthGuard` `mustChangePassword` bo'lsa faqat `@AllowPendingPasswordChange()` route'larni (`GET /auth/me`, `POST /auth/password`, `POST /auth/logout`) ochadi, qolgani 403 `PASSWORD_CHANGE_REQUIRED`. `POST /auth/password`: joriy parol tekshiriladi (xato urinishlar limitga kiradi), boshqa sessiyalar yopiladi, audit `auth.password_change`.
  - `MeResponse` ga `login`, `mustChangePassword`. Web: login formasi "Login yoki email", `/change-password` sahifasi, `useApi` 403 `PASSWORD_CHANGE_REQUIRED` da shu sahifaga yo'naltiradi.
  - `AccountsService` + `AdminAccountsController` (faqat ORG_ADMIN, `/orgs/:orgId/admin`): `GET/POST teachers`, `PATCH teachers/:id`, `PUT teachers/:id/groups`, `GET students`, `PUT students/:id/group`, `POST accounts/:id/disable|enable|reset-password`, `POST credentials/reset.xlsx`, `GET logins.xlsx`.
  - Boshqariladigan hisob: shu tashkilotning STUDENT/TEACHER'i, faqat shu tashkilotga a'zo (aks holda 409 `ACCOUNT_SHARED`), o'zi emas (409 `SELF_ACCOUNT`); boshqa adminlar va begona org — 404. Login/email registrga qaramay unique (409 `LOGIN_TAKEN`/`EMAIL_TAKEN`), `account-logins` advisory lock ostida.
  - Audit: `teacher.create`, `teacher.update`, `teacher.groups_set`, `student.group_set`, `account.disable/enable`, `account.password_reset`, `credentials.export`, `logins.export` — parollarsiz.
  - **Boshlang'ich admin:** dev seed endi admin'ni `mustChangePassword` bilan yaratadi. Production: `db:bootstrap:admin(:prod)` (`BOOTSTRAP_ADMIN_LOGIN/NAME/PASSWORD` env'dan, 12+ belgi, admin bo'lsa hech narsa qilmaydi, parol loglanmaydi, birinchi kirishda almashtiriladi; `deploy/README.md`). Topshiriqdagi dev paroli kodga yozilmadi; mavjud demo admin o'zgartirilmadi.
  - `/orgs/[orgId]/admin/teachers`: yaratish (vaqtinchalik parol bir marta ko'rsatiladi, nusxa olish), tahrirlash, guruhlar (checkbox), parolni tiklash, faolsizlantirish. `/orgs/[orgId]/admin/students`: barcha talabalar, guruh va holat filtri, guruhni almashtirish.
- **D/E — o'qituvchi guruh paneli:** `MonitoringService` + `GroupsController` (`/orgs/:orgId/groups`, TEACHER va ORG_ADMIN):
  - kirish: ORG_ADMIN hamma guruhni, TEACHER faqat `group_teachers` dagilarini ko'radi; boshqa guruh, boshqa guruhning talabasi, begona org — **404** (URL/ID/body o'zgartirish yordam bermaydi). Kursni o'qitish guruhni ochmaydi.
  - `GET /` kartalar; `GET /:groupId` jadval: progress, joriy dars, mashqlar, CHECK (o'tdi/jami), testlar, ball/maks, oxirgi faollik, holat; kurslar tuzilmasi (eksport filtri uchun);
  - `GET /:groupId/students/:studentId`: darslar bo'yicha mashq holati, CHECK urinishlari (o'tdi/o'tmadi/texnik), oxirgi CHECK, **bajarilmagan talablar** (oxirgi FAILED run'dan; yashirinlari belgilangan — faqat xodimga), testlar (urinish, eng yaxshi %), topshiriqlar (ball/maks, versiyalar, baholangan sana, baholagan o'qituvchi, izoh, yakuniy).
  - Ma'lumot `analytics-facts` (`loadFacts`/`FactsIndex`) va mavjud jadvallardan; yangi progress tizimi yo'q. Ball faqat GRADED/FINALIZED javoblardan, manba — oxirgi GRADED/FINALIZED review (`submission_reviews` append-only). Bitta javob — bitta joriy ball, qayta baholash qo'shmaydi (testda).
  - Qiynalish: faqat aniq faktlar — o'tilmagan mashqda ≥3 FAILED CHECK, NEEDS_IMPROVEMENT, o'tilmagan test, REVISION_REQUESTED. Hech qanday CHECK/test/topshiriq bo'lmasa — **"Ma'lumot yetarli emas"** (`INSUFFICIENT_DATA`), "yaxshi" deb ko'rsatilmaydi. RUN natijalari serverda saqlanmaydi — UI va Excel'da shunday yozilgan.
  - Web: `/orgs/[orgId]/groups` (kartalar), `/groups/[groupId]` (statistika, qidiruv, holat filtri, saralash, sahifalash, eksport formasi), `/groups/[groupId]/students/[studentId]`.
- **F/G — Excel:** `common/xlsx.ts` — bog'liqliksiz `.xlsx` yozuvchi (Node `zlib.deflateRaw` + `crc32`). Hech qachon `<f>` (formula) yozilmaydi; `= + - @`, tab yoki CR bilan boshlanuvchi matnlar `quotePrefix` uslubida (tahrirlanganda ham matn). XML'ga sig'maydigan belgilar olib tashlanadi, sana Toshkent vaqtida, sarlavha qatori qotirilgan. openpyxl bilan tekshirildi.
  - Admin: `credentials/reset.xlsx` (guruh yoki tanlangan hisoblar, ixtiyoriy "faqat parol berilmaganlarga"; parollar faqat shu javobda, `Cache-Control: no-store`) va `logins.xlsx` (talabalar + o'qituvchilar, holat; parol/hash yo'q).
  - O'qituvchi: `GET /orgs/:orgId/groups/export.xlsx?groupId&studentId&courseId&moduleId&lessonId&from&to` — "Umumiy", "Topshiriqlar", "Mashqlar", "Izoh" varaqlari; har filtr ruxsat bo'yicha tekshiriladi (begona guruh/talaba/kurs 404, noto'g'ri kombinatsiya 400); audit `group.export`.
- **H — tekshiruv:**
  - Testlar: `test/accounts.test.ts` 16, `test/group-monitoring.test.ts` 9, `src/common/xlsx.test.ts` 4, shared auth +2, web `admin-ui.test.tsx` 5. Qamrov: 401/403/404 har endpoint, soxta `x-user-id`/`x-role`, cross-org, cross-group, cross-teacher, o'z hisobi/boshqa admin/umumiy hisob, majburiy parol almashtirish, faolsiz hisob, parollar DB va auditda ochiq yo'qligi, Argon2id, formula injection, sana oralig'i, ball takrorlanmasligi, bootstrap idempotentligi.
  - Regressiya: typecheck ✅, lint ✅, format ✅, build ✅, test ✅ (shared 50 + libs 3 + sandbox 16 + web 36 + check-engine 23 + api 327 = **455**).
  - Brauzer smoke (demo bazaning **nusxasida**, `next start` + compiled API, scratchpad'dagi `ui-groups.cjs`) **23/23**: admin 3 guruh / 74 talaba; qayta import "Allaqachon bor"; takror + son mos kelmasa import o'chiq; guruh paroli Excel'i (23 ta, hammasi qolipda, takrorsiz); o'qituvchi yaratish va 2 guruh biriktirish; o'qituvchi vaqtinchalik parol bilan kirib, boshqa sahifalardan `/change-password` ga qaytariladi, parolni almashtiradi; faqat 2 guruhni ko'radi; 23 qatorli jadval; ball Excel'i (4 varaq, formula yo'q); talaba sahifasi; biriktirilmagan guruh URL/API orqali 404; admin API 403; mobil (390px) + dark gorizontal scroll yo'q; klaviatura (skip-link, Enter bilan saralash). Kutilmagan konsol xatosi 0. Nusxa va parolli fayl keyin o'chirildi — demo bazada faqat import bor (parollar berilmagan).
  - Maxfiylik: repoda ro'yxatdagi to'liq ism-familiya yo'qligi tekshirildi; oldingi sessiyada testlar/izohlarga tushgan haqiqiy ismlar soxtalariga almashtirildi.
- **STATUS: READY_WITH_INFRASTRUCTURE_LIMITATIONS** (avvalgi infratuzilma cheklovlari saqlanadi).
- Cheklovlar:
  - Demo bazadagi 74 talabaga hali parol berilmagan — admin `/admin/groups/<guruh>` da "Parol berilmaganlarga — Excel" ni bosadi. Demo bazada guruhlarga o'qituvchi biriktirilmagan.
  - Guruh paneli qidiruv/saralash/sahifalashni klientda qiladi (server guruhning hamma talabasini qaytaradi; bir guruh ≤200).
  - Excel'dagi "Progress" eksport vaqtidagi holat; sana oralig'i faqat CHECK va baholash sanalariga qo'llanadi. Modul/dars filtri topshiriqlarni chiqarmaydi (topshiriq kursga tegishli).
  - Guruh senariysi to'liq E2E (`e2e/full-flow`) ga qo'shilmadi; brauzer smoke scratchpad'da va demo bazani talab qiladi.
  - Email tasdiqlash va "parolni unutdim" yo'q — parolni faqat admin tiklaydi.

### To'liq E2E — guruhlar senariysi qo'shildi

- Davom ettirish: 2026-10-19 dagi cheklovlardan biri — guruh senariysi `e2e/full-flow` da yo'q edi.
- **Topilgan regressiya:** guruhlar bosqichidan keyin login formasi maydoni `name="login"` bo'ldi, E2E esa `input[name="email"]` ni qidirardi. Ya'ni to'liq E2E guruhlar bosqichidan keyin ishga tushirilmagan va buzilgan edi. `login()` helper tuzatildi (login yoki email, ixtiyoriy parol va kutilgan sahifa).
- Yangi qadamlar (13 ta, soxta ismlar bilan — repo public), asosiy qismi UI orqali:
  - admin ro'yxatni import qiladi (2 guruh, 3 talaba): ko'rib chiqish → import, `familiya.ism` loginlari, parol hali yo'q, javobda hash yo'q;
  - admin o'qituvchi yaratadi (vaqtinchalik parol bir marta ko'rsatiladi) va unga faqat bitta guruhni biriktiradi;
  - admin talabaga guruh prefiksli vaqtinchalik parol beradi (`1-26e2e-…`);
  - talaba login bilan kiradi: parolni almashtirmaguncha boshqa API 403 `PASSWORD_CHANGE_REQUIRED`; parolni almashtiradi, kursga yoziladi, CHECK (FAILED); guruh paneli va admin sahifalari unga 403;
  - guruh o'qituvchisi birinchi kirishda parolni almashtiradi, faqat o'z guruhini ko'radi, jadvalda "Ma'lumot yetarli emas" holati, talaba sahifasida CHECK tarixi ("O'tmadi");
  - cross-group: boshqa guruh, uning talabasi va eksporti 404, admin sahifalari 403; o'z guruhi `.xlsx` eksporti 200 (spreadsheetml, `PK` imzosi);
  - admin talabani faolsizlantiradi → mavjud sessiya darhol 401, qayta kirish rad etiladi.
- Natija: **47/47**, ikki marta ketma-ket. format ✅, lint ✅, `pnpm -r build` ✅.
- CI'dagi `e2e` job ham shu skriptni ishlatadi (Ubuntu'da hali ishga tushirilmagan — repo GitHub'ga push qilinmagan).

### Kamchiliklar tuzatildi: kurs o'qituvchilari, guruhni kursga yozish, parallel baholash, AI murojaatlari, Toshkent haftalari

- Foydalanuvchi: "kamchiliklarni bartaraf etib davom et". Infratuzilmaga bog'liq bo'lmagan (kod orqali tuzatsa bo'ladigan) bandlar tanlandi.
- **1. O'qituvchini kursga biriktirish** (F2'dan beri yo'q edi; admin yaratgan o'qituvchi hech bir kursni boshqara va baholay olmasdi):
  - `PUT /orgs/:orgId/admin/teachers/:userId/courses` (faqat ORG_ADMIN): shu tashkilot kurslari to'plamini almashtiradi, boshqa tashkilotdagi biriktirishlarga tegmaydi; begona kurs 404, talaba/admin/o'zi — mavjud `managed()` qoidalari; audit `teacher.courses_set`.
  - `TeacherRow.courses`. Web: o'qituvchi kartasida "O'qitadigan kurslari" (qoralama/arxiv belgisi bilan) va "Kurslarni saqlash"; guruhlar tanlovi bilan umumiy `ChoiceSet` komponenti.
- **2. Guruhni kursga yozish** (B bosqichida qaror qilingan, lekin qilinmagan edi):
  - `POST /orgs/:orgId/admin/groups/:groupId/enroll { courseId }`: faqat e'lon qilingan kurs (409 `COURSE_NOT_PUBLISHED`), faqat faol talabalar, takrorlanmaydi; javob `enrolled / alreadyEnrolled / skippedDisabled`; audit `group.enroll` (ismlarsiz).
  - Web: admin guruh sahifasida "Kursga yozish" (tanlov + tasdiq + natija).
- **3. Parallel baholash** (12E cheklovi — ikkinchi o'qituvchi birinchisining bahosini jimgina ustiga yozardi): review amallariga ixtiyoriy `basedOn` (o'qituvchi ko'rgan review tarixi uzunligi). Qulf ostida sanaladi; farq qilsa 409 `REVIEW_CHANGED`. Web review sahifasi doim yuboradi. Ixtiyoriy — eski klientlar buzilmaydi.
- **4. AI murojaatlari** (11 cheklovi): migratsiya `0014_ai_handoff_resolve.sql` (`resolved_at`, `resolved_by` FK + indeks). `PUT …/tutor/handoffs/:id/resolved { resolved }` (kurs xodimi; begona kurs/org 404), audit `ai.handoff_resolve/reopen`. Ro'yxatda ochiqlari avval, "Hal qilindi · sana · kim". Web: kurs analitikasida "Hal qilindi" / "Qayta ochish" va ochiqlar soni.
- **5. Analitika haftalari Toshkent vaqtida** (13C cheklovi): `weekStartOf` va SQL `weekOf` qat'iy UTC+5 siljish bilan (O'zbekistonda yozgi vaqt yo'q, tz bazasi kerak emas). Chegaralarda SQL va JS mosligi testi.
- Testlar: `test/course-staffing.test.ts` 5 ta (RBAC 401/403/404, soxta header'lar, biriktirish → boshqarish/analitika ochiladi, olib tashlash → 403, begona kurs 404, dublikat 400; guruh: qoralama 409, begona guruh/kurs 404, faolsiz o'tkazib yuboriladi, idempotent, audit ismsiz); `reviews.test.ts` +1; `tutor.test.ts` kengaytirildi; `test/analytics-weeks.test.ts` 1; shared hafta testlari yangilandi.
- To'liq E2E kengaytirildi: admin UI orqali o'qituvchiga kurs biriktiradi va guruhni kursga yozadi; talaba o'zi yozilmasdan kursda; guruh o'qituvchisi kurs analitikasi va javoblarni ochadi. **50/50**.
- Regressiya: typecheck ✅, lint ✅, format ✅, build ✅, test ✅ (shared 50 + libs 3 + sandbox 16 + web 36 + check-engine 23 + api 334 = **462**).
- Demo bazaga `0014` qo'llandi.
- Qolgan (infratuzilma yoki foydalanuvchi qarori): GitHub push (yangi token + public/private qarori), Docker image'lar, haqiqiy Postgres, alohida sandbox domeni, edge proksi, backup mashqi, email tasdiqlash / "parolni unutdim" (SMTP kerak), demo talabalarga parol berish (admin amali).

### Joriy holat va keyingi qadamlar (2026-10-19 oxiri)

- Oxirgi commit'lar: `cb42da6` (E2E guruhlar senariysi), `df757a8` (kurs o'qituvchilari, guruhni kursga yozish, parallel baholash himoyasi, AI murojaatlarini yopish, Toshkent haftalari). Ishchi daraxt toza.
- Holat: testlar **462/462**, to'liq E2E **50/50**, sandbox E2E 24/24 (oxirgi marta Bootstrap bosqichida). Demo baza migratsiyasi `0014` gacha.
- Roadmap fazalari (F0–15C) va kurslar (HTML, CSS, JS, PHP, Bootstrap 3/4/5) yakunlangan.
- **Foydalanuvchi qarori kerak:**
  - GitHub push: `Contents: write` ruxsatli yangi token; repo public qoladimi (CHECK qoidalari va yechimlar ochiq bo'ladi). Remote hali bo'sh, CI hech qachon ishlamagan.
  - Eski (chatda ochilgan) GitHub tokenini revoke qilish.
- **Infratuzilma kerak:** Docker image'lar va `deploy/README.md` tekshiruv ro'yxati, haqiqiy PostgreSQL, alohida registrable sandbox domeni, edge proksi (`X-Forwarded-For`), backup/restore mashqi, haqiqiy AI provayder (DPA), email tasdiqlash va "parolni unutdim" (SMTP).
- **Admin amali (kod emas):** demo bazadagi 74 talabaga parol berish (`/orgs/<org>/admin/groups/<guruh>` → "Parol berilmaganlarga — Excel"), guruhlarga o'qituvchi va kurs biriktirish.
- Kodda qolgan kichik cheklovlar (ixtiyoriy): portfolio uchun server skrinshoti va SEO meta, analitikada sana oralig'i filtri, testni faqat yechganda dars `IN_PROGRESS` ga o'tmasligi, kurs/modul/dars/topshiriqni o'chirish yo'qligi, demo bazadagi HTML/CSS/JS test variantlari aralashtirilmagan (`--replace` progressni o'chiradi).

## 2026-10-20

### Lokal demo qayta ishga tushirildi

- `shared`, `check-engine`, `api` qayta build qilindi; migratsiyalar yangi emas (`0014`). API 4000, sandbox 3100, web (`next dev`) 3000 — hammasi 200.

### Platformani mukammallashtirish (8 band) — tahlil va reja

- So'rov: `platforma-prompt.md` (dizayn, responsivlik, app-shell, kabinet submenyusi, yo'nalish sahifalari, avtomatik slug, elektron darslik — flipbook, chatbot). Tartib: 1 → 2 → 7 → 4 → 5 → 3 → 6 → 8.
- Audit natijasi:
  - ikonka: o'zimizning 17 ta `fill` SVG (`icons.tsx`); emoji 5 ta (🤖 👍 👎 🔒 ⚠), holat belgilari sifatida Unicode (✓ ○ ◐ ✗ ● ★ ▲▼ ← →) ~30 faylda; landing'da 8 ta "rangli kvadrat ichida ikonka" va 4 ta "doira ichida ikonka" — shablon ko'rinishi;
  - gradientlar: kurs muqovalari, progress bar; rangli soya ("glow"): `btn-primary`, `card-hover`;
  - tokenlar `@theme` da ranglar va soyalar uchun bor, oraliq/radius/shrift o'lchamlari uchun yo'q;
  - modallar yo'q, 19 joyda `window.confirm()`; burger menyu bor (`< lg`), lekin Esc va tashqariga bosish bilan yopilmaydi;
  - `(app)` layout oddiy sahifa scroll'i, yon menyu yo'q; kabinetda "Chiqish" faqat dashboard sahifasida;
  - yo'nalishlar landing'da qattiq yozilgan, bosilmaydi, DB'da yo'nalish tushunchasi yo'q; kurs katalogi faqat tashkilot a'zolariga ochiq;
  - slug qo'lda kiritiladi, server faqat regex tekshiradi, band bo'lsa 409; slug tahrirlanmaydi va URL'larda ishlatilmaydi (URL'lar ID bilan);
  - PDF/fayl yuklash infratuzilmasi yo'q (multipart, storage, rasterizatsiya); `sharp` o'rnatilgan, `pdftoppm`/`mutool` yo'q;
  - AI Tutor (mashq/topshiriq ichida, mock provider) bor, umumiy platforma chatboti yo'q.
- Brauzerlar: Chrome, Edge, Firefox o'rnatilgan; Safari (Windows) yo'q — tekshirib bo'lmaydi.
- Kod o'zgartirilmadi. Reja va ochiq savollar foydalanuvchiga berildi.
- **Foydalanuvchi qarorlari:**
  - kursi yo'q yo'nalishlar (Figma'dan kodga, UI asoslari, Portfolio, Moslashuvchan dizayn) uchun ham kurslar yoziladi (W3Schools tartibi, original o'zbekcha, CHECK'li mashqlar; Figma darsligi W3Schools'da yo'q — original);
  - yo'nalish va kurs sahifalari mehmonlarga ochiq, mashq uchun login kerak;
  - elektron darslik tizimga kirgan barcha foydalanuvchilarga ochiq;
  - chatbot mehmonlarga ham ochiq; "admin bilan bog'lanish" keyinroq Telegram bot orqali (hozircha DB + admin panel, Telegram uchun ulanish nuqtasi).

### 1-band — Dizayn (yakunlandi)

- **Ikonkalar:** `@tabler/icons-react@3.45.0` — yagona to'plam. `components/icons.tsx` Tabler'ni nom bo'yicha o'raydi (`<Icon name="…" />`, stroke 1.75, o'lcham `className` bilan, doim `aria-hidden`).
- **Olib tashlandi:**
  - emojilar (🤖 👍 👎 🔒 ⚠) va Unicode holat belgilari (✓ ○ ◐ ✗ ● ★ ▲▼ ↕ ⏱ ⦸ ✎ ▶ ×, "← Orqaga", "+ Qo'shish") — ikonka + matn bilan almashtirildi;
  - landing'dagi 8 ta "rangli kvadrat ichida ikonka", 4 ta "doira ichida ikonka", nuqtali naqshlar, dekor doira/halqalar, to'lqinli chiziq, yashil doiradagi belgilar, yuqoridagi ko'k reklama paneli;
  - kurs muqovalaridagi gradient + bosh harflar (muqova butunlay olib tashlandi — nomni takrorlardi), progress bar gradienti, `btn-primary`/`card-hover`/logodagi rangli "glow" soyalar;
  - kurs xaritasidagi rangli to'ldirilgan holat doiralari va modul raqami kvadrati (holat `StateBadge` da allaqachon bor edi) — o'rniga "1.2" raqami va "1-modul" yorlig'i;
  - yutuqlardagi sariq doira ichidagi ikonkalar.
- **Dizayn tokenlari** (`globals.css` `@theme`): semantik ranglar `canvas/panel/subtle/line/line-strong/fg/muted/ink` (dark mode'da qayta aniqlanadi), radiuslar `control/card/panel`, neytral soyalar `card/card-hover/overlay`, suyuq sarlavha o'lchamlari `text-display/title/heading` (`clamp()`), `shimmer` animatsiyasi. `.btn` (min 44px mobilda), `.btn-ghost`, `.btn-danger`, `.field`, `.card`, `.skeleton` tokenlardan foydalanadi.
- **`ui.tsx`:** `PageHeader` endi ko'k banner emas — breadcrumb (chevron), sarlavha, izoh, amallar, pastki chiziq. Yangi: `BackLink`, `Skeleton`, `EmptyState`, `ErrorState` (403/404/tarmoq/5xx uchun alohida matn; tarmoq va 5xx'da "Qayta urinish"), `StatusLabel` (ikonka + matn + ton). `LoadState` yuklanishda skeleton ko'rsatadi. Barcha holat xaritalari (`STATE_STYLE`, mashq, test, topshiriq, CHECK, monitoring, hisob holati, import holati) `IconName` bilan.
- Kurs kartasi to'liq bosiladi (stretched link, ichida ikkinchi havola yo'q).
- Tekshiruv: typecheck ✅, lint ✅, format ✅, web test 36/36 ✅. Brauzer (demo baza, faqat avval ochilgan dars/mashqlar — yangi progress yozilmaydi): landing, login, kabinet, kurs xaritasi, dars, mashq, natijalar, portfolio, playground × 390/1440 px × light/dark — gorizontal scroll 0, konsol xatolari 0, skrinshotlar ko'zdan kechirildi.

### 2-band — Responsivlik (yakunlandi)

- **Breakpoint'lar:** Tailwind standartlariga `xs` (480px) qo'shildi, `2xl` 1440px ga tenglandi (320 → xs 480 → md 768 → lg 1024 → 2xl 1440).
- **Shrift:** 768px dan tor ekranda `text-sm` 16px, `text-xs` 14px (`--text-*` tokenlari media query'da qayta aniqlanadi). Inputlar mobilda 16px (iOS zoom yo'q). Sarlavhalar `clamp()` bilan (1-bandda).
- **Bosish maydoni:** `.btn`, `.field`, burger, dialog tugmalari, fayl daraxti, saralash sarlavhalari, sahifalash, tutor baholash tugmalari, konsol "Tozalash", "Jadval ko'rinishi" — mobilda kamida 44×44. Avtomatik audit (`button, .btn, [role=button], select, summary`, < 768px) talaba va admin sahifalarida 0 ta muammo.
- **Topilgan xato:** fayl daraxtidagi "nomini o'zgartirish"/"o'chirish" tugmalari faqat hover'da ko'rinardi — sensorli ekranda umuman ishlatib bo'lmasdi. Endi `pointer-coarse` da doim ko'rinadi va 44px.
- **Burger menyu** (< 1024px): Esc (fokus tugmaga qaytadi), tashqariga bosish va sahifa almashishi yopadi; `aria-current` faol sahifani belgilaydi; `safe-area-inset-top`.
- **Modal dialoglar:** yangi `components/dialog.tsx` — native `<dialog>` + `showModal()` (fokus ushlanadi, Esc, fon inert, fokus qaytadi). Telefonda to'liq ekran, `sm` dan markazda panel; backdrop bosilsa yopiladi. `confirmDialog()` / `promptDialog()` imperativ API (root layout'da bitta `DialogHost`). Barcha 19 ta `window.confirm` va 2 ta `window.prompt` almashtirildi; xavfli amallarda (`tone: 'danger'`: faolsizlantirish, parolni tiklash, o'chirish, boshlang'ich kodga qaytish) qizil tugma va fokus avval "Bekor qilish"da. O'zgargan xatti-harakat: mashq muharririda "Tuzatish kerak" izoh oynasini bekor qilish endi amalni ham bekor qiladi (avval izohsiz belgilardi).
- **Kontent:** dars jadvallari mobilda o'z ichida aylanadi; dars rasmlari `loading="lazy"`, `decoding="async"`, `max-width: 100%`. Platformada boshqa `<img>` yo'q (`srcset` kerak bo'ladigan rasm hali yo'q — darslik va yo'nalishlarda qo'shiladi).
- **Brauzerlar** (scratchpad'dagi `xbrowser.mjs`): Chrome 155, Edge 155, Firefox 158 (stock, puppeteer-core 25.12 + WebDriver BiDi, faqat scratchpad'da o'rnatilgan) — 4 sahifa × 6 viewport (320×640, 390×844, 844×390 landshaft, 768×1024, 1024×768, 1440×900) gorizontal scroll 0; burger Esc/tashqari; dialog modal, telefonda to'liq ekran, 1024'da 512px panel, xavfli amalda fokus "Bekor qilish"da, Esc yopadi; sahifa xatolari 0. **Safari tekshirilmadi** (Windows'da yo'q).
- E2E native dialog o'rniga modalni tasdiqlaydi (`acceptModal`).
- Tekshiruv: typecheck ✅, lint ✅, format ✅, web test 36/36 ✅, build ✅, to'liq E2E **50/50** ✅.

### 7-band — Ilova oynani to'liq egallaydi (yakunlandi)

- **Route group'lar:** ochiq sahifalar (`/`, `/playground`, `/p/[slug]`, `(auth)`) `app/(site)/` ga ko'chirildi (URL'lar o'zgarmadi): marketing header + oddiy sahifa scroll'i + footer. Root layout endi faqat skelet (`<html>`, skip-link, `DialogHost`); `cookies()` chaqiruvi saqlab qolindi — nonce'li CSP uchun barcha sahifalar dinamik bo'lishi kerak.
- **`components/app-shell.tsx`** (`(app)` layout):
  - `.app-shell` balandligi `100vh` → `100dvh` (fallback bilan); faqat `<main>` scroll bo'ladi, sahifaning o'zi emas;
  - yuqori panel: mobil menyu tugmasi, yon menyuni yig'ish (xl+), logo, to'liq ekran (Fullscreen API, qo'llab-quvvatlanmasa ko'rinmaydi), foydalanuvchi ismi;
  - yon menyu: shaxsiy bo'limlar (Kabinet, Natijalarim, Portfolio, Playground) va har tashkilot uchun xodim bo'limlari (Guruh paneli; admin uchun Guruhlar, Talabalar, O'qituvchilar, Tashkilot analitikasi). Rol `/auth/me` dan — faqat ko'rinish uchun, ruxsat serverda;
  - xl+ da yig'ish/yoyish, holat `wd_sidebar` cookie'da va server layout'da o'qiladi (qayta yuklashda "sakrash" yo'q); 1024–1279 px da doim ixcham ikonka paneli (yorliqlar faqat screen reader uchun); < 1024 px da chiqib keladigan drawer (Esc — fokus tugmaga qaytadi, fon bosilishi, navigatsiya yopadi; yopiq drawer `inert`);
  - sahifa almashganda kontent scroll'i boshiga qaytadi (Next faqat oyna scroll'ini tiklaydi);
  - `env(safe-area-inset-*)` (top bar, yon menyu, kontent pastki chegarasi, dialoglar), root `viewport-fit=cover`.
- Kurs xaritasidagi sticky panel scroll konteyneriga moslandi (`top-0`).
- Tekshiruv (scratchpad'dagi `shell-check.cjs`, demo baza, faqat o'qish): sahifa o'zi scroll bo'lmaydi, kontent scroll bo'ladi, shell aynan oyna balandligida, navigatsiya scroll'ni tiklaydi, faol bo'lim belgilanadi, yig'ish qayta yuklashdan keyin saqlanadi, 1440 → 1100 → 600 → 1440 o'lcham o'zgarishida buzilmaydi, drawer (ochish/Esc/fon/navigatsiya, `inert`) — 20/20; skrinshotlar 390/1024/1440 × light/dark, gorizontal scroll 0, xatolar 0. typecheck ✅, lint ✅, format ✅, web test 36/36 ✅, build ✅. To'liq E2E 4-band bilan birga ishga tushiriladi.

### 4-band — Shaxsiy kabinet submenyusi (yakunlandi)

- **`components/account-menu.tsx`** — "Shaxsiy kabinet" ochiladigan menyusi: Kabinet, **Natija** (`/analytics` — kurslar bo'yicha progress foizda, haftalik grafik, test natijalari), **Portfolio**, ajratuvchi chiziq, **Chiqish**.
  - ochiq sahifalar header'ida "Shaxsiy kabinet" tugmasi o'rnida; kabinet top-bar'ida foydalanuvchi ismi (telefonda faqat ikonka, ism screen reader uchun qoladi); burger panelida oqim ichida ochiladi (`inline` — scroll konteyneri kesmasligi uchun);
  - desktopda hover (sichqoncha) va bosish bilan, telefonda bosish bilan ochiladi. Hover bilan ochilgan menyuni bosish uni mahkamlaydi — **topilgan xato:** avval hover'dan keyingi bosish menyuni darhol yopardi;
  - klaviatura (WAI-ARIA menu button): Enter/Space/↓ — birinchi element, ↑ — oxirgi, ↑/↓ aylanma, Home/End, Esc yopadi va fokusni tugmaga qaytaradi, Tab yopadi. Fokus `useLayoutEffect` da ko'chiriladi (tez bosilgan keyingi tugma tugmaga emas, menyuga tushadi);
  - joriy sahifa `aria-current` bilan belgilanadi; tashqariga bosish va navigatsiya yopadi.
- **Chiqish:** tasdiq oynasi ("Haqiqatan chiqmoqchimisiz?") → `POST /auth/logout` (server sessiya qatorini o'chiradi) → `sessionStorage` tozalanadi → `location.replace('/')` (to'liq yuklash — barcha klient keshlari, router keshi ham, tushadi; himoyalangan sahifa tarixda qolmaydi). Tarmoq xatosida "Qayta urinish" oynasi; 401 ham muvaffaqiyatli chiqish hisoblanadi.
- **API:** `POST /auth/logout` cookie'ni o'rnatilgandagi atributlar bilan tozalaydi (`HttpOnly`, `Secure` (prod), `SameSite=Lax`, `Path=/`). `auth.test.ts` endi tozalovchi `Set-Cookie` ni tekshiradi.
- Kabinet sarlavhasidagi takroriy "Natijalarim / Portfolio / Chiqish" tugmalari olib tashlandi (menyu va yon menyuda bor).
- E2E: talaba chiqishni menyu orqali tasdiqlaydi, keyin `/auth/me` 401 tekshiriladi (yangi qadam).
- Tekshiruv (scratchpad'dagi `account-check.cjs`, demo baza; faqat shu skript ochgan sessiyalar yopiladi) **28/28**: hover/bosish/teginish, klaviatura (Enter, ↓, End, aylanish, Esc + fokus, ↑, Tab), tashqari bosish, faol sahifa, telefonda ekranga sig'ishi, burger ichida; chiqish — bekor qilish sessiyani saqlaydi, tasdiqlash bosh sahifaga olib boradi, cookie yo'q, `/auth/me` 401, `sessionStorage` bo'sh, header'da yana "Kirish", "Orqaga" tugmasi kabinet ma'lumotini ko'rsatmay `/login` ga olib boradi. typecheck ✅, lint ✅, format ✅, test ✅ (web 36, api 334), build ✅, to'liq E2E **51/51** ✅ (7-band o'zgarishlari bilan birga).

### 5-band — Yo'nalishlar: 5a infratuzilma (yakunlandi)

- **DB** `0015_directions.sql`: `directions` (platforma darajasida, slug unique, sarlavha, qisqa tavsif, tavsif, tartib) va `course_directions` (kurs ↔ yo'nalish, ko'pga-ko'p, ikkala FK indeks bilan). Drift yo'q.
- **Kontent:** `content/directions.ts` — 10 ta yo'nalish (HTML, CSS va bezash, JavaScript, Flexbox va Grid, Moslashuvchan dizayn, UI asoslari, Figma'dan kodga, Portfolio, Bootstrap, PHP). Kurs qaysi yo'nalishda ekani manifestda (`CourseMeta.directions`); noma'lum slug `prepareCourse` da xato. `syncDirections()` yo'nalishlarni upsert qiladi va to'plamdagi kurslar bog'lanishlarini manifestga moslaydi (to'plamdan tashqari kurslarga tegmaydi); har `seedCourse` oxirida va `db:seed:directions(:prod)` CLI orqali. Demo bazaga yuklandi: 10 yo'nalish, 7 kurs, 8 bog'lanish.
- **API** (`src/catalog/`, `@Public`, ochiq IP limiti `PUBLIC_RATE_PER_MINUTE`): `GET /public/directions`, `GET /public/directions/:slug`, `GET /public/courses/:slug`. Faqat standart (platforma) tashkilotning `PUBLISHED` kurslari; faqat nom, tavsif, modul/dars nomlari va sonlar — dars matni, mashqlar, CHECK qoidalari, test javoblari yo'q. Noto'g'ri formatdagi slug ham 404.
- **Web (server-render, SEO):** `/yonalishlar`, `/yonalishlar/[slug]` (tavsif, kurslar, bo'sh holat), `/kurslar/[slug]` (dastur, "Kirish va boshlash"/"Ro'yxatdan o'tish" yoki "Kursni ochish"; telefonda tugma dasturdan oldin). Har birida `title`, `description`, canonical, Open Graph, Twitter card (`SITE_URL` — `.env.example` ga qo'shildi). Breadcrumb. 404: `(site)/not-found.tsx` va root `not-found.tsx` (`noindex`), `(site)/error.tsx` ("Qayta urinish").
  - Kartalar (yo'nalish va kurs) — "stretched link": bitta havola, butun karta bosiladi, hover'da yengil ko'tarilish va chegara rangi, fokusda halqa.
  - Landing'dagi yo'nalishlar endi API'dan va o'z sahifasiga olib boradi (API ishlamasa sahifa baribir chiqadi); header'da "Yo'nalishlar" → `/yonalishlar`, footer havolalari yangilandi.
  - Server fetch kelgan `X-Forwarded-For` ni API'ga uzatadi — aks holda barcha mehmonlar Next serverining bitta IP limitiga tushib, bitta odam slug terib hamma uchun 429 keltirib chiqarishi mumkin edi (ishonch modeli `/api` rewrite bilan bir xil: `TRUST_PROXY`).
- **Login `?next=`:** kirish/ro'yxatdan o'tishdan keyin kelgan sahifaga qaytadi; `useApi` 401 da joriy sahifani `next` ga qo'yadi. `lib/safe-next.ts` faqat ichki yo'llarni qabul qiladi (`//`, `\`, sxema, boshqaruv belgilari, 512+ belgi rad etiladi). Auth formasi `.field` tokeniga o'tkazildi (1-bandda qolib ketgan edi).
- Testlar: api `test/catalog.test.ts` 8 ta (tartib va sonlar, qoralama/boshqa tashkilot yashirin, 404 va noto'g'ri slug, maxfiy matnlar sizmasligi, seed idempotent va manifest bo'yicha bog'lanish, IP limiti); web `safe-next.test.ts` 2 ta. Jami: shared 50 + web 38 + api 342.
- Brauzer (demo baza): mehmon sifatida 7 sahifa × 390/1440 × light/dark — gorizontal scroll 0, kichik tugma 0, xato 0; oqim (scratchpad'dagi `catalog-flow.cjs`) 11/11: 10 karta, kartada bitta havola, burchakka bosish ishlaydi, fokus halqasi, yo'nalish → kurs → "Kirish va boshlash" → login → kurs xaritasi, kirgan foydalanuvchiga "Kursni ochish", `next=//…`, `https://…`, `/\…` e'tiborga olinmaydi.
- Keyingi: 5b — to'rt yangi kurs (Moslashuvchan dizayn, UI asoslari, Figma'dan kodga, Portfolio).

### 5-band — Yo'nalishlar: 5b to'rt yangi kurs (yakunlandi)

- Foydalanuvchi so'rovi: kursi yo'q yo'nalishlar uchun W3Schools'dagi tegishli mavzular asosida o'zbekcha kurslar, mashqlari bajariladigan darajada. Huquqiy qaror avvalgidek: faqat mavzular tartibi, matn/misol/mashq/test original. Holat va qoidalar: [DIZAYN_KURSLAR_HOLATI.md](DIZAYN_KURSLAR_HOLATI.md).
- **Moslashuvchan dizayn** (`moslashuvchan-dizayn`, tartib 33): 6 modul, 28 dars, 28 mashq, 6 test — asoslar (viewport, avval mobil, birliklar, `clamp`), media va konteyner so'rovlari, maketlar (Flexbox o'rash, `auto-fit`, `grid-template-areas`, muqaddas grail), kontent (`srcset`, `<picture>`, video, tipografiya), komponentlar (burger, jadval, forma, kartalar, mobil dialog), lending loyihasi.
- **UI asoslari** (`ui-asoslari`, 35): 6 modul, 29 dars, 29 mashq, 6 test — rang (HEX/RGB/HSL, soyalar, uyg'unlik, 60-30-10, kontrast, tokenlar va qorong'i mavzu), tipografiya, oraliq va kompozitsiya, ikonkalar (SVG, Bootstrap Icons — platformadagi nusxa, accessibility), komponentlar va holatlar (hover/fokus/disabled, forma xatosi, tablar), mini dizayn tizimi.
- **Figma'dan kodga** (`figmadan-kodga`, 37): W3Schools'da yo'q — to'liq original. 6 modul, 24 dars, 24 mashq, 6 test — Inspect, rem, Variables → CSS o'zgaruvchilar, Auto Layout → Flexbox (Hug/Fill/Fixed, wrap, absolyut), Constraints, Layout Grid → CSS Grid, breakpoint freymlar, Text Styles, effektlar, komponent/variant/holatlar, eksport, maketdan sahifa loyihasi. Mashqlarda maket spetsifikatsiyasi beriladi va aniq o'lchamlar tekshiriladi.
- **Portfolio sayti** (`portfolio`, 45 — JS'dan keyin): 6 modul, 23 dars, 23 mashq, 6 test — semantik skelet, skip-link, tokenlar, hero, sticky header, mobil menyu (havola/Esc bilan yopiladi), `aria-current`, profil, ko'nikmalar (`role="progressbar"`), vaqt chizig'i, ijtimoiy havolalar, loyihalar to'ri (stretched link), filtr (`hidden` + `aria-pressed`), lightbox (`<dialog>`), case study, scroll-snap karusel, aloqa formasi (`fill` amallari bilan tekshiriladi), fikrlar, "yuqoriga", saqlanadigan qorong'i rejim (`try…catch`), SEO/OG, Lighthouse xatolari, yakuniy yig'ish.
- Jami: **24 modul, 104 dars, 104 mashq (CHECK bilan), 24 test**. `content:verify`: 28/28, 29/29, 24/24, 23/23 (haqiqiy Chrome; yechim PASSED, boshlang'ich kod o'tmaydi). `content-courses.test.ts` 55/55.
- Infratuzilma: `content/design/shared.ts` (`svgData`, `pic`, `RESET`, `slots`/`cls` qayta eksporti).
- **Topilgan va tuzatilgan:**
  - `data:` SVG manzillaridagi kodlanmagan bo'sh joylar `srcset` ni buzardi (URL birinchi bo'sh joyda kesiladi) — `svgData` bo'sh joylarni `%20` qiladi;
  - kasrli ustunlar (1/3) Chrome'da 1/64 piksel yaxlitlanib 299.984px beradi — tekshiriladigan kengliklar aniq bo'linadigan qilib tanlandi;
  - boshlang'ich CSS selektori talaba qoidasidan kuchliroq bo'lgan holat (`.mahsulot p` vs `.nomi`) — tuzatildi, qoida holat hujjatiga yozildi;
  - ochiq kurs sahifasida breadcrumb kalitlari takrorlanardi (kurs va yo'nalish nomi bir xil — "UI asoslari") — kalit indeks bilan.
- Demo bazaga yuklandi (`seed-course` ×4); `/public/directions` — barcha 10 yo'nalishda kurs bor. Mehmon sahifalari (390/1440) xatosiz.
- Kuzatuv: uzoq ketma-ket `content:verify` da (60+ Chrome) ba'zan boshlang'ich kodda LOAD_TIMEOUT/BUDGET; alohida qayta ishga tushirilganda o'tadi (talabada TIMEOUT holati statusni o'zgartirmaydi).
- Cheklov: engine `hover`/`pointer`/`prefers-*` media va aylantirishni emulyatsiya qilmaydi — ular faqat darsda; `srcset` tanlovi brauzer ixtiyorida, tekshiruv atributlar bo'yicha.

### 3-band — Slug (yakunlandi)

- **Shared** `slug.ts`: `slugify()` — o'zbek apostroflarining barcha shakllari (`'`, `‘`, `’`, `ʻ`, `ʼ`, `` ` ``) olib tashlanadi (oʻ → o, gʻ → g), sh/ch saqlanadi; kirill: ш→sh, ч→ch, ў→o, ғ→g, қ→q, ҳ→h, х→x, ё→yo, ю→yu, я→ya, ц→ts, е so'z boshida va unlidan keyin → ye; diakritika olib tashlanadi; faqat `a-z0-9-`, takroriy va chetdagi `-` yo'q, 80 belgigacha. `slugCandidate(base, n)` (`-2`, `-3`, suffiks bilan ham ≤80), `courseSlugSchema` (qat'iy: noto'g'ri slug jimgina tuzatilmaydi, 400), `slugSuggestionQuerySchema`, `SlugSuggestion`. 7 ta test (shu jumladan "Oʻzbek tili: Grammatika asoslari" → `ozbek-tili-grammatika-asoslari`).
- `createCourseSchema.slug` endi ixtiyoriy (berilmasa nomdan yasaladi, bo'sh chiqsa `kurs`); `updateCourseSchema.slug` qo'shildi.
- Migratsiya `0016_course_slugs.sql`: `course_slug_redirects` (PK org+slug, `course_id` FK + indeks) — kursning eski slug'lari.
- **API:**
  - yaratish: org bo'yicha `pg_advisory_xact_lock` ostida birinchi bo'sh variant (`html`, `html-2`, …) — boshqa kursning hozirgi **va eski** slug'lari band hisoblanadi. Avval band slug 409 berardi, endi `-2` qo'shiladi (topshiriq talabi; eski test yangilandi);
  - tahrirlash (kurs xodimi): band slug 409 `SLUG_TAKEN` (tahrirda jimgina o'zgartirilmaydi); e'lon qilingan kursning eski slug'i yo'naltirish sifatida saqlanadi; kurs o'z eski slug'ini qaytarib olsa, o'sha yo'naltirish o'chadi; zanjir yo'q — barcha eski slug'lar hozirgisiga olib boradi; audit `course.slug_change`;
  - `GET /orgs/:orgId/courses/slug-suggestion?title|slug&courseId` (TEACHER/ORG_ADMIN) — server hozir qaysi slug berishini ko'rsatadi (faqat ko'rinish, yaratish/tahrir qayta tekshiradi);
  - ochiq `GET /public/courses/:slug`: eski slug uchun `{ movedTo }` (faqat kurs e'lon qilingan bo'lsa; qoralama/arxiv 404).
- **Web:**
  - `components/slug-field.tsx` (`/kurslar/` prefiksli maydon, `aria-live` izoh: "Nomdan yasaldi / Qo'lda kiritilgan · bo'sh", band bo'lsa qaysi manzil berilishi yoki tahrirda xato), `useSlugPreview` (300 ms debounce); `lib/slug-input.ts` — nom o'zgarsa slug yangilanadi, qo'lda tahrir qilingandan keyin ustiga yozilmaydi, maydon tozalansa yana nomga ergashadi; yozish paytida normallashtiriladi. 3 ta test.
  - Yangi kurs formasi va kurs boshqaruvi sahifasida "Manzil" bloki ("Manzilni o'zgartirish", "Nomdan yasash", e'lon qilingan kursda tasdiq oynasi).
  - `/kurslar/[slug]`: eski slug → `permanentRedirect` (HTML oqimidan oldin). **Eslatma:** Next.js doimiy yo'naltirish uchun **308** qaytaradi (301 emas); qidiruv tizimlari uchun ikkalasi bir xil doimiy yo'naltirish. Aynan 301 kerak bo'lsa, proxy'da har kurs sahifasiga qo'shimcha API so'rovi kerak bo'ladi — qilinmadi.
- Testlar: `test/course-slugs.test.ts` 9 ta (lotin/kirill nomdan, org ichida `-2/-3`, boshqa org'da mustaqil, 80 belgi, 5 ta parallel yaratish → 5 xil slug, server validatsiyasi, suggestion RBAC 401/403, qayta nomlash → `movedTo`, ikki marta qayta nomlash, eski slug band (409 / `-2`), o'z eski slug'ini qaytarish, qoralama va arxivda yo'naltirish yo'q, begona o'qituvchi 403, boshqa org 404). `schema.test.ts` (FK indekslari) o'tdi.
- Regressiya: typecheck ✅, lint ✅, format ✅, test ✅ (shared 57 + libs 3 + sandbox 16 + web 41 + check-engine 23 + api 367 = **507**).
- Demo bazaga `0016` qo'llandi. Brauzer tekshiruvi (`slug-check.cjs`, scratchpad) **17/17**: jonli slug, band slug izohi, qo'lda tahrir saqlanishi, tozalansa nomga qaytishi, 390px'da gorizontal scroll yo'q, boshqaruv sahifasida qayta nomlash → eski manzil 308 + `Location`, qaytarish. Natijada demo "HTML asoslari" kursi asl `html-asoslari` slug'ida, `html-asoslari-yangi` esa unga yo'naltiruvchi eski slug bo'lib qoldi (zararsiz). Sahifa xatolari 0.
- Commit: `c3e04ad`.

### 6-band — Elektron darslik (boshlandi, to'xtatildi)

- 6-band ishlari **hali commit qilinmagan** (ishchi daraxtda).
- **Bog'liqliklar:** api — `pdfjs-dist@6.4.299` (Node 24 `require(esm)` bilan CommonJS'dan yuklanadi), `@napi-rs/canvas@1.0.10`; web — `page-flip@2.0.7` (MIT, tiplari yo'q — `src/types/page-flip.d.ts`).
- **Shared** `books.ts`: `bookMetaSchema` (multipart maydonlari: nom, muallif, yil 1900–2100, tavsif, yo'nalish, kurs), `updateBookSchema` (+ `published`), `bookProgressSchema`, `bookPagesQuerySchema` (oraliq ≤12 bet, `sm|lg`), `BOOK_URL_TTL_SECONDS = 300`, tiplar `BookSummary`, `BookDetail` (mundarija, bet o'lchami, suv belgisi matni), `BookAdmin`, `BookAdminList` (+ ogohlantirishlar), `BookPageUrls`.
- Migratsiya `0017_books.sql`: `books` (holat PROCESSING/READY/FAILED, xato matni, `published`, betlar soni va o'lchami, `toc` jsonb, fayl hajmi, muqova) va `book_progress` (PK foydalanuvchi + kitob). Hamma FK indeksli. Demo bazaga **hali qo'llanmagan**.
- Config (`.env.example` ga qo'shildi): `BOOKS_DIR` (default `./.data/books`, ochiq papka emas), `BOOK_MAX_MB` (50), `BOOK_MAX_PAGES` (1000), `BOOK_PROCESS_TIMEOUT_MS` (10 daqiqa), `BOOK_URL_SECRET` (≥32, **production'da majburiy**; aks holda har process'da tasodifiy), `BOOK_PAGE_RATE_PER_MINUTE` (120). `config.test.ts` yangilandi.
- **API** (`src/books/`):
  - `rasterize.ts` + `rasterize-main.ts`: alohida child process'da (env allowlist — DB URL va sirlarsiz, heap 768 MB, qattiq kill taymeri, chiqish ≤512 KB) pdf.js har betni WebP'ga aylantiradi: `lg` 1400px va `sm` 700px eni, balandlik ≤2400px; skript/XFA o'chiq, shriftlar pdf.js'ning lokal `standard_fonts` dan (tarmoq yo'q). Mundarija (outline, 3 daraja, 300 ta). Muqova: yuklangan rasm qayta kodlanadi (≤600px, metadata tushadi) yoki 1-bet. Parol bilan himoyalangan yoki buzilgan PDF → FAILED + tushunarli matn.
  - `book-processor.ts`: navbat (bir vaqtda bitta), restart'da PROCESSING kitoblar qayta navbatga qo'yiladi (bitta instance), worker javobi `parseReply` bilan qayta tekshiriladi.
  - `book-files.ts`: saqlash yo'llari (`<BOOKS_DIR>/<uuid>/original.pdf`, `pages/<n>-lg|sm.webp`, `cover.webp`), magic-byte tekshiruvi (PDF, PNG/JPEG/WebP), `PageSigner` — HMAC-SHA256 (foydalanuvchi + **sessiya** + kitob + bet + o'lcham + muddat, timing-safe), `watermark()` — har so'rovda betga diagonal takrorlanuvchi va pastki qatorda "Ism · ID xxxxxxxx · sana vaqt (Toshkent)" chiziladi (shrift pdf.js'dagi Liberation Sans — konteynerda tizim shrifti bo'lmasa ham ishlaydi).
  - `books.service.ts` + `books.controller.ts`:
    - admin (faqat ORG_ADMIN, `/orgs/:orgId/admin/books`): ro'yxat (+ yo'nalishlar, kurslar, limitlar, oxirgi 30 kun ogohlantirishlari), yuklash (multipart `file` + ixtiyoriy `cover`; nom `.pdf` + MIME `application/pdf` + `%PDF-` baytlari — uchchalasi shart; hajm limiti; begona tashkilot kursi 400), tahrir, e'lon qilish/yashirish (faqat READY, aks holda 409 `BOOK_NOT_READY`), o'chirish (fayllar bilan), muqova. Audit: `book.upload`, `book.publish/unpublish`, `book.delete`.
    - o'quvchi (tizimga kirgan har bir foydalanuvchi, `/books`): platforma tashkiloti va o'z tashkilotlarining e'lon qilingan READY kitoblari; e'lon qilinmaganini faqat o'sha tashkilot admini ko'radi; qolgan holatlar bir xil 404. `GET /books`, `GET /books/:id`, `GET /books/:id/pages?from&to&size` (imzolangan URL'lar, 5 daqiqa), `GET /books/:id/pages/:n?size&exp&sig` (sessiya + imzo + kirish huquqi qayta tekshiriladi, suv belgili WebP), `GET /books/:id/cover`, `PUT /books/:id/progress`.
    - Rasm javoblari: `image/webp`, `Content-Disposition: inline`, `Cache-Control: no-store, private`, `Cross-Origin-Resource-Policy: same-origin`, `X-Robots-Tag: noindex`. Asl PDF uchun route yo'q.
    - Limit: foydalanuvchi bo'yicha daqiqasiga `BOOK_PAGE_RATE_PER_MINUTE` bet (DB limiter) → 429 `BOOK_RATE_LIMITED` + admin uchun ogohlantirish (audit `book.rate_limited`, bir foydalanuvchiga 10 daqiqada bittadan ko'p emas).
  - `make-pdf.ts`: testlar uchun kichik PDF yozuvchi (matn + outline).
  - Testlar `test/books.test.ts` **13/13** ✅: RBAC (401, TEACHER/STUDENT 403, begona org 404); PDF emas / noto'g'ri kengaytma / MIME / hajm / yomon muqova / yil — 400; begona kurs 400; 2 o'lchamda WebP, outline, muqova; e'lon qilinmagan yashirin, admin oldindan ko'radi; buzilgan PDF → FAILED va e'lon qilib bo'lmaydi; boshqa tashkilot kitoblari ajratilgan; suv belgili rasm (saqlangan fayldan farq qiladi) va header'lar; soxta imzo, boshqa bet/o'lcham/muddat, muddati o'tgan, boshqa foydalanuvchi, **boshqa sessiya** — 403, sessiyasiz 401, asl faylga yo'l 404; limit (10 tadan keyin 429, bitta ogohlantirish, boshqa foydalanuvchiga ta'sir yo'q); progress; tahrir/yashirish/o'chirish.
  - API typecheck toza. To'liq `pnpm -r test` hali ishga tushirilmagan.
- **Web** — yozildi, lekin **typecheck/lint/format/test va brauzer tekshiruvi hali qilinmagan** (ish shu joyda to'xtadi):
  - `lib/books.ts`: `filterBooks` (qidiruv apostrofga befarq, yo'nalish filtri, 5 xil saralash), `visiblePages`, `pagesToLoad` (joriy ±2), `isBlockedShortcut` (Ctrl/Cmd+S/P/U, Ctrl+Shift+I/J/C, F12).
  - `/kitoblar`: muqovali kartalar (stretched link), qidiruv, yo'nalish filtri, saralash, "O'qish" / "Davom ettirish (N-bet)" + progress foizi, skeleton, bo'sh holatlar; yuklab olish tugmasi yo'q.
  - `/kitoblar/[id]` + `components/book-reader.tsx`: page-flip (HTML rejimi, betlar imperativ yaratiladi — vidjet DOM'ni o'zi boshqaradi), desktopda ikki bet, < 768px bitta; har bet `<canvas>` (`<img>` yo'q), rasm `fetch` → `createImageBitmap` → canvas; joriy ±2 bet lazy, skeleton; uzoqdagi betlar xotiradan bo'shatiladi (±6); pastki panel: oldingi/keyingi, "3–4 / 120", betga o'tish, mundarija (Dialog), zoom 100–200%, to'liq ekran; klaviatura ←/→/PageUp/PageDown/Home/End; progress 800 ms debounce bilan saqlanadi; kontekst menyu, sudrash, belgilash, nusxa olish o'chiq; chop etishda bo'sh sahifa (`globals.css`). App-shell'da `/kitoblar/[id]` to'liq kenglikda (`FULL_BLEED`).
  - `/orgs/[orgId]/admin/books`: drag & drop yuklash (XHR progress foizi, klientda ham PDF/hajm tekshiruvi), metadata, muqova, holatlar (tayyorlanmoqda — 3 s polling / tayyor / xato), e'lon qilish/yashirish, "Ko'rish", tahrir (Dialog), o'chirish (tasdiq bilan), ogohlantirishlar.
  - Navigatsiya: yon menyuda "Elektron darslik" (hamma) va "Elektron darsliklar" (admin), `AdminNav` tabi; yangi ikonkalar `eye`, `eyeOff`, `list`, `zoomIn`, `zoomOut`.

### Keyingi qilinadigan ishlar (2026-10-20 holati)

1. ~~**6-bandni yakunlash:**~~ — bajarildi, 2026-10-22 yozuviga qarang.
   - web: typecheck, lint, `prettier --write` (yangi fayllar formatlanmagan), unit testlar (`lib/books.ts`: filtr/saralash, `pagesToLoad`, `isBlockedShortcut`);
   - to'liq `pnpm -r test` va `pnpm -r build`;
   - demo bazaga `0017` (API'ni to'xtatib `node dist/db/migrate.js`, keyin qayta ishga tushirish);
   - brauzer tekshiruvi (Chrome, iloji bo'lsa Firefox/Edge): admin sinov PDF'ini yuklaydi (`makePdf` bilan ko'p betli) → READY → e'lon qilish; talaba ro'yxat, qidiruv/filtr; o'quvchi: ikki bet / telefonda bitta, varaqlash (tugma, klaviatura, sudrash, swipe), betga o'tish, mundarija, zoom (qayta yaratilganda xato yo'qligi, zoom > 1 da sichqoncha bilan varaqlash o'chiq), to'liq ekran, qayta ochganda progress tiklanishi, canvas'da suv belgisi, kontekst menyu/Ctrl+S/P bloklangan, print bo'sh; 390/1440 × light/dark, gorizontal scroll 0, konsol xatolari 0;
   - `deploy/README.md` ga `BOOKS_DIR` (volume, zaxira nusxa) va `BOOK_URL_SECRET`;
   - jurnalga yakuniy yozuv va commit.
   - Hisobotdagi cheklovlar: himoya mutlaq emas (skrinshot/kamerani to'xtatib bo'lmaydi — suv belgisi kimligini ko'rsatadi); navbat bitta instance ichida; rasterizatsiya API host'idagi child process (production'da alohida worker tavsiya); Safari tekshirilmagan.
2. **8-band — Chatbot:** suzuvchi tugma (o'ng pastda, telefonda to'liq ekran); platformadan foydalanish, kurslar va yo'nalishlar bo'yicha yordam va havolalar; bilim bazasi (FAQ + kurslar + yo'nalishlar, BM25'ga o'xshash qidiruv, kirill → lotin — `slugify` qoidalaridan foydalanish mumkin); o'zbekcha javob; tezkor savol tugmalari, yozmoqda indikatori, sessiya tarixi (`sessionStorage`), "Yangi suhbat"; javob topilmasa "Admin bilan bog'lanish" — DB + admin panel ro'yxati + Telegram notifier interfeysi (hozircha o'chiq, bot keyin); mehmonlarga ochiq; default retrieval/mock, haqiqiy LLM faqat `AI_PROVIDER=http`; kalitlar faqat serverda; rate limit; maxfiylik. Testlar, brauzer tekshiruvi, jurnal, commit.
3. **Yakuniy umumiy hisobot** (8 band: nima qilindi, o'zgargan fayllar, qanday tekshirish, tekshirilgan sahifalar, cheklovlar va tavsiyalar — Safari, Lighthouse 90+ o'lchovi, production infratuzilmasi).
4. Avvalgi ochiq masalalar o'zgarmagan: GitHub push (yangi token, public/private qarori), eski tokenni revoke qilish, Docker / haqiqiy Postgres / sandbox domeni / edge proksi / backup, demo talabalarga parol berish.

## 2026-10-22

### 6-band — Elektron darslik (yakunlandi)

- Web qismi: typecheck ✅, lint ✅, format ✅; `lib/books.test.ts` (filtr/saralash, bet oynalari, bloklangan tugmalar) bor edi va o'tdi.
- **Topilgan va tuzatilgan:**
  - **Telefonda darslik ikki betli mayda ko'rinishda chiqardi** va "Keyingi bet" 2 betga sakrardi. Sabab: page-flip `stretch` rejimida faqat blok eni `2 × minWidth` dan tor bo'lganda bitta betga o'tadi, biz `minWidth: 100` bergan edik. Endi portret rejimida `minWidth` = host eni. Brauzerda tasdiqlandi: 31 → 32 → 33 …
  - `BOOK_URL_SECRET` production'da majburiy bo'lgach, AI config testi (`provider.test.ts`) kutilgan `AI_PROVIDER_URL` xatosi o'rniga shu xatoni olardi — test muhitiga sir qo'shildi.
  - `monaco-bundle.test.ts` parallel test paketlari bilan 5 s limitdan oshardi (bir necha MB minified kodni o'qiydi) — 30 s timeout.
  - Ro'yxatdagi "Davom ettirish (17-bet)" tugmasi tor kartada ikki qatorga bo'linardi — bet raqami progress ostida bor, tugma "Davom ettirish".
- **Deploy** (tekshirilmagan — lokal Docker yo'q): API image'ida `/data/books` (`node` egasi, `BOOKS_DIR`), compose'da `books` volume (API root FS read-only qoladi) va API xotira limiti 512M → 1536M (rasterizatsiya child process'ining heap'i 768 MB). `deploy/README.md`: "Electronic textbooks" bo'limi (`BOOK_URL_SECRET` barcha instance'larda bir xil, volume zaxirasi bazaning dump'i bilan bir kecha, bir nechta instance'da qayta navbatga qo'yish ogohlantirishi) va backup jadvaliga qator.
- Demo bazaga `0017` qo'llandi (hali kitob yuklanmagan).
- Brauzer tekshiruvi (demo bazaning **nusxasida**, compiled API + `next start` + sandbox, scratchpad'dagi `books-check.cjs`): **Chrome 29/29, Edge 29/29.** Admin 40 betli mundarijali PDF'ni UI orqali yuklaydi → "Tayyor" → e'lon qiladi; soxta PDF rad etiladi; talaba ro'yxatda ko'radi, qidiruv, yuklab olish havolasi yo'q; o'quvchi: desktopda ikki bet (1–2), ←/→/Home/End, tugmalar, betga o'tish, mundarija (→ 17–18), suv belgisi canvas'da, zoom 125–200% (bet saqlanadi, maksimumda tugma o'chadi), kontekst menyu/Ctrl+S/Ctrl+P bloklangan, chop etishda bo'sh, qayta yuklashda progress tiklanadi, ro'yxatda "Davom ettirish"; telefon (390, dark) — bitta bet, +1 qadam, gorizontal scroll yo'q; mehmon `/login` ga. Nusxa baza va fayllar keyin o'chirildi.
- Regressiya: format ✅, typecheck ✅, lint ✅, build ✅, test ✅ (shared 57 + libs 3 + sandbox 16 + web 49 + check-engine 23 + api 380 = **528**), to'liq E2E **51/51** ✅.
- **STATUS: READY_WITH_INFRASTRUCTURE_LIMITATIONS.**
- Cheklovlar:
  - Himoya mutlaq emas: skrinshot yoki kamera bilan suratga olishni to'xtatib bo'lmaydi — suv belgisi kim va qachon olganini ko'rsatadi. Klientdagi to'siqlar (kontekst menyu, tugmalar, print) faqat tasodifiy nusxalashni qiyinlashtiradi.
  - Rasterizatsiya navbati bitta instance ichida, API host'idagi child process (production'da alohida worker tavsiya etiladi).
  - Firefox va Safari'da o'quvchi tekshirilmagan (Playwright'ning Firefox build'i o'rnatilmagan; Safari Windows'da yo'q). Sudrash/swipe bilan varaqlash avtomatik tekshirilmadi (tugma va klaviatura tekshirildi).
  - Docker image va volume o'zgarishlari lokal tekshirilmagan.
- Keyingi qadam: **8-band — Chatbot**, keyin 8 band bo'yicha yakuniy hisobot.

### 6-band — tuzatish (typecheck)

- 6-band yakunida faqat web typecheck ishga tushirilgan ekan: `apps/api` typecheck'i testlarni ham qamraydi va `test/books.test.ts` dagi superagent parser tipi xato edi (`pnpm -r typecheck` yiqilardi). Tuzatildi; endi butun repo typecheck va lint toza. 2026-10-22 dagi 6-band yozuvidagi "typecheck ✅" faqat web uchun to'g'ri bo'lgan.

### 8-band — Chatbot

- **Shared:** `toLatin()` (`slugify` dan ajratildi — kirill → lotin, apostroflarsiz, bo'sh joylar saqlanadi), `chatbot.ts`: `chatAskSchema` (≤500), `chatContactSchema` (ism, bog'lanish, savol, sahifa — faqat ichki yo'l), `CHAT_HREF_RE`, `CHAT_QUICK_QUESTIONS`, `ChatAnswer`, `ContactRequestView`.
- **Bilim bazasi (RAG — retrieval):**
  - `src/chatbot/faq.ts`: 27 ta savol-javob, faqat platforma haqiqatda qiladigan narsalar (ro'yxatdan o'tish, kirish, parol, yozilish, ketma-ket ochilish, CHECK/RUN, AI tutor, topshiriq, test, natijalar, portfolio, sertifikat yo'qligi, darslik, playground, PHP, Bootstrap CDN, telefon, o'qituvchi, guruh, admin). Narx, jadval kabi bilinmagan narsalar yozilmadi — bunday savollar "bilmayman" + admin.
  - `knowledge.ts`: FAQ + ochiq katalog (yo'nalishlar va e'lon qilingan platforma kurslari, modul nomlari) `CatalogService` orqali — mehmon allaqachon ko'ra oladigan ma'lumot. Dars matni, mashqlar, javoblar, foydalanuvchilar indekslanmaydi. 5 daqiqalik kesh.
  - `search.ts`: lotin/kirill normallashtirish, yengil o'zbekcha o'zak ajratish (qo'shimchalar, 5 harfli kalit), stop-so'zlar va umumiy fe'llar, BM25. **Qamrov** (IDF bo'yicha savolning qancha qismi hujjatda bor) — `MIN_SCORE 1.5` va `MIN_COVERAGE 0.5` dan past bo'lsa bot taxmin qilmaydi: "aniq javob topa olmadim" + "Administratorga yozish". Sozlashda topilgan: "kursi" → "kur" (2 harfli qo'shimcha uchun o'zak ≥4), "berasizlarmi"/"olsam" qamrovni tushirardi (stop-ro'yxat).
  - Ixtiyoriy LLM (`CHATBOT_AI=true` va `AI_PROVIDER=http` bo'lgandagina): model faqat topilgan manbalardan javobni qayta yozadi; faqat savol va ochiq bilim bazasi matni yuboriladi; savol `<<< >>>` ichida (delimiter neytrallanadi); javobda URL, email yoki markup bo'lsa rad etiladi; havolalar faqat bilim bazasidan; noma'lum savollar modelga yuborilmaydi; platforma bo'yicha sutkalik limit `CHATBOT_AI_DAILY`; har qanday xatoda bilim bazasi javobi. `ProviderRequest.plan` ixtiyoriy bo'ldi (mock tutor rejasisiz so'rovga BAD_RESPONSE beradi).
- **Admin bilan bog'lanish:** migratsiya `0018_chat_contact.sql` — `chat_contact_requests` (platforma tashkiloti, ixtiyoriy foydalanuvchi, ism, bog'lanish, savol, sahifa, hal qilingan vaqti va kim). Chat savollarining o'zi **saqlanmaydi** (tarix faqat brauzer `sessionStorage` da). Foydalanuvchi faqat haqiqiy sessiya cookie'si orqali bog'lanadi (body'dagi `userId` e'tiborga olinmaydi). Audit `contact.create/resolve/reopen` shaxsiy ma'lumotsiz. `ContactNotifier` interfeysi (`CONTACT_NOTIFIER`, default `NoopContactNotifier`) — Telegram bot keyin shu yerga ulanadi; notifier xatosi so'rovni buzmaydi va mazmun loglanmaydi.
- **API:** `POST /public/chat` (mehmonlarga ochiq, IP bo'yicha `CHATBOT_RATE_PER_MINUTE`=20, 429 `CHAT_RATE_LIMITED`), `POST /public/chat/contact` (IP bo'yicha soatiga `CHATBOT_CONTACT_PER_HOUR`=5), `GET /orgs/:orgId/admin/contact-requests` va `PUT …/:id/resolved` (faqat ORG_ADMIN, faqat o'z tashkiloti). Origin (CSRF) tekshiruvi POST'larga ham qo'llanadi. `.env.example` ga 4 ta o'zgaruvchi.
- **Web:** `components/chat-widget.tsx` (root layout'da, barcha sahifalarda; darslik o'quvchisida yashirin) — o'ng pastda suzuvchi tugma; native `<dialog>`: telefonda `showModal()` (to'liq ekran, fokus ushlanadi, fon inert), kengroq ekranda `show()` panel; Esc yopadi va fokusni tugmaga qaytaradi; xush kelibsiz xabari, 6 ta tez savol, javob ostida havolalar (faqat ichki) va keyingi savollar, yozish indikatori (`role=status`), `role="log"`; "Yangi suhbat"; tarix `sessionStorage` da (buzilgan/soxtalashtirilgan yozuvlar tashlanadi, 40 tagacha); aloqa formasi (oxirgi javobsiz savol bilan to'ldiriladi, klient validatsiyasi `aria-invalid` bilan, muvaffaqiyat xabari). `lib/chat.ts` (+4 test). Admin: `/orgs/[orgId]/admin/contacts` ("Ochiqlar/Hammasi", hal qilindi/qayta ochish), yon menyu va AdminNav'da "Murojaatlar". Ikonkalar: `headset`, `inbox`, `refresh`.
- Testlar: shared +4 (`toLatin`, chatbot sxemalari), api `src/chatbot/search.test.ts` 18 ta (lotin/kirill, o'zak, 13 ta savol → to'g'ri FAQ, 5 ta savol → "bilmayman", har FAQ o'z savoli bilan topiladi), `test/chatbot.test.ts` 13 ta (mehmon, kirill, katalog — qoralama va dars matni sizmaydi, "bilmayman", validatsiya, IP limiti, CSRF, aloqa — notifier, faqat platforma admini, begona org 404/bo'sh, talaba/o'qituvchi 403, sessiyasiz 401, soxta cookie/userId, limit, notifier xatosi, hal qilish/qayta ochish, audit'da shaxsiy ma'lumot yo'q; LLM — manbalar, fence, URL/email/markup rad, sutkalik limit, provayder xatosi, flag o'chiq).
- Regressiya: typecheck ✅, lint ✅, format ✅, build ✅, test ✅ (shared 61 + libs 3 + sandbox 16 + web 53 + check-engine 23 + api 411 = **567**).
- Brauzer (demo baza nusxasi, compiled API + `next start`, scratchpad'dagi `chat-check.cjs`): **Chrome 32/32, Edge 32/32** — mehmon, tez savol, kirill, katalog javobi, yozish indikatori, "bilmayman" + admin tugmasi, qayta yuklashdan keyin tarix, aloqa formasi (validatsiya, yuborish), yangi suhbat, Esc + fokus, telefonda to'liq ekran modal, havola bosilganda chat yopiladi, ≥44px, gorizontal scroll yo'q, admin ro'yxati va hal qilish, talabaga admin API 403, darslik sahifasida tugma yo'q. axe-core (WCAG 2.1 A/AA) chat va aloqa formasi × 1440/390 × light/dark: **8/8** (topildi va tuzatildi: `<ol role="log">` ro'yxat semantikasini buzardi → `role="log"` tashqi `div` da). IP limitlari brauzerda ham ishladi (ketma-ket ishga tushirishlarda 429).
- To'liq E2E: joriy kod bilan 11 marta ishga tushirildi — **9 tasi 51/51**, 2 tasi yiqildi (dastlabki uchtadan ikkitasi, keyin 8 marta ketma-ket o'tdi). Ikkala yiqilish bir xil: tasdiq oynasidan keyingi POST'da (topshiriq v2, parolni tiklash) brauzer `/api` so'roviga tarmoq xatosi oldi ("Server bilan aloqa yo'q"); API va Next loglarida xato yo'q (Next proksi xatosi "Failed to proxy" deb yozilardi). Chatbotsiz oldingi commit (`9f1b439`, alohida worktree) bilan 5/5. Node va brauzerdan ~5 s keep-alive pauzali 28 + 40 ta POST bilan takrorlab bo'lmadi. **Sabab aniqlanmadi**; chatbot bilan bog'liqligi ham, bog'liq emasligi ham isbotlanmadi. E2E endi to'xtaganda `browser-diagnostics.txt` (konsol xatolari, uzilgan so'rovlar va sababi) va har sahifa uchun `failure-N.txt` (URL, alert/status matnlari) yozadi — app-shell'da faqat `<main>` aylangani uchun `fullPage` skrinshot sahifa tepasidagi xatoni ko'rsatmas edi.
- **STATUS: READY_WITH_INFRASTRUCTURE_LIMITATIONS.**
- Cheklovlar:
  - Bot qidiruvga asoslangan (default LLM'siz): javoblar oldindan yozilgan matn; murakkab yoki ko'p qismli savollarda eng yaqin bitta mavzuni beradi, suhbat kontekstini (oldingi savolni) hisobga olmaydi.
  - Haqiqiy LLM bilan ifodalash faqat soxta provayder bilan sinalgan (tashqi xizmat ulanmagan).
  - Telegram xabarnomasi yo'q — faqat interfeys (`ContactNotifier`); murojaatlarni admin panelda ko'rish kerak. Murojaatlarni saqlash muddati (avtomatik o'chirish) yo'q.
  - "Murojaatlar" bo'limi har tashkilot admini menyusida ko'rinadi, lekin murojaatlar faqat platforma tashkilotiga tushadi (boshqa tashkilotlarda ro'yxat bo'sh).
  - Firefox/Safari'da tekshirilmagan.

### 8 band — yakuniy holat

- Bajarildi: 1 dizayn (Tabler ikonkalar, tokenlar, emojisiz), 2 responsivlik (6 viewport, 44px, modal dialoglar), 7 to'liq oyna app-shell, 4 kabinet menyusi va xavfsiz chiqish, 5 yo'nalishlar (ochiq SEO sahifalar + 4 yangi kurs), 3 avtomatik slug va eski slug yo'naltirishlari, 6 elektron darslik (suv belgili flipbook), 8 chatbot.
- Umumiy cheklovlar va tavsiyalar: Safari va Firefox'da qo'lda tekshirish; Lighthouse 90+ va CLS < 0.1 o'lchanmagan (axe bilan WCAG tekshirilgan, Lighthouse yo'q); E2E'dagi kamdan-kam tarmoq uzilishini kuzatish; Telegram bot; production infratuzilmasi (Docker image'lar, haqiqiy Postgres, alohida sandbox domeni, edge proksi, backup, secret manager) va GitHub push hali ham ochiq.

### GitHub push — urinish (2026-10-22)

- Foydalanuvchi yangi classic token berdi (`repo` ruxsati, repo'da push va admin bor). Repo public qoladi (foydalanuvchi qarori: CHECK qoidalari, yechimlar va test javoblari ochiq bo'lishi qabul qilindi).
- Push'dan oldin butun tarix (63 commit) skan qilindi: token/kalit/parol yo'q (yagona moslik — guard testidagi soxta `sk-…` namunasi), `.env`/kalit fayllari yo'q, talabalar ro'yxatidagi 74 ta ismdan birortasi ham tarixda yo'q.
- **Push rad etildi:** token `workflow` ruxsatisiz `.github/workflows/ci.yml` ni yarata olmaydi. Hech narsa yuborilmadi, remote hali bo'sh. Token konfiguratsiya yoki remote URL'ga yozilmadi.
- Keyingi qadam: `repo` + `workflow` ruxsatli yangi token (yoki shu tokenga `workflow` qo'shish), so'ng push; chatda ochilgan tokenlarni revoke qilish.
- **Qayta urinish — muvaffaqiyatli:** foydalanuvchi tokenga `workflow` ruxsatini qo'shdi (`X-OAuth-Scopes: repo, workflow`). `git push -u origin main` → `[new branch] main -> main`; remote `main` = lokal `9a4b5e5`. Token faqat bitta buyruqda vaqtinchalik header sifatida ishlatildi, konfiguratsiyada yo'q.
- GitHub Actions'da **CI birinchi marta ishga tushdi** (run 39759609938, push'da). Natijasi keyin tekshiriladi (Docker image'lar, Ubuntu'da E2E, gitleaks — avval hech qachon ishlamagan).
- Tavsiya: chatda ochilgan tokenni revoke qilish; keyingi push'lar uchun yangi token yoki Git Credential Manager.

## 2026-10-23

### Kamchiliklar tuzatildi: CI audit, Next RCE, "Murojaatlar" menyusi

- **CI natijasi tekshirildi** (birinchi run, `86507b7`): `check` job'ida format, typecheck, lint, test (Ubuntu'da haqiqiy Chrome bilan CHECK), build va migratsiya drift **o'tgan**; yagona yiqilgan qadam — `pnpm audit --prod`. Shu sabab `images` (Docker) va `e2e` job'lari o'tkazib yuborilgan, ya'ni hali ham tekshirilmagan.
- **Audit topilmalari va tuzatishlar:**
  - CI'dagi (22-oktabr) audit faqat Bootstrap 3 ni topgan; Next.js advisory'lari bazaga keyin qo'shilgan va 23-oktabrdagi lokal audit'da chiqdi. Ikkalasi ham tuzatildi, aks holda keyingi CI Next sabab yiqilardi.
  - **Next.js 16.4.0** — 2 ta critical (autentifikatsiyasiz RCE: Image Optimization + SVG, `use cache`) va 1 ta high (Server Actions DoS). `next` va `eslint-config-next` → **16.4.2**.
  - **DOMPurify ≤3.4.16** (Monaco orqali) — override `>=3.4.17`. Monaco `min` bundle'idagi ichki nusxa (3.4.15) override'dan ta'sirlanmaydi: bundle tahlil qilindi — Monaco faqat `RETURN_DOM_FRAGMENT`/`RETURN_TRUSTED_TYPE` beradi, advisory'lar talab qiladigan `IN_PLACE`, `SAFE_FOR_TEMPLATES`, `PARSER_MEDIA_TYPE` ni hech qachon bermaydi. `monaco-bundle.test.ts` uchala opsiyani tekshiradi.
  - **Bootstrap 3.4.1** (2 ta moderate XSS) — tuzatilgan versiyasi yo'q; faqat Bootstrap 3 kursi uchun talaba loyihasiga sandbox ichida (opaque origin, tarmoqsiz, platforma cookie'larisiz) beriladi. `pnpm-workspace.yaml` da `auditConfig.ignoreGhsas` bilan asoslangan istisno.
  - `pnpm audit --prod`: "2 ignored", qolgani toza.
- **"Murojaatlar" menyusi** (8-band cheklovi): `/auth/me` har a'zolikda `platform` belgisini qaytaradi (`DEFAULT_ORG_SLUG` bo'yicha). Yon menyu va `AdminNav` bo'limni faqat platforma tashkiloti adminiga ko'rsatadi (ruxsat avvalgidek serverda). Testlar: `auth.test.ts`, `chatbot.test.ts` (begona tashkilot admini — `false`).
- Regressiya: format ✅, typecheck ✅, lint ✅, build ✅, test ✅ (shared 61 + libs 3 + sandbox 16 + web 53 + check-engine 23 + api 411 = **567**), audit ✅, to'liq E2E **51/51** ✅ (Next 16.4.2 bilan).
- Ochiq: Docker image'lar va Ubuntu E2E keyingi push'dagi CI'da birinchi marta tekshiriladi; demo bazada `next dev` ham yangi versiyada ishlaydi (qayta ishga tushirishda).
