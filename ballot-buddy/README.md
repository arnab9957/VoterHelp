# Ballot Buddy 🗳️

**Ballot Buddy** is an interactive, non-partisan Election Process Education Assistant. Built as a high-performance web application, it serves as the "connective tissue" between complex federal election mandates and localized voter guidance, empowering users with accurate, real-time information about their civic duties.

## 🌟 Features

- **Interactive Educational Assistant:** A simulated conversational flow that guides users through voter eligibility, the voting lifecycle, and election integrity based on the National Voter Registration Act (NVRA) and Voting Rights Act (VRA).
- **Federal & Local Contexts:** Conditional guidance for specific edge cases, including military/overseas voters (UOCAVA) and emergency election procedures for disaster-impacted zones.
- **Dynamic Transition Timeline:** Visual, interactive timelines detailing the step-by-step transition of power, from State-Level Certification to the Presidential Inauguration.
- **Comprehensive Election Dashboard:** A clean, organized sidebar layout providing at-a-glance information on voter eligibility, acceptable IDs, voting methods, and key deadlines.
- **Premium Glassmorphism UI:** Built with dark-mode first principles, vibrant gradients, and micro-animations to provide a stunning and engaging user experience.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with custom Glassmorphism utilities
- **Language:** TypeScript
- **Icons:** Native Emojis for lightweight, scalable iconography

## 🚀 Getting Started

To run the development server locally:

1. **Clone the repository** (or navigate to the project directory):
   ```bash
   cd ballot-buddy
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open the app**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser to interact with Ballot Buddy.

## 🏗️ Project Architecture

The core interactive components are located in the `src/components/` directory:
- `ChatInterface.tsx`: The primary state machine managing the conversational branching logic.
- `EssentialInfo.tsx`: The static dashboard providing fundamental voting resources.
- `OptionsSelector.tsx`: The interactive menu interface.
- `InteractiveTimeline.tsx`: Renders dynamic election milestones.

Global styles and design tokens are defined in `src/app/globals.css`.

## 🛡️ Content Guidelines & Blueprint

The conversational logic and information hierarchy are strictly based on the provided "Technical Blueprint and Procedural Framework for the Election Process Education Assistant", ensuring that all guidance aligns with federal minimums while preparing voters for localized execution.
