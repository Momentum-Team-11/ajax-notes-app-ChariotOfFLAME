/* Must have -- MVP (minimum viable product) */
// need to show a list of existing notes
const url = 'http://localhost:3000/notes'
const notesList = document.getElementById('notes-list')
const notesForm = document.getElementById('notes-form')
const button1 = document.getElementById('button1')
const button2 = document.getElementById('button2')
const button3 = document.getElementById('button3')
let noteId

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

notesList.addEventListener('click', function (event) {
    event.preventDefault()
    if (event.target.classList.contains('delete')) {
        deleteNote(event.target)
    }
    if (event.target.classList.contains('edit'))
        editMode(event.target)
})



button1.addEventListener('click', function (event) {
    event.preventDefault()
    console.log("Submit was clicked!")
    createNote(event)
})

button2.addEventListener('click', function (event) {
    event.preventDefault()
    editNote(event)
})

button3.addEventListener('click', function (event) {
    event.preventDefault()
    console.log("Cancel was clicked!")
    document.getElementById("new-edit").innerText = "New Note"
    noteTitle.value = ''
    noteText.value = ''
    button1.style = "display: block;"
    button2.style = "display: none;"
    button3.style = "display: none;"
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
    noteId = element.parentElement.id
    button1.style = "display: none;"
    button2.style = "display: row;"
    button3.style = "display: row;"
    //replace current form with edit form
    document.getElementById("new-edit").innerText = "Edit Note"

    fetch(`http://localhost:3000/notes/${noteId}`)
    .then((res) => res.json())
    .then((data) => {
        const currentTitle = document.getElementById("currentTitle")
        const currentBody = document.getElementById("currentBody")
        currentTitle.value = data.title
        currentBody.value = data.body
        })
}

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
    document.getElementById("new-edit").innerText = "New Note"
    noteTitle.value = ''
    noteText.value = ''
    button1.style = "display: block;"
    button2.style = "display: none;"
    button3.style = "display: none;"
}