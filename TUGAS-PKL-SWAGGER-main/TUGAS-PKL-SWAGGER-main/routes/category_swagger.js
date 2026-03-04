const categoryPaths = {
  "/categories": {
    "get": {
      "tags": ["Kelola Kategori"],
      "summary": "Melihat semua kategori",
      "responses": {
        "200": { "description": "Berhasil" }
      }
    },
    "post": {
      "tags": ["Kelola Kategori"],
      "summary": "Tambah kategori baru",
      "security": [{ "bearerAuth": [] }],
      "requestBody": {
        "required": true,
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "name": { "type": "string" }
              }
            }
          }
        }
      },
      "responses": {
        "201": { "description": "Berhasil dibuat" }
      }
    }
  }
};

module.exports = categoryPaths;