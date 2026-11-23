## Komponentlar — qayta ishlatiladigan bloklar

Figma’da bir xil tugmani yuz marta chizish o‘rniga **komponent** yasaladi. Asosiy komponent (_Main component_, binafsha olmos belgisi) — andoza; sahifalardagi nusxalar — **instance** (oq olmos). Asosiy komponent o‘zgarsa, hamma nusxa yangilanadi.

Kodda ham shunday: bitta CSS klass (yoki React/Vue komponenti) — ko‘p joyda ishlatiladi.

| Figma                                             | Kod                            |
| ------------------------------------------------- | ------------------------------ |
| Main component `Chip`                             | `.chip` klassi                 |
| Instance                                          | `<span class="chip">`          |
| Instance’dagi matn almashtirish (override)        | HTML ichidagi matn             |
| Component property (Boolean, Text, Instance swap) | modifikator klass yoki atribut |

## Komponent xususiyatlari

Zamonaviy Figma komponentlarida **properties** bor:

- **Boolean** — “Show icon: true/false”;
- **Text** — tugma matni;
- **Instance swap** — qaysi ikonka;
- **Variant** — o‘lcham, tur, holat (keyingi dars).

Boolean xususiyat CSS’da ko‘pincha modifikator:

```css
.chip--ikonkasiz .ikonka {
  display: none;
}
```

Yaxshiroq usul — kerak bo‘lmasa, ikonkani HTML’ga umuman qo‘ymaslik. CSS bilan yashirish faqat statik HTML’da qulay; React kabi komponentlarda `{showIcon && <Icon/>}`.

## Instance’ni “detach” qilish

Dizayner ba’zan instance’ni asosiy komponentdan uzib (_detach_), qo‘lda o‘zgartiradi. Inspect’da bu elementda komponent nomi bo‘lmaydi. Agar u tizimdagi komponentga deyarli o‘xshasa — buni dizaynerga ayting: kodda yangi variant yaratish yoki maketni tuzatish kerak.

## Komponentni topish

Instance’ni tanlasangiz, Inspect’da “Main component: Chip” va uning xususiyatlari ko‘rinadi. Dev Mode’da komponent nomi va hatto mos kod parchasi (agar jamoa _Code Connect_ sozlagan bo‘lsa) ko‘rsatilishi mumkin.

## Nomlash

Figma’dagi komponent nomlari (`Button/Primary`, `Card/Course`) kod klasslari va fayl nomlari bilan mos bo‘lsa, ikki dunyo orasida “tarjima” kerak bo‘lmaydi. Jamoa bilan bitta nomlash qoidasini kelishib oling.

Mashqda Chip komponentini va uning ikonkasiz variantini yozasiz.

```tekshir
Figma komponenti kodda nimaga mos keladi?
+ qayta ishlatiladigan klass (masalan, `.karta`) yoki komponent
- har sahifada nusxa ko‘chirilgan alohida uslub
- rasm
> Komponentning “instance” lari — bir klassli ko‘p elementlar.
```

```jonli
<style>
  .karta { padding: 12px; border: 1px solid #dfe6ee; border-radius: 10px; margin-bottom: 8px; }
  .karta__sarlavha { margin: 0 0 4px; font-size: 1.1rem; }
</style>
<div class="karta"><h3 class="karta__sarlavha">HTML</h3>60 dars</div>
<div class="karta"><h3 class="karta__sarlavha">CSS</h3>101 dars</div>
```
