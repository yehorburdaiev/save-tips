import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** GitHub project pages live at /<repo>/; CI sets GITHUB_REPOSITORY=owner/repo */
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];

export default defineConfig({
  plugins: [react()],
  base: repo ? `/${repo}/` : "/",
});
