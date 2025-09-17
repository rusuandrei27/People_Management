class ServiceResponse {
    constructor(data = [], error = null) {
        this.data = data ? data : [];
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
