const uid = new ShortUniqueId();
const addBtn = document.querySelector(".add-btn")
const remBtn = document.querySelector(".rem-btn")
const modalCont = document.querySelector(".modal-cont")
const allPriorityColors = document.querySelectorAll(".priority-color")
const textareaCont = document.querySelector(".textarea-cont")
const mainCont = document.querySelector(".main-cont")
let colors = ['lightPink', 'lightGreen', 'lightBlue', 'black']
let modalPriorityColor = colors[colors.length - 1]
let toolBoxColors = document.querySelectorAll(".color")

let ticketArr = []

// to open close modal container
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

// to remove and add active class from each priority color of modal container
allPriorityColors.forEach(function(colorElement){
    colorElement.addEventListener("click", function(){
        allPriorityColors.forEach(function(priorityColorElem){
            priorityColorElem.classList.remove("active")
        })
        colorElement.classList.add("active")
        modalPriorityColor = colorElement.classList[0]
    })
})

// to generate and display a ticket
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

// function to create new ticket
function createTicket(ticketColor, data, ticketId){
    let id = ticketId || uid()
    let ticketCont = document.createElement("div") //<div></div>
    ticketCont.setAttribute("class", "ticket-cont")
    ticketCont.innerHTML = `
        <div class="ticket-color ${ticketColor} "></div>
        <div class="ticket-id">${id}</div>
        <div class="task-area">${data}</div>
    `

    mainCont.appendChild(ticketCont)

    // If ticket is being created for the first time, then ticketid would be undefined
    if(!ticketId){
        ticketArr.push({ticketColor, data, ticketId : id})
        localStorage.setItem("tickets", JSON.stringify(ticketArr))
    }

}

// get all tickets from local storage
if(localStorage.getItem("tickets")){
    ticketArr = JSON.parse(localStorage.getItem("tickets"))
    ticketArr.forEach(function(ticketObj){
        createTicket(ticketObj.ticketColor, ticketObj.data, ticketObj.ticketId)
    })
}

// filter tickets on the basis of ticket colors
for(let i = 0; i < toolBoxColors.length; i++){
    toolBoxColors[i].addEventListener("click", function(e){
        let currToolBoxColor = toolBoxColors[i].classList[0]

        let filteredTickets = ticketArr.filter(function(ticketObj){
            return currToolBoxColor == ticketObj.ticketColor
        })

        // remove all the tickets
        let allTickets = document.querySelectorAll(".ticket-cont")
        for(let i = 0; i < allTickets.length; i++){
            allTickets[i].remove()
        }

        //display filtered tickets
        filteredTickets.forEach(function(ticketObj){
            createTicket(ticketObj.ticketColor, ticketObj.data, ticketObj.ticketId)
        })

        // to display all the tickets of all colors on double clicking
        toolBoxColors[i].addEventListener("dblclick", function(){

            // to remove all the specific colors ticket
            let allTickets = document.querySelectorAll(".ticket-cont")
            for(let i = 0; i < allTickets.length; i++){
            allTickets[i].remove()
        }
        
        // to display all the tickets irrespective of colors
        ticketArr.forEach(function(ticketObj){
            createTicket(ticketObj.ticketColor, ticketObj.data, ticketObj.ticketId)
        })

        })

    })
}