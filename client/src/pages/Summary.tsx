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
      const executive = await loadMarkdown("pasted_file_TpZq3h_Executivesummary_TheSocialHubtransformationandmembershipmodel.md");
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
      <section className="bg-gradient-to-b from-background to-muted/20 py-16 border-b border-border">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Executive Summary</h1>
            <p className="text-2xl text-muted-foreground mb-4">Transformation & Membership Strategy</p>
          <p className="text-xl text-muted-foreground max-w-3xl">
            The Social Hub transformation and membership model strategy
          </p>
        </div>
      </section>
      <section className="py-12">
        <div className="container">
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
              <div className="prose prose-slate max-w-none">
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
