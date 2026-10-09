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
