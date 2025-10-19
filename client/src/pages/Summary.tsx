import { useEffect, useState } from "react";
import { loadMarkdown, parseMarkdownSections } from "@/lib/dataLoader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export default function Summary() {
  const [content, setContent] = useState<string>("");
  const [sections, setSections] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const executive = await loadMarkdown("ExecutiveSummary.md");
      setContent(executive);
      setSections(parseMarkdownSections(executive));
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#76a9f9' }} />
      </div>
    );
  }

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
              Your roadmap to 4-star leadership
            </h1>
            <div className="bg-black/60 backdrop-blur-sm px-6 py-4 inline-block">
              <p className="text-xl text-white font-medium">
                Strategic recommendations backed by comprehensive competitive analysis
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section with Sidebar */}
      <section className="py-12">
        <div className="container">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation - Matching Data & Methodology Style */}
            <aside className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle className="text-lg">Contents</CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    {Object.keys(sections).map((section, idx) => (
                      <a
                        key={idx}
                        href={`#section-${idx}`}
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
                  {Object.entries(sections).map(([title, content], idx) => (
                    <div key={idx} id={`section-${idx}`} className="mb-12">
                      <h2 className="text-2xl font-bold mb-4 border-b border-border pb-2">{title}</h2>
                      <MarkdownRenderer content={content} />
                    </div>
                  ))}
                  {Object.keys(sections).length === 0 && (
                    <MarkdownRenderer content={content} />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

