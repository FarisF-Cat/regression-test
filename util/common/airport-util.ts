

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
