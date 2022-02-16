const url = 'http://localhost:3000/notes'
const notesList = document.getElementById('notes-list')
const notesForm = document.getElementById('notes-form')
const button1 = document.getElementById('button1')
const button2 = document.getElementById('button2')
const button3 = document.getElementById('button3')
let noteId
let date

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

function renderNote(noteObj) {
    const itemEl = document.createElement('li')
    itemEl.id = noteObj.id
    itemEl.classList.add('lh-copy','pv3','ba','bl-0','bt-0','br-0','b--dotted','b--black-3')
    itemEl.innerHTML = `<span class="dib w-60">${noteObj.title}</span><i alt="delete note" class="ml2 dark-red fas fa-times delete"></i><i alt="edit note" class="ml3 fas fa-edit edit"></i><br><p>${noteObj.date}</p>`
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
    document.getElementById("new-edit").innerText = "New Note"
    const noteTitle = document.querySelector('#currentTitle')
    const noteText = document.querySelector('#currentBody')
    noteTitle.value = ''
    noteText.value = ''
    button1.style = "display: block;"
    button2.style = "display: none;"
    button3.style = "display: none;"
})



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
    date = Date()
    document.getElementById(`${noteId}`).innerHTML = `<span class="dib w-60">${noteTitle.value}</span><i alt="delete note" class="ml2 dark-red fas fa-times delete"></i><i alt="edit note" class="ml3 fas fa-edit edit"></i><br><p>${date}</p>`
    fetch(`http://localhost:3000/notes/${noteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: noteTitle.value,
            body: noteText.value,
            date: date,
        })
    })
    document.getElementById("new-edit").innerText = "New Note"
    noteTitle.value = ''
    noteText.value = ''
    button1.style = "display: block;"
    button2.style = "display: none;"
    button3.style = "display: none;"
}