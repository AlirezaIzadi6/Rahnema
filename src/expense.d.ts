type ExpenseItem = {
    debtorId: number,
    amount: number,
};

type Expense = {
    creditorId: number,
    description: string,
    debtors: ExpenseItem[],
};
