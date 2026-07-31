import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  createDream,
  getUserDreams,
  getDreamById,
  updateDreamInterpretation,
  createDreamInterpretation,
  getDreamInterpretation,
} from "../db";
import { invokeLLM } from "../_core/llm";

/**
 * Danish dream interpretation scenarios
 */
const DREAM_SCENARIOS = {
  flying: { da: "Flyve", en: "Flying" },
  falling: { da: "Falde", en: "Falling" },
  water: { da: "Vand", en: "Water" },
  animals: { da: "Dyr", en: "Animals" },
  people: { da: "Mennesker", en: "People" },
  chase: { da: "Forfølgelse", en: "Chase" },
  death: { da: "Død", en: "Death" },
  house: { da: "Hus", en: "House" },
  school: { da: "Skole", en: "School" },
  work: { da: "Arbejde", en: "Work" },
};

export const dreamRouter = router({
  /**
   * Interpret a full dream text
   */
  interpretFullDream: protectedProcedure
    .input(
      z.object({
        dreamText: z.string().min(10).max(5000),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Create dream record in database
        const dreamResult = await createDream({
          userId: ctx.user.id,
          dreamText: input.dreamText,
          category: "full_dream",
        });

        // Get the dream ID from the result (SQLite returns the object directly)
        const dreamId = dreamResult.id;

        // Generate interpretation using LLM
        const systemPrompt = `Du er en erfaren drømmetolker med viden om psykologi, symbolisme og kulturelle betydninger. 
Analyser drømmen på dansk og giv en dybdegående fortolkning.
Strukturer dit svar med følgende sektioner:
1. Symbolanalyse: Analyser de vigtigste symboler i drømmen
2. Psykologiske indsigter: Hvad kan drømmen fortælle om personens indre verden
3. Følelsestemaer: Hvilke følelser og temaer er til stede
4. Anbefalinger: Praktiske råd til at arbejde med drømmen`;

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: `Analyser denne drøm: "${input.dreamText}"`,
            },
          ],
        });

        const interpretation = response.text || "Kunne ikke generere tolkning";

        // Update dream with interpretation
        await updateDreamInterpretation(dreamId, interpretation);

        return {
          success: true,
          dreamId,
          interpretation,
        };
      } catch (error) {
        console.error("Error interpreting dream:", error);
        throw new Error("Fejl ved tolkning af drøm");
      }
    }),

  /**
   * Interpret a scenario-based dream
   */
  interpretScenario: protectedProcedure
    .input(
      z.object({
        scenario: z.enum(Object.keys(DREAM_SCENARIOS) as [string, ...string[]]),
        additionalContext: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const scenarioName = DREAM_SCENARIOS[input.scenario as keyof typeof DREAM_SCENARIOS];

        // Create dream record
        const dreamResult = await createDream({
          userId: ctx.user.id,
          dreamText: `Scenario: ${scenarioName.da}${input.additionalContext ? ` - ${input.additionalContext}` : ""}`,
          category: "scenario",
          scenarioType: input.scenario,
        });

        const dreamId = dreamResult.id;

        // Generate scenario-specific interpretation
        const systemPrompt = `Du er en erfaren drømmetolker. Giv en kort, fokuseret tolkning af denne drømscenario på dansk.
Vær konkret og praktisk i dine anbefalinger.`;

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: `Tolks denne drømscenario: ${scenarioName.da}${input.additionalContext ? `. Yderligere kontekst: ${input.additionalContext}` : ""}`,
            },
          ],
        });

        const interpretation = response.text || "Kunne ikke generere tolkning";

        await updateDreamInterpretation(dreamId, interpretation);

        return {
          success: true,
          dreamId,
          scenario: scenarioName.da,
          interpretation,
        };
      } catch (error) {
        console.error("Error interpreting scenario:", error);
        throw new Error("Fejl ved tolkning af scenario");
      }
    }),

  /**
   * Get user's dream history
   */
  getDreamHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(50).default(10),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const history = await getUserDreams(ctx.user.id, input.limit);
        return history;
      } catch (error) {
        console.error("Error fetching dream history:", error);
        throw new Error("Fejl ved hentning af drømmehistorie");
      }
    }),

  /**
   * Get a specific dream with its interpretation
   */
  getDream: protectedProcedure
    .input(
      z.object({
        dreamId: z.number().int(),
      })
    )
    .query(async ({ input, ctx }) => {
      try {
        const dream = await getDreamById(input.dreamId);

        if (!dream) {
          throw new Error("Drøm ikke fundet");
        }

        if (dream.userId !== ctx.user.id) {
          throw new Error("Adgang nægtet");
        }

        const interpretation = await getDreamInterpretation(input.dreamId);

        return {
          dream,
          interpretation,
        };
      } catch (error) {
        console.error("Error fetching dream:", error);
        throw new Error("Fejl ved hentning af drøm");
      }
    }),

  /**
   * Get available scenarios
   */
  getScenarios: publicProcedure.query(async () => {
    return Object.entries(DREAM_SCENARIOS).map(([key, value]) => ({
      id: key,
      name: value.da,
      description: `Tolkning af drømme om ${value.da.toLowerCase()}`,
    }));
  }),
});
