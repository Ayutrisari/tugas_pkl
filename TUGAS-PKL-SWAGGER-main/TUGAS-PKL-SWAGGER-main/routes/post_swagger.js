const postPaths = {
    "/api/posts": {
        "get": {
            "tags": ["Kelola Postingan"],
            "summary": "Pagination buat atur limit",
            "parameters": [
                {
                    "name": "page",
                    "in": "query",
                    "required": false,
                    "schema": { "type": "integer", "default": 1 },
                    "description": "halaman yang mau dibuka"
                },
                {
                    "name": "limit",
                    "in": "query",
                    "required": false,
                    "schema": { "type": "integer", "default": 6 },
                    "description": "Batas jumlah data per halaman"
                },
                {
                    "name": "search",
                    "in": "query",
                    "required": false,
                    "schema": { "type": "string" },
                    "description": "Kata kunci pencarian judul atau kategori"
                }
            ],
            "responses": {
                "200": { "description": "Berhasil mengambil data" },
                "500": { "description": "Internal Server Error" }
            }
        },
        "post": {
            "tags": ["Kelola Postingan"],
            "summary": "Membuat postingan baru",
            "security": [{ "bearerAuth": [] }],
            "requestBody": {
                "required": true,
                "content": {
                    "multipart/form-data": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "judul": { "type": "string" },
                                "isi": { "type": "string" },
                                "category_id": { "type": "integer", "description": "ID Kategori (Contoh: 1)" },
                                "url_gambar": { "type": "string", "format": "binary" } // SUDAH FIX
                            },
                            "required": ["judul", "isi", "category_id", "url_gambar"]
                        }
                    }
                }
            },
            "responses": {
                "201": { "description": "Postingan berhasil dibuat" },
                "400": { "description": "Data tidak lengkap" },
                "500": { "description": "Internal Server Error" }
            }
        }
    },
    "/api/posts/slug/{slug}": {
        "get": {
            "tags": ["Kelola Postingan"],
            "summary": "Melihat detail postingan berdasarkan Slug",
            "parameters": [{
                "name": "slug",
                "in": "path",
                "required": true,
                "schema": { "type": "string" }
            }],
            "responses": {
                "200": { "description": "Data ditemukan" }
            }
        }
    },
    "/api/posts/{id}": {
        "get": {
            "tags": ["Kelola Postingan"],
            "summary": "Melihat postingan berdasarkan ID",
            "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } }],
            "responses": { "200": { "description": "Data ditemukan" } }
        },
        "put": {
            "tags": ["Kelola Postingan"],
            "summary": "Mengedit postingan",
            "security": [{ "bearerAuth": [] }],
            "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } }],
            "requestBody": {
                "required": true,
                "content": {
                    "multipart/form-data": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "judul": { "type": "string" },
                                "isi": { "type": "string" },
                                "category_id": { "type": "integer" },
                                "url_gambar": { "type": "string", "format": "binary" } // SUDAH FIX
                            }
                        }
                    }
                }
            },
            "responses": { "200": { "description": "Berhasil diedit" } }
        },
        "delete": {
            "tags": ["Kelola Postingan"],
            "summary": "Menghapus postingan",
            "security": [{ "bearerAuth": [] }],
            "parameters": [{ "name": "id", "in": "path", "required": true, "schema": { "type": "integer" } }],
            "responses": { "200": { "description": "Berhasil dihapus" } }
        }
    }
};

module.exports = postPaths;