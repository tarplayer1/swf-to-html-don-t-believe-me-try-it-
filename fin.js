document.getElementById('swfFile').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.swf')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const swfData = e.target.result;

            // Convert the SWF file to a Base64 string
            const base64SWF = arrayBufferToBase64(swfData);

            // Generate the HTML content with the Base64-embedded SWF file
            const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SWF Player</title>
    <script src="https://unpkg.com/@ruffle-rs/ruffle"></script>
</head>
<body>
    <div id="ruffle-container" style="width: 100%; height: 100vh;"></div>
    <script>
        const ruffle = window.RufflePlayer.newest();
        const player = ruffle.createPlayer();
        player.style.width = '100%';
        player.style.height = '100%';
        document.getElementById('ruffle-container').appendChild(player);

        // Load the SWF file from Base64
        const swfData = "${base64SWF}";
        const binaryString = atob(swfData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        player.load({ data: bytes });
    </script>
</body>
</html>
            `;

            // Create a Blob for the HTML file
            const htmlBlob = new Blob([htmlContent], { type: 'text/html' });

            // Create a download link for the HTML file
            const downloadLink = document.getElementById('downloadLink');
            downloadLink.href = URL.createObjectURL(htmlBlob);
            downloadLink.download = `${file.name.replace('.swf', '')}.html`;
            downloadLink.textContent = 'Download HTML File';
            downloadLink.style.display = 'inline-block';
        };
        reader.readAsArrayBuffer(file);
    } else {
        alert('Please upload a valid SWF file.');
    }
});

// Helper function to convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}