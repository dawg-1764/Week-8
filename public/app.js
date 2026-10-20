let feed = document.getElementById('feed');

// Build one entry and add it to the page
function showEntry(entry) {
  let el = document.createElement('div');
  el.className = 'entry';

  let date = new Date(entry.time).toLocaleString();
  el.innerHTML = '<h3>' + entry.title + '</h3>' +
    '<small>' + date + '</small>' +
    '<p>' + entry.entry + '</p>';
  feed.appendChild(el);
}

// Load all saved entries when the page opens
function loadEntries() {
  fetch('/entries')
    .then(response => response.json())
    .then(data => {
      feed.innerHTML = '';
      for (let i = 0; i < data.entries.length; i++) {
        showEntry(data.entries[i]);
      }
    })
    .catch(error => console.log(error));
}

window.addEventListener('load', loadEntries);

// Save a new entry
let submitButton = document.getElementById('entry-submit');
submitButton.addEventListener('click', () => {
  let titleInput = document.getElementById('title-input');
  let entryInput = document.getElementById('entry-input');

  let entryObj = {
    title: titleInput.value,
    entry: entryInput.value
  };

  fetch('/newEntry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entryObj)
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      titleInput.value = '';
      entryInput.value = '';
      loadEntries(); // reload so the new entry appears at the top
    })
    .catch(error => console.log(error));
});