# Workouts Frontend

A modern, responsive workout tracking application built with Svelte, TypeScript, and Vite. This frontend application provides a beautiful and intuitive interface for managing personal workout routines, tracking exercise progress, and viewing workout statistics.

## 🚀 Features

- **User Authentication**: Secure login and registration system
- **Workout Management**: Create, view, edit, and delete workout routines
- **Exercise Tracking**: Add detailed exercise entries with sets, reps, duration, weight, and notes
- **Progress Analytics**: View workout statistics, streaks, and progress over time
- **Responsive Design**: Beautiful UI that works on desktop and mobile devices
- **Smooth Animations**: Enhanced user experience with custom transitions and animations
- **Real-time Updates**: Live data synchronization with the backend API

## 🛠️ Tech Stack

- **Frontend Framework**: Svelte 5
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: svelte-spa-router
- **State Management**: Svelte stores
- **Styling**: CSS with custom animations
- **Package Manager**: pnpm

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (version 18 or higher)
- pnpm package manager
- Access to the workouts backend API (running on `https://workouts-api.mounis.net`)

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd workouts-fe
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

### Available Scripts

- `pnpm dev` - Start development server on port 3000
- `pnpm build` - Build the application for production
- `pnpm preview` - Preview the production build
- `pnpm check` - Run TypeScript and Svelte checks

## 📁 Project Structure

```
src/
├── pages/                 # Application pages/routes
│   ├── Login.svelte      # User authentication page
│   ├── Register.svelte   # User registration page
│   ├── Dashboard.svelte  # Main dashboard with workout list
│   ├── AddWorkout.svelte # Create new workout page
│   └── ViewWorkout.svelte # View/edit specific workout
├── stores/               # Svelte stores for state management
│   └── auth.ts          # Authentication state and functions
├── animation-utils.ts    # Animation utility functions
├── animations.css        # Custom CSS animations
├── app.css              # Global application styles
├── types.ts             # TypeScript type definitions
├── App.svelte           # Root application component
└── main.ts              # Application entry point
```

## 🔐 Authentication

The application uses token-based authentication:

- Login with username and password
- Tokens are stored in localStorage
- Automatic token validation on app initialization
- Secure logout with token cleanup

## 📊 Features Overview

### Dashboard
- **Workout Statistics**: Total workouts, weekly/monthly counts, streaks
- **Progress Tracking**: Duration, calories burned, favorite exercises
- **Workout Calendar**: Visual representation of workout frequency
- **Recent Workouts**: Quick access to recent workout sessions

### Workout Management
- **Create Workouts**: Add new workout routines with title and description
- **Exercise Entries**: Add multiple exercises with detailed information:
  - Exercise name
  - Sets and reps
  - Duration (for time-based exercises)
  - Weight (for resistance exercises)
  - Personal notes
- **Workout Editing**: Modify existing workouts and exercises
- **Workout Deletion**: Remove workouts with confirmation

### User Experience
- **Smooth Transitions**: Custom animations between pages and components
- **Loading States**: Visual feedback during API operations
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Optimized for all screen sizes

## 🎨 Styling and Animations

The application features:
- Modern, clean design with consistent color scheme
- Custom CSS animations for enhanced interactivity
- Smooth page transitions using Svelte's built-in transition system
- Responsive grid layouts for optimal viewing on any device

## 🔌 API Integration

The frontend communicates with a REST API backend:
- **Base URL**: `https://workouts-api.mounis.net`
- **Authentication**: Bearer token in Authorization header
- **Endpoints**:
  - `POST /tokens/auth` - User authentication
  - `POST /users` - User registration
  - `GET /workouts` - Fetch user workouts
  - `POST /workouts` - Create new workout
  - `GET /workouts/:id` - Get specific workout
  - `PUT /workouts/:id` - Update workout
  - `DELETE /workouts/:id` - Delete workout

## 🚀 Production Build

To build the application for production:

```bash
pnpm build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Notes

### Type Safety
The application is fully typed with TypeScript, including:
- API response types
- Component prop types
- Store state types
- Form data types

### State Management
Uses Svelte's built-in stores for:
- Authentication state
- User data persistence
- Reactive updates across components

### Performance
- Vite for fast development and optimized builds
- Code splitting for optimal bundle sizes
- Efficient component updates with Svelte's reactivity

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
