# HungryHut

HungryHut is a responsive, modern MERN stack application for restaurant food ordering. 

## Features
- **Customer Facing:** Menu browsing, cart management, checkout with simulated payment gateway, order tracking.
- **Admin Panel:** Dashboard with analytics, Category/Product management, Order management with status updates.
- **State Management:** Zustand (Cart & Auth)
- **Styling:** Tailwind CSS + Framer Motion for animations.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Axios, Zustand
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Multer
- **Database:** MongoDB

## Installation

1. Clone the repository
2. Install Backend dependencies:
   ```bash
   cd server
   npm install
   ```
3. Install Frontend dependencies:
   ```bash
   cd client
   npm install
   ```

4. Setup Environment Variables:
   - In `server/.env`, configure your `MONGO_URI`, `JWT_SECRET`, and `PORT`
   - In `client/.env`, configure `VITE_API_URL`

5. Run development servers:
   - Backend: `npm run dev` in `/server`
   - Frontend: `npm run dev` in `/client`

## Default Admin Credentials
- **Email:** admin@hungryhut.com
- **Password:** password123

## Deployment Notes
- **Frontend:** Suitable for Vercel or Netlify. Build command: `npm run build`.
- **Backend:** Suitable for Render, Railway, or Heroku. Ensure environment variables are set.
- **Database:** MongoDB Atlas.
- **Payment Gateway:** Razorpay (Remember to switch from Test keys to Live keys for production).
