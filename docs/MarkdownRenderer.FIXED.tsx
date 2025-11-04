import parse, { DOMNode, Element, domToReact } from 'html-react-parser';
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

  // Headings
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

  // CRITICAL FIX: Replace source references with non-breaking space + marked sup element BEFORE list processing
  // This prevents them from being split across elements
  processed = processed.replace(/(\S)\s+\[(\d+)\]/g, (match, prevChar, sourceNum) => {
    return `${prevChar}<span style="white-space: nowrap;">&nbsp;<sup class="source-ref" data-source-num="${sourceNum}">[${sourceNum}]</sup></span>`;
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

  // Paragraphs - wrap non-tagged content
  const blocks = processed.split('\n\n');
  processed = blocks
    .map(block => {
      const trimmed = block.trim();
      if (
        trimmed &&
        !trimmed.startsWith('<h') &&
        !trimmed.startsWith('<ul') &&
        !trimmed.startsWith('<blockquote') &&
        !trimmed.startsWith('<hr')
      ) {
        return `<p class="mb-4 leading-relaxed">${trimmed}</p>`;
      }
      return trimmed;
    })
    .filter(block => block)
    .join('\n\n');

  // Parse HTML and replace source reference sup elements with Tooltip components
  const parsedContent = parse(processed, {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.name === 'sup' && domNode.attribs?.class?.includes('source-ref')) {
        const sourceNum = parseInt(domNode.attribs['data-source-num']);
        const sourceText = getSourceReference(sourceNum, brandId);

        return (
          <Tooltip key={`tooltip-${sourceNum}`}>
            <TooltipTrigger asChild>
              <sup className="cursor-help text-[#76a9f9] hover:text-[#7cbd8e] transition-colors font-medium inline-block" style={{whiteSpace: 'nowrap'}}>
                [{sourceNum}]
              </sup>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">{sourceText}</p>
            </TooltipContent>
          </Tooltip>
        );
      }
    }
  });

  return (
    <TooltipProvider>
      <div className="prose prose-neutral max-w-none">
        {parsedContent}
      </div>
    </TooltipProvider>
  );
}
