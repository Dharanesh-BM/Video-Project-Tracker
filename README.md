# Video Project Tracker

A web application for managing and tracking video production projects.

## Features

- User authentication
- Project management
- Client and editor tracking
- Status updates and timeline
- Real-time updates

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- Supabase (Authentication & Database)
- shadcn-ui
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v16 or higher) - [Install Node.js](https://nodejs.org/)
- npm (comes with Node.js)
- Git - [Install Git](https://git-scm.com/downloads)
- Supabase Account (for backend) - [Sign up for Supabase](https://supabase.com/)

### Installation

```sh
# Step 1: Clone the repository
git clone https://github.com/Dharanesh-BM/Video-Project-Tracker.git

# Step 2: Navigate to the project directory
cd video-project-tracker

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

## Environment Setup

This application uses Supabase for authentication and database. Make sure your Supabase project is properly set up with the necessary tables and Row Level Security policies.

### Setting Up the `.env` File

The application requires environment variables to connect to Supabase. Create a `.env` file in the root of your project and add the following variables:

```env
SUPABASE_URL=<your-supabase-url>
SUPABASE_PUBLISHABLE_KEY=<your-supabase-publishable-key>
```

Replace `<your-supabase-url>` and `<your-supabase-publishable-key>` with the values from your Supabase project.

> **Note:** Do not commit the `.env` file to version control. It is already included in the `.gitignore` file.

## Deploying to Production

You can deploy this application to any modern hosting platform that supports Vite applications:

- Vercel
- Netlify
- Firebase Hosting
- GitHub Pages
- etc.

Make sure to configure your environment variables for production.

🚀 Clicke here to view the live preview of the website : [Live preview Netlify](https://video-project-tracker.netlify.app/) | [Vercel](https://video-project-tracker.vercel.app/)
