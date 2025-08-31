# Amin Diagnostic Center

A complete healthcare management system with role-based access control for administrators, moderators, doctors, and patients. This project is built with [Next.js](https://nextjs.org) and bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- **Authentication**:
  - Admin & Moderator: Email/password login with JWT
  - Doctor & Patient: Phone/SMS OTP login
- **Role-Based Access Control**:
  - Admin: Full system access
  - Moderator: Content management
  - Doctor: Appointment management
  - Patient: Book appointments and view medical tests
- **Dashboard**:
  - Role-specific dashboards with appropriate functionality
  - Responsive design with sidebar navigation
- **Appointments**:
  - Patients can book appointments with doctors
  - Doctors can manage their appointments
- **Medical Tests**:
  - View and manage test prices
  - Track patient test results

## Tech Stack

- **Frontend**: Next.js, Material UI, TypeScript
- **Backend**: Next.js API Routes
- **Database**: Neon.tech PostgreSQL
- **Authentication**: JWT, SMS OTP
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Neon.tech PostgreSQL database
- SMS API credentials

### Local Development

1. Set up environment variables in `.env.local`:
   ```
   # Database
   DATABASE_URL="postgresql://user:password@host:port/database"
   
   # Authentication
   JWT_SECRET="your-jwt-secret"
   
   # Sonali SMS (server-only)
   SONALI_SMS_API_KEY="your-sonali-sms-api-key"
   SONALI_SMS_SECRET_KEY="your-sonali-sms-secret-key"
   SONALI_SMS_SENDER_ID="your-sender-id"
   SONALI_SMS_BASE_URL="http://api.sonalisms.com:7788"
   SONALI_SMS_FALLBACK_BASE_URL="http://103.177.125.106:7788"
   ```

2. Install dependencies and run database migrations:
   ```bash
   npm install
   npx prisma migrate dev
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Domain Configuration

1. Purchase the domain `amindiagnostic.net` if not already owned
2. In your domain registrar's DNS settings:
   - Add an A record pointing to Vercel's IP addresses
   - Or add a CNAME record pointing to your Vercel deployment URL
3. In Vercel:
   - Go to your project settings
   - Navigate to the Domains section
   - Add your domain `amindiagnostic.net`
   - Follow Vercel's instructions to verify domain ownership

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
