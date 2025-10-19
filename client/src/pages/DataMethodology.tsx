import { useEffect, useState } from "react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function DataMethodology() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    fetch("/data/DataMethodology.md")
      .then((res) => res.text())
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "overview",
        "primary-data",
        "supplementary-data",
        "theme-analysis",
        "sentiment-analysis",
        "persona-validation",
        "data-quality",
        "comparison",
        "validation",
        "ethics"
      ];

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const sections = [
    { id: "overview", title: "Overview" },
    { id: "primary-data", title: "Primary Data Source" },
    { id: "supplementary-data", title: "Supplementary Data" },
    { id: "theme-analysis", title: "Theme Analysis" },
    { id: "sentiment-analysis", title: "Sentiment Analysis" },
    { id: "persona-validation", title: "Persona Validation" },
    { id: "data-quality", title: "Data Quality & Limitations" },
    { id: "comparison", title: "Google Maps vs Multi-Platform" },
    { id: "validation", title: "Industry Validation" },
    { id: "ethics", title: "Research Ethics" }
  ];

  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#76a9f9" }} />
      </div>
    );
  }

  // Process content to add IDs to sections
  const processedContent = content
    .replace("## Overview", '<h2 id="overview">Overview</h2>')
    .replace("## Primary Data Source: Google Maps Reviews", '<h2 id="primary-data">Primary Data Source: Google Maps Reviews</h2>')
    .replace("## Supplementary Data Source: Multi-Platform Research", '<h2 id="supplementary-data">Supplementary Data Source: Multi-Platform Research</h2>')
    .replace("## Theme Analysis Methodology", '<h2 id="theme-analysis">Theme Analysis Methodology</h2>')
    .replace("## Sentiment Analysis", '<h2 id="sentiment-analysis">Sentiment Analysis</h2>')
    .replace("## Persona Validation Methodology", '<h2 id="persona-validation">Persona Validation Methodology</h2>')
    .replace("## Data Quality & Limitations", '<h2 id="data-quality">Data Quality & Limitations</h2>')
    .replace("## Comparison: Google Maps vs. Multi-Platform Data", '<h2 id="comparison">Comparison: Google Maps vs. Multi-Platform Data</h2>')
    .replace("## Validation Against Industry Benchmarks", '<h2 id="validation">Validation Against Industry Benchmarks</h2>')
    .replace("## Research Ethics & Transparency", '<h2 id="ethics">Research Ethics & Transparency</h2>');

  return (
    <div className="min-h-screen">
      {/* Hero Section - TSH Style */}
      <section className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/tsh-coworking-space.jpg" 
            alt="TSH Coworking Space" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="container relative z-10 h-full flex items-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Data & Methodology
            </h1>
            <div className="bg-black/60 backdrop-blur-sm px-6 py-4 inline-block">
              <p className="text-xl text-white font-medium">
                Research built on 5,969 verified reviews and transparent analysis methodology
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content with Sidebar */}
      <section className="py-12">
        <div className="container">
          <div className="flex gap-8">
            {/* Sidebar Navigation */}
            <aside className="w-64 shrink-0 sticky top-20 h-fit hidden lg:block">
              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-1">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                          activeSection === section.id
                            ? "bg-primary text-primary-foreground font-medium"
                            : "hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        {section.title}
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              <Card>
                <CardContent className="p-8 prose prose-slate max-w-none">
                  <MarkdownRenderer content={processedContent} />
                </CardContent>
              </Card>
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}

