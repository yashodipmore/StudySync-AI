# 🎓 StudySync AI

> **The AI That Teaches, Not Just Tells**

A modern, AI-powered study companion built with Next.js 14, Tailwind CSS, and Groq AI. StudySync AI helps students learn more effectively through Socratic teaching, voice-to-notes conversion, intelligent summarization, and auto-generated quizzes.

![StudySync AI](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)
![Groq AI](https://img.shields.io/badge/Groq-AI-orange?style=for-the-badge)

## ✨ Features

### 🤖 AI Chat Assistant
- Natural conversation with an AI study buddy
- Clear explanations with examples
- Supports follow-up questions and context

### 🧠 Socratic Teaching Mode ⭐ UNIQUE
- AI guides you to discover answers yourself
- Thought-provoking questions instead of direct answers
- Builds deeper understanding and critical thinking
- Based on proven educational psychology

### 🎙️ Voice Notes to Study Guide ⭐ UNIQUE
- Record your thoughts while studying
- Real-time speech-to-text transcription
- AI converts rambling speech into organized study notes
- Download formatted notes as markdown

### 📝 Notes Upload & Summary
- Upload TXT, MD files or paste text directly
- AI extracts key concepts and definitions
- Creates structured summaries with headings
- One-click quiz generation from notes

### 📊 Quiz Generator
- Auto-generate multiple choice quizzes from any content
- Choose number of questions (3, 5, 7, or 10)
- Instant feedback with explanations
- Track your score and review answers

### 📈 Progress Dashboard
- Visual statistics for your learning journey
- Study streak tracking
- Weekly activity charts
- Recent activity timeline

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **Tailwind CSS** | Utility-first styling |
| **Groq AI** | Fast LLM inference (free tier available) |
| **Lucide React** | Professional icon library |
| **Web Speech API** | Browser-native voice recognition |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Groq API key (free at [console.groq.com](https://console.groq.com))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/studysync-ai.git
cd studysync-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
# Create .env.local file and add your Groq API key
GROQ_API_KEY=gsk_your_api_key_here
```

4. **Start development server**
```bash
npm run dev
```

5. **Open in browser**
```
http://localhost:3000
```

## 📁 Project Structure

```
studysync-ai/
├── app/
│   ├── api/
│   │   ├── chat/route.js      # AI chat endpoint
│   │   ├── summarize/route.js # Notes summarization
│   │   └── quiz/route.js      # Quiz generation
│   ├── components/
│   │   ├── Sidebar.jsx        # Navigation sidebar
│   │   ├── ChatInterface.jsx  # AI chat UI
│   │   ├── SocraticMode.jsx   # Socratic teaching
│   │   ├── VoiceNotes.jsx     # Voice recording
│   │   ├── NotesUpload.jsx    # File upload & summary
│   │   ├── QuizGenerator.jsx  # Quiz interface
│   │   └── Dashboard.jsx      # Progress stats
│   ├── globals.css            # Global styles
│   ├── layout.js              # Root layout
│   └── page.js                # Main page
├── public/                    # Static assets
├── .env.local                 # Environment variables
├── tailwind.config.js         # Tailwind configuration
├── package.json               # Dependencies
└── README.md                  # This file
```

## 🎨 Design System

### Color Palette
- **Primary (80%)**: Cream (#FFF9F5), Light Orange (#FFF4ED), Soft Orange (#FFEDD5)
- **Accent (20%)**: Brand Orange (#FB923C), Deep Orange (#F97316), Dark Orange (#EA580C)
- **Text**: Charcoal (#1F2937), Gray (#6B7280)

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: 700 weight
- **Body**: 400 weight

### Components
- Border radius: 16px (cards), 12px (buttons), 8px (inputs)
- Borders: 2px solid dark gray
- Shadows: Subtle orange glow on hover

## 🔑 API Configuration

### Getting a Groq API Key

1. Visit [console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Navigate to API Keys section
4. Generate a new API key
5. Add to `.env.local`:
```env
GROQ_API_KEY=gsk_xxxxxxxxxxxx
```

### Supported Models
- `llama-3.3-70b-versatile` (default, recommended)
- `mixtral-8x7b-32768`
- Other Groq-supported models

## 🚢 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variable: `GROQ_API_KEY`
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Build for Production

```bash
npm run build
npm start
```

## 🌐 Browser Support

- **Chrome/Edge**: Full support (including voice features)
- **Firefox**: Partial support (voice may require enabling)
- **Safari**: Full support on macOS

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for **Octopus Hackathon**
- Powered by [Groq](https://groq.com) for fast AI inference
- Icons by [Lucide](https://lucide.dev)
- UI inspiration from modern study apps

---

<div align="center">
  <h3>StudySync AI</h3>
  <p>Learn Smarter, Not Harder</p>
  <p>Made with ❤️ for students everywhere</p>
</div>
