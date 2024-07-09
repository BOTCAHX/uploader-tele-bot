# Uploader Telegram Bot

Uploader Telegram Bot adalah bot sederhana yang memungkinkan pengguna untuk mengunggah foto langsung dari Telegram ke URL yang ditentukan.

## Cara Penggunaan

1. **Memulai Bot**
   - Mulai obrolan dengan bot Telegram `/start`.

2. **Mengunggah Foto**
   - Kirim foto yang ingin Anda unggah ke bot.

3. **Mendapatkan URL**
   - Bot akan mengunggah foto yang Anda kirim dan memberikan URL langsung ke foto tersebut.

## Fitur

- Mengunggah foto ke URL yang ditentukan.
- Memberikan URL langsung ke foto yang diunggah.
- Mudah digunakan langsung dari obrolan Telegram.

## Pengaturan

- Bot dapat dikonfigurasi untuk mengunggah foto ke berbagai layanan penyimpanan online atau server Anda sendiri dengan sedikit modifikasi pada kode.

## Cara Menginstal dan Menjalankan

1. **Klon Repositori**
   ```bash
   git clone https://github.com/BOTCAHX/uploader-tele-bot.git
   cd uploader-tele-bot
   ```

2. **Instal Dependensi**
   ```bash
   npm install
   ```

3. **Konfigurasi Token Bot**
   - Dapatkan token bot dari BotFather di Telegram.
   - Simpan token bot di dalam file `settings.js`:
     ```plaintext
     botToken= "your_bot_token_here"
     ```

4. **Menjalankan Bot**
   ```bash
   npm start
   ```
   
## Lisensi
Distribusi di bawah lisensi MIT. Untuk informasi lebih lanjut, lihat `LICENSE`.

