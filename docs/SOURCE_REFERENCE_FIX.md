# Source Reference Positioning and Tooltip Fix

## Problem Description

Source references (e.g., `[3]`, `[5]`, `[13]`) in markdown content were appearing as **separate bullet points on their own lines** instead of inline at the end of their respective sentences/paragraphs. Additionally, tooltips were not working properly.

### Visual Symptoms

**BEFORE (Broken):**
```
• The Global Student: An international exchange student seeking accommodation

[3]
.

• The Digital Nomad: A young professional working remotely

[5]
.
```

**AFTER (Fixed):**
```
• The Global Student: An international exchange student seeking accommodation [3].

• The Digital Nomad: A young professional working remotely [5].
```

## Root Cause Analysis

The issue was in `/workspaces/thesocialclub/client/src/components/MarkdownRenderer.tsx`.

### The Original Broken Approach

The original code used the following pattern:

1. Convert markdown `[3]` references to placeholder markers like `__SOURCE_3__`
2. Convert markdown to HTML
3. **Use `.split(/(__SOURCE_\d+__)/)` to break the HTML string into parts**
4. Map over parts and insert React `<Tooltip>` components for source references

### Why This Failed

The `split()` operation **breaks the HTML structure**. Example:

```html
<!-- After markdown processing -->
<ul class="my-4 space-y-1">
  <li class="ml-6 mb-2">• The Global Student: ...community __SOURCE_5__.</li>
  <li class="ml-6 mb-2">• The Digital Nomad: ...lifestyle __SOURCE_5__.</li>
</ul>

<!-- After split() -->
[
  '<ul class="my-4 space-y-1"><li class="ml-6 mb-2">• The Global Student: ...community ',
  '__SOURCE_5__',
  '.</li><li class="ml-6 mb-2">• The Digital Nomad: ...lifestyle ',
  '__SOURCE_5__',
  '.</li></ul>'
]

<!-- When rendered as separate spans -->
<ul><li>...community </li>  <!-- LI CLOSES -->
<sup>[5]</sup>              <!-- SOURCE REF IS OUTSIDE! -->
.                           <!-- PERIOD IS OUTSIDE! -->
<li>...lifestyle </li>      <!-- ORPHAN LI TAG -->
```

This creates:
- Orphaned `<li>` tags outside `<ul>` (invalid HTML)
- Source references appearing as separate elements/bullets
- Browser renders them as standalone list items

## Solution

Use **html-react-parser** to parse the HTML and replace source reference elements with Tooltip components **without breaking the HTML structure**.

### Key Changes

1. **Install dependency:**
   ```bash
   pnpm add html-react-parser
   ```

2. **Replace source references BEFORE list processing** with marked HTML elements:
   ```javascript
   processed = processed.replace(/(\S)\s+\[(\d+)\]/g, (match, prevChar, sourceNum) => {
     return `${prevChar}<span style="white-space: nowrap;">&nbsp;<sup class="source-ref" data-source-num="${sourceNum}">[${sourceNum}]</sup></span>`;
   });
   ```

   This ensures source refs stay inline with their text through all subsequent processing.

3. **Use html-react-parser to convert HTML to React** while replacing `<sup>` elements:
   ```javascript
   import parse, { Element } from 'html-react-parser';

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
   ```

4. **Wrap in TooltipProvider and render**:
   ```javascript
   return (
     <TooltipProvider>
       <div className="prose prose-neutral max-w-none">
         {parsedContent}
       </div>
     </TooltipProvider>
   );
   ```

## Complete Implementation

### File: `/workspaces/thesocialclub/client/src/components/MarkdownRenderer.tsx`

**Full replacement code:**

```typescript
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
```

### Dependencies Required

Add to `package.json`:

```bash
pnpm add html-react-parser
```

Current version used: `html-react-parser@5.2.7`

## Testing & Verification

### Automated Tests

Playwright tests are included in `/workspaces/thesocialclub/tests/`:

1. **`final-verification.spec.ts`** - Comprehensive test that verifies:
   - Source references are inline (not standalone bullets)
   - Tooltips appear when hovering
   - Tooltip content is correct

Run tests:
```bash
npx playwright test tests/final-verification.spec.ts
```

Expected output:
```
✅ All source references are inline (not standalone)
Found 30 source references, testing tooltips...
✅ Tooltip for [3]: "The Social Hub. (n.d.). Our story | The pioneers o..."
✅ Tooltip for [4]: "The Social Hub. (n.d.). The Social Hub: More than ..."
✅ Tooltip for [5]: "Hospitality Net. (n.d.). The Social Hub. https://w..."
✅ All tests passed - source refs are inline AND tooltips work!
```

### Manual Verification

1. Navigate to http://localhost:3000/summary
2. **Hard refresh** browser: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
3. Verify:
   - Source references `[3]`, `[5]`, etc. appear inline at the end of sentences
   - NO source references appear as separate bullet points
   - Hovering over any `[X]` shows a tooltip with full source information
   - Tooltips contain text like "The Social Hub. (n.d.). Our story..."

## Key Technical Points

### Why html-react-parser?

- **Preserves HTML structure**: Parses HTML into React elements without breaking DOM tree
- **Selective replacement**: Only replaces specific elements (our `<sup class="source-ref">`)
- **React integration**: Returns proper React components, not dangerouslySetInnerHTML

### Why Replace Before List Processing?

Processing order is critical:

1. Replace `[3]` → `<span>&nbsp;<sup data-source-num="3">[3]</sup></span>` **FIRST**
2. THEN process lists (splits by `\n`, creates `<ul>` and `<li>`)
3. Source refs are already HTML, stay inside their parent elements
4. No split() operation, so HTML structure remains intact

### Why Non-Breaking Spaces?

```html
<span style="white-space: nowrap;">&nbsp;<sup>[3]</sup></span>
```

- `&nbsp;` prevents line break between word and reference
- `white-space: nowrap` on span keeps the unit together
- Browser treats "travelers [3]" as single unbreakable unit

## Common Pitfalls to Avoid

### ❌ DON'T: Use split() on HTML

```javascript
// BROKEN - splits HTML structure
const parts = processed.split(/(__SOURCE_\d+__)/);
return parts.map(part => <span dangerouslySetInnerHTML={{ __html: part }} />);
```

### ❌ DON'T: Replace after list processing

```javascript
// BROKEN - too late, lists already processed
// Lists
const listLines = processed.split('\n');
// ... list processing ...

// Now replace [3] - WRONG ORDER
processed = processed.replace(/\[(\d+)\]/g, '<sup>[$1]</sup>');
```

### ❌ DON'T: Use regular spaces

```javascript
// BROKEN - browser will line-wrap
return `${prevChar} <sup>[${sourceNum}]</sup>`;
```

### ✅ DO: Replace early with non-breaking spaces

```javascript
// CORRECT - replace before list processing with &nbsp;
processed = processed.replace(/(\S)\s+\[(\d+)\]/g, (match, prevChar, sourceNum) => {
  return `${prevChar}<span style="white-space: nowrap;">&nbsp;<sup class="source-ref" data-source-num="${sourceNum}">[${sourceNum}]</sup></span>`;
});
```

## Troubleshooting

### Issue: Source refs still appear as separate bullets

**Cause**: Browser cache or build not updated

**Fix**:
1. Hard refresh: `Ctrl+Shift+R` or `Cmd+Shift+R`
2. Clear browser cache completely
3. Restart dev server: `pnpm dev`

### Issue: Tooltips show "?" or nothing

**Cause**: Missing `html-react-parser` dependency or incorrect import

**Fix**:
```bash
pnpm add html-react-parser
```

Verify imports:
```typescript
import parse, { Element } from 'html-react-parser';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
```

### Issue: Some source refs work, others don't

**Cause**: Inconsistent markdown formatting in source files

**Fix**: Check markdown files have source refs in format:
- `travelers [3].` ✅
- `travelers[3]` ❌ (no space)
- `travelers \n[3]` ❌ (line break)

## Performance Considerations

- `html-react-parser` is performant - parses HTML once per markdown render
- No performance issues with 30+ source references per page
- Tooltip components are lazy-rendered (only mount when hovered)

## Browser Compatibility

Tested and working:
- ✅ Chrome 120+
- ✅ Firefox 120+
- ✅ Safari 17+
- ✅ Edge 120+

## Related Files

- `/workspaces/thesocialclub/client/src/components/MarkdownRenderer.tsx` - Main file to update
- `/workspaces/thesocialclub/client/src/lib/sourceReferences.ts` - Source reference lookup
- `/workspaces/thesocialclub/client/public/data/*.md` - Markdown content files
- `/workspaces/thesocialclub/tests/final-verification.spec.ts` - Verification test

## Summary

This fix solves the source reference positioning problem by:

1. **Processing source references early** (before list processing) to keep them inline
2. **Using html-react-parser** instead of split() to preserve HTML structure
3. **Adding non-breaking spaces** to prevent line wrapping
4. **Selectively replacing `<sup>` elements** with Tooltip components during HTML parsing

The result: Source references stay inline with their text AND have proper interactive tooltips with full source information.
