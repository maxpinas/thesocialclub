# Quick Fix: Source References (5 Minute Guide)

## Problem
Source references `[3]`, `[5]`, etc. appear as separate bullet points instead of inline.

## Solution (2 Steps)

### Step 1: Install Dependency
```bash
pnpm add html-react-parser
```

### Step 2: Replace MarkdownRenderer.tsx

Replace entire contents of `/workspaces/thesocialclub/client/src/components/MarkdownRenderer.tsx` with the version from this commit or from `/workspaces/thesocialclub/docs/SOURCE_REFERENCE_FIX.md`.

**Key changes:**
- Import: `import parse, { Element } from 'html-react-parser';`
- Replace source refs BEFORE list processing (line ~68)
- Use `parse()` with replace callback instead of `split()` (line ~137)
- Render with `{parsedContent}` not `dangerouslySetInnerHTML`

## Test
```bash
npx playwright test tests/final-verification.spec.ts
```

Should show:
```
✅ All source references are inline (not standalone)
✅ Tooltip for [3]: "The Social Hub. (n.d.)..."
✅ All tests passed
```

## Verify Manually
1. Go to http://localhost:3000/summary
2. Hard refresh: `Ctrl+Shift+R`
3. Check:
   - ✅ `[3]`, `[5]` appear inline at end of sentences
   - ✅ Hovering shows tooltip with source info
   - ❌ NO separate bullet points with just `[3]`

## Why This Works

**Old approach (BROKEN):**
```javascript
processed.split(/(__SOURCE_\d+__)/)  // ❌ Breaks HTML structure
```

**New approach (FIXED):**
```javascript
// 1. Replace early with marked elements
processed.replace(/\[(\d+)\]/g, '<sup class="source-ref" data-source-num="$1">[$1]</sup>')

// 2. Parse and replace with React components
parse(processed, {
  replace: (node) => {
    if (node.name === 'sup' && node.class === 'source-ref') {
      return <Tooltip>...</Tooltip>  // ✅ Preserves structure
    }
  }
})
```

## Full Documentation
See: `/workspaces/thesocialclub/docs/SOURCE_REFERENCE_FIX.md`
