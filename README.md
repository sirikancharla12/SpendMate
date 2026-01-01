# SpendMate – Personal Expense and Budget Tracker

SpendMate is a full-stack web application that helps users track expenses, manage budgets, and analyze their spending patterns through a clean, secure, and responsive interface.

Live Application:  
https://spend-mate.vercel.app


## Overview

SpendMate is designed to simplify personal finance management by allowing users to record transactions, set budgets, and visualize their financial data. The application focuses on performance, usability, and security using modern web technologies.

---

## Features

### Authentication
- Secure user authentication using Google OAuth
- Session management with NextAuth
- Protected routes for authenticated users

### Expense Tracking
- Add, edit, and delete expenses
- Categorize expenses and income
- Date-based transaction history

### Budget Management
- Create monthly budgets
- Track expenses against budget limits
- Visual indicators for overspending

### Analytics and Insights
- Interactive charts for income and expenses
- Category-wise spending analysis
- Monthly and yearly financial trends

### User Interface
- Fully responsive design
- Modern UI with smooth animations
- Optimized dashboard layout for clarity

---

## Tech Stack

### Frontend
- Next.js (App Router)
- React 18
- Tailwind CSS
- Framer Motion
- Chart.js

### Backend
- Next.js API Routes
- NextAuth.js

### Database
- PostgreSQL
- Prisma ORM
- NeonDB (Serverless PostgreSQL)

### Authentication
- Google OAuth
- NextAuth.js

### Deployment
- Vercel

---


## Installation
Follow these steps to set up SpendMate locally:

### Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/sirikancharla12/SpendMate.git
   ```
2. Navigate to the project directory:
   ```sh
   cd SpendMate
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Set up environment variables:
   - Create a `.env.local` file in the root directory.
   - Add the following variables:
     ```env
     DATABASE_URL=your_postgresql_database_url
     GOOGLE_CLIENT_ID=your_google_client_id
     GOOGLE_CLIENT_SECRET=your_google_client_secret
     NEXTAUTH_SECRET=your_nextauth_secret
     NEXTAUTH_URL=http://localhost:3000
     ```
5. Start the development server:
   ```sh
   npm run dev
   ```
6. Open `http://localhost:3000` in your browser.

## Usage
- **Sign Up/Login**: Create an account using Google OAuth.
- **Add Expenses**: Enter expense details, including amount, category, and date.
- **View Reports**: Access interactive charts and spending insights.
- **Set Budgets**: Define spending limits and track financial goals.

## Contributing
Contributions are welcome! Follow these steps to contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License
This project is licensed under the MIT License.

## Contact
For any issues or suggestions, please open an issue on GitHub or reach out to [sirikancharla1290@gmail.com].
