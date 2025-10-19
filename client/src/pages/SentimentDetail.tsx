import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ThumbsUp, ThumbsDown, Lightbulb } from "lucide-react";
import { BRANDS } from "@/types/data";
import { loadJSON, countThemes, extractSampleSize, extractConfidenceScore } from "@/lib/dataLoader";
import type { SentimentPlatform } from "@/types/data";

export default function SentimentDetail() {
  const [, params] = useRoute("/sentiment/:brandId");
  const brandId = params?.brandId;
  const brand = BRANDS.find(b => b.id === brandId);
  const [platforms, setPlatforms] = useState<SentimentPlatform[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!brand) { setLoading(false); return; }
      const fileMap: Record<string, string> = {
        "the-social-hub": "the_social_hub_sentiment_data.json",
        "the-hoxton": "the_hoxton_sentiment_data.json",
        "citizenm": "citizenm_sentiment_data.json",
        "mama-shelter": "mama_shelter_sentiment_data.json",
        "soho-house": "soho_house_sentiment_data.json",
        "zoku": "zoku_sentiment_data.json",
        "working-from": "working_from__sentiment_data.json",
        "conservatorium": "conservatorium_hotel_sentiment_data.json",
        "dis-loyalty": "pasted_file_OfnmwL_dis-loyalty_membership_program_sentiment_data.json",
      };
      const filename = fileMap[brandId || ""];
      if (filename) {
        const data = await loadJSON<SentimentPlatform[]>(filename);
        setPlatforms(data || []);
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

  if (!brand && brandId !== "dis-loyalty") {
    return (
      <div className="container py-12">
        <h1 className="text-4xl font-bold mb-4">Brand Not Found</h1>
        <Link href="/sentiment"><Button variant="outline"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button></Link>
      </div>
    );
  }

  const displayName = brandId === "dis-loyalty" ? "Dis-loyalty Program" : brand?.name || "";

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-b from-background to-muted/20 py-16 border-b border-border">
        <div className="container">
          <Link href="/sentiment"><Button variant="ghost" className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button></Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{displayName}</h1>
          <p className="text-xl text-muted-foreground">Sentiment analysis across multiple platforms</p>
        </div>
      </section>
      <section className="py-12">
        <div className="container space-y-8">
          {platforms.map((platform, idx) => {
            const happyThemes = countThemes(platform["What makes people happy"]);
            const frustratedThemes = countThemes(platform["What frustrates people"]);
            const sampleSize = extractSampleSize(platform["Sample size"]);
            const confidence = extractConfidenceScore(platform["Data quality notes"]);
            return (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{platform.Subject}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{"⭐".repeat(confidence)}</span>
                      <span>n={sampleSize}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-bold flex items-center gap-2 mb-3"><ThumbsUp className="h-4 w-4 text-green-600" />What Makes People Happy</h4>
                    <div className="space-y-2">
                      {happyThemes.slice(0, 5).map((theme, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="flex-1 bg-green-100 rounded-full h-6 overflow-hidden">
                            <div className="bg-green-600 h-full flex items-center px-3 text-xs text-white" style={{ width: `${Math.min(100, (theme.count / happyThemes[0]?.count) * 100)}%` }}>
                              {theme.theme}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground w-12 text-right">n={theme.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold flex items-center gap-2 mb-3"><ThumbsDown className="h-4 w-4 text-orange-600" />What Frustrates People</h4>
                    <div className="space-y-2">
                      {frustratedThemes.slice(0, 5).map((theme, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="flex-1 bg-orange-100 rounded-full h-6 overflow-hidden">
                            <div className="bg-orange-600 h-full flex items-center px-3 text-xs text-white" style={{ width: `${Math.min(100, (theme.count / frustratedThemes[0]?.count) * 100)}%` }}>
                              {theme.theme}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground w-12 text-right">n={theme.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {platform["What people wish for"] && (
                    <div>
                      <h4 className="font-bold flex items-center gap-2 mb-2"><Lightbulb className="h-4 w-4 text-yellow-600" />What People Wish For</h4>
                      <p className="text-sm text-muted-foreground">{platform["What people wish for"]}</p>
                    </div>
                  )}
                  {platform["Key quotes"] && (
                    <div>
                      <h4 className="font-bold mb-2">Key Quotes</h4>
                      <div className="bg-muted/50 p-4 rounded-lg text-sm italic text-muted-foreground whitespace-pre-wrap">
                        {platform["Key quotes"].substring(0, 500)}...
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
