import './dotenv.js'
import { pool } from './database.js'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const createTables = async () => {
  const createTablesQuery = `
    DROP TABLE IF EXISTS trips_destinations CASCADE;
    DROP TABLE IF EXISTS activities CASCADE;
    DROP TABLE IF EXISTS destinations CASCADE;
    DROP TABLE IF EXISTS trips CASCADE;

    CREATE TABLE IF NOT EXISTS trips (
      id serial PRIMARY KEY,
      title varchar(100) NOT NULL,
      description varchar(500) NOT NULL,
      img_url text NOT NULL,
      num_days integer NOT NULL,
      start_date date NOT NULL,
      end_date date NOT NULL,
      total_cost money NOT NULL
    );

    CREATE TABLE IF NOT EXISTS destinations (
      id serial PRIMARY KEY,
      destination varchar(100) NOT NULL,
      description varchar(500) NOT NULL,
      city varchar(100) NOT NULL,
      country varchar(100) NOT NULL,
      img_url text NOT NULL,
      flag_img_url text NOT NULL
    );

    CREATE TABLE IF NOT EXISTS activities (
      id serial PRIMARY KEY,
      trip_id int NOT NULL,
      activity varchar(100) NOT NULL,
      num_votes integer DEFAULT 0,
      FOREIGN KEY(trip_id) REFERENCES trips(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS trips_destinations (
      trip_id int NOT NULL,
      destination_id int NOT NULL,
      PRIMARY KEY (trip_id, destination_id),
      FOREIGN KEY (trip_id) REFERENCES trips(id) ON UPDATE CASCADE,
      FOREIGN KEY (destination_id) REFERENCES destinations(id) ON UPDATE CASCADE
    );
  `
  try {
    await pool.query(createTablesQuery)
    console.log('🎉 All tables created successfully')
  } catch (err) {
    console.error('⚠️ Error creating tables', err)
  }
}

const seedData = async () => {
  await createTables()
  
  // Seed Trips from your data.json
  const tripsFile = fs.readFileSync(path.resolve(__dirname, './data/data.json'))
  const tripsData = JSON.parse(tripsFile)

  tripsData.forEach((trip) => {
    const insertQuery = {
      text: 'INSERT INTO trips (title, description, img_url, num_days, start_date, end_date, total_cost) VALUES ($1, $2, $3, $4, $5, $6, $7)'
    }
    const values = [trip.title, trip.description, trip.img_url, trip.num_days, trip.start_date, trip.end_date, trip.total_cost]
    
    pool.query(insertQuery, values, (err) => {
      if (err) console.error('⚠️ Error seeding trip', err)
      else console.log(`✅ Seeded: ${trip.title}`)
    })
  })
}

seedData()