# ReplyCraft – AI-Powered Writing Assistant

ReplyCraft is an AI-powered writing assistant that helps users create personalized messages for job applications, recruiter follow-ups, thank-you emails, and professional networking. Users can customize the tone and length of their messages and save useful replies for later.

## Features

- **AI Reply Generation:** Generate personalized messages using Google Gemini AI.
- **Purpose Selection:** Create job application messages, recruiter follow-ups, thank-you emails, and LinkedIn messages.
- **Tone Customization:** Choose Professional, Friendly, or Confident.
- **Length Customization:** Generate Short, Medium, or Detailed replies.
- **Favorites:** Save and manage useful generated replies.
- **History:** View previous generated replies and reuse them.
- **Copy to Clipboard:** Copy generated or saved messages easily.
- **Input Validation:** Validate user input before generating a reply.
- **Responsive Design:** Use the application on desktop and mobile screens.
- **Error Handling:** Display helpful messages when the backend or AI service is unavailable.

## Tech Stack

**Frontend**
- React
- JavaScript
- HTML5
- CSS3
- Vite

**Backend**
- Java
- Spring Boot
- Spring Web
- WebClient

**AI Integration**
- Google Gemini API

**Development Tools**
- Visual Studio Code
- Spring Tool Suite (STS)
- Postman
- Git and GitHub

## Project Structure

The frontend and backend are maintained as separate projects.

```text
ReplyCraft/
├── replycraft/             # React frontend
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md
│
└── backend/                # Spring Boot backend
    ├── src/
    ├── pom.xml
    └── ...
```

## Getting Started

### Prerequisites

- Node.js and npm
- Java JDK
- Maven
- A Google Gemini API key

### 1. Run the Frontend

Open a terminal in the frontend project directory and run:

```bash
npm install
npm run dev
```

Open the local URL displayed in the terminal, usually `http://localhost:5173`.

### 2. Configure the Backend

Open a terminal in the Spring Boot backend directory.

Set your Gemini API key as an environment variable named `GEMINI_API_KEY`. Do not commit your API key to GitHub.

For Windows PowerShell, set it for the current terminal session:

```powershell
$env:GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

Replace the placeholder with your own API key.

### 3. Run the Backend

Using the Maven wrapper, if your backend includes it:

```bash
.\mvnw spring-boot:run
```

Alternatively, run the Spring Boot application from your IDE.

Make sure the backend is configured to use the `GEMINI_API_KEY` environment variable and starts on port `8080`.

The frontend sends requests to:

```text
POST http://localhost:8080/api/reply
```

## How to Use

1. Open ReplyCraft in your browser.
2. Select the purpose of your message.
3. Enter the relevant details.
4. Choose your preferred tone and length.
5. Click **Generate** to create a personalized reply.
6. Copy the reply or save it to Favorites.
7. Access previous replies through History.

## Security Notes

- Keep API keys in environment variables.
- Never upload `.env` files or secrets to GitHub.
- Configure appropriate CORS settings before deployment.
- Use environment-based configuration for production API URLs.

## Future Improvements

- Deploy the frontend and backend.
- Add automated tests.
- Improve AI error recovery and retry handling.
- Explore user accounts and cloud-based message storage.

## Author

**Harshali Patil**

A BCA graduate interested in Java full-stack development and building practical software applications.
