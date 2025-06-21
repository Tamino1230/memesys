# MemeSys: Instant Image Sharing

MemeSys is a serverless, client-side web application that allows you to share images instantly by encoding them directly into a shareable link. It's perfect for quick, hassle-free image sharing without needing a backend or database. The entire application is designed to be hosted on static platforms like GitHub Pages.

## ✨ Features

- **Serverless & Client-Side:** No backend required. All processing is done in your browser.
- **Instant Sharing Link:** Upload an image and get a single, shareable link.
- **Save as HTML:** Download a standalone HTML file containing your image, with the same modern layout as the site.
- **Drag & Drop:** Easily upload images by dragging them into the upload area.
- **URL Compression:** Uses `pako.js` to compress image data, keeping the URL length manageable.
- **Modern UI:** A sleek, responsive, glassmorphism-inspired design.
- **Progress Indicator:** A progress bar shows the upload and processing status, with an option to cancel.
- **Social Media Previews:** Generated links include Open Graph meta tags, so they look great when shared on platforms like Discord.

## 🚀 How It Works

1.  **Image Reading:** When you upload an image, the browser's `FileReader` API reads the file as a Data URL (Base64 encoded).
2.  **Compression:** The Base64 string is then compressed using the `pako` (zlib) library to significantly reduce its size.
3.  **Encoding:** The compressed data is encoded into a URL-safe Base64 string.
4.  **Link Generation:** This encoded string is appended to the site's URL as a hash (e.g., `.../#/view/ENCODED_STRING`).
5.  **Viewing:** When someone opens a share link, the JavaScript on the page decodes the hash from the URL, decompresses it, and displays the original image.

## 🛠️ How to Use

1.  **Open the website.**
2.  **Drag and drop** an image file onto the upload area, or **click the area** to select a file from your device.
3.  Choose one of the two options:
    *   **Generate Link:** Creates a unique URL for your image. Click the "Copy" button to share it.
    *   **Save as HTML:** Downloads a self-contained HTML file with your image embedded, perfect for offline viewing or archiving.

## 💻 Technologies Used

- **HTML5**
- **CSS3** (with Flexbox and modern design principles)
- **JavaScript** (ES6+)
- **[pako.js](https://github.com/nodeca/pako)** for data compression.
