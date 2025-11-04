# Source Reference Fix - Application Checklist

Use this checklist when re-applying the fix after pulling from main.

## Pre-Flight Check
- [ ] Dev server is running (`pnpm dev`)
- [ ] You can navigate to http://localhost:3000/summary
- [ ] You can see the broken behavior (source refs as separate bullets)

## Fix Steps

### 1. Install Dependencies
```bash
cd /workspaces/thesocialclub
pnpm add html-react-parser
```
- [ ] Dependency installed successfully

### 2. Replace MarkdownRenderer.tsx

**Option A - Copy from backup:**
```bash
cp /workspaces/thesocialclub/docs/MarkdownRenderer.FIXED.tsx /workspaces/thesocialclub/client/src/components/MarkdownRenderer.tsx
```

**Option B - Manual replacement:**
Open `/workspaces/thesocialclub/docs/SOURCE_REFERENCE_FIX.md` and copy the complete implementation section into `/workspaces/thesocialclub/client/src/components/MarkdownRenderer.tsx`

- [ ] File replaced

### 3. Verify Fix in Browser

1. Open http://localhost:3000/summary
2. **Hard refresh**: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
3. Verify:

- [ ] Source refs `[3]`, `[4]`, `[5]` appear inline with text
- [ ] NO source refs appear as separate bullets
- [ ] Hovering over `[3]` shows tooltip with full source info
- [ ] Tooltip shows text like "The Social Hub. (n.d.). Our story..."

### 4. Run Automated Tests (Optional)

```bash
npx playwright test tests/final-verification.spec.ts
```

Expected output:
```
✅ All source references are inline (not standalone)
Found 30 source references, testing tooltips...
✅ Tooltip for [3]: "The Social Hub. (n.d.). Our story..."
✅ All tests passed
```

- [ ] Tests pass

## Troubleshooting

### Source refs still appear as separate bullets
- [ ] Hard refresh browser (`Ctrl+Shift+R`)
- [ ] Clear browser cache completely
- [ ] Check Vite recompiled (watch terminal output)
- [ ] Restart dev server

### Tooltips don't work
- [ ] Verify `html-react-parser` is installed: `pnpm list html-react-parser`
- [ ] Check imports in MarkdownRenderer.tsx include `parse, { Element }`
- [ ] Hard refresh browser

### TypeScript errors
- [ ] Run: `pnpm check`
- [ ] If errors in MarkdownRenderer.tsx, ensure all imports are correct
- [ ] Verify Element type is imported: `import parse, { Element } from 'html-react-parser';`

## Success Criteria

All must be ✅:
- [ ] Source references appear inline at end of sentences/bullets
- [ ] NO source references appear as standalone list items
- [ ] Tooltips show full source information on hover
- [ ] No console errors in browser DevTools
- [ ] Playwright test passes (if run)

## Time Estimate
- First time: ~10 minutes (reading docs + applying)
- Subsequent times: ~2 minutes (just copy + verify)

## Documentation References
- Full details: `/workspaces/thesocialclub/docs/SOURCE_REFERENCE_FIX.md`
- Quick guide: `/workspaces/thesocialclub/docs/QUICK_FIX_SOURCE_REFS.md`
- Backup file: `/workspaces/thesocialclub/docs/MarkdownRenderer.FIXED.tsx`
