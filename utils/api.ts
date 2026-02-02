
// Mock API utility
const api = {
    post: async (endpoint: string, data: any) => {
        console.log(`POST request to ${endpoint}`, data);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ data: { success: true, token: "mock-token" } });
            }, 1000);
        });
    },
    get: async (endpoint: string) => {
        console.log(`GET request to ${endpoint}`);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ data: { success: true } });
            }, 500);
        });
    }
};

export default api;
