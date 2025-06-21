const imageInput = document.getElementById('image-input');
const linkContainer = document.getElementById('link-container');
const shareLink = document.getElementById('share-link');
const copyButton = document.getElementById('copy-button');
const uploadContainer = document.getElementById('upload-container');
const imageViewContainer = document.getElementById('image-view-container');
const memeImage = document.getElementById('meme-image');
const ogImage = document.querySelector('meta[property="og:image"]');
const uploadArea = document.getElementById('upload-area');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const progressPercent = document.getElementById('progress-percent');
const cancelButton = document.getElementById('cancel-button');
const actionButtons = document.getElementById('action-buttons');
const generateLinkButton = document.getElementById('generate-link-button');
const saveHtmlButton = document.getElementById('save-html-button');
const uploadAnotherButton = document.getElementById('upload-another-button');
const downloadPngButton = document.getElementById('download-png-button');

let fileReader = null;

// Drag and drop functionality
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    uploadArea.addEventListener(eventName, () => uploadArea.classList.add('dragover'), false);
});

['dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('dragover'), false);
});

uploadArea.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    imageInput.files = files;
    if (files.length > 0) {
        uploadArea.querySelector('p').textContent = files[0].name;
    }
});

// Allow clicking the area to select a file
uploadArea.addEventListener('click', () => {
    imageInput.click();
});

imageInput.addEventListener('change', () => {
    if (imageInput.files.length > 0) {
        uploadArea.querySelector('p').textContent = imageInput.files[0].name;
    }
});

function processImage(outputType) {
    const file = imageInput.files[0];
    if (!file) {
        alert('Please select an image first!');
        return;
    }

    // Reset UI
    linkContainer.style.display = 'none';
    progressContainer.style.display = 'block';
    actionButtons.style.display = 'none';
    progressBar.value = 0;
    progressPercent.textContent = '0%';

    fileReader = new FileReader();

    fileReader.onprogress = (event) => {
        if (event.lengthComputable) {
            const percentage = Math.round((event.loaded / event.total) * 100);
            progressBar.value = percentage;
            progressPercent.textContent = percentage + '%';
        }
    };

    fileReader.onload = () => {
        progressPercent.textContent = '100%';
        progressContainer.querySelector('p').textContent = 'Compressing data...';

        setTimeout(() => {
            const fileData = fileReader.result;
            const base64String = fileData.split(',')[1];
            const compressed = pako.deflate(base64String);
            const CHUNK_SIZE = 0x8000;
            let binaryString = '';
            for (let i = 0; i < compressed.length; i += CHUNK_SIZE) {
                binaryString += String.fromCharCode.apply(null, compressed.subarray(i, i + CHUNK_SIZE));
            }
            const encoded = btoa(binaryString);

            if (outputType === 'link') {
                const baseUrl = window.location.href.split('#')[0];
                const fullLink = baseUrl + '#/view/' + encoded;
                shareLink.value = fullLink;
                linkContainer.style.display = 'block';
            } else if (outputType === 'html') {
                const cssContent = `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');
body {
    font-family: 'Poppins', sans-serif;
    background: linear-gradient(135deg, #1a1a1a, #333333);
    color: #e0e0e0;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    text-align: center;
}
.container {
    width: 90%;
    max-width: 500px;
    background-color: rgba(255, 255, 255, 0.05);
    padding: 2rem 3rem;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}
#image-view-container {
    padding: 2rem;
}
#meme-image {
    max-width: 100%;
    max-height: 70vh;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    margin-bottom: 2rem;
}
a {
    color: #00aaff;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s;
}
a:hover {
    color: #0077cc;
}
.button-group {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1.5rem;
}
button {
    background: linear-gradient(135deg, #00aaff, #0077cc);
    color: #fff;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 15px rgba(0, 170, 255, 0.3);
}
button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 170, 255, 0.5);
}`;
                const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shared Image</title>
    <style>
        ${cssContent}
    </style>
</head>
<body>
    <div class="container">
        <div id="image-view-container" style="display: block;">
            <img id="meme-image" src="${fileData}" alt="Meme">
            <div class="button-group">
                <button id="download-png-button">Download as PNG</button>
            </div>
            <br>
            <a href="${window.location.href.split('#')[0]}">Create your own</a>
        </div>
    </div>
    <script>
        document.getElementById('download-png-button').addEventListener('click', () => {
            const image = document.getElementById('meme-image');
            const a = document.createElement('a');
            a.href = image.src;
            a.download = 'image.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    <\/script>
</body>
</html>`;
                const blob = new Blob([htmlContent], { type: 'text/html' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'image.html';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }

            // Reset UI
            progressContainer.style.display = 'none';
            actionButtons.style.display = 'flex';
            progressContainer.querySelector('p').textContent = 'Processing image...';
        }, 50);
    };

    fileReader.onabort = () => {
        progressContainer.style.display = 'none';
        actionButtons.style.display = 'flex';
    };

    fileReader.onerror = () => {
        console.error('An error occurred while reading the file.');
        progressContainer.style.display = 'none';
        actionButtons.style.display = 'flex';
    };

    fileReader.readAsDataURL(file);
}

generateLinkButton.addEventListener('click', () => processImage('link'));
saveHtmlButton.addEventListener('click', () => processImage('html'));

cancelButton.addEventListener('click', () => {
    if (fileReader && fileReader.readyState === FileReader.LOADING) {
        fileReader.abort();
    }
});

copyButton.addEventListener('click', () => {
    shareLink.select();
    document.execCommand('copy');
});

uploadAnotherButton.addEventListener('click', () => {
    window.location.href = window.location.href.split('#')[0];
});

downloadPngButton.addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = memeImage.src;
    a.download = 'image.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

window.addEventListener('load', () => {
    const hash = window.location.hash;

    if (hash.startsWith('#/view/')) {
        // Image view logic
        uploadContainer.style.display = 'none';
        imageViewContainer.style.display = 'block';
        const encoded = hash.substring(7);
        const compressed = new Uint8Array(atob(encoded).split('').map(c => c.charCodeAt(0)));
        const base64String = pako.inflate(compressed, { to: 'string' });
        const imageSrc = 'data:image;base64,' + base64String;
        memeImage.src = imageSrc;
        if (ogImage) {
            ogImage.setAttribute('content', imageSrc);
        }
    } else {
        // Default to upload view
        uploadContainer.style.display = 'block';
        imageViewContainer.style.display = 'none';
    }
});
