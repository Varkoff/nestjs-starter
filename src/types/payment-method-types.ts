export type CustomerCreditCardType = {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  created: Date;
  canBeDeleted: boolean;
};

export type CustomerSepaDebitType = {
  id: string;
  bank_code: string;
  branch_code: string;
  country: string;
  last4: string;
  created: Date;
  canBeDeleted: boolean;
};
