import normalize from 'normalize-path';

export default class RestApi {
    constructor(path = '') {
        this.url = path.trim();
        this.url = normalize(this.url);

        this.headers = new Headers();
        this.headers.append('Accept', 'application/json');
        this.headers.append('Accept-Language', 'zh-CN;q=0.8,zh;q=0.6,en-US;q=0.4,en;q=0.2');
        this.headers.append('pragma', 'no-cache');
        this.headers.append('cache-control', 'no-cache');

        this.init = {
            method: 'GET',
            mode: 'same-origin',
            credentials: 'same-origin',
        };

        this.resources = this.resources.bind(this);
        this.setInit = this.setInit.bind(this);
        this.setHeaders = this.setHeaders.bind(this);
        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
        this.put = this.put.bind(this);
        this.delete = this.delete.bind(this);

        this.buildQueryStringFromObject = (object) => {
            const queries = [];
            Object.keys(object).map((key) => (
                queries.push(`${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`)
            ));
            return queries.join('&');
        };
    }

    resources(path = '') {
        this.url = path.trim() ? `${this.url}/${path.trim()}` : this.url;
        this.url = normalize(this.url);

        return this;
    }

    setInit(init = {}) {
        this.init = {
            ...this.init,
            ...init
        };

        return this;
    }

    setHeaders(headers = {}) {
        Object.keys(headers).forEach((key) => {
            this.headers.append(key, headers[key]);
        });

        return this;
    }

    get(query = {}) {
        this.url = query ? `${this.url}?${this.buildQueryStringFromObject(query)}` : this.url;

        return fetch(this.url, {
            ...this.init,
            headers: this.headers,
            method: 'GET',
        }).then((response) => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response;
        });
    }

    post(params) {
        return fetch(this.url, {
            ...this.init,
            headers: this.headers,
            method: 'POST',
            body: JSON.stringify(params),
        }).then((response) => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response;
        });
    }

    put() {
        return fetch(this.url, {
            ...this.init,
            headers: this.headers,
            method: 'PUT',
        }).then((response) => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response;
        });
    }

    delete() {
        return fetch(this.url, {
            ...this.init,
            headers: this.headers,
            method: 'DELETE',
        }).then((response) => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response;
        });
    }
}
