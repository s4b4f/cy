import { execSync } from "node:child_process";

function run(command) {
  execSync(command, {
    stdio: "inherit"
  });
}

run("npm run prisma:generate");

if (process.env.VERCEL_ENV === "production") {
  run("npm run prisma:migrate:deploy");
} else {
  console.log("Skipping prisma migrate deploy for non-production deployment.");
}

run("next build");

