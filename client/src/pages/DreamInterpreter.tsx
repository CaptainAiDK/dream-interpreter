import { useState } from "react";
import { Button } from "@/components/ui/button";
import DreamHistory from "@/components/DreamHistory";
import FullDreamTab from "@/components/tabs/FullDreamTab";
import InformationTab from "@/components/tabs/InformationTab";
import ScenariosTab from "@/components/tabs/ScenariosTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/_core/hooks/useAuth";
import { DANISH_UI } from "@shared/danish";
import { getLoginUrl } from "@/const";

export default function DreamInterpreter() {
  const [activeTab, setActiveTab] = useState("full-dream");
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <h1 className="mb-3 text-3xl font-semibold tracking-tight text-slate-900">
            Drømmetolker
          </h1>
          <p className="mb-6 text-sm leading-6 text-slate-600">
            Log ind for at få adgang til drømmetolkning.
          </p>
          <a href={getLoginUrl()} className="block">
            <Button size="lg" className="w-full">
              {DANISH_UI.auth.login}
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Drømmetolker
            </h1>
            <p className="text-sm text-slate-600">
              Få indsigt i dine drømmes betydning
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user?.name}</span>
            <Button variant="outline" size="sm" onClick={() => logout()}>
              {DANISH_UI.auth.logout}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <DreamHistory />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 grid w-full grid-cols-3">
            <TabsTrigger value="full-dream">{DANISH_UI.tabs.fullDream}</TabsTrigger>
            <TabsTrigger value="scenarios">{DANISH_UI.tabs.scenarios}</TabsTrigger>
            <TabsTrigger value="information">
              {DANISH_UI.tabs.information}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="full-dream" className="space-y-4">
            <FullDreamTab />
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-4">
            <ScenariosTab />
          </TabsContent>

          <TabsContent value="information" className="space-y-4">
            <InformationTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
