export function isUserArray(data: User[]): data is User[] {
    return Array.isArray(data) && data.every(u => isUser(u));
}

export function isUser(data: User): data is User {
    return typeof(data.id) === "number" && typeof(data.name) === "string";
}