# 🎯 Tasky - Your Productivity Companion

<div align="center">

![Tasky Banner](https://img.shields.io/badge/Tasky-Built%20with%20%E2%9D%A4%EF%B8%8F-blue?style=for-the-badge)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**Because your to-do list deserves better than a crumpled sticky note.**

A beautiful, offline-first task manager that actually works the way your brain does. Built with modern web tech and a whole lot of caffeine ☕

[Try it Live](https://tasky.app) • [Report a Bug](https://github.com/harishkarthick-dev/tasky/issues) • [Got Ideas?](https://github.com/harishkarthick-dev/tasky/issues)

</div>

---

## 🌟 Why Tasky?

Let's be honest - you've tried a million todo apps, right? Some were too simple (just lists?), others were way too complicated (do I really need a Gantt chart for buying groceries?).

**Tasky hits that sweet spot.** It's powerful enough for serious project planning, yet simple enough that you won't need a PhD to use it. Plus, it works offline (because Wi-Fi isn't always your friend), looks gorgeous in dark mode, and won't spy on your data.

## ✨ What Makes It Special

### 📝 Smart Task Management

- **My Day** - Start each morning fresh with today's priorities (yesterday's you was pretty smart)
- **Subtasks** - Break down "Launch startup" into actual doable steps
- **Smart Dates** - "Tomorrow", "Next Monday", or pick a date - your call
- **Recurring Tasks** - Set it once, check it off forever (or until you remember to cancel your gym membership)
- **Priority Levels** - Because not all tasks are created equal

### 🎯 Goal Tracking That Actually Motivates

- **Visual Progress** - Watch those completion bars fill up (so satisfying!)
- **Flexible Timeframes** - Daily sprints, weekly goals, monthly objectives, or yearly dreams
- **Task Linking** - Connect your daily grind to your bigger picture
- **Smart Analytics** - See your productivity patterns (spoiler: you're more productive than you think!)

### 📓 Notes That Don't Suck

- **Rich Text Editor** - Bold, italic, headings - the works
- **Color Coding** - Because life's too short for plain white notes
- **Quick Capture** - Brain dump before you forget (we've all been there)
- **Pin & Archive** - Keep what matters on top, hide what doesn't

### 🚀 The Cool Stuff Under the Hood

- **Works Offline** - No internet? No problem. Your tasks are safe and sound
- **Real-time Sync** - Back online? Everything syncs automagically ✨
- **PWA Magic** - Install it like a real app (because it basically is one)
- **Dark Mode** - For those 2 AM productivity sessions we definitely don't encourage
- **Drag & Drop** - Reorganize with your mouse like it's 2024 (oh wait, it is!)
- **Command Palette** (`Cmd/Ctrl + K`) - For when you're feeling like a keyboard ninja
- **Focus Timer** - Pomodoro technique built right in
- **Activity Heatmap** - GitHub-style contribution graph for your productivity
- **Daily Inspiration** - Because sometimes you need a little motivation boost

## 🛠️ Built With the Good Stuff

### The Frontend Dream Team

- **Next.js 16** - The latest and greatest (with that new App Router everyone's talking about)
- **React 19** - Fresh off the press
- **TypeScript** - Because we like knowing what we're doing
- **Tailwind CSS 4** - Making things pretty since... well, now
- **Framer Motion** - Smooth animations that'll make your designer friends jealous

### State & Data (The Boring but Important Bits)

- **Zustand** - Redux's cool, minimalist cousin
- **IndexedDB** - Your browser's secret storage facility
- **Firebase** - For when you want your stuff everywhere

### UI Goodness

- **Lucide Icons** - 1000+ beautiful icons at your fingertips
- **Tiptap** - The text editor that doesn't make you want to pull your hair out
- **Recharts** - Data visualization without the headache
- **DnD Kit** - Drag and drop that just works™
- **Canvas Confetti** - Because celebrating small wins matters 🎉

### Developer Experience (Yes, We Care About This)

- **Vitest** - Testing that doesn't make you cry
- **ESLint & Prettier** - Keeping the code clean and consistent
- **Husky** - Git hooks that actually help
- **75%+ Test Coverage** - We test our stuff (revolutionary, we know)

## 🚀 Let's Get You Started!

### What You'll Need

- Node.js 18 or newer (you probably have this already)
- A package manager (npm, yarn, pnpm - pick your poison)
- A Firebase account (free tier works great!)
- 5 minutes of your time

### The Setup Dance

**1. Grab the code**

```bash
git clone https://github.com/harishkarthick-dev/tasky.git
cd tasky
```

**2. Install the magic**

```bash
npm install
# or if you're a yarn person
yarn install
# or the cool kids use pnpm
pnpm install
```

**3. Set up your secrets** 🤫

Create a `.env.local` file (it's like a secret diary, but for your app):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> 💡 **Pro tip:** Get these from your Firebase Console. It's easier than it sounds!

**4. Fire it up!** 🚀

```bash
npm run dev
```

**5. Open [http://localhost:3000](http://localhost:3000)** and prepare to be productive!

## 🎮 Available Commands

Here's your cheat sheet:

```bash
npm run dev          # Start the dev server (this is where the magic happens)
npm run build        # Build for production (make it fast!)
npm start            # Run the production build
npm run lint         # Check for code issues
npm run lint:fix     # Fix what can be fixed automatically
npm run format       # Make the code pretty
npm test             # Run the test suite
npm run test:coverage # See how well we're testing (spoiler: pretty well)
```

## 📂 How It's Organized

```
tasky/
├── app/                    # The pages you see
│   ├── (app)/             # Protected routes (login required)
│   │   ├── dashboard/     # Your command center
│   │   ├── tasks/         # Where the work happens
│   │   ├── goals/         # Dream big!
│   │   └── notes/         # Brain dump zone
│   └── (marketing)/       # Public pages (come on in!)
├── components/            # Reusable UI pieces
│   ├── task/             # Task-related goodies
│   ├── goal/             # Goal components
│   ├── note/             # Note stuff
│   └── ui/               # The building blocks
├── store/                # State management (Zustand magic)
├── lib/                  # Utility functions and helpers
├── hooks/                # Custom React hooks
└── __tests__/            # Where we make sure things work
```

## 🧪 Testing (Yes, We Actually Test!)

We believe in shipping quality code:

```bash
npm test              # Run tests while developing
npm run test:coverage # See the full coverage report
```

**Current coverage: 75%+** (and climbing!)

We test the important stuff so you don't have to worry about things breaking when you least expect it.

## 🎨 Design Philosophy

We built Tasky with a few guiding principles:

- **Simplicity First** - If it needs a tutorial, it's too complex
- **Speed Matters** - Because nobody has time to wait
- **Offline-First** - The internet isn't always reliable (looking at you, coffee shop Wi-Fi)
- **Beautiful by Default** - Good design isn't optional
- **Privacy Respected** - Your data is yours, period

## 🔒 Privacy? We Got You.

- **Local-First Architecture** - Everything stays on your device
- **Optional Cloud Sync** - Your choice, your data
- **Zero Tracking** - We don't care what groceries you're buying
- **Open Source** - See for yourself what we're doing (or not doing!)

## 🤝 Want to Contribute?

Found a bug? Have a cool idea? Want to make Tasky even better? Awesome! Here's how:

1. Fork it (top right corner, can't miss it)
2. Create a branch (`git checkout -b feature/your-cool-idea`)
3. Make your changes (and make them good!)
4. Commit with a clear message (`git commit -m 'Add some awesome feature'`)
5. Push it up (`git push origin feature/your-cool-idea`)
6. Open a Pull Request and tell us what you did!

Not a coder? No problem! You can still help by:

- Reporting bugs (we squash 'em fast)
- Suggesting features (we love new ideas)
- Improving documentation (make it clearer for everyone)
- Spreading the word (tell your friends!)

## 📝 License

MIT License - which basically means you can do whatever you want with this code. Build something cool? Let us know!

## 👨‍💻 The Human Behind the Keyboard

**Harish Karthick S**

Just a developer who got tired of bad todo apps and decided to build a better one. Fueled by coffee, powered by code, driven by the desire to make productivity tools that don't suck.

- 🐙 GitHub: [@harishkarthick-dev](https://github.com/harishkarthick-dev)
- 💬 Questions? Open an issue - I actually read them!

## 🙏 Shoutouts

Massive thanks to:

- The Next.js team for making React development actually fun
- The Firebase team for backend services that just work
- Every open-source maintainer whose code made this possible
- Coffee (lots and lots of coffee)

## 📈 Project Stats

![GitHub stars](https://img.shields.io/github/stars/harishkarthick-dev/tasky?style=social)
![GitHub forks](https://img.shields.io/github/forks/harishkarthick-dev/tasky?style=social)
![GitHub issues](https://img.shields.io/github/issues/harishkarthick-dev/tasky)

---

<div align="center">

### Built with ❤️, ☕, and probably too much late-night coding

**by [Harish Karthick S](https://github.com/harishkarthick-dev)**

Found this helpful? **⭐ Star the repo** and share it with fellow productivity nerds!

_Now go build something awesome (but first, make a todo for it in Tasky)_ 😉

</div>
