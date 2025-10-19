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
      const personas = await loadMarkdown("pasted_file_Adg108_PersonaMethodologyDocument.md");
      setContent(personas);
      setSections(parseMarkdownSections(personas));
      setLoading(false);
    }
    loadData();
  }, []);

  const personaData = [
    { name: "Local Professional", percentage: 30, wtp: "€500-800/year", color: "#7cbd8e", 
      desc: "Age 28-45, income €50-80K/year. Values convenience, networking, work-life balance. Primary use: Co-working, gym, networking events." },
    { name: "Digital Nomad", percentage: 25, wtp: "€400-700/year", color: "#76a9f9",
      desc: "Age 25-40, income €40-70K/year. Values flexibility, community, WiFi quality. Primary use: Co-working, accommodation discounts, multi-city access." },
    { name: "Business Traveler", percentage: 20, wtp: "€600-1,000/year", color: "#a4a4a5",
      desc: "Age 30-50, income €60-100K/year. Values efficiency, reliability, meeting spaces. Primary use: Hotel discounts, meeting rooms, business lounge." },
    { name: "Wellness Enthusiast", percentage: 15, wtp: "€800-1,200/year", color: "#FFE0B2",
      desc: "Age 30-55, income €50-90K/year. Values health, self-care, quality facilities. Primary use: Gym, pool, spa, wellness programs." },
    { name: "Hybrid Worker", percentage: 10, wtp: "€500-700/year", color: "#C8E6C9",
      desc: "Age 25-40, income €40-70K/year. Values flexibility, social connection, work-life integration. Primary use: Co-working, social events, occasional accommodation." },
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
              5 validated personas developed from sentiment data across 8 brands
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

