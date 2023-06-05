import axios from "axios";
export default class HttpClient {
    private readonly x_auth_token;
    private readonly url;

    constructor(url: string, x_auth_token: string) {
        this.x_auth_token = x_auth_token;
        this.url = url;
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    }

    post = async (data: any, path: string, headers?: any) => {
        return await axios.post(`${this.url}/${path}`, data, {
            // insecureHTTPParser:true,
            headers: {
                'x-auth-token': this.x_auth_token,
                'Content-Type': 'application/json',
                ...headers
            },
        });
    }

    get = () => {

    }


}