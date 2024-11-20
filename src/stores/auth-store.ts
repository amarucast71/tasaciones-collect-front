import { defineStore } from 'pinia';
import { api } from 'boot/axios';

interface User {
  id: number;
  email: string;
  name: string;
  roles: string[];
}

interface AuthState {
  token: string;
  user: User;
}

interface JWT {
  user_id: number;
  exp: number;
}

const parseJwt = (token: string): JWT => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
};

const isValidToken = (token: string): boolean => {
  const currentDate = new Date();
  if (token) {
    const jwt = parseJwt(token);
    const expireDate = new Date(jwt.exp * 1000);
    return expireDate >= currentDate;
  }
  return false;
};

export const useAuthStore = defineStore('auth', {
  persistence: {
     enabled: true
  },

  state: (): AuthState => ({
    token: '',
    user: { id: 0, name: '', email: '', roles: [] },
  }),

  getters: {
    isValidToken(state: AuthState): boolean {
      return isValidToken(state.token);
    },

    isLoggedIn(state: AuthState): boolean {
      return isValidToken(state.token);
    },

    isAdmin(): boolean {
      return this.user.roles.includes('administrador')
    },

    userId(): number {
      return this.user.id
    }
  },

  actions: {
    setUser(data: { token: string; user: User }) {
      this.token = data.token;
      this.user = data.user;
      api.defaults.headers.common.Authorization = 'Bearer ' + this.token;
    },

    doLogout() {
      this.token = '';
      this.user = { id: 0, name: '', email: '', roles: [] };
      api.defaults.headers.common.Authorization = 'Bearer ';
    },
  },
});
