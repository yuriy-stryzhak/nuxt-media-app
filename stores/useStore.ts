import { defineStore } from 'pinia';
import axios from 'axios';

// Interface for describing the state

interface Program {
  id: number;
  title: string;
  description: string;
  allimages: {
    landscape: {
      fullhd: string;
    };
  };
}

interface StoreState {
  loading: boolean;
  isAuthenticated: boolean;
  favorites: number[]; // List of favorite program IDs
  favoritesItems: Program[];
  favoritesData: any;
  favoritesLastPage: number;
  userToken: string | null; // User token for authentication
  loginErrorMessage: string;
  deviceId: string;
  deviceType: string;
  profileId: string | null;
  lang: string;
}

export const useStore = defineStore('main', {
  state: (): StoreState => ({
    loading: false,
    isAuthenticated: false,
    favorites: [],
    favoritesItems: [],
    favoritesData: null,
    userToken: null,
    favoritesLastPage: 1,
    loginErrorMessage: '',
    deviceId: 'ynt10qn1nhhkydsduew47m5m2k6xhx0',
    deviceType: 'browser',
    profileId: null,
    lang: 'en',
  }),

  actions: {
    // User login
    async login(email: string, password: string) {
    
      this.loginErrorMessage = '';

      try {
        const response = await axios.post('https://sat7.faulio.com/api/v1/login/signin', {
            email,
            password,
            captcha_token: '',
            device_os: 'Windows 10',
            device_type: this.deviceType,
            fcm_token: '',
            uniq_device_id: this.deviceId,
        });

        this.userToken = response.data.data.auth_token; // Presumably, the API returns a token
        this.profileId = response.data.profiles[0].id;
        
        this.isAuthenticated = true;
        // Save the token to localStorage for session restoration
        localStorage.setItem('userToken', '' + this.userToken);
        localStorage.setItem('profileId', '' + this.profileId);

      } catch (error: any) {

        if(error.response?.data.message) {
            this.loginErrorMessage = error.response.data.message;
        }
        console.error('Login failed:', error);
        this.isAuthenticated = false;
        this.userToken = null;
        this.profileId = null;
      }
    },

    // User logout
    logout() {
      this.isAuthenticated = false;
      this.loginErrorMessage = '';
      this.userToken = null;
      this.profileId = null;
      this.favorites = [];
      this.favoritesItems = [];
      this.favoritesData = null;
      this.favoritesLastPage = 1;
      localStorage.removeItem('userToken');
      localStorage.removeItem('profileId');
    },

    // Restore session (e.g., from localStorage)
    restoreSession() {
      const token = localStorage.getItem('userToken');
      const profileId = localStorage.getItem('profileId');
      if (token) {
        this.userToken = token;
        this.profileId = profileId;
        this.isAuthenticated = true;
        this.fetchFavorites(); // Load favorites
      }
    },

    // Fetch the list of favorite programs
    async fetchFavorites(page = 1) {
      if (this.userToken && this.profileId) {
        this.loading = true;
        try {
          const response = await axios.post(
            `https://sat7.faulio.com/api/v1.1/member/favorites/get?page=${page}&type=programs`,
            {},
            {
              headers: { 
                    Authorization: `${this.userToken}`,
                    Deviceid: this.deviceId,
                    Devicetype: this.deviceType,
                    Lang: this.lang,
                    Profile: this.profileId
                },
            }
          );
          
          if (page === 1) {
            this.favorites = response.data.list.map((program: any) => program.id);
            this.favoritesItems = response.data.list;
          } else {

            this.favorites = [
              ...this.favorites,
              ...response.data.list.map((program: any) => program.id),
            ];

            this.favoritesItems = [
              ...this.favoritesItems,
              ...response.data.list,
            ];
          }

          this.favoritesLastPage = response.data.last_page;
          this.favoritesData = response.data;

          this.loading = false;
          
        } catch (error) {
          this.loading = false;
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
              headers: {
                    Authorization: `${this.userToken}`,
                    Deviceid: this.deviceId,
                    Devicetype: this.deviceType,
                    Lang: this.lang,
                    Profile: this.profileId
              },
            }
          );
          this.favorites.push(programId);
          await this.fetchFavorites();
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
              headers: {
                    Authorization: `${this.userToken}`,
                    Deviceid: this.deviceId,
                    Devicetype: this.deviceType,
                    Lang: this.lang,
                    Profile: this.profileId
              },
            }
          );
          this.favorites = this.favorites.filter((id) => id !== programId);
          await this.fetchFavorites();
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
