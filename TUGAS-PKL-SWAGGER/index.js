require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const swaggerSpec = require('./utils/swagger'); 

const userRoute = require('./routes/user_route');
const postRoute = require('./routes/post_route');
const categoryRoute = require('./routes/category_route');

const app = express();
const PORT = process.env.PORT || 3000;

// Izinkan Frontend Vite (5173)
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
})); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// RUTE API (Pakai prefix /api)
app.use('/api', userRoute);      
app.use('/api', postRoute);      
app.use('/api', categoryRoute);  

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
    console.log(`🚀 Backend jalan di http://localhost:${PORT}`);
});