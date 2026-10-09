import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AssignmentStatusBadge, SubmissionStatusBadge } from './assignment-ui';

describe('assignment badges', () => {
  it('labels every state with text, not colour alone', () => {
    expect(renderToStaticMarkup(<SubmissionStatusBadge status={null} />)).toContain('Boshlanmagan');
    expect(renderToStaticMarkup(<SubmissionStatusBadge status="REVISION_REQUESTED" />)).toContain(
      'Qayta ishlash so‘raldi',
    );
    expect(renderToStaticMarkup(<AssignmentStatusBadge status="CLOSED" />)).toContain('Yopilgan');
  });
});
