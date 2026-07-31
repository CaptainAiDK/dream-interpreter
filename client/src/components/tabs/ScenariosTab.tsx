import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DANISH_UI } from "@shared/danish";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Streamdown } from "streamdown";

export default function ScenariosTab() {
  const [selectedScenario, setSelectedScenario] = useState<string>("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [scenarioName, setScenarioName] = useState<string>("");

  const scenariosQuery = trpc.dream.getScenarios.useQuery();

  const interpretMutation = trpc.dream.interpretScenario.useMutation({
    onSuccess: (data) => {
      setInterpretation(data.interpretation);
      setScenarioName(data.scenario);
      toast.success("Scenario tolket!");
    },
    onError: (error) => {
      toast.error(error.message || DANISH_UI.scenarios.error);
    },
  });

  const handleSubmit = () => {
    if (!selectedScenario) {
      toast.error("Vælg venligst et scenario");
      return;
    }
    interpretMutation.mutate({
      scenario: selectedScenario as any,
      additionalContext: additionalContext || undefined,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{DANISH_UI.scenarios.title}</CardTitle>
          <CardDescription>{DANISH_UI.scenarios.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              {DANISH_UI.scenarios.selectLabel}
            </label>
            <Select value={selectedScenario} onValueChange={setSelectedScenario}>
              <SelectTrigger disabled={interpretMutation.isPending}>
                <SelectValue
                  placeholder={DANISH_UI.scenarios.selectPlaceholder}
                />
              </SelectTrigger>
              <SelectContent>
                {scenariosQuery.data?.map((scenario) => (
                  <SelectItem key={scenario.id} value={scenario.id}>
                    {scenario.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              {DANISH_UI.scenarios.additionalContext}
            </label>
            <Textarea
              placeholder={DANISH_UI.scenarios.additionalContextPlaceholder}
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              rows={4}
              className="resize-none"
              disabled={interpretMutation.isPending}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={interpretMutation.isPending || !selectedScenario}
            className="w-full"
          >
            {interpretMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {DANISH_UI.scenarios.analyzing}
              </>
            ) : (
              DANISH_UI.scenarios.submitButton
            )}
          </Button>
        </CardContent>
      </Card>

      {interpretation && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900">
              Tolkning: {scenarioName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-slate-700">
              <Streamdown>{interpretation}</Streamdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
