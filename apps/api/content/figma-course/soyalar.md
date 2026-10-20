## Effects paneli

Figma’da qatlamga effektlar qo‘shiladi: **Drop shadow**, **Inner shadow**, **Layer blur**, **Background blur**. Ularning har biri CSS’da aniq muqobilga ega.

## Drop shadow → `box-shadow`

```
Drop shadow
X 0   Y 4   Blur 8   Spread -2
#0F172A  10%
```

```css
box-shadow: 0 4px 8px -2px rgb(15 23 42 / 0.1);
```

Tartib: **X, Y, Blur, Spread, rang**. Figma’dagi tartib ham xuddi shu — qiymatlarni ketma-ket ko‘chirish kifoya.

## Bir nechta soya

Zamonaviy soyalar ko‘pincha ikki-uch qatlamdan iborat: biri yaqin va aniq (kontur), biri uzoq va yumshoq (chuqurlik). Figma’da ular effektlar ro‘yxatida ketma-ket; CSS’da vergul bilan:

```css
.karta {
  box-shadow:
    0 1px 2px 0 rgb(15 23 42 / 0.06),
    0 4px 8px -2px rgb(15 23 42 / 0.1);
}
```

Dizayn tizimlarida bunday soyalar tokenlarga aylanadi: `--shadow-sm`, `--shadow-md`, `--shadow-lg`.

## Inner shadow → `inset`

```css
input {
  box-shadow: inset 0 1px 2px 0 rgb(15 23 42 / 0.05);
}
```

Element ichkariga “botgandek” ko‘rinadi — forma maydonlari uchun.

## Layer blur → `filter: blur()`

Qatlamning o‘zini xiralashtiradi (masalan, fondagi bezak shakl):

```css
.bezak {
  filter: blur(40px);
}
```

## Background blur → `backdrop-filter`

Qatlam **ortidagi** narsalarni xiralashtiradi — “shisha” effekti:

```css
.oyna {
  background-color: rgb(255 255 255 / 0.6);
  backdrop-filter: blur(12px);
}
```

Fon yarim shaffof bo‘lishi shart — aks holda xiralashgan qism ko‘rinmaydi. `backdrop-filter` og‘ir operatsiya: katta maydonlarda va eski telefonlarda sahifani sekinlashtirishi mumkin.

## `filter: drop-shadow()`

Shaffof PNG yoki SVG shakl atrofida (to‘rtburchak emas, shakl bo‘ylab) soya kerak bo‘lsa: `filter: drop-shadow(0 4px 8px rgb(0 0 0 / 0.2))`.

## Figma’dagi nozik farq

Figma soyani **shaffof** elementlar uchun ham chizadi (“Show behind transparent areas” sozlamasi). CSS’dagi `box-shadow` esa doim element qutisi bo‘ylab. Natijalar odatda bir xil, lekin shaffof fonli elementlarda tekshiring.

Mashqda ikki qatlamli soya, ichki soya va fon xiralashtirishni yozasiz.
