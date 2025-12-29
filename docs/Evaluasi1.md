# 📚 API Perpustakaan

API untuk mengelola data buku dan anggota perpustakaan. Dibangun dengan Express.js, TypeScript, dan mengikuti arsitektur MVC + Service Layer.

## 🚀 Fitur

- ✅ CRUD Lengkap untuk Buku dan Anggota
- ✅ Search & Filter dengan Query Parameters
- ✅ Validasi Input menggunakan express-validator
- ✅ Response Helper yang Konsisten
- ✅ Middleware Custom (X-Request-ID, Timing, API Key)
- ✅ Global Error Handler dengan asyncHandler
- ✅ TypeScript Support

## 📦 Instalasi

1. Clone repository
```bash
git clone <repository-url>
cd perpustakaan-api
```

2. Install dependencies
```bash
npm install
```

3. Konfigurasi environment
```bash
cp .env.example .env
# Edit .env sesuai kebutuhan
```

4. Jalankan server
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## 🔐 Authentication

Semua endpoint memerlukan API Key di header:
```
X-API-Key: admin1234
```

Optional: Tambahkan Request ID untuk tracking:
```
X-Request-ID: req-123456789
```

## 📖 Endpoint Buku

### GET /api/books
Mendapatkan semua buku

**Request:**
```http
GET /api/books
Headers:
  X-API-Key: admin1234
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Daftar buku berhasil diambil",
  "data": {
    "jumlah": 5,
    "data": [
      {
        "id": 1,
        "judul": "Laskar Pelangi",
        "penulis": "Andrea Hirata",
        "tahun": 2005,
        "stok": 10,
        "deskripsi": "Novel tentang persahabatan dan pendidikan",
        "created_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### GET /api/books/search
Mencari buku dengan filter

**Request:**
```http
GET /api/books/search?search=Laskar&min_tahun=2000&max_tahun=2010
Headers:
  X-API-Key: admin1234
```

**Query Parameters:**
- `search` (optional): Keyword pencarian (judul, penulis, atau deskripsi)
- `min_tahun` (optional): Tahun terbit minimal
- `max_tahun` (optional): Tahun terbit maksimal

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Buku berhasil diambil",
  "data": [
    {
      "id": 1,
      "judul": "Laskar Pelangi",
      "penulis": "Andrea Hirata",
      "tahun": 2005,
      "stok": 10,
      "deskripsi": "Novel tentang persahabatan dan pendidikan",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### GET /api/books/:id
Mendapatkan buku berdasarkan ID

**Request:**
```http
GET /api/books/1
Headers:
  X-API-Key: admin1234
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Buku berhasil diambil",
  "data": {
    "id": 1,
    "judul": "Laskar Pelangi",
    "penulis": "Andrea Hirata",
    "tahun": 2005,
    "stok": 10,
    "deskripsi": "Novel tentang persahabatan dan pendidikan",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "message": "Ndak ada buku yang kamu cari!",
  "errors": {
    "request_id": "req-1733505600000-abc123",
    "response_time": "15ms",
    "stack": "Error: Ndak ada buku yang kamu cari!\n    at getBookbyId..."
  }
}
```

### POST /api/books
Menambahkan buku baru

**Request:**
```http
POST /api/books
Headers:
  X-API-Key: admin1234
  Content-Type: application/json

Body:
{
  "judul": "Bumi Manusia",
  "penulis": "Pramoedya Ananta Toer",
  "tahun": 1980,
  "stok": 5,
  "deskripsi": "Novel sejarah Indonesia"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Buku berhasil ditambahkan",
  "data": {
    "id": 6,
    "judul": "Bumi Manusia",
    "penulis": "Pramoedya Ananta Toer",
    "tahun": 1980,
    "stok": 5,
    "deskripsi": "Novel sejarah Indonesia",
    "created_at": "2024-12-06T10:30:00.000Z"
  }
}
```

**Response (Error Validasi - 400):**
```json
{
  "success": false,
  "message": "Validasi gak berhasil",
  "errors": [
    {
      "field": "judul",
      "message": "Judul harus diisi"
    },
    {
      "field": "tahun",
      "message": "Tahun tidak boleh melebihi tahun sekarang"
    }
  ]
}
```

### PUT /api/books/:id
Memperbarui data buku

**Request:**
```http
PUT /api/books/1
Headers:
  X-API-Key: admin1234
  Content-Type: application/json

Body:
{
  "stok": 15,
  "deskripsi": "Novel best seller tentang persahabatan"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Buku berhasil diupdate",
  "data": {
    "id": 1,
    "judul": "Laskar Pelangi",
    "penulis": "Andrea Hirata",
    "tahun": 2005,
    "stok": 15,
    "deskripsi": "Novel best seller tentang persahabatan",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-12-06T10:35:00.000Z"
  }
}
```

### DELETE /api/books/:id
Menghapus buku

**Request:**
```http
DELETE /api/books/1
Headers:
  X-API-Key: admin1234
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Buku berhasil dihapus",
  "data": {
    "id": 1,
    "judul": "Laskar Pelangi",
    "penulis": "Andrea Hirata",
    "tahun": 2005,
    "stok": 10,
    "deskripsi": "Novel tentang persahabatan dan pendidikan",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

## 👥 Endpoint Anggota

### GET /api/members
Mendapatkan semua anggota

**Request:**
```http
GET /api/members
Headers:
  X-API-Key: admin1234
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Daftar member berhasil diambil",
  "data": {
    "jumlah": 5,
    "data": [
      {
        "id": 1,
        "nama": "Muhammad Harits",
        "email": "wert640559@gmail.com",
        "telepon": "083132212944",
        "alamat": "Jl. M. Ali No. 30",
        "tanggal_daftar": "2025-12-06",
        "created_at": "2025-12-06T00:00:00Z"
      }
    ]
  }
}
```

### GET /api/members/search
Mencari anggota dengan filter

**Request:**
```http
GET /api/members/search?search=Harits&min_tanggal_daftar=2025-01-01
Headers:
  X-API-Key: admin1234
```

**Query Parameters:**
- `search` (optional): Keyword pencarian (nama, email, atau alamat)
- `min_tanggal_daftar` (optional): Tanggal daftar minimal (YYYY-MM-DD)
- `max_tanggal_daftar` (optional): Tanggal daftar maksimal (YYYY-MM-DD)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Member berhasil diambil",
  "data": [
    {
      "id": 1,
      "nama": "Muhammad Harits",
      "email": "wert640559@gmail.com",
      "telepon": "083132212944",
      "alamat": "Jl. M. Ali No. 30",
      "tanggal_daftar": "2025-12-06",
      "created_at": "2025-12-06T00:00:00Z"
    }
  ]
}
```

### GET /api/members/:id
Mendapatkan anggota berdasarkan ID

**Request:**
```http
GET /api/members/1
Headers:
  X-API-Key: admin1234
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Member berhasil diambil",
  "data": {
    "id": 1,
    "nama": "Muhammad Harits",
    "email": "wert640559@gmail.com",
    "telepon": "083132212944",
    "alamat": "Jl. M. Ali No. 30",
    "tanggal_daftar": "2025-12-06",
    "created_at": "2025-12-06T00:00:00Z"
  }
}
```

### POST /api/members
Menambahkan anggota baru

**Request:**
```http
POST /api/members
Headers:
  X-API-Key: admin1234
  Content-Type: application/json

Body:
{
  "nama": "John Doe",
  "email": "john@example.com",
  "telepon": "081234567890",
  "alamat": "Jl. Contoh No. 123",
  "tanggal_daftar": "2024-12-06"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Member berhasil ditambahkan",
  "data": {
    "id": 6,
    "nama": "John Doe",
    "email": "john@example.com",
    "telepon": "081234567890",
    "alamat": "Jl. Contoh No. 123",
    "tanggal_daftar": "2024-12-06",
    "created_at": "2024-12-06T10:40:00.000Z"
  }
}
```

**Response (Error Validasi - 400):**
```json
{
  "success": false,
  "message": "Validasi tidak berhasil",
  "errors": [
    {
      "field": "email",
      "message": "Format email tidak valid"
    },
    {
      "field": "telepon",
      "message": "Telepon harus 10-13 digit"
    }
  ]
}
```

### PUT /api/members/:id
Memperbarui data anggota

**Request:**
```http
PUT /api/members/1
Headers:
  X-API-Key: admin1234
  Content-Type: application/json

Body:
{
  "alamat": "Jl. Baru No. 45",
  "telepon": "08111222333"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Member berhasil diupdate",
  "data": {
    "id": 1,
    "nama": "Muhammad Harits",
    "email": "wert640559@gmail.com",
    "telepon": "08111222333",
    "alamat": "Jl. Baru No. 45",
    "tanggal_daftar": "2025-12-06",
    "created_at": "2025-12-06T00:00:00Z",
    "updated_at": "2024-12-06T10:45:00.000Z"
  }
}
```

### DELETE /api/members/:id
Menghapus anggota

**Request:**
```http
DELETE /api/members/1
Headers:
  X-API-Key: admin1234
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Member berhasil dihapus",
  "data": {
    "id": 1,
    "nama": "Muhammad Harits",
    "email": "wert640559@gmail.com",
    "telepon": "083132212944",
    "alamat": "Jl. M. Ali No. 30",
    "tanggal_daftar": "2025-12-06",
    "created_at": "2025-12-06T00:00:00Z"
  }
}
```

## 🏠 Root Endpoint

### GET /
Informasi API

**Request:**
```http
GET /
Headers:
  X-API-Key: admin1234
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Selamat datang di API Perpustakaan",
  "data": {
    "name": "Perpustakaan Api",
    "status": "Online"
  }
}
```

## ⚠️ Error Responses

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Header X-API-Key wajib diisi untuk akses API!"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Route GET /api/products tidak ditemukan di API Perpustakaan!",
  "errors": {
    "request_id": "req-1733505600000-xyz789",
    "response_time": "5ms"
  }
}
```

### Internal Server Error (500)
```json
{
  "success": false,
  "message": "Terjadi kesalahan server",
  "errors": {
    "request_id": "req-1733505600000-abc123",
    "response_time": "25ms",
    "stack": "TypeError: Cannot read property 'id' of undefined..."
  }
}
```

## 📁 Struktur Proyek
```
src/
├── controllers/     # Controller untuk request handling
│   ├── book.controller.ts
│   └── member.controller.ts
├── services/       # Business logic
│   ├── book.service.ts
│   └── member.service.ts
├── models/         # Data models
│   ├── book.model.ts
│   └── member.model.ts
├── routes/         # API routes
│   ├── book.route.ts
│   └── member.route.ts
├── middlewares/    # Custom middlewares
│   ├── error.handler.ts
│   ├── book.validation.ts
│   ├── member.validation.ts
│   └── custom.middleware.ts
├── utils/          # Utility functions
│   ├── response.ts
│   ├── async.handler.ts
│   └── env.ts
└── types/          # TypeScript type definitions
    └── express.d.ts
```

## 🛠️ Teknologi
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Validation**: express-validator
- **Security**: helmet, cors
- **Logging**: morgan

## 📄 License
MIT

## 👨‍💻 Author
Muhammad Harits

---

***

### Jawaban Evaluasi Pengetahuan

| No. | Soal | Jawaban Tepat |
| :---: | :--- | :--- |
| **1** | Peran utama Backend dalam sebuah aplikasi? | **b)** Mengelola data, logika bisnis, dan komunikasi database |
| **2** | HTTP Method POST digunakan untuk operasi apa dalam CRUD? | **c)** Create |
| **3** | Apa arti dari HTTP Status Code 201 Created? | **b)** Data baru berhasil dibuat |
| **4** | Apa itu Node.js? | **c)** Runtime environment untuk menjalankan JavaScript di luar browser |
| **5** | Engine JavaScript apa yang digunakan oleh Node.js? | **c)** V8 |
| **6** | Middleware `express.json()` di Express.js digunakan untuk apa? | **b)** Memparsing body request dalam format JSON |
| **7** | Perbedaan utama antara Route Params dan Query String? | **b)** Route Params untuk identifikasi resource, Query String untuk filter/sorting |
| **8** | Apa fungsi utama dari Global Error Handler di Express.js? | **c)** Menangkap semua error yang terjadi di aplikasi dan mengirim respons yang konsisten |
| **9** | Manfaat utama pemisahan Controller, Service, dan Route? | **b)** Meningkatkan keterbacaan, pemeliharaan, dan skalabilitas kode |
| **10** | Apa tanggung jawab utama dari Controller dalam arsitektur MVC? | **c)** Menerima request HTTP, mengambil data, dan menyuruh Service untuk logika bisnis, lalu mengirim respons |

***

**Tips Penggunaan:**
1. Pastikan header `X-API-Key: admin1234` selalu disertakan
2. Untuk tracking, gunakan `X-Request-ID` di header
3. Response time otomatis dihitung oleh timing middleware
4. Semua error ditangkap secara global dengan informasi yang lengkap