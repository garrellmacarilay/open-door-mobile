// Mock API utility

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000/api";

const api = {
    post: async (endpoint: string, data: any) => {
        console.log(`POST request to ${BASE_URL}${endpoint}`, data);
        
        try {
            const res = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json' 
                },
                body: JSON.stringify(data)
            });
            const result = await res.json();
            return {data: result, status: res.status};
        } catch (error) {
            console.error(`Error occurred while making POST request to ${BASE_URL}${endpoint}:`, error);
            throw error;
        }
    },
    get: async (endpoint: string) => {
        console.log(`GET request to ${BASE_URL}${endpoint}`);
        try {
            const res = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            })
            const result = await res.json();
            return { data: result, status: res.status };

        } catch (error) {
            console.error(`Error occurred while making GET request to ${BASE_URL}${endpoint}:`, error);
            throw error;
        }
    }
};

export default api;
