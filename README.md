# RailVision
git add .
git commit -m "updated features"
git push
Full-stack RailVision website built with Next.js, Firebase Authentication, Firestore,
Firebase Storage, and Razorpay.

## Features

- Premium dark railway and AI-inspired responsive UI
- Home, About, RailVision Junior, RailVision Pro, Shop, Cart, Auth, Profile, Admin, and Contact pages
- Firebase sign up, login, password reset, profile, and order history
- Firestore storage for orders, contacts, Pro inquiries, notify-me signups, users, and product image URLs
- Firebase Storage product image uploads from the admin dashboard
- Razorpay order creation, checkout, payment verification, and order confirmation
- Toast notifications, loading skeletons, SEO metadata, and error handling

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.local.example` to `.env.local` and fill in Firebase and Razorpay keys.

3. Run locally:

   ```bash
   npm run dev
   ```

4. Deploy Firestore and Storage rules:

   ```bash
   firebase deploy --only firestore:rules,storage
   ```

5. Set an admin custom claim for dashboard access:

   ```bash
   npm run set-admin -- founder@railvision.ai
   ```

   Place a Firebase service account JSON at `firebase-service-account.json`, or set
   `FIREBASE_SERVICE_ACCOUNT_PATH` to its path.

   Also add the same admin email to `NEXT_PUBLIC_ADMIN_EMAILS` so the dashboard link
   and local UI guard are visible after login.

## Deployment

The app is ready for Vercel or any Next.js hosting that supports App Router API routes.
Set all variables from `.env.local.example` in the hosting provider before deploying.
