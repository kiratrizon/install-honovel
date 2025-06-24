#!/usr/bin/env -S deno run -A

const [name] = Deno.args;

if (!name) {
  console.error(
    "Usage: deno run -A https://honovel.deno.dev/create-project <name>"
  );
  Deno.exit(1);
}

if (name !== "create-project") {
  console.error("Only 'create-project' is supported.");
  Deno.exit(1);
}

const repo = "https://github.com/kiratrizon/deno-honovel.git";
const p = new Deno.Command("git", {
  args: ["clone", repo, name],
  stdout: "inherit",
  stderr: "inherit",
});
const { code } = await p.output();

console.log(`cd ${name}`);
console.log("deno task dev");
Deno.exit(code);
