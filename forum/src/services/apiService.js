const API_BASE_URL = 'http://localhost:5001/api';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
        };
    }

    // Helper method to get auth headers
    getAuthHeaders() {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        return {
            ...this.defaultHeaders,
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    }

    // Generic request method
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            credentials: 'include',
            headers: this.getAuthHeaders(),
            ...options,
        };

        try {
            const response = await fetch(url, config);
            
            // Handle different response types
            const contentType = response.headers.get('content-type');
            let data;
            
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
            }

            return data;
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            throw error;
        }
    }

    // Authentication APIs
    async login(email, password) {
        return this.request('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }

    async register(userData) {
        return this.request('/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async logout() {
        return this.request('/logout', {
            method: 'POST'
        });
    }

    async getCurrentUser() {
        return this.request('/user');
    }

    async updateUser(userData) {
        return this.request('/user', {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    }

    // Venue APIs
    async getVenues(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`/venues?${params}`);
    }

    async getVenue(venueId) {
        return this.request(`/venue/${venueId}`);
    }

    async createVenue(venueData) {
        return this.request('/venue', {
            method: 'POST',
            body: JSON.stringify(venueData)
        });
    }

    async updateVenue(venueId, venueData) {
        return this.request(`/venue/${venueId}`, {
            method: 'PUT',
            body: JSON.stringify(venueData)
        });
    }

    async deleteVenue(venueId) {
        return this.request(`/venue/${venueId}`, {
            method: 'DELETE'
        });
    }

    async searchVenues(query, filters = {}) {
        const params = new URLSearchParams({ q: query, ...filters });
        return this.request(`/search/venues?${params}`);
    }

    // Booking APIs
    async createBooking(bookingData) {
        return this.request('/booking', {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });
    }

    async getBooking(bookingId) {
        return this.request(`/booking/${bookingId}`);
    }

    async submitBookingReview(bookingId, reviewData) {
        return this.request(`/booking/${bookingId}/review`, {
            method: 'POST',
            body: JSON.stringify(reviewData)
        });
    }

    async getBookings(userId = null) {
        const endpoint = userId ? `/bookings/user/${userId}` : '/bookings';
        return this.request(endpoint);
    }

    async updateBookingStatus(bookingId, status) {
        return this.request(`/booking/${bookingId}`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    }

    async cancelBooking(bookingId) {
        return this.request(`/booking/${bookingId}/cancel`, {
            method: 'PUT'
        });
    }

    // Review APIs
    async createReview(venueId, reviewData) {
        return this.request(`/venue/${venueId}/review`, {
            method: 'POST',
            body: JSON.stringify(reviewData)
        });
    }

    async getVenueReviews(venueId) {
        return this.request(`/venue/${venueId}/reviews`);
    }

    async getVenueRatingsLast7(venueId) {
        return this.request(`/venue/${venueId}/ratings/last7`);
    }

    // Payment APIs
    async processPayment(paymentData) {
        return this.request('/payment/process', {
            method: 'POST',
            body: JSON.stringify(paymentData)
        });
    }

    async getPaymentHistory(userId) {
        return this.request(`/payments/user/${userId}`);
    }

    // Notification APIs
    async getNotifications(userId) {
        return this.request(`/notifications/user/${userId}`);
    }

    async markNotificationAsRead(notificationId) {
        return this.request(`/notification/${notificationId}/read`, {
            method: 'PUT'
        });
    }

    async markAllNotificationsAsRead(userId) {
        return this.request(`/notifications/user/${userId}/read-all`, {
            method: 'PUT'
        });
    }

    // Availability APIs
    async getVenueAvailability(venueId, date) {
        const params = new URLSearchParams({ date });
        return this.request(`/venue/${venueId}/availability?${params}`);
    }

    async updateVenueAvailability(venueId, availabilityData) {
        return this.request(`/venue/${venueId}/availability`, {
            method: 'PUT',
            body: JSON.stringify(availabilityData)
        });
    }

    // Dashboard APIs
    async getDashboardStats(userId) {
        return this.request(`/dashboard/stats?user_id=${userId}`);
    }

    async getOwnerDashboardData(userId) {
        return this.request(`/dashboard/owner/${userId}`);
    }

    async getPlayerDashboardData(userId) {
        return this.request(`/dashboard/player/${userId}`);
    }

    // Matches APIs (secondary DB)
    async getMatches(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`/matches?${params}`);
    }

    async createMatch(matchData) {
        return this.request('/matches', {
            method: 'POST',
            body: JSON.stringify(matchData)
        });
    }

    async updateMatch(matchId, matchData) {
        return this.request(`/matches/${matchId}`, {
            method: 'PUT',
            body: JSON.stringify(matchData)
        });
    }

    async deleteMatch(matchId) {
        return this.request(`/matches/${matchId}`, {
            method: 'DELETE'
        });
    }

    // File Upload APIs
    async uploadProfileImage(file) {
        const formData = new FormData();
        formData.append('profile_image', file);

        return this.request('/user/profile-image', {
            method: 'POST',
            headers: {
                'Authorization': this.getAuthHeaders().Authorization
            },
            body: formData
        });
    }

    async uploadVenueImages(venueId, files) {
        const formData = new FormData();
        files.forEach((file, index) => {
            formData.append(`venue_images`, file);
        });

        return this.request(`/venue/${venueId}/images`, {
            method: 'POST',
            headers: {
                'Authorization': this.getAuthHeaders().Authorization
            },
            body: formData
        });
    }

    // Real-time APIs
    async getOnlineUsers() {
        return this.request('/realtime/online-users');
    }

    async getVenueWatchers(venueId) {
        return this.request(`/realtime/venue/${venueId}/watchers`);
    }

    // Utility methods
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseURL.replace('/api', '')}/health`);
            return response.json();
        } catch (error) {
            console.error('Health check failed:', error);
            return { status: 'unhealthy', error: error.message };
        }
    }

    // Error handling utilities
    handleError(error) {
        if (error.message.includes('401')) {
            // Unauthorized - redirect to login
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            window.location.href = '/Auth';
        } else if (error.message.includes('403')) {
            // Forbidden
            console.error('Access forbidden');
        } else if (error.message.includes('500')) {
            // Server error
            console.error('Server error occurred');
        }
        
        return {
            success: false,
            error: error.message
        };
    }

    // Cache management
    clearCache() {
        // Clear any cached data
        if (window.caches) {
            caches.keys().then(names => {
                names.forEach(name => {
                    caches.delete(name);
                });
            });
        }
    }

    // Rate limiting utilities
    async withRetry(fn, maxRetries = 3, delay = 1000) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await fn();
            } catch (error) {
                if (i === maxRetries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
            }
        }
    }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
