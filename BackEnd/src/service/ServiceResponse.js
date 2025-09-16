class ServiceResponse {
    constructor(data = null, error = null) {
        this.data = data;
        this.error = error;
    }

    static success(data) {
        return new ServiceResponse(data, null);
    }

    static fail(error) {
        return new ServiceResponse(null, error);
    }
}

module.exports = ServiceResponse;
