#!/usr/bin/env python3
"""
Analyze Google Maps reviews to extract themes, sentiments, and insights.
"""

import csv
import json
import re
from collections import defaultdict, Counter
from pathlib import Path

# Define theme keywords for categorization
THEME_KEYWORDS = {
    'service': ['service', 'staff', 'friendly', 'helpful', 'rude', 'professional', 'attentive', 'reception', 'check-in', 'check-out'],
    'room_quality': ['room', 'bed', 'comfortable', 'spacious', 'small', 'tiny', 'cramped', 'clean', 'dirty', 'modern', 'outdated'],
    'pricing': ['price', 'expensive', 'cheap', 'value', 'worth', 'overpriced', 'affordable', 'cost', 'money'],
    'wifi': ['wifi', 'wi-fi', 'internet', 'connection', 'network'],
    'location': ['location', 'central', 'convenient', 'accessible', 'transport', 'metro', 'station', 'walk'],
    'cleanliness': ['clean', 'dirty', 'hygiene', 'tidy', 'messy', 'spotless'],
    'noise': ['noise', 'noisy', 'loud', 'quiet', 'silent', 'soundproof'],
    'amenities': ['gym', 'fitness', 'pool', 'bar', 'restaurant', 'breakfast', 'coworking', 'workspace'],
    'community': ['community', 'social', 'vibe', 'atmosphere', 'people', 'meet', 'networking'],
    'food_beverage': ['food', 'breakfast', 'dinner', 'lunch', 'coffee', 'restaurant', 'bar', 'menu', 'meal'],
}

def load_reviews(filepath):
    """Load reviews from CSV file."""
    reviews = []
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            reviews.append(row)
    return reviews

def analyze_sentiment(text, stars):
    """Analyze sentiment based on text and star rating."""
    stars = int(stars) if stars else 3
    
    if stars >= 4:
        return 'positive'
    elif stars <= 2:
        return 'negative'
    else:
        return 'neutral'

def extract_themes(text):
    """Extract themes mentioned in review text."""
    text_lower = text.lower()
    themes = []
    
    for theme, keywords in THEME_KEYWORDS.items():
        for keyword in keywords:
            if keyword in text_lower:
                themes.append(theme)
                break
    
    return list(set(themes))

def analyze_brand_reviews(brand_name, reviews):
    """Analyze all reviews for a single brand."""
    analysis = {
        'brand_name': brand_name,
        'total_reviews': len(reviews),
        'locations': Counter(),
        'sentiment_distribution': Counter(),
        'star_distribution': Counter(),
        'themes': defaultdict(lambda: {'positive': [], 'negative': [], 'neutral': []}),
        'theme_counts': Counter(),
        'sample_quotes': defaultdict(list),
    }
    
    for review in reviews:
        # Extract data
        location = review.get('title', 'Unknown')
        stars = review.get('stars', '3')
        text = review.get('text', '')
        name = review.get('name', 'Anonymous')
        
        # Count locations
        analysis['locations'][location] += 1
        
        # Analyze sentiment
        sentiment = analyze_sentiment(text, stars)
        analysis['sentiment_distribution'][sentiment] += 1
        analysis['star_distribution'][stars] += 1
        
        # Extract themes
        themes = extract_themes(text)
        for theme in themes:
            analysis['theme_counts'][theme] += 1
            analysis['themes'][theme][sentiment].append({
                'text': text[:200],  # First 200 chars
                'stars': stars,
                'location': location,
                'reviewer': name
            })
            
            # Collect sample quotes (max 5 per theme per sentiment)
            if len(analysis['sample_quotes'][f"{theme}_{sentiment}"]) < 5 and len(text) > 50:
                analysis['sample_quotes'][f"{theme}_{sentiment}"].append({
                    'text': text,
                    'stars': stars,
                    'location': location,
                    'reviewer': name
                })
    
    return analysis

def generate_insights(analysis):
    """Generate human-readable insights from analysis."""
    insights = []
    total = analysis['total_reviews']
    
    # Sentiment summary
    pos_pct = (analysis['sentiment_distribution']['positive'] / total) * 100
    neg_pct = (analysis['sentiment_distribution']['negative'] / total) * 100
    insights.append(f"Overall sentiment: {pos_pct:.1f}% positive, {neg_pct:.1f}% negative")
    
    # Top themes
    top_themes = analysis['theme_counts'].most_common(5)
    insights.append(f"Most mentioned themes: {', '.join([f'{theme} (n={count})' for theme, count in top_themes])}")
    
    # Location distribution
    top_locations = analysis['locations'].most_common(3)
    insights.append(f"Top reviewed locations: {', '.join([f'{loc} ({count})' for loc, count in top_locations])}")
    
    return insights

def main():
    """Main analysis function."""
    data_dir = Path('/home/ubuntu/tsh-data')
    output_dir = Path('/home/ubuntu/tsh-analysis')
    
    brands = {
        'The Social Hub': 'pasted_file_pPz5uy_Thesocialhub.csv',
        'The Hoxton': 'pasted_file_660Hf3_TheHoxton.csv',
        'CitizenM': 'pasted_file_RFG00J_CitizenM.csv',
        'Mama Shelter': 'pasted_file_Yj00Z4_MamaShelter.csv',
        'Soho House': 'pasted_file_IlkMdX_SoHoHouse.csv',
        'Zoku': 'pasted_file_0pQspZ_Zoku.csv',
        'Conservatorium Hotel': 'pasted_file_FAQGmV_Conservatoriumhotel.csv',
        'Working From_': 'pasted_file_3P7ls9_WorkingFrom_.csv',
    }
    
    all_analyses = {}
    
    for brand_name, filename in brands.items():
        print(f"\nAnalyzing {brand_name}...")
        filepath = data_dir / filename
        
        if not filepath.exists():
            print(f"  ⚠️  File not found: {filepath}")
            continue
        
        reviews = load_reviews(filepath)
        print(f"  Loaded {len(reviews)} reviews")
        
        analysis = analyze_brand_reviews(brand_name, reviews)
        all_analyses[brand_name] = analysis
        
        # Generate insights
        insights = generate_insights(analysis)
        for insight in insights:
            print(f"  • {insight}")
        
        # Save individual brand analysis
        output_file = output_dir / f"{brand_name.replace(' ', '_').lower()}_analysis.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(analysis, f, indent=2, ensure_ascii=False)
        print(f"  ✅ Saved to {output_file}")
    
    # Save combined analysis
    summary_file = output_dir / 'all_brands_summary.json'
    with open(summary_file, 'w', encoding='utf-8') as f:
        json.dump(all_analyses, f, indent=2, ensure_ascii=False)
    print(f"\n✅ Combined analysis saved to {summary_file}")
    
    # Print overall summary
    total_reviews = sum(a['total_reviews'] for a in all_analyses.values())
    print(f"\n📊 OVERALL SUMMARY:")
    print(f"Total reviews analyzed: {total_reviews}")
    print(f"Brands analyzed: {len(all_analyses)}")

if __name__ == '__main__':
    main()

