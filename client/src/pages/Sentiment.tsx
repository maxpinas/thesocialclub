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
      const data = await loadJSON<SentimentSummary>("pasted_file_F5oc6x_sentiment_summary.json");
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
      <section className="bg-gradient-to-b from-background to-muted/20 py-16 border-b border-border">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Sentiment</h1>
            <p className="text-2xl text-muted-foreground mb-4">Multi-Platform Analysis</p>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Multi-platform sentiment data across 8 hospitality brands
          </p>
        </div>
      </section>
      <section className="py-12">
        <div className="container">
          {summary && (
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card style={{ borderLeft: "4px solid #7cbd8e" }}>
                <CardHeader>
                  <CardTitle className="text-3xl">{summary.total_records}</CardTitle>
                  <CardDescription>Total Records</CardDescription>
                </CardHeader>
              </Card>
              <Card style={{ borderLeft: "4px solid #76a9f9" }}>
                <CardHeader>
                  <CardTitle className="text-3xl">{summary.successful}</CardTitle>
                  <CardDescription>Successful Analyses</CardDescription>
                </CardHeader>
              </Card>
              <Card style={{ borderLeft: "4px solid #a4a4a5" }}>
                <CardHeader>
                  <CardTitle className="text-3xl">7-8</CardTitle>
                  <CardDescription>Platforms per Brand</CardDescription>
                </CardHeader>
              </Card>
            </div>
          )}
          <h2 className="text-2xl font-bold mb-6">Brand Sentiment</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BRANDS.map((brand) => (
              <Link key={brand.id} href={`/sentiment/${brand.id}`}>
                <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 h-full" style={{ borderLeftColor: brand.color }}>
                  <CardHeader>
                    <CardTitle className="text-lg">{brand.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {summary?.brands[brand.name] || 0} platform analyses
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
