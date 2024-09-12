class AppError extends Error {
  constructor(message, httpStatusCode, httpStatusDesc) {
    super(message);
    this.httpStatusCode = httpStatusCode;
    this.httpStatusDesc = httpStatusDesc;
  }
}

export class BadRequestError extends AppError {
  constructor(message = "This operation failed due to a bad request") {
    super(message, 400, "BAD_REQUEST");
  }
}

export class ConflictError extends AppError {
  constructor(message = "This operation failed due to a conflict") {
    super(message, 409, "CONFLICT");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "This operation failed due to unauthorized access") {
    super(message, 401, "UNAUTHORIZED");
  }
}
