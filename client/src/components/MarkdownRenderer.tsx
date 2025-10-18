import { useEffect, useState } from "react";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    if (!content) {
      setHtml("");
      return;
    }

    let processed = content;
    
    // Escape HTML first
    processed = processed.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // Code blocks (before other processing)
    processed = processed.replace(/```([^`]+)```/g, '<pre class="bg-muted p-4 rounded-lg my-4 overflow-x-auto"><code>$1</code></pre>');
    
    // Inline code
    processed = processed.replace(/`([^`]+)`/g, '<code class="bg-muted px-2 py-1 rounded text-sm">$1</code>');
    
    // Headers (must be done in order from most specific to least)
    processed = processed.replace(/^#### (.+)$/gm, '<h4 class="text-lg font-bold mt-5 mb-2">$1</h4>');
    processed = processed.replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>');
    processed = processed.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-8 mb-4 border-b border-border pb-2">$1</h2>');
    processed = processed.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-10 mb-5">$1</h1>');
    
    // Bold (must be before italic)
    processed = processed.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>');
    
    // Italic
    processed = processed.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
    
    // Links - external open in new window
    processed = processed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
      if (url.startsWith('http')) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-[#76a9f9] hover:underline">${text}</a>`;
      }
      return `<a href="${url}" class="text-[#76a9f9] hover:underline">${text}</a>`;
    });
    
    // Source references [1], [2] etc - convert to superscript with tooltip styling
    processed = processed.replace(/\[(\d+)\]/g, '<sup class="cursor-help text-[#76a9f9] hover:text-[#7cbd8e] transition-colors ml-0.5" title="See sources at bottom">[$1]</sup>');
    
    // Blockquotes
    processed = processed.replace(/^&gt; (.+)$/gm, '<blockquote class="border-l-4 border-[#76a9f9] pl-4 italic my-4">$1</blockquote>');
    
    // Horizontal rules
    processed = processed.replace(/^---$/gm, '<hr class="my-6 border-border" />');
    
    // Lists - unordered (handle both - and * prefixes)
    const lines = processed.split('\n');
    let inList = false;
    let listItems: string[] = [];
    const processedLines: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Match both - and * for unordered lists
      const unorderedMatch = line.match(/^[\-\*]\s+(.+)$/);
      const orderedMatch = line.match(/^(\d+)\.\s+(.+)$/);
      
      if (unorderedMatch) {
        if (!inList) {
          inList = true;
          listItems = [];
        }
        listItems.push(`<li class="ml-6 mb-2 leading-relaxed">• ${unorderedMatch[1]}</li>`);
      } else if (orderedMatch) {
        if (!inList) {
          inList = true;
          listItems = [];
        }
        listItems.push(`<li class="ml-6 mb-2 leading-relaxed">${orderedMatch[1]}. ${orderedMatch[2]}</li>`);
      } else {
        if (inList) {
          processedLines.push('<ul class="my-4 space-y-1">' + listItems.join('') + '</ul>');
          listItems = [];
          inList = false;
        }
        processedLines.push(line);
      }
    }
    
    // Close any remaining list
    if (inList) {
      processedLines.push('<ul class="my-4 space-y-1">' + listItems.join('') + '</ul>');
    }
    
    processed = processedLines.join('\n');
    
    // Paragraphs - wrap non-tagged content
    const paragraphs = processed.split('\n\n');
    processed = paragraphs.map(para => {
      para = para.trim();
      if (!para) return '';
      // Don't wrap if already has HTML tags
      if (para.match(/^<(h[1-6]|ul|ol|li|blockquote|pre|hr|div)/)) {
        return para;
      }
      return `<p class="mb-4 leading-relaxed">${para}</p>`;
    }).join('\n');
    
    // Clean up multiple spaces
    processed = processed.replace(/  +/g, ' ');
    
    setHtml(processed);
  }, [content]);

  return (
    <div 
      className="prose prose-slate max-w-none text-foreground"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

