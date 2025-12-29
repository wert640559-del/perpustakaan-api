12. Testing API dengan Postman
Endpoints yang tersedia:
Register (POST /api/auth/register)

json
{
    "name": "Admin User",
    "email": "admin@perpustakaan.com",
    "password": "password123",
    "role": "ADMIN"
}
Login (POST /api/auth/login)

json
{
    "email": "admin@perpustakaan.com",
    "password": "password123"
}
Get Profile (GET /api/auth/profile)

http
Header: Authorization: Bearer <token_dari_login>
Logout (POST /api/auth/logout)

http
Header: Authorization: Bearer <token_dari_login>
Contoh penggunaan di protected endpoints:
Untuk mengakses endpoint yang membutuhkan autentikasi, tambahkan header:

http
Authorization: Bearer <token_dari_login>
X-API-Key: katasandi123


=====================================================================================================================

Contoh Penggunaan Endpoint
Sekarang endpoint GET /api/books sudah mendukung:

1. Pagination Sederhana:
text
GET /api/books?page=2&limit=20
Halaman ke-2

20 data per halaman

2. Pencarian:
text
GET /api/books?search=Harry&page=1&limit=10
Cari buku dengan kata "Harry" di judul atau nama penulis

3. Sorting:
text
GET /api/books?sortBy=title&sortOrder=asc&limit=15
Urutkan berdasarkan judul (A-Z)

15 data per halaman

4. Kombinasi Semua:
text
GET /api/books?search=novel&sortBy=year&sortOrder=desc&page=1&limit=5
Cari "novel"

Urutkan berdasarkan tahun terbit (terbaru ke terlama)

Halaman 1, 5 data per halaman

6. Response Format
Response akan tetap menggunakan format yang sudah ada dengan tambahan metadata pagination:

json
{
  "success": true,
  "message": "Daftar buku berhasil diambil",
  "data": [
    {
      "id": "uuid",
      "title": "Laskar Pelangi",
      "year": 2005,
      "author": {
        "name": "Andrea Hirata"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}

===================================================================================================

 Dokumentasi API
POST /api/books - Create Book with Cover Image
Method: POST
Content-Type: multipart/form-data
Authentication: Required (Staff Only)
API Key: Required

Form Data:

text
title: [string] - Judul buku
isbn: [string] - ISBN buku
year: [number] - Tahun terbit
stock: [number] - Jumlah stok
authorId: [string] - UUID penulis
categoryId: [string] - UUID kategori
description: [string] - Deskripsi buku (optional)
coverImage: [file] - Gambar cover (JPEG, JPG, PNG, GIF, WebP, max 2MB)
Response Success:

json
{
  "success": true,
  "message": "Buku berhasil ditambahkan",
  "data": {
    "id": "uuid",
    "title": "Laskar Pelangi",
    "isbn": "9789793062792",
    "year": 2005,
    "stock": 10,
    "coverImage": "/uploads/1234567890-filename.jpg",
    "author": {
      "id": "uuid",
      "name": "Andrea Hirata"
    },
    "category": {
      "id": "uuid",
      "name": "Fiksi"
    }
  }
}
PUT /api/books/:id - Update Book with Cover Image
Method: PUT
Content-Type: multipart/form-data
Authentication: Required (Staff Only)
API Key: Required

Form Data: (Semua field optional)

text
title: [string] - Judul buku
isbn: [string] - ISBN buku
year: [number] - Tahun terbit
stock: [number] - Jumlah stok
authorId: [string] - UUID penulis
categoryId: [string] - UUID kategori
description: [string] - Deskripsi buku
coverImage: [file] - Gambar cover baru (optional)
11. Contoh Penggunaan dengan cURL
bash
# Create book with cover image
curl -X POST \
  -H "X-API-Key: katasandi123" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=Laskar Pelangi" \
  -F "isbn=9789793062792" \
  -F "year=2005" \
  -F "stock=10" \
  -F "authorId=uuid-penulis" \
  -F "categoryId=uuid-kategori" \
  -F "description=Novel tentang persahabatan dan pendidikan" \
  -F "coverImage=@/path/to/cover.jpg" \
  http://localhost:3000/api/books

# Update book with new cover image
curl -X PUT \
  -H "X-API-Key: katasandi123" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=Laskar Pelangi - Edisi Baru" \
  -F "stock=15" \
  -F "coverImage=@/path/to/new-cover.jpg" \
  http://localhost:3000/api/books/uuid-buku
12. Error Handling
Jika ada error upload:

json
{
  "success": false,
  "message": "Hanya file gambar yang diperbolehkan (JPEG, JPG, PNG, GIF, WebP)"
}
File terlalu besar (>2MB):

json
{
  "success": false,
  "message": "File terlalu besar"
}

================================================================================================================