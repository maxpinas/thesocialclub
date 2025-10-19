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
      <section className="bg-gradient-to-b from-background to-muted/20 py-16 border-b border-border">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Personas</h1>
            <p className="text-2xl text-muted-foreground mb-4">Target Audience Profiles</p>
            <p className="text-lg text-muted-foreground max-w-3xl">
              5 validated personas developed from 5,969 verified Google Maps reviews across 8 brands
            </p>
        </div>
      </section>
      <section className="py-12">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {personaData.map((persona, idx) => (
              <Card key={idx} className="border-l-4" style={{ borderLeftColor: persona.color }}>
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
          
          {/* Methodology Section with Contents Sidebar */}
          <div className="grid lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader><CardTitle className="text-sm">Contents</CardTitle></CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    {Object.keys(sections).map((section, idx) => (
                      <a key={idx} href={`#section-${idx}`} className="block text-sm text-muted-foreground hover:text-[#76a9f9] transition-colors">
                        {section}
                      </a>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </aside>
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Methodology & Evidence</CardTitle>
                  <CardDescription>How these personas were developed from research data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-neutral max-w-none">
                    {Object.entries(sections).map(([title, content], idx) => (
                      <div key={idx} id={`section-${idx}`} className="mb-12">
                        <h2 className="text-2xl font-bold mb-4 border-b border-border pb-2">{title}</h2>
                        <MarkdownRenderer content={content} />
                      </div>
                    ))}
                    {Object.keys(sections).length === 0 && (
                      <MarkdownRenderer content={content} />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

