## Bootstrap 4 da ikonkalar

Bootstrap 4 tarkibida ikonkalar **yo‘q** — Bootstrap 3 dagi Glyphicons olib tashlangan. Ikonkalar uchun alohida kutubxona ulanadi. Eng qulayi — Bootstrap jamoasining o‘zi chiqargan **Bootstrap Icons** (2000 dan ortiq, bepul, MIT litsenziya). U Bootstrap 4 bilan ham, 5 bilan ham ishlaydi.

> Ko‘p eski misollarda Font Awesome ishlatiladi. Uning ham bepul versiyasi bor, lekin ulash usuli va klass nomlari boshqacha.

## Ulash

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
```

Bu fayl Bootstrap CSS’dan keyin `<head>` ga qo‘shiladi. U ikonka shriftini o‘zi yuklaydi.

## Ishlatish

```html
<i class="bi bi-house" aria-hidden="true"></i>
<i class="bi bi-search" aria-hidden="true"></i>
<i class="bi bi-heart-fill text-danger" aria-hidden="true"></i>
```

- `.bi` — asosiy klass;
- `.bi-house` — ikonka nomi (to‘liq ro‘yxat — Bootstrap Icons sayti);
- `-fill` qo‘shimchasi — to‘ldirilgan variant (`bi-star` va `bi-star-fill`).

Ikonka shrift bo‘lgani uchun rangi `text-*` yoki `color`, o‘lchami `font-size` bilan o‘zgaradi:

```html
<i class="bi bi-check-circle-fill text-success" style="font-size: 2rem;" aria-hidden="true"></i>
```

## Tugma va matn ichida

```html
<button type="button" class="btn btn-primary">
  <i class="bi bi-download" aria-hidden="true"></i> Yuklab olish
</button>

<a href="#" class="btn btn-outline-secondary" aria-label="Sozlamalar">
  <i class="bi bi-gear" aria-hidden="true"></i>
</a>
```

## Foydalanish imkoniyati

| Holat                         | Nima qilish kerak                             |
| ----------------------------- | --------------------------------------------- |
| Ikonka yonida matn bor        | Ikonkaga `aria-hidden="true"`                 |
| Faqat ikonka (tugma, havola)  | Tugmaga `aria-label` (yoki `.sr-only` matn)   |
| Ikonka ma’lumot beradi (✓, ✕) | Yonida yashirin matn: `<span class="sr-only">Bajarildi</span>` |

## SVG sifatida

Bootstrap Icons’ni shrift o‘rniga to‘g‘ridan-to‘g‘ri SVG kodi sifatida ham qo‘yish mumkin — shunda tashqi fayl kerak bo‘lmaydi:

```html
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
     class="bi bi-star-fill" viewBox="0 0 16 16" aria-hidden="true">
  <path d="…"/>
</svg>
```

`fill="currentColor"` — ikonka matn rangini oladi.

## Xulosa

- Bootstrap 4 da ikonka yo‘q; Bootstrap Icons alohida ulanadi.
- `<i class="bi bi-NOMI" aria-hidden="true"></i>`; rang — `text-*`, o‘lcham — `font-size`.
- Faqat ikonkali tugmaga `aria-label`.
