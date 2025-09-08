class ApiClient {

    static instance;

    constructor() {
        if (ApiClient.instance) {
            return ApiClient.instance;
        }

        this.baseUrl = "http://localhost:3000/";
        ApiClient.instance = this;
    }

    async request(endpoint, method = "GET", body = null) {
        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
            },
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        let response = null;
        let data = null;

        try {
            response = await fetch(`${this.baseUrl}${endpoint}`, options);

            try {
                data = await response.json();
            } catch (err) {
                data = null;
            }

        } catch (err) { }

        return {
            "ok": response ? response.ok : false,
            "errorMessage": data ? data.error : null,
            "data": data
        };
    }

    get(endpoint) {
        return this.request(endpoint, "GET");
    }

    post(endpoint, body) {
        return this.request(endpoint, "POST", body);
    }

    put(endpoint, body) {
        return this.request(endpoint, "PUT", body);
    }

    delete(endpoint) {
        return this.request(endpoint, "DELETE");
    }
}

const api = new ApiClient();

export default api;
