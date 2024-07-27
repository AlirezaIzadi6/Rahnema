export const asyncEvery = async (array: any[], fn: (element: any) => Promise<boolean>) => {
    for (const element of array) {
        if (!(await fn(element))) {
            return false;
        }
    }
    return true;
}