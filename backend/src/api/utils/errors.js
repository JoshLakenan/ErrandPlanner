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

export class NotFoundError extends AppError {
  constructor(message = "The requested resource was not found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class InternalServerError extends AppError {
  constructor(
    message = "This operation failed due to an internal server error"
  ) {
    super(message, 500, "INTERNAL_SERVER_ERROR");
  }
}

export class ExternalServiceError extends AppError {
  constructor(
    message = "This operation failed due to an error in an external service"
  ) {
    super(message, 502, "EXTERNAL_SERVICE_ERROR");
  }
}
