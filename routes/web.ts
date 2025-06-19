import Route from "Illuminate/Support/Facades/Route";

Route.get("/", async (_) => {
  return "Welcome to the Deno Honovel Installer!";
});

Route.get("/install", async (_) => {
  return response().file(basePath("install.ts")).withHeaders({
    "Content-Type": "application/typescript",
  });
});
export default Route;
