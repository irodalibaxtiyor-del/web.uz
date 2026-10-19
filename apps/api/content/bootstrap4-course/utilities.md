## Utilita klasslar

**Utilita** — bitta CSS xususiyatini beradigan kichik klass. Bootstrap 4 da ular juda ko‘p va ko‘p hollarda o‘z CSS’ingizni yozish shart emas.

## Bo‘shliqlar (spacing)

Formula: **`{xususiyat}{tomon}-{o‘lcham}`**

| Xususiyat | Tomon                              | O‘lcham                    |
| --------- | ---------------------------------- | -------------------------- |
| `m` — margin  | `t` yuqori, `b` past, `l` chap, `r` o‘ng | `0` — 0                |
| `p` — padding | `x` chap+o‘ng, `y` yuqori+past         | `1` — .25rem (4px)      |
|               | (bo‘sh) — hamma tomon                  | `2` — .5rem (8px)       |
|               |                                        | `3` — 1rem (16px)       |
|               |                                        | `4` — 1.5rem (24px)     |
|               |                                        | `5` — 3rem (48px)       |
|               |                                        | `auto` — faqat margin   |

```html
<div class="mt-3 mb-5 px-4 py-2">…</div>
<!-- margin-top 1rem, margin-bottom 3rem, padding chap/o‘ng 1.5rem, yuqori/past .5rem -->
<div class="mx-auto" style="width: 200px;">Markazda</div>
```

Ekranga qarab: `p-2 p-md-5` — telefonda kichik, `md` dan katta padding. Manfiy margin: `mt-n3`.

## Chegara va burchak

```html
<span class="border">Hamma tomonda</span>
<span class="border-top">Faqat tepada</span>
<span class="border border-danger">Qizil chegara</span>
<span class="border-0">Chegarasiz</span>
<img class="rounded" …>  <img class="rounded-circle" …>  <span class="rounded-pill">…</span>
```

## Ranglar

`text-*`, `bg-*` (2-moduldagi kabi) va gradient: `bg-gradient-primary` (Sass sozlamasi yoqilganda).

## Display

| Klass                         | Natija                                |
| ----------------------------- | ------------------------------------- |
| `d-none`                      | Yashirin                              |
| `d-block`, `d-inline`, `d-inline-block` | Display turi                |
| `d-flex`, `d-inline-flex`     | Flex konteyner                        |
| `d-md-none`, `d-lg-block`     | Ekranga qarab                         |
| `d-print-none`                | Chop etilganda yashirin               |

```html
<div class="d-none d-md-block">Faqat planshet va undan katta ekranda</div>
<div class="d-md-none">Faqat telefonda</div>
```

## O‘lcham (sizing)

`w-25`, `w-50`, `w-75`, `w-100`, `w-auto`; `h-25` … `h-100`; `mw-100`, `mh-100`; `vw-100`, `vh-100`.

## Soya, joylashuv va boshqalar

```html
<div class="shadow-sm p-3 mb-3">Yengil soya</div>
<div class="shadow p-3 mb-3">Oddiy soya</div>
<div class="shadow-lg p-3 mb-3">Katta soya</div>

<div class="position-relative">…</div>
<div class="fixed-top">…</div> <div class="sticky-top">…</div>
<div class="float-right">…</div> <div class="clearfix">…</div>
<p class="text-truncate">Juda uzun matn…</p>
<span class="sr-only">Faqat ekran o‘quvchi uchun</span>
<div class="embed-responsive embed-responsive-16by9">
  <iframe class="embed-responsive-item" src="…" title="Video"></iframe>
</div>
```

`.embed-responsive-16by9` — video 16:9 nisbatini saqlab moslashadi.

## Qachon utilita, qachon o‘z CSS?

- Bir-ikki joyda kerak bo‘lgan bo‘shliq, rang, display — utilita.
- Ko‘p joyda takrorlanadigan murakkab uslub — o‘z klassingiz (`.kurs-kartasi`). HTML’ni 15 ta utilita bilan to‘ldirib yubormang.

## Xulosa

- Spacing: `m|p` + `t|b|l|r|x|y` + `0–5|auto` (`mt-3`, `px-2`, `mx-auto`).
- Display: `d-none`, `d-flex`, `d-md-block`; sizing: `w-50`, `h-100`.
- Chegara, `rounded-*`, `shadow-*`, `sticky-top`, `embed-responsive`.
