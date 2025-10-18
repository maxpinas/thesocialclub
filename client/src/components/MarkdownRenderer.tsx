import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { getSourceReference } from "@/lib/sourceReferences";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  // Process markdown to HTML
  let processed = content;

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
  processed = processed
    .split('\n\n')
    .map(block => {
      if (
        block.trim() &&
        !block.startsWith('<h') &&
        !block.startsWith('<ul') &&
        !block.startsWith('<blockquote') &&
        !block.startsWith('<hr')
      ) {
        return `<p class="mb-4 leading-relaxed">${block}</p>`;
      }
      return block;
    })
    .join('\n\n');

  // Extract source references and replace with placeholders
  const sourceMatches: Array<{ index: number; number: number }> = [];
  const sourceRegex = /\[(\d+)\]/g;
  let match;
  while ((match = sourceRegex.exec(processed)) !== null) {
    sourceMatches.push({ index: match.index, number: parseInt(match[1]) });
  }

  // Replace source references with unique markers
  processed = processed.replace(/\[(\d+)\]/g, (_, num) => `__SOURCE_${num}__`);

  // Split by source markers and rebuild with React components
  const parts = processed.split(/(__SOURCE_\d+__)/);

  return (
    <TooltipProvider>
      <div className="prose prose-neutral max-w-none">
        {parts.map((part, idx) => {
          const sourceMatch = part.match(/__SOURCE_(\d+)__/);
          if (sourceMatch) {
            const sourceNum = parseInt(sourceMatch[1]);
            const sourceText = getSourceReference(sourceNum);
            return (
              <Tooltip key={idx}>
                <TooltipTrigger asChild>
                  <sup className="cursor-help text-[#76a9f9] hover:text-[#7cbd8e] transition-colors ml-0.5 font-medium">
                    [{sourceNum}]
                  </sup>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">{sourceText}</p>
                </TooltipContent>
              </Tooltip>
            );
          }
          return <span key={idx} dangerouslySetInnerHTML={{ __html: part }} />;
        })}
      </div>
    </TooltipProvider>
  );
}

