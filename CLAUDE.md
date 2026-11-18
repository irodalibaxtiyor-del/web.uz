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

Oldingi sessiyalar (2026-10-08 … 2026-10-27): [docs/ISH_JURNALI_ARXIV.md](docs/ISH_JURNALI_ARXIV.md).

## Joriy holat (qisqacha)

- **Bajarilgan:** roadmap fazalari F0–F2, 11–15C; kurslar HTML, CSS, JS, PHP, Bootstrap 3/4/5, Moslashuvchan dizayn, UI asoslari, Figma'dan kodga, Portfolio; guruhlar, o'qituvchi/talaba hisoblari va Excel; 8 band (dizayn, responsivlik, app-shell, kabinet menyusi, yo'nalishlar, slug, elektron darslik, chatbot); Loms dizayni qaytarilgan; 8 xil test turi; ilmiy modul (formativ fikr, kirish/yakuniy test, tajriba va nazorat guruhlari statistikasi, so'rovnomalar va Cronbach α, savollar tahlili, vaqt sarfi, normallik va parametrik bo'lmagan mezonlar).
- **Muhim qoidalar (arxivdan):**
  - Tranzaksiya ichida faqat `tx` ishlatilsin (aks holda PGlite deadlock).
  - Postgres `jsonb` kalitlar tartibini saqlamaydi — taqqoslashda kanonik JSON.
  - Brauzer sinovlari demo bazaning **nusxasida** (`apps/api/.data/pg` → scratchpad).
  - Kurs kontenti: W3Schools'dan faqat mavzular tartibi, matn/misol/mashq original o'zbekcha; har mashq `content:verify` da haqiqiy Chrome'da tekshiriladi.
  - Talabalar ro'yxati (shaxsiy ma'lumot) repoga yozilmaydi (`apps/api/.data/` gitignore'da); repo public.
  - Git Bash: URL yo'llari uchun `MSYS_NO_PATHCONV=1`; murakkab matnli heredoc o'rniga fayl + node skript.
- **Ochiq (infratuzilma):** Ubuntu'dagi CI E2E, Docker/haqiqiy Postgres/sandbox domeni/edge proksi/backup tekshiruvi, haqiqiy AI provayder (DPA), SMTP, Safari va haqiqiy qurilmalar, Lighthouse qayta o'lchovi.
- **Ochiq (reja):** har darsga test va har mashqqa mini-test (izohlar bilan), darsdagi interaktiv bloklar, atamalar lug'ati, takrorlash, sertifikat, Telegram xabarnomalari.

## 2026-11-14

### Holat tekshiruvi va demo qayta ishga tushirildi

- 2026-10-27 da to'xtagan Lighthouse tuzatishlari (Zod `jitless`, footer `h2`, Monaco `wd-dark` temasi, E2E CI annotatsiyalari) tekshirildi: typecheck ✅, lint ✅, format ✅, test ✅ (shared 61 + libs 3 + sandbox 16 + web 56 + check-engine 23 + api 411 = **570**). Hali commit qilinmagan; Lighthouse qayta o'lchovi qilinmagan.
- Ishchi daraxtda tasodifiy o'zgarishlar bor: roadmap faylining 1-qatori boshida ortiqcha `a` harfi va `next dev` o'zgartirgan `apps/web/next-env.d.ts` — commit'dan oldin qaytarish kerak.
- Demo: API (4000, migratsiyalar yangi emas), sandbox (3100), web (`next dev`, 3000) ishga tushirildi; asosiy sahifalar 200.

### Dizayn: Loms uslubiga qaytarildi (funksiyalar saqlandi)

- Foydalanuvchi talabi: "oldingi dizaynga qaytar". Tanlov: Loms uslubi, lekin 20-oktabrdan keyingi funksiyalar (modal dialoglar, responsivlik, app-shell va yon menyu, kabinet menyusi, yo'nalishlar, darslik, chatbot) saqlanadi. `bf690dc` dagi vizual o'zgarishlar teskari qilindi, Tabler ikonkalari qoldi.
- Qaytarilganlar:
  - `globals.css`: och ko'k fon (`canvas` `#f5faff`), katta radiuslar, yumshoq va rangli soyalar, `btn-primary` "glow" + ko'tarilish, pill shaklidagi `section-eyebrow`, `.dots-pattern`;
  - `PageHeader` — ko'k banner (dekor doira va sariq halqa, oq breadcrumb). Banner ichida `btn-primary` sariq, `text-muted` va havolalar oq (kontrast uchun);
  - ochiq sahifalar header'ida ko'k top-bar; auth sahifasi ko'k panel dekorlari bilan;
  - landing: dekorli hero (to'lqinli chiziq, progress kartasi, yashil belgilar), raqamli qadam kartalari, doira ichidagi ikonkali afzalliklar, dekorli CTA bandi;
  - yo'nalish kartalarida rangli ikonka bloklari (`DirectionIcon`, 10 yo'nalish; Tabler brand ikonkalari qo'shildi);
  - kabinetdagi kurs kartalarida gradient muqova va bosh harflar; gradientli progress bar;
  - kurs xaritasida rangli holat doiralari va modul raqami kvadrati; yutuqlarda sariq doiralar; logo soyasi; kabinet kontent fonini och ko'k qilish.
- Tekshiruv: typecheck ✅, lint ✅, format ✅, web test 56/56 ✅. Skrinshotlar (landing, login, yo'nalishlar, kabinet, portfolio × 1440/390 × light/dark): gorizontal scroll 0, sahifa xatolari 0. Dev serverdagi hydration ogohlantirishi eski server keshidan edi — qayta ishga tushirilgach yo'qoldi.
- Hali qilinmagan: to'liq E2E, axe kontrast auditi (banner ichidagi elementlar), commit.

### Keyingi bosqichlar (13.00.06 — "Elektron ta'lim nazariyasi va metodikasi" talablari)

- Foydalanuvchi tanlovi: test turlari — to'g'ri/noto'g'ri, bo'sh joyni to'ldirish, moslashtirish, tartiblash, sudrab tashlash (guruhlarga ajratish), kodli savollar ("nima chiqaradi?", kodni to'ldirish); har darsda test **va** har mashqqa mini-test; darsga o'rnatilgan interaktiv bloklar; test turlari bo'yicha natijalar va hisobot (Excel).
- Reja: (2) quiz sxemasi va server baholash yangi turlar bilan, talaba va o'qituvchi UI (klaviatura bilan ishlaydigan drag & drop); (3) kontent — barcha kurslarga dars testlari va mashq mini-testlari; (4) darsdagi interaktiv bloklar; (5) analitika va Excel.

### 13.00.06 — 2-bosqich: yangi test turlari (davom etmoqda, to'xtatildi)

- Foydalanuvchi "davom et" dedi va loyihani talabalar uchun foydaliroq qilish bo'yicha tavsiyalar ham so'radi (tavsiyalar hali berilmagan).
- **Shared** (`packages/shared/src/quizzes.ts`, qayta yozildi):
  - turlar: SINGLE, MULTIPLE, TRUE_FALSE, FILL_BLANK, CODE_FILL, MATCHING, ORDERING, CATEGORIZE (`QUIZ_KIND_LABEL` — o'zbekcha nomlar);
  - savol sxemasi `kind` bo'yicha discriminated union; `kind` siz eski savollar SINGLE deb o'qiladi (bazadagi testlar buzilmaydi);
  - FILL_BLANK/CODE_FILL: `template` ichida `{{1}}…{{n}}`, `blanks[i].accepted` (bir nechta yozilish), `caseSensitive`; MATCHING: `left`, `right` (chalg'ituvchilar bilan), `pairs`; ORDERING: `items` to'g'ri tartibda; CATEGORIZE: `groups`, `items[].group`;
  - javob: `optionIds` (TRUE_FALSE — `['true'|'false']`), `texts`, `pairs`, `order`, `placements`; eski `{questionId, optionIds}` formati ishlaydi;
  - `gradeQuestion` (har savol hammasi-yoki-hech narsa; yozma javoblarda trim, bo'sh joylar, o'zbek apostroflari birlashtiriladi, CODE_FILL'da bo'sh joylar e'tiborga olinmaydi), `gradeQuiz` endi `results` (savol id, tur, to'g'ri/xato) qaytaradi;
  - `toStudentQuestion(q, seed)` — javobsiz ko'rinish, MATCHING o'ng ustuni, ORDERING va CATEGORIZE elementlari talaba bo'yicha barqaror aralashtiriladi (ORDERING hech qachon to'g'ri tartibda berilmaydi); `isAnswered`, `seededOrder` (kontent helper'idagi bilan bir xil algoritm).
  - Testlar `quizzes.test.ts`: shared jami **75/75**.
- **API:**
  - migratsiya `0019_quiz_results.sql`: `quiz_attempts.results` jsonb (default `[]`) — 5-bosqichdagi turlar bo'yicha analitika uchun. **Demo bazaga hali qo'llanmagan.**
  - `QuizzesService`: talabaga `toStudentQuestion(x, quizId:userId)`, urinishda `results` saqlanadi.
  - `content/helpers.ts`: `QuizDef.questions: QuizQuestion[]`, `q()` → `ChoiceQuestion`; yangi helperlar `tf`, `fill`, `codeFill`, `match`, `order`, `sortInto` (3-bosqich kontenti uchun).
  - `test/quizzes.test.ts`: "question kinds" bloki (noto'g'ri savol 400, talabaga javoblar chiqmasligi, aralashtirish barqarorligi, 6 tur serverda baholanadi va `results` saqlanadi, noto'g'ri shakldagi javob 400). `quizzes` + `content-courses` testlari **70/70**. API typecheck toza.
- **Web** (yozildi; typecheck va lint xatosiz chiqdi, lekin hali brauzerda tekshirilmagan):
  - `components/quiz-questions.tsx` — talaba uchun har tur: tanlov, to'g'ri/noto'g'ri tugmalari, matn/kod ichidagi bo'sh joy inputlari, moslashtirish (`select`), tartiblash (sudrash + ↑/↓ tugmalar), guruhlarga ajratish (sudrash + "elementni bosing → guruhni bosing" — klaviatura va sensorli ekranda ishlaydi), `aria-live` e'lonlari; `KIND_HINT`.
  - talaba test sahifasi: savol turi yorlig'i, maslahat, barcha savollar yuboriladi (tegilmagan tartiblash savoli ko'rsatilgan tartib bilan).
  - `components/quiz-editors.tsx` — o'qituvchi uchun har tur muharriri (`blankQuestion(kind, keep)`, `KindSelect`, `QuestionBodyEditor`); konstruktor sahifasi: yangi savol turini tanlash, savollarni yuqoriga/pastga surish, xato qaysi savolda ekanini ko'rsatish (`describeIssue`).
- **Qolgan ishlar (2-bosqich):** web test, brauzerda tekshiruv (o'qituvchi har turdagi savol yaratadi → talaba yechadi; telefon, klaviatura, dark), demo bazaga `0019` (API'ni to'xtatib `node dist/db/migrate.js`), to'liq regressiya (format, typecheck, lint, test, build, E2E), jurnal, commit (foydalanuvchi so'rasa).
- Keyin: 3-bosqich (har darsga test + har mashqqa mini-test: `quizzes.exercise_id` kerak bo'ladi), 4 (darsdagi interaktiv bloklar), 5 (turlar bo'yicha analitika va Excel), hamda foydalanuvchi so'ragan tavsiyalar ro'yxati.
- Shu sessiyada ham commit qilinmagan: dizayn qaytarilishi (Loms) + oldingi Lighthouse tuzatishlari. Roadmap faylidagi ortiqcha `a` va `next-env.d.ts` o'zgarishi hali qaytarilmagan.

## 2026-11-16

### 13.00.06 — 2-bosqich: yangi test turlari (yakunlandi)

- 2026-11-14 da to'xtagan joydan davom ettirildi.
- Demo bazaga `0019_quiz_results` qo'llandi.
- Web unit testlar: `components/quiz-editors.test.ts` (11 ta) — har bir turdagi yangi savol shabloni to'ldirilgach sxemadan o'tadi; tur almashganda savol matni va id saqlanadi; SINGLE/MULTIPLE orasida variantlar saqlanadi; `templateParts`.
- Brauzer tekshiruvi (demo bazaning **nusxasida**, scratchpad'dagi `quiz-kinds.cjs`, Chrome) **21/21**, brauzer xatolari 0:
  - o'qituvchi 7 xil turdagi test yaratadi; konstruktor har tur uchun o'z muharririni ko'rsatadi; UI orqali to'g'ri/noto'g'ri savol qo'shib saqlaydi; to'ldirilmagan savolda xato "9-savol: savol matnini yozing" ko'rinishida chiqadi;
  - talaba (1440 light va 390 dark): API javobida va sahifa HTML'ida javoblar yo'q; tartiblash strelka tugmalari bilan, guruhlarga ajratish "bosish → guruhni bosish" bilan, moslashtirish select bilan, bo'sh joylar (`<A>` ham qabul qilinadi) — natija **100% (8/8)**; gorizontal scroll yo'q;
  - sichqoncha bilan sudrab tashlash elementni guruhga joylaydi.
  - Nusxa baza keyin o'chirildi.
- Regressiya: format ✅, typecheck ✅, lint ✅, build ✅, test ✅ (shared 75 + libs 3 + sandbox 16 + web 67 + check-engine 23 + api 415 = **599**), to'liq E2E **55/55** ✅.
- **STATUS: READY_WITH_INFRASTRUCTURE_LIMITATIONS.**
- Cheklovlar:
  - Har savol "hammasi yoki hech narsa" bilan baholanadi (moslashtirishda qisman ball yo'q).
  - Talabaga hali ham qaysi savol xato ekani ko'rsatilmaydi (faqat jami natija).
  - Telefonda sudrab tashlash (HTML5 drag) ishlamaydi — sensorli ekranda "bosish → guruhni bosish" usuli ishlatiladi (shu tekshirildi).
  - Mavjud kurslarning testlari hali faqat bitta/bir nechta javobli (yangi turlar 3-bosqich kontentida).
- Commit qilinmagan (dizayn qaytarilishi va Lighthouse tuzatishlari bilan birga).

### Ilmiy kuchaytirish (13.00.06) — reja

- Foydalanuvchi: "loyihaning ilmiyligini oshiradigan hamma ishni qil". Tartib: (1) formativ fikr, (2) kirish/yakuniy test, (3) tajriba va nazorat guruhlari + statistika, (4) so'rovnomalar (Likert, Cronbach α), (5) test savollari sifat tahlili, (6) vaqt sarfi; keyin 3-bosqich kontenti, darsdagi interaktiv bloklar va boshqalar.

### 1-band — Formativ fikr (kod tayyor, brauzer tekshiruvi keyin)

- Har savol turida ixtiyoriy `explanation` (≤1000). Testda `feedback`: `PER_QUESTION` (default) yoki `TOTAL_ONLY`. Migratsiya `0020_quiz_feedback.sql` (CHECK bilan).
- `reviewAttempt()` (shared): oxirgi urinish bo'yicha har savol to'g'ri/xato va izoh. Talabaga **to'g'ri variantlar emas**, faqat to'g'ri/xato va izoh. Izoh urinishdan oldin hech qachon yuborilmaydi (`toStudentQuestion` uni olmaydi).
- Web: talaba har savol ostida "Oxirgi urinishda: to'g'ri/noto'g'ri" + izohni ko'radi; o'qituvchi konstruktorida fikr rejimi tanlovi va har savolga izoh maydoni. Savollar ro'yxati muharriri `components/question-list-editor.tsx` ga ajratildi (`describeIssue` bilan).
- Testlar: `quizzes.test.ts` "formative feedback" (4 ta).

### 2-band — Kirish (diagnostik) va yakuniy test (kod tayyor, brauzer tekshiruvi keyin)

- Qaror: alohida jadvallar (dars testlariga qo'shilmadi). Sabab — bu **o'lchov vositasi**: bitta urinish, fikr ko'rsatilmaydi, ixtiyoriy vaqt chegarasi, savollar birinchi talaba boshlagach qulflanadi (hamma bir xil vositani yechadi), darslarni ochishga ta'sir qilmaydi.
- `packages/shared/src/stats.ts` (yangi, bog'liqliksiz): o'rtacha, SD, median, Student t taqsimoti (regularized incomplete beta), normal CDF, juftlangan va Welch t-mezoni, Cohen d (+ o'zbekcha talqin), Hake g, χ² 2×2, Cronbach α, Pearson r, test savollari tahlili (qiyinlik, Kelley 27% ajrata olish, nuqtali-biserial — savolni chiqarib tashlab), `formatP`. 12 ta test jadval qiymatlari bilan (t 2.228/df10 → p 0.05, χ² 6.667 → p 0.0098 va h.k.); 2 ta kutilma qo'lda hisoblab tuzatildi (kod to'g'ri edi).
- `packages/shared/src/assessments.ts`: turlar `PRETEST`/`POSTTEST`, URL `kirish`/`yakuniy`, `upsertAssessmentSchema`, ko'rinishlar, `summarizeAssessment()` (n, o'rtacha ± SD, o'rtacha o'sish, o'rtacha Hake g, juftlangan t, df, p, d_z).
- Migratsiya `0021_assessments.sql`: `course_assessments` (kurs+tur unique, vaqt 1..180, o'tish foizi) va `assessment_attempts` (talaba+test unique — bitta urinish, `started_at`, `submitted_at`, natijalar, `late`).
- API `/orgs/:orgId/courses/:courseId/assessments`: xodim — `GET /`, `PUT /:kind`, `GET /results`, `GET /results.xlsx` (2 varaq: natijalar va statistika, audit `assessment.export`); talaba — `GET /mine`, `GET /:kind`, `POST /:kind/start` (idempotent, soat birinchi boshlashdan), `POST /:kind/submit` (bir marta; ikkinchisi 409 `ASSESSMENT_SUBMITTED`; vaqtdan keyin + 60 s — `late` belgisi bilan qabul qilinadi). Yopiq test faqat uni topshirganlarga ko'rinadi.
- **Topilgan xato va tuzatish:** savollar o'zgarganini `JSON.stringify` bilan solishtirish — Postgres `jsonb` kalitlar tartibini o'zgartiradi, shuning uchun o'zgarmagan test ham "o'zgargan" (409) deb topilardi. Endi kalitlari tartiblangan kanonik JSON.
- Testlar `test/assessments.test.ts` (13 ta): RBAC (talaba/begona o'qituvchi 403, boshqa org 404, noma'lum tur 404), ochiq test savolsiz 400, yopiq test ko'rinmaydi, savollar faqat boshlangandan keyin va javob/izohsiz, qayta boshlash soatni o'zgartirmaydi, qulf (savol/vaqt 409, nom/ochiqlik 200), bitta urinish, kechikish belgisi, natijalar (o'sish, Hake g, juftlangan t, df), guruh filtri, faqat xodimga, Excel, yopilgandan keyin topshirganga ko'rinadi.
- Web: kurs boshqaruvida "Kirish va yakuniy test" → `/manage/assessments` (tablar, muharrir, qulf izohi, yakuniy testga kirish testidan nusxa, natijalar: guruh filtri, statistika kartalari, jadval, Excel); talaba `/assessments/kirish|yakuniy` (boshlash tasdig'i, vaqt hisoblagichi va avtomatik yuborish, javoblar `sessionStorage` da, natija); kurs xaritasida banner (`AssessmentsBanner`).

### 3-band — Pedagogik tajriba: tajriba va nazorat guruhlari (kod tayyor, brauzer tekshiruvi keyin)

- `packages/shared/src/experiment.ts`: rollar `EXPERIMENT`/`CONTROL`; `compareExperiment()` — tavsifiy statistika har guruh uchun (`summarizeAssessment`), Welch t + Cohen d: kirish testi (boshlang'ich tenglik), yakuniy test, o'sish, Hake g; yakuniy testdan o'tish ulushi bo'yicha χ² (2×2); `experimentConclusions()` — o'zbekcha xulosa matni (boshlang'ich tenglik bo'lmasa — o'sish bo'yicha taqqoslash tavsiyasi, ahamiyatsiz farqni "farq bor" demaydi, kichik tanlanma (< 15) ogohlantirishi). 4 ta test.
- Migratsiya `0022_experiment_groups.sql`: `course_experiment_groups` (PK kurs+guruh, rol CHECK, FK indekslari).
- API `/orgs/:orgId/courses/:courseId/experiment` (kurs xodimi): `GET` (tashkilot guruhlari, kursga yozilgan talabalar soni, rol, statistika, xulosa), `PUT /groups` (begona tashkilot guruhi 404, `null` — tajribadan chiqarish, audit `experiment.groups_set`), `GET /report.xlsx` (4 varaq: xulosa, tavsifiy statistika, taqqoslash, talabalar; audit). Testlar +4 (`assessments.test.ts` jami 21).
- Web: kurs boshqaruvida "Pedagogik tajriba" → `/manage/experiment` (guruh rollari, xulosa, tavsifiy statistika, taqqoslash jadvali, χ², Excel hisobot).

### 4-band — So'rovnomalar (kod tayyor, brauzer tekshiruvi keyin)

- `packages/shared/src/surveys.ts`: bandlar `LIKERT` (1–5, o'zbekcha shkala yorliqlari) va `TEXT`; `reverse` (6 − x), `scale` (subshkala), `required`; o'tkazish vaqti `PRE`/`POST`/`ANY`; `anonymous`. `validateSurveyAnswers`, `analyzeSurvey` (har band: n, o'rtacha ± SD teskarisi bilan, 1..5 taqsimoti, ochiq javoblar alifbo bo'yicha — kelish tartibi kimligini oshkor qilmasligi uchun; har subshkala: to'liq javob berganlar, o'rtacha ± SD, Cronbach α, tajriba/nazorat o'rtachalari, Welch t, Cohen d), `alphaLabel` (George & Mallery), `surveyTemplate()` — original o'zbekcha so'rovnoma: Motivatsiya, Qoniqish, O'z-o'ziga ishonch (11 Likert, 2 tasi teskari) + 1 ochiq savol. 5 ta test.
- Migratsiya `0023_surveys.sql`: `course_surveys`, `survey_responses` (talaba+so'rovnoma unique).
- API `/orgs/:orgId/courses/:courseId/surveys`: xodim — ro'yxat, yaratish, `:id/edit`, `PATCH :id` (birinchi javobdan keyin bandlar qulf — 409 `SURVEY_LOCKED`), `:id/results` (ismsiz, `userId` siz), `:id/results.xlsx` (subshkalalar, bandlar, ochiq javoblar; audit); talaba — `mine`, `:id` (teskari belgisi va subshkala nomlari yuborilmaydi — javobga ta'sir qilmasligi uchun), `POST :id/responses` (validatsiya, bir marta — 409 `SURVEY_ANSWERED`). Testlar `test/surveys.test.ts` 8 ta.
- Web: kurs boshqaruvida "So'rovnomalar" (ro'yxat, "Tayyor shablondan"/"Bo'sh"), muharrir + natijalar (subshkalalar jadvali α talqini bilan, bandlar taqsimoti, ochiq javoblar, Excel), talaba sahifasi (5 ballik radio guruhlar `fieldset`/`legend` bilan, ochiq javoblar), kurs xaritasidagi bannerda javob berilmagan so'rovnomalar.

### 5-band — Test savollari sifat tahlili (kod tayyor, brauzer tekshiruvi keyin)

- `packages/shared/src/item-analysis.ts`: `analyzeInstrument` — har savol: n, qiyinlik p, Kelley ajratish D (yuqori/quyi 27%), nuqtali-biserial r (savolni chiqarib tashlab), belgi (`TOO_EASY` p>0,9, `TOO_HARD` p<0,2, `POOR_DISCRIMINATION` D<0,2, `NEGATIVE` D<0 — kalitni tekshirish); test bo'yicha KR-20 ishonchlilik va o'rtacha natija; 5 tadan kam javobda indekslar ko'rsatilmaydi (`ITEM_MIN_RESPONDENTS`); `summarizeByKind` — savol turlari bo'yicha o'rtacha qiyinlik va ajratish (2-bosqichda saqlana boshlagan `results` asosida). 4 ta test.
- API `GET /orgs/:orgId/courses/:courseId/item-analysis` va `/report.xlsx` (kurs xodimi): kirish/yakuniy test (bitta urinish) va dars testlari (har talabaning **birinchi** urinishi; `results` siz eski urinishlar chiqarib tashlanadi). Testlar +2 (`assessments.test.ts` jami 19): faqat birinchi urinish, kam javobda indeks yo'q, RBAC, Excel.
- Web: kurs boshqaruvida "Savollar tahlili" → `/manage/item-analysis` (turlar jadvali va izoh, har test ochiladigan blokda savollar jadvali, belgilar ikonka + matn, Excel).

### 6-band — Vaqt sarfi (time on task)

- `packages/shared/src/activity.ts`: turlar LESSON/EXERCISE/QUIZ/ASSIGNMENT; puls har 30 s; `creditedSeconds` — puls uchun ko'pi bilan 30 s va talabaning **oldingi pulsidan beri o'tgan haqiqiy vaqtdan** ortiq emas (parallel tablar ikki marta hisoblanmaydi); `formatMinutes`. 2 ta test.
- Migratsiya `0024_activity_time.sql`: `activity_time` (PK talaba+obyekt+kun, Toshkent kuni) va `activity_last_ping`.
- API `POST /orgs/:orgId/courses/:courseId/activity` (kurs e'lon qilingan, talaba yozilgan, obyekt shu kursniki; talaba bo'yicha `pg_advisory_xact_lock`). Testlar `test/activity.test.ts` 3 ta.
- Web `lib/use-activity.ts`: sahifa ko'rinib turgan va oxirgi 60 s ichida harakat bo'lgan soniyalar sanaladi; 30 s da va sahifa yashirilganda (`keepalive`) yuboriladi. Dars, mashq, test va topshiriq sahifalarida (faqat sahifa ochilgandan keyin).
- Natijalarga qo'shildi: talaba qatorida faol vaqt; o'rtacha faol vaqt; **vaqt ↔ yakuniy natija Pearson r**; tajriba sahifasida guruhlar bo'yicha vaqt va uning Welch t taqqoslovi; Excel'larda ustun va qatorlar.

### 1–6-bandlar — umumiy tekshiruv

- Demo bazaga `0020`–`0024` qo'llandi.
- Brauzer tekshiruvi (demo bazaning **nusxasida**, scratchpad'dagi `research.cjs`, Chrome) **28/29**; yagona FAIL — skriptning o'zi (sarlavha `input` qiymatida, matn sifatida qidirilgan; skrinshotda sahifa to'g'ri). Tekshirildi: izohli test (xato savol ostida izoh, to'g'ri variantlar sahifada yo'q); o'qituvchi kirish testini ochadi; kurs xaritasidagi banner → boshlash (tasdiq) → vaqt hisoblagichi → sahifa yangilansa javoblar saqlanadi → 100% → ikkinchi topshirish 409; so'rovnoma shablondan yaratilib UI orqali ochiladi, talaba bannerdan 11 Likert + ochiq javob beradi, teskari belgilar talabaga yuborilmaydi; tajriba guruhlari UI orqali belgilanadi, xulosa chiqadi; darsda 33 s faollik → natijalarda faol vaqt; 3 ta Excel; 4 ta yangi o'qituvchi sahifasi; telefon (390, dark) — gorizontal scroll yo'q. Konsoldagi yagona xato — skript ataylab yuborgan ikkinchi topshirishning kutilgan 409 javobi. Nusxa baza o'chirildi.
- Regressiya: format ✅, typecheck ✅, lint ✅, build ✅, test ✅ (shared 102 + libs 3 + sandbox 16 + web 67 + check-engine 23 + api 449 = **660**), to'liq E2E **55/55** ✅.
- Ochiq kuzatuv: birinchi `pnpm -r test` da API'ning 3 ta fayli setup bosqichida va `security.test.ts` dagi bitta vaqtga bog'liq test yiqildi; alohida va keyingi ikki to'liq ishga tushirishda hammasi o'tdi (takrorlanmadi). Ehtimoliy sabab — o'sha paytda fonda ishlayotgan sinov serverlari bilan yuklama; aniq isbotlanmagan.
- Cheklovlar:
  - Savollar tahlilida `0019` dan oldingi dars testi urinishlari hisobga olinmaydi (har savol natijasi saqlanmagan; qayta baholab taxmin qilinmaydi — savollar o'zgargan bo'lishi mumkin).
  - Statistika kichik tanlanmalarda (n < 15) ehtiyotkorlik bilan talqin qilinadi (xulosada ogohlantirish bor); normal taqsimotdan chetlanishni tekshirish (Shapiro–Wilk) va noparametrik mezonlar (Mann–Whitney, Wilcoxon) hali yo'q.
  - Vaqt sarfi brauzer o'lchovi: sahifa ochiq, lekin talaba boshqa ish bilan band bo'lsa (masalan, faqat sichqonchani qimirlatsa) ham hisoblanadi; server faqat yuqori chegarani qo'yadi.
  - Kirish/yakuniy test yopilsa, tugallanmagan urinishlar yo'qoladi (yuborib bo'lmaydi).
- Commit qilinmagan.

### 7-band — Normallik va parametrik bo'lmagan mezonlar

- `stats.ts` ga: `normalQuantile` (Acklam), `shapiroWilk` (Royston 1992/1995, 3 ≤ n ≤ 5000), `mannWhitney` (U, bog'liq qiymatlar va uzluksizlik tuzatishi bilan normal yaqinlashuv), `wilcoxonSignedRank` (W+, nol farqlar tashlanadi), effekt kattaligi r = z/√N. Testlar: Shapiro–Wilk 1965 maqolasidagi misol (W ≈ 0,79, p < 0,01), normalga yaqin va qiyshiq ma'lumotlar, Mann–Whitney (U = 0, z = −2,507, p = 0,0122), Wilcoxon (bog'liq qiymat bilan z = 2,102 — kutilma qo'lda hisoblab tuzatildi).
- Kirish → yakuniy: `wilcoxon`, farqlar normalligi (`diffNormality`) va `recommended` (farqlar normal bo'lsa juftlangan t, aks holda Wilcoxon).
- Tajriba taqqoslovi (har ko'rsatkich): Mann–Whitney, har guruh Shapiro–Wilk p, `recommended` (ikkala guruh normal bo'lsa Welch t, aks holda Mann–Whitney) va uning `p` si. Xulosa matni endi tavsiya etilgan mezon p qiymatiga tayanadi va mezon nomini aytadi.
- Web: taqqoslash jadvalida Mann–Whitney va normallik ustunlari, asosiy mezon ★ bilan; kirish/yakuniy statistikada Wilcoxon va Shapiro–Wilk. Excel'larda ham.
- Testlar: shared **107**, API tadqiqot testlari 30/30, web 67/67; typecheck, lint, format toza.

### Commit va jurnal arxivi

- Commit'lar: `7430819` (Loms dizayni, Lighthouse va CI diagnostikasi), `b13cc2e` (test turlari va ilmiy modul), `2e5cbd8` (jurnal arxivi). `apps/web/next-env.d.ts` (`next dev` o'zgartiradi) commit qilinmadi; roadmap boshidagi tasodifiy `a` olib tashlandi. Push qilinmagan.
- Tugallangan sessiyalar (2026-10-08 … 10-27) `docs/ISH_JURNALI_ARXIV.md` ga ko'chirildi, CLAUDE.md'da qisqa "Joriy holat" bo'limi. CLAUDE.md 220 KB → 26 KB.

### "Muallif kitoblari" bo'limi va kitob ichidan qidiruv

- So'rov: bosh sahifa menyusida muallifning nashr etilgan kitoblari uchun alohida bo'lim; PDF'lar joylanadi, lekin foydalanuvchi PDF'ni ocholmaydi va yuklab ololmaydi — onlayn o'qiydi; kitob ichidan qidiruv; qulaylik.
- Qaror: mavjud elektron darslik tizimi (PDF → suv belgili WebP betlar, imzolangan qisqa muddatli havolalar, asl PDF uchun route yo'q, limit va ogohlantirish) qayta ishlatildi. Kitobga **bo'lim** qo'shildi: `TEXTBOOK` (darslik) yoki `AUTHOR` (muallif kitobi). Ro'yxat va muqova mehmonlarga ochiq; o'qish uchun kirish shart (suv belgisida o'quvchi ismi).
- Shared: `BOOK_COLLECTIONS`, `publisher`, `isbn`, `searchable`; `normalizeBookText` (lotin/kirill, apostroflarsiz, kichik harf); `book-search.ts` — `buildPageText` (matn bo'laklari → normallashgan va asl matn + bet ustidagi joylashuv) va `searchPageText` (mos kelishlar soni, belgilash to'rtburchaklari, asl matndan snippet). 5 ta test.
- Migratsiya `0025_book_search.sql`: `books.publisher/isbn/collection/searchable` (CHECK + indeks) va `book_page_text` (PK kitob+bet).
- Ishchi jarayon (`rasterize.ts`): har bet uchun pdf.js `getTextContent()` → matn qatlami; xato betni buzmaydi (skanerlangan bet shunchaki qidirilmaydi). Matn stdout (512 KB) orqali emas, `pages/text.json` fayl orqali uzatiladi; `BookProcessor.storeText` qatorlarni tekshirib bazaga yozadi va faylni o'chiradi.
- API: `GET /books/:id/search?q=` (o'qish huquqi bilan bir xil; foydalanuvchiga daqiqasiga 30 so'rov; 50 tagacha natija; faqat snippet va to'rtburchaklar — butun bet matni hech qachon berilmaydi); `POST /orgs/:orgId/admin/books/:id/reprocess` (betlar va matnni qayta tayyorlash, audit); ochiq `GET /public/books`, `/public/books/:id`, `/public/books/:id/cover` (faqat platforma tashkilotining e'lon qilingan `AUTHOR` kitoblari, IP limiti). Testlar `books.test.ts` +6 (jami 19).
- Web:
  - menyu va footer'da "Muallif kitoblari"; `/muallif-kitoblari` (kartalar: muqova, muallif, nashriyot, yil, betlar, tavsif) va `/muallif-kitoblari/[id]` (SEO meta, "Onlayn o'qish" yoki "Kirib o'qish" → kirgach o'quvchiga qaytadi);
  - o'quvchida qidiruv paneli (Ctrl+F ham ochadi): natijalar ro'yxati (bet, snippet `<mark>` bilan, necha marta), keyingi/oldingi natija, topilgan so'zlar bet ustida sariq belgilanadi, Esc yopadi; telefonda natija tanlansa panel yopiladi; muallif kitobida "orqaga" kitob sahifasiga qaytaradi;
  - admin: bo'lim tanlovi, nashriyot, ISBN, "Ichidan qidirish mumkin"/"Matn topilmadi (skanerlangan?)" belgisi, "Qayta ishlash".
- Brauzer tekshiruvi (demo baza va kitoblar papkasining **nusxasida**, scratchpad'dagi `authorbooks.cjs` + telefon skripti) **19/19**, xatolar 0: admin UI orqali yuklash → matn ajratildi → e'lon qilish; mehmon menyudan bo'limga kiradi, muqova yuklanadi, sahifada PDF havolasi yo'q, betlar 401; "Kirib o'qish" → kirish → o'quvchi; Ctrl+F, 4 ta natija, belgilash, keyingi natija beti almashadi, "Hech narsa topilmadi", Esc; PDF beradigan route yo'q; telefon (390, dark).
- Regressiya: format ✅, typecheck ✅, lint ✅, build ✅, test ✅ (shared 112 + libs 3 + sandbox 16 + web 67 + check-engine 23 + api 455 = **676**), E2E **55/55** ✅. Demo bazaga `0025` qo'llandi.
- PDF'lar uchun git'ga tushmaydigan papka: `apps/api/.data/kitoblar/`.
- Cheklovlar: skanerlangan (rasm) PDF'larda matn yo'q — qidiruv ishlamaydi (OCR yo'q); belgilash to'rtburchagi harf enini taxminiy hisoblaydi; qidiruv orqali ko'p so'rov bilan matnni bo'laklab yig'ish nazariy jihatdan mumkin (limit 30/daq. buni sekinlashtiradi); himoya mutlaq emas — ekran rasmini to'xtatib bo'lmaydi, suv belgisi kimligini ko'rsatadi.

## 2026-11-18

### Qolgan ishlar 6 bosqichga bo'lindi

- Foydalanuvchi: "promtni qisqartir, 6 bosqichga bo'lib qadamma-qadam qil". Reja:
  1. mashq mini-testi uchun asos (`quizzes.exercise_id`, API, UI);
  2. barcha kurslarga dars testlari (yangi savol turlari va izohlar bilan);
  3. har mashqqa mini-test (kontent);
  4. darsdagi interaktiv bloklar;
  5. atamalar lug'ati va takrorlash;
  6. sertifikat va Telegram xabarnomalari.

### 1-bosqich — mashq mini-testi (yakunlandi)

- Qaror: mini-test bu mashqqa bog'langan oddiy test (`quizzes.exercise_id`, shu darsning mashqi). U **ixtiyoriy o'zini tekshirish**: darsni tugatish sharti emas, o'tilsa ham darsni yakunlamaydi; kurs xaritasidagi test statistikasi, analitika va katalogdagi testlar sonida hisoblanmaydi. Mashq faol bo'lmasa, mini-test talabaga ko'rinmaydi (404).
- Migratsiya `0026_exercise_mini_quiz.sql` (FK `ON DELETE cascade`, indeks). Demo bazaga qo'llandi.
- Shared: `createQuizSchema`/`updateQuizSchema` da `exerciseId`; `QuizView`/`QuizAdmin` da `exerciseId`; `ExerciseSummary` va `ExerciseView` da `miniQuizzes`.
- API: yaratish/tahrirlashda mashq shu darsga tegishli ekani tekshiriladi (aks holda 400); `LearningService.items` mini-testlarni mashq ostiga qo'yadi; `exerciseMiniQuizzes`; `analytics-facts` va `catalog` da `exercise_id is null` filtri.
- Kontent: `LessonDef.miniQuiz` (+ `miniQuiz()` helper, o'tish 60%), seed mini-testni mashq bilan birga yaratadi va manifestni tekshiradi.
- Web: o'qituvchi dars muharririda "Test turi" tanlovi (Dars testi / Mini-test: mashq) va ro'yxatda belgi; talaba dars sahifasida mashq ostida, mashq sahifasida "O'zingizni tekshiring" bloki; test sahifasida "Mashqqa qaytish" va ixtiyoriylik izohi.
- Testlar: `quizzes.test.ts` "exercise mini-tests" (+4). Regressiya: typecheck ✅, lint ✅, format ✅, test ✅ (shared 112 + libs 3 + sandbox 16 + web 67 + check-engine 23 + api 459 = **680**).
- Brauzer tekshiruvi (demo bazaning **nusxasida**, scratchpad'dagi `miniquiz.cjs`) **13/13**, xatolar 0: o'qituvchi UI orqali mini-test yaratadi; talaba uni darsda va mashqda ko'radi, yechadi (50%, xato savolda izoh), kurs testlari soni o'zgarmaydi, sahifada javoblar yo'q, telefon (390, dark). Nusxa o'chirildi.
- Commit qilinmagan.

### 2-bosqich — dars testlari (HTML kursi tayyor, qolgan kurslar keyin)

- Hajm: 11 kursda ~560 dars, modul testlari bor ~117 dars; ~440 darsga yangi test kerak. Kursma-kurs qilinadi.
- **Infratuzilma:**
  - har kursda alohida `content/<kurs>/lesson-quizzes.ts` (`Record<slug, QuizDef>`); `withQuizzes(modules, { lesson, mini })` registry'da birlashtiradi (noma'lum slug — xato; modul testi bor dars o'zinikini saqlaydi);
  - helperlar: `lessonQuiz()` (nom `LESSON_QUIZ_TITLE` = "Dars testi", o'tish 70%), `why(savol, izoh)`;
  - `syncCourseQuizzes()` + `pnpm --filter @webdizayn/api db:sync:quizzes <slug|--all>` — seed qilingan kursga **faqat yetishmayotgan** dars testlari va mini-testlarni qo'shadi: o'chirmaydi, tahrir qilingan testlarga tegmaydi, progress saqlanadi (tugatilgan darslar tugatilgan holda qoladi). Darslar modul/dars o'rni va nomi bo'yicha moslanadi, mos kelmasa `skipped` ga yoziladi; takroriy ishga tushirish 0 qo'shadi.
- **Kontent:** HTML kursining testi yo'q **48 ta darsiga** original o'zbekcha dars testi (har birida 4 savol, turlar aralash: bitta/bir nechta javob, to'g'ri/noto'g'ri, bo'sh joy, kod to'ldirish, moslashtirish, tartiblash, guruhlash; har savolda izoh). Savollar dars matni asosida yozildi.
- **Testlar** (`content-courses.test.ts`): modul testi sanog'i dars testlarini hisobga olmaydi; har dars testida ≥3 savol, har savolda izoh, ≥2 tur; kalit javoblar bilan har test 100%; talaba oqimi dars testlarini o'tib boradi; sync: progressni saqlab qo'shadi, ikkinchi marta 0, seed qilinmagan kursda xato.
- **Web tuzatishlari** (brauzer tekshiruvida topildi):
  - telefonda kod to'ldirish savolining kartasi ekrandan chiqib ketardi — sababi `<fieldset>` ning standart `min-width: min-content`; `globals.css` da `fieldset { min-width: 0 }` (kirish/yakuniy test va so'rovnomalarga ham ta'sir qiladi);
  - savol izohidagi `` `kod` `` xom ko'rinardi — endi `OptionText` bilan formatlanadi.
- Brauzer tekshiruvi (demo baza **nusxasida** sync → `lessontests.cjs`, 1440 light va 390 dark) **18/18**, xatolar 0: xaritada 48 dars testi, tugatilgan darslar saqlangan, darsdan testga havola, UI orqali yechish → 50% va xato savolda izoh, sahifada javob kalitlari yo'q, gorizontal scroll yo'q. Nusxa o'chirildi.
- Demo bazaga sync qilindi: `html: +48 lesson tests`.
- Regressiya: format ✅, typecheck ✅, lint ✅, test ✅ (shared 112 + libs 3 + sandbox 16 + web 67 + check-engine 23 + api 463 = **684**). Birinchi to'liq ishga tushirishda `check-worker` va `tutor` kvota testlari yiqildi (demo serverlar ishlab turgan paytda), alohida va API to'liq qayta ishga tushirilganda o'tdi — vaqtga bog'liq, avvalgi kuzatuvga o'xshash.
- Keyingi: CSS (86 dars), JS (79), Bootstrap 3/4/5 (114), RWD/UI/Figma/Portfolio (80) — jami 359 dars. PHP darslarining hammasida test bor (yangi turlarsiz).
- Commit qilinmagan.

### 2-bosqich — CSS kursi dars testlari

- `content/css/lesson-quizzes.ts`: testi yo'q **86 ta darsning** hammasiga original o'zbekcha dars testi (15 modul; har birida 4 savol, turlar aralash, har savolda izoh), registry'da `withQuizzes`. Savollar har dars matnining sarlavhalari, jadvallari va xulosasi asosida yozildi.
- Avtomatik tekshiruvlar (`content-courses.test.ts`): sxema, izohlar, ≥2 tur, kalit javoblar bilan 100% — o'tdi.
- Brauzer tekshiruvi (demo baza **nusxasida** sync → `coursetests.cjs css 86`, 1440 light va 390 dark) **14/14**: xaritada 86 ta dars testi, darsdan testga havola, savollar ekranga sig'adi, gorizontal scroll yo'q, sahifada javob kalitlari va izohlar yo'q. Yagona konsol xatosi — skriptning o'zi kursga yozilishdan oldin xaritani so'ragani (403, kutilgan). Nusxa o'chirildi.
- Demo bazaga sync: `css: +86 lesson tests`.
- Regressiya: format ✅, typecheck ✅, lint ✅, test ✅ (shared 112 + libs 3 + sandbox 16 + web 67 + check-engine 23 + api 465 = **686**).
- Qolgan: JS (79), Bootstrap 3/4/5 (114), RWD/UI/Figma/Portfolio (80) — 273 dars. Commit qilinmagan.

### 2-bosqich — JavaScript kursi dars testlari

- `content/js/lesson-quizzes.ts`: testi yo'q **79 ta darsning** hammasiga dars testi (18 modul; 4 savoldan, turlar aralash, izohlar). Ko'p savollar “kod nima chiqaradi?” ko'rinishida (kod bloki savol matnida).
- “Nima chiqaradi” kalitlari Node'da haqiqatan bajarib tekshirildi (scratchpad `jscheck.cjs`, 54 ifoda va xato turi): hammasi to'g'ri. Bitta nomuvofiqlik skriptning o'zida edi (heredoc `\D` ni buzgan) — alohida tekshirilganda to'g'ri.
- `math` testidagi juda qisqa izoh (avtomatik tekshiruv topdi) uzaytirildi; `strict-mode` kod to'ldirishda ikki xil tirnoq qabul qilinadi.
- Avtomatik tekshiruvlar o'tdi. Brauzer tekshiruvi (nusxa bazada sync → `coursetests.cjs js 79`, 1440 light va 390 dark) **14/14**, xatolar 0. Nusxa o'chirildi.
- Demo bazaga sync: `js: +79 lesson tests`.
- Regressiya: format ✅, typecheck ✅, lint ✅, test ✅ (shared 112 + libs 3 + sandbox 16 + web 67 + check-engine 23 + api 467 = **688**).
- Qolgan: Bootstrap 3/4/5 (114), RWD/UI/Figma/Portfolio (80) — 194 dars. Commit qilinmagan.

### 2-bosqich — Bootstrap 3/4/5 dars testlari

- `content/bootstrap3|4|5/lesson-quizzes.ts`: testi yo'q **36 + 37 + 41 = 114** darsga dars testi (4 savoldan, turlar aralash, izohlar). Savollar har versiyaning o'z klass nomlari asosida (darslardagi `class`/`data-*` qiymatlari va sarlavhalardan olingan): BS3 — `col-xs`, `panel`, `well`, `glyphicon`, `in`, jQuery; BS4 — `col-` / `xl`, `card`, `badge-pill`, `ml-*`, `show`, Popper; BS5 — `data-bs-*`, `xxl`, `ms-*`/`text-end`, `btn-check`, `d-grid`, `form-floating`, `data-bs-theme`. Versiyalar orasidagi farqlar alohida savollar sifatida.
- Avtomatik tekshiruv ikki joyda izohsiz savolni topdi (`order` `why` siz) — tuzatildi.
- Brauzer tekshiruvi (nusxa bazada sync → `coursetests.cjs` har kurs uchun, 1440 light va 390 dark): FAIL yo'q, brauzer xatolari 0. Nusxa o'chirildi.
- Demo bazaga sync: `bootstrap3: +36`, `bootstrap4: +37`, `bootstrap5: +41`.
- Regressiya: format ✅, typecheck ✅, lint ✅, test ✅ (shared 112 + libs 3 + sandbox 16 + web 67 + check-engine 23 + api 473 = **694**). Birinchi `pnpm -r test` da `check-worker` (haqiqiy Chrome bilan CHECK) testi yiqildi — demo serverlar ishlab turgan paytdagi yuklama; alohida 2 marta va API to'liq qayta ishga tushirilganda o'tdi (avvalgi kuzatuvlar bilan bir xil).
- Qolgan: Moslashuvchan dizayn, UI asoslari, Figma'dan kodga, Portfolio — 80 dars. Commit qilinmagan.

### 2-bosqich — oxirgi 4 kurs (boshlandi)

- Foydalanuvchi: “davom et, hammasini CLAUDE.md ga ham saqlab bor” — har kurs tugagach shu yerga natija yoziladi.
- Qolgan darslar: Moslashuvchan dizayn 22, UI asoslari 23, Figma'dan kodga 18, Portfolio 17 — jami 80.
- **Moslashuvchan dizayn** (`content/rwd/lesson-quizzes.ts`): 22 ta dars testi yozildi va registry'ga ulandi; avtomatik tekshiruvlar o'tdi (sync va brauzer tekshiruvi to'rtta kurs tugagach, birga).
- **UI asoslari** (`content/ui/lesson-quizzes.ts`): 23 ta dars testi; avtomatik tekshiruv ikki juda qisqa izohni topdi — uzaytirildi; tekshiruvlar o'tdi.
- **Figma'dan kodga** (`content/figma/lesson-quizzes.ts`): 18 ta dars testi; modifikator savoli darsdagi nomlashga moslandi (`tugma--katta`); tekshiruvlar o'tdi.
- **Portfolio** (`content/portfolio/lesson-quizzes.ts`): 17 ta dars testi; skip link (`#asosiy`) va `[hidden]` qoidasi kabi aniq javoblar dars matni bilan solishtirildi; barcha kurslar bo'yicha `content-courses.test.ts` 77/77 (2 tasi PHP uchun o'tkazib yuborildi — u yerda alohida dars testi yo'q).
- Nusxa bazada `db:sync:quizzes --all`: oldin qo'shilgan 7 kursga **+0** (idempotentlik tasdiqlandi), yangi to'rttasiga +22/+23/+18/+17. Brauzer tekshiruvi (`coursetests.cjs`, 1440 light va 390 dark) har kurs uchun **14/14**, xatolar 0. Nusxa o'chirildi. Keyin demo bazaga ham sync qilindi.
- Regressiya: format ✅, typecheck ✅, lint ✅, test ✅ (shared 112 + libs 3 + sandbox 16 + web 67 + check-engine 23 + api 481 = **702**). E2E bu bosqichda ishga tushirilmadi (demo serverlar 3000/3100/4000 portlarni band qilib turibdi; dars testlari UI ga yangi sahifa qo'shmadi).

### 2-bosqich — YAKUNLANDI

- Jami **407 ta dars testi** (HTML 48, CSS 86, JS 79, Bootstrap 3/4/5 — 36/37/41, Moslashuvchan dizayn 22, UI asoslari 23, Figma'dan kodga 18, Portfolio 17). Endi har bir kursda testi yo'q dars qolmadi (PHP darslarida test avvaldan bor edi).
- Har test: 3–4 savol, kamida 2 xil tur, har savolda izoh; kalit javoblar bilan 100% (avtomatik tekshiruv). JS “nima chiqaradi” kalitlari Node'da bajarib tasdiqlandi.
- Fayllar: `apps/api/src/db/content/<kurs>/lesson-quizzes.ts`, `helpers.ts` (`lessonQuiz`, `why`, `withQuizzes`, `LESSON_QUIZ_TITLE`), `seed.ts` (`syncCourseQuizzes`), `db/sync-quizzes.ts`, `package.json` (`db:sync:quizzes`), `test/content-courses.test.ts`.
- Pedagogik eslatma: dars testlari darsni tugatish sharti (o'tish 70%) — bu kurslarni o'tishni qiyinlashtiradi; kerak bo'lsa o'qituvchi testni o'chirib (faol emas) qo'yishi mumkin. Allaqachon tugatilgan darslar tugatilgan holda qoladi.
- Keyingi: **3-bosqich** — har mashqqa mini-test (kontent; `withQuizzes(..., { mini })` va `db:sync:quizzes` tayyor). Commit qilinmagan.

### Commit: 1–2-bosqich

- `58b5234` — mashq mini-testi asosi (migratsiya 0026, API, web), `fieldset { min-width: 0 }`, izohlarda inline kod.
- `f80405e` — 407 ta dars testi, `db:sync:quizzes`, kontent testlari, jurnal. Push qilinmagan; `apps/web/next-env.d.ts` commit qilinmadi.

### 3-bosqich — har mashqqa mini-test (boshlandi)

- Mashqlar soni: HTML 49, CSS 101, JS 96, Bootstrap 3/4/5 43/44/48, RWD 28, UI 29, Figma 24, Portfolio 23 — jami **485**.
- Har mini-test: `miniQuiz()` (nom “Mashq mini-testi”, o'tish 60%), 3 savol — aynan mashq topshirig'idagi tushunchalar bo'yicha, turlar aralash, har savolda izoh. Ixtiyoriy, darsni bloklamaydi.
- `content-courses.test.ts`: sifat tekshiruvlari (izohlar, ≥2 tur, kalitlar bilan 100%) mini-testlarga ham tatbiq etildi.
- **HTML**: `content/html/mini-quizzes.ts` — 49 ta mini-test, `withQuizzes(..., { mini })` bilan ulandi; tekshiruvlar o'tdi (bitta qisqa izoh tuzatildi).
- **CSS**: `content/css/mini-quizzes.ts` — 101 ta mini-test (har mashqqa). Yo'q mini-testlarni topish uchun yordamchi skript ishlatildi (`_miss.ts`, vaqtinchalik). Yordamchi “why bilan o'rash” skripti ikki blokni buzgan — qo'lda tuzatildi; bundan keyin izohlar qo'lda yoziladi.
