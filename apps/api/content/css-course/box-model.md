## Har bir element — quti

Brauzer sahifadagi har bir elementni to‘rtburchak **quti** sifatida chizadi. Bu quti to‘rt qatlamdan iborat:

| Qatlam      | Tavsif                                         |
| ----------- | ---------------------------------------------- |
| **Content** | Kontent: matn, rasm (`width`, `height`)        |
| **Padding** | Kontent atrofidagi ichki bo‘shliq, fonni oladi |
| **Border**  | Chegara                                         |
| **Margin**  | Chegaradan tashqaridagi shaffof bo‘shliq        |

Ichkaridan tashqariga: content → padding → border → margin.

## Element qancha joy egallaydi?

```css
.quti {
  width: 300px;
  padding: 20px;
  border: 5px solid #0071dc;
  margin: 10px;
}
```

Standart (`content-box`) hisob:

- **ko‘rinadigan kenglik** = 300 + 20 + 20 + 5 + 5 = **350px**;
- **egallagan joy** (margin bilan) = 350 + 10 + 10 = **370px**.

Ya’ni `width` faqat kontentning kengligi!

## `box-sizing: border-box`

Ko‘pincha “men 300px desam, quti 300px bo‘lsin” degan mantiq qulayroq. `border-box` da `width` padding va chegarani ham o‘z ichiga oladi:

```css
.quti {
  box-sizing: border-box;
  width: 300px;
  padding: 20px;
  border: 5px solid #0071dc;
}
```

Endi ko‘rinadigan kenglik aynan **300px**, kontent uchun esa 300 − 40 − 10 = 250px qoladi.

| `box-sizing`  | `width` nimani o‘lchaydi           |
| ------------- | ---------------------------------- |
| `content-box` | Faqat kontentni (standart)         |
| `border-box`  | Kontent + padding + chegarani      |

## DevTools’da quti modeli

Brauzerda elementni tekshirganda (Inspect) “Computed” bo‘limida rangli quti chizmasi bor: ko‘k — content, yashil — padding, sariq — border, to‘q sariq — margin. Ustiga sichqoncha olib borsangiz, sahifada shu qatlam yoritiladi. Bu bo‘shliq qayerdan kelayotganini tushunishning eng tez yo‘li.

## Satr elementlari

`span`, `a`, `strong` kabi satr (inline) elementlarda `width` va `height` ishlamaydi, yuqori va pastki margin esa qo‘shni qatorlarni surmaydi. Ularni quti kabi boshqarish uchun `display: inline-block` yoki `block` beriladi (keyingi modulda).

## Xulosa

- Quti: content → padding → border → margin.
- Standart holda `width` faqat kontentni o‘lchaydi; padding va chegara qo‘shiladi.
- `box-sizing: border-box` bilan `width` butun ko‘rinadigan qutini o‘lchaydi.
