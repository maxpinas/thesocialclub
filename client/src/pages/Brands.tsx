import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ExternalLink } from "lucide-react";
import { BRANDS } from "@/types/data";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export default function Brands() {
  const [loading, setLoading] = useState(true);
  const [overviewContent, setOverviewContent] = useState<string>("");

  useEffect(() => {
    // Load the competitive overview markdown
    fetch('/data/competitive_overview.md')
      .then(res => res.text())
      .then(content => {
        setOverviewContent(content);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load competitive overview:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-background to-muted/20 py-16 border-b border-border">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Brands</h1>
          <p className="text-2xl text-muted-foreground mb-4">Competitive Analysis</p>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Comprehensive competitive analysis of 8 hospitality brands across Europe
          </p>
        </div>
      </section>
      
      <section className="py-12">
        <div className="container">
          <h2 className="text-2xl font-bold mb-6">Explore Brands</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {BRANDS.map((brand) => (
              <Link key={brand.id} href={`/brands/${brand.id}`}>
                <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 h-full" style={{ borderLeftColor: brand.color }}>
                  <CardHeader>
                    <CardTitle className="text-lg">{brand.name}</CardTitle>
                    <CardDescription className="text-xs">Click to view detailed analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>View Analysis</span>
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Competitive Overview Section */}
      <section className="py-12 bg-muted/10 border-t border-border">
        <div className="container max-w-5xl">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="prose prose-neutral prose-lg max-w-none">
              <MarkdownRenderer content={overviewContent} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

