# WEBDIZAYN.UZ — Yakuniy release auditi (15C)

Sana: 2026-10-13. Tekshirilgan commit: `c141c87` (`phase(15b): regression audit`). Bu fazada yangi funksiya qo'shilmadi.

## FINAL_STATUS

**READY_WITH_INFRASTRUCTURE_LIMITATIONS**

Kod darajasida barcha muhim tekshiruvlar o'tdi: xavfsizlik, ma'lumotlar izolyatsiyasi, avtorizatsiya va asosiy o'quv oqimi. Bitta ham test yiqilmadi. **Production'ga chiqarishga hali tayyor emas**: production infratuzilmasi (Docker image'lar, haqiqiy PostgreSQL, CI, alohida sandbox domeni, edge proksi) birorta ham marta ishga tushirilmagan. Pastdagi "Production blockers" bo'limidagi bandlar bajarilmaguncha `READY` deb bo'lmaydi.

## Tekshiruv natijalari (shu auditda qayta ishga tushirildi)

| Tekshiruv                                  | Natija          |
| ------------------------------------------ | --------------- |
| `prettier --check`                         | ✅              |
| `pnpm -r typecheck`                        | ✅ 5/5          |
| `pnpm -r lint`                             | ✅ 5/5          |
| `pnpm -r build`                            | ✅              |
| Unit + integratsion testlar                | ✅ 359/359      |
| To'liq E2E (`pnpm e2e`, haqiqiy Chrome)    | ✅ 34/34        |
| Sandbox xavfsizlik E2E (haqiqiy Chrome)    | ✅ 21/21        |
| Frontend a11y/responsive/dark auditi (15B) | ✅ 124/124      |
| `pnpm audit --prod`                        | ✅ zaiflik yo'q |
| Schema ↔ migratsiya drift                  | ✅ yo'q         |
| Secret skan (grep; gitleaks faqat CI'da)   | ✅ toza         |

### Test sonlari

| Paket                   | Testlar |
| ----------------------- | ------- |
| `packages/shared`       | 38      |
| `apps/sandbox`          | 15      |
| `apps/web`              | 26      |
| `packages/check-engine` | 21      |
| `apps/api`              | 259     |
| **Jami**                | **359** |

API testlari in-memory PGlite'da ishlaydi. `postgres-driver.test.ts` production'dagi `pg` drayverini Postgres wire protokoli orqali sinaydi (pool = 1 ulanish). Haqiqiy PostgreSQL server ishlatilmagan.

## 26 band bo'yicha audit

Belgilar: ✅ ishlaydi va test bilan tasdiqlangan · ⚠️ ishlaydi, lekin cheklov bor · 🧱 infratuzilmaga bog'liq, tekshirilmagan.

| #   | Band                  | Holat | Dalil va izoh                                                                                                                                                                                                                                                                                                                              |
| --- | --------------------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Authentication        | ⚠️    | Argon2id, server-side sessiya (token DB'da SHA-256), HttpOnly/SameSite=Lax/prod'da Secure cookie, 7 kun muddat + 24 soat faolsizlik, neytral login xatosi, DB'dagi login/register limitlari (`auth`, `security` testlari). Cheklov: ro'yxatdan o'tishda 409 email band ekanini bildiradi (email tasdiqlash yo'q).                          |
| 2   | RBAC                  | ✅    | Rol faqat DB'dan; `:orgId` li 58 route'ning hammasida `@OrgRoles`; guard fail-closed (15B). Soxta rol, `x-user-id`, `x-role` hech narsa bermaydi (`rbac`, `courses`, E2E).                                                                                                                                                                 |
| 3   | Course foundation     | ⚠️    | Kurs → modul → dars, DRAFT/PUBLISHED/ARCHIVED, TEACHER faqat biriktirilgan kursni boshqaradi (`courses` 25 test). Cheklov: kurs/modul/darsni o'chirish va o'qituvchi biriktirish endpoint'i yo'q.                                                                                                                                          |
| 4   | Sequential learning   | ✅    | Yopiq dars 403 `LESSON_LOCKED`, kontent berilmaydi; dars mashq va testlar o'tilganda serverda tugaydi; yopiq darsdagi mashq/CHECK/tutor rad etiladi (`courses`, `exercises`, `quizzes`, E2E).                                                                                                                                              |
| 5   | Lesson player         | ✅    | Markdown xom HTML'siz (`markdown.test`), oldingi/keyingi, mashq/test/topshiriq ro'yxatlari, yopiq holat (15B).                                                                                                                                                                                                                             |
| 6   | Course map            | ✅    | LOCKED/AVAILABLE/IN_PROGRESS/COMPLETED/NEEDS_IMPROVEMENT, elementlar, foiz (`quizzes`, 13A).                                                                                                                                                                                                                                               |
| 7   | Exercises             | ✅    | CRUD, starter fayllar, talabaning o'z workspace'i, cross-student izolyatsiya, path traversal 400 (`exercises` 23 test).                                                                                                                                                                                                                    |
| 8   | Playground            | ✅    | Monaco lokal, fayl daraxti (yaratish/o'chirish/nomlash), preview, konsol, reset, readOnly.                                                                                                                                                                                                                                                 |
| 9   | RUN                   | ✅    | Alohida site'dagi sandbox, ikki qavatli opaque iframe, CSP, postMessage tekshiruvi, watchdog; 21 ta brauzer hujumi bloklangan (sandbox E2E).                                                                                                                                                                                               |
| 10  | CHECK                 | ⚠️    | Playwright + haqiqiy Chrome, PASSED/FAILED/ERROR/TIMEOUT, yashirin qoidalar sizmaydi, faqat serverdagi saqlangan kod tekshiriladi, soxta PASS rad etiladi (`checks`, `check-worker`, check-engine 21 test). Cheklov: navbat instance ichida (BullMQ yo'q); talaba JS'i DOM API'ni almashtirib tekshiruvni aldashi nazariy jihatdan mumkin. |
| 11  | Assignments           | ✅    | DRAFT → PUBLISHED → CLOSED, muddat/urinishlar/kechikish, rubrika qulfi (`assignments` 22 test).                                                                                                                                                                                                                                            |
| 12  | Submission versions   | ✅    | Har topshirish yangi versiya; DB trigger UPDATE'ni taqiqlaydi; parallel submit'da bitta versiya.                                                                                                                                                                                                                                           |
| 13  | Teacher review        | ✅    | Holatlar mashinasi, eskirgan versiya 409, parallel finalize'da bittasi o'tadi, append-only tarix, audit (`reviews` 13 test, E2E).                                                                                                                                                                                                          |
| 14  | AI Tutor              | ⚠️    | Mock provayder default; panel, maslahat 1→2→3 (yangilashda saqlanadi), feedback, handoff (`tutor` 15 test, E2E). Cheklov: mock javoblar shablonli; haqiqiy provayder faqat soxta OpenAI-mos server bilan sinalgan.                                                                                                                         |
| 15  | AI pedagogical policy | ✅    | Tayyor yechim so'ralsa yo'naltiruvchi rad + maslahat + aynan bitta savol; baho qo'yilmaydi; handoff baho/progressga tegmaydi (`pedagogy` 12 test).                                                                                                                                                                                         |
| 16  | AI security           | ✅    | Kontekst faqat talabaga xavfsiz ko'rinishlardan; output guard (system prompt, yashirin qoida, sir, email, tayyor yechim); kalit faqat `Authorization` da; atomik kvota; `http` rejimi uchun aniq ruxsat + URL + kalit (`guard`, `provider`, `ai-http`, `security`). Guard evristik — asosiy himoya strukturaviy.                           |
| 17  | Portfolio             | ⚠️    | Default yashirin, faqat aniq e'londa ochiq; snapshot; ochiq JSON'da email/ID/ball/izoh yo'q; IP limit (`portfolio` 14 test, E2E). Cheklov: PNG skrinshot o'rniga jonli sandbox preview; SEO/OpenGraph yo'q.                                                                                                                                |
| 18  | Analytics             | ✅    | Talaba/kurs/tashkilot, RBAC, emailsiz, yashirin qoidalar sizmaydi, ma'lumot bo'lmasa `null` (`analytics` 10 test). Katta tashkilotlar uchun kesh yo'q.                                                                                                                                                                                     |
| 19  | Sandbox security      | 🧱    | Brauzer va CHECK sandbox'lari lokal haqiqiy Chrome'da isbotlangan (tarmoq kanareykasi, `file://`, xotira bombasi, cheksiz sikl, env allowlist). Konteyner izolyatsiyasi (non-root, read-only FS, cgroups, gVisor) artefaktlarda yozilgan, lekin ishga tushirilmagan.                                                                       |
| 20  | Production readiness  | 🧱    | JSON loglar (15B'da SQL parametrlari sizishi tuzatildi), umumiy 500 + requestId, `/health/ready`, token bilan `/metrics`, migratsiyalar advisory lock bilan, backup skripti. Docker, real Postgres, backup/restore, edge proksi tekshirilmagan.                                                                                            |
| 21  | E2E                   | ✅    | 34/34 (talaba, o'qituvchi, 13 ta xavfsizlik qadami), ketma-ket barqaror. Faqat lokal Windows'da.                                                                                                                                                                                                                                           |
| 22  | Accessibility         | ⚠️    | axe WCAG 2.1 A/AA: 23 sahifa × 3 rol — 0 buzilish; klaviatura oqimlari (15B). Screen reader bilan qo'lda sinov yo'q; CI'da a11y regressiyasi yo'q.                                                                                                                                                                                         |
| 23  | Responsive UI         | ✅    | 390px va 1280px'da gorizontal scroll yo'q (15B). IDE mobilda bitta ustun (to'liq mobil UX emas).                                                                                                                                                                                                                                           |
| 24  | Dark mode             | ✅    | Barcha sahifalar dark'da AA kontrastdan o'tdi (15B).                                                                                                                                                                                                                                                                                       |
| 25  | Error handling        | ✅    | 500, tarmoq uzilishi, 401 → /login, 403 xabari, yopiq dars, bo'sh holatlar (15B); API'da umumiy 500.                                                                                                                                                                                                                                       |
| 26  | Secret scan           | ⚠️    | grep toza, repoda faqat `.env.example`; gitleaks CI'da sozlangan, lekin CI hali ishga tushmagan.                                                                                                                                                                                                                                           |

## Amalga oshirilgan funksiyalar

- **Auth va RBAC:** ro'yxatdan o'tish (doim STUDENT), login/logout, server-side sessiya, STUDENT/TEACHER/ORG_ADMIN, tashkilot bo'yicha ajratish, audit jurnali.
- **O'quv tuzilmasi:** kurs → modul → dars, e'lon qilish va arxivlash, yozilish, ketma-ket ochilish, kurs xaritasi va progress.
- **Amaliyot:** mashqlar, Monaco IDE, fayl daraxti, alohida origin'dagi RUN sandbox, server CHECK engine (yashirin qoidalar, responsive, interaktiv amallar, psevdo-elementlar), masofaviy CHECK worker.
- **Testlar (quiz):** bitta yoki bir nechta javobli savollar, serverda baholanadi, to'g'ri javoblar klientga chiqmaydi.
- **Topshiriqlar:** muddat, urinishlar, rubrika, immutable versiyalar, versiya CHECK'i, o'qituvchi review (ball, izoh, qayta ishlash, yakunlash).
- **AI Tutor:** mock va OpenAI-mos HTTP provayder, pedagogik rejimlar, maslahat bosqichlari, output guard, kvotalar, handoff, feedback.
- **Portfolio:** yashirin/ochiq, ishlar snapshot'i, yutuqlar, tugatilgan kurslar.
- **Analitika:** talaba, kurs (o'qituvchi) va tashkilot (admin) darajasida.
- **Kontent:** original o'zbekcha "HTML: to'liq kurs" (12 modul, 60 dars, 49 mashq, 12 test) va "CSS: to'liq kurs" (15 modul, 101 dars, 101 mashq, 15 test). Har bir namunaviy yechim haqiqiy Chrome'da PASSED.
- **Xavfsizlik va production:** nonce CSP, HSTS, Origin tekshiruvi (CSRF), DB'dagi umumiy limitlar, `TRUST_PROXY`, JSON loglar, metrikalar, health/readiness, Dockerfile va prod compose, backup skripti, CI workflow.

## Migratsiyalar holati

12 ta migratsiya (`apps/api/drizzle`), hammasi drizzle-kit bilan schema'dan generatsiya qilingan, drift yo'q:

`0000_init` · `0001_courses` · `0002_exercises` · `0003_checks` · `0004_assignments` · `0005_reviews` · `0006_quizzes` · `0007_portfolio` · `0008_ai` · `0009_rate_limits` · `0010_analytics_indexes` · `0011_fk_indexes`

- Toza PGlite bazada va `pg` drayveri orqali qo'llangan. Ikki marta ishga tushirilganda o'zgarish yo'q (idempotent).
- Production yo'li: `node dist/db/migrate.js`. Parallel deploy'lar advisory lock bilan navbatga qo'yiladi.
- Katalog invariantlari test bilan himoyalangan (`schema.test.ts`): har jadvalda PK, har FK indekslangan, immutable trigger'lar joyida.
- **Haqiqiy PostgreSQL serverga (managed yoki Docker) hali qo'llanmagan.**
- Pastga qaytarish (down) migratsiyalari yo'q. Qaytish faqat backup'dan tiklash orqali.

## E2E holati

| Suite                                                      | Natija  | Muhit                                                                 |
| ---------------------------------------------------------- | ------- | --------------------------------------------------------------------- |
| `e2e/full-flow.e2e.mjs` (talaba + o'qituvchi + xavfsizlik) | 34/34   | Lokal Windows, toza PGlite, compiled API/web, haqiqiy Chrome, mock AI |
| `apps/sandbox/e2e/security.e2e.mjs`                        | 21/21   | Lokal, `localhost` / `127.0.0.1` (alohida site)                       |
| Frontend audit (axe, responsive, dark, holatlar)           | 124/124 | Lokal demo baza, skript repoda emas                                   |

CI'dagi `e2e` job Ubuntu'da hali ishga tushmagan.

## Xavfsizlik holati

Kod darajasida tasdiqlangan:

- cross-student, cross-teacher va cross-org kirish rad etiladi (API testlari va jonli E2E);
- soxta rol, soxta ruxsat, `x-user-id`/`x-role` header'lari e'tiborga olinmaydi;
- yashirin CHECK qoidalari API'da, run natijasida, sahifa HTML'ida va AI kontekstida yo'q;
- AI konteksti faqat o'z resurslari bilan; ruxsatsiz kontekst rad etiladi;
- XSS sink'lari yo'q (`dangerouslySetInnerHTML`, `innerHTML`, `eval`), raw SQL yo'q, path traversal 400;
- sirlar web bundle'ga chiqmaydi (yagona `NEXT_PUBLIC_*` — `SANDBOX_URL`), loglarga cookie, body, IP va SQL parametrlari yozilmaydi;
- `pnpm audit --prod` toza; Monaco ichidagi DOMPurify maslahatiga yetib bo'lmasligi test bilan kuzatiladi.

Ochiq xavflar (kritik emas, lekin hal qilish kerak):

- ro'yxatdan o'tishdagi 409 email mavjudligini oshkor qiladi (limit bor, email tasdiqlash yo'q);
- CSP'da `style-src 'unsafe-inline'` (Monaco va next/font uchun);
- AI output guard evristik;
- CHECK'da talaba JS'i DOM API'larni almashtirishi mumkin (isolated world ishlatilmaydi);
- CHECK Chrome renderer sandbox'i Linux konteynerda tekshirilmagan.

## Ma'lum cheklovlar (funksional)

- Kurs, modul, dars, mashq, topshiriq va testni o'chirish yo'q (faolsizlantirish yoki arxivlash bor). O'qituvchini kursga biriktirish endpoint'i va UI'da tartibni sudrab o'zgartirish yo'q.
- Talabaga bildirishnomalar (email/notification) yo'q. Kod qatoriga izoh qoldirish yo'q. FINALIZED bahoni bekor qilib bo'lmaydi (ataylab).
- Quiz minimal: aralashtirish, vaqt chegarasi va tushuntirishlar yo'q.
- Portfolio'da PNG skrinshot va SEO meta yo'q.
- Analitika har so'rovda hisoblanadi (kesh yo'q), haftalar UTC bo'yicha, sana filtri yo'q.
- Tashqi rasm va shriftlar RUN/CHECK sandbox'ida ataylab bloklangan.
- IDE mobilda to'liq qulay emas.
- CHECK qoidalari va kurs yechimlari public repoda ochiq.

## Infratuzilma cheklovlari

Lokal muhitda Docker, PostgreSQL va Redis yo'q. Repo GitHub'ga hali push qilinmagan, shuning uchun CI bir marta ham ishlamagan. Natijada quyidagilar **tekshirilmagan**:

- Docker image'lar build'i va non-root tekshiruvi (CI `images` job);
- `deploy/docker-compose.prod.yml`: read-only FS, `cap_drop`, CPU/xotira/pids limitlari, ichki tarmoqlar, gVisor;
- haqiqiy PostgreSQL (managed) — migratsiya, pool, advisory lock'lar;
- backup va restore mashqi (`deploy/backup.sh`);
- Linux'dagi Chrome renderer sandbox (CHECK worker);
- sandbox'ning alohida registrable domeni va HTTPS;
- edge proksining `X-Forwarded-For`ni almashtirishi;
- gitleaks;
- CI'dagi E2E (Ubuntu).

## Production blockers

Release'dan oldin bajarilishi **shart**:

1. **CI'ni ishga tushirish.** Repo'ni GitHub'ga push qilish (tokenga `Contents: Read and write` kerak) va barcha job'lar (check, images, e2e, gitleaks) yashil ekanini ko'rish.
2. **Haqiqiy PostgreSQL.** Managed Postgres'da `migrate.js` va to'liq API test/E2E'ni ishga tushirish.
3. **Konteynerlar.** `deploy/README.md` dagi 10 bandlik ro'yxatni haqiqiy host'da bajarish: non-root, read-only, resurs limitlari, tarmoq izolyatsiyasi, CHECK worker'da Chrome sandbox yoki gVisor.
4. **Sandbox domeni.** RUN sandbox'ini alohida registrable domenda (masalan `webdizayn-usercontent.uz`), HTTPS bilan joylash va sandbox E2E'ni production domenlarida qayta ishga tushirish.
5. **Edge proksi.** `X-Forwarded-For` ni haqiqiy mijoz IP'si bilan almashtirishini tasdiqlash. Bu bo'lmasa IP limitlari umumiy bo'lib qoladi yoki soxtalashtiriladi.
6. **Backup.** `deploy/backup.sh` ni sozlash va kamida bitta tiklash mashqini o'tkazish.
7. **Sirlar.** Production sirlarini (DB, `METRICS_TOKEN`, `CHECK_WORKER_TOKEN`) secret manager orqali berish. Chatda ochiq qolgan eski GitHub tokenini revoke qilish.

Tavsiya etiladi (bloklamaydi, lekin ochiq platforma uchun muhim):

- ro'yxatdan o'tishda email tasdiqlash;
- haqiqiy AI provayderi uchun DPA va ma'lumot joylashuvini tasdiqlash (ungacha mock qoladi);
- CHECK navbatini instance'lar o'rtasida taqsimlash (BullMQ yoki shunga o'xshash), agar bir nechta API instance bo'lsa;
- CI'ga a11y regressiyasini qo'shish (axe auditini toza seed bazaga ko'chirish);
- screen reader bilan qo'lda sinov.
