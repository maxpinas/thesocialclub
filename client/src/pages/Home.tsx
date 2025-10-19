import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, TrendingUp, Database, Hotel, Scale, Theater, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-background to-muted/20 py-24 border-b border-border overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img 
            src="/images/tsh-community-space.jpg" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Data-driven insights for hospitality transformation
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              5,969 verified reviews. 8 brands analyzed. Clear strategic direction.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-background/90 backdrop-blur-sm p-6 rounded-lg border border-border">
                <div className="text-4xl font-bold mb-2" style={{ color: "#76a9f9" }}>5,969</div>
                <div className="text-sm text-muted-foreground">Verified Reviews Analyzed</div>
              </div>
              <div className="bg-background/90 backdrop-blur-sm p-6 rounded-lg border border-border">
                <div className="text-4xl font-bold mb-2" style={{ color: "#7cbd8e" }}>8</div>
                <div className="text-sm text-muted-foreground">Hospitality Brands</div>
              </div>
              <div className="bg-background/90 backdrop-blur-sm p-6 rounded-lg border border-border">
                <div className="text-4xl font-bold mb-2" style={{ color: "#76a9f9" }}>5</div>
                <div className="text-sm text-muted-foreground">Target Personas Validated</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/summary">
                <Button size="lg" style={{ backgroundColor: "#76a9f9" }}>
                  View Executive Summary
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/data-methodology">
                <Button size="lg" variant="outline">
                  Explore Methodology
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Persona Distribution Graph */}
      <section className="py-16 bg-muted/20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Target Persona Distribution</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Five validated personas representing your target market, based on comprehensive review analysis
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <img 
                  src="/images/persona_market_distribution.png" 
                  alt="Persona Market Distribution" 
                  className="w-full rounded-lg"
                />
              </CardContent>
            </Card>
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

