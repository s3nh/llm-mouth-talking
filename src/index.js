// Add this import at the top of the file
import { LocalLLMConnector } from './llm-connector.js';

// ... (previous MouthAnimation class code remains the same)

// Update the LLMController class
class LLMController {
    constructor(mouthAnimation) {
        this.mouthAnimation = mouthAnimation;
        this.isProcessing = false;
        this.llm = new LocalLLMConnector();
        this.setupLLM();
    }

    async setupLLM() {
        // For WebSocket streaming (uncomment if you want to use WebSocket)
        // await this.llm.initWebSocket();
        
        this.llm.setCallbacks({
            onToken: (token) => {
                // Handle each token as it comes in
                this.handleToken(token);
            },
            onComplete: (response) => {
                // Handle complete response
                this.mouthAnimation.stopSpeaking();
            },
            onError: (error) => {
                console.error('LLM Error:', error);
                this.mouthAnimation.stopSpeaking();
            }
        });
    }

    handleToken(token) {
        // Convert token to phoneme
        const phoneme = this.tokenToPhoneme(token);
        this.mouthAnimation.setPhoneme(phoneme);
    }

    tokenToPhoneme(token) {
        // Simple mapping of tokens to phonemes
        // You can make this more sophisticated
        const text = token.toLowerCase();
        if (text.match(/[aáâãä]/)) return 'A';
        if (text.match(/[eéêë]/)) return 'E';
        if (text.match(/[iíîï]/)) return 'I';
        if (text.match(/[oóôõö]/)) return 'O';
        if (text.match(/[uúûü]/)) return 'U';
        return 'rest';
    }

    async generateResponse(prompt) {
        if (this.isProcessing) return;
        
        this.isProcessing = true;
        this.mouthAnimation.startSpeaking();

        try {
            const response = await this.llm.generate(prompt, {
                maxTokens: 100,
                temperature: 0.7,
                stream: true  // Enable streaming for real-time mouth movement
            });
            
            // If using REST API (non-streaming)
            if (!this.llm.isWebSocket) {
                // Simulate speaking the response
                for (const char of response) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                    this.handleToken(char);
                }
                this.mouthAnimation.stopSpeaking();
            }
        } catch (error) {
            console.error('Error generating response:', error);
            this.mouthAnimation.stopSpeaking();
        } finally {
            this.isProcessing = false;
        }
    }
}

// Add these to the MouthAnimation class
class MouthAnimation {
    // ... (previous code remains the same)

    setPhoneme(phoneme) {
        this.currentPhoneme = phoneme;
        this.updateMouthShape(phoneme);
    }

    updateMouthShape(phoneme) {
        switch (phoneme) {
            case 'A':
                this.mouth.scale.set(1.2, 0.8, 1);
                this.lips.scale.set(1.2, 0.8, 1);
                break;
            case 'E':
                this.mouth.scale.set(1.4, 0.6, 1);
                this.lips.scale.set(1.4, 0.6, 1);
                break;
            case 'I':
                this.mouth.scale.set(0.8, 0.9, 1);
                this.lips.scale.set(0.8, 0.9, 1);
                break;
            case 'O':
                this.mouth.scale.set(0.9, 0.9, 1);
                this.lips.scale.set(0.9, 0.9, 1);
                break;
            case 'U':
                this.mouth.scale.set(0.7, 0.7, 1);
                this.lips.scale.set(0.7, 0.7, 1);
                break;
            case 'rest':
                this.resetMouth();
                break;
        }
    }
}

// Initialize everything
const mouthAnimation = new MouthAnimation();
const llmController = new LLMController(mouthAnimation);

// Add a text input and button for testing
const controls = document.getElementById('controls');
const input = document.createElement('input');
input.type = 'text';
input.placeholder = 'Enter text for LLM...';
const generateButton = document.createElement('button');
generateButton.textContent = 'Generate';
generateButton.onclick = () => llmController.generateResponse(input.value);

controls.appendChild(input);
controls.appendChild(generateButton);
