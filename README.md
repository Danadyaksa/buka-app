<div align="center">

# 📸 BuKa - Buat Kolase

**Aplikasi Web Pembuat Kolase Foto Modern, Responsif, dan 100% Client-Side.**  
*Bebas biaya selamanya, tanpa iklan, tanpa watermark, dan menjaga privasi penuh (semua proses terjadi lokal di perangkat Anda tanpa upload ke server).*

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-ff2b6d?style=for-the-badge&logo=pwa)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

---

## 📸 Fitur Unggulan

### 1. 📐 Pilihan Layout Kolase Beragam (Classic & Stylish)
- **Tab CLASSIC:** Puluhan variasi layout grid standar untuk 1 hingga 9+ foto (split vertikal/horizontal, 3 baris/kolom, 2×2, 3×3, mosaik asimetris).
- **Tab STYLISH:** Potongan poligon geometris & diagonal estetis menggunakan SVG `clip-path` (Diagonal slices, 3-Way Origami Triangles, Chevron Envelope, Isometric 3D Cube, Parallelogram Skew, Octagram Star).

### 2. ↔️ Pengaturan Garis Grid Fleksibel (Draggable Divider Handles)
- Pengguna dapat menggeser garis pembatas grid foto secara langsung melalui tombol pegangan khusus (↕ / ↔).
- Menyesuaikan tinggi baris atau lebar kolom kolase secara manual dan real-time sesuai kebutuhan komposisi foto.

### 3. 🎯 Seleksi & Fokus Foto Aktif (Focus & Dimming Effect)
- **Sorotan Presisi:** Mengetuk salah satu foto akan mengaktifkan garis batas merah muda cerah (*pink ring*) di sekeliling foto yang dipilih.
- **Meredupkan Foto Lain:** Foto lain yang tidak sedang diedit otomatis diredupkan (*dimmed* ke 35% opacity), memudahkan pengguna fokus pada foto aktif.
- **Tombol "Done" & Toolbar Melayang:** Tombol kanan atas navbar otomatis berganti menjadi **"Done"** untuk menyelesaikan edit sel. Tersedia toolbar melayang dengan fitur: *Replace*, *Filter*, *Flip*, *Rotate 90°*, dan *Delete*.

### 4. 🎛️ Bilah Menu Dicentang (✓) & Kanvas Bersih
- Setiap subpanel menu (**Collage**, **Background**, **Frame**, serta mode slider) dilengkapi tombol centang bulat merah muda (✓).
- Menekan tombol centang (atau mengeklik tab aktif) akan menutup subpanel sehingga kanvas kembali lega dan hanya menampilkan menu utama di bilah bawah.

### 5. 🎚️ Kontrol Margin & Rasio Presisi
- **Rasio Aspek Default 4:5:** Standar rasio potret Instagram (`4:5`), didukung preset `1:1`, `9:16`, `4:3`, `16:9`, `1:2`, serta slider kustom dinamis.
- **Zero-Margin Default:** Pengaturan awal tepi (*Outer Margin*), jarak antar foto (*Inner Margin*), sudut kelengkungan (*Corner Radius*), dan bayangan (*Shadow*) dimulai dari 0px untuk tampilan kolase yang rapat dan rapi.

### 6. ✍️ Manipulasi Teks Interaktif dengan 3 Handle Sudut
- **Handle Kiri Atas (✕):** Hapus elemen teks dengan satu ketukan.
- **Handle Kanan Atas (✎):** Buka kembali modal editor teks untuk mengedit isi, warna, atau gaya teks.
- **Handle Kanan Bawah (⤡):** Mengubah ukuran (*scale*) sekaligus rotasi (*rotate*) teks secara bebas tanpa hambatan (*smooth gestures*).
- **Tipografi Estetik:** Daftar pilihan font elegan dengan scroll vertikal yang rapi.
- **Gaya Kotak Teks:** Opsi latar belakang teks simetris (*Pill Box* dan *Square Box*) serta slider pengaturan jarak spasi antar huruf (*letter spacing/kerning*).

### 7. 🎨 Latar Belakang & Bingkai
- **Background:** Pilihan warna solid, gradien modern, tekstur motif (*dots, grid, terrazzo*), dan efek *photo blur* lembut dari foto kolase.
- **Frames:** Pilihan bingkai foto Polaroid, Filmstrip analog, minimalis, dan vintage.

### 8. ↩️ Riwayat Undo & Redo Cerdas
- Fitur Undo (↶) dan Redo (↷) di navbar atas dengan batasan aman: pembatalan tidak akan pernah menghapus foto awal yang sudah dimasukkan ke kanvas.

### 9. 💾 Galeri "Upload Saya" & Riwayat "Karya Saya" (IndexedDB Lokal)
- **Upload Saya:** Foto yang Anda pilih/unggah otomatis tersimpan di penyimpanan lokal browser, siap dipakai kembali kapan pun tanpa perlu unggah ulang.
- **Karya Saya (Multi-Project):** Simpan dan buka kembali draf editan kolase sebelumnya langsung dari memori perangkat.

### 10. 🚀 Ekspor Resolusi Tinggi (Format & Skala Kustom)
- Layar ekspor bersih dan fokus: unduh hasil kolase dalam resolusi standar hingga Ultra-HD (1x, 2x, 4x) dengan format **PNG**, **JPEG**, atau **WebP**.

### 11. 📱 Dukungan PWA (Bisa Diinstal di Android & iOS)
- Aplikasi dapat diinstal ke layar utama (*Add to Home Screen*) pada perangkat Android maupun iPhone/iPad.
- Berjalan layaknya aplikasi native mandiri (*standalone window*) tanpa bilah peramban.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Database Lokal:** [idb (IndexedDB)](https://github.com/jakearchibald/idb)
- **PWA:** Web App Manifest & Service Worker Ready
- **Grafis & Ekspor:** HTML5 Canvas 2D API + SVG Polygon Clip-paths

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

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).
