import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar, Building2 } from "lucide-react";
import RiskBadge from "@/components/RiskBadge";
import { format } from "date-fns";

export default function ReportsPage() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["scam-reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scam_reports")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = reports.filter((r) => {
    const matchesSearch =
      !search ||
      r.company_name.toLowerCase().includes(search.toLowerCase()) ||
      r.internship_title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = riskFilter === "all" || r.risk_level === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold">Reported Scams</h1>
      <p className="mt-2 text-muted-foreground">
        Browse internship scams reported by the community.
      </p>

      {/* Filters */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by company, title, or description..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Risk level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      <div className="mt-6 space-y-4">
        {isLoading ? (
          <div className="py-12 text-center text-muted-foreground">Loading reports...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            {reports.length === 0
              ? "No scam reports yet. Be the first to report one!"
              : "No reports match your search."}
          </div>
        ) : (
          filtered.map((report) => (
            <Card key={report.id} className="card-shadow transition-shadow hover:elevated-shadow">
              <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <h3 className="truncate font-semibold">{report.company_name}</h3>
                    <RiskBadge level={report.risk_level} />
                  </div>
                  <p className="mt-1 text-sm font-medium text-muted-foreground">{report.internship_title}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{report.description}</p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    {report.contact_email && <span>📧 {report.contact_email}</span>}
                    {report.website_url && <span>🔗 {report.website_url}</span>}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(report.created_at), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
