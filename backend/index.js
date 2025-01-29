import express from 'express'
import cors from 'cors'
import pg from 'pg'
import env from 'dotenv'
import bcrypt from 'bcrypt'
import passport from 'passport'
import session from 'express-session'
import LocalStrategy from 'passport-local'
import GoogleStrategy from 'passport-google-oauth2'

const app = express()
const port = process.env.PORT
const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) // SALT_ROUNDS should be parsed to integer

env.config()

// Web session settings
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 *24, // 24 hours
      secure: false, // without https
    }
  })
)

// Middleware for parsing JSON and URL-encoded data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Initialize passport session
app.use(passport.initialize())
app.use(passport.session())

// cors license
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PATCH,DELETE',
    credentials: true,
  })
)

// Database initialze
const db = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})


// local login route
app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: 'An error occurred' })
    }
    if (!user) {
      return res.status(401).json({ error: info?.message || 'Unauthorized' })
    } 
    else {
      return res.status(200).json({ data: user, message: 'Login success' })
    }
  })(req, res, next)
})

// registration route
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body
  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  const passHash = await bcrypt.hash(password, saltRounds)
  try {
    const checkIsRegistered = await db.query(
      'SELECT email FROM users WHERE email = $1', [email]
    )
    if (checkIsRegistered.rows.length) {
      return res.status(409).json({ error: 'Email is already registered.'})
    }
    const user = await db.query(
      'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id as user_id, username',
      [username, passHash, email]
    )
    const result = user.rows
    res.status(200).json({ data: result, message: 'User added successfully' })
  } 
  catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// update crypto portfolio
app.patch('/set-crypto', async (req, res) => {
  const { user_id, data } = req.body
  // console.log(user_id, data)
  if (!user_id || !data) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    await db.query('DELETE FROM user_portfolios WHERE user_id = $1', [user_id])
    await db.query(
      `INSERT INTO user_portfolios (user_id, page, symbol, average, amount) VALUES ${data}`
    )
    res.status(201).json({ message: 'Crypto add/update successfully' })
  } 
  catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// delete crypto portfolio
app.delete('/delete-crypto', async (req, res) => {
  const { user_id, page } = req.body
  if (!user_id || !page) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    await db.query('DELETE FROM user_portfolios WHERE user_id = $1 AND page = $2', [user_id, page])
    await db.query(
      'UPDATE user_portfolios SET page = page - 1 WHERE user_id = $1 AND page > $2', [user_id, page]
    )
    res.status(204).json({ message: 'Crypto deleted successfully' })
  } 
  catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// get session data
app.get('/get-session', (req, res) => {
  try{
    res.json({ body: req.session.user })
  }
  catch (err) {
    res.json({err})
  }
})

// Oauth login success 
app.get('/auth/success', (async (req, res) => {
    const { email } = req.user
    
    // check user credentials data
    const result = await db.query( 
      "SELECT id as user_id, username FROM users WHERE email = $1", [email]
    )
    if (result.rows.length) {
      // fetch user portfolio
      const data = await db.query( 
        "SELECT user_id, username, page, symbol, average, amount FROM users JOIN user_portfolios ON users.id = user_portfolios.user_id WHERE user_id = $1",
        [result.rows[0].user_id]
      )
      if (!data.rows.length) {
        req.session.user = { user: result.rows }
        res.redirect('http://localhost:3000/crypto-portfolio-track')
      } else {
        req.session.user = { data: data.rows }
        res.redirect('http://localhost:3000/crypto-portfolio-track')
      }
    } 
    else {
      req.session.user = { user_id: null, username: null, email: email , crypto: null}
      res.redirect('http://localhost:3000/crypto-portfolio-track/sign-up')
    }
}))

// app.get('/login/failed', (req, res) => {
//   res.status(401).json({
//     succes: false,
//     message: 'An error occurred during authentication'
//   })
// })

// route for starting login with Google Auth Strategy
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'] 
}))

// Google Auth Callback route
app.get('/auth/google/callback', 
  passport.authenticate('google', {
    successRedirect: '/auth/success',
    failureRedirect: '/login/failed'
}))

// Passport Local Strategy
passport.use(
  'local',
  new LocalStrategy(async (username, password, cb) => {
    try {
      const result = await db.query('SELECT * FROM users WHERE username = $1', [username])

      if (result.rows.length > 0) {
        const user = result.rows[0]
        const storedHashedPassword = user.password
        bcrypt.compare(password, storedHashedPassword, async (err, isMatch) => {
          if (err) {
            return cb(err)
          }

          if (isMatch) {
            const data = await db.query(
              'SELECT user_id, username, page, symbol, average, amount FROM users JOIN user_portfolios ON users.id = user_portfolios.user_id WHERE user_id = $1',
              [user.id]
            )
            if (data.rows.length === 0) {
              const result = await db.query(
                'SELECT id as user_id, username FROM users WHERE id = $1',
                [user.id]
              )
              return cb(null, result.rows)
            } 
            else {
              return cb(null, data.rows)
            }

          } else {
            return cb(null, false, { message: 'Incorrect credentials.' })
          }
        })

      } else {
        return cb(null, false, { message: 'User not found' })
      }
    } catch (err) {
      cb(err)
    }
  })
)

// Passport Google Strategy
passport.use(
  'google',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, cb) => {
      return cb(null, profile)
    }
  )
)

passport.serializeUser((user, cb) => {
  cb(null, user)
})

passport.deserializeUser((user, cb) => {
  cb(null, user)
})


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
