
async function chatFormHandler(event){
    try {
        event.preventDefault();
        const msg = event.target.chatMsg.value;
        console.log(msg);
        showChat(msg)
    } catch (error) {
        console.log(error);
    }
}

// document.addEventListener("DOMContentLoaded", async()=>{
//     try {
//         const token = localStorage.getItem("token");
//         console.log(token);;
//         const responseData = await axios.get("http://localhost:3000/chat/getChat",{
//             headers:{
//                 "Authorization":token
//             }
//         })
//         console.log(responseData);
//     } catch (error) {
//         console.log(error);
//         window.location.href = "../Login/login.html"

//     }
// })

function showChat(msg){
    const para = document.createElement("p");
    para.innerText=msg;
    const chatContainer = document.querySelector(".chatContainer");
    chatContainer.append(para);
}