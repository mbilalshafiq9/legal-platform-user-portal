import ApiService from './ApiService';
// import ToastService from '../services/ToastService';

class AuthService {

  constructor(router) {
    this.router = router; // Store the router instance
  }

  async login(email, password) {
    try {
      const response = await ApiService.request({
        method: 'POST',
        url: 'system-users/auth/login',
        data: { email, password },
      });

      return response.data;
    } catch (error) {
      // Handle the error, you might want to show a toast notification or similar
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('admin');
    localStorage.removeItem('permissions');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('showWelcomeMessage');
    sessionStorage.removeItem('hasSeenWelcome');
    const basePath = process.env.REACT_APP_BASE_PATH || '/legal-platform-portal-demo';
    window.location.href = `${basePath}/login`;
  }
  
  isAuthenticated() {
    const user = this.getCurrentUser();
    const authStatus = localStorage.getItem('isAuthenticated');
    return !!(user && authStatus);
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('admin'));
  }
}

const authServiceInstance = new AuthService(/* pass your router instance here */);
export default authServiceInstance;
