import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DANISH_UI } from "@shared/danish";
import { Streamdown } from "streamdown";

export default function InformationTab() {
  const sections = [
    {
      title: DANISH_UI.information.sections.introduction.title,
      content: DANISH_UI.information.sections.introduction.content,
    },
    {
      title: DANISH_UI.information.sections.symbolism.title,
      content: DANISH_UI.information.sections.symbolism.content,
    },
    {
      title: DANISH_UI.information.sections.psychology.title,
      content: DANISH_UI.information.sections.psychology.content,
    },
    {
      title: DANISH_UI.information.sections.interpretation.title,
      content: DANISH_UI.information.sections.interpretation.content,
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-900">
            {DANISH_UI.information.title}
          </CardTitle>
          <CardDescription className="text-purple-700">
            {DANISH_UI.information.subtitle}
          </CardDescription>
        </CardHeader>
      </Card>

      {sections.map((section, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-lg">{section.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-slate-700 space-y-4">
              <Streamdown>{section.content}</Streamdown>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="bg-slate-50 border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">Vigtige noter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-700">
          <p>
            <strong>Personlig fortolkning:</strong> Drømmetolkning er subjektiv.
            De tolkninger, som denne app giver, er baseret på almindelig
            symbolisme og psykologisk viden, men kun du kan afgøre, hvad dine
            drømme betyder for dig.
          </p>
          <p>
            <strong>Professionel hjælp:</strong> Hvis dine drømme forårsager
            betydelig angst eller påvirker din daglige funktion, bør du
            konsultere en psykolog eller terapeut.
          </p>
          <p>
            <strong>Søvnkvalitet:</strong> Husk, at god søvnkvalitet er vigtig
            for din sundhed. Hvis du har søvnproblemer, kan du søge råd hos en
            læge.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
