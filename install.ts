#!/usr/bin/env -S deno run -A

const args = Deno.args;

const [name, version = "latest"] = args[0]?.split("@") || [];

if (!name) {
  console.error(
    "Usage: deno run -A https://honovel.deno.dev/create-project <name>@<version>"
  );
  Deno.exit(1);
}

const repo = "https://github.com/kiratrizon/deno-honovel.git";

// Map 'latest' to 'master'
const branch = version === "latest" ? "master" : version;

const cloneArgs = ["clone"];
if (branch) {
  cloneArgs.push("--branch", branch);
}
cloneArgs.push(repo, name);

const clone = new Deno.Command("git", {
  args: cloneArgs,
  stdout: "inherit",
  stderr: "inherit",
});
const { code } = await clone.output();

if (code !== 0) {
  Deno.exit(code);
}

// Remove .git directory
await Deno.remove(`./${name}/.git`, { recursive: true });

// Step 3: Copy .env.example to .env if exists
const envExamplePath = `./${name}/.env.example`;
const envPath = `./${name}/.env`;

try {
  await Deno.stat(envExamplePath);
  await Deno.copyFile(envExamplePath, envPath);
} catch {
  // .env.example does not exist, do nothing
}

// Step 4: Migrate the project

const migrate = new Deno.Command("./honovel", {
  args: ["migrate"],
  cwd: name,
  stdout: "inherit",
  stderr: "inherit",
});
await migrate.output();

console.log(`\nProject created in: ${name}`);
console.log(`\nNext steps:\n  cd ${name}\n  deno task dev`);
