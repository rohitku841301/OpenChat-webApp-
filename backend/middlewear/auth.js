require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.authentication = async (req, res, next) => {
  try {
   
    const headerToken = req.headers.authorization;
    console.log("2", headerToken);
    if (!headerToken) {
      return res.status(401).json({
        responseMessage: "authentication is required",
        success: false,
      });
    }
    const decode = await jwt.verify(headerToken, process.env.JWT_SECRET);

    console.log("userId",decode);
    req.user = decode; 
    next();
  } catch (error) {
    res.status(403).json({
      responseMessage: "Token verification failed",
      success: false,
    });
  }
};





// function display(data){
//   if(data.id!==0){
//       console.log(data,"data999")
//       let parentNode=document.querySelector('#box');
//       // let parentNode2=document.querySelector('.right');
//       // console.log('--0000--->',data)
//       let senderName=data.senderName
//       let message = data.message
//       let multimedia= data.multimedia
//       let multimediaType = data.multimediaType
//       if(data.userId==userId){
//           //--commented--
//           //let childNode2=<div class="right message" id=${data.id}><span class="fw-bold">${data.senderName}:</span> <span class="fst-italic">${data.message}</span></div>;
//           //parentNode.innerHTML+=childNode2;
//           //--till here--
//           if (message) {
//               const messageContainer = document.createElement('div');
//               messageContainer.classList.add('right', 'message');
//               messageContainer.id = userId;
  
//               const messageText = document.createElement('span');
//               messageText.classList.add('fw-bold', 'fst-italic');
//               messageText.textContent = ${senderName}: ${message};
//               messageContainer.appendChild(messageText);
  
//               // Append the message container to the chat container
//               parentNode.appendChild(messageContainer);
//           }
          
//           // Multimedia container
//           if (multimedia) {
//               const multimediaContainer = document.createElement('div');
//               multimediaContainer.classList.add('right', multimediaType);
//               multimediaContainer.id = userId;
              
//               if (multimediaType === 'Image') {
//                   const multimediaElement = document.createElement('img');
//                   multimediaElement.src = multimedia;
//                   multimediaElement.alt = 'Multimedia';
//                   multimediaElement.style.width = '400px';
//                   multimediaElement.style.height = '400px';
//                   multimediaElement.style.border = '6px solid #800080';
//                   multimediaContainer.appendChild(multimediaElement);
//               } else if (multimediaType === 'Video') {
//                   const multimediaElement = document.createElement('video');
//                   multimediaElement.src = multimedia;
//                   multimediaElement.controls = true;
//                   multimediaElement.style.width = '400px';
//                   multimediaElement.style.height = '400px';
//                   multimediaElement.style.border = '6px solid #800080';
//                   multimediaContainer.appendChild(multimediaElement);
//               }
  
//               // Append the multimedia container to the chat container
//               parentNode.appendChild(multimediaContainer);
//           }
//       } else {
//           // Message container
//           if (message) {
//               const messageContainer = document.createElement('div');
//               messageContainer.classList.add('left', 'message');
//               messageContainer.id = userId; // Use receiverId for the receiver
  
//               const messageText = document.createElement('span');
//               messageText.classList.add('fw-bold', 'fst-italic');
//               messageText.textContent = ${senderName}: ${message};
//               messageContainer.appendChild(messageText);
  
//               // Append the message container to the chat container
//               parentNode.appendChild(messageContainer);
//           }
          
//           // Multimedia container
//           if (multimedia) {
//               const multimediaContainer = document.createElement('div');
//               multimediaContainer.classList.add('left', multimediaType);
//               multimediaContainer.id = userId; // Use receiverId for the receiver
  
//               if (multimediaType === 'Image') {
//                   const multimediaElement = document.createElement('img');
//                   multimediaElement.src = multimedia;
//                   multimediaElement.alt = 'Multimedia';
//                   multimediaElement.style.width = '400px';
//                   multimediaElement.style.height = '400px';
//                   multimediaElement.style.border = '6px solid #800080';
//                   multimediaContainer.appendChild(multimediaElement);
//               } else if (multimediaType === 'Video') {
//                   const multimediaElement = document.createElement('video');
//                   multimediaElement.src = multimedia;
//                   multimediaElement.controls = true;
//                   multimediaElement.style.width = '400px';
//                   multimediaElement.style.height = '400px';
//                   multimediaElement.style.border = '6px solid #800080';
//                   multimediaContainer.appendChild(multimediaElement);
//               }
  
//               // Append the multimedia container to the chat container
//               parentNode.appendChild(multimediaContainer);
//           }
//       }
      

//   }
// }

// document.getElementById('send').onclick = async function (e) {
//   e.preventDefault();
//   message= document.getElementById('textArea').value
//   let fileInput = document.getElementById('fileInput')
//   let fileInputValue = document.getElementById("fileInput").value;
//   userId= Number(userId),
//   groupId= Number(groupId) 

//   if (!(fileInputValue) &&!(message)){
//       document.getElementById('textArea').value="";
//       return
//   }else if ((!fileInputValue)&&(message.trim()===""))
//   {   document.getElementById('textArea').value="";
//       return
//   }

//   try {
//       let formData = new FormData()
//       formData.append('message', message);
//       formData.append('file', fileInput.files[0]);
//       formData.append('userId', userId);
//       formData.append('groupId', groupId);
      
//       document.getElementById('textArea').value="";
//       document.getElementById('fileInput').value="";
      
//       //console.log('message', message,'file', fileInput.files[0],'userId', userId,'groupId', groupId)
//       const postResp = await axios.post('/user/message', formData, { 
//           headers: { 
//               'Content-Type': 'multipart/form-data',
//               "Authorization": token 
//           } });
          

//       //socket function:==>
//       socket.emit('send-message',(groupId));


//       // showOnScreen(postResp.data);

//   }
//   catch (err) {
//        console.log(err)
//       //alert(err.response.data.message);
//   }

// }


// <!doctype html>
// <html lang="en">

// <head>
//   <meta charset="utf-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1">
//   <title>Chat Window</title>
//   <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet"
//     integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
//     <link rel="stylesheet" href="/css/chat.css">
//     <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.6.1/socket.io.js"></script>
  
// </head>

// <body>
  
//   <h3 id="Groupchatheading" class="text-center"></h3>
//   <div class="container-fluid">
//     <div id="row" class="row justify-content-between">

//       <!-- members -->
//       <div class="col-md-3 members">
//         <hr>
//         <h4 class="text-center"> Admin(s):</h4>
//         <div class="scroll">
//           <ol id="admins" class=" text-success fw-bold "></ol>
//         </div>
//         <hr>
//         <h4 class="text-center">Other Members:</h4>
//         <div class="scroll">
//           <ol id="members"></ol>
//         </div>
//       </div>

      

//       <!-- messagebox -->
//       <div class="col-md-6 ">
        
//         <h2 id="chatbox" class="text-center"></h2>
//         <div id="box" class="scroll-div ms-3 col-md-10 bg-light">
          
//         </div>
//         <div id="input" class="container">
//           <div class="row ">
//             <div class="col-sm-6">
//               <textarea id="textArea" class="text-center pt-1" name="w3review" 
//                 placeholder="type message"></textarea>
//                 <input type="file" id="fileInput" class="form-control" accept="image/,video/"
//        style="width: 200px; height: 40px; border-radius: 20px; overflow: hidden;">
//             </div>
//             <div class=" col-sm-6">
//               <button id="send" class="btn btn-outline-dark bg-primary ms-4 mt-2">Send</button>
//             </div>
//           </div>
//         </div>
        
//       </div>

     
//       <!-- go to Groups -->
//       <div class="col-md-2">
//         <!-- <button class="btn btn-outline-dark bg-success">Switch Groups</button> -->
//         <a class="btn btn-outline-dark bg-success" href="/groups">Switch Groups</a>
//         <a class="btn btn-danger btn-sm float-right delete" href="/logout-page">Logout</a>
        
//       </div>
     
//     </div>
    
//   </div>
  

 








//   <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.3.5/axios.min.js"></script>
//   <script src="/js/chatmsg.js"></script>
//   <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
//     integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4"
//     crossorigin="anonymous"></script>
// </body>

// </html>