import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const distAssets = "dist/assets";
const files = readdirSync(distAssets).filter((name) => name.endsWith(".js"));
const bundle = files
  .map((name) => readFileSync(join(distAssets, name), "utf8"))
  .join("\n");

const measurementId = process.env.EXPECTED_MEASUREMENT_ID;
const hasMeasurement = measurementId
  ? bundle.includes(measurementId)
  : /G-[A-Z0-9]+/.test(bundle);

const hasProject = bundle.includes("firebaseapp.com");

if (!hasMeasurement || !hasProject) {
  console.error(
    "Firebase Analytics config was NOT embedded in the production build.\n" +
      "Add all VITE_FIREBASE_* secrets in GitHub → Settings → Secrets → Actions, then redeploy.",
  );
  process.exit(1);
}

console.log("Firebase Analytics config found in build output.");
