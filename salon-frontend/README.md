# Jawed Habib Salon - Frontend

The frontend for the India's Premier Heritage Salon platform, built with Next.js 15 for a premium, high-performance user experience.

## ✨ Highlights

- **Server-Side Rendering (SSR)**: Leveraging Next.js App Router for optimal SEO and performance.
- **Micro-Animations**: Smooth, professional transitions using Framer Motion.
- **Client-Side Filtering**: Instant service discovery with combined category and audience filters.
- **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile.

## 🛠 Tech Stack

- **Framework**: Next.js 15
- **Styling**: Vanilla CSS with Tailwind utility integration
- **Data Fetching**: TanStack Query (React Query)
- **Auth**: Custom JWT-based context provider
- **Icons**: Custom SVG & Lucide Icons

## 🚀 Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   Create a `.env.local` file based on `.env.local.example`.

3. Run development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 📂 Architecture

- `/app`: App Router pages and layouts.
- `/components`: Reusable UI components categorized by feature.
- `/lib`: Utility functions, API configuration, and authentication context.
- `/public`: Static assets including optimized heritage photography.
