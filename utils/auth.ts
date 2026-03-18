import api from "./api";

export interface User {
  id: number;
  full_name: string;
  role: string;
  email?: string;
  profile_picture?: string;
  // Add any other fields your Laravel backend returns
}

/**
 * Returns the user object if the token is valid, otherwise returns null.
 * The return type Promise<User | null> tells TS to expect either the data or a failure.
 */
export const getUserFromToken = async (): Promise<User | null> => {
  try {
    const { data } = await api.get('/show/user'); 
    
    // We assume your Laravel backend wraps the user in a 'user' key
    return data.user as User; 
  } catch (err) {
    // If the 401 Unauthorized or any error occurs, we return null
    console.error("Auth check failed:", err);
    return null; 
  }
};