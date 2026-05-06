


// export function getRandomFutureDate(maxRange: number = 30): string {
//   const today = new Date();
//   const offset = Math.floor(Math.random() * (30 - 3 + 1)) + 3;
//   today.setDate(today.getDate() + offset);

//   return today.toLocaleDateString('en-GB', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric'
//   });
// }



// export function getRandomPastDate(): string {
//   const today = new Date();
//   const pastDate = new Date(); 
//   const particularDate = new Date(1999, 5, 11);
//   const offset = Math.floor(Math.random() * (40 - 20 + 1)) + 20;
//   today.setDate(today.getDate() + offset);
//   return particularDate.toLocaleDateString('en-GB', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric'
//   });
// }



export function getRandomRoundTripDates(maxDepartureRange = 30, maxReturnRange = 10): { departureDate: string, returnDate: string } {
  const today = new Date();

  //  Generate departure date (within the next maxDepartureRange days)
  const departureOffset = Math.floor(Math.random() * maxDepartureRange) + 1;
  const departureDate = new Date(today);
  departureDate.setDate(today.getDate() + departureOffset);

  //  Generate return date (within the next maxReturnRange days after departure)
  const returnOffset = Math.floor(Math.random() * maxReturnRange) + 1;
  const returnDate = new Date(departureDate);
  returnDate.setDate(departureDate.getDate() + returnOffset);
// Convert both to ISO date string (YYYY-MM-DD)
 const depDateStr = departureDate.toISOString().split('T')[0];
 const retDateStr = returnDate.toISOString().split('T')[0];

 // Extra safety check — if somehow same, increment return date by 1
if (depDateStr === retDateStr) {
  returnDate.setDate(returnDate.getDate() + 1);
}

return {
  departureDate: depDateStr,
  returnDate: returnDate.toISOString().split('T')[0]
};

}


export function getRandomMulticityDates(): { sector1Date: string; sector2Date: string } {
  // Set base date to midnight to avoid timezone issues
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Sector 1: random offset within 15 days
  const sector1Offset = Math.floor(Math.random() * 15) + 1;
  const sector1Date = new Date(today.getTime()); // clone
  sector1Date.setDate(today.getDate() + sector1Offset);

  // Sector 2: offset 1–5 days AFTER sector 1
  const sector2Offset = Math.floor(Math.random() * 5) + 1;
  const sector2Date = new Date(sector1Date.getTime()); // clone
  sector2Date.setDate(sector1Date.getDate() + sector2Offset);

  // Format both
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Final validation: sector2 MUST be after sector1
  if (sector2Date.getTime() <= sector1Date.getTime()) {
    sector2Date.setDate(sector1Date.getDate() + 1);
  }

  console.log(`📅 Sector 1 Date: ${formatDate(sector1Date)}`);
  console.log(`📅 Sector 2 Date: ${formatDate(sector2Date)}`);

  return {
    sector1Date: formatDate(sector1Date),
    sector2Date: formatDate(sector2Date),
  };
}



export function getRandomDates(): { checkin: string; checkout: string } {
  const now = new Date();

  // Randomly choose a check-in date between 3 and 10 days from today
  const checkinOffset = Math.floor(Math.random() * 8) + 3; // 3 to 10
  const checkinDate = new Date(now);
  checkinDate.setDate(now.getDate() + checkinOffset);

  // Randomly choose a checkout date 1 to 5 days after check-in
  const checkoutOffset = Math.floor(Math.random() * 5) + 1; // 1 to 5
  const checkoutDate = new Date(checkinDate);
  checkoutDate.setDate(checkinDate.getDate() + checkoutOffset);

  // Format as YYYY-MM-DD (or any format your app expects)
  const format = (d: Date) => d.toISOString().split('T')[0];

  return {
    checkin: format(checkinDate),
    checkout: format(checkoutDate),
  };

  
}

