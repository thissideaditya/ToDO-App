const addBtn = document.querySelector(".add-btn")
const remBtn = document.querySelector(".rem-btn")
const modalCont = document.querySelector(".modal-cont")
const textareaCont = document.querySelector(".textarea-cont")
const mainCont = document.querySelector(".main-cont")
let colors = ['lightPink', 'lightGreen', 'lightBlue', 'black']
let modalPriorityColor = colors[colors.length - 1]

let addModal = false
addBtn.addEventListener('click', function(){
    if(!addModal){
        modalCont.style.display = "flex"
    }else{
        modalCont.style.display = "none"
    }
    addModal = !addModal
})

remBtn.addEventListener('click', function(){
    modalCont.style.display = "none"
})

const allPriorityColors = document.querySelectorAll(".priority-color")

allPriorityColors.forEach(function(colorElement){
    colorElement.addEventListener("click", function(){
        allPriorityColors.forEach(function(priorityColorElem){
            priorityColorElem.classList.remove("active")
        })
        colorElement.classList.add("active")
        modalPriorityColor = colorElement.classList[0]
    })
})

modalCont.addEventListener("keydown", function(e){
    let key = e.key
    if(key == "Shift"){
        createTicket(modalPriorityColor, textareaCont.value)
        modalCont.style.display = "none"
        addModal = !addModal
        textareaCont.value = ""
        allPriorityColors.forEach(function(colorElement){
            colorElement.classList.remove("active")
        })
    }
})


function createTicket(ticketColor, data){
    let ticketCont = document.createElement("div") //<div></div>
    ticketCont.setAttribute("class", "ticket-cont")
    ticketCont.innerHTML = `
        <div class="ticket-color ${ticketColor} "></div>
        <div class="ticket-id"></div>
        <div class="task-area">${data}</div>
    `

    mainCont.appendChild(ticketCont)
}