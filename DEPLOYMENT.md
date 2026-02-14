# Deployment Guide for ConvertIt.Space

This project is a static React application that uses ESM modules and Tailwind CSS via CDN. It can be deployed to any static site hosting service or a custom VPS.

## Option 1: Static Hosting (Vercel, Netlify, GitHub Pages)

Since the project is mostly static (using `index.html` and `index.tsx` with ESM), you can simply upload the files to any static host.

1.  **Environment Variables**: The application requires a Google Gemini API Key. In your hosting provider's dashboard, add an environment variable:
    *   `API_KEY`: Your Google Gemini API Key.
2.  **Build Command**: None (it's served as-is).
3.  **Output Directory**: Root directory.

## Option 2: Custom VPS (Docker)

If you are deploying to your own domain `convertit.space` on a VPS, you can use Docker.

### Prerequisites
*   Docker and Docker Compose installed on your server.
*   A Google Gemini API Key.

### Steps
1.  **Clone the repository** to your server:
    ```bash
    git clone https://github.com/mysafeer/convertit.git
    cd convertit
    ```
2.  **Create a `.env` file** and add your API key:
    ```bash
    echo "API_KEY=your_gemini_api_key_here" > .env
    ```
3.  **Start the application**:
    ```bash
    docker-compose up -d
    ```
4.  **Configure Nginx/Reverse Proxy**: Point your domain `convertit.space` to the server's IP on port 80.

## Option 3: Manual Nginx Setup

1.  Install Nginx: `sudo apt update && sudo apt install nginx`
2.  Copy files to `/var/www/html`:
    ```bash
    sudo cp -r . /var/www/html/
    ```
3.  Configure Nginx to serve `index.html` for all routes (if using client-side routing).

## Important Note on API Keys
The current implementation in `index.tsx` uses `process.env.API_KEY`. Since this is a client-side application, the API key will be visible in the browser's network tab. For a production environment, it is highly recommended to:
1.  Create a small backend proxy to handle AI requests.
2.  Or use a service like Vercel Edge Functions to hide the key.
