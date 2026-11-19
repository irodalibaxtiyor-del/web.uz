## Tekislash va markazlash

“Elementni markazga qanday qo‘yaman?” — CSS’dagi eng ko‘p beriladigan savol. Javob **nimani** va **qaysi yo‘nalishda** markazlashga bog‘liq.

## Matnni gorizontal markazlash

```css
.sarlavha {
  text-align: center;
}
```

Blok ichidagi matn va qator elementlar (havola, rasm, `inline-block`) markazga keladi.

## Blokni gorizontal markazlash

```css
.konteyner {
  max-width: 600px;
  margin: 0 auto;
}
```

Blokning **kengligi** bo‘lishi shart (`width` yoki `max-width`), aks holda u butun kenglikni egallaydi va markazlash ko‘rinmaydi.

Rasmni markazlash uchun avval uni blokka aylantiring:

```css
img.markaz {
  display: block;
  margin: 0 auto;
}
```

## Ikki yo‘nalishda markazlash: Flexbox

```css
.qahramon {
  display: flex;
  justify-content: center; /* gorizontal */
  align-items: center;     /* vertikal */
  min-height: 300px;
}
```

Bu bugungi kunda eng ko‘p ishlatiladigan usul. Flexbox 13-modulda batafsil o‘rganiladi.

## Grid bilan — eng qisqa

```css
.qahramon {
  display: grid;
  place-items: center;
  min-height: 300px;
}
```

## Absolute element markazda

```css
.ota {
  position: relative;
}

.bola {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

`top: 50%` va `left: 50%` bolaning **burchagini** markazga qo‘yadi; `translate(-50%, -50%)` uni o‘z o‘lchamining yarmiga orqaga suradi.

## Chapga va o‘ngga

Bir qatorda bitta element chapda, boshqasi o‘ngda turishi kerak bo‘lsa:

```css
.qator {
  display: flex;
  justify-content: space-between;
}
```

## Qaysi usul qachon

| Vazifa                          | Usul                                   |
| ------------------------------- | -------------------------------------- |
| Matn markazda                   | `text-align: center`                   |
| Kengligi bor blok markazda      | `margin: 0 auto`                       |
| Har ikki yo‘nalishda markazda   | `display: grid; place-items: center`   |
| Ustiga chiqqan element markazda | `absolute` + `translate(-50%, -50%)`   |

```tekshir
Blokni gorizontal va vertikal markazga qo‘yishning eng qisqa usuli qaysi?
+ otaga `display: grid; place-items: center;`
- `text-align: center` bolaga
- `vertical-align: middle` otaga
> Grid (yoki flex + `justify-content` va `align-items`) ikki yo‘nalishda markazlaydi.
```

```jonli
<style>
  .o { display: grid; place-items: center; height: 140px; background: #eef4fb; }
  .b { background: #0071dc; color: white; padding: 10px 16px; border-radius: 8px; }
</style>
<div class="o"><div class="b">Markazda</div></div>
```

## Xulosa

- Matn — `text-align`, blok — `margin: 0 auto`.
- Ikki yo‘nalishda — Flexbox yoki Grid.
- Absolute element — `top/left: 50%` va `translate(-50%, -50%)`.
