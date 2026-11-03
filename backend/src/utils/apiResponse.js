class ApiResponse {
  constructor(statusCode, data, message = 'Success', pagination = null) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
    if (pagination || (data && data.pagination)) {
      this.pagination = pagination || data.pagination;
    }
  }

  static success(res, data, message = 'Success', statusCode = 200, pagination = null) {
    const pageMeta = pagination || (data && data.pagination ? data.pagination : null);
    return res.status(statusCode).json(new ApiResponse(statusCode, data, message, pageMeta));
  }
}

module.exports = ApiResponse;
