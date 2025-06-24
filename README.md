# Blog Site – Fullstack with Next.js

A modern, full-featured blogging platform built using **Next.js**, **MongoDB**, **Tailwind CSS**, **NextAuth.js**, and a collection of modern frontend libraries for an elegant, responsive, and interactive user experience.

## 🌐 Live Demo

> [_BlogNest_](https://blog-site-fullstack-next-js.vercel.app)

## 📑 Table of Contents

- [🧰 Introduction](#introduction)
- [🚀 Features](#features)
- [⚙️ Installation](#installation)
- [📁 Project Structure](#project-structure)
- [⚙️ Configuration](#configuration)
- [📦 Dependencies](#dependencies)
- [🛠️ Troubleshooting](#troubleshooting)
- [👥 Contributors](#contributors)

---

## Introduction

This project is a fullstack blog application that allows users to register, authenticate, create and edit blog posts, and explore other users' content. It leverages a modern tech stack including:

- **Frontend**: React 19, Next.js 15, Tailwind CSS
- **Backend**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **State Management**: Redux Toolkit
- **UI Enhancements**: Radix UI, Lucide React, Markdown support via `marked`

---

## Features

- Full user authentication with NextAuth.js
- Responsive and accessible UI using Tailwind CSS and Radix UI
- Markdown-based post editor and renderer
- Secure password hashing using bcrypt
- Dynamic content rendering using React and Redux
- Role-based user functionalities (if applicable)
- Server-side rendering and static generation via Next.js

---

## Installation

1. **Clone the Repository**

```bash
git clone https://github.com/shakurShirajul/blog-site-fullstack-NextJS-.git
cd blog-site-fullstack-NextJS-
```

2. **Install Dependencies**

```bash
npm install
```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory and define the following:

```bash
MONGODB_URI=your_mongo_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_API_KEY=your_google_generative_ai_key (if used)
```

4. \*_Run the App_

```bash
npm run dev
```

App will be running on http://localhost:3000

---

## Project Structure

```bash
/pages          → Next.js pages (routes)
/components     → Reusable UI components
/app            → Application logic (if using app router)
/lib            → Utility functions and helpers
/styles         → Tailwind or global CSS files
/public         → Static assets
```

---

## Configuration

- Tailwind CSS is configured for design utility
- ESLint and Prettier are used for code quality
- Redux Toolkit is used for state management
- NextAuth.js is configured for authentication
  Update `.env.local` for any service keys or environment-specific variables.

---

## Dependencies

Runtime

- next 15.x
- react 19.x
- mongoose 8.x
- next-auth 4.x
- @reduxjs/toolkit, react-redux
- bcrypt, marked, clsx, lucide-react

Development

- eslint, eslint-config-next
- tailwindcss 4.x
- @types/node, @types/react

---

## Troubleshooting

- App crashes on start: Ensure MongoDB is running and `.env.local` is correctly configured.
- Auth issues: Check that `NEXTAUTH_SECRET` and`NEXTAUTH_URL`are set.
- Styling not applied: Confirm Tailwind is correctly configured and PostCSS is functioning.

---

## Contributors

- > [Shirajul Islam Shakur](/shakurShirajul)

Contributions are welcome! Feel free to fork the repository and submit a pull request.

<!--  -->