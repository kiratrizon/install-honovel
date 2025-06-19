import Route from "Illuminate/Support/Facades/Route";

Route.get("/", async function () {
  return response().json({
    message: "Welcome to the API",
  });
});

export default Route;
