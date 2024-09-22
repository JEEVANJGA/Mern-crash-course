import { create } from 'zustand';

const githubUserProfileApi = 'https://api.github.com/users/JEEVANJGA';  // Replace with your GitHub username
export const useUserStore = create((set) => ({
    user: null,
    error: null,
    fetchUser: async () => {
        set({ loading: true, error: null });
        try {
            const response = await fetch(githubUserProfileApi);
            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }
            const data = await response.json();
            set({ user: data });
        } catch (error) {
            set({ error: error.message, });
        }
    },
}));
