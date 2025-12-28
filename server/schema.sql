CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date TIMESTAMP,
  urgency INTEGER DEFAULT 1,
  workload INTEGER DEFAULT 1,
  priority_score INTEGER,
  priority_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
