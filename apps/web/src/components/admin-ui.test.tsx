import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { fileNameFrom } from '@/lib/api';
import { AccountStatus, CredentialNotice, Pager, SortHeader } from './admin-ui';
import { StruggleBadge } from './monitoring-ui';

const account = { userId: 'u', disabled: false, hasPassword: true, mustChangePassword: false };

describe('admin UI', () => {
  it('names every account state in text, not only colour', () => {
    expect(renderToStaticMarkup(<AccountStatus a={account} />)).toContain('Faol');
    expect(
      renderToStaticMarkup(<AccountStatus a={{ ...account, hasPassword: false }} />),
    ).toContain('Parol berilmagan');
    expect(
      renderToStaticMarkup(<AccountStatus a={{ ...account, mustChangePassword: true }} />),
    ).toContain('Vaqtinchalik parol');
    expect(renderToStaticMarkup(<AccountStatus a={{ ...account, disabled: true }} />)).toContain(
      'Faolsiz',
    );
  });

  it('shows a temporary password once, as text, with a warning', () => {
    const html = renderToStaticMarkup(
      <CredentialNotice
        credential={{
          userId: 'u',
          fullName: '<b>ALI</b>',
          login: 'ali.vali',
          group: '8-24 ATT',
          temporaryPassword: '8-24att-k7m4-q2x9',
        }}
        onClose={() => {}}
      />,
    );
    expect(html).toContain('role="alert"');
    expect(html).toContain('8-24att-k7m4-q2x9');
    expect(html).toContain('faqat hozir ko‘rinadi');
    expect(html).toContain('&lt;b&gt;ALI&lt;/b&gt;');
  });

  it('exposes sort state and paging to assistive technology', () => {
    const th = renderToStaticMarkup(
      <table>
        <thead>
          <tr>
            <SortHeader
              label="F.I.Sh."
              k="name"
              sort={{ key: 'name', dir: 'desc' }}
              onSort={() => {}}
            />
          </tr>
        </thead>
      </table>,
    );
    expect(th).toContain('aria-sort="descending"');
    const pager = renderToStaticMarkup(
      <Pager page={1} pages={3} start={25} shown={25} total={74} onPage={() => {}} />,
    );
    expect(pager).toContain('26–50 / 74');
    expect(pager).toContain('2 / 3');
    expect(
      renderToStaticMarkup(
        <Pager page={0} pages={1} start={0} shown={0} total={0} onPage={() => {}} />,
      ),
    ).toBe('');
  });

  it('labels missing data as such', () => {
    expect(renderToStaticMarkup(<StruggleBadge status="INSUFFICIENT_DATA" />)).toContain(
      'Ma’lumot yetarli emas',
    );
    expect(renderToStaticMarkup(<StruggleBadge status="STRUGGLING" count={2} />)).toContain(
      'Qiynalmoqda (2)',
    );
  });

  it('reads the download file name from Content-Disposition', () => {
    expect(
      fileNameFrom(
        'attachment; filename="ballar-8-24 ATT-o_quv.xlsx"; filename*=UTF-8\'\'ballar-8-24%20ATT-o%E2%80%98quv.xlsx',
        'x.xlsx',
      ),
    ).toBe('ballar-8-24 ATT-o‘quv.xlsx');
    expect(fileNameFrom('attachment; filename="a.xlsx"', 'x.xlsx')).toBe('a.xlsx');
    expect(fileNameFrom(null, 'x.xlsx')).toBe('x.xlsx');
  });
});
