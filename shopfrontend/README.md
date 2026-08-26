# Furniture Shop Frontend

A responsive furniture e-commerce frontend built with React and Vite. Users can browse furniture, search and filter products, view product details, manage their cart and wishlist, place orders, and manage their profile.

## Features

- Responsive home page with furniture hero section
- Product search, category, price, and sorting filters
- Product details, cart, and wishlist management
- User registration, login, profile, and order history
- Checkout with Razorpay integration
- Admin dashboard, product management, and order management
- JWT authentication and responsive desktop, tablet, and mobile UI

## Tech Stack

- React 19
- Vite
- React Router
- Axios
- Bootstrap 5
- ESLint

## Project Structure

```text
src/
  assets/       Product and brand images
  components/   Reusable UI components
  context/      Cart and wishlist providers
  hooks/        Cart and wishlist hooks
  pages/        Application pages
  services/     Axios API configuration
```

## Requirements

- Node.js 18 or newer
- npm
- Backend API running on `http://localhost:8081`

## Getting Started

```bash
npm install
npm run dev
```

The frontend normally runs at `http://localhost:5173`. Vite proxies `/api` and `/uploads` requests to the backend at `http://localhost:8081`.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Check the project with ESLint |

## Main Routes

| Route | Purpose |
| --- | --- |
| `/` | Home page |
| `/products` | Browse all products |
| `/product/:id` | View product details |
| `/cart` | View shopping cart |
| `/wishlist` | View wishlist |
| `/login` | User login |
| `/register` | Create an account |
| `/profile` | Manage user profile |
| `/checkout` | Complete an order |
| `/orders` | View user orders |
| `/admin` | Admin dashboard |
| `/admin/products` | Manage products |
| `/admin/orders` | Manage orders |

## API Configuration

Axios uses `/api` as its base URL. JWT tokens are automatically added to authenticated requests from browser local storage.

Make sure the backend is running before using product, cart, login, or order pages. If an API loading error appears, check the backend and set browser DevTools Network throttling to `No throttling`.

## Production Build

```bash
npm run build
```

The production files are generated in the `dist` directory.
