type ExpenseItem = {
    creditorId: number,
    debtorId: number,
    amount: number,
};

type Expense = {
    id: number,
    creditorId: number,
    description: string,
    debtors: ExpenseItem[],
};
