import HttpKernel from "Illuminate/Foundation/Http/HttpKernel";
import VerifyCsrf from "../Middlewares/VerifyCsrf.ts";
class Kernel extends HttpKernel {
  protected override middlewareGroups = {
    web: [VerifyCsrf],
    api: [],
  };

  protected override routeMiddleware = {};
}

export default Kernel;
