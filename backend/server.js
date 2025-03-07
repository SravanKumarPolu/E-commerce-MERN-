import 'dotenv/config'

import connectCloudinary from './config/cloudinary.js';
import connectDB from './config/mongodb.js';
import cors from 'cors'
import express from 'express'

//App config
const app = express();
const port = process.env.PORT || 4000
connectDB()
connectCloudinary();

//middleware
app.use(express.json());
app.use(cors("*"))

//api endpoints
app.get('/', (req, res) => {
  res.send("API Working")
})

app.listen(port, () => console.log('Server started on PORT: ' + port))
