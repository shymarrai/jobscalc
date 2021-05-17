const Database = require('./config')

const initDb =  {

  async init(){

    const db = await Database()

    await db.exec(`
      CREATE TABLE profiles(
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      name VARCHAR(30), 
      avatar VARCHAR(100),
      monthly_budget INTEGER,
      days_per_week INTEGER,
      hours_per_day INTEGER,
      vacation_per_year INTEGER,
      value_hour INTEGER
      )`
      
    )

    await db.exec(`
    CREATE TABLE jobs(
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      name VARCHAR(30), 
      daily_hours INTEGER,
      total_hours INTEGER,
      created_at DATETIME
      )`
      
    )

    await db.run(
      `INSERT INTO profiles(
      name, 
      avatar, 
      monthly_budget, 
      days_per_week, 
      hours_per_day, 
      vacation_per_year, 
      value_hour
      ) VALUES (
        'teste',
        'https://pbs.twimg.com/profile_images/1343657430237007872/WUhVWnLC_400x400.jpg',
        '5000',
        5,
        6,
        4,
        7

      )`
    )

    await db.run(`
    INSERT INTO jobs(
      name,
      daily_hours,
      total_hours,
      created_at
    ) VALUES (
      'PRIMEIRO WORKANA',
      6,
      1,
      1621266034210
    )
    `)



    await db.close()

}

}

initDb.init()