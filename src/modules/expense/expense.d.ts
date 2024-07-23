type ExpenseItem = {
    debtorId: number,
    amount: number,
};

type Expense = {
    id: number,
    creditorId: number,
    description: string,
    debtors: ExpenseItem[],
};
