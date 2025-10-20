# Market Funds API

A RESTful API built with **Node.js**, **Express**, and **PostgreSQL** for managing investment funds, investors, and their investments.  
---

## Features

- 8 fully functional API endpoints for funds, investors, and investments  
- PostgreSQL relational schema with foreign key constraints  
- Dockerized environment for simple setup  
- Seed data with automatically generated UUIDs  
- Modular code structure following REST conventions  

---

## Tech Stack

- **Node.js** — Backend runtime  
- **Express.js** — Web framework for routing and middleware  
- **PostgreSQL** — Relational database  
- **Docker** — Containerized setup  

---

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/akshay-somvanshi/market_funds_api.git
cd market_funds_api
```

### 2. Copy the .env file

### 3. Build using docker
```bash
docker compose up --build
```
This will:
- Start a PostgreSQL database
- Create schema and populate seed data automatically
- Start the backend server on http://localhost:5000

## Database schema
### `funds` Table

| Column            | Type           | Constraints                              | Description                                 |
|-------------------|----------------|------------------------------------------|---------------------------------------------|
| `id`              | UUID           | PRIMARY KEY, DEFAULT uuid_generate_v4()  | Unique identifier for each fund             |
| `name`            | VARCHAR(255)   | NOT NULL                                 | Name of the fund                            |
| `vintage_year`    | INT            |                                          | Year the fund was launched                  |
| `target_size_usd` | NUMERIC(15,2)  |                                          | Target size in USD                          |
| `status`          | VARCHAR(255)   |                                          | Fund status (e.g., Investing)               |
| `created_at`      | TIMESTAMPTZ    | DEFAULT NOW()                            | Timestamp of creation (UTC)                 |
| `updated_at`      | TIMESTAMPTZ    | DEFAULT NOW()                            | Timestamp of last update (UTC)              |


### `investors` Table

| Column         | Type           | Constraints                              | Description                                 |
|----------------|----------------|------------------------------------------|---------------------------------------------|
| `id`           | UUID           | PRIMARY KEY, DEFAULT uuid_generate_v4()  | Unique identifier for each investor         |
| `name`         | VARCHAR(255)   | NOT NULL                                 | Name of the investor                        |
| `investor_type`| VARCHAR(255)   |                                          | Type of investor (e.g., Institutional)      |
| `email`        | VARCHAR(255)   | UNIQUE, NOT NULL                         | Email address of the investor               |
| `created_at`   | TIMESTAMPTZ    | DEFAULT NOW()                            | Timestamp of creation (UTC)                 |


### `investment` Table

| Column            | Type           | Constraints                              | Description                                 |
|-------------------|----------------|------------------------------------------|---------------------------------------------|
| `id`              | UUID           | PRIMARY KEY, DEFAULT uuid_generate_v4()  | Unique identifier for each investment       |
| `investor_id`     | UUID           | NOT NULL, FOREIGN KEY → investors(id), ON DELETE CASCADE | Linked investor                             |
| `fund_id`         | UUID           | NOT NULL, FOREIGN KEY → funds(id), ON DELETE CASCADE     | Linked fund                                 |
| `amount_usd`      | NUMERIC(15,2)  | CHECK (amount_usd >= 0)                  | Investment amount in USD                    |
| `investment_date` | TIMESTAMPTZ    | DEFAULT NOW()                            | Timestamp of investment (UTC)               |

## Testing

Basic testing is done with Postman and can be seen via:
```bash
docs/titanbay_postman_collection.json
```

## Design decisions
- RESTful structure: Added /funds/:id for updating existing fund to ensure clarity.
- UUIDs for IDs: Ensures global uniqueness and avoids sequential exposure.
- Schema constraints: Enforced referential integrity and domain-specific checks.
- Dockerized setup: Enables reproducibility and ease of review. 