#!/usr/bin/env -S deno run -A

const args = Deno.args;

const [name, version = "latest"] = args[0]?.split("@") || [];

if (!name) {
  console.error(
    "Usage: deno run -A https://honovel.deno.dev/create-project <name>@<version>\n" +
      "Example: deno run -A https://honovel.deno.dev/create-project my-app@1.0.0"
  );
  Deno.exit(1);
}

const repo = "https://github.com/kiratrizon/deno-honovel.git";

// Map 'latest' to 'master'
const branch = version === "latest" ? "master" : version;

// Step 1: Clone repo
console.log(`📥 Cloning branch '${branch}'...`);
const cloneArgs = ["clone", "--branch", branch, repo, name];

const clone = new Deno.Command("git", {
  args: cloneArgs,
  stdout: "inherit",
  stderr: "inherit",
});
const { code } = await clone.output();
if (code !== 0) Deno.exit(code);

// Step 2: Remove .git
console.log("🧹 Removing .git...");
await Deno.remove(`./${name}/.git`, { recursive: true });

// Step 3: Copy .env.example → .env
const envExamplePath = `./${name}/.env.example`;
const envPath = `./${name}/.env`;

try {
  await Deno.stat(envExamplePath);
  await Deno.copyFile(envExamplePath, envPath);
  console.log("✅ .env file created from .env.example");
} catch (err: any) {
  console.warn("⚠️ Skipping .env copy: " + err.message);
}

// Step 4: Migrate project using `honovel`
console.log("🚀 Running migration...");
const honovelPath = `./${name}/honovel`;

try {
  await Deno.chmod(honovelPath, 0o755);
} catch {
  // It's okay if it fails (e.g. already executable)
}

try {
  const migrate = new Deno.Command(honovelPath, {
    args: ["migrate"],
    cwd: name,
    stdout: "inherit",
    stderr: "inherit",
  });
  await migrate.output();
  console.log("✅ Migration completed");
} catch (err) {
  console.warn("⚠️ Migration failed. Trying as a TypeScript file...");

  try {
    const fallback = new Deno.Command("deno", {
      args: ["run", "-A", "honovel", "migrate"],
      cwd: name,
      stdout: "inherit",
      stderr: "inherit",
    });
    await fallback.output();
    console.log("✅ Migration completed (via deno run)");
  } catch (innerErr: any) {
    console.error("❌ Migration failed completely:", innerErr.message);
  }
}

console.log(`\n🎉 Project created in: ${name}`);
console.log(`\n➡️  Next steps:\n  cd ${name}\n  deno task dev`);
