import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-4 text-white">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-slate-300">
          Dream Interpreter
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Drømmetolker
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
          Tolkningsflowet er klar til web og Android. Log ind for at fortsætte
          til appens hovedoplevelse.
        </p>
        <div className="mt-8">
          <a href={getLoginUrl()} className="inline-block">
            <Button size="lg" className="px-8">
              Log ind
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
