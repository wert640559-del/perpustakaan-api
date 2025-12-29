# 📚 API Perpustakaan

API RESTful untuk sistem manajemen perpustakaan digital dengan fitur CRUD lengkap untuk buku dan penulis, dilengkapi autentikasi API Key, validasi input, dan soft delete.

## 🚀 Fitur Utama

- ✅ **CRUD Lengkap** untuk Buku dan Penulis
- ✅ **Autentikasi API Key** untuk keamanan endpoint
- ✅ **Validasi Input** menggunakan express-validator
- ✅ **Soft Delete** pada entitas Buku
- ✅ **Pencarian** dengan filter multi-kriteria
- ✅ **Pagination** pada endpoint GET all
- ✅ **Error Handling** terpusat dengan Prisma error handling
- ✅ **Relasi One-to-Many** antara Penulis dan Buku
- ✅ **UUID** sebagai Primary Key semua tabel

## 📋 Prasyarat

- Node.js v18 atau lebih baru
- PostgreSQL v12 atau lebih baru
- Postman / cURL (untuk testing API)

## ⚙️ Instalasi

### 1. Clone Repository
```bash
git clone <repository-url>
cd library-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database
Buat database PostgreSQL baru:
```sql
CREATE DATABASE library_db;
```

### 4. Konfigurasi Environment
Buat file `.env` di root project:
```env
# Server Configuration
HOST=localhost
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/library_db?schema=public"

# API Key
API_KEY=katasandi123
```

### 5. Setup Prisma
```bash
# Generate Prisma Client
npx prisma generate

# Jalankan migration
npx prisma migrate dev --name init
```

### 6. Jalankan Server
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

## 🔐 Autentikasi

Semua endpoint API **membutuhkan API Key** yang valid. Tambahkan header berikut ke setiap request:

```
x-api-key: katasandi123
```

**Response Error jika API Key tidak valid:**
```json
{
  "success": false,
  "message": "Header X-API-Key wajib diisi untuk akses API!"
}
```

## 📚 Endpoint Buku

### 1. GET /api/books - Mendapatkan semua buku
**Query Parameters:**
| Parameter | Tipe | Default | Deskripsi |
|-----------|------|---------|-----------|
| page | integer | 1 | Halaman saat ini |
| limit | integer | 10 | Jumlah item per halaman |

**Contoh Request:**
```http
GET http://localhost:3000/api/books?page=1&limit=5
Headers: x-api-key: katasandi123
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Buku berhasil diambil",
  "data": {
    "jumlah": 15,
    "data": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "title": "Harry Potter",
        "isbn": "9780747532743",
        "description": "Novel fantasi",
        "year": 1997,
        "stock": 10,
        "authorId": "123e4567-e89b-12d3-a456-426614174000",
        "deletedAt": null,
        "createdAt": "2024-01-01T10:00:00.000Z",
        "updatedAt": "2024-01-01T10:00:00.000Z",
        "author": {
          "id": "123e4567-e89b-12d3-a456-426614174000",
          "name": "J.K. Rowling",
          "bio": "Penulis serial Harry Potter",
          "birthDate": "1965-07-31T00:00:00.000Z",
          "createdAt": "2024-01-01T09:00:00.000Z",
          "updatedAt": "2024-01-01T09:00:00.000Z"
        }
      }
    ]
  },
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 15
  }
}
```

### 2. GET /api/books/:id - Mendapatkan buku berdasarkan ID
**Path Parameter:**
| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| id | UUID (string) | ID buku yang valid |

**Contoh Request:**
```http
GET http://localhost:3000/api/books/550e8400-e29b-41d4-a716-446655440000
Headers: x-api-key: katasandi123
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Buku tidak ditemukan",
  "errors": {
    "stack": "..."
  }
}
```

### 3. GET /api/books/search - Mencari buku
**Query Parameters:**
| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| title | string (opsional) | Judul buku (case-insensitive partial match) |
| author | string (opsional) | Nama penulis (case-insensitive partial match) |
| year | integer (opsional) | Tahun terbit |

**Contoh Request:**
```http
GET http://localhost:3000/api/books/search?title=harry&author=rowling
Headers: x-api-key: katasandi123
```

### 4. POST /api/books - Membuat buku baru
**Request Body (JSON):**
```json
{
  "title": "Harry Potter and the Philosopher's Stone",
  "isbn": "9780747532743",
  "description": "Novel fantasi pertama seri Harry Potter",
  "year": 1997,
  "stock": 10,
  "authorId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Validasi:**
- `title`: wajib, minimal 3 karakter
- `isbn`: wajib, 10-13 karakter
- `year`: wajib, antara 1000-tahun sekarang
- `stock`: wajib, tidak boleh negatif
- `authorId`: wajib, UUID valid

**Response Error (400 - Validasi):**
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": [
    {
      "field": "isbn",
      "message": "ISBN sudah terdaftar"
    }
  ]
}
```

### 5. PUT /api/books/:id - Mengupdate buku
**Request Body (JSON - partial update):**
```json
{
  "title": "Harry Potter Updated Title",
  "stock": 5
}
```

**Path Parameter:**
- `id`: UUID buku yang akan diupdate

### 6. DELETE /api/books/:id - Menghapus buku (Soft Delete)
**Note:** Endpoint ini melakukan soft delete (hanya mengisi field `deletedAt`)

**Contoh Request:**
```http
DELETE http://localhost:3000/api/books/550e8400-e29b-41d4-a716-446655440000
Headers: x-api-key: katasandi123
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Buku berhasil dihapus",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "deletedAt": "2024-01-02T10:00:00.000Z",
    "...": "..."
  }
}
```

## 👤 Endpoint Penulis

### 1. GET /api/authors - Mendapatkan semua penulis
**Query Parameters:** sama seperti endpoint buku

### 2. GET /api/authors/:id - Mendapatkan penulis berdasarkan ID
**Response Success (200):**
```json
{
  "success": true,
  "message": "Penulis berhasil diambil",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "J.K. Rowling",
    "bio": "Penulis serial Harry Potter",
    "birthDate": "1965-07-31T00:00:00.000Z",
    "createdAt": "2024-01-01T09:00:00.000Z",
    "updatedAt": "2024-01-01T09:00:00.000Z",
    "books": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "title": "Harry Potter",
        "isbn": "9780747532743",
        "...": "..."
      }
    ]
  }
}
```

### 3. GET /api/authors/search - Mencari penulis
**Query Parameters:**
| Parameter | Tipe | Deskripsi |
|-----------|------|-----------|
| name | string (opsional) | Nama penulis (case-insensitive partial match) |

### 4. POST /api/authors - Membuat penulis baru
**Request Body (JSON):**
```json
{
  "name": "J.K. Rowling",
  "bio": "Penulis serial Harry Potter",
  "birthDate": "1965-07-31"
}
```

**Validasi:**
- `name`: wajib, minimal 3 karakter
- `birthDate`: wajib, format ISO 8601 (YYYY-MM-DD), tidak boleh di masa depan

### 5. PUT /api/authors/:id - Mengupdate penulis
**Request Body (JSON - partial update):**
```json
{
  "bio": "Penulis serial Harry Potter dan Cormoran Strike"
}
```

### 6. DELETE /api/authors/:id - Menghapus penulis (Hard Delete)
**Note:** Endpoint ini melakukan hard delete. Penulis hanya bisa dihapus jika tidak memiliki buku.

**Response Error (400):**
```json
{
  "success": false,
  "message": "Penulis masih memiliki buku. Hapus buku terlebih dahulu."
}
```

## 🎯 Contoh Alur Penggunaan

### **Alur 1: Membuat Penulis dan Buku**
```bash
# 1. Buat penulis terlebih dahulu
curl -X POST http://localhost:3000/api/authors \
  -H "x-api-key: katasandi123" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "J.K. Rowling",
    "bio": "Penulis serial Harry Potter",
    "birthDate": "1965-07-31"
  }'

# Response: dapatkan authorId dari response

# 2. Buat buku dengan authorId yang didapat
curl -X POST http://localhost:3000/api/books \
  -H "x-api-key: katasandi123" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Harry Potter and the Philosopher'\''s Stone",
    "isbn": "9780747532743",
    "description": "Novel fantasi pertama seri Harry Potter",
    "year": 1997,
    "stock": 10,
    "authorId": "author-id-dari-response-sebelumnya"
  }'
```

### **Alur 2: Search dan Filter**
```bash
# Cari buku dengan filter
curl -X GET "http://localhost:3000/api/books/search?title=potter&year=1997" \
  -H "x-api-key: katasandi123"

# Dapatkan semua buku dengan pagination
curl -X GET "http://localhost:3000/api/books?page=2&limit=5" \
  -H "x-api-key: katasandi123"
```

## 🚨 Error Handling

### **Prisma Error Codes:**
| Code | Error | HTTP Status |
|------|-------|-------------|
| P2002 | Unique constraint violation (contoh: ISBN duplikat) | 400 |
| P2025 | Record not found | 404 |

### **Custom Error Messages:**
| Kondisi | HTTP Status | Message |
|---------|-------------|---------|
| API Key tidak ada | 401 | "Header X-API-Key wajib diisi untuk akses API!" |
| API Key tidak valid | 401 | "API Key tidak valid!" |
| Validasi gagal | 400 | "Validasi gagal" |
| Data tidak ditemukan | 404 | "[Resource] tidak ditemukan" |
| Server error | 500 | "Terjadi kesalahan server" |

### **Response Error Format:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [
    {
      "field": "field_name",
      "message": "Error description"
    }
  ]
}
```

**Untuk development mode**, response juga menyertakan stack trace:
```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "stack": "Error stack trace details..."
  }
}
```

## 🗄️ Struktur Database

### **Tabel: books**
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid() |
| title | VARCHAR(255) | NOT NULL |
| isbn | VARCHAR(13) | UNIQUE, NOT NULL |
| description | TEXT | NULLABLE |
| year | INTEGER | NOT NULL |
| stock | INTEGER | DEFAULT 0 |
| authorId | UUID | FOREIGN KEY (authors.id) |
| deletedAt | TIMESTAMP | NULLABLE (soft delete) |
| createdAt | TIMESTAMP | DEFAULT NOW() |
| updatedAt | TIMESTAMP | DEFAULT NOW() |

### **Tabel: authors**
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid() |
| name | VARCHAR(255) | NOT NULL |
| bio | TEXT | NULLABLE |
| birthDate | TIMESTAMP | NOT NULL |
| createdAt | TIMESTAMP | DEFAULT NOW() |
| updatedAt | TIMESTAMP | DEFAULT NOW() |

**Relasi:** `Author (1) → Books (Many)`

## 🧪 Testing dengan Postman

### **Import Collection:**
1. Download [Library_API.postman_collection.json](#)
2. Buka Postman → Import → Pilih file
3. Set environment variables:
   - `base_url`: `http://localhost:3000`
   - `api_key`: `katasandi123`

### **Test Skenario:**
1. **Positive Cases:**
   - CRUD operations dengan data valid
   - Search dengan berbagai kombinasi filter
   - Pagination testing

2. **Negative Cases:**
   - Request tanpa API key
   - Request dengan API key salah
   - Validasi error (data tidak lengkap/format salah)
   - Delete penulis yang masih memiliki buku

## 📦 Deployment

### **Environment Variables untuk Production:**
```env
NODE_ENV=production
PORT=8080
DATABASE_URL="postgresql://prod_user:strong_password@production-db:5432/library_prod"
API_KEY="generate_secure_random_key_here"
```

### **Build untuk Production:**
```bash
# Build TypeScript
npm run build

# Jalankan dengan PM2
npm install -g pm2
pm2 start dist/index.js --name "library-api"
```

## 🛠️ Troubleshooting

| Masalah | Solusi |
|---------|--------|
| "Cannot find module './generated/client'" | Jalankan `npx prisma generate` |
| Database connection error | Periksa DATABASE_URL di .env |
| "API Key tidak valid" | Pastikan header `x-api-key` dikirim |
| Migration failed | Reset DB: `npx prisma migrate reset` |
| Port already in use | Ganti PORT di .env atau kill process di port tersebut |

## 📄 License

MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 👥 Kontribusi

1. Fork repository
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

## 📞 Support

Jika menemui masalah:
1. Cek [Troubleshooting](#️-troubleshooting) section
2. Pastikan semua dependency terinstall
3. Cek log error di console
4. Buat issue di repository

---

**API Status**: `GET /` - Cek status API
```json
{
  "success": true,
  "message": "Selamat datang di API Perpustakaan!",
  "data": {
    "hari": 3,
    "status": "Server hidup"
  }
}
```

**Terakhir diupdate**: Desember 2025  
**Versi API**: 2.0.0