type ExpenseItem = {
    debtorId: number,
    amount: number,
};

type Expense = {
    id: number,
    creditorId: number,
    groupId: number,
    description: string,
    debtors: ExpenseItem[],
};

type Transaction = {
    giverId: number,
    takerId: number,
    amount: number,
}

type Account = {
    memberId: number,
    account: number,
};