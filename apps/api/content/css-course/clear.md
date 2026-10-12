## Suzishni to‘xtatish: `clear`

`clear` element suzayotgan elementlar yonida emas, ularning **ostida** boshlanishini talab qiladi.

```css
.keyingi-bolim {
  clear: both;
}
```

| Qiymat  | Natija                                           |
| ------- | ------------------------------------------------ |
| `left`  | Chapga suzayotganlar ostidan boshlanadi          |
| `right` | O‘ngga suzayotganlar ostidan boshlanadi          |
| `both`  | Har ikkala tomondagilar ostidan boshlanadi       |
| `none`  | Standart                                         |

Misol: maqolada rasm chapga suzyapti, lekin yangi sarlavha rasmning yonida emas, ostida boshlanishi kerak:

```css
.maqola h2 {
  clear: both;
}
```

## Ota balandligini tiklash

Oldingi darsdagi muammo: suzayotgan bolani o‘z ichiga olmaydigan ota. Zamonaviy yechim — otaga **yangi blok formatlash konteksti** (BFC) berish:

```css
.quti {
  display: flow-root;
}
```

`flow-root` elementni oddiy blok qilib qoldiradi, lekin uni suzayotgan bolalarini o‘z ichiga olishga majbur qiladi. 3-moduldagi margin qo‘shilishini to‘xtatish ham xuddi shu xususiyat bilan qilingan edi.

## Eski usul: clearfix

Eski loyihalarda shunday kodni uchratasiz:

```css
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}
```

U ota ichining oxiriga ko‘rinmas element qo‘shib, unga `clear: both` beradi. Natija `display: flow-root` bilan bir xil, lekin yangi kodda `flow-root` sodda va tushunarliroq.

Yana bir eski usul — `overflow: hidden`. U ham BFC yaratadi, lekin chiqib turgan kontentni (soya, menyu) kesib tashlaydi.

## Xulosa

- `clear: both` — element suzayotganlar ostidan boshlanadi.
- Suzayotgan bolalarni o‘rash uchun otaga `display: flow-root`.
- Clearfix — eski usul, `flow-root` uni almashtiradi.
