# StudySync AI

> **The AI That Teaches, Not Just Tells** - Your intelligent study companion powered by AI

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://www.mongodb.com/atlas)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue?logo=tailwindcss)](https://tailwindcss.com/)
[![Groq AI](https://img.shields.io/badge/Groq-LLaMA%203.3-orange)](https://groq.com/)

## Features

### AI Chat Assistant
- Real-time AI-powered chat with streaming responses
- Context-aware conversations
- Markdown support for formatted responses

### Socratic Learning Mode
- Learn through guided questioning
- AI asks thought-provoking questions instead of giving direct answers
- Deeper understanding of concepts

### Voice Notes
- Record voice notes with one click
- AI automatically transcribes and formats your notes
- Smart structuring of spoken content

### Notes Upload & Summarization
- Upload study materials (text/paste content)
- AI generates intelligent summaries
- Highlights key concepts and takeaways

### Quiz Generator
- Auto-generate quizzes from your notes
- Multiple choice questions with explanations
- Track your quiz performance

### Dark/Light Mode
- Beautiful UI with theme toggle
- Smooth transitions between modes
- Comfortable reading in any lighting

### Fully Responsive
- Works on mobile, tablet, and desktop
- Optimized touch interactions
- Adaptive layouts

## Live Demo

**[Visit StudySync AI](https://studysync-ai.vercel.app)**

## Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Styling** | Tailwind CSS |
| **Database** | MongoDB Atlas |
| **AI Model** | Groq LLaMA 3.3 70B Versatile |
| **Authentication** | JWT + OTP Email Verification |
| **Email** | Nodemailer (Gmail SMTP) |
| **Deployment** | Vercel |

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account
- Groq API key
- Gmail account (for OTP emails)

### 1. Clone the repository

```bash
git clone https://github.com/yashodipmore/StudySync-AI.git
cd StudySync-AI/studysync-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# AI Configuration
GROQ_API_KEY=your_groq_api_key_here

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/studysync?retryWrites=true&w=majority

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
EMAIL_FROM=StudySync AI <your-email@gmail.com>
```

#### Getting API Keys:

**1. Groq API Key**
- Sign up at [console.groq.com](https://console.groq.com)
- Go to API Keys section
- Create a new API key

**2. MongoDB URI**
- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
- Click "Connect" on your cluster
- Choose "Connect your application"
- Copy the connection string and replace `<password>` with your password

**3. Gmail App Password**
- Enable 2-Factor Authentication on your Google account
- Go to Google Account → Security → 2-Step Verification → App Passwords
- Select "Mail" and "Other (Custom name)"
- Enter "StudySync AI" and generate
- Copy the 16-character password

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run on Network (Access from other devices)

```bash
npm run dev -- -H 0.0.0.0
```

Access from other devices using your IP: `http://YOUR_IP:3000`

## Deployment on Vercel

### Method 1: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Method 2: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables in Project Settings
5. Deploy!

### Important: Add Environment Variables

After deployment, go to:
`Vercel Dashboard → Your Project → Settings → Environment Variables`

Add all variables from your `.env.local` file.

## Project Structure

```
studysync-ai/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/           # Login with password or OTP
│   │   └── register/        # Registration with OTP verification
│   ├── (dashboard)/         # Protected dashboard pages
│   │   ├── chat/            # AI Chat interface
│   │   ├── dashboard/       # Main dashboard with stats
│   │   ├── notes/           # Notes upload & summarization
│   │   ├── quiz/            # Quiz generator
│   │   ├── socratic/        # Socratic learning mode
│   │   └── voice-notes/     # Voice recording & transcription
│   ├── (landing)/           # Public landing page
│   ├── api/                 # Backend API routes
│   │   ├── auth/            # Authentication APIs
│   │   │   ├── login/       # POST: Login user
│   │   │   ├── register/    # POST: Register user
│   │   │   ├── send-otp/    # POST: Send OTP email
│   │   │   ├── verify-otp/  # POST: Verify OTP
│   │   │   ├── logout/      # POST: Logout user
│   │   │   └── me/          # GET: Get current user
│   │   ├── chat/            # POST: AI chat completion
│   │   ├── notes/           # POST: Summarize notes
│   │   ├── quiz/            # POST: Generate quiz
│   │   └── voice/           # POST: Transcribe voice
│   ├── components/          # Reusable UI components
│   │   ├── ChatInterface.jsx
│   │   ├── Dashboard.jsx
│   │   ├── NotesUpload.jsx
│   │   ├── QuizGenerator.jsx
│   │   ├── Sidebar.jsx
│   │   ├── SocraticMode.jsx
│   │   └── VoiceNotes.jsx
│   ├── globals.css          # Global styles & Tailwind
│   └── layout.js            # Root layout with providers
├── context/                 # React Context providers
│   ├── AuthContext.jsx      # Authentication state
│   └── ThemeContext.jsx     # Dark/Light mode toggle
├── lib/                     # Utility functions
│   └── mongodb.js           # MongoDB connection
├── models/                  # Mongoose models
│   └── User.js              # User schema
├── public/                  # Static assets
├── .env.local               # Environment variables (create this)
├── tailwind.config.js       # Tailwind configuration
├── jsconfig.json            # Path aliases
└── package.json             # Dependencies
```

## Authentication Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Register   │ ──► │  Send OTP   │ ──► │ Verify OTP  │
│   (Form)    │     │  (Email)    │     │  (6-digit)  │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Dashboard  │ ◄── │  JWT Token  │ ◄── │   Account   │
│   (Home)    │     │  (7 days)   │     │  Created    │
└─────────────┘     └─────────────┘     └─────────────┘
```

## UI Theme

### Light Mode
| Element | Color |
|---------|-------|
| Background | `#FFFCFA` (Cream) |
| Card | `#FFFFFF` (White) |
| Border | `#A89F97` (Dark Border) |
| Text | `#1F2937` (Gray 800) |

### Dark Mode
| Element | Color |
|---------|-------|
| Background | `#0F0F0F` (Dark BG) |
| Card | `#1A1A1A` (Dark Card) |
| Border | `#3A3A3A` (Dark Border) |
| Text | `#F5F5F5` (Light Text) |

### Accent Colors
| Purpose | Color |
|---------|-------|
| Brand Orange | `#FF8534` |
| Grey-Violet (Sections) | `#2D2D3A` to `#5B5B8A` |

## Screenshots

### Landing Page
<img src="snapshots/1.png" width="400" alt="Landing Page">

### Login & Register
<p>
<img src="snapshots/2.png" width="300" alt="Login">
<img src="snapshots/3.png" width="300" alt="Register">
</p>

### Dashboard
<img src="snapshots/4.png" width="400" alt="Dashboard">

### AI Chat
<img src="snapshots/5.png" width="400" alt="AI Chat">

### Socratic Mode
<img src="snapshots/6.png" width="400" alt="Socratic Mode">

### Notes & Summarization
<img src="snapshots/7.png" width="400" alt="Notes Upload">

### Quiz Generator
<img src="snapshots/8.png" width="400" alt="Quiz Generator">

### Voice Notes
<img src="snapshots/9.png" width="400" alt="Voice Notes">

### Dark Mode
<p>
<img src="snapshots/10.png" width="300" alt="Dark Mode 1">
<img src="snapshots/11.png" width="300" alt="Dark Mode 2">
</p>

### More Screenshots
<p>
<img src="snapshots/12.png" width="250" alt="Screenshot 12">
<img src="snapshots/13.png" width="250" alt="Screenshot 13">
<img src="snapshots/15.png" width="250" alt="Screenshot 15">
<img src="snapshots/16.png" width="250" alt="Screenshot 16">
</p>

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/send-otp` | Send OTP to email |
| POST | `/api/auth/verify-otp` | Verify OTP code |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/chat` | AI chat completion |
| POST | `/api/notes` | Summarize notes |
| POST | `/api/quiz` | Generate quiz |
| POST | `/api/voice` | Transcribe voice |

## Contributing

1. Fork the repository
2. Create your feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request

## Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
- Check if your IP is whitelisted in MongoDB Atlas
- Verify connection string format

**2. Email OTP Not Sending**
- Ensure Gmail 2FA is enabled
- Use App Password, not regular password
- Check if "Less secure apps" is not needed (App Passwords bypass this)

**3. Groq API Error**
- Verify API key is correct
- Check if you have API credits

**4. Dark Mode Not Working**
- Clear browser cache
- Check if ThemeProvider wraps the app

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Yashodip More**

- GitHub: [@yashodipmore](https://github.com/yashodipmore)
- Email: yashodipmore2004@gmail.com

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework for Production
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS Framework
- [Groq](https://groq.com/) - Fast AI Inference Platform
- [MongoDB](https://www.mongodb.com/) - Developer Data Platform
- [Vercel](https://vercel.com/) - Frontend Cloud Platform
- [Lucide Icons](https://lucide.dev/) - Beautiful & Consistent Icons
- [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) - Elegant Font
- [Poppins](https://fonts.google.com/specimen/Poppins) - Modern Sans-Serif

---

<div align="center">

**Star this repo if you find it helpful!**

Made by [Yashodip More](https://github.com/yashodipmore)

</div>
