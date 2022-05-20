const uid = new ShortUniqueId();
const addBtn = document.querySelector(".add-btn")
const remBtn = document.querySelector(".rem-btn")
const cut = document.querySelector(".cut")
const done = document.querySelector(".done")
const modalCont = document.querySelector(".modal-cont")
const allPriorityColors = document.querySelectorAll(".priority-color")
const textareaCont = document.querySelector(".textarea-cont")
const mainCont = document.querySelector(".main-cont")
let colors = ['lightPink', 'lightGreen', 'lightBlue', 'black']
let modalPriorityColor = colors[colors.length - 1]
let toolBoxColors = document.querySelectorAll(".color")

let ticketArr = []
let lockClass = "fa-lock"
let unlockClass = "fa-lock-open"

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

cut.addEventListener('click', function(){
    modalCont.style.display = "none"
    addModal = !addModal
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

// done.addEventListener("click", function(){
//     createTicket(modalPriorityColor, textareaCont.value)
//         modalCont.style.display = "none"
//         addModal = !addModal
//         textareaCont.value = ""
//         allPriorityColors.forEach(function(colorElement){
//             colorElement.classList.remove("active")
// })

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
        <div class="task-area">${data}</div>
        <div class="ticket-lock">
          <i class="fa-solid fa-lock"></i>
        </div>
    `

    mainCont.appendChild(ticketCont)
    handleRemoval(ticketCont, id)
    handleColor(ticketCont, id)
    handleLock(ticketCont, id)

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

// on clicking remBtn, make color red and make color white in clicking again
let remBtnActive = false
remBtn.addEventListener('click', function(){
    if(remBtnActive){
        remBtn.style.color = "white"
    }else{
        remBtn.style.color = "red"
    }
    remBtnActive = !remBtnActive
    handleRemoval(ticketCont, id)
})

// removes ticket from local storage and UI
function handleRemoval(ticket, id){
    ticket.addEventListener("click", function(){
        if(!remBtnActive) return
        let idx = getTicketIdx(id)
        ticketArr.splice(idx, 1)

        // remove from local storage and set updated arr
        localStorage.setItem("tickets", JSON.stringify(ticketArr))

        // remove from frontend
        ticket.remove()
    })
}

// returns index of the ticket inside Local Storage's array
function getTicketIdx(id){
    let ticketidx = ticketArr.findIndex(function(ticketObj){
        return ticketObj.ticketId == id
    })
    return ticketidx
}

// change priority colors of the tickets
function handleColor(ticket, id){
    let ticketColorStrip = ticket.querySelector(".ticket-color")

    ticketColorStrip.addEventListener("click", function(){
        let currTicketColor = ticketColorStrip.classList[1]

        currTicketColorIdx = colors.indexOf(currTicketColor)

        let newTicketColorIdx = currTicketColorIdx + 1

        newTicketColorIdx = newTicketColorIdx % colors.length
        let newTicketColor = colors[newTicketColorIdx]

        ticketColorStrip.classList.remove(currTicketColor)
        ticketColorStrip.classList.add(newTicketColor)

        // local storage updation
        let ticketIdx = getTicketIdx(id)
        ticketArr[ticketIdx].ticketColor = newTicketColor
        localStorage.setItem("tickets", JSON.stringify(ticketArr))

    })
}

// lock and unlock to make content editable true or false
function handleLock(ticket, id){
    // append icons in ticket
    let ticketLockELe = ticket.querySelector(".ticket-lock")
    let ticketLock = ticketLockELe.children[0]
    let ticketTaskArea = ticket.querySelector(".task-area")

    // toggle of icons and contenteditable property
    ticketLock.addEventListener("click", function(){
        let ticketIdx = getTicketIdx(id)
        if(ticketLock.classList.contains(lockClass)){
            ticketLock.classList.remove(lockClass)
            ticketLock.classList.add(unlockClass)
            ticketTaskArea.setAttribute("contenteditable", "true")
        }else{
            ticketLock.classList.remove(unlockClass)
            ticketLock.classList.add(lockClass)
            ticketTaskArea.setAttribute("contenteditable", "false")
        }

        ticketArr[ticketIdx].data = ticketTaskArea.innerText
        localStorage.setItem("tickets", JSON.stringify(ticketArr))
    })
}