import React from 'react';

type LexicalNode = {
  type: string;
  children?: LexicalNode[];
  text?: string;
  format?: number;
  tag?: string;
  listType?: string;
  url?: string;
  direction?: string;
  indent?: number;
  version?: number;
  value?: unknown;
  fields?: {
    url?: string;
    linkType?: 'custom' | 'internal';
    newTab?: boolean;
    doc?: {
      relationTo?: string;
      value?: string | number | { id?: string | number; slug?: string };
    } | null;
  };
};

type LexicalContent = {
  root?: {
    children?: LexicalNode[];
  };
};

function renderText(node: LexicalNode): React.ReactNode {
  let text: React.ReactNode = node.text || '';
  const format = node.format || 0;

  if (format & 1) text = <strong key="b">{text}</strong>;
  if (format & 2) text = <em key="i">{text}</em>;
  if (format & 4) text = <s key="s">{text}</s>;
  if (format & 8) text = <u key="u">{text}</u>;
  if (format & 16) text = <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm" key="c">{text}</code>;

  return text;
}

function renderNode(node: LexicalNode, index: number): React.ReactNode {
  switch (node.type) {
    case 'text':
      return <React.Fragment key={index}>{renderText(node)}</React.Fragment>;

    case 'linebreak':
      return <br key={index} />;

    case 'paragraph':
      return (
        <p key={index} className="mb-4 text-gray-800 dark:text-gray-300 leading-relaxed">
          {node.children?.map((child, i) => renderNode(child, i))}
        </p>
      );

    case 'heading': {
      const Tag = (node.tag || 'h2') as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      const headingClasses: Record<string, string> = {
        h1: 'text-3xl font-light tracking-wide mb-4 mt-8 text-gray-900 dark:text-gray-200',
        h2: 'text-2xl font-light tracking-wide mb-3 mt-6 text-gray-900 dark:text-gray-200',
        h3: 'text-xl font-light tracking-wide mb-2 mt-5 text-gray-900 dark:text-gray-200',
        h4: 'text-lg font-medium mb-2 mt-4 text-gray-900 dark:text-gray-200',
      };
      return (
        <Tag key={index} className={headingClasses[node.tag || 'h2'] || headingClasses.h2}>
          {node.children?.map((child, i) => renderNode(child, i))}
        </Tag>
      );
    }

    case 'list': {
      const ListTag = node.listType === 'number' ? 'ol' : 'ul';
      const listClass =
        node.listType === 'number'
          ? 'list-decimal pl-6 mb-4 space-y-1'
          : 'list-disc pl-6 mb-4 space-y-1';
      return (
        <ListTag key={index} className={listClass}>
          {node.children?.map((child, i) => renderNode(child, i))}
        </ListTag>
      );
    }

    case 'listitem':
      return (
        <li key={index} className="text-gray-800 dark:text-gray-300">
          {node.children?.map((child, i) => renderNode(child, i))}
        </li>
      );

    case 'link':
    case 'autolink': {
      let href = '#';
      if (node.fields?.linkType === 'custom' && node.fields.url) {
        href = node.fields.url;
      } else if (node.fields?.linkType === 'internal' && node.fields.doc) {
        const doc = node.fields.doc;
        const slug = typeof doc.value === 'object' ? doc.value?.slug : null;
        if (doc.relationTo === 'pages' && slug) {
          href = `/pages/${slug}`;
        } else if (doc.relationTo === 'news' && slug) {
          href = `/nyheter/${slug}`;
        }
      }
      // Fallback: check node.url directly (some Lexical versions)
      if (href === '#' && node.url) {
        href = node.url;
      }
      const isExternal = href.startsWith('http') || node.fields?.newTab;
      return (
        <a
          key={index}
          href={href}
          className="text-blue-600 dark:text-blue-400 hover:underline"
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {node.children?.map((child, i) => renderNode(child, i))}
        </a>
      );
    }

    case 'quote':
      return (
        <blockquote
          key={index}
          className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-4 italic text-gray-600 dark:text-gray-400"
        >
          {node.children?.map((child, i) => renderNode(child, i))}
        </blockquote>
      );

    default:
      if (node.children) {
        return (
          <div key={index}>
            {node.children.map((child, i) => renderNode(child, i))}
          </div>
        );
      }
      return null;
  }
}

interface RichTextProps {
  content: LexicalContent | null | undefined;
  className?: string;
}

export function RichText({ content, className = '' }: RichTextProps) {
  if (!content?.root?.children) {
    return null;
  }

  return (
    <div className={`prose-rockaden ${className}`}>
      {content.root.children.map((node, index) => renderNode(node, index))}
    </div>
  );
}
