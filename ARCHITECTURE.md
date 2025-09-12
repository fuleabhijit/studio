
# AgriMedic AI System Architecture

This document outlines the architecture of the AgriMedic AI application, a Next.js web app that uses Genkit to provide AI-powered assistance to farmers.

```mermaid
graph TD
    subgraph Frontend (Next.js / React)
        A[/"(page.tsx)" - Diagnosis UI] --> B(DiagnosisTool.tsx);
        C[/"/prices (page.tsx)" - Price UI] --> D{Server Actions};
        E[/"/qa (page.tsx)" - Q&A UI] --> D;
        
        B -- 1. Upload Image & Get Location --> D[/"(actions.ts)" - Server Actions];
        F[Header.tsx] --> C & E;
        G[GeolocationContext] -- Location --> B;
        H[LanguageContext] -- Language --> B;
    end

    subgraph Backend (Genkit AI Flows)
        D -- "getComprehensiveDiagnosis(image, lang, location)" --> I(diagnose-plant-flow.ts);
        D -- "getMarketPriceAlert(commodity)" --> J(get-market-price-alert.ts);
        D -- "getFarmerQueryAnswer(query)" --> K(answer-farmer-query.ts);
        D -- "escalateToExpert(...)" --> L(escalate-to-expert.ts);

        I -- 2. Diagnose Disease --> M{Gemini Flash 2.0};
        I -- 3a. Get Treatments (if disease) --> N(suggest-treatment-options.ts);
        I -- 3b. Get Prices (if plant) --> J;
        N -- 4. Suggest Treatments --> M;
        J -- 5. Get Price Data --> O{data.gov.in API};
        I -- 6. Translate Results --> P(translate-text.ts);
        P -- 7. Translate --> M;
        B -- TTS Request --> D;
        D -- "getSpeechFromText(text)" --> Q(text-to-speech.ts);
        Q -- Generate Audio --> R{Gemini TTS};

        L -- Find Expert --> S[Mock Expert DB];
        L -- Generate Message --> M;
    end

    subgraph External Services
        M[Google AI Models];
        O[Government Data API];
        R[Google AI TTS Model];
        S;
    end

    D -- 8. Return diagnosis, treatments, prices --> B;
    B -- Display Results --> A;
```

## Architecture Overview

The application follows a modern web architecture using a Next.js frontend and a Genkit-powered AI backend.

### 1. Frontend (Client-Side)

*   **Framework**: Built with [Next.js](https://nextjs.org/) and [React](https://reactjs.org/).
*   **UI Components**: Uses [ShadCN UI](https://ui.shadcn.com/) for a modern and accessible component library, styled with [Tailwind CSS](https://tailwindcss.com/).
*   **Main Pages**:
    *   `src/app/page.tsx`: The primary landing page which contains the `DiagnosisTool`. This is the core user interface for the plant diagnosis feature.
    *   `src/app/prices/page.tsx`: A dedicated page for farmers to check real-time market prices for their crops.
    *   `src/app/qa/page.tsx`: A page where farmers can ask general agricultural questions.
*   **State Management**:
    *   `src/context/LanguageContext.tsx`: Manages the application's language settings for internationalization (i18n).
    *   `src/context/GeolocationContext.tsx`: Handles fetching the user's geographic location to provide localized advice.

### 2. Bridge: Server Actions

*   `src/lib/actions.ts`: This file acts as the secure bridge between the frontend and the backend. It uses [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) to expose backend functionality to the client-side components. All communication from the UI to the AI flows goes through these actions.

### 3. Backend (Server-Side AI)

*   **Framework**: The AI logic is built using [Genkit](https://firebase.google.com/docs/genkit), a framework for building production-ready AI applications.
*   **AI Flows** (`src/ai/flows/`): These are the core server-side functions that orchestrate calls to AI models and external APIs.
    *   `diagnose-plant-flow.ts`: The main workflow. It receives an image and location, gets a diagnosis from the AI, and then concurrently fetches treatment suggestions and market price data.
    *   `get-market-price-alert.ts`: Fetches commodity prices from the `data.gov.in` API and uses an AI model to generate actionable advice for the farmer.
    *   `suggest-treatment-options.ts`: Called by the main diagnosis flow, this provides locally relevant and affordable treatment options for a detected disease.
    *   `escalate-to-expert.ts`: Prepares a message for a human expert if the AI's diagnosis is insufficient.
*   **Schemas** (`src/ai/schemas.ts`): All data structures and types for the AI flows are defined here using [Zod](https://zod.dev/), ensuring type safety between the frontend, server actions, and AI models.

### 4. External Services

*   **Google AI Platform**: The application leverages various Google AI models (e.g., Gemini Flash, Gemini TTS) for its core intelligence, including image analysis, natural language processing, and text-to-speech.
*   **data.gov.in API**: This government API is the source for real-time agricultural market prices.
*   **Mock Expert Database**: For the escalation feature, a simple in-memory object is used to simulate a database of local agricultural experts.

