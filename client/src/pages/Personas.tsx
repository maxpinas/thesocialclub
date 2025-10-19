import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users } from "lucide-react";
import { loadMarkdown, parseMarkdownSections } from "@/lib/dataLoader";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export default function Personas() {
  const [content, setContent] = useState<string>("");
  const [sections, setSections] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const personas = await loadMarkdown("PersonaMethodologyDocument.md");
      setContent(personas);
      setSections(parseMarkdownSections(personas));
      setLoading(false);
    }
    loadData();
  }, []);

  const personaData = [
    { name: "Wellness Enthusiast", percentage: 32, wtp: "€360-600/year", color: "#FFE0B2", 
      desc: "Age 30-55, income €50-90K/year. Values health, self-care, quality facilities. 1,901 signals from Google Maps data. TSH ranks 3rd - competitive." },
    { name: "Business Traveler", percentage: 30, wtp: "€480-720/year", color: "#a4a4a5",
      desc: "Age 30-50, income €60-100K/year. Values efficiency, reliability, service. 1,780 signals. TSH ranks 4th - critical service gap to close." },
    { name: "Social Traveler", percentage: 20, wtp: "€240-420/year", color: "#7cbd8e",
      desc: "Age 25-40, income €40-70K/year. Values community, F&B, experiences. 1,215 signals. TSH ranks 2nd - strong community leadership." },
    { name: "Local Professional", percentage: 18, wtp: "€300-480/year", color: "#C8E6C9",
      desc: "Age 28-45, income €50-80K/year. Values convenience, networking, amenities. 1,094 signals. TSH ranks 2nd - strong local appeal." },
    { name: "Digital Nomad", percentage: 6, wtp: "€240-360/year", color: "#76a9f9",
      desc: "Age 25-40, income €40-70K/year. Values flexibility, community, WiFi. 366 signals. TSH ranks 1st - clear strength with 24.6% of signals." },
  ];

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
      <section className="relative h-[500px] overflow-hidden">
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
              Know your audience. Shape your strategy.
            </h1>
            <div className="bg-black/60 backdrop-blur-sm px-6 py-4 inline-block">
              <p className="text-xl text-white font-medium">
                Five validated personas representing your target market, based on 5,969 verified reviews
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="relative h-[300px] overflow-hidden border-y border-border">
        <div className="absolute inset-0">
          <img 
            src="/images/tsh-coworking-space.jpg" 
            alt="TSH Coworking Space" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="container relative z-10 h-full flex items-center justify-center">
          <div className="text-center max-w-3xl">
            <blockquote className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              "Understanding who stays with us is the foundation of every strategic decision we make."
            </blockquote>
            <p className="text-lg text-white/90">— Based on comprehensive analysis of 5,969 guest reviews</p>
          </div>
        </div>
      </section>

      {/* Persona Tiles Overview */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Target Persona Distribution</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Five distinct personas validated through comprehensive review analysis across 8 hospitality brands
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {personaData.map((persona, idx) => (
              <Card key={idx} className="border-l-4 hover:shadow-lg transition-shadow" style={{ borderLeftColor: persona.color }}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Users className="h-6 w-6" style={{ color: persona.color }} />
                    <span className="text-2xl font-bold" style={{ color: persona.color }}>{persona.percentage}%</span>
                  </div>
                  <CardTitle>{persona.name}</CardTitle>
                  <CardDescription className="font-bold text-foreground">WTP: {persona.wtp}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{persona.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology Section with Sidebar */}
      <section className="py-16 bg-muted/20">
        <div className="container">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle className="text-lg">Contents</CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    {Object.keys(sections).map((section) => (
                      <a
                        key={section}
                        href={`#${section.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block text-sm text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-2 rounded-md transition-colors"
                      >
                        {section}
                      </a>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card>
                <CardContent className="p-8 prose prose-slate max-w-none">
                  <MarkdownRenderer content={content} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

