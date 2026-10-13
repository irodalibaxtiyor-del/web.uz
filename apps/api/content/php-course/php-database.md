## Ma’lumotlar bazasi va SQL

Shu paytgacha ma’lumotlar o‘zgaruvchilarda (sahifa yopilsa yo‘qoladi) yoki fayllarda saqlandi. Fayllar kichik ishlarga yetadi, lekin minglab foydalanuvchi, qidiruv, saralash va bir vaqtdagi yozishlar uchun **ma’lumotlar bazasi** (MB) kerak.

## Relyatsion baza

Ma’lumotlar **jadvallar**da saqlanadi — Excel varag‘iga o‘xshaydi:

| id | ism  | guruh | ball |
| -- | ---- | ----- | ---- |
| 1  | Ali  | W-12  | 80   |
| 2  | Vali | W-12  | 55   |
| 3  | Lola | W-14  | 92   |

- **Ustun** — maydon (nom va tur: `INTEGER`, `TEXT`, `VARCHAR(100)`, `DATE`).
- **Qator** — bitta yozuv.
- **Birlamchi kalit** (`PRIMARY KEY`, odatda `id`) — har qatorni aniq belgilaydi, takrorlanmaydi.

Mashhur tizimlar: **MySQL / MariaDB** (XAMPP va Laragon’da bor), **PostgreSQL**, **SQLite** (server kerak emas — butun baza bitta fayl).

## SQL — bazaning tili

To‘rtta asosiy amal (inglizcha qisqartmasi **CRUD**):

```sql
-- Jadval yaratish
CREATE TABLE talabalar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ism TEXT NOT NULL,
    guruh TEXT NOT NULL,
    ball INTEGER DEFAULT 0
);

-- Create: qo‘shish
INSERT INTO talabalar (ism, guruh, ball) VALUES ('Ali', 'W-12', 80);

-- Read: o‘qish
SELECT ism, ball FROM talabalar WHERE guruh = 'W-12' ORDER BY ball DESC;

-- Update: o‘zgartirish
UPDATE talabalar SET ball = 60 WHERE id = 2;

-- Delete: o‘chirish
DELETE FROM talabalar WHERE id = 3;
```

> `UPDATE` va `DELETE` da `WHERE` ni unutish — eng qimmat xato: **jadvaldagi hamma qator** o‘zgaradi yoki o‘chadi.

## Foydali SELECT imkoniyatlari

```sql
SELECT COUNT(*) FROM talabalar;                       -- nechta qator
SELECT AVG(ball) FROM talabalar WHERE guruh = 'W-12'; -- o‘rtacha
SELECT * FROM talabalar WHERE ism LIKE 'A%';          -- "A" bilan boshlanadigan
SELECT * FROM talabalar ORDER BY ball DESC LIMIT 3;   -- eng yaxshi 3 ta
SELECT guruh, COUNT(*) FROM talabalar GROUP BY guruh; -- guruhlar bo‘yicha
```

## phpMyAdmin

XAMPP’da `http://localhost/phpmyadmin` — MySQL’ni brauzerdan boshqarish paneli: baza yaratish, jadvallar, SQL yozib sinash. Keyingi darslarda shu ishlarni PHP kodidan qilamiz.

## PHP qanday ulanadi?

PHP’da bazaga ulanishning ikki yo‘li bor: `mysqli` (faqat MySQL) va **PDO** (MySQL, PostgreSQL, SQLite va boshqalar — bir xil kod). Biz **PDO** ni o‘rganamiz.

## Mustaqil mashq

phpMyAdmin’da (yoki istalgan SQL vositasida):

1. `maktab` bazasini yarating.
2. Yuqoridagi `talabalar` jadvalini yarating (MySQL’da `AUTOINCREMENT` o‘rniga `AUTO_INCREMENT`, `TEXT` o‘rniga `VARCHAR(100)`).
3. Jadvaldagi uchta talabani qo‘shing.
4. Quyidagi so‘rovni bajaring:

```sql
SELECT guruh, COUNT(*) AS soni, MAX(ball) AS eng_yuqori
FROM talabalar
GROUP BY guruh
ORDER BY guruh;
```

**Kutilgan natija:**

| guruh | soni | eng_yuqori |
| ----- | ---- | ---------- |
| W-12  | 2    | 80         |
| W-14  | 1    | 92         |
