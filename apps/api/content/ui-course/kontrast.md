## Kontrast nima?

**Kontrast** — matn rangi bilan fon rangi yorug‘ligi orasidagi farq. U nisbat bilan o‘lchanadi: 1:1 (bir xil rang) dan 21:1 gacha (oq fonda qora).

## WCAG talablari

Xalqaro accessibility standarti WCAG 2.1 bo‘yicha (AA darajasi):

| Element                                        | Minimal kontrast |
| ---------------------------------------------- | ---------------- |
| Oddiy matn                                     | **4.5:1**        |
| Katta matn (24px yoki 18.66px qalin)           | 3:1              |
| Ikonkalar, chegaralar, forma maydoni chegarasi | 3:1              |
| O‘chirilgan (disabled) elementlar              | talab yo‘q       |

Bu talablar nafaqat ko‘zi yaxshi ko‘rmaydiganlar uchun: quyosh ostida telefonda o‘qiyotgan har bir odam yetarli kontrastga muhtoj.

## Odatiy xatolar

- **Och kulrang izoh matni.** `#a0aec0` oq fonda atigi 2.4:1. Chiroyli ko‘rinadi, lekin o‘qish qiyin. `#475569` (7.6:1) yoki hech bo‘lmasa `#64748b` (4.8:1).
- **Och rangli tugmada oq matn.** `#59a2ff` ustida oq matn 2.6:1. To‘qroq soya kerak: `#005bb5` (6.6:1).
- **Placeholder.** Ko‘p dizaynlarda juda och. Uni ham matn deb hisoblang.
- **Rasm ustidagi matn.** Fon o‘zgaruvchan — matn ostiga yarim shaffof qorong‘i qatlam qo‘ying.

## Qanday tekshirish

- Chrome DevTools: elementni tanlang → **Styles** panelida rang kvadratini bosing → “Contrast ratio” ko‘rsatiladi, yonida ✓ yoki ✗.
- Lighthouse’ning accessibility bo‘limi past kontrastli elementlarni sanab beradi.
- Dizayn bosqichida: Figma’dagi kontrast plaginlari.

## Kontrast — faqat rang emas

O‘qilishiga shrift o‘lchami va qalinligi ham ta’sir qiladi. Ingichka (300) shriftga kattaroq kontrast kerak. Shu sabab izoh matnini **ham kichik, ham och, ham ingichka** qilish — uch karra xato.

## Juda yuqori kontrast ham muammo

Qorong‘i mavzuda sof oq matn qora fonda (21:1) ba’zi odamlarga “ko‘zni kesadigan” bo‘lib tuyuladi. Qorong‘i mavzuda `#e2e8f0` kabi biroz yumshoq oq va to‘q ko‘k-kulrang fon yaxshiroq.

Mashqda uchta past kontrastli joyni WCAG talabiga moslaysiz.
