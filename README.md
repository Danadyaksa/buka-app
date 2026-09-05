<div align="center">

# 📸 Buka Collage — Photo Collage Web App

**A sleek, responsive, and 100% client-side photo collage generator reverse-engineered from native iOS collage apps.**  
*Free forever, zero paywalls, ultra-private (no server upload), and supports up to 4K high-resolution exports.*

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

---

## ✨ Fitur Unggulan (Key Features)

### 1. 📐 Puluhan Pilihan Layout Kolase (Classic & Stylish)
- **Tab CLASSIC:** Lebih dari 30 variasi grid persegi standar untuk 1 hingga 9+ foto (split vertikal/horizontal 50:50, 30:70, 70:30, 3 baris/kolom, 2×2, 3×3, mosaik asimetris).
- **Tab STYLISH:** Potongan poligon & diagonal geometris unik menggunakan SVG `clip-path` (Diagonal slices, 3-Way Origami Triangles, Chevron Envelope, Isometric 3D Cube, Parallelogram Skew, Octagram Star).

### 2. 🖐️ Manipulasi Sel Foto Interaktif
- **Pan Foto:** Geser foto secara bebas di dalam sel untuk menentukan komposisi visual terbaik.
- **Pinch-to-Zoom & Scroll Zoom:** Memperbesar atau memperkecil foto dengan batasan cerdas (*clamped boundaries*).
- **Drag & Drop Swap:** Tukar posisi foto antar sel hanya dengan menyeret (*drag*) foto ke sel tujuan.
- **Floating Toolbar Sel:** Ketuk foto untuk memunculkan bilah alat: *Replace*, *Filter (B&W, Warm, Vintage, Bright, Contrast)*, *Flip Horizontal*, *Rotate 90°*, dan *Delete*.

### 3. 🎚️ Slider Kontrol Presisi (Tema iOS Pink)
- **Aspect Ratio:** Preset instan (`1:1`, `4:5` Instagram Portrait, `9:16` Story/TikTok/Reels, `4:3`, `16:9`, `1:2`) serta slider rasio dinamis dengan pembacaan angka *real-time*.
- **Outer Margin:** Pengaturan jarak tepi terluar dari kanvas (0px – 40px).
- **Inner Margin:** Pengaturan celah/garis pemisah antar sel foto (0px – 30px).
- **Corner Radius:** Pengaturan kelengkungan sudut sel foto (0px – 40px).
- **Shadow:** Pengaturan intensitas bayangan di belakang foto agar tampak melayang estetik.

### 4. ✍️ Editor Tipografi Lengkap
- Pilihan beragam font estetik (*American Typewriter, Inter, Montserrat, Playfair Display, Oswald, Space Grotesk, Caveat, Pacifico*).
- Slider **Letter Spacing (Kerning)** dinamis untuk mengatur kerenggangan antar huruf.
- Opsi gaya kotak sorot teks: *None*, *Solid Pill Box*, dan *Square Box* dengan palet warna cerah.
- Teks di kanvas dapat digeser, diputar, diubah ukuran, dan diedit ulang.

### 5. 🎨 Latar Belakang, Stiker & Bingkai
- **Background:** Warna solid, gradien modern, pola tekstur (*dots, grid, terrazzo*), dan efek *photo blur* lembut dari foto kolase.
- **Frames:** Bingkai Polaroid klasik, analog Filmstrip, list minimalis putih, dan parchment vintage.
- **Stickers:** Stiker vektor estetik (*paw prints, sparkles, love hearts, stars, washi tape*).

### 6. 💾 Auto-Save & Galeri "Karya Saya" (IndexedDB Lokal - Tanpa Backend)
- **Auto-Save Recovery:** Otomatis menyimpan draf ke database lokal browser. Jika browser tidak sengaja tertutup atau mati lampu, draf dapat dipulihkan secara instan.
- **Karya Saya (Riwayat Proyek):** Simpan semua kolase Anda di memori lokal, lengkap dengan thumbnail, tanggal, tombol lanjut edit, dan hapus.
- **Cadangkan & Pindahkan (Export/Import JSON):** Pindahkan file proyek antar perangkat (misal dari HP ke Laptop) tanpa perlu internet atau server cloud.

### 7. 🚀 Mesin Export Resolusi Tinggi (4K) & Share
- Render *Offscreen Canvas 2D* resolusi tinggi (hingga 2048px / 4K) jernih tanpa watermark atau kompresi buram.
- Tombol **Save** (lingkaran pink besar) untuk mengunduh gambar langsung + efek selebrasi konfeti warna-warni!
- Tombol **Share** (lingkaran ungu tua) terintegrasi dengan browser native *Web Share API* untuk langsung berbagi ke Instagram Story/Post, WhatsApp, dan Facebook.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Database Lokal:** [idb (IndexedDB)](https://github.com/jakearchibald/idb)
- **Grafis & Ekspor:** HTML5 Canvas 2D API + SVG Polygon Clip-paths
- **Animasi:** Canvas Confetti

---

## 💻 Cara Menjalankan Secara Lokal (Local Development)

Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) (versi 18+ disarankan):

1. **Clone repository ini:**
   ```bash
   git clone https://github.com/Danadyaksa/buka-app.git
   cd buka-app
   ```

2. **Install dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan development server:**
   ```bash
   npm run dev
   ```

4. **Buka aplikasi:**
   - Di Laptop/PC: Buka [http://localhost:3000](http://localhost:3000)
   - Di Smartphone: Buka IP lokal laptop Anda di browser HP (contoh: `http://192.168.x.x:3000`) dalam jaringan WiFi yang sama.

---

## 🌐 Cara Deploy ke Vercel (Gratis Selamanya)

Aplikasi ini siap di-deploy langsung ke **[Vercel](https://vercel.com/)** dalam 1 menit:

1. Buka [vercel.com](https://vercel.com) dan login menggunakan akun GitHub Anda.
2. Klik **"Add New..."** lalu pilih **"Project"**.
3. Pilih repository **`Danadyaksa/buka-app`** dan klik **"Import"**.
4. Klik tombol **"Deploy"** (tanpa perlu ubah konfigurasi apa pun).
5. Selesai! Website Anda langsung memiliki domain publik resmi (contoh: `buka-app.vercel.app`) dengan HTTPS gratis.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).
