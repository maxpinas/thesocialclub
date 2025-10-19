# TSH Research Platform - Source Reference Fix Deployment

**Date:** October 19, 2025  
**Issue:** Source references (like [11], [12], etc.) were appearing on separate lines instead of inline with text  
**Status:** ✅ FIXED AND DEPLOYED

---

## Problem Description

Source references were breaking to new lines, especially in list items:

**Before:**
```
• Maastricht: €1,200/month for a room with 8 shared kitchen
[11]
```

**After:**
```
• Maastricht: €1,200/month for a room with 8 shared kitchen [11]
```

---

## Solution

Modified `client/src/components/MarkdownRenderer.tsx` to wrap the last 2-3 words before each source reference together with the reference in a non-breaking span:

```javascript
// Wrap last 2-3 words + source reference in nowrap span
processed = processed.replace(/(\S+(?:\s+\S+){0,2})\s+(\[\d+\])/g, 
  '<span style="display: inline-block; white-space: nowrap;">$1&nbsp;$2</span>');
```

This creates a non-breaking unit that prevents the browser from breaking the line between text and source references.

---

## Deployment Steps

1. ✅ Fixed `MarkdownRenderer.tsx` component
2. ✅ Tested locally on development server (port 3002)
3. ✅ Committed to GitHub: https://github.com/maxpinas/thesocialclub
4. ✅ Built production bundle: `pnpm run build`
5. ✅ Created backup of live site on VPS
6. ✅ Uploaded new build to VPS at 185.108.115.198
7. ✅ Deployed to `/var/www/tsh-research/`
8. ✅ Reloaded Nginx configuration
9. ✅ Verified fix on live site: https://tsh.studiohyra.nl

---

## Verification

Tested on multiple pages:
- ✅ The Social Hub brand page - all [11] references inline
- ✅ CitizenM brand page - all references inline
- ✅ List items with nested indentation - working correctly
- ✅ Paragraph text with references - working correctly

---

## Technical Details

**Repository:** https://github.com/maxpinas/thesocialclub  
**Branch:** main  
**Commit:** e974275 - "Fix source reference line breaks - wrap last 2-3 words with reference in nowrap span"

**Live Site:** https://tsh.studiohyra.nl  
**VPS:** 185.108.115.198  
**User:** maxpinas  
**Path:** /var/www/tsh-research/

**Files Modified:**
- `client/src/components/MarkdownRenderer.tsx` - Main fix
- `client/src/index.css` - Minor CSS updates

---

## Rollback Instructions

If needed, restore from backup:

```bash
ssh maxpinas@185.108.115.198
cd ~
# Find the backup file
ls -lh tsh-research-backup-*.tar.gz
# Extract and restore
sudo tar -xzf tsh-research-backup-YYYYMMDD-HHMMSS.tar.gz -C /var/www/
sudo systemctl reload nginx
```

---

## Notes

- The fix wraps 2-3 words before each reference to ensure they stay together
- Uses inline styles (`display: inline-block; white-space: nowrap`) for maximum compatibility
- No breaking changes to other functionality
- All source reference tooltips still work correctly
- Site performance unchanged

---

**Deployed by:** Manus AI Agent  
**Verified by:** Manual testing on live site  
**Status:** Production deployment successful ✅

