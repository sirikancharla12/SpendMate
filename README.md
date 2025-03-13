# SpendMate

SpendMate is a full-stack expense tracking application designed to help users efficiently manage their finances. With SpendMate, users can log expenses, categorize spending, and gain insights into their financial habits.

## Features
- **Expense Tracking**: Add, edit, and delete expenses with ease.
- **Budget Management**: Set budgets and track spending against them.
- **Data Visualization**: View expenses through interactive charts and graphs.
- **User Authentication**: Secure login and signup with JWT authentication.
- **Database Integration**: Stores financial data securely in MongoDB.

## Tech Stack
- **Frontend**: Next.js
- **Backend**: Next.js (API Routes)
- **Database**: PostgreSQL (NeonDB)
- **Authentication**: NextAuth (Google OAuth and Credentials)

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
- **Sign Up/Login**: Create an account and log in securely.
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

