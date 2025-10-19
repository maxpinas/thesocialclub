#!/usr/bin/env python3
"""
Compare Google Maps sentiment data with parallel research to validate representativeness.
"""

import json
from pathlib import Path

def load_google_maps_analysis():
    """Load Google Maps analysis results."""
    filepath = Path('/home/ubuntu/tsh-analysis/all_brands_summary.json')
    with open(filepath, 'r') as f:
        return json.load(f)

def load_parallel_research():
    """Load parallel research results."""
    filepath = Path('/home/ubuntu/wide_brand_research.json')
    with open(filepath, 'r') as f:
        data = json.load(f)
    
    # Convert to dict by brand name
    results = {}
    for item in data.get('results', []):
        brand = item.get('input', '')
        if brand and item.get('output'):
            results[brand] = item['output']
    return results

def compare_sentiment(brand_name, gm_data, pr_data):
    """Compare sentiment between Google Maps and parallel research."""
    comparison = {
        'brand': brand_name,
        'google_maps': {},
        'parallel_research': {},
        'alignment': 'Unknown'
    }
    
    # Google Maps sentiment
    total = gm_data['total_reviews']
    pos = gm_data['sentiment_distribution'].get('positive', 0)
    neg = gm_data['sentiment_distribution'].get('negative', 0)
    
    comparison['google_maps'] = {
        'total_reviews': total,
        'positive_pct': round((pos / total) * 100, 1) if total > 0 else 0,
        'negative_pct': round((neg / total) * 100, 1) if total > 0 else 0,
        'top_themes': list(gm_data['theme_counts'].keys())[:5]
    }
    
    # Parallel research sentiment (extract from text)
    if pr_data:
        pr_total = pr_data.get('total_reviews_collected', 0)
        if isinstance(pr_total, str):
            pr_total = int(pr_total) if pr_total.isdigit() else 0
        
        comparison['parallel_research'] = {
            'total_reviews': pr_total,
            'platforms': pr_data.get('platform_breakdown', 'Unknown'),
            'positive_themes': pr_data.get('key_positive_themes', 'Unknown'),
            'negative_themes': pr_data.get('key_negative_themes', 'Unknown')
        }
        
        # Simple alignment check based on theme overlap
        gm_themes_str = ' '.join(comparison['google_maps']['top_themes']).lower()
        pr_themes_str = str(pr_data.get('key_positive_themes', '')).lower()
        
        # Check for theme overlap
        theme_overlap = 0
        for theme in ['service', 'room', 'food', 'location', 'amenities']:
            if theme in gm_themes_str and theme in pr_themes_str:
                theme_overlap += 1
        
        if theme_overlap >= 3:
            comparison['alignment'] = 'Strong - themes align well'
        elif theme_overlap >= 2:
            comparison['alignment'] = 'Moderate - some theme overlap'
        else:
            comparison['alignment'] = 'Weak - limited theme overlap'
    
    return comparison

def main():
    """Main comparison function."""
    print("=" * 80)
    print("GOOGLE MAPS vs PARALLEL RESEARCH - DATA SOURCE VALIDATION")
    print("=" * 80)
    
    gm_data = load_google_maps_analysis()
    pr_data = load_parallel_research()
    
    comparisons = []
    
    for brand_name in gm_data.keys():
        pr_brand_data = pr_data.get(brand_name, None)
        comparison = compare_sentiment(brand_name, gm_data[brand_name], pr_brand_data)
        comparisons.append(comparison)
        
        print(f"\n{'=' * 80}")
        print(f"BRAND: {brand_name}")
        print(f"{'=' * 80}")
        
        print(f"\n📊 GOOGLE MAPS:")
        print(f"  • Total reviews: {comparison['google_maps']['total_reviews']}")
        print(f"  • Positive: {comparison['google_maps']['positive_pct']}%")
        print(f"  • Negative: {comparison['google_maps']['negative_pct']}%")
        print(f"  • Top themes: {', '.join(comparison['google_maps']['top_themes'])}")
        
        print(f"\n🔍 PARALLEL RESEARCH:")
        print(f"  • Total reviews: {comparison['parallel_research'].get('total_reviews', 'N/A')}")
        print(f"  • Platforms: {comparison['parallel_research'].get('platforms', 'N/A')[:100]}...")
        print(f"  • Positive themes: {str(comparison['parallel_research'].get('positive_themes', 'N/A'))[:150]}...")
        print(f"  • Negative themes: {str(comparison['parallel_research'].get('negative_themes', 'N/A'))[:150]}...")
        
        print(f"\n✅ ALIGNMENT: {comparison['alignment']}")
    
    # Overall assessment
    print(f"\n{'=' * 80}")
    print("OVERALL ASSESSMENT")
    print(f"{'=' * 80}")
    
    strong_count = sum(1 for c in comparisons if 'Strong' in c['alignment'])
    moderate_count = sum(1 for c in comparisons if 'Moderate' in c['alignment'])
    weak_count = sum(1 for c in comparisons if 'Weak' in c['alignment'])
    
    print(f"\n• Strong alignment: {strong_count}/{len(comparisons)} brands")
    print(f"• Moderate alignment: {moderate_count}/{len(comparisons)} brands")
    print(f"• Weak alignment: {weak_count}/{len(comparisons)} brands")
    
    # Bias assessment
    avg_positive = sum(c['google_maps']['positive_pct'] for c in comparisons) / len(comparisons)
    avg_negative = sum(c['google_maps']['negative_pct'] for c in comparisons) / len(comparisons)
    
    print(f"\n📈 GOOGLE MAPS SENTIMENT DISTRIBUTION:")
    print(f"  • Average positive: {avg_positive:.1f}%")
    print(f"  • Average negative: {avg_negative:.1f}%")
    print(f"  • Average neutral: {100 - avg_positive - avg_negative:.1f}%")
    
    print(f"\n🎯 BIAS ASSESSMENT:")
    if avg_positive > 80:
        print("  ⚠️  Google Maps may have POSITIVE BIAS (>80% positive)")
        print("  Recommendation: Balance with parallel research data")
    elif avg_positive < 60:
        print("  ⚠️  Google Maps may have NEGATIVE BIAS (<60% positive)")
        print("  Recommendation: Investigate if sample is representative")
    else:
        print("  ✅ Google Maps appears BALANCED (60-80% positive)")
        print("  Recommendation: Safe to use as primary data source")
    
    # Save comparison
    output_file = Path('/home/ubuntu/tsh-analysis/data_source_comparison.json')
    with open(output_file, 'w') as f:
        json.dump(comparisons, f, indent=2)
    print(f"\n✅ Detailed comparison saved to {output_file}")

if __name__ == '__main__':
    main()

