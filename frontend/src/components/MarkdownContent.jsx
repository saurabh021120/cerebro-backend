import React from 'react';
import { formatMarkdown } from '../lib/markdownFormatter';
import '../styles/markdown.css';

/**
 * MarkdownContent Component
 * Renders markdown-formatted text with proper styling
 * 
 * @param {Object} props
 * @param {string} props.content - The markdown content to render
 * @param {string} props.className - Additional CSS classes
 */
export default function MarkdownContent({ content, className = '' }) {
  const htmlContent = formatMarkdown(content);
  
  return (
    <div 
      className={`markdown-content ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
