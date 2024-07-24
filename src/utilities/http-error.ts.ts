export class HttpError extends Error {
    constructor(public status: number, public message: string) {
        super(message);
    }
}

export class NotFoundError extends HttpError {
    constructor(public message: string) {
        super(404, message)
    }
}