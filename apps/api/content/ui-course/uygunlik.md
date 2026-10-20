## Rang g‘ildiragi

Agar ranglarni doira bo‘ylab joylashtirsak — qizil, sariq, yashil, moviy, ko‘k, binafsha — **rang g‘ildiragi** hosil bo‘ladi. HSL’dagi ton (H) aynan shu g‘ildirakdagi burchak. Bir-biriga mos ranglarni topish g‘ildirakdagi oddiy geometriya.

## Asosiy sxemalar

| Sxema                  | Qoida (asos 210°)          | Taassurot                        |
| ---------------------- | -------------------------- | -------------------------------- |
| Monoxrom               | Bitta ton, turli yorug‘lik | Tinch, yaxlit                    |
| Analog                 | ±30° (180°, 240°)          | Yumshoq, tabiiy                  |
| Komplementar           | +180° (30°)                | Kuchli kontrast, e’tibor tortadi |
| Triada                 | +120°, +240° (330°, 90°)   | Rang-barang, o‘yinqaroq          |
| Bo‘lingan komplementar | +150°, +210°               | Kontrast, lekin yumshoqroq       |

## CSS’da hisoblash

Asos tonni o‘zgaruvchiga olib, qolganlarini `calc()` bilan hisoblash mumkin:

```css
:root {
  --h: 210;
}

.komplement {
  background: hsl(calc(var(--h) + 180) 80% 45%);
}
.analog {
  background: hsl(calc(var(--h) - 30) 80% 45%);
}
.triada {
  background: hsl(calc(var(--h) + 120) 80% 45%);
}
```

360 dan oshgan burchak avtomatik aylanadi: 210 + 180 = 390° = 30°.

## Interfeysda qanday ishlatiladi

Interfeys — rasm emas, sxemadagi barcha ranglar teng ishlatilmaydi:

- **Asosiy rang** (brend) — tugmalar, havolalar, faol holat.
- **Komplementar rang** — juda kam: muhim urg‘u, “Yangi” belgisi, chegirma.
- **Neytral ranglar** (kulranglar) — matn, fon, chegaralar; interfeysning katta qismi.
- **Holat ranglari** — yashil (muvaffaqiyat), sariq (ogohlantirish), qizil (xato). Ular sxemaga kirmasa ham, ma’nosi bilan tanlanadi.

## Rangga tayanmang

Rangni farqlay olmaydigan odamlar (erkaklarning taxminan 8 foizi) qizil va yashilni ajratmasligi mumkin. Shuning uchun holatni faqat rang bilan emas, ikonka va matn bilan ham ko‘rsating: “✗ Xato” emas, ikonka + “Parol juda qisqa”.

## Ilhom manbalari

Tayyor palitralarni tabiatdan, fotosuratlardan yoki rang generatorlaridan olish mumkin. Lekin generator bergan beshta rangni interfeysga to‘g‘ridan-to‘g‘ri qo‘ymang — ulardan bittasini asosiy, bittasini urg‘u qilib tanlang, qolganini neytrallar bilan to‘ldiring.

Mashqda asos tondan to‘rtta uyg‘un rangni `calc()` bilan hisoblaysiz.
