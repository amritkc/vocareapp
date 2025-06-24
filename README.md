
# Vocare Fullstack Challenge – Calendar & Appointment Management

## Project Overview

This project is a full-stack prototype for managing appointments in the context of a digital healthcare service. It provides an intuitive calendar view (monthly, weekly, and list formats), powered by the provided Supabase database.

## ⚙️ Tech Stack

- **Next.js** – React framework for full-stack development
- **TailwindCSS** – Utility-first CSS framework
- **shadcn/ui** – Modern, accessible UI components
- **Supabase** – Backend-as-a-service 

## 📆 Features Implemented

- Monthly, Weekly, and List calendar views
- Fetch and display appointments from Supabase
- Filter appointments by:
  - Category
  - Time range
  - Patient
- Hover card for quick appointment info (on calendar views)
- Create, view, and edit appointments via dialog modals
- Fully responsive interface

##  App Demo 
  [Deployed on Vercel](https://vocareapp.vercel.app/)
  
  https://vocareapp.vercel.app/
   
##  Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/amritkc/vocareapp.git
   cd vocareapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment variables**
   Create a `.env.local` file in the root with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://sljilzeejvapihghhcrs.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```


##  Potential Improvements
- Enhanced validation and error handling when creating/editing appointments
- Drag-and-drop functionality for scheduling
- Notifications or email reminders for upcoming appointments

