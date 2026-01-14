// Frontend/src/lib/api.ts

const API_BASE_URL = 'https://overdecoratively-uninebriating-melda.ngrok-free.dev/api/v1';

export function isLoggedIn() {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('access_token');
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    const headers = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        if (typeof window !== 'undefined') {
            console.warn('Session expired or unauthorized. Please login.');
        }
        throw new Error('Unauthorized');
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.error || `HTTP Error ${response.status}`);
    }

    return response.json();
}
