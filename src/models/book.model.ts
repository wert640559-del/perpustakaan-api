export interface Book {
    id: number
    judul: string
    penulis: string
    tahun: number
    stok: number
    deskripsi?: string
    created_at?: string
    updated_at?: string
}

export let books: Book[] = [
    { id: 1, judul: "Laskar Pelangi", penulis: "Andrea Hirata", tahun: 2005, stok: 10, deskripsi: "Novel tentang persahabatan dan pendidikan", created_at: "2024-01-01T00:00:00Z" },
    { id: 2, judul: "Bumi Manusia", penulis: "Pramoedya Ananta Toer", tahun: 1980, stok: 5, deskripsi: "Novel sejarah Indonesia", created_at: "2024-01-02T00:00:00Z" },
    { id: 3, judul: "Harry Potter and the Sorcerer's Stone", penulis: "J.K. Rowling", tahun: 1997, stok: 15, deskripsi: "Fantasi tentang penyihir muda", created_at: "2024-01-03T00:00:00Z" },
    { id: 4, judul: "The Hobbit", penulis: "J.R.R. Tolkien", tahun: 1937, stok: 8, deskripsi: "Petualangan Bilbo Baggins", created_at: "2024-01-04T00:00:00Z" },
    { id: 5, judul: "Dilan 1990", penulis: "Pidi Baiq", tahun: 2014, stok: 20, deskripsi: "Romance masa SMA", created_at: "2024-01-05T00:00:00Z" },
]

