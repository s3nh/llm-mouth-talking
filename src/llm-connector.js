class LocalLLMConnector {
    constructor(apiUrl = 'http://localhost:5000/api/v1/generate') {
        this.apiUrl = apiUrl;
        this.isWebSocket = false;
        this.ws = null;
        this.callbacks = {
            onToken: null,
            onComplete: null,
            onError: null
        };
    }

    // Initialize WebSocket connection
    async initWebSocket(wsUrl = 'ws://localhost:5005/api/v1/stream') {
        this.isWebSocket = true;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log('WebSocket connected');
        };

        this.ws.onmessage = (event) => {
            const response = JSON.parse(event.data);
            if (this.callbacks.onToken) {
                this.callbacks.onToken(response.token);
            }
        };

        this.ws.onclose = () => {
            console.log('WebSocket disconnected');
        };

        this.ws.onerror = (error) => {
            if (this.callbacks.onError) {
                this.callbacks.onError(error);
            }
        };
    }

    // Set callback functions
    setCallbacks({onToken, onComplete, onError}) {
        this.callbacks = {onToken, onComplete, onError};
    }

    // Generate text using REST API
    async generateViaREST(prompt, options = {}) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    max_new_tokens: options.maxTokens || 100,
                    temperature: options.temperature || 0.7,
                    stream: false,
                    ...options
                })
            });

            const data = await response.json();
            return data.generated_text || data.response;
        } catch (error) {
            if (this.callbacks.onError) {
                this.callbacks.onError(error);
            }
            throw error;
        }
    }

    // Generate text using WebSocket
    async generateViaWebSocket(prompt, options = {}) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error('WebSocket is not connected');
        }

        this.ws.send(JSON.stringify({
            prompt: prompt,
            max_new_tokens: options.maxTokens || 100,
            temperature: options.temperature || 0.7,
            stream: true,
            ...options
        }));
    }

    // Main generate method
    async generate(prompt, options = {}) {
        if (this.isWebSocket) {
            return this.generateViaWebSocket(prompt, options);
        } else {
            return this.generateViaREST(prompt, options);
        }
    }
}

export { LocalLLMConnector };
