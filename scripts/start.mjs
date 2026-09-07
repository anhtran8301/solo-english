import { cpSync } from "node:fs";
cpSync(new URL("../public", import.meta.url), new URL("../.next/standalone/public", import.meta.url), { recursive: true });
cpSync(new URL("../.next/static", import.meta.url), new URL("../.next/standalone/.next/static", import.meta.url), { recursive: true });
process.env.HOSTNAME ||= "127.0.0.1";
await import("../.next/standalone/server.js");
