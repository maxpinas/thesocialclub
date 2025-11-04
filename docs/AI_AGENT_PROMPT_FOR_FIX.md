# AI Agent Prompt: Source Reference Fix

## Context for AI Agent

Copy this entire section to provide context when asking an AI to reapply the source reference fix.

---

## The Problem

In the TSH Research Platform (The Social Club project), markdown source references like `[3]`, `[5]`, `[13]` are appearing as **separate bullet points on their own lines** instead of appearing inline at the end of their respective sentences/paragraphs. Additionally, the tooltips that should show the full source information when hovering are not working properly.

**Example of broken behavior:**
```
• The Global Student: seeking long-term accommodation with a vibrant social life and community

[5]
.

• The Digital Nomad: working remotely, valuing flexible accommodation

[5]
.
```

**Expected correct behavior:**
```
• The Global Student: seeking long-term accommodation with a vibrant social life and community [5].

• The Digital Nomad: working remotely, valuing flexible accommodation [5].
```

When hovering over `[5]`, a tooltip should appear showing the full source reference like: "Hospitality Net. (n.d.). The Social Hub. https://www.hospitalitynet.org/brand/23000663/the-social-hub.html"

## Root Cause

The issue is in `/workspaces/thesocialclub/client/src/components/MarkdownRenderer.tsx`.

The original implementation used `split()` to break the HTML string into parts and insert React components for source references. This **breaks the HTML structure** because it splits through the middle of HTML tags like `<ul>` and `<li>`, creating orphaned elements that the browser renders as separate list items.

## The Solution

Use the `html-react-parser` library to parse the HTML into React elements and selectively replace source reference `<sup>` elements with proper Tooltip components **without breaking the HTML structure**.

### Key Steps:

1. **Install dependency:**
   ```bash
   pnpm add html-react-parser
   ```

2. **Replace `/workspaces/thesocialclub/client/src/components/MarkdownRenderer.tsx`** with the fixed version.

   The complete working code is saved in:
   - `/workspaces/thesocialclub/docs/MarkdownRenderer.FIXED.tsx` (backup)
   - `/workspaces/thesocialclub/docs/SOURCE_REFERENCE_FIX.md` (full documentation with code)

3. **The critical changes are:**

   a. Import html-react-parser:
   ```typescript
   import parse, { Element } from 'html-react-parser';
   ```

   b. Replace source references BEFORE list processing (around line 68):
   ```typescript
   processed = processed.replace(/(\S)\s+\[(\d+)\]/g, (match, prevChar, sourceNum) => {
     return `${prevChar}<span style="white-space: nowrap;">&nbsp;<sup class="source-ref" data-source-num="${sourceNum}">[${sourceNum}]</sup></span>`;
   });
   ```

   c. Parse HTML and replace sup elements with Tooltip components (around line 137):
   ```typescript
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

   d. Render the parsed content (instead of using split):
   ```typescript
   return (
     <TooltipProvider>
       <div className="prose prose-neutral max-w-none">
         {parsedContent}
       </div>
     </TooltipProvider>
   );
   ```

## Testing & Verification

1. **Automated test:**
   ```bash
   npx playwright test tests/final-verification.spec.ts
   ```

   Should output:
   ```
   ✅ All source references are inline (not standalone)
   ✅ Tooltip for [3]: "The Social Hub. (n.d.)..."
   ✅ All tests passed
   ```

2. **Manual verification:**
   - Navigate to http://localhost:3000/summary
   - Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - Verify:
     - ✅ Source refs appear inline at end of sentences
     - ✅ Hovering shows tooltip with full source info
     - ❌ NO separate bullet points with just `[3]`

## Documentation Files

All documentation is in `/workspaces/thesocialclub/docs/`:

1. **`SOURCE_REFERENCE_FIX.md`** - Complete technical documentation with:
   - Detailed problem analysis
   - Root cause explanation
   - Full solution code
   - Testing procedures
   - Troubleshooting guide

2. **`QUICK_FIX_SOURCE_REFS.md`** - 5-minute quick reference guide

3. **`FIX_CHECKLIST.md`** - Step-by-step checklist for applying the fix

4. **`MarkdownRenderer.FIXED.tsx`** - Backup of the working file that can be copied directly

5. **`AI_AGENT_PROMPT_FOR_FIX.md`** - This file (context for AI agents)

## Quickest Fix Method

If you just want to apply the fix as fast as possible:

```bash
# 1. Install dependency
pnpm add html-react-parser

# 2. Copy the fixed version
cp /workspaces/thesocialclub/docs/MarkdownRenderer.FIXED.tsx /workspaces/thesocialclub/client/src/components/MarkdownRenderer.tsx

# 3. Verify in browser (hard refresh!)
# Navigate to http://localhost:3000/summary and press Ctrl+Shift+R
```

## Important Notes for AI Agents

- **Do NOT use split()** on the HTML string - it breaks the structure
- **Replace source references BEFORE list processing** - timing is critical
- **Use non-breaking spaces (`&nbsp;`)** - prevents line wrapping
- **Use html-react-parser** - preserves HTML structure while allowing React component insertion
- **Hard refresh is required** - browser cache will show old behavior

## Success Criteria

The fix is successful when:
1. ✅ All source references `[1]`, `[2]`, `[3]`, etc. appear inline with their text
2. ✅ NO source references appear as separate bullet points or lines
3. ✅ Hovering over any `[X]` shows a tooltip with the full source information
4. ✅ The Playwright test `tests/final-verification.spec.ts` passes

---

## Prompt to Use

When asking an AI agent to apply this fix, say:

> "Please apply the source reference fix for the TSH Research Platform. The fix is documented in `/workspaces/thesocialclub/docs/AI_AGENT_PROMPT_FOR_FIX.md`. Read that file for full context, then:
>
> 1. Install `html-react-parser` via pnpm
> 2. Replace `/workspaces/thesocialclub/client/src/components/MarkdownRenderer.tsx` with the version from `/workspaces/thesocialclub/docs/MarkdownRenderer.FIXED.tsx`
> 3. Run the verification test: `npx playwright test tests/final-verification.spec.ts`
> 4. Confirm all tests pass
>
> The fix addresses source references appearing as separate bullets instead of inline with their text, and ensures tooltips work properly."

