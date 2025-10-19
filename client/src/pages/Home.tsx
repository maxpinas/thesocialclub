import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, TrendingUp, Database, Hotel, Scale, Theater, AlertTriangle } from "lucide-react";
import { loadMarkdown } from "@/lib/dataLoader";

export default function Home() {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const executive = await loadMarkdown("ExecutiveSummary.md");
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
            <h1 className="text-5xl md:text-6xl font-bold mb-3 leading-tight">
              TSH Research Platform
            </h1>
            <p className="text-2xl text-muted-foreground mb-6">
              4-Star Transformation & Membership Strategy
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Analyzing 8 hospitality brands across Europe with 5,969 verified Google Maps reviews to drive TSH's 4-star transformation.
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
<div className="text-4xl font-bold mb-2" style={{ color: '#7cbd8e' }}>5</div>
                  <div className="text-sm text-muted-foreground">Validated Personas</div>
            </div>
            <div className="text-center">
<div className="text-4xl font-bold mb-2" style={{ color: '#a4a4a5' }}>5,969</div>
                  <div className="text-sm text-muted-foreground">Verified Reviews</div>
            </div>
            <div className="text-center">
<div className="text-4xl font-bold mb-2" style={{ color: '#76a9f9' }}>€5.4M</div>
                  <div className="text-sm text-muted-foreground">Annual Membership Revenue</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16">
        <div className="container">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Research Sections</h2>
            <p className="text-lg text-muted-foreground">Explore our comprehensive competitive analysis</p>
          </div>
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
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Membership Model</h2>
            <p className="text-lg text-muted-foreground">Finding the sweet spot between value and accessibility</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Digital Nomad (€240/year)</CardTitle>
                <CardDescription>Digital-first membership</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✓ Multi-city access</li>
                  <li>✓ 10% hotel discount</li>
                  <li>✓ Coworking passes</li>
                  <li>✓ Target: Digital Nomads</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Global Explorer (€500/year)</CardTitle>
                <CardDescription>Full amenity access</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✓ Multi-city access</li>
                  <li>✓ 20% hotel discount</li>
                  <li>✓ Wellness & meeting credits</li>
                  <li>✓ Target: Business Travelers, Wellness Enthusiasts</li>
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

      {/* What Our Personas Want */}
      <section className="py-16 bg-muted/20">
        <div className="container">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">What Our Personas Want</h2>
            <p className="text-lg text-muted-foreground">Beyond hygiene factors - the real drivers of membership value</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4" style={{ borderLeftColor: '#7cbd8e' }}>
              <CardHeader>
                <CardTitle className="text-lg">Vibe & Culture</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Design-forward spaces (not corporate)</li>
                  <li>• Social atmosphere without forced networking</li>
                  <li>• Curated community of like-minded people</li>
                  <li>• Local cultural integration</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-l-4" style={{ borderLeftColor: '#76a9f9' }}>
              <CardHeader>
                <CardTitle className="text-lg">Right Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 60-85% cheaper than Soho House</li>
                  <li>• 13-23x ROI for active users</li>
                  <li>• Transparent value proposition</li>
                  <li>• Flexible monthly & annual options</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-l-4" style={{ borderLeftColor: '#a4a4a5' }}>
              <CardHeader>
                <CardTitle className="text-lg">Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Multi-property access (3-5+ locations)</li>
                  <li>• Quality co-working (not just desks)</li>
                  <li>• Wellness facilities (gym, pool, spa)</li>
                  <li>• Member-only events & perks</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-l-4" style={{ borderLeftColor: '#FFE0B2' }}>
              <CardHeader>
                <CardTitle className="text-lg">Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Seamless booking (app-based)</li>
                  <li>• Consistent quality across locations</li>
                  <li>• Work-life integration (not separation)</li>
                  <li>• Flexibility & convenience</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              Deal Breakers
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-l-4 border-destructive">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Hotel className="h-5 w-5" />
                    Generic Hotel Vibe
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Lacks authentic community and soul. Members seek genuine connections and a sense of belonging, not just a place to stay.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-destructive">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Scale className="h-5 w-5" />
                    Inconsistent Quality
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Service quality that varies breaks trust. 4-star subscribers expect reliability and excellence at every touchpoint.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-destructive">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Theater className="h-5 w-5" />
                    No Cultural Programming
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Just amenities isn't enough. Members want curated experiences, events, and cultural engagement that enrich their lifestyle.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

