import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ArticleMarkdownContentProps {
  content: string;
}

export function ArticleMarkdownContent({
  content,
}: ArticleMarkdownContentProps) {
  return <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>;
}
