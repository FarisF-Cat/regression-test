// export class AccountUtil {

import { Account } from "pages/types/common/account";
import { TestData } from "pages/types/testdata";

// Create a mapping of the roles from your JSON to the internal roles used in AccountMap

export const fetchUser = (data: TestData, role: string): Account => {
  if (!data || !data.accounts) {
    throw new Error(" TEST DATA NOT FOUND OR ACCOUNTS NOT FOUND:");
  }

  console.log("DATA IN FETCH USER FUNCTION: ", data);
  console.log("ROLE IN FETCH USER FUNCTION : ", role);
  const user = data.accounts?.find((account) => account.role === role);
  if (!user) throw new Error(` User not found for role: ${role}`);
  console.log("USER IN FETCH USER FUNCTION: ", user);
  console.log("USER EMAIL IN FETCH USER FUNCTION: ", user.email);
  return user;
};
