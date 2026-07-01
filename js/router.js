/**
 * Router - Handles page navigation and routing
 */
const Router = {
    routes: {},
    currentPage: 'home',
    currentUser: null,

    register(page, handler) {
        this.routes[page] = handler;
    },

    navigate(page, data) {
        if (this.routes[page]) {
            this.currentPage = page;
            this.routes[page](data);
            return true;
        }
        console.warn(`Route "${page}" not found`);
        return false;
    },

    getCurrentPage() {
        return this.currentPage;
    },

    setUser(user) {
        this.currentUser = user;
    },

    getUser() {
        return this.currentUser;
    }
};

window.Router = Router;