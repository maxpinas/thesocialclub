# TSH Research Website - Comprehensive Update Plan

## Executive Overview

**Goal:** Update the entire TSH research website with robust, data-driven insights based on ~8,000-9,000 actual reviews and comments.

**Current Data:**
- Google Maps (Apify): **5,969 reviews** across 8 brands
- Parallel research (in progress): **~2,000-3,000 additional data points** from Reddit, Instagram, TikTok, Facebook, X, Booking.com, TripAdvisor
- **Total: ~8,000-9,000 data points**

**Problem to Solve:**
- Current site has weak evidence (n=2, n=8) that doesn't feel credible
- "10,000+ reviews analyzed" claim is misleading
- Need to rebuild from foundation with proper aggregation and honest numbers

---

## Phase 1: Data Foundation & Analysis
**Priority: CRITICAL** | **Estimated Time: 4-6 hours**

### 1.1 Process Google Maps Reviews (Apify Data)
- [ ] Load all 8 CSV files into structured format
- [ ] Extract and categorize mentions by theme:
  - Service quality
  - Room/accommodation quality
  - Pricing and value perception
  - Amenities (WiFi, gym, coworking, F&B)
  - Location and accessibility
  - Community and social atmosphere
  - Cleanliness
  - Noise levels
  - Staff friendliness
  - Membership benefits (where applicable)
- [ ] Count mentions per theme per brand (n=X)
- [ ] Extract representative quotes for each theme
- [ ] Identify location-specific patterns
- [ ] Calculate sentiment distribution (positive/neutral/negative) per brand
- [ ] Extract demographic signals (age, profession, travel purpose) where mentioned

**Deliverable:** Structured analysis files for each brand with aggregated themes and counts

### 1.2 Integrate Parallel Research Data
- [ ] Wait for parallel research subtasks to complete
- [ ] Extract data from Reddit, Instagram, TikTok, Facebook, X, Booking.com, TripAdvisor
- [ ] Merge with Google Maps data
- [ ] Re-aggregate counts across all platforms
- [ ] Identify cross-platform patterns

**Deliverable:** Combined dataset with platform breakdown

### 1.3 Persona Validation & Refinement
- [ ] Map reviews to the 5 existing personas:
  - Local Professional
  - Digital Nomad
  - Business Traveler
  - Wellness Enthusiast
  - Hybrid Worker
- [ ] Count persona signals in reviews (e.g., "working remotely", "business trip", "wellness retreat")
- [ ] Validate persona characteristics with actual review data
- [ ] Identify new persona signals not previously captured
- [ ] Calculate persona distribution across brands

**Deliverable:** Persona validation matrix with robust N values

---

## Phase 2: Content Updates - Brand Pages
**Priority: HIGH** | **Estimated Time: 3-4 hours**

### 2.1 Update Individual Brand Analysis Pages
For each of the 8 brands:

- [ ] **Pricing Analysis Section**
  - Update with actual pricing mentions from reviews (n=X)
  - Add value perception insights with counts
  - Include specific examples and quotes

- [ ] **Amenities & Facilities Section**
  - Update WiFi quality mentions (n=X instead of n=2)
  - Update gym/fitness mentions
  - Update coworking space feedback
  - Update F&B quality feedback
  - All with proper counts and examples

- [ ] **Service Quality Section**
  - Aggregate staff friendliness mentions (n=X)
  - Service consistency feedback
  - Check-in/check-out experience
  - With counts and representative quotes

- [ ] **Guest Satisfaction Section**
  - Update with sentiment distribution percentages
  - Add top positive themes with counts
  - Add top negative themes with counts
  - Include rating distribution from Google Maps data

- [ ] **Membership Model Section** (where applicable)
  - Update membership pricing mentions
  - Member benefits feedback
  - Value perception of membership
  - With actual counts

**Deliverable:** 8 updated brand analysis markdown files

### 2.2 Update Competitive Overview Page
- [ ] Recalculate membership pricing comparison table with new data
- [ ] Update competitive benchmarks (TripAdvisor ratings, member counts, etc.)
- [ ] Refresh strategic recommendations based on new insights
- [ ] Update market positioning matrix if needed

**Deliverable:** Updated competitive_overview.md

---

## Phase 3: Content Updates - Sentiment Pages
**Priority: HIGH** | **Estimated Time: 2-3 hours**

### 3.1 Redesign Sentiment Analysis Approach
Current approach shows low N values. New approach:

**Format:** "X% of reviewers mentioned Y"

Example transformations:
- OLD: "Great WiFi (n=3)"
- NEW: "WiFi quality praised by 45% of reviewers (n=267)"

- OLD: "Rooftop views (n=2)"
- NEW: "Rooftop amenities mentioned positively by 12% of reviewers (n=72)"

### 3.2 Update Sentiment Pages
For each brand's sentiment page:

- [ ] Calculate percentage distributions for key themes
- [ ] Show top 10 positive themes with percentages and counts
- [ ] Show top 10 negative themes with percentages and counts
- [ ] Add sentiment visualization data (keep current charts, update numbers)
- [ ] Include representative quotes for each major theme
- [ ] Add "Sample Size" note: "Based on analysis of X reviews from Google Maps, Y comments from social media"

**Deliverable:** 8 updated sentiment analysis files

---

## Phase 4: Content Updates - Persona Pages
**Priority: HIGH** | **Estimated Time: 3-4 hours**

### 4.1 Rebuild Persona Profiles with Granular Data
For each of the 5 personas:

- [ ] **Demographics Section**
  - Update with actual age ranges mentioned in reviews
  - Update profession mentions with counts
  - Update travel purpose distribution

- [ ] **Psychographics Section**
  - Update values and motivations with review evidence (n=X)
  - Update lifestyle preferences with counts
  - Add quotes that illustrate persona characteristics

- [ ] **Happiness Drivers Section**
  - Replace low N values with aggregated counts
  - Add percentages: "X% of [persona] reviewers mentioned Y"
  - Include specific examples and quotes

- [ ] **Frustrations Section**
  - Update with aggregated complaint counts
  - Show what percentage of persona mentions each frustration
  - Add representative quotes

- [ ] **Brand Affinity Section**
  - Update cross-brand validation matrix with new data
  - Show which brands this persona reviews most
  - Update validation scores based on actual review patterns

- [ ] **Willingness to Pay Section**
  - Update with actual pricing sensitivity from reviews
  - Add examples of price complaints vs. price satisfaction
  - Include membership pricing feedback where relevant

**Deliverable:** 5 updated persona markdown files

### 4.2 Update Persona Methodology Document
- [ ] Update "Total sample size" to reflect actual numbers
- [ ] Update platform breakdown with real counts
- [ ] Update cross-brand validation matrix with new evidence
- [ ] Add transparency note about data collection methods

**Deliverable:** Updated persona methodology document

---

## Phase 5: Content Updates - Summary & Executive Pages
**Priority: MEDIUM** | **Estimated Time: 2-3 hours**

### 5.1 Update Executive Summary
- [ ] Refresh key findings with new data-backed insights
- [ ] Update strategic recommendations based on robust evidence
- [ ] Replace weak claims (n=2) with strong evidence (n=200+)
- [ ] Update membership pricing analysis with comprehensive data
- [ ] Revise 4-star transformation roadmap if new insights emerge

**Deliverable:** Updated executive summary markdown

### 5.2 Update Summary Page Sections
- [ ] **Current Positioning Section:** Update with new competitive insights
- [ ] **Key Strengths:** Replace with top themes from positive reviews (with %)
- [ ] **Key Challenges:** Replace with top themes from negative reviews (with %)
- [ ] **Target Audience:** Update with validated persona distribution
- [ ] **Strategic Recommendations:** Refine based on comprehensive data

**Deliverable:** Updated summary content

---

## Phase 6: Site-Wide Updates
**Priority: MEDIUM** | **Estimated Time: 2-3 hours**

### 6.1 Update Data Sources Page
- [ ] Replace "10,000+ reviews analyzed" with honest number
- [ ] Add platform breakdown:
  - Google Maps: 5,969 reviews
  - Reddit: X comments
  - Instagram: X posts
  - TikTok: X videos/comments
  - Facebook: X reviews
  - X/Twitter: X mentions
  - Booking.com: X reviews
  - TripAdvisor: X reviews
- [ ] Add "8 brands across 40+ European locations"
- [ ] Add methodology transparency section
- [ ] Update date range: "Reviews collected from 2022-2025, with focus on 2024-2025"

**Deliverable:** Updated data sources page

### 6.2 Update Landing Page
- [ ] Update hero stats:
  - "X,XXX reviews analyzed" (actual number)
  - "8 hospitality brands"
  - "40+ locations across Europe"
  - "5 validated personas"
- [ ] Update Deal Breakers section (already redesigned with icons)
- [ ] Refresh key insights with data-backed claims
- [ ] Update "What We Found" section with top insights

**Deliverable:** Updated landing page

### 6.3 Update Footer & Global Stats
- [ ] Update review count in footer
- [ ] Update any global statistics shown across pages
- [ ] Ensure consistency of numbers site-wide

**Deliverable:** Updated footer and global components

---

## Phase 7: Quality Assurance & Validation
**Priority: HIGH** | **Estimated Time: 2-3 hours**

### 7.1 Data Consistency Check
- [ ] Verify all N values are accurate and traceable to source data
- [ ] Check that percentages add up correctly
- [ ] Ensure no contradictions between pages
- [ ] Verify all quotes are real and properly attributed
- [ ] Check that location counts match actual data

### 7.2 Narrative Coherence Check
- [ ] Ensure insights flow logically from data to conclusions
- [ ] Check that strategic recommendations are supported by evidence
- [ ] Verify persona descriptions match review patterns
- [ ] Ensure competitive analysis is balanced and fair

### 7.3 Technical Validation
- [ ] Test all source reference tooltips work
- [ ] Verify tables render correctly
- [ ] Check Contents sidebar navigation works
- [ ] Test responsive layout on mobile
- [ ] Verify all markdown formatting is correct

**Deliverable:** QA checklist completed

---

## Phase 8: Build, Deploy & Verify
**Priority: CRITICAL** | **Estimated Time: 1-2 hours**

### 8.1 Local Build & Test
- [ ] Build project locally
- [ ] Test all pages for rendering issues
- [ ] Verify data accuracy on preview site
- [ ] Check performance (page load times)

### 8.2 Git Commit & Push
- [ ] Commit all updated content files
- [ ] Commit any code changes
- [ ] Push to GitHub repository
- [ ] Tag release: `v2.0-comprehensive-data-update`

### 8.3 Production Deployment
- [ ] Create deployment tarball
- [ ] Upload to VPS
- [ ] Deploy to production
- [ ] Reload Nginx
- [ ] Clear any caches

### 8.4 Live Site Verification
- [ ] Verify all pages load correctly
- [ ] Spot-check N values and percentages
- [ ] Test navigation and links
- [ ] Check mobile responsiveness
- [ ] Verify source references work

**Deliverable:** Live site with comprehensive data update

---

## Success Criteria

### Quantitative Metrics
- ✅ All N values are ≥ 20 (no more n=2 or n=8)
- ✅ Sentiment insights show percentages, not just counts
- ✅ Total review count is honest and accurate (~8,000-9,000)
- ✅ Each persona has validation across ≥ 500 reviews
- ✅ Each brand has analysis based on ≥ 200 reviews (except Working From_)

### Qualitative Metrics
- ✅ Insights feel credible and data-backed
- ✅ No misleading claims about sample size
- ✅ Strategic recommendations are well-supported
- ✅ Persona descriptions ring true with review evidence
- ✅ Competitive analysis is balanced and comprehensive

### User Experience
- ✅ Contents sidebar works on all relevant pages
- ✅ Source references stay inline (no line breaks)
- ✅ Tables render properly with readable fonts
- ✅ Deal Breakers section looks polished with icons
- ✅ Site loads quickly and is mobile-friendly

---

## Risk Mitigation

### Backup Strategy
- ✅ Restore point created: `tsh-restore-point-20251019-113951.tar.gz`
- Create incremental backups after each phase
- Keep VPS backup: `tsh-research-backup-[timestamp].tar.gz`

### Rollback Plan
If issues arise:
1. Stop deployment
2. Restore from backup: `tar -xzf tsh-restore-point-20251019-113951.tar.gz`
3. Identify and fix issue
4. Resume from last successful phase

### Testing Strategy
- Test each phase locally before moving to next
- Get user approval on sample outputs before bulk processing
- Deploy to preview URL before production

---

## Timeline Estimate

**Total Estimated Time: 20-28 hours**

### Aggressive Schedule (3-4 days)
- Day 1: Phases 1-2 (Data foundation + Brand pages)
- Day 2: Phases 3-4 (Sentiment + Persona pages)
- Day 3: Phases 5-6 (Summary + Site-wide)
- Day 4: Phases 7-8 (QA + Deploy)

### Conservative Schedule (5-7 days)
- Days 1-2: Phase 1 (Data foundation)
- Days 3-4: Phases 2-3 (Brand + Sentiment)
- Days 5-6: Phases 4-5 (Persona + Summary)
- Day 7: Phases 6-8 (Site-wide + QA + Deploy)

---

## Next Steps

**Immediate Actions:**
1. ✅ Get user approval on this plan
2. ⏳ Wait for parallel research to complete (or proceed with Google Maps data only)
3. ⏳ Begin Phase 1.1: Process Google Maps reviews

**Decision Points:**
- **Q:** Proceed with Google Maps data only, or wait for parallel research?
  - **Option A:** Start now with 5,969 Google Maps reviews
  - **Option B:** Wait for parallel research to complete (~2,000-3,000 more data points)
  
- **Q:** Aggressive or conservative timeline?
  - **Option A:** Push hard, complete in 3-4 days
  - **Option B:** Methodical approach, 5-7 days with review checkpoints

---

**End of Plan**

