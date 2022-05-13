const addBtn = document.querySelector(".add-btn")
const remBtn = document.querySelector(".rem-btn")
const modalCont = document.querySelector(".modal-cont")

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
    })
})