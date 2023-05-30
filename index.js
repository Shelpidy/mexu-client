document.addEventListener("DOMContentLoaded",()=>{
    var socket = io('http://localhost:8080/?roomId=6&userId=1&roomType=c',{ timeout: 5000 })
    // socket.connect('http://localhost:8080');
    console.log("Client started")

    socket.emit("activeRoom",{userId:1,activeRoom:`c-${6}`})

   
    fetch("http://localhost:8080/api/messages/6/1/20",{method:"GET"}).then(res => res.json()).then(result =>{

           let {messages,count} = result
           console.log(result)
            for(let message of messages.reverse()){
                    if(message.user._id == 8){
                        displaySentMsg(message.text)
                    }
                    else{
                        displaReceivedMsg(message.text)
                    }       
                }
    }).catch(err =>{
        console.log(err)
    })

    socket.on('connected',(socket)=>{
        console.log("Connected to the server")
        socket.emit("online",{online:true})
   
    })

socket.on('message',(msg)=>{
        console.log("Message from the server",msg)
       
    })


socket.on("online",(data)=>{
        console.log("From Online",data)
        if(data.userId == 8){
            if(data.online){
                 document.querySelector(".o-status").textContent = 'online'
            }else{
                 document.querySelector(".o-status").textContent ="last seen" + String(data.updatedAt)
            }
           
        } })

socket.on("typing",(data)=>{
          console.log("From Typing",data)
           if(data.userId == 3){
                if(data.typing){
                     document.querySelector(".t-status").textContent = 'typing...'
                }
                else{
                     document.querySelector(".t-status").textContent = ''
                }
               
                }})
socket.on("recording",(data)=>{
          console.log("From Recording",data)
           if(data.userId == 8){
                if(data.recording){
                     document.querySelector(".t-status").textContent = 'recording...'
                }
                else{
                     document.querySelector(".t-status").textContent = ''
                }
               
                }})

    socket.on("c-6",(data)=>{
            let chat = data
            console.log("From Server",chat)
            if(chat.user._id == 8){
                    displaySentMsg(chat.text)
                }
            else{
                displaReceivedMsg(chat.text)
            }
    })



   
    let btn = document.querySelector('button')
    let chatInput = document.querySelector('textarea')
    let chatBox = document.querySelector(".chat-box")

    chatInput.addEventListener("focus",()=>{
        console.log("Typing...")
        socket.emit("typing",{userId:1,typing:true})
    })


     chatInput.addEventListener("blur",()=>{
        console.log("Stopping Typing...")
        socket.emit("typing",{userId:1,typing:false})
    })

    //  chatInput.addEventListener("input",()=>{
    //     console.log("Typing....")
    // })

    function displaySentMsg(msg){
        let p = document.createElement("p")
        p.style.backgroundColor = "#18246B"
        p.style.color = 'white'  
        p.style.borderRadius = '2px'
        p.style.padding = '5px'
        p.style.alignSelf = 'end'
        p.style.maxWidth='30vw'
        p.style.width = 'max-content'
        p.style.marginRight = '10px'
        p.style.marginTop="4px"
        p.textContent = msg
        chatBox.appendChild(p)
    }

   function displaReceivedMsg(msg){
        let p = document.createElement("p")
        p.style.backgroundColor = "#FFF"
        p.style.color = '#18246B'                                                   
        p.style.borderRadius = '2px'
        p.style.padding = '5px'
        p.style.alignSelf = 'autoto'
        p.style.width = 'max-content'
        p.style.maxWidth='30vw'
        p.style.marginLeft = '10px'
        p.style.marginTop="4px"
        p.textContent = msg
        chatBox.appendChild(p)
    }


    const generateRoomId = (s,r)=>{
       let maxId =  Math.max(s,r)
       let minId = Math.min(s,r)
        return Number(`${maxId}${minId}`)
    }
    btn.addEventListener('click',()=>{
        // displaySentMsg(chatInput.value)
        let sendData = {
            senderId:1,
            recipientId:8,
            roomId:6,
            text:chatInput.value
        }
        console.log(sendData)
        socket.emit(`c-${sendData.roomId}`,sendData)
      

    })
})