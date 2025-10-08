# Notes App - Expo React Native

## Overview
A collaborative note-taking and organization app built with Expo (React Native) and Firebase. Users can create notebooks, add notes with text and drawings, and share notebooks with friends for collaboration.

## Core Features
- **Notebook Management**: Create, organize, and manage notebooks
- **Note Creation**: Add notes with titles, content, and drawing capabilities
- **Collaboration**: Share notebooks with friends
- **User Authentication**: Firebase email/password authentication
- **Friend System**: Search and add friends for collaboration
- **Drawing**: Integrated drawing pad for visual note-taking

## Tech Stack
- **Frontend**: Expo 54, React Native 0.79, React 19
- **Navigation**: Expo Router v6
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **UI Libraries**: 
  - Lucide React Native (icons)
  - Expo Linear Gradient, Blur
  - React Native Skia (drawing)
  - React Native Reanimated

## Project Structure
```
app/
  (tabs)/           # Main tab navigation screens
    index.tsx       # Home screen (notebooks list)
    friends.tsx     # Friends management
    settings.tsx    # User settings
  notebook/         # Notebook detail screens
    [id].tsx        # Individual notebook view
    note.tsx        # Note editor
  auth.tsx          # Authentication screen
  _layout.tsx       # Root layout with auth provider
components/
  notebook/         # Notebook-related components
  styles/           # Style definitions
context/
  AuthContext.tsx   # Authentication state management
firebase.ts         # Firebase configuration
```

## Firebase Configuration
The app uses Firebase for:
- User authentication (email/password)
- Firestore database for storing notebooks, notes, and user data
- Real-time updates for collaborative features

Current Firebase config is pre-configured but can be updated in `firebase.ts`.

## Development Setup
- Run the web version with `npm run dev`
- The app is configured to run on port 5000 for web preview
- Expo web uses Metro bundler for development
- Metro bundler port is configured via `RCT_METRO_PORT` environment variable in `metro.config.js`

## Deployment
- Build command: `npm run build:web`
- Deployment target: Autoscale (stateless web app)
- Production server: serve static files from `dist/` directory on port 5000
- Configured via Replit's deployment settings

## Recent Changes
- 2025-10-08: Initial import and Replit environment setup
  - Installed dependencies with legacy peer deps flag
  - Fixed React version mismatch (updated to 19.1.0)
  - Added react-native-web for web support
  - Configured Metro bundler to use port 5000 via RCT_METRO_PORT
  - Fixed font loading issue by removing blocking behavior in _layout.tsx
  - Set up workflow for development server on port 5000
  - Configured autoscale deployment with build and serve commands

## User Preferences
None specified yet.

## Notes
- The app uses Expo's web support via Metro bundler
- Node.js 20.19.3 is used (some packages require 20.19.4+ but work with legacy-peer-deps)
- Firebase credentials are already configured in the codebase
