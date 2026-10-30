import type { AccountType } from "../types";

export const session: {
  accountType: AccountType | null;
  employeeId: number | null;
  employeeName: string | null;
} = {
  accountType: null,
  employeeId: null,
  employeeName: null,
};
