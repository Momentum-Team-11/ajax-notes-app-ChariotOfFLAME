const url = 'http://localhost:3000/notes'
const notesList = document.getElementById('notes-list')
const notesForm = document.getElementById('notes-form')
const button1 = document.getElementById('button1')
const button2 = document.getElementById('button2')
const button3 = document.getElementById('button3')
let noteId
let date

//clear the unordered list of all html, fetch the list of notes from the db, run a for loop with the data and pass it into the renderNote function
function listNotes() {
    document.getElementById("notes-list").innerHTML = ''
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            for (let noteObj of data) {
                renderNote(noteObj)
            }
    })
}

//create a list item, and fill it with the for loop info fetched from the db, formatted as desired via HTML
function renderNote(noteObj) {
    const itemEl = document.createElement('li')
    itemEl.id = noteObj.id
    itemEl.innerHTML = `<span class="items">${noteObj.title}</span><i alt="delete note" class="fas fa-times delete"></i><i alt="edit note" class="fas fa-edit edit"></i><br><p>${noteObj.date}</p>`
    notesList.prepend(itemEl)
}


//List notes at top of page
listNotes()

//Make delete and edit icons clicky
notesList.addEventListener('click', function (event) {
    event.preventDefault()
    if (event.target.classList.contains('delete')) {
        deleteNote(event.target)
    }
    if (event.target.classList.contains('edit'))
        editMode(event.target)
})


//make submit button clicky
button1.addEventListener('click', function (event) {
    event.preventDefault()
    console.log("Submit was clicked!")
    
    //If either field is empty, don't submit the note
    if (document.getElementById("currentTitle").value === '' || document.getElementById("currentBody").value === '') {
        return
    } else {
    createNote(event)
    }
})

//make edit button clicky
button2.addEventListener('click', function (event) {
    event.preventDefault()
    editNote(event)
})

//make cancel button clicky
button3.addEventListener('click', function (event) {
    event.preventDefault()
    console.log("Cancel was clicked!")
    document.getElementById("new-edit").innerText = "new note"
    const noteTitle = document.querySelector('#currentTitle')
    const noteText = document.querySelector('#currentBody')
    noteTitle.value = ''
    noteText.value = ''
    button1.style = "display: block;"
    button2.style = "display: none;"
    button3.style = "display: none;"
})


//when submit is hit, post the note to the db with the date and time submitted, then clear the input fields
function createNote() {
    const noteTitle = document.querySelector('#currentTitle')
    const noteText = document.querySelector('#currentBody')
    date = Date()
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: noteTitle.value,
            body: noteText.value,
            date: date,
        }),
    })
        .then((res) => res.json())
        .then((data) => {
    renderNote(data)
    })
    noteTitle.value = ''
    noteText.value = ''
}


//when the delete icon is clicked, delete the parent note from the db, clear the input fields and make sure the submit button is visable and not the edit and cancel buttons
function deleteNote(element) {
    const noteId = element.parentElement.id
    const noteTitle = document.querySelector('#currentTitle')
    const noteText = document.querySelector('#currentBody')
    fetch(`http://localhost:3000/notes/${noteId}`, {
        method: 'DELETE',
    }).then(function() {
        element.parentElement.remove()
    })
    document.getElementById("new-edit").innerText = "new note"
    noteTitle.value = ''
    noteText.value = ''
    button1.style = "display: block;"
    button2.style = "display: none;"
    button3.style = "display: none;"
}


//reveal the edit and cancel buttons, and...
function editMode(element) {
    noteId = element.parentElement.id
    button1.style = "display: none;"
    button2.style = "display: row;"
    button3.style = "display: row;"
    //..replace the new note banner with edit note, and...
    document.getElementById("new-edit").innerText = "edit note"
    //fetch the note select by id from the db and place its title and text into the input fields
    fetch(`http://localhost:3000/notes/${noteId}`)
    .then((res) => res.json())
    .then((data) => {
        const currentTitle = document.getElementById("currentTitle")
        const currentBody = document.getElementById("currentBody")
        currentTitle.value = data.title
        currentBody.value = data.body
        })
}


//when the edit button is clicked, patch the db at the current note id with the values from the input fields
function editNote() {
    const noteTitle = document.querySelector('#currentTitle')
    const noteText = document.querySelector('#currentBody')
    date = Date()
    document.getElementById("new-edit").innerText = "new note"
    document.getElementById(`${noteId}`).innerHTML = `<span class="items">${noteTitle.value}</span><i alt="delete note" class="ml2 dark-red fas fa-times delete"></i><i alt="edit note" class="ml3 fas fa-edit edit"></i><br><p>${date}</p>`
    fetch(`http://localhost:3000/notes/${noteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: noteTitle.value,
            body: noteText.value,
            date: date,
        })
    })
    document.getElementById("new-edit").innerText = "new note"
    noteTitle.value = ''
    noteText.value = ''
    button1.style = "display: block;"
    button2.style = "display: none;"
    button3.style = "display: none;"
}