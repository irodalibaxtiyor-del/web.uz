/** Starter snippets the lesson editor inserts for each interactive block kind. */
export const LESSON_BLOCK_TEMPLATES = [
  {
    label: 'Tekshiruv savoli',
    text: [
      '```tekshir',
      'Savol matni?',
      '- noto‘g‘ri variant',
      '+ to‘g‘ri variant',
      '- noto‘g‘ri variant',
      '> Nega bu javob to‘g‘ri — qisqa izoh.',
      '```',
    ].join('\n'),
  },
  {
    label: 'Jonli misol',
    text: [
      '```jonli',
      '<h1>Salom!</h1>',
      '<p style="color: teal">Kodni o‘zgartirib ko‘ring.</p>',
      '```',
    ].join('\n'),
  },
  {
    label: 'Yechim (yashirin)',
    text: ['````yechim Javobni ko‘rish', 'Javob yoki yechim matni (Markdown).', '````'].join('\n'),
  },
] as const;
