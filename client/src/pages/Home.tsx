import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, TrendingUp, Database } from "lucide-react";
import { loadMarkdown } from "@/lib/dataLoader";

export default function Home() {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const executive = await loadMarkdown("pasted_file_glWWlJ_TSH_Executive_Strategy_Report.md");
      const readme = await loadMarkdown("pasted_file_rTnf85_README.md");
      setContent(executive || readme);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="container py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-background to-muted/20 py-20">
        <div className="container">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              TSH Competitive Research Platform
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Complete research package for The Social Hub's 4-star transformation and membership model strategy. 
              Analyzing 8 hospitality brands across Europe with 10,000+ reviews and 55+ successful research subtasks.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/summary">
                <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                  Read Executive Summary
                </Button>
              </Link>
              <Link href="/brands">
                <Button size="lg" variant="outline">
                  Explore Brands
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="py-16 border-b border-border">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: '#76a9f9' }}>8</div>
              <div className="text-sm text-muted-foreground">Brands Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: '#7cbd8e' }}>55+</div>
              <div className="text-sm text-muted-foreground">Research Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: '#a4a4a5' }}>10,000+</div>
              <div className="text-sm text-muted-foreground">Reviews Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: '#76a9f9' }}>8</div>
              <div className="text-sm text-muted-foreground">Platforms per Brand</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">Explore Research Sections</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/brands">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4" style={{ borderLeftColor: '#76a9f9' }}>
                <CardHeader>
                  <Building2 className="h-8 w-8 mb-2" style={{ color: '#76a9f9' }} />
                  <CardTitle>Brands</CardTitle>
                  <CardDescription>
                    Cross-brand comparison and competitive analysis for 8 hospitality brands
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/personas">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4" style={{ borderLeftColor: '#7cbd8e' }}>
                <CardHeader>
                  <Users className="h-8 w-8 mb-2" style={{ color: '#7cbd8e' }} />
                  <CardTitle>Personas</CardTitle>
                  <CardDescription>
                    5 validated personas with demographics, WTP, and evidence from reviews
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/sentiment">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4" style={{ borderLeftColor: '#a4a4a5' }}>
                <CardHeader>
                  <TrendingUp className="h-8 w-8 mb-2" style={{ color: '#a4a4a5' }} />
                  <CardTitle>Sentiment</CardTitle>
                  <CardDescription>
                    Multi-platform sentiment analysis with what makes people happy and frustrated
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/data-sources">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4" style={{ borderLeftColor: '#76a9f9' }}>
                <CardHeader>
                  <Database className="h-8 w-8 mb-2" style={{ color: '#76a9f9' }} />
                  <CardTitle>Data Sources</CardTitle>
                  <CardDescription>
                    Complete transparency on all sources with confidence scores and sample sizes
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Membership Model Sweet Spot */}
      <section className="py-16 bg-muted/20">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">Membership Model Sweet Spot</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>TSH+ (€99-120/year)</CardTitle>
                <CardDescription>Digital-first membership</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✓ 15% hotel discount</li>
                  <li>✓ Free daily coffee</li>
                  <li>✓ Priority booking</li>
                  <li>✓ Target: Frequent travelers, students</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>TSH Club (€450-600/year)</CardTitle>
                <CardDescription>Full amenity access</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✓ Full amenity access (gym, pool, wellness, co-working)</li>
                  <li>✓ 25% hotel discount</li>
                  <li>✓ Member events</li>
                  <li>✓ Target: Local professionals, digital nomads</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="mt-6 p-4 bg-background rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              <strong>Rationale:</strong> 60-85% cheaper than Soho House, 70-85% cheaper than standalone co-working, 
              13-23x ROI for active members, pan-European access across all TSH locations.
            </p>
          </div>
        </div>
      </section>

      {/* Critical Success Factors */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">Critical Success Factors</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl" style={{ color: '#7cbd8e' }}>✓</span>
                Must-Haves
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-sm font-medium text-muted-foreground">1.</span>
                  <span className="text-sm">Excellent WiFi (100+ Mbps, backup connection)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sm font-medium text-muted-foreground">2.</span>
                  <span className="text-sm">Quality workspace (ergonomic chairs, proper desks, quiet zones)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sm font-medium text-muted-foreground">3.</span>
                  <span className="text-sm">Multi-property access (minimum 3-5 hotels)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sm font-medium text-muted-foreground">4.</span>
                  <span className="text-sm">Clean, well-maintained facilities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sm font-medium text-muted-foreground">5.</span>
                  <span className="text-sm">Easy booking and access (app-based)</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl text-destructive">✗</span>
                Avoid
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-sm font-medium text-muted-foreground">1.</span>
                  <span className="text-sm">Poor WiFi (#1 complaint killer)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sm font-medium text-muted-foreground">2.</span>
                  <span className="text-sm">Overcrowding (cap members per hotel)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sm font-medium text-muted-foreground">3.</span>
                  <span className="text-sm">Unclear value proposition</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sm font-medium text-muted-foreground">4.</span>
                  <span className="text-sm">Single hotel only (not compelling)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sm font-medium text-muted-foreground">5.</span>
                  <span className="text-sm">Inconsistent service quality</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

