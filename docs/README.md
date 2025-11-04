# TSH Research Platform - Fix Documentation

This directory contains documentation for important fixes that may need to be reapplied after pulling from main or merging branches.

## Source Reference Fix Documentation

### Quick Access

| File | Purpose | When to Use |
|------|---------|-------------|
| **FIX_CHECKLIST.md** | Step-by-step checklist | When applying the fix manually |
| **QUICK_FIX_SOURCE_REFS.md** | 5-minute quick guide | When you know what to do, need quick reference |
| **SOURCE_REFERENCE_FIX.md** | Complete technical docs | When you need full understanding of the problem |
| **AI_AGENT_PROMPT_FOR_FIX.md** | AI agent instructions | When asking an AI to apply the fix |
| **MarkdownRenderer.FIXED.tsx** | Working file backup | For direct copy/paste restoration |

### The Problem

Source references (e.g., `[3]`, `[5]`, `[13]`) appear as separate bullet points instead of inline at the end of sentences. Tooltips don't show source information.

### The Solution

Use `html-react-parser` to parse HTML and replace source reference elements with Tooltip components without breaking HTML structure.

### Fastest Fix (2 minutes)

```bash
# Install dependency
pnpm add html-react-parser

# Copy fixed file
cp /workspaces/thesocialclub/docs/MarkdownRenderer.FIXED.tsx \
   /workspaces/thesocialclub/client/src/components/MarkdownRenderer.tsx

# Verify
npx playwright test tests/final-verification.spec.ts
```

Then hard refresh browser at http://localhost:3000/summary

### For AI Agents

Provide this prompt:

> "Apply the source reference fix documented in `/workspaces/thesocialclub/docs/AI_AGENT_PROMPT_FOR_FIX.md`. Follow the instructions in that file."

### Verification

After applying the fix:

1. ✅ Source refs appear inline: "travelers [3]." not "[3] ."
2. ✅ Tooltips show full source info on hover
3. ✅ Test passes: `npx playwright test tests/final-verification.spec.ts`

## File Descriptions

### Core Documentation

**SOURCE_REFERENCE_FIX.md** (Comprehensive)
- Detailed problem description with visual examples
- Root cause analysis explaining the split() issue
- Complete solution with full code
- Testing procedures
- Troubleshooting guide
- Performance and browser compatibility notes

**QUICK_FIX_SOURCE_REFS.md** (5-minute guide)
- Minimal steps to apply the fix
- Quick test verification
- Why it works (brief)

**FIX_CHECKLIST.md** (Interactive checklist)
- Pre-flight checks
- Step-by-step application with checkboxes
- Troubleshooting steps
- Success criteria
- Time estimates

**AI_AGENT_PROMPT_FOR_FIX.md** (AI agent context)
- Problem context for AI understanding
- Solution overview
- Documentation file references
- Ready-to-use prompt template

### Support Files

**MarkdownRenderer.FIXED.tsx** (Backup)
- Complete working version of the fixed file
- Can be copied directly to restore functionality
- Includes all necessary imports and logic

## Test Files

Located in `/workspaces/thesocialclub/tests/`:

- **final-verification.spec.ts** - Verifies source refs are inline AND tooltips work
- **debug-html.spec.ts** - Debug test to inspect HTML structure
- **source-refs-exact.spec.ts** - Detailed detection of positioning issues

## Development Workflow

### When to Apply This Fix

Apply this fix when you see source references appearing as separate bullets, which happens after:

1. Pulling latest from main branch
2. Merging branches that modify MarkdownRenderer.tsx
3. Resetting to a previous commit
4. Fresh clone of the repository

### Integration with Git

**Option 1: Manual reapplication** (recommended during development)
- Keep docs for reference
- Reapply fix when needed using checklist
- Maintains flexibility during active development

**Option 2: Branch protection** (for production)
- Keep fix in a protected branch
- Merge carefully
- Use tests to verify after any merge

### Testing Strategy

Always run verification after applying the fix:

```bash
# Quick smoke test (30 seconds)
# 1. Open http://localhost:3000/summary
# 2. Hard refresh (Ctrl+Shift+R)
# 3. Verify visually

# Full automated test (5 seconds)
npx playwright test tests/final-verification.spec.ts
```

## Technical Summary

### The Core Issue

**Problem:** Using `split()` on HTML string breaks the DOM structure.

**Example:**
```javascript
// BROKEN
const html = '<ul><li>Text [3].</li></ul>';
const parts = html.split(/\[(\d+)\]/);  // ['<ul><li>Text ', '3', '.</li></ul>']
// Result: Broken HTML when rendered separately
```

### The Solution

**Fix:** Use `html-react-parser` to preserve structure.

```javascript
// FIXED
const html = '<ul><li>Text <sup data-num="3">[3]</sup>.</li></ul>';
const parsed = parse(html, {
  replace: (node) => {
    if (node.name === 'sup') return <Tooltip>...</Tooltip>;
  }
});
// Result: Valid HTML with React tooltips
```

### Key Principles

1. **Process order matters**: Replace source refs → Process lists → Parse to React
2. **Non-breaking spaces**: Keeps source ref attached to preceding word
3. **No split()**: Preserves HTML structure integrity
4. **Selective replacement**: Only replace specific elements during parsing

## Additional Resources

### Related Files

- `/workspaces/thesocialclub/client/src/components/MarkdownRenderer.tsx` - Main file that needs fixing
- `/workspaces/thesocialclub/client/src/lib/sourceReferences.ts` - Source reference lookup
- `/workspaces/thesocialclub/client/public/data/*.md` - Markdown content with source refs

### Dependencies

- `html-react-parser@5.2.7` - HTML to React parser (added by this fix)
- `@radix-ui/react-tooltip` - Tooltip components (already in project)

## Maintenance

### Updating This Documentation

When updating the fix or documentation:

1. Update all relevant docs files consistently
2. Update the backup file (MarkdownRenderer.FIXED.tsx)
3. Update tests if behavior changes
4. Verify all links and file paths
5. Test the documented fix procedure

### Version History

- **2025-10-19**: Initial documentation created after solving the source reference positioning issue

## Contact / Issues

If this fix doesn't work or you encounter issues:

1. Check troubleshooting section in SOURCE_REFERENCE_FIX.md
2. Verify all files are up to date
3. Run full test suite
4. Check browser console for errors
5. Verify html-react-parser is installed

## License

Documentation follows the same license as the main project.
