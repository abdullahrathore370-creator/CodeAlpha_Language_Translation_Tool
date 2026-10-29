# Language Translation Tool

A web application developed as part of my **CodeAlpha internship**. The
tool allows users to translate text between multiple languages through a
clean and straightforward interface, with voice input for added
convenience.

## Features

-   Translate text between supported languages
-   Voice input using browser speech recognition
-   Source and target language selection
-   Swap source and target languages
-   Copy translated text
-   Clear and user-friendly interface

## Tech Stack

-   **Frontend:** React, JavaScript, CSS
-   **Backend:** Laravel, PHP
-   **Translation Service:** Gemini API
-   **Build Tool:** Vite

## Project Structure

``` text
CodeAlpha_Language_Translation_Tool/
├── backend/
│   ├── app/
│   ├── routes/
│   └── composer.json
├── frontend/
│   ├── src/
│   └── package.json
└── requirements.txt
```

## Prerequisites

-   PHP and Composer
-   Node.js and npm
-   A valid Gemini API key

Python and pip are only required if the configured project dependencies
use them.

## Installation

1.  Clone the repository:

    ``` bash
    git clone https://github.com/abdullahrathore370-creator/CodeAlpha_Language_Translation_Tool.git
    cd CodeAlpha_Language_Translation_Tool
    ```

2.  Install backend dependencies and configure the environment:

    ``` powershell
    cd backend
    composer install
    Copy-Item .env.example .env
    php artisan key:generate
    ```

3.  Add your Gemini API key to the backend environment configuration.
    **Never upload real API keys or secret `.env` files to GitHub.**

4.  Start the Laravel backend:

    ``` bash
    php artisan serve
    ```

5.  Open a separate terminal in the repository and start the frontend:

    ``` powershell
    cd frontend
    npm install
    npm run dev
    ```

6.  Open the frontend URL displayed by Vite in your browser.

## How to Use

1.  Select the source language.
2.  Select the target language.
3.  Enter text or use voice input.
4.  Select **Translate** to view the translated result.
5.  Copy the result when needed.

## Learning Outcomes

-   React frontend development
-   Laravel API development
-   Frontend and backend integration
-   Third-party API integration
-   Browser-based speech recognition

## Internship

Developed as part of the **CodeAlpha Internship**.

## Author

**Abdullah Rathore**

## Repository

[CodeAlpha_Language_Translation_Tool](https://github.com/abdullahrathore370-creator/CodeAlpha_Language_Translation_Tool)
