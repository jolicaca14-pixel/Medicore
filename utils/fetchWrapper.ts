const getAuthToken = () => {
    const session = sessionStorage.getItem('medicore_session');
    if (!session) return null;
    try {
        const data = JSON.parse(session);
        return data.accessToken || null;
    } catch (e) {
        return null;
    }
};

/**
 * 🛡️ fetchWrapper: Resilient fetch with retries and timeout
 */
export const fetchWrapper = async (url: string, options: any = {}, retries = 2) => {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
        const response = await fetch(url, {
            ...options,
            headers,
            signal: controller.signal
        });
        clearTimeout(id);

        if (!response.ok) {
            if (response.status >= 500 && retries > 0) {
                console.warn(`Server error ${response.status}, retrying... (${retries} left)`);
                return fetchWrapper(url, options, retries - 1);
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error: any) {
        clearTimeout(id);
        if (error.name === 'AbortError') {
            throw new Error('Request timed out');
        }
        if (retries > 0) {
            return fetchWrapper(url, options, retries - 1);
        }
        throw error;
    }
};
