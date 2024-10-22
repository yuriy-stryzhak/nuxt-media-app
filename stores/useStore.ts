import { defineStore } from 'pinia';
import axios from 'axios';

// Interface for describing the state
interface StoreState {
  isAuthenticated: boolean;
  favorites: number[]; // List of favorite program IDs
  userToken: string | null; // User token for authentication
}

export const useStore = defineStore('main', {
  state: (): StoreState => ({
    isAuthenticated: false,
    favorites: [],
    userToken: null,
  }),

  actions: {
    // User login
    async login(email: string, password: string) {
      try {
        const response = await axios.post('https://sat7.faulio.com/api/v1/login/signin', {
          email,
          password,
        });
        this.userToken = response.data.token; // Presumably, the API returns a token
        this.isAuthenticated = true;
        // Save the token to localStorage for session restoration
        localStorage.setItem('userToken', 'Bearer ' + this.userToken);
        // localStorage.setItem('userToken', this.userToken);
      } catch (error) {
        console.error('Login failed:', error);
        this.isAuthenticated = false;
        this.userToken = null;
      }
    },

    // User logout
    logout() {
      this.isAuthenticated = false;
      this.userToken = null;
      this.favorites = [];
      localStorage.removeItem('userToken');
    },

    // Restore session (e.g., from localStorage)
    restoreSession() {
      const token = localStorage.getItem('userToken');
      if (token) {
        this.userToken = token;
        this.isAuthenticated = true;
        this.fetchFavorites(); // Load favorites
      }
    },

    // Fetch the list of favorite programs
    async fetchFavorites() {
      if (this.userToken) {
        try {
          const response = await axios.post(
            'https://sat7.faulio.com/api/v1.1/member/favorites/get?page=1&type=programs',
            {},
            {
              headers: { Authorization: `Bearer ${this.userToken}` },
            }
          );
          this.favorites = response.data.data.map((program: any) => program.id); // Presumably
        } catch (error) {
          console.error('Failed to fetch favorites:', error);
        }
      }
    },

    // Add a program to favorites
    async addToFavorites(programId: number) {
      if (this.userToken) {
        try {
          await axios.get(
            `https://sat7.faulio.com/api/v1/member/favorites/add?program=${programId}`,
            {
              headers: { Authorization: `Bearer ${this.userToken}` },
            }
          );
          this.favorites.push(programId);
        } catch (error) {
          console.error('Failed to add favorite:', error);
        }
      }
    },

    // Remove a program from favorites
    async removeFromFavorites(programId: number) {
      if (this.userToken) {
        try {
          await axios.get(
            `https://sat7.faulio.com/api/v1/member/favorites/remove?program=${programId}`,
            {
              headers: { Authorization: `Bearer ${this.userToken}` },
            }
          );
          this.favorites = this.favorites.filter((id) => id !== programId);
        } catch (error) {
          console.error('Failed to remove favorite:', error);
        }
      }
    },

    // Toggle favorite (add/remove)
    async toggleFavorite(programId: number) {
      if (this.favorites.includes(programId)) {
        await this.removeFromFavorites(programId);
      } else {
        await this.addToFavorites(programId);
      }
    },
  },
});
