import Route from "Illuminate/Support/Facades/Route";

Route.get("/", async (_) => {
  return "Welcome to the Deno Honovel Installer!";
});
export default Route;
