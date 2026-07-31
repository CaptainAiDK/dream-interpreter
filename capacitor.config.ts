import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.dreaminterpreter.app",
  appName: "Dream Interpreter",
  webDir: "dist/public",
  server: {
    androidScheme: "https",
    cleartext: true,
  },
};

export default config;