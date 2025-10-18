import { useEffect, useState } from "react";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    // Simple markdown to HTML conversion
    let processed = content;
    
    // Headers
    processed = processed.replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>');
    processed = processed.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-8 mb-4 border-b border-border pb-2">$1</h2>');
    processed = processed.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-10 mb-5">$1</h1>');
    
    // Bold
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
    
    // Lists
    processed = processed.replace(/^- (.+)$/gm, '<li class="ml-4">• $1</li>');
    processed = processed.replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4">$1. $2</li>');
    
    // Paragraphs
    processed = processed.replace(/\n\n/g, '</p><p class="mt-4">');
    processed = '<p>' + processed + '</p>';
    
    // Tables (basic support)
    processed = processed.replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(c => c.trim());
      return '<tr>' + cells.map(c => `<td class="border border-border px-3 py-2">${c.trim()}</td>`).join('') + '</tr>';
    });
    
    setHtml(processed);
  }, [content]);

  return (
    <div 
      className="prose prose-slate max-w-none text-muted-foreground leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

