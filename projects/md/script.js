document.addEventListener('DOMContentLoaded', function() {
    const markdownInput = document.getElementById('markdown-input');
    const previewOutput = document.getElementById('preview-output');
    const togglePreviewBtn = document.getElementById('toggle-preview');
    const previewContainer = document.querySelector('.preview-container');
    const converter = new showdown.Converter();

    function updatePreview() {
        const markdownText = markdownInput.value;
        const html = converter.makeHtml(markdownText);
        previewOutput.innerHTML = html;
    }

    markdownInput.addEventListener('input', updatePreview);

    togglePreviewBtn.addEventListener('click', () => {
        if (previewContainer.style.display === 'none' || previewContainer.style.display === '') {
            previewContainer.style.display = 'block';
            togglePreviewBtn.textContent = 'Hide Preview';
        } else {
            previewContainer.style.display = 'none';
            togglePreviewBtn.textContent = 'Show Preview';
        }
    });

    // Dark mode
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    updatePreview();
});

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}
