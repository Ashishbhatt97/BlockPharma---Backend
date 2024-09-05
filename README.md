# BlockPharma Backend

The BlockPharma Backend is a server-side application designed to power the BlockPharma project, which integrates blockchain technology with demand forecasting and inventory optimization for drug stores.

## Features

- **User Authentication and Management**
  - Secure login, registration, and profile management using JWT and OAuth.
  
- **Demand Forecasting**
  - Integration with machine learning models for accurate drug demand predictions.
  
- **Inventory Optimization**
  - Real-time tracking and management of drug inventory levels with blockchain-based transparency.
  
- **Blockchain Integration**
  - Utilizes Ethereum and Polygon for smart contract deployment and transaction management.
  
- **API Development**
  - RESTful APIs for frontend communication, including endpoints for user management, inventory tracking, and transaction handling.

## Tech Stack

- **Node.js** - Runtime environment for executing server-side JavaScript.
- **Express.js** - Web framework for building APIs.
- **PostgreSQL** - Relational database management system.
- **Ethereum & Polygon** - Blockchain platforms for smart contracts and transactions.
- **Machine Learning** - Models for demand forecasting.

## Getting Started

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Ashishbhatt97/BlockPharma---Backend.git

2. **Navigate to the project directory:**

   ```bash
   cd BlockPharma---Backend

3. **Install the necessary packages:**
  
   ```bash
   npm install

4. **Rename .env.example:**

- Change name `.env.example` to `.env`
- Create Your Own `SECRET_KEY=` Key
- Setup Postgres server and paste the URL in `DATABASE_URL =`

5. **Running the Project**

   ```bash
   npm run build
