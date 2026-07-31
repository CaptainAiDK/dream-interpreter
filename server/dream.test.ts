import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext; clearedCookies: any[] } {
  const clearedCookies: any[] = [];

  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };

  return { ctx, clearedCookies };
}

describe("dream router", () => {
  describe("getScenarios", () => {
    it("returns all available scenarios", async () => {
      const caller = appRouter.createCaller({} as any);
      const scenarios = await caller.dream.getScenarios();

      expect(scenarios).toBeDefined();
      expect(Array.isArray(scenarios)).toBe(true);
      expect(scenarios.length).toBeGreaterThan(0);

      scenarios.forEach((scenario) => {
        expect(scenario).toHaveProperty("id");
        expect(scenario).toHaveProperty("name");
        expect(scenario).toHaveProperty("description");
      });

      const scenarioIds = scenarios.map((s) => s.id);
      expect(scenarioIds).toContain("flying");
      expect(scenarioIds).toContain("water");
    });

    it("returns scenarios with Danish names", async () => {
      const caller = appRouter.createCaller({} as any);
      const scenarios = await caller.dream.getScenarios();

      const flyingScenario = scenarios.find((s) => s.id === "flying");
      expect(flyingScenario?.name).toBe("Flyve");
    });
  });

  describe("interpretFullDream", () => {
    it("requires authentication", async () => {
      const caller = appRouter.createCaller({} as any);

      try {
        await caller.dream.interpretFullDream({
          dreamText: "I had a strange dream about flying",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });

    it("validates dream text length", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.dream.interpretFullDream({
          dreamText: "short",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
      }
    });
  });

  describe("interpretScenario", () => {
    it("requires authentication", async () => {
      const caller = appRouter.createCaller({} as any);

      try {
        await caller.dream.interpretScenario({
          scenario: "flying",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });

    it("validates scenario enum", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.dream.interpretScenario({
          scenario: "invalid_scenario" as any,
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.code).toBe("BAD_REQUEST");
      }
    });
  });

  describe("getDreamHistory", () => {
    it("requires authentication", async () => {
      const caller = appRouter.createCaller({} as any);

      try {
        await caller.dream.getDreamHistory({});
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });
  });

  describe("getDream", () => {
    it("requires authentication", async () => {
      const caller = appRouter.createCaller({} as any);

      try {
        await caller.dream.getDream({ dreamId: 1 });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });
  });
});
