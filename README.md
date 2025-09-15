
# AgriMedic AI 🌱

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.x-black?logo=next.js)](https://nextjs.org/)
[![Genkit](https://img.shields.io/badge/Genkit-AI-blue?logo=google&logoColor=white)](https://firebase.google.com/docs/genkit)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**Your AI Plant Doctor. Snap a photo, get a diagnosis. Simple, fast, and for every farmer.**

AgriMedic AI is a modern, AI-powered web application designed to empower farmers by providing instant, actionable insights into crop health, market prices, and expert agricultural knowledge. Built with a "sexy AF" design philosophy, it combines powerful technology with a beautiful, intuitive user interface.

[**➡️ Live Demo (Coming Soon!)**](#)

---

## ✨ Key Features

*   **📸 Instant AI Diagnosis**: Upload a photo of a plant to get an instant diagnosis of diseases or pests using Google's Gemini 2.0 Flash model.
*   **🌿 Location-Aware Treatment Suggestions**: Receive actionable, locally-relevant treatment recommendations (Organic, Chemical, Preventive) based on the diagnosis and your geographic location.
*   **📈 Live Market Price Intelligence**: Get real-time commodity prices from government APIs (`data.gov.in`) and receive AI-powered advice on whether to "Hold" or "Sell" your crops.
*   **🗣️ Multilingual Voice Interface**: Interact with the app using your voice in multiple Indian languages, including Hindi, Marathi, Tamil, and more.
*   **🔊 Text-to-Speech (TTS) Feedback**: Get diagnoses and recommendations read aloud, making the app accessible to users with varying literacy levels.
*   **🤔 Expert Q&A**: Ask any farming-related question and receive a detailed, helpful answer from our AI agricultural expert.
*   **🚀 Escalation to Human Experts**: For complex cases, the app can generate a concise summary to be sent to a local government agricultural officer.
*   **🌐 Multi-Language Support**: The entire interface is translated into 9+ regional Indian languages.
*   **🎨 Stunning UI/UX**: A beautiful, interactive interface featuring glassmorphism, smooth animations, and a premium, modern aesthetic.

## 🏗️ System Architecture

The application uses a robust, scalable architecture built on modern web technologies. For a detailed visual overview of the system, please see the [**ARCHITECTURE.md**](ARCHITECTURE.md) file.

## 🛠️ Technology Stack

*   **Frontend**: [Next.js](https://nextjs.org/) 15 (App Router), [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
*   **AI Framework**: [Genkit (Google AI)](https://firebase.google.com/docs/genkit)
*   **AI Models**:
    *   `gemini-2.0-flash` for diagnosis, Q&A, and analysis.
    *   `gemini-2.5-flash-preview-tts` for Text-to-Speech.
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
*   **State Management**: React Context API
*   **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation.
*   **Deployment**: Ready for [Firebase App Hosting](https://firebase.google.com/docs/app-hosting) or any Node.js compatible platform.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   Node.js (v18 or later)
*   npm or yarn

### Installation

1.  **Clone the repo**
    ```sh
    git clone https://github.com/your_username/agrimedic-ai.git
    cd agrimedic-ai
    ```

2.  **Install NPM packages**
    ```sh
    npm install
    ```

3.  **Set up environment variables**
    Create a `.env` file in the root of your project and add the necessary API keys.
    ```env
    # Your Google AI API Key for Genkit
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

    # API Key for data.gov.in for market prices
    GOVT_API_KEY="YOUR_GOVT_API_KEY"
    ```

4.  **Run the development server**
    The app runs on port 9002 by default.
    ```sh
    npm run dev
    ```
    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
