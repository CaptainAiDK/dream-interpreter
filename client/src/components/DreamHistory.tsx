import { formatDistanceToNow } from "date-fns";
import { da } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";

const scenarioLabels: Record<string, string> = {
  flying: "Flyve",
  falling: "Falde",
  water: "Vand",
  animals: "Dyr",
  people: "Mennesker",
  chase: "Forfølgelse",
  death: "Død",
  house: "Hus",
  school: "Skole",
  work: "Arbejde",
};

function formatPreview(value: string | null | undefined) {
  if (!value) return "Ingen tolkning registreret endnu.";
  const trimmed = value.trim();
  return trimmed.length > 180 ? `${trimmed.slice(0, 180)}...` : trimmed;
}

export default function DreamHistory() {
  const historyQuery = trpc.dream.getDreamHistory.useQuery({ limit: 5 });

  if (historyQuery.isPending) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Seneste tolkninger</CardTitle>
          <CardDescription>Henter din drømmehistorik...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (historyQuery.isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Seneste tolkninger</CardTitle>
          <CardDescription>Kunne ikke hente historikken lige nu.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const items = historyQuery.data ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seneste tolkninger</CardTitle>
        <CardDescription>Se dine seneste drømme og tilhørende fortolkninger.</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-slate-600">Du har endnu ikke lavet nogen tolkninger.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const scenarioName = item.scenarioType ? scenarioLabels[item.scenarioType] : undefined;
              const createdAt = item.createdAt ? new Date(item.createdAt) : undefined;
              const timestamp = createdAt
                ? formatDistanceToNow(createdAt, {
                    addSuffix: true,
                    locale: da,
                  })
                : "for nyligt";

              return (
                <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        {item.category === "scenario" ? "Scenario" : "Fuld drøm"}
                      </Badge>
                      {scenarioName && <Badge variant="outline">{scenarioName}</Badge>}
                    </div>
                    <span className="text-xs text-slate-500">{timestamp}</span>
                  </div>

                  <p className="mt-3 text-sm font-medium text-slate-800">{item.dreamText}</p>
                  <div className="mt-3 rounded-md bg-white p-3 text-sm text-slate-700">
                    {formatPreview(item.interpretation)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
