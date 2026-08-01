import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.dreaminterpreter.app",
  appName: "Dream Interpreter",
  webDir: "dist/public",
  server: {
    url: "https://dream-interpreter-production-c407.up.railway.app",
    androidScheme: "https",
    cleartext: true,
  },
};

export default config;
