// import { LocalStorage } from 'quasar'
import { useAuthStore } from 'stores/auth-store';
import { boot } from 'quasar/wrappers';

export default boot(({ router }) => {
  router.beforeEach((to, from, next) => {
    setTimeout(() => {
      const requiredAuth = to.matched.some((record) => record.meta.requiresAuth);
      const requiredRoles = to.meta.requiredRoles
      const isRequiresRoles = Array.isArray(requiredRoles)
      const guest = to.matched.some((record) => record.meta.guest);
      const authStore = useAuthStore();

      let isValidRole = true
      if (isRequiresRoles) {
        isValidRole = requiredRoles.filter(x => authStore.user.roles.includes(x)).length > 0
      }

      if (requiredAuth) {
        if (isRequiresRoles) {
          if (isValidRole && authStore.isValidToken) {
            next()
          } else if (!authStore.isValidToken) {
            next('/login')
          } else {
            next('/error403')
          }
        } else {
          if (authStore.isLoggedIn && authStore.isValidToken) {
            next()
          } else {
            next('/login')
          }
        }
        if (authStore.isValidToken) {
          next();
        } else {
          next('/login');
        }
      } else if (guest) {
        if (!authStore.isValidToken) {
          next();
        } else {
          next('/');
        }
      } else {
        next();
      }
    }, 300);
  });
});
