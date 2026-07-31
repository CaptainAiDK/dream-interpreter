import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DANISH_UI } from "@shared/danish";
import FullDreamTab from "@/components/tabs/FullDreamTab";
import ScenariosTab from "@/components/tabs/ScenariosTab";
import InformationTab from "@/components/tabs/InformationTab";
import DreamHistory from "@/components/DreamHistory";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";

export default function DreamInterpreter() {
  const [activeTab, setActiveTab] = useState("full-dream");
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Drømmetolker
          </h1>
          <p className="text-slate-600 mb-6">
            Log ind for at få adgang til drømmetolkning
          </p>
          <a href={getLoginUrl()}>
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
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Drømmetolker</h1>
            <p className="text-sm text-slate-600">
              Få indsigt i dine drømmes betydning
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user?.name}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => logout()}
            >
              {DANISH_UI.auth.logout}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <DreamHistory />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="full-dream">
              {DANISH_UI.tabs.fullDream}
            </TabsTrigger>
            <TabsTrigger value="scenarios">
              {DANISH_UI.tabs.scenarios}
            </TabsTrigger>
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
