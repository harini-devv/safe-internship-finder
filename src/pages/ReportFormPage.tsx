import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2, AlertTriangle } from "lucide-react";

export default function ReportFormPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    internship_title: "",
    description: "",
    contact_email: "",
    website_url: "",
    scam_type: "other",
    risk_level: "medium",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to report a scam.");
      return;
    }
    if (!form.company_name.trim() || !form.internship_title.trim() || !form.description.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("scam_reports").insert({
        ...form,
        user_id: user.id,
      });
      if (error) throw error;
      toast.success("Scam report submitted! Thank you for helping others.");
      navigate("/reports");
    } catch (e: any) {
      toast.error(e.message || "Failed to submit report.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container max-w-lg py-20 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-warning" />
        <h2 className="mt-4 text-2xl font-bold">Sign In Required</h2>
        <p className="mt-2 text-muted-foreground">You need to be signed in to report a scam.</p>
        <Button variant="hero" className="mt-6" onClick={() => navigate("/auth")}>
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-12">
      <h1 className="text-3xl font-bold">Report a Scam Internship</h1>
      <p className="mt-2 text-muted-foreground">Help protect other students by sharing details about fraudulent offers.</p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Scam Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-5">
            <div>
              <Label htmlFor="company_name">Company Name *</Label>
              <Input id="company_name" value={form.company_name} onChange={(e) => update("company_name", e.target.value)} placeholder="e.g. Fake Corp Inc." />
            </div>
            <div>
              <Label htmlFor="internship_title">Internship Title *</Label>
              <Input id="internship_title" value={form.internship_title} onChange={(e) => update("internship_title", e.target.value)} placeholder="e.g. Remote Data Entry Intern" />
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe the scam: what they promised, what they asked for, red flags you noticed..." className="min-h-[120px]" />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="contact_email">Contact Email (if known)</Label>
                <Input id="contact_email" type="email" value={form.contact_email} onChange={(e) => update("contact_email", e.target.value)} placeholder="scammer@example.com" />
              </div>
              <div>
                <Label htmlFor="website_url">Website URL (if known)</Label>
                <Input id="website_url" value={form.website_url} onChange={(e) => update("website_url", e.target.value)} placeholder="https://suspicious-site.com" />
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label>Scam Type</Label>
                <Select value={form.scam_type} onValueChange={(v) => update("scam_type", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="payment_required">Payment Required</SelectItem>
                    <SelectItem value="personal_info">Requests Personal Info</SelectItem>
                    <SelectItem value="fake_company">Fake Company</SelectItem>
                    <SelectItem value="unpaid_work">Unpaid Work Scam</SelectItem>
                    <SelectItem value="phishing">Phishing</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Risk Level</Label>
                <Select value={form.risk_level} onValueChange={(v) => update("risk_level", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button variant="hero" type="submit" className="w-full" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Submit Report"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
