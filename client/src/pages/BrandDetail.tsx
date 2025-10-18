import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { BRANDS } from "@/types/data";
import { loadMarkdown, parseMarkdownSections } from "@/lib/dataLoader";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export default function BrandDetail() {
  const [, params] = useRoute("/brands/:brandId");
  const brandId = params?.brandId;
  const brand = BRANDS.find(b => b.id === brandId);
  const [content, setContent] = useState<string>("");
  const [sections, setSections] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!brand) { setLoading(false); return; }
      const fileMap: Record<string, string> = {
        "the-social-hub": "pasted_file_lgjMv7_Competitive_Analysis_The_Social_Hub.md",
        "the-hoxton": "pasted_file_0tu2Jc_Competitive_Analysis_The_Hoxton.md",
        "citizenm": "pasted_file_DwouXO_Competitive_Analysis_CitizenM.md",
        "mama-shelter": "pasted_file_gLz1Q1_Competitive_Analysis_Mama_Shelter.md",
        "soho-house": "pasted_file_3uv4Ct_Competitive_Analysis_Soho_House.md",
        "zoku": "pasted_file_zYOCyV_Competitive_Analysis_Zoku.md",
        "working-from": "pasted_file_AhU8mN_Competitive_Analysis_Working_From.md",
        "conservatorium": "pasted_file_RrSXtv_Competitive_Analysis_Conservatorium_Hotel.md",
      };
      const filename = fileMap[brandId || ""];
      if (filename) {
        const md = await loadMarkdown(filename);
        setContent(md);
        setSections(parseMarkdownSections(md));
      }
      setLoading(false);
    }
    loadData();
  }, [brandId, brand]);

  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#76a9f9" }} />
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-4">Brand Not Found</h1>
        <Link href="/brands"><Button variant="outline"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-background to-muted/20 py-16 border-b border-border">
        <div className="container">
          <Link href="/brands"><Button variant="ghost" className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button></Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: brand.color }}>{brand.name}</h1>
          <p className="text-xl text-muted-foreground">Competitive analysis and market positioning</p>
        </div>
      </section>
      <section className="py-12">
        <div className="container">
          <div className="grid lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader><CardTitle className="text-sm">Sections</CardTitle></CardHeader>
                <CardContent>
                  <nav className="space-y-2">
                    {Object.keys(sections).slice(0, 16).map((section, idx) => (
                      <a key={idx} href={`#section-${idx}`} className="block text-sm text-muted-foreground hover:text-[#76a9f9]">{section}</a>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </aside>
            <div className="lg:col-span-3">
              {Object.entries(sections).map(([title, sectionContent], idx) => (
                <div key={idx} id={`section-${idx}`} className="mb-12">
                  <h2 className="text-2xl font-bold mb-4 border-b border-border pb-2">{title}</h2>
                  <MarkdownRenderer content={sectionContent} brandId={brandId} />
                </div>
              ))}
              {Object.keys(sections).length === 0 && <div className="whitespace-pre-wrap text-muted-foreground">{content}</div>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
