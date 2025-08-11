import io from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.eventListeners = new Map();
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    connect(token = null) {
        if (this.socket && this.isConnected) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            try {
                // Connect to the backend socket server
                this.socket = io('http://localhost:5001', {
                    transports: ['websocket', 'polling'],
                    auth: token ? { token } : undefined,
                    timeout: 10000,
                    reconnection: true,
                    reconnectionAttempts: this.maxReconnectAttempts,
                    reconnectionDelay: 1000,
                    reconnectionDelayMax: 5000
                });

                this.socket.on('connect', () => {
                    console.log('✅ Connected to real-time server');
                    this.isConnected = true;
                    this.reconnectAttempts = 0;
                    resolve();
                });

                this.socket.on('disconnect', (reason) => {
                    console.log('❌ Disconnected from real-time server:', reason);
                    this.isConnected = false;
                    
                    if (reason === 'io server disconnect') {
                        // Server disconnected us, try to reconnect
                        this.socket.connect();
                    }
                });

                this.socket.on('connect_error', (error) => {
                    console.error('❌ Connection error:', error);
                    this.reconnectAttempts++;
                    
                    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                        reject(new Error('Failed to connect after maximum attempts'));
                    }
                });

                this.socket.on('reconnect', (attemptNumber) => {
                    console.log(`🔄 Reconnected after ${attemptNumber} attempts`);
                    this.isConnected = true;
                    this.reconnectAttempts = 0;
                });

                this.socket.on('reconnect_error', (error) => {
                    console.error('❌ Reconnection error:', error);
                });

                this.socket.on('reconnect_failed', () => {
                    console.error('❌ Reconnection failed');
                    reject(new Error('Reconnection failed'));
                });

                // Handle real-time events
                this.setupEventHandlers();

            } catch (error) {
                console.error('❌ Socket connection error:', error);
                reject(error);
            }
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
            console.log('🔌 Disconnected from real-time server');
        }
    }

    setupEventHandlers() {
        // Handle new notifications
        this.socket.on('new_notification', (notification) => {
            console.log('📢 New notification received:', notification);
            this.emitEvent('notification', notification);
            
            // Show browser notification if permission granted
            if (Notification.permission === 'granted') {
                new Notification(notification.title, {
                    body: notification.message,
                    icon: '/favicon.ico'
                });
            }
        });

        // Handle booking updates
        this.socket.on('booking_update', (data) => {
            console.log('📅 Booking update received:', data);
            this.emitEvent('booking_update', data);
        });

        // Handle venue updates
        this.socket.on('venue_update', (data) => {
            console.log('🏟️ Venue update received:', data);
            this.emitEvent('venue_update', data);
        });

        // Handle system messages
        this.socket.on('system_message', (data) => {
            console.log('💬 System message received:', data);
            this.emitEvent('system_message', data);
        });

        // Handle chat messages
        this.socket.on('chat_message', (data) => {
            console.log('💬 Chat message received:', data);
            this.emitEvent('chat_message', data);
        });

        // Handle typing indicators
        this.socket.on('typing_indicator', (data) => {
            console.log('⌨️ Typing indicator received:', data);
            this.emitEvent('typing_indicator', data);
        });
    }

    // Join venue room for real-time updates
    joinVenue(venueId) {
        if (this.socket && this.isConnected) {
            this.socket.emit('join_venue', { venue_id: venueId });
            console.log(`🏟️ Joined venue room: ${venueId}`);
        }
    }

    // Leave venue room
    leaveVenue(venueId) {
        if (this.socket && this.isConnected) {
            this.socket.emit('leave_venue', { venue_id: venueId });
            console.log(`🏟️ Left venue room: ${venueId}`);
        }
    }

    // Send chat message
    sendChatMessage(venueId, message) {
        if (this.socket && this.isConnected) {
            this.socket.emit('chat_message', {
                venue_id: venueId,
                message: message
            });
        }
    }

    // Send typing indicator
    sendTypingIndicator(venueId, isTyping) {
        if (this.socket && this.isConnected) {
            this.socket.emit('typing_indicator', {
                venue_id: venueId,
                is_typing: isTyping
            });
        }
    }

    // Event listener management
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }

    off(event, callback) {
        if (this.eventListeners.has(event)) {
            const listeners = this.eventListeners.get(event);
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    emitEvent(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }

    // Utility methods
    isConnected() {
        return this.isConnected;
    }

    getSocketId() {
        return this.socket ? this.socket.id : null;
    }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
