import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from '../stores/auth-store';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

const api = axios.create({ baseURL: process.env.API });

export default boot(({ app }) => {
  setTimeout(() => {
    const authStore = useAuthStore()
    const token = authStore.token || ''
    api.defaults.headers.common.Authorization = 'Bearer ' + token
  }, 200)

  app.config.globalProperties.$axios = axios;

  app.config.globalProperties.$api = api;
});

export { api };
