// middleware/auth.ts
import { useStore } from '@/stores/useStore';

export default defineNuxtRouteMiddleware((to, from) => {
  const store = useStore();

  if (!store.isAuthenticated && to.path === '/favorites') {
    return navigateTo('/signin');
  }
});
