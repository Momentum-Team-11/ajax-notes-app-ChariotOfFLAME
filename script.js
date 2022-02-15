/* Must have -- MVP (minimum viable product) */
// need to show a list of existing notes
const url = 'http://localhost:3000/notes'
const notesList = document.getElementById('notes-list')
const notesForm = document.getElementById('notes-form')

function listNotes() {
    document.getElementById("notes-list").innerHTML = ''
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
        // take all the notes
        // loop through and create a new note item on the page for each one
            for (let noteObj of data) {
                renderNote(noteObj)
            }
    })
}

notesForm.addEventListener('submit', function (event) {
    event.preventDefault()
    createNote(event)
})

notesList.addEventListener('click', function (event) {
    if (event.target.classList.contains('delete')) {
        deleteNote(event.target)
    }
    if (event.target.classList.contains('edit'))
        editMode(event.target)
})


// I'm doing this work in more than one place, so it's helpful to put it in a function rather than repeat it!
function renderNote(noteObj) {
    const itemEl = document.createElement('li')
    itemEl.id = noteObj.id
    itemEl.classList.add(
    'lh-copy',
    'pv3',
    'ba',
    'bl-0',
    'bt-0',
    'br-0',
    'b--dotted',
    'b--black-3'
    )
    itemEl.innerHTML = `<span class="dib w-60">${noteObj.title}</span><i alt="delete note" class="ml2 dark-red fas fa-times delete"></i><i alt="edit note" class="ml3 fas fa-edit edit"></i>`
    notesList.prepend(itemEl)
}
// call this when the script first runs (on page load)
// This runs only on the first load!
listNotes()

function createNote() {
        const noteTitle = document.querySelector('#currentTitle')
        const noteText = document.querySelector('#currentBody')
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: noteTitle.value,
                body: noteText.value,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
            // what I get back from the server IS the newly created note object
        // So I can take that data and create a new note item in the DOM
        renderNote(data)
        })
        noteTitle.value = ''
        noteText.value = ''
}

function deleteNote(element) {
    const noteId = element.parentElement.id
    fetch(`http://localhost:3000/notes/${noteId}`, {
        method: 'DELETE',
    }).then(function() {
        element.parentElement.remove()
    })
}

function editMode(element) {
    // notesForm.removeEventListener('click', function (event)) {}
    const noteId = element.parentElement.id
    
    //replace current form with edit form
    document.getElementById('current-note').innerHTML = `
    <h2 id="new-edit">Edit Note</h2>
        <form id="edit-form">
        <label for="currentTitle">Title:</label>
        <input type="text" id="currentTitle" name="currentTitle" placeholder="Put your title here..." required><br>
        <textarea id="currentBody" class="note-input" name="currentBody" rows="10" cols="100" placeholder="Write your note here..."></textarea><br>
        <input id="button" type="submit" class="edit" value="Edit">
        <input id="button" type="submit" class="cancel" value="Cancel">
    </form>
    `

    const editForm = document.getElementById('edit-form')

    fetch(`http://localhost:3000/notes/${noteId}`)
    .then((res) => res.json())
    .then((data) => {
        const currentTitle = document.getElementById("currentTitle")
        const currentBody = document.getElementById("currentBody")
        currentTitle.value = data.title
        currentBody.value = data.body
        })
        
        editForm.addEventListener('click', function (event) {
        event.preventDefault()
        if (event.target.classList.contains('cancel')) {
            document.getElementById('current-note').innerHTML = `
            <h2 id="new-edit">New Note</h2>
            <form id="notes-form">
                <label for="currentTitle">Title:</label>
                <input type="text" id="currentTitle" name="currentTitle" placeholder="Put your title here..." required><br>
                <textarea id="currentBody" class="note-input" name="currentBody" rows="10" cols="100" placeholder="Write your note here..."></textarea><br>
                <input id="button" type="submit" name="submit" value="Submit">
            </form>
            `
        }
        if (event.target.classList.contains('edit'))
            editNote(event)
            })
        
        function editNote() {
            const noteTitle = document.querySelector('#currentTitle')
            const noteText = document.querySelector('#currentBody')
            document.getElementById(`${noteId}`).innerHTML = `<span class="dib w-60">${noteTitle.value}</span><i alt="delete note" class="ml2 dark-red fas fa-times delete"></i><i alt="edit note" class="ml3 fas fa-edit edit"></i>`
            fetch(`http://localhost:3000/notes/${noteId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: noteTitle.value,
                    body: noteText.value,
                })
            })
        document.getElementById('current-note').innerHTML = `
        <h2 id="new-edit">New Note</h2>
        <form id="notes-form">
            <label for="currentTitle">Title:</label>
            <input type="text" id="currentTitle" name="currentTitle" placeholder="Put your title here..." required><br>
            <textarea id="currentBody" class="note-input" name="currentBody" rows="10" cols="100" placeholder="Write your note here..."></textarea><br>
            <input id="button" type="submit" name="submit" value="Submit">
        </form>
        `
        }
}


// function 