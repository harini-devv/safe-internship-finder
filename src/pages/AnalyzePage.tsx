import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Search, Loader2, ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import RiskBadge from "@/components/RiskBadge";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface AnalysisResult {
  scam_probability: number;
  risk_level: string;
  explanation: string;
  red_flags: string[];
}

export default function AnalyzePage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyze = async () => {
    if (!text.trim()) {
      toast.error("Please paste an internship offer to analyze.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-offer", {
        body: { text },
      });
      if (error) throw error;
      setResult(data);
    } catch (e: any) {
      toast.error(e.message || "Failed to analyze. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level?.toLowerCase()) {
      case "low": return <ShieldCheck className="h-10 w-10 text-success" />;
      case "medium": return <ShieldAlert className="h-10 w-10 text-warning" />;
      case "high": return <ShieldX className="h-10 w-10 text-danger" />;
      default: return <ShieldAlert className="h-10 w-10 text-muted-foreground" />;
    }
  };

  return (
    <div className="container max-w-3xl py-12">
      <h1 className="text-3xl font-bold">Analyze an Internship Offer</h1>
      <p className="mt-2 text-muted-foreground">
        Paste the email, job description, or message you received. Our AI will check for scam indicators.
      </p>

      <Card className="mt-8">
        <CardContent className="pt-6">
          <Textarea
            placeholder="Paste the internship offer text here... (email content, job description, payment requests, etc.)"
            className="min-h-[200px] resize-y"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button
            variant="hero"
            className="mt-4 w-full"
            onClick={analyze}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analyze Offer
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card className="mt-8 overflow-hidden">
              <CardHeader className="flex flex-row items-center gap-4 border-b bg-muted/50">
                {getRiskIcon(result.risk_level)}
                <div>
                  <CardTitle>Analysis Result</CardTitle>
                  <div className="mt-1 flex items-center gap-3">
                    <RiskBadge level={result.risk_level} />
                    <span className="text-sm text-muted-foreground">
                      {result.scam_probability}% scam probability
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Progress bar */}
                <div className="mb-6">
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-muted-foreground">Scam Probability</span>
                    <span className="font-semibold">{result.scam_probability}%</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className={`h-full rounded-full ${
                        result.scam_probability >= 70
                          ? "bg-danger"
                          : result.scam_probability >= 40
                          ? "bg-warning"
                          : "bg-success"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${result.scam_probability}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <h4 className="font-semibold">Explanation</h4>
                <p className="mt-1 text-sm text-muted-foreground">{result.explanation}</p>

                {result.red_flags?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold">Red Flags</h4>
                    <ul className="mt-2 space-y-1">
                      {result.red_flags.map((flag, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-danger" />
                          {flag}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
