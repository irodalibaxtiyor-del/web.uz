## Vaqt chizig‘i

Tajriba yoki o‘qish yo‘li vaqt chizig‘i (_timeline_) ko‘rinishida chiroyli ko‘rinadi: vertikal chiziq va har bir voqea oldida nuqta. Butun bezak — ikkita psevdoelement.

## HTML: tartiblangan ro‘yxat

```html
<ol class="vaqt">
  <li class="band"><time datetime="2026">2026</time> — Frontend dasturchi, “Raqam” studiyasi</li>
  <li class="band"><time datetime="2025">2025</time> — Amaliyot, onlayn do‘kon</li>
</ol>
```

- `<ol>` — voqealar tartibli (vaqt bo‘yicha);
- `<time datetime>` — sana mashina o‘qiy oladigan formatda (qidiruv tizimlari, ekran o‘quvchilar).

## Chiziq: `::before` ro‘yxatda

```css
.vaqt {
  position: relative;
  padding-left: 28px;
  list-style: none;
}

.vaqt::before {
  content: '';
  position: absolute;
  left: 6px;
  top: 4px;
  bottom: 4px;
  width: 2px;
  background-color: var(--chegara);
}
```

`content: ""` shart — usiz psevdoelement umuman chizilmaydi. `top` va `bottom` birga berilsa, balandlik avtomatik: chiziq ro‘yxatning butun balandligi bo‘ylab.

## Nuqtalar: `::before` har bir bandda

```css
.band {
  position: relative;
}

.band::before {
  content: '';
  position: absolute;
  left: -27px;
  top: 6px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--urg);
}
```

Nuqta markazi chiziq markaziga to‘g‘ri kelishi uchun: chiziq `left: 6px`, kengligi 2px (markazi 7px); band esa ro‘yxat chetidan 28px ichkarida, shuning uchun nuqta `-28 + 7 − 6 = −27px`.

## Telefonda va kompyuterda

Telefonda vertikal chiziq chapda — ideal. Kompyuterda ba’zan voqealar chiziqning ikki tomoniga navbatma-navbat joylashtiriladi (zigzag). Bu chiroyli, lekin o‘qish tartibi chalkashadi — oddiy chap tomonli variant ko‘pincha yaxshiroq.

## Psevdoelementlar va ekran o‘quvchi

`::before` dagi `content: ""` bo‘sh — ekran o‘quvchi uni o‘qimaydi. Lekin `content: "★"` kabi belgi yozsangiz, u o‘qilishi mumkin. Bezak belgilarini psevdoelementga qo‘yganda buni hisobga oling.

Mashqda tajriba ro‘yxatini vaqt chizig‘iga aylantirasiz.
