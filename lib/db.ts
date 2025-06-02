import { Pool } from "pg"

// Create a PostgreSQL connection pool with direct connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Helper function to execute SQL queries
export async function query(text: string, params?: any[]) {
  try {
    const start = Date.now()
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log("Executed query", { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error("Error executing query", { text, error })
    throw error
  }
}

// Initialize database tables
export async function initializeDatabase() {
  try {
    // Create users table (simplified without MFA fields)
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create applications table
    await query(`
      CREATE TABLE IF NOT EXISTS applications (
        id SERIAL PRIMARY KEY,
        application_id VARCHAR(10) UNIQUE NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        address TEXT NOT NULL,
        employment_status VARCHAR(50) NOT NULL,
        annual_income DECIMAL(15,2) NOT NULL,
        loan_amount DECIMAL(15,2) NOT NULL,
        loan_purpose VARCHAR(50) NOT NULL,
        credit_history VARCHAR(50) NOT NULL,
        additional_notes TEXT,
        credit_score INTEGER,
        risk_level VARCHAR(20),
        status VARCHAR(20) DEFAULT 'Pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Create indexes for better performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
      CREATE INDEX IF NOT EXISTS idx_applications_risk_level ON applications(risk_level);
    `)

    console.log("Database initialized successfully")
  } catch (error) {
    console.error("Error initializing database", error)
    throw error
  }
}

// Test database connection
export async function testConnection() {
  try {
    const result = await query("SELECT NOW() as current_time")
    console.log("Database connection successful:", result.rows[0])
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    throw error
  }
}

initializeDatabase().catch((err) => {
  console.error("Failed to initialize database:", err)
})
