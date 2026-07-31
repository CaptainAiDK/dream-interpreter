import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { DANISH_UI } from "@shared/danish";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Streamdown } from "streamdown";

export default function FullDreamTab() {
  const [dreamText, setDreamText] = useState("");
  const [interpretation, setInterpretation] = useState<string | null>(null);

  const interpretMutation = trpc.dream.interpretFullDream.useMutation({
    onSuccess: (data) => {
      setInterpretation(data.interpretation);
      toast.success("Drøm tolket!");
    },
    onError: (error) => {
      toast.error(error.message || DANISH_UI.fullDream.error);
    },
  });

  const handleSubmit = () => {
    if (dreamText.length < 10) {
      toast.error(DANISH_UI.fullDream.minLength);
      return;
    }
    if (dreamText.length > 5000) {
      toast.error(DANISH_UI.fullDream.maxLength);
      return;
    }
    interpretMutation.mutate({ dreamText });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{DANISH_UI.fullDream.title}</CardTitle>
          <CardDescription>{DANISH_UI.fullDream.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              {DANISH_UI.fullDream.inputLabel}
            </label>
            <Textarea
              placeholder={DANISH_UI.fullDream.inputPlaceholder}
              value={dreamText}
              onChange={(e) => setDreamText(e.target.value)}
              rows={8}
              className="resize-none"
              disabled={interpretMutation.isPending}
            />
            <p className="text-xs text-slate-500">
              {dreamText.length}/5000 tegn
            </p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={interpretMutation.isPending || dreamText.length < 10}
            className="w-full"
          >
            {interpretMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {DANISH_UI.fullDream.analyzing}
              </>
            ) : (
              DANISH_UI.fullDream.submitButton
            )}
          </Button>
        </CardContent>
      </Card>

      {interpretation && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Tolkning</CardTitle>
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
