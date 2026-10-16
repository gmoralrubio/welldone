import parse, {
  DOMNode,
  Element,
  HTMLReactParserOptions,
  domToReact,
} from 'html-react-parser';
import { ArticleH2 } from '@/app/[locale]/components/article-detail/article-h2';
import { ArticleH3 } from '@/app/[locale]/components/article-detail/article-h3';
import { ArticleOl } from '@/app/[locale]/components/article-detail/article-ol';
import { ArticleUl } from '@/app/[locale]/components/article-detail/article-ul';
import { ArticleBlockquote } from '@/app/[locale]/components/article-detail/article-blockquote';
import { ArticleCodeBlock } from '@/app/[locale]/components/article-detail/article-code-block';

export function parseContent(content: string) {
  const options: HTMLReactParserOptions = {
    replace(domNode) {
      if (domNode instanceof Element && domNode.name === 'h2') {
        return (
          <ArticleH2>{domToReact(domNode.children as DOMNode[], options)}</ArticleH2>
        );
      }
      if (domNode instanceof Element && domNode.name === 'h3') {
        return (
          <ArticleH3>{domToReact(domNode.children as DOMNode[], options)}</ArticleH3>
        );
      }
      if (domNode instanceof Element && domNode.name === 'ol') {
        return (
          <ArticleOl>{domToReact(domNode.children as DOMNode[], options)}</ArticleOl>
        );
      }
      if (domNode instanceof Element && domNode.name === 'ul') {
        return (
          <ArticleUl>{domToReact(domNode.children as DOMNode[], options)}</ArticleUl>
        );
      }
      if (domNode instanceof Element && domNode.name === 'blockquote') {
        return (
          <ArticleBlockquote>
            {domToReact(domNode.children as DOMNode[], options)}
          </ArticleBlockquote>
        );
      }
      if (domNode instanceof Element && domNode.name === 'pre') {
        return (
          <ArticleCodeBlock>
            {domToReact(domNode.children as DOMNode[], options)}
          </ArticleCodeBlock>
        );
      }
    },
  };

  return parse(content, options);
}
