# DriveFleet

DriveFleet is a modern, full-stack car rental platform that connects car owners with renters. It offers a seamless experience for users to explore, book, and manage vehicle rentals, complete with real-time notifications, integrated authentication, and an earnings dashboard for car owners.

## Live Website
**🔗 [Visit DriveFleet Live](https://drivefleet-client-wine.vercel.app/)**

## Key Features
- **Secure Authentication**: Integrated Firebase authentication with Google login and custom email/password, paired with JWT verification via HTTP-only cookies.
- **Dynamic Car Exploration**: Browse, search, and filter available cars with a responsive, modern UI.
- **Complete Booking Lifecycle**: Full system allowing users to book cars, cancel trips, and mark trips as completed.
- **Rating & Reviews**: An integrated review system enabling renters to rate cars after a successful, completed trip.
- **Owner Dashboard & Earnings**: Car owners can add, edit, or delete their fleet, while tracking their total earnings from completed rentals.
- **Real-Time Notifications**: Instant, socket-based (Socket.io) notifications for new bookings, cancellations, completions, and earnings.
- **Fully Responsive**: Optimized for perfect usability across mobile, tablet, and desktop devices.

## Technology Stack

**Frontend:**
- React (Vite)
- React Router (Routing)
- Tailwind CSS & DaisyUI (Styling & Components)

**Backend:**
- Node.js & Express.js (Server Framework)
- MongoDB (Database)
- Socket.io (Real-time WebSockets)

## NPM Packages Used

**Frontend (`drivefleet-client`):**
- `react`, `react-dom`
- `react-router-dom`
- `firebase`
- `axios`
- `socket.io-client`
- `sweetalert2`, `react-hot-toast`
- `react-icons`
- `tailwindcss`, `daisyui`

**Backend (`drivefleet-server`):**
- `express`
- `mongodb`
- `jsonwebtoken`
- `socket.io`
- `cookie-parser`
- `cors`
- `dotenv`

## Installation & Setup Instructions

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB running locally or a MongoDB Atlas URI

### 1. Clone the Client Repository
```bash
git clone https://github.com/SAJNUS/drivefleet-client.git
cd drivefleet-client
npm install
npm run dev
```

### 2. Setup the Backend Repository (Separate)
```bash
git clone https://github.com/SAJNUS/drivefleet-server.git
cd drivefleet-server
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` and the backend will run on `http://localhost:5050`.

## Environment Variables

Create a `.env.local` file in the root of the client directory:

### Client (`.env.local`)
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

If setting up the backend locally, create a `.env` file in the server directory:

### Server (`.env`)
```env
PORT=5050
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
```

## Folder Structure

```text
drivefleet-client/              # React Frontend Repository
├── public/                     # Static assets
├── src/
│   ├── components/             # Reusable UI components
│   ├── context/                # Global state/Context (Auth)
│   ├── hooks/                  # Custom React hooks
│   ├── pages/                  # Route pages (Home, Profile, etc.)
│   └── firebase/               # Firebase initialization
├── .env.local                  # Environment variables
├── index.html                  # HTML entry point
├── package.json                # Project metadata and dependencies
└── vite.config.js              # Vite configuration
```

## Future Improvements
- Implement a robust Admin Dashboard to moderate users and car listings.
- Add an integrated payment gateway (e.g., Stripe) to handle real transactions.
- Implement an integrated Map API to show exact car pickup locations.
- Add chat functionality to allow renters and owners to communicate directly.

## Author
**Sajnus Saharear Hojayfa**
- Full-Stack Developer
- GitHub: [SAJNUS](https://github.com/SAJNUS)
