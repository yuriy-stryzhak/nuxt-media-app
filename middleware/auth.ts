// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
    const isAuthenticated = useState<boolean>('isAuthenticated').value;
    
    if (!isAuthenticated && to.path === '/favorites') {
      return navigateTo('/signin');
    }
  });
  