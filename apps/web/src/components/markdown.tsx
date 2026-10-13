import { Fragment, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Lesson content renderer. react-markdown does not render raw HTML, so author-supplied
 * `<script>` or event-handler attributes are shown as text rather than executed.
 */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="lesson-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}

/** `text` with `inline code` and **bold** spans; everything else stays literal (React escapes it). */
function inlineCode(text: string): ReactNode[] {
  return text.split(/(`[^`\n]+`|\*\*[^*\n]+\*\*)/).map((part, i) => {
    if (part.length > 2 && part.startsWith('`') && part.endsWith('`')) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    if (part.length > 4 && part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/**
 * Quiz question text. Deliberately not Markdown: quiz texts quote HTML (`<br>`), comments
 * (`/* … *\/`, `# …`) and code that Markdown would swallow or reformat. Only ```fenced```
 * blocks and `inline code` are special; line breaks are kept.
 */
export function QuestionText({ children }: { children: string }) {
  const parts = children.split(/```[a-z]*\n?([\s\S]*?)\n?```/);
  return (
    <div className="quiz-prompt">
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <pre key={i}>
            <code>{part}</code>
          </pre>
        ) : part.trim() ? (
          <p key={i} className="whitespace-pre-line">
            {inlineCode(part.trim())}
          </p>
        ) : null,
      )}
    </div>
  );
}

/** Answer option text: literal, with `inline code` spans. */
export function OptionText({ children }: { children: string }) {
  return <>{inlineCode(children)}</>;
}
