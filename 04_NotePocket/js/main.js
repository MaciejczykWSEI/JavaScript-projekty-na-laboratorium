
document.addEventListener('DOMContentLoaded', appStart)

let note_id = 0

//Array for removed elements
let usunieteTbl = []

let notatkiStr = {
    id: "",
    title: "",
    text: "",
    data: "",
    color: "",
}
let notatkiTbl = []

let jsonParse = null

//Start function//
function appStart() {
    document.querySelector("#clear_selected").addEventListener("click", removeSelected)

    //Downloading data from LocalStorage and loading
    if (localStorage.length) {
        getLocal()
    }


    //Adding a new note with the default parameters
    document.querySelector("#add").addEventListener('click', function addNote() {
        addNotes("nt" + note_id, "Title" + note_id, "Text", getTermin(), "#40E0D0")
    })
    //Removing from local
    document.querySelector("#clear").addEventListener('click', clearNotes)

}
//Adding another note
function addNotes(ntId, ntTitle, ntText, ntDate, ntColor) {

    //Main element
    let note = document.createElement("div")
    note.style.width = "300px"
    note.style.height = "230px"
    note.style.backgroundColor = ntColor
    note.className = "notes"

    //Adding ID 
    note.id = ntId
    notatkiStr.id = ntId
    notatkiStr.color = ntColor  //Default note colour
    document.querySelector("#notatki").appendChild(note)
    //Adding checkbox
    let checkbox = document.createElement("input")
    checkbox.setAttribute("type", "checkbox")
    note.appendChild(checkbox)

    //Title div
    let title = document.createElement("div")
    title.style.width = "300px"
    title.style.height = "35px"
    title.style.backgroundColor = "#48D1CC"
    title.className = "notes_title"
    note.appendChild(title)

    //Title input
    let title_text = document.createElement("input")
    title_text.value = ntTitle
    title_text.className = "title_text"
    title_text.type = "text"
    notatkiStr.title = title_text.value
    title.appendChild(title_text)
    title_text.addEventListener('change', function titleChange() {
        //Changing data in the array
        notatkiTbl[getID(note)].title = title_text.value //last digits generation from note.id -> title update
        setLocal("notatki", notatkiTbl)
    })

    //Text input
    let text_input = document.createElement("textarea")
    text_input.value = ntText
    text_input.className = "text_input"
    text_input.type = "text"
    notatkiStr.text = text_input.value
    note.appendChild(text_input)
    text_input.addEventListener('change', function textChange() {
        //Data changing in array
        notatkiTbl[getID(note)].text = text_input.value
        setLocal("notatki", notatkiTbl)
    })

    //Date input
    let data_input = document.createElement("input")
    data_input.type = "text"
    data_input.className = "date_input"
    data_input.value = ntDate
    data_input.disabled = true
    notatkiStr.data = data_input.value
    note.appendChild(data_input)

    //Colour div
    let color_div = document.createElement("div")
    color_div.style.width = "130px"
    color_div.style.height = "25px"
    color_div.className = "color_div"
    note.appendChild(color_div)


    //Adding divs colours
    color_div.appendChild(creatDivColor("#BC8F8F", note))
    color_div.appendChild(creatDivColor("#FFE4E1", note))
    color_div.appendChild(creatDivColor("#FFD700", note))
    color_div.appendChild(creatDivColor("#E6E6FA", note))
    color_div.appendChild(creatDivColor("#AFEEEE", note))


    //Adding cancel btn
    let cancel = document.createElement("div")
    cancel.className = "btn_cancel"
    cancel.style.width = "22px"
    cancel.style.height = "22px"
    cancel.addEventListener('click', function removeNotes() {
        //Removing note
        document.querySelector("#notatki").removeChild(note)

        notatkiTbl[getID(note)].id = "d" + note.id
        setLocal("notatki", notatkiTbl)
    })
    title.appendChild(cancel)

    //Adding a structure to an array
    notatkiTbl.push(notatkiStr)
    note_id++
    notatkiStr = {}

    //Placing an array in Local Storage
    setLocal("notatki", notatkiTbl)
}


//The right date format
function getTermin() {
    let czas = new Date()
    let dzien = czas.getDate()
    let miesiac = czas.getMonth() + 1
    if (dzien < 10)
        dzien = "0" + dzien
    if (miesiac < 10)
        miesiac = "0" + miesiac
    return dzien + "-" + miesiac + "-" + czas.getFullYear()
}

//Function for div's colours
function creatDivColor(_color, _note) {
    let col_div = document.createElement("div")
    col_div.style.width = "20px"
    col_div.style.height = "20px"
    col_div.style.borderRadius = "30px"
    col_div.style.border = "1px solid grey"
    col_div.style.marginLeft = "3px"
    col_div.style.marginBottom = "5px"
    col_div.style.backgroundColor = _color
    col_div.style.display = "inline-block"
    col_div.addEventListener('click', function changeColor() {
        //Updating in the array after changing the color
        _note.style.backgroundColor = _color
        notatkiTbl[getID(_note)].color = _color //Change the colour in the array
        setLocal("notatki", notatkiTbl)
    })
    return col_div
}
//Funcion for removing selected notes
function removeSelected() {
    let checkbox = document.querySelectorAll('input[type = "checkbox"]')
    console.log(checkbox)
    checkbox.forEach(x => {
        if (x.checked) {
            x.parentNode.parentNode.removeChild(x.parentNode)
        }
    })
}

//document.querySelectorAll("#clear_selected").addEventListener("click", removeSelected)

//Converting array to JSON -> placing in localStorage
function setLocal(whereSet, whatSet) {
    //JSON arrays
    jsonParse = JSON.stringify(whatSet)
    localStorage.setItem(whereSet, jsonParse)
    //console.log(jsonParse)

}

//Downloading and removing notes from LocalStorage
function getLocal() {
    let curTable = JSON.parse(localStorage.getItem('notatki'))

    let i = 0
    while (i < curTable.length) {
        //If the note ID has a prefix "dnt" -> it is not displayed / removed
        if (curTable[i].id.substr(0, 3) == "dnt") {
            //completing the table without displaying a note
            notatkiStr.id = curTable[i].id
            notatkiStr.title = curTable[i].title
            notatkiStr.text = curTable[i].text
            notatkiStr.data = curTable[i].data
            notatkiTbl[i] = notatkiStr
            notatkiStr = {}
            //increase note_id to rewrite id to new notes
            note_id++
            i++

        }
        else {
            addNotes(curTable[i].id, curTable[i].title, curTable[i].text, curTable[i].data, curTable[i].color)
            i++
        }
    }
}

// LocalStorage cleaning
function clearNotes() {
    localStorage.clear()
    notatkiTbl = []
    notatkiStr = {}
    note_id = 0
    location.reload()
    //console.log(localStorage)
}

//Note_id from ID generation
function getID(noteId) {
    let leng = noteId.id.length
    return noteId.id.substr(2, leng - 2)
}

