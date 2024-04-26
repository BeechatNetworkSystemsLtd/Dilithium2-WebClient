import axios, { AxiosInstance, AxiosError, AxiosResponse } from "axios";

const axiosClient = (publickey: string | null = null, signature: string | null = null, challenge: string | null = null): AxiosInstance => {
    const headers = {
        publickey: publickey,
        signature: signature,
        challenge: challenge,
    };

    const client = axios.create({
        baseURL: import.meta.env.VITE_BASE_URL,
        headers,
        timeout: 60000,
        withCredentials: false,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    client.interceptors.request.use((config: any) => {
        config.headers = config.headers || {};
        return config;
    });

    client.interceptors.response.use(
        (response: AxiosResponse) => {
            return response;
        },
        (error: AxiosError) => {
            try {
                const { response } = error;
                if (response?.status === 401) {
                    throw error;
                }
            } catch (e) {
                console.error(e);
            }
            throw error;
        }
    );

    return client;
};

export default axiosClient;
