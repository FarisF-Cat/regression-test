// import { TestsData } from "pages/types/common/data-test";
// import { Route } from "pages/types/common/routes";


// export function getRandomCabOrigin(data: TestsData): Route {
//   const origins = data.routes ?? [];
//   const randomIndex = Math.floor(Math.random() * origins.length);
//   return origins[randomIndex];
// }



///    FUNCTION OF ROUTE THAT IS BEING  DONE BY ME , BY  CREATING THE NEW FUNTION , BUT THE ORIGINAL FUNCTION IS BEIG GIVEN IN THE CITIES-UTIL.TS 
import { TestsData } from "pages/types/common/data-test";
import { Route } from "pages/types/common/routes";

/** Returns one random Route object from test‑data. */
export function getRandomRoute(data: TestsData): Route {
  const routes = data.routes ?? [];
  if (!routes.length) {
    throw new Error("No routes in TestsData.routes");
  }
  const randomIndex = Math.floor(Math.random() * routes.length);
  return routes[randomIndex];
}

/** If you only care about the origin string: */
export function getRandomOrigin(data: TestsData): string {
  return getRandomRoute(data).origin ?? "";
}
