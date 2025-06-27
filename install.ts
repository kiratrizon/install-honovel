#!/usr/bin/env -S deno run -A

const [name] = Deno.args;

if (!name) {
  console.error(
    "Usage: deno run -A https://honovel.deno.dev/create-project <name>"
  );
  Deno.exit(1);
}

const repo = "https://github.com/kiratrizon/deno-honovel.git";

// Clone the repo
const clone = new Deno.Command("git", {
  args: ["clone", repo, name],
  stdout: "inherit",
  stderr: "inherit",
});
const { code } = await clone.output();

if (code !== 0) {
  Deno.exit(code);
}

// Remove .git directory
await Deno.remove(`${name}/.git`, { recursive: true });

console.log(`\nProject created in: ${name}`);
console.log(`\nNext steps:\n  cd ${name}\n  deno task dev`);
