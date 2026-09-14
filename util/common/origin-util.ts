// import { TestData } from "pages/types/common/data-test";
// import { Route } from "pages/types/common/routes";


// export function getRandomCabOrigin(data: TestData): Route {
//   const origins = data.routes ?? [];
//   const randomIndex = Math.floor(Math.random() * origins.length);
//   return origins[randomIndex];
// }



///    FUNCTION OF ROUTE THAT IS BEING  DONE BY ME , BY  CREATING THE NEW FUNTION , BUT THE ORIGINAL FUNCTION IS BEIG GIVEN IN THE CITIES-UTIL.TS 
import { TestData } from "../../pages/types/testdata";
import { Route } from "pages/types/common/routes";

/** Returns one random Route object from test‑data. */
export function getRandomRoute(data: TestData): Route {
  const routes = data.routes ?? [];
  if (!routes.length) {
    throw new Error("No routes in TestData.routes");
  }
  const randomIndex = Math.floor(Math.random() * routes.length);
  return routes[randomIndex];
}

/** If you only care about the origin string: */
export function getRandomOrigin(data: TestData): string {
  return getRandomRoute(data).origin ?? "";
}
