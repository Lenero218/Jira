let addBtn = document.querySelector('.add')

let removeBtn = document.querySelector('.rem')
let removeFlag = false

let modalCont = document.querySelector('.model-cont')

let mainCont = document.querySelector('.main-cont')

let colors = ['lightpink','lightgreen','lightblue','black']

let modalPriorityColor = colors[colors.length-1] //black

let toolboxColors = document.querySelectorAll('.color')


let allPriorityColors = document.querySelectorAll('.priority-color')

let textAreaCont  = document.querySelector(".textArea-cont")

//as soon as ticket is getting created this will store the ticket in itself
let ticketsArray = []


let addFlag = false;
let lockFlag = false;
let lockClass = 'fa-lock'
let unlockClass = 'fa-unlock'




//Local Storage get all tickets
if(localStorage.getItem('tickets')){
    ticketsArray = JSON.parse(localStorage.getItem('tickets'))
    ticketsArray.forEach(function(ticket){
        createTicket(ticket.ticketColor,ticket.ticketTask,ticket.ticketId)
    })
}




//Filter tickets with respect to colors

    //We will clear the screen, store the tickets and then create new tickets of same color with the same content



for(let i = 0 ; i<toolboxColors.length; i++){
    toolboxColors[i].addEventListener('click',function(e){
        let currentToolBoxColor = toolboxColors[i].classList[0]
        
        //This will return a array with all the objects of filter tickets
        let filterTickets  = ticketsArray.filter(function(ticketObj){
            return currentToolBoxColor === ticketObj.ticketColor
        })

        //remove all the tickets

        let allTickets = document.querySelectorAll('.ticket-cont')

        for(let i = 0; i<allTickets.length ; i++){
            allTickets[i].remove()
        }

        //Filtered tickets display
        filterTickets.forEach(function(filterObj){

            console.log(filterObj.ticketId)

            createTicket(filterObj.ticketColor,filterObj.ticketTask,filterObj.ticketId)
        })
    })

    toolboxColors[i].addEventListener('dblclick', function(e){
        let allTickets = document.querySelectorAll('.ticket-cont')

        for(let i = 0; i<allTickets.length ; i++){
            allTickets[i].remove()
        } 

        ticketsArray.forEach(function(ticketObj){
             createTicket(ticketObj.ticketColor,ticketObj.ticketTask,ticketObj.ticketId)

        })



    })



}










addBtn.addEventListener('click',function(e){
    //Display a model


    //add flag = true, then model will be displayed
    //add flag = false, then model hide


    addFlag = !addFlag

    if(addFlag){
        modalCont.style.display = 'flex' //This will show the model class
    }

    else{

        modalCont.style.display = 'none'

    }


});


//Changing priority color
//We are importing classes of colors, from that it will import colors using css

allPriorityColors.forEach(function(colorElem)
{
    colorElem.addEventListener('click',function(e){
        allPriorityColors.forEach(function(priorityColorElem){
            priorityColorElem.classList.remove('active')
        })

        colorElem.classList.add('active')

        modalPriorityColor = colorElem.classList[0] // This will provide the color


         
    })

})












//Generating a ticket
modalCont.addEventListener('keydown',function(e){
    let key = e.key


    if(key == 'Shift'){
        //create Ticket
        createTicket(modalPriorityColor,textAreaCont.value,) // This will generate the ticket
        modalCont.style.display = 'none'
        addFlag = false
        textAreaCont.value = ' '
    }
})

//Creating the ticket
function createTicket(ticketColor, ticketTask, ticketId){

    let id = ticketId || shortid()  //If ticketId is present then use it otherwise call shortId()

    let ticketCont = document.createElement('div')
    ticketCont.setAttribute('class','ticket-cont')

    ticketCont.innerHTML = `  <div class="ticket-color ${ticketColor}" ></div>
    <div class="ticket-id">${id}</div>
    <div class="task-area">${ticketTask}</div>    
    <div class = "ticket-lock">
        <i class="fa-solid fa-lock"></i>
    </div>  

`

mainCont.appendChild(ticketCont)

handleRemoval(ticketCont,id)

handleLock(ticketCont,id)

if(!ticketId){ //If ticketId is not present then only add it to the ticket array
    ticketsArray.push({ticketColor,ticketTask,ticketId:id})
    localStorage.setItem('tickets',JSON.stringify(ticketsArray))

}


}


removeBtn.addEventListener('click',function(){

    removeFlag = !removeFlag

    if(removeFlag == true){
        removeBtn.style.color = 'blue'
    }else{
        removeBtn.style.color = 'red'
    }


})
//Remove tickets
function handleRemoval(ticket, id){
    ticket.addEventListener('click',function(){
        if(!removeFlag) return

        let idx  = getTicketIdx(id)

        

        // local Storage removal of ticket
        ticketsArray.splice(idx,1)

        let stringTicketArray = JSON.stringify(ticketsArray)

        localStorage.setItem('tickets',stringTicketArray)

        ticket.remove()



    })




}

function getTicketIdx(id){
    let ticketIdx = ticketsArray.findIndex(function(ticketObj){
        return ticketObj.ticketId === id
    })

    return ticketIdx
}



//Lock and unlock tickets

function handleLock(ticket,id){
    let lockCont = ticket.querySelector(".ticket-lock")
    let ticketLock = lockCont.children[0]   
    let ticket_taskArea = ticket.querySelector(".task-area")



    ticketLock.addEventListener('click',function(){

        let ticketIdx = getTicketIdx(id)


            if(ticketLock.classList.contains(lockClass)){
                ticketLock.classList.remove(lockClass) //This will render the class using classlist
                ticketLock.classList.add(unlockClass)
                ticket_taskArea.setAttribute('contenteditable','true')

                handleColor(ticket,id)

            }else{
                ticketLock.classList.remove(unlockClass)
                ticketLock.classList.add(lockClass)
                ticket_taskArea.setAttribute('contenteditable','false')
            }

            ticketsArray[ticketIdx].ticketTask = ticket_taskArea.innerText
            localStorage.setItem('tickets',JSON.stringify(ticketsArray))


    })

}


function handleColor(ticket,id){

    let ticketColorStrip = ticket.querySelector('.ticket-color')


    ticketColorStrip.addEventListener('click',function(event){
        let currentTicketColor = ticketColorStrip.classList[1]

        let currentTicketIdx = getTicketIdx(id)

        let currentTicketColorIdx = colors.findIndex(function(color){
            return currentTicketColor === color //This will return the index of the color

        })

        currentTicketColorIdx++;

        let newColorIndex = currentTicketColorIdx % colors.length

        let newTicketColor = colors[newColorIndex]

        ticketColorStrip.classList.remove(currentTicketColor)
        ticketColorStrip.classList.add(newTicketColor)

        console.log(newTicketColor)


        //Modify with new color
        ticketsArray[currentTicketIdx].ticketColor = newTicketColor 
        //Adding new Ticket color into the local storage

        localStorage.setItem('tickets',JSON.stringify(ticketsArray))

       





    })

}





