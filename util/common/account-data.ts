// export class AccountUtil {

import { Account } from "pages/types/common/account";
import { TestData } from "pages/types/testdata";
import logger from '@wdio/logger'
const log = logger('AccountData')


// Create a mapping of the roles from your JSON to the internal roles used in AccountMap

export const fetchUser = (data: TestData, role: string): Account => {
  if (!data || !data.accounts) {
    throw new Error(" TEST DATA NOT FOUND OR ACCOUNTS NOT FOUND:");
  }

  log.debug("data in fetch user function: ", data);
  log.info("role in fetch user function : ", role);
  const user = data.accounts?.find((account) => account.role === role);
  if (!user) throw new Error(` User not found for role: ${role}`);
  log.info("user in fetch user function: ", user);
  log.info("user email in fetch user function: ", user.email);
  return user;
};
