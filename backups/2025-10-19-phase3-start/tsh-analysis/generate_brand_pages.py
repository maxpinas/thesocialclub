import json
import os

# Brand mapping
BRANDS = {
    "the-social-hub": {
        "name": "The Social Hub",
        "file": "the_social_hub_analysis.json",
        "supplementary_key": "the-social-hub"
    },
    "the-hoxton": {
        "name": "The Hoxton",
        "file": "the_hoxton_analysis.json",
        "supplementary_key": "the-hoxton"
    },
    "citizenm": {
        "name": "CitizenM",
        "file": "citizenm_analysis.json",
        "supplementary_key": "citizenm"
    },
    "mama-shelter": {
        "name": "Mama Shelter",
        "file": "mama_shelter_analysis.json",
        "supplementary_key": "mama-shelter"
    },
    "soho-house": {
        "name": "Soho House",
        "file": "soho_house_analysis.json",
        "supplementary_key": "soho-house"
    },
    "zoku": {
        "name": "Zoku",
        "file": "zoku_analysis.json",
        "supplementary_key": "zoku"
    },
    "working-from": {
        "name": "Working From_",
        "file": "working_from__analysis.json",
        "supplementary_key": "working-from"
    },
    "conservatorium-hotel": {
        "name": "Conservatorium Hotel",
        "file": "conservatorium_hotel_analysis.json",
        "supplementary_key": "conservatorium-hotel"
    }
}

def load_google_maps_data(brand_id):
    """Load Google Maps analysis for a brand"""
    file_path = f"/home/ubuntu/tsh-analysis/{BRANDS[brand_id]['file']}"
    with open(file_path, 'r') as f:
        return json.load(f)

def get_theme_counts(data):
    """Extract theme counts from Google Maps data"""
    themes = {}
    for theme, content in data.get('themes', {}).items():
        pos_count = len(content.get('positive', []))
        neg_count = len(content.get('negative', []))
        themes[theme] = {
            'positive': pos_count,
            'negative': neg_count,
            'net': pos_count - neg_count
        }
    return themes

def get_sentiment_percentages(data):
    """Calculate sentiment percentages"""
    total = data['total_reviews']
    sentiment = data['sentiment_distribution']
    return {
        'positive': round((sentiment.get('positive', 0) / total) * 100, 1),
        'negative': round((sentiment.get('negative', 0) / total) * 100, 1),
        'neutral': round((sentiment.get('neutral', 0) / total) * 100, 1)
    }

# Print summary for verification
print("Brand Analysis Page Generator")
print("=" * 50)
print(f"Brands to process: {len(BRANDS)}")
print()

for brand_id in BRANDS.keys():
    gm_data = load_google_maps_data(brand_id)
    themes = get_theme_counts(gm_data)
    sentiment = get_sentiment_percentages(gm_data)
    
    print(f"{BRANDS[brand_id]['name']}:")
    print(f"  Total reviews: {gm_data['total_reviews']}")
    print(f"  Sentiment: {sentiment['positive']}% pos, {sentiment['negative']}% neg, {sentiment['neutral']}% neutral")
    print(f"  Locations: {len(gm_data.get('locations', {}))}")
    
    # Show top 3 themes
    sorted_themes = sorted(themes.items(), key=lambda x: x[1]['positive'], reverse=True)[:3]
    print(f"  Top themes:")
    for theme, counts in sorted_themes:
        print(f"    - {theme}: +{counts['positive']} / -{counts['negative']}")
    print()

print("=" * 50)
print("Data summary complete. Ready to generate brand pages.")
