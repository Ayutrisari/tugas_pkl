const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// --- KONFIGURASI SWAGGER (BIAR TOMBOL GEMBOK MUNCUL) ---
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Auth & User CRUD',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  // MEMBACA SEMUA FILE DI FOLDER ROUTES
  apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- PENDAFTARAN SEMUA ROUTE SESUAI FILE LO ---
const authRoutes = require('./routes/auth_route'); 
const postRoutes = require('./routes/post_route'); // INI YANG BUAT UPLOAD BUNGA
const categoryRoutes = require('./routes/category_route');
const userRoutes = require('./routes/user_route');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌸 Server jalan di http://localhost:${PORT}`);
  console.log(`🚀 CEK SWAGGER SEKARANG: http://localhost:${PORT}/api-docs`);
});