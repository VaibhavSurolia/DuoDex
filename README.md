# DuoDex

> AI-Powered Coding Coach - Screen-reading based productivity tool for LeetCode and Codeforces

DuoDex is a developer-focused web application that automatically detects coding problems from your screen (LeetCode/Codeforces) and provides intelligent guidance through recommendations and progressive hints.

## Features

- 🎯 **Automatic Screen Detection** - Monitors active browser tabs for coding problems
- 📊 **Smart Recommendations** - Suggests harder, similar problems after solving
- 💡 **Progressive Hints System** - Guided hints that teach, not give away solutions
- 📈 **Real-Time Stats** - Track your progress, weak topics, and difficulty progression
- 🎨 **Dark Mode UI** - Minimal, distraction-free developer aesthetic

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS Modules** - Scoped styling

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── TopBar.tsx              # Header with status and controls
│   ├── LiveDetectionCard.tsx   # Main problem display
│   ├── RecommendationsPanel.tsx # Suggestions after solving
│   ├── GuidedHintSystem.tsx    # Progressive hint system
│   └── StatsSidePanel.tsx      # Statistics and progress
├── App.tsx                     # Main application component
├── main.tsx                    # Entry point
└── index.css                   # Global styles
```

## UI Design

- **Dark Theme**: Deep gray/near-black background (`#0a0a0f`)
- **Accent Colors**: Cyan, Blue, Lime Green
- **Typography**: Monospace for code, system fonts for UI
- **Animations**: Smooth transitions, pulse effects, fade-ins
- **Responsive**: Desktop-first with mobile adaptations

## Future Enhancements

- Actual screen reading implementation via browser extension
- Integration with problem datasets (Excel/CSV)
- User authentication and profile management
- Real-time collaboration features
- Advanced analytics and insights

## License

MIT