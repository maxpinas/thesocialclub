import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ExternalLink } from "lucide-react";
import { loadMarkdown } from "@/lib/dataLoader";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export default function DataSources() {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const sources = await loadMarkdown("pasted_file_3tajYR_Master_Data_Sources.md");
      setContent(sources);
      setLoading(false);
    }
    loadData();
  }, []);

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Data Sources</h1>
          <p className="text-xl text-muted-foreground max-w-3xl">
            Complete transparency on all sources with confidence scores and sample sizes
          </p>
        </div>
      </section>
      <section className="py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card style={{ borderLeft: "4px solid #7cbd8e" }}>
              <CardHeader>
                <CardTitle className="text-3xl">10,000+</CardTitle>
                <p className="text-sm text-muted-foreground">Reviews Analyzed</p>
              </CardHeader>
            </Card>
            <Card style={{ borderLeft: "4px solid #76a9f9" }}>
              <CardHeader>
                <CardTitle className="text-3xl">8</CardTitle>
                <p className="text-sm text-muted-foreground">Platforms per Brand</p>
              </CardHeader>
            </Card>
            <Card style={{ borderLeft: "4px solid #a4a4a5" }}>
              <CardHeader>
                <CardTitle className="text-3xl">⭐⭐⭐⭐⭐</CardTitle>
                <p className="text-sm text-muted-foreground">Confidence Scoring</p>
              </CardHeader>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Data Quality Framework</CardTitle>
            </CardHeader>
            <CardContent>
              <MarkdownRenderer content={content} />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
