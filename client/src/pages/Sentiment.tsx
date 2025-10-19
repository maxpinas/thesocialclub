import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { BRANDS } from "@/types/data";
import { loadJSON } from "@/lib/dataLoader";
import type { SentimentSummary } from "@/types/data";

export default function Sentiment() {
  const [summary, setSummary] = useState<SentimentSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await loadJSON<SentimentSummary>("sentiment_summary.json");
      setSummary(data);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#76a9f9" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - TSH Style */}
      <section className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/tsh-lobby-space.jpg" 
            alt="TSH Lobby Space" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="container relative z-10 h-full flex items-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Sentiment Analysis
            </h1>
            <div className="bg-black/60 backdrop-blur-sm px-6 py-4 inline-block">
              <p className="text-xl text-white font-medium">
                Comprehensive sentiment analysis based on 5,969 verified Google Maps reviews across 8 hospitality brands
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="container">
          {summary && (
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card style={{ borderLeft: "4px solid #7cbd8e" }}>
                <CardHeader>
                  <CardTitle className="text-3xl">5,969</CardTitle>
                  <CardDescription>Total Reviews Analyzed</CardDescription>
                </CardHeader>
              </Card>
              <Card style={{ borderLeft: "4px solid #76a9f9" }}>
                <CardHeader>
                  <CardTitle className="text-3xl">{summary.successful}</CardTitle>
                  <CardDescription>Brands Analyzed</CardDescription>
                </CardHeader>
              </Card>
              <Card style={{ borderLeft: "4px solid #a4a4a5" }}>
                <CardHeader>
                  <CardTitle className="text-3xl">High Quality</CardTitle>
                  <CardDescription>Data Quality (Verified Reviews)</CardDescription>
                </CardHeader>
              </Card>
            </div>
          )}
          
          {/* Cross-Brand Comparison Graphs */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Cross-Brand Overview</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sentiment Comparison</CardTitle>
                  <CardDescription>Positive vs. negative themes across all brands</CardDescription>
                </CardHeader>
                <CardContent>
                  <img 
                    src="/images/sentiment/cross_brand_comparison.png" 
                    alt="Cross-Brand Sentiment Comparison" 
                    className="w-full rounded-lg"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Sample Sizes</CardTitle>
                  <CardDescription>Number of reviews analyzed per brand</CardDescription>
                </CardHeader>
                <CardContent>
                  <img 
                    src="/images/sentiment/sample_sizes.png" 
                    alt="Sample Sizes by Brand" 
                    className="w-full rounded-lg"
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6">Brand Sentiment</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BRANDS.map((brand) => (
              <Link key={brand.id} href={`/sentiment/${brand.id}`}>
                <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 h-full" style={{ borderLeftColor: brand.color }}>
                  <CardHeader>
                    <CardTitle className="text-lg">{brand.name}</CardTitle>
                    <CardDescription className="text-xs">
                      Google Maps verified reviews
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-muted-foreground">View Details</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

