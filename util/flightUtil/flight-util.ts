// // utils/loadTestData.ts

// ///CODE THAT IS USED TO LOAD THE DATA FROM THE  TESTDATA , WHERE THE DATA FOR TEH AIRPORT  IS BEING TAKEN ///
// // import { TestData } from '../../types/testdata';

// // import * as fs from "fs/promises";
// // import path from "path";
// // import { Airport } from "../../types/common/airport";

// // export async function loadTestData(): Promise<TestData> {
// //   const data = new TestData();

// //   // Load airports
// //   const airportsPath = path.resolve(__dirname, "../testdata/airports.json");
// //   const rawAirports = await fs.readFile(airportsPath, "utf-8");
// //   data.airports = JSON.parse(rawAirports) as Airport[];


// //   return data;
// // }



// // utils/loadTestData.ts

// // import { promises as fs } from "fs";
// // import * as path from "path";
// //  import { TestData } from '../../types/testdata';
// //  import { Airport } from "../../types/common/airport";


// // export async function loadTestData(): Promise<TestData> {
// //   console.log("Loading test data....................");
// //   const data = new TestData();
// //   console.log("TEST DATA LOADING....................");
// //   try {
// //     const accountsFilePath = path.resolve(__dirname, "../../testdata/accounts.json");
// //   const accountsData = await fs.readFile(accountsFilePath, "utf-8");
// //   data.accounts = JSON.parse(accountsData);

// //     const airportsPath = path.resolve(__dirname, "../../testdata/airports.json");
// //     console.log("__dirname: ...........................................................................", __dirname);

// //     console.log("AIRPORTS PATH:", airportsPath);
  
// //     const rawAirports = await fs.readFile(airportsPath, "utf-8");
// //     console.log("RAW AIRPORTS DATA:", rawAirports);
  
// //     data.airports = JSON.parse(rawAirports) as Airport[];
// //     console.log("PARSED AIRPORTS DATA:", data.airports);
// //   } catch (error) {
// //     console.error("Error while loading or parsing airport data?????????????????????????????????????????////:", error);
// //   }
  

// //   // Load airport data
// //   // const airportsPath = path.resolve(__dirname, "../testdata/airports.json");
// //   // console.log("AIRPORTS PATH:", airportsPath);
// //   // const rawAirports = await fs.readFile(airportsPath, "utf-8");
// //   // console.log("RAW AIRPORTS DATA:", rawAirports);
// //   // data.airports = JSON.parse(rawAirports) as Airport[];
// //   // console.log("PARSED AIRPORTS DATA:", data.airports);

// //   // You can load other files here as needed (e.g., accounts, env)
// //   console.log("RETURNING DATA LOADING +++++++++++++++++++++++++++++++++:", JSON.stringify(data, null, 2));


// //   return data;
// // }





// // import { Airport } from "./types/common/airport";
// import { Airport } from "../../pages/types/common/airport";
// import * as fs from "fs/promises";  
// import { TestData } from "pages/types/testdata";
// import path from "path";

// export async function loadTestData(): Promise<TestData> {
//   console.log("Loading test data....................");
//   const data = new TestData();

//   try {
//     const accountsFilePath = path.resolve(__dirname, "../../testdata/accounts.json");
//     console.log("__dirname: ", __dirname);
//     console.log("ACCOUNTS PATH ", accountsFilePath);
//     const accountsData = await fs.readFile(accountsFilePath, "utf-8");
//     console.log("ACCOUNT  DATA:", accountsData);

//     data.accounts = JSON.parse(accountsData);
//     console.log("PARSED ACCOUNT  DATA:", data.accounts);

//     const airportsPath = path.resolve(__dirname, "../../testdata/airports.json");
//     console.log("__dirname: ", __dirname);
//     console.log("AIRPORTS PATH:", airportsPath);

//     const rawAirports = await fs.readFile(airportsPath, "utf-8");
//     console.log("RAW AIRPORTS DATA:", rawAirports);

//     data.airports = JSON.parse(rawAirports) as Airport[];
//     console.log("PARSED AIRPORTS DATA:", data.airports);
//   } catch (error) {
//     console.error(" Error loading test data:", error);
//   }

//   return data;
// }
