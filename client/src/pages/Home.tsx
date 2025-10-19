import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, TrendingUp, Database, Hotel, Scale, Theater, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - TSH Style */}
      <section className="relative h-[600px] overflow-hidden">
        {/* Full opacity hero image */}
        <div className="absolute inset-0">
          <img 
            src="/images/tsh-community-space.jpg" 
            alt="TSH Community Space" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Hero content */}
        <div className="container relative z-10 h-full flex items-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
              Data-driven insights for hospitality transformation
            </h1>
            <div className="bg-black/60 backdrop-blur-sm px-6 py-4 inline-block mb-8">
              <p className="text-xl md:text-2xl text-white font-medium">
                5,969 verified reviews. 8 brands analyzed. Clear strategic direction.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/summary">
                <Button size="lg" className="bg-white text-black hover:bg-white/90 text-lg px-8 py-6">
                  View Executive Summary
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/data-methodology">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                  Explore Methodology
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics Bar */}
      <section className="py-12 bg-muted/20 border-b border-border">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2" style={{ color: "#76a9f9" }}>5,969</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Verified Reviews Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2" style={{ color: "#7cbd8e" }}>8</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Hospitality Brands</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2" style={{ color: "#76a9f9" }}>5</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">Target Personas Validated</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-16">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 text-center">Explore the Research</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/summary">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <TrendingUp className="h-8 w-8 mb-2" style={{ color: "#76a9f9" }} />
                  <CardTitle>Executive Summary</CardTitle>
                  <CardDescription>
                    Strategic recommendations for TSH's 4-star transformation
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/personas">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <Users className="h-8 w-8 mb-2" style={{ color: "#7cbd8e" }} />
                  <CardTitle>Target Personas</CardTitle>
                  <CardDescription>
                    Five validated personas with market sizing and competitive positioning
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/sentiment">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <Scale className="h-8 w-8 mb-2" style={{ color: "#76a9f9" }} />
                  <CardTitle>Sentiment Analysis</CardTitle>
                  <CardDescription>
                    Detailed sentiment analysis across 8 brands with visualizations
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/brands/the-social-hub">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <Hotel className="h-8 w-8 mb-2" style={{ color: "#7cbd8e" }} />
                  <CardTitle>Brand Analysis</CardTitle>
                  <CardDescription>
                    In-depth competitive analysis of TSH and 7 competitor brands
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/data-methodology">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <Database className="h-8 w-8 mb-2" style={{ color: "#76a9f9" }} />
                  <CardTitle>Data & Methodology</CardTitle>
                  <CardDescription>
                    Transparent research methodology and data quality validation
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/data-validity">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <Theater className="h-8 w-8 mb-2" style={{ color: "#7cbd8e" }} />
                  <CardTitle>Data Validity</CardTitle>
                  <CardDescription>
                    Comprehensive validation of Google Maps data quality
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Key Findings Preview */}
      <section className="py-16 bg-muted/20">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 text-center">Key Strategic Findings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" style={{ color: "#76a9f9" }} />
                  Service Quality Gap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  TSH's service mention rate is <strong>14.9%</strong> compared to The Hoxton's <strong>29.6%</strong> — 
                  a 2x gap preventing TSH from attracting business travelers.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" style={{ color: "#7cbd8e" }} />
                  Digital Nomad Leadership
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  TSH ranks <strong>#1</strong> for Digital Nomads with <strong>24.6%</strong> of signals — 
                  leverage network advantage across 18 locations.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" style={{ color: "#76a9f9" }} />
                  Membership Opportunity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Network-wide membership program could generate <strong>€5.4M</strong> annual recurring revenue 
                  with 10,000 members at €40-60/month.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hotel className="h-5 w-5" style={{ color: "#7cbd8e" }} />
                  Community Strength
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  TSH leads in community with <strong>8.1%</strong> mention rate — 
                  highest among all brands, attracting Social Travelers and Local Professionals.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

