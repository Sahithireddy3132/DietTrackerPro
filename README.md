# FitZone Pro - AI-Powered Fitness Platform

Transform your fitness journey with AI-powered personalization, smart coaching, and real-time progress tracking.

## 🌟 Features

### 🤖 AI-Powered Personalized Diet Recommender
- Input age, weight, fitness goals, and allergies
- AI generates dynamic weekly meal plans with calorie intake
- Uses OpenAI API for intelligent meal suggestions
- Personalized nutrition recommendations

### 📹 Interactive Workout Tutorials
- Embedded video tutorials categorized by skill level
- Beginner, Intermediate, and Advanced workouts
- Progress tracking with completion checkmarks
- Detailed exercise instructions and timing

### 🧠 Smart AI Chatbot
- Built with OpenAI API integration
- Answers questions about diet, fitness, and mental health
- 24/7 availability with contextual responses
- Chat history preservation

### 📈 Real-Time Progress Tracker
- Interactive charts using Recharts library
- Track workout sessions, calories burned, and mood logs
- Visual analytics and progress visualization
- Weekly and monthly progress reports

### 📍 Smart Gym Locator
- Find nearby gyms based on user location
- Integration ready for Google Maps API
- Gym ratings, amenities, and contact information
- Distance and hours of operation

### 🎯 Weekly Goals + Reward Badges
- Set personalized weekly fitness goals
- Achievement system with milestone rewards
- Progress tracking for various fitness metrics
- Motivational badge collection

### 🖱️ Unique Animated Cursor Effects
- Custom cursor with fitness-themed interactions
- Displays motivational quotes on hover
- Glowing/neon effects aligned with fitness theme
- Enhanced user engagement

### 🌙 Dark Mode + Theme Toggle
- Professional dark theme with electric accents
- Smooth theme transitions
- Persistent theme preferences
- Modern glass morphism design

## 🔐 Authentication & Security

- Replit Authentication integration
- Secure session management
- Protected routes and API endpoints
- User profile management

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn UI** components
- **Framer Motion** for animations
- **Recharts** for data visualization
- **React Query** for state management
- **Wouter** for routing

### Backend
- **Express.js** server
- **OpenAI API** integration
- **In-memory storage** for MVP
- **Replit Auth** for authentication
- **RESTful API** design

### APIs & Services
- **OpenAI GPT-4o** for AI features
- **Google Maps API** ready integration
- **YouTube embeds** for workout videos
- **Geolocation API** for gym finder

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- OpenAI API key (optional - will use fallback if not provided)
- Google Maps API key (for gym locator feature)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fitzone-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file with the following variables:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   GOOGLE_MAPS_API_KEY=your_google_maps_key_here
   SESSION_SECRET=your_session_secret_here
   DATABASE_URL=your_database_url_here
   REPLIT_DOMAINS=your_replit_domains_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   