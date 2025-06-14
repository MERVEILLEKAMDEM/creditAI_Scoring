import { query } from "./db"

export async function initializeDatabase() {
  try {
    // Drop existing tables and sequences if they exist
    await query(`
      DROP TABLE IF EXISTS applications CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP SEQUENCE IF EXISTS applications_id_seq;
      DROP SEQUENCE IF EXISTS users_id_seq;
    `)

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        status VARCHAR(20) DEFAULT 'active',
        last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log("Created users table")

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
        risk_probability DECIMAL(5,4),
        recommendations TEXT,
        status VARCHAR(20) DEFAULT 'Pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log("Created applications table")

    // Create indexes for better query performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
      CREATE INDEX IF NOT EXISTS idx_applications_risk_level ON applications(risk_level);
    `)
    console.log("Created indexes")

    // Create admin user if it doesn't exist
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
    await query(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
    `, ['Admin User', 'admin@example.com', adminPassword, 'admin'])
    console.log("Database initialized successfully")

    return true
  } catch (error) {
    console.error("Database initialization error:", error)
    return false
  }
}

// Initialize database on module load
initializeDatabase().catch((err) => {
  console.error("Failed to initialize database:", err)
}) 