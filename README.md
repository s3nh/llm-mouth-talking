# LLM-Driven Mouth Animation

A real-time mouth animation system that connects to local Large Language Models (LLMs) for creating dynamic speech animations.

## Overview

This project implements a 3D mouth animation system that responds to text generation from local LLMs. It uses Three.js for 3D rendering and can connect to various local LLM implementations through REST API or WebSocket connections.

## Features

- Real-time 3D mouth animation
- Support for basic phonemes (A, E, I, O, U)
- Connection to local LLM servers
- Support for streaming responses
- WebSocket and REST API integration
- Customizable mouth shapes and animations

## Prerequisites

- A modern web browser with WebGL support
- Node.js and npm installed
- A running local LLM server (e.g., oobabooga's text-generation-webui, llama.cpp server, or LocalAI)

## Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd llm-mouth-animation
```



### Local LLM connection

```
// In main.js, modify the LocalLLMConnector initialization with your endpoint:
this.llm = new LocalLLMConnector('http://localhost:YOUR_PORT/your/api/endpoint');


// In setupLLM(), uncomment and modify the WebSocket initialization:
await this.llm.initWebSocket('ws://localhost:YOUR_PORT/your/ws/endpoint');


const response = await this.llm.generate(prompt, {
    maxTokens: 100,
    temperature: 0.7,
    stream: true,
    // Add any other parameters your LLM API expects
});
```



### Setup example 


```
this.llm = new LocalLLMConnector('http://localhost:5000/api/v1/generate');
await this.llm.initWebSocket('ws://localhost:5005/api/v1/stream');



this.llm = new LocalLLMConnector('http://localhost:8080/completion');

this.llm = new LocalLLMConnector('http://localhost:8080/v1/completions');
```


