class ApiClient {

    static instance;

    constructor() {
        if (ApiClient.instance) {
            return ApiClient.instance;
        }

        this.baseUrl = "http://localhost:3000/";
        ApiClient.instance = this;
    }

    async request(endpoint, method = "GET", body = null, token = null) {
        const options = {
            method,
            headers: {
                "Authorization": `Bearer ${token}`,
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

    get(endpoint, token) {
        return this.request(endpoint, "GET", null, token);
    }

    post(endpoint, body, token) {
        return this.request(endpoint, "POST", body, token);
    }

    put(endpoint, body, token) {
        return this.request(endpoint, "PUT", body, token);
    }

    delete(endpoint, token) {
        return this.request(endpoint, "DELETE", token);
    }
}

const api = new ApiClient();

export default api;
