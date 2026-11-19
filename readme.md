# Food Ordering System

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

A full-stack web project for a food ordering system and simple restaurant operational management. This project was built for learning and exploring how to design modern web applications connecting customer-facing features with staff/internal back-office operations.

> ⚠️ **Note:** This project is still under active development and improvement.

---

## About the Project

The system divides application features into two main areas:

1. **Customer Facing**:
   - Browse food and beverage catalogs with category filters.
   - Manage the shopping cart and proceed through order checkout.
   - View order history.

2. **Staff Dashboard**:
   - **Menu Catalog**: Add and update menu prices, stock levels, and food photos.
   - **Stock Management**: Track inventory movements (inbound, outbound, adjustments) with low-stock alerts.
   - **Quotations & Invoices**: Generate price quotations and order invoices (unpaid, partially paid, paid).
   - **Master Data**: Manage menu categories and product units (portion, pcs, cup, etc.).

---

## Background & Learning Objectives

This project was built to practice key full-stack web development concepts:

- **Relational Data Integrity**: Connecting order transactions with automatic stock deductions and cost-of-goods calculation (*cost price* vs *selling price*) using PostgreSQL and Prisma ORM.
- **Decoupled Architecture**: Building a standalone REST API with Express.js TypeScript consumed by a React (Vite) client.
- **Type Safety**: Leveraging TypeScript across both client and server to minimize data-related bugs during development.
- **Containerization with Docker**: Packaging the frontend, backend, and database into Docker Compose so the app can easily run on any machine without complex manual setup.
- **Git Flow Practices**: Following a structured branching workflow (`feat/*` → `staging` → `main`) to simulate standard software engineering team collaboration.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, TailwindCSS v4, React Router v7, ShadCN UI / Radix primitives, Axios.
- **Backend**: Node.js, Express.js v5, TypeScript, Prisma ORM, JWT, bcryptjs, Multer.
- **Database**: PostgreSQL 16 (compatible with Supabase / Neon / local PostgreSQL).
- **DevOps**: Docker, Docker Compose, Nginx.

---

## How to Run

The application can be run in two ways: using Docker (recommended) or manually on your local machine.

### Option 1: Using Docker Compose (Instant)

Make sure Docker is installed and running on your machine.

1. **Start the containers**:
   ```bash
   docker compose up --build -d
   ```
2. **Open in your browser**:
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:5000](http://localhost:5000)
   - Local PostgreSQL: `localhost:5432`

3. **Additional commands**:
   ```bash
   # View logs
   docker compose logs -f

   # Stop containers
   docker compose down
   ```

---

### Option 2: Running Manually (Local Development)

**Prerequisites**: Node.js (v18+) and a running local PostgreSQL instance.

1. **Setup Backend**:
   ```bash
   cd backend
   cp .env.example .env
   # Adjust DATABASE_URL in the .env file if necessary

   npm install
   npx prisma db push
   npm run seed
   npm run dev
   ```
   Backend runs at `http://localhost:5000`.

2. **Setup Frontend**:
   Open a new terminal tab:
   ```bash
   cd frontend
   cp .env.example .env
   npm install
   npm run dev
   ```
   Frontend runs at `http://localhost:5173`.

---

## Test Accounts

The database comes pre-seeded with initial data to easily test features:

| Role | Email | Password | Details |
|---|---|---|---|
| **Staff** | `staff@foodordering.com` | `staff123` | Access the staff dashboard to manage products, stock, quotations, and invoices |
| **Customer** | `customer@foodordering.com` | `customer123` | Access the menu catalog and shopping cart |

*(New users can also register directly via the Register page).*

---

## Git Workflow

To maintain a clean commit history and practice team workflows, this project uses a simple branching strategy:

```
main (Production)
  ↑
staging (Integration & Testing)
  ↑
feat/feature-name (New Features)
```

- **`feat/*`**: Each feature is developed on a separate branch branched off `staging`.
- **`staging`**: Integration branch where new features are merged and tested before release via Pull Request (PR).
- **`main`**: The primary stable branch ready for production use.

---

## License

This project was built for personal learning and exploration purposes under the **ISC** license.
