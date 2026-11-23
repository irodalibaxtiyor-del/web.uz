## Auto Layout’dan chiqarilgan element

Ba’zan elementni Auto Layout oqimidan chiqarish kerak: avatar burchagidagi nishon, karta ustidagi “Yangi” yorlig‘i, rasm ustidagi yopish tugmasi. Figma’da buning uchun elementda **Absolute position** (“Ignore auto layout”) belgisi yoqiladi. Element boshqalarni surmaydi va joyini **constraints** belgilaydi.

## CSS’da

```css
.avatar-quti {
  position: relative; /* koordinatalar shu elementdan hisoblanadi */
  display: inline-block;
}

.nishon {
  position: absolute;
  top: -4px;
  right: -4px;
}
```

- Ota elementdagi `position: relative` shart — aks holda nishon butun sahifaga nisbatan joylashadi.
- Figma’dagi constraints: **Top + Right** → CSS’da `top` va `right`. **Bottom + Left** → `bottom` va `left`.
- Manfiy qiymat — element chegaradan chiqib turadi.

## Stroke Outside

Nishon atrofidagi oq halqa maketda “Stroke 2 Outside” bo‘lishi mumkin. CSS’dagi `border` element ichiga (border-box) kiradi va o‘lchamni o‘zgartiradi. Tashqi stroke uchun eng yaxshi usul:

```css
.nishon {
  box-shadow: 0 0 0 2px white;
}
```

Soyaning _spread_ qiymati elementni o‘lchamini o‘zgartirmasdan tashqaridan “o‘raydi”. `outline: 2px solid white` ham ishlaydi, lekin u ba’zan radiusni hisobga olmaydi (eski brauzerlarda).

## Qachon absolyut ishlatmaslik

Dev Mode ko‘pincha **hamma** elementga `position: absolute` beradi. Bu faqat haqiqatan oqimdan tashqari elementlar uchun to‘g‘ri. Agar sarlavha, matn va tugma absolyut joylashtirilsa, matn uzayganda ular bir-birining ustiga chiqadi. Qoida: oqimdagi elementlar — Flexbox/Grid, ustiga “yopishtirilgan” bezaklar — absolyut.

## `inset`

Barcha to‘rt tomonni bir yozuvda berish mumkin: `inset: 0` — ota elementni to‘liq qoplaydi (masalan, rasm ustidagi qorong‘i qatlam).

## Nishon accessibility’si

Nishon “3” kontekstsiz o‘qilsa tushunarsiz: `aria-label="3 ta yangi xabar"` yoki yashirin matn qo‘shing.

Mashqda avatar burchagidagi nishonni maketdagi kabi joylashtirasiz.

```tekshir
Auto Layout’dan chiqarilgan (absolute) nishon kodda qanday joylashtiriladi?
+ ota `position: relative`, nishon `position: absolute` va `top`/`right`
- nishon `float: right`
- `margin-top: -20px`
> Ota element nishon uchun tayanch nuqta bo‘ladi.
```

```jonli
<style>
  .k { position: relative; width: 200px; padding: 20px; background: #eef4fb; border-radius: 10px; }
  .n { position: absolute; top: -8px; right: -8px; background: #c0392b; color: #fff; font-size: 12px; min-width: 22px; height: 22px; display: grid; place-items: center; border-radius: 999px; }
</style>
<div class="k">Xabarlar<span class="n">3<span style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0)"> ta yangi</span></span></div>
```
