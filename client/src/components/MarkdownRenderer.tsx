import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { getSourceReference } from "@/lib/sourceReferences";

interface MarkdownRendererProps {
  content: string;
  brandId?: string;
}

export default function MarkdownRenderer({ content, brandId }: MarkdownRendererProps) {
  if (!content) return null;

  // Preprocess: merge standalone source references with previous line
  let processed = content.replace(/([^\n])\n+\[(\d+(?:,\s*\d+)*)\]\s*\.?\s*$/gm, '$1 [$2].');
  processed = processed.replace(/([^\n])\n+\[(\d+(?:,\s*\d+)*)\]\s*$/gm, '$1 [$2]');
  
  // CRITICAL: Merge source references that appear on their own line after list items
  const lines = processed.split('\n');
  const mergedLines: string[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    const nextLine = i + 1 < lines.length ? lines[i + 1] : '';
    
    // Check if next line is ONLY a source reference
    const sourceOnlyMatch = nextLine.trim().match(/^\[(\d+(?:,\s*\d+)*)\]\.?$/);
    
    if (sourceOnlyMatch && currentLine.trim()) {
      // Merge source reference with current line
      mergedLines.push(currentLine + ' ' + nextLine.trim());
      i++; // Skip the next line since we merged it
    } else {
      mergedLines.push(currentLine);
    }
  }
  
  processed = mergedLines.join('\n');

  // Process markdown to HTML

  // Headings (process from most specific to least specific)
  processed = processed.replace(/^#### (.+)$/gm, '<h4 class="text-lg font-bold mt-4 mb-2">$1</h4>');
  processed = processed.replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>');
  processed = processed.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>');
  processed = processed.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>');

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

  // Blockquotes
  processed = processed.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-[#76a9f9] pl-4 italic my-4">$1</blockquote>');

  // Horizontal rules
  processed = processed.replace(/^---$/gm, '<hr class="my-6 border-border" />');

  // Tables - convert markdown tables to HTML
  const tableRegex = /^\|(.+)\|\s*$\n^\|[-:\s|]+\|\s*$\n((?:^\|.+\|\s*$\n?)+)/gm;
  processed = processed.replace(tableRegex, (match) => {
    const rows = match.trim().split('\n');
    if (rows.length < 2) return match;
    
    // Parse header
    const headerCells = rows[0].split('|').filter(cell => cell.trim()).map(cell => cell.trim());
    
    // Parse body rows (skip separator row at index 1)
    const bodyRows = rows.slice(2).map(row => 
      row.split('|').filter(cell => cell.trim()).map(cell => cell.trim())
    );
    
    // Build HTML table
    let html = '<table class="min-w-full border-collapse my-6"><thead><tr>';
    headerCells.forEach(cell => {
      html += `<th class="border border-gray-300 px-4 py-2 bg-gray-100 font-bold text-left">${cell}</th>`;
    });
    html += '</tr></thead><tbody>';
    
    bodyRows.forEach(row => {
      html += '<tr>';
      row.forEach(cell => {
        html += `<td class="border border-gray-300 px-4 py-2">${cell}</td>`;
      });
      html += '</tr>';
    });
    
    html += '</tbody></table>';
    return html;
  });

  // Lists - unordered (handle both - and * prefixes)
  const listLines = processed.split('\n');
  let inList = false;
  let listItems: string[] = [];
  const processedLines: string[] = [];

  for (let i = 0; i < listLines.length; i++) {
    const line = listLines[i];
    // Match both - and * for unordered lists (including nested with spaces)
    const unorderedMatch = line.match(/^(\s*)[\-\*]\s+(.+)$/);
    const orderedMatch = line.match(/^(\s*)(\d+)\.\s+(.+)$/);

    if (unorderedMatch) {
      if (!inList) {
        inList = true;
        listItems = [];
      }
      const indent = unorderedMatch[1].length;
      const indentClass = indent > 0 ? 'ml-12' : 'ml-6';
      listItems.push(`<li class="${indentClass} mb-2 leading-relaxed">• ${unorderedMatch[2]}</li>`);
    } else if (orderedMatch) {
      if (!inList) {
        inList = true;
        listItems = [];
      }
      const indent = orderedMatch[1].length;
      const indentClass = indent > 0 ? 'ml-12' : 'ml-6';
      listItems.push(`<li class="${indentClass} mb-2 leading-relaxed">${orderedMatch[2]}. ${orderedMatch[3]}</li>`);
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

  // Merge standalone source references with previous paragraph before processing
  const blocks = processed.split('\n\n');
  const mergedBlocks: string[] = [];
  
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i].trim();
    // Check if this block is just a source reference
    if (/^__SOURCE_\d+__\.?$/.test(block)) {
      // Merge with previous block
      if (mergedBlocks.length > 0) {
        mergedBlocks[mergedBlocks.length - 1] += ' ' + block;
      } else {
        mergedBlocks.push(block);
      }
    } else {
      mergedBlocks.push(block);
    }
  }
  
  // Paragraphs - wrap non-tagged content
  processed = mergedBlocks
    .map(block => {
      if (
        block.trim() &&
        !block.startsWith('<h') &&
        !block.startsWith('<ul') &&
        !block.startsWith('<blockquote') &&
        !block.startsWith('<hr') &&
        !block.startsWith('<table')
      ) {
        return `<p class="mb-4 leading-relaxed">${block}</p>`;
      }
      return block;
    })
    .join('\n\n');

  // CRITICAL FIX: Wrap last 2-3 words + source reference in nowrap span
  // This prevents the source from breaking to a new line
  // Match: 1-3 words (including punctuation) followed by space and [number]
  processed = processed.replace(/(\S+(?:\s+\S+){0,2})\s+(\[\d+\])/g, '<span style="display: inline-block; white-space: nowrap;">$1&nbsp;$2</span>');

  // Replace source references with markers
  processed = processed.replace(/\[(\d+)\]/g, '__SOURCE_$1__');

  // Split by source markers and rebuild with React components
  const parts = processed.split(/(__SOURCE_\d+__)/);

  return (
    <TooltipProvider>
      <div className="prose prose-neutral max-w-none">
        {parts.map((part, idx) => {
          const sourceMatch = part.match(/__SOURCE_(\d+)__/);
          if (sourceMatch) {
            const sourceNum = parseInt(sourceMatch[1]);
            const sourceText = getSourceReference(sourceNum, brandId);
            return (
              <Tooltip key={idx}>
                <TooltipTrigger asChild>
                  <sup className="cursor-help text-[#76a9f9] hover:text-[#7cbd8e] transition-colors font-medium inline-block">
                    [{sourceNum}]
                  </sup>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">{sourceText}</p>
                </TooltipContent>
              </Tooltip>
            );
          }
          // Remove standalone source references that are on their own line
          const cleanedPart = part.replace(/^\s*<p[^>]*>\s*<\/p>\s*$/g, '');
          if (!cleanedPart.trim()) return null;
          return <span key={idx} dangerouslySetInnerHTML={{ __html: cleanedPart }} />;
        })}
      </div>
    </TooltipProvider>
  );
}

