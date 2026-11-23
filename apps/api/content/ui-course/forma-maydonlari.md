## Maydon holatlari

Forma maydoni ham tugma kabi holatlarga ega: oddiy, fokusda, xato, o‘chirilgan. Har birini foydalanuvchi bir qarashda ajratishi kerak.

## Aniq chegara

```css
input {
  border: 1px solid #94a3b8;
  border-radius: 8px;
  min-height: 44px;
  padding: 8px 12px;
}
```

Juda och chegara (`#e2e8f0`) chiroyli ko‘rinadi, lekin maydon qayerdaligini ko‘rish qiyin. WCAG bo‘yicha maydon chegarasining fonga kontrasti kamida **3:1**.

## Fokus

```css
input:focus-visible {
  border-color: #0071dc;
  box-shadow: 0 0 0 3px rgb(0 113 220 / 0.25);
  outline: none;
}
```

Bu yerda `outline: none` maqbul, chunki uning o‘rniga boshqa aniq ko‘rinadigan fokus belgisi — rangli chegara va halqa bor.

## Xato holati

```html
<label for="email">Email</label>
<input id="email" type="email" aria-invalid="true" aria-describedby="email-xato" />
<p id="email-xato" class="xato">Email to‘liq emas: @ dan keyin domen yozing.</p>
```

```css
input[aria-invalid='true'] {
  border-color: #b91c1c;
}
.xato {
  color: #b91c1c;
  font-size: 0.875rem;
}
```

- `aria-invalid="true"` — ekran o‘quvchi “noto‘g‘ri qiymat” deydi; CSS esa shu atributga qarab bezaydi (holat bitta joyda).
- `aria-describedby` — maydon fokus olganda xato matni ham o‘qiladi.
- Xato matni **nima qilish kerakligini** aytadi: “Noto‘g‘ri email” emas, “@ dan keyin domen yozing”.
- Faqat qizil rang yetmaydi — matn bo‘lishi shart.

## Yorliq

```css
label {
  font-weight: 600;
}
```

Yorliq maydon ustida, qisqa va doim ko‘rinadigan. Placeholder yorliq o‘rnini bosmaydi.

## Qachon xato ko‘rsatish

- Foydalanuvchi yozib bo‘lgach (`blur`) yoki yuborganda — yozayotgan paytida emas (“email noto‘g‘ri” birinchi harfdan chiqsa, asabga tegadi).
- Yuborilganda birinchi xatoli maydonga fokusni o‘tkazing.
- To‘g‘ri to‘ldirilganini ham ko‘rsatish mumkin, lekin ehtiyotkorlik bilan — yashil chegaralar ko‘payib ketmasin.

Mashqda maydonga aniq chegara, fokus va xato holatini berasiz.

```tekshir
Maydon xatosini qachon ko‘rsatish qulayroq?
+ foydalanuvchi maydonni tark etgandan yoki formani yuborgandan keyin
- birinchi harf yozilishi bilan
- sahifa ochilishi bilan
> Yozib ulgurmasdan xato ko‘rsatish asabiylashtiradi; CSS’da `:user-invalid` shunday ishlaydi.
```

```jonli
<style>
  label { display: block; font-weight: 600; margin-bottom: 4px; }
  input { font: inherit; padding: 8px 10px; border: 1px solid #8a94a3; border-radius: 6px; width: 100%; max-width: 280px; }
  input:focus-visible { outline: 3px solid #0071dc55; border-color: #0071dc; }
  input:user-invalid { border-color: #c0392b; }
  input:user-invalid + .x { display: block; }
  .x { display: none; color: #c0392b; font-size: .9rem; }
</style>
<label for="em">Email</label><input id="em" type="email" required><span class="x">To‘g‘ri email kiriting</span>
```
