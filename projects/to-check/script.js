// Filter table rows based on search input
const searchInput = document.getElementById('searchInput');
const table = document.getElementById('projectsTable');
const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');

searchInput.addEventListener('keyup', function() {
    const filter = searchInput.value.toLowerCase();
    for (let i = 0; i < rows.length; i++) {
        let rowText = rows[i].textContent.toLowerCase();
        rows[i].style.display = rowText.includes(filter) ? '' : 'none';
    }
});
