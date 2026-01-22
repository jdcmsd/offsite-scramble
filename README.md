# Offsite Scramble

An SEO & GEO (Generative Engine Optimization) insights tool that analyzes websites and provides actionable recommendations for improving visibility in both traditional search engines and AI-powered search platforms.

The full Cursor chat log used to generate this project can be found in [CURSOR_CHAT.md](CURSOR_CHAT.md).

## What This App Does

- **Analyzes any website URL** for SEO and GEO best practices
- **Shows inline recommendations** pointing to specific elements that need improvement
- **Scores your site** on SEO health, GEO readiness, and brand visibility
- **Provides actionable recommendations** with suggested fixes you can copy

---

## Getting Started (Beginner-Friendly)

### Step 1: Download the Code

There are two ways to get the code onto your computer:

#### Option A: Download as ZIP (Easiest)
1. Go to the GitHub page for this project
2. Click the green **"Code"** button
3. Click **"Download ZIP"**
4. Find the downloaded ZIP file and unzip it (double-click on Mac, or right-click → "Extract All" on Windows)
5. Move the unzipped folder somewhere convenient, like your Desktop or Documents folder

#### Option B: Clone with Git (If you have Git installed)
1. Install Git from [https://git-scm.com/downloads](https://git-scm.com/downloads) if you don't have it
2. Open a terminal and run:
   ```
   git clone https://github.com/YOUR_USERNAME/offsite-scramble.git
   ```
   (Replace `YOUR_USERNAME` with the actual GitHub username or organization)

### Step 2: Install Node.js

Before you can run this app, you need Node.js installed on your computer.

1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the **LTS** (Long Term Support) version
3. Run the installer and follow the prompts
4. When it's done, restart your terminal/command prompt

To verify it worked, open a terminal and type:
```
node --version
```
You should see a version number like `v20.x.x` or higher.

### Step 3: Open the Project Folder in Terminal

1. Open your terminal:
   - **Mac:** Press `Cmd + Space`, type "Terminal", press Enter
   - **Windows:** Press the Windows key, type "Command Prompt" or "PowerShell", press Enter
2. Navigate to the project folder using the `cd` command:
   ```
   cd /path/to/offsite-scramble
   ```
   
   **Tip:** An easier way is to type `cd ` (with a space after it), then drag the folder from Finder/File Explorer into the terminal window. It will paste the full path for you!

### Step 4: Install Dependencies

Run this command to download all the code libraries the app needs:
```
npm install
```
This may take a minute or two. You'll see a progress bar and some output.

### Step 5: Start the App

You need to run **two commands** in **two separate terminal windows**:

#### Terminal 1 — Start the API Server
```
npm run server
```
You should see:
```
🚀 Offsite Scramble API Server
Running on: http://localhost:3001
```
**Keep this terminal open!** Don't close it.

#### Terminal 2 — Start the Web App
Open a new terminal window, navigate to the same folder, and run:
```
npm run dev
```
You should see:
```
VITE ready
➜  Local:   http://localhost:5173/
```

### Step 6: Open in Your Browser

Open your web browser and go to:
```
http://localhost:5173
```

You should see the Offsite Scramble app! 🎉

---

## How to Use

1. **Enter a brand name** (e.g., "Acme Corp")
2. **Enter a website URL** (e.g., "https://example.com")
3. **Click "Run Analysis"**
4. Wait a few seconds for the analysis to complete
5. Browse the results:
   - **Content Analysis** — Click the numbered markers to see specific recommendations
   - **SEO Health** — Traditional search optimization scores
   - **GEO Readiness** — AI search optimization checklist
   - **Brand Visibility** — How your brand appears in AI platforms
   - **Recommendations** — Prioritized action items

---

## Troubleshooting

### "API server offline" message
Make sure you started the API server (Step 4, Terminal 1). The `npm run server` command must be running.

### "npm: command not found"
Node.js isn't installed properly. Go back to Step 1 and reinstall.

### Port already in use
If you see an error about port 5173 or 3001 being in use, another app is using that port. Either close that app, or the previous instance of this app that's still running.

### Nothing happens when I click "Run Analysis"
- Check that both terminals are still running (server + dev)
- Check your browser's console for errors (right-click → Inspect → Console tab)
- Make sure the URL you entered is a real, publicly accessible website

---

## Available Commands

| Command | What it does |
|---------|--------------|
| `npm install` | Downloads all required code libraries |
| `npm run dev` | Starts the web app (frontend) |
| `npm run server` | Starts the API server (backend) |
| `npm run build` | Creates a production-ready version |
| `npm run lint` | Checks code for errors |

---

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js (vanilla HTTP server)
- **Icons:** Lucide React
