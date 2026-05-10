class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode < 400;
    
    if (data && typeof data === 'object') {
      Object.assign(this, data);
    } else if (data !== undefined) {
      this.data = data;
    }
  }
}

module.exports = ApiResponse;
