/**
 * Markdown Formatter Utility
 * Converts markdown-style text to formatted HTML
 */

/**
 * Parses markdown text and converts it to structured HTML
 * Supports:
 * - Headers (###, ##, #)
 * - Bold text (**text**)
 * - Italic text (*text*)
 * - Unordered lists (- item or * item)
 * - Code blocks (```language ... ```)
 * - Inline code (`code`)
 * - Links ([text](url))
 * - Blockquotes (> text)
 * 
 * @param {string} text - The markdown text to format
 * @returns {string} - HTML string
 */
export function formatMarkdown(text) {
  if (!text) return '';
  
  let html = '';
  const lines = text.split('\n');
  let inCodeBlock = false;
  let codeBlockContent = [];
  let codeBlockLanguage = '';
  let inList = false;
  let listItems = [];
  
  const processInlineFormatting = (line) => {
    // Process inline code first (to avoid conflicts with bold/italic)
    line = line.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
    
    // Process links [text](url)
    line = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="markdown-link">$1</a>');
    
    // Process bold **text**
    line = line.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold">$1</strong>');
    
    // Process italic *text* (but not ** which is already processed)
    line = line.replace(/(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g, '<em class="italic">$1</em>');
    
    return line;
  };
  
  const flushList = () => {
    if (listItems.length > 0) {
      html += '<ul class="markdown-list">\n';
      listItems.forEach(item => {
        html += `  <li class="markdown-list-item">${processInlineFormatting(item)}</li>\n`;
      });
      html += '</ul>\n';
      listItems = [];
      inList = false;
    }
  };
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Handle code blocks
    if (line.trim().startsWith('```')) {
      if (!inCodeBlock) {
        flushList();
        inCodeBlock = true;
        codeBlockLanguage = line.trim().substring(3).trim();
        codeBlockContent = [];
      } else {
        // End code block
        html += `<pre class="markdown-code-block"><code class="language-${codeBlockLanguage}">${codeBlockContent.join('\n')}</code></pre>\n`;
        inCodeBlock = false;
        codeBlockContent = [];
        codeBlockLanguage = '';
      }
      continue;
    }
    
    if (inCodeBlock) {
      codeBlockContent.push(escapeHtml(line));
      continue;
    }
    
    // Empty line
    if (line.trim() === '') {
      flushList();
      html += '<br/>\n';
      continue;
    }
    
    // Headers
    if (line.startsWith('### ')) {
      flushList();
      html += `<h3 class="markdown-h3">${processInlineFormatting(line.substring(4))}</h3>\n`;
      continue;
    }
    if (line.startsWith('## ')) {
      flushList();
      html += `<h2 class="markdown-h2">${processInlineFormatting(line.substring(3))}</h2>\n`;
      continue;
    }
    if (line.startsWith('# ')) {
      flushList();
      html += `<h1 class="markdown-h1">${processInlineFormatting(line.substring(2))}</h1>\n`;
      continue;
    }
    
    // Blockquotes
    if (line.trim().startsWith('> ')) {
      flushList();
      html += `<blockquote class="markdown-blockquote">${processInlineFormatting(line.substring(2))}</blockquote>\n`;
      continue;
    }
    
    // Lists (unordered)
    if (line.trim().match(/^[\*\-]\s+/)) {
      const content = line.trim().substring(2);
      listItems.push(content);
      inList = true;
      continue;
    }
    
    // Regular paragraph
    flushList();
    html += `<p class="markdown-paragraph">${processInlineFormatting(line)}</p>\n`;
  }
  
  // Flush any remaining list
  flushList();
  
  return html;
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

export function stripMarkdown(text) {
  if (!text) return '';
  
  return text
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`([^`]+)`/g, '$1') // Remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic
    .replace(/^#{1,6}\s+/gm, '') // Remove headers
    .replace(/^>\s+/gm, '') // Remove blockquotes
    .replace(/^[\*\-]\s+/gm, '') // Remove list markers
    .trim();
}
