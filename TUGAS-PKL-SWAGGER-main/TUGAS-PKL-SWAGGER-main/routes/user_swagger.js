<<<<<<< HEAD
const userPaths = {
    "/register": {
        "post": {
            "tags": ["Authentication"],
            "summary": "Registrasi user baru",
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "email": { "type": "string", "example": "user@gmail.com" },
                                "password": { "type": "string", "example": "12345678" }
                            }
                        }
                    }
                }
            },
            "responses": { "201": { "description": "User berhasil dibuat" } }
        }
    },
    "/login": {
        "post": {
            "tags": ["Authentication"],
            "summary": "Login user",
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "email": { "type": "string", "example": "user@gmail.com" },
                                "password": { "type": "string", "example": "12345678" }
                            }
                        }
                    }
                }
            },
            "responses": { "200": { "description": "Login Berhasil" } }
        }
    },
    "/refresh-token": {
        "post": {
            "tags": ["Authentication"],
            "summary": "Refresh access token",
            "requestBody": {
                "required": true,
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "refreshToken": { "type": "string" }
                            }
                        }
                    }
                }
            },
            "responses": { "200": { "description": "Token berhasil diperbarui" } }
        }
    }
};

module.exports = userPaths;
=======
module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'API Projek PKL',
    version: '1.0.0',
    description: 'Dokumentasi API untuk manajemen postingan',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Server Lokal',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  paths: {
    '/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Login berhasil' },
        },
      },
    },
    '/posts': {
      post: {
        tags: ['Posts'],
        summary: 'Tambah postingan baru',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  judul: { type: 'string' },
                  isi: { type: 'string' },
                  gambar: { type: 'string', format: 'binary' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Post berhasil dibuat' },
        },
      },
      get: {
        tags: ['Posts'],
        summary: 'Ambil semua postingan',
        responses: {
          200: { description: 'Daftar post berhasil diambil' },
        },
      },
    },
    '/posts/{id}': {
      put: {
        tags: ['Posts'],
        summary: 'Update post',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  judul: { type: 'string', example: 'Judul Baru' },
                  isi: { type: 'string', example: 'Isi konten baru' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Update berhasil' },
        },
      },
      delete: {
        tags: ['Posts'],
        summary: 'Hapus post',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
        ],
        responses: {
          200: { description: 'Post berhasil dihapus' },
        },
      },
    },
  },
};
>>>>>>> d12d04dedc174f333dfd3a9f634b6e142a6d3480
