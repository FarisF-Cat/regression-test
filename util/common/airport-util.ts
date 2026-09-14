

interface Airport {
  airport: string;
  type: string;
}

////////////////////////////////////////CORRECT CODE FOR RANDOM AIRPORT SELECTION///////////////////////////////////////
// export function getRandomDomesticAirports(airports: Airport[]): { origin: string; destination: string } {
//   const domestic = airports.filter(airport => airport.type === 'DOMESTIC');
//   const origin = domestic[Math.floor(Math.random() * domestic.length)].airport;
//   let destination = origin;
//   while (destination === origin) {
//     destination = domestic[Math.floor(Math.random() * domestic.length)].airport;
//   }
//   return { origin, destination };
// }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function getRandomDomesticAirports(airports: Airport[]): { origin: string; destination: string } {
  const domestic = airports.filter(airport => airport.type === 'DOMESTIC');
  const origin = domestic[Math.floor(Math.random() * domestic.length)].airport;
  let destination = origin;
  while (destination === origin) {
    destination = domestic[Math.floor(Math.random() * domestic.length)].airport;
  }
  return { origin, destination };
}

/**
 * Pick two distinct airports that are not in `exclude`.
 * Previously re-implemented in add-flight-page, add-flight-hotel-page and
 * add-flight-hotel-cab-page.
 */
export function getTwoUniqueAirports(
  exclude: string[],
  airports: string[],
): [string, string] {
  const filtered = airports.filter((a) => !exclude.includes(a));
  if (filtered.length < 2)
    throw new Error("Not enough unique airports for sector 2");
  const shuffled = filtered.sort(() => 0.5 - Math.random());
  return [shuffled[0], shuffled[1]];
}
