/**
 * 🛡️ SMITH: Fetch wrapper with simple retry logic for transient errors.
 */
export async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 3, backoff = 500): Promise<Response> {
    try {
        const response = await fetch(url, options);

        // Retry on 5xx errors or 429 (Too Many Requests)
        if (!response.ok && (response.status >= 500 || response.status === 429) && retries > 0) {
            console.warn(`Transient error ${response.status}. Retrying in ${backoff}ms...`);
            await new Promise(resolve => setTimeout(resolve, backoff));
            return fetchWithRetry(url, options, retries - 1, backoff * 2);
        }

        return response;
    } catch (error) {
        if (retries > 0) {
            console.warn(`Network error. Retrying in ${backoff}ms...`, error);
            await new Promise(resolve => setTimeout(resolve, backoff));
            return fetchWithRetry(url, options, retries - 1, backoff * 2);
        }
        throw error;
    }
}
