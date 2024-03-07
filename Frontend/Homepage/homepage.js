async function chatFormHandler(event) {
  try {
    event.preventDefault();
    const msg = {
      message: event.target.chatMsg.value,
    };
    console.log(msg);
    const token = localStorage.getItem("token");
    const responseData = await axios.post(
      "http://localhost:3000/chat/postChat",
      JSON.stringify(msg),
      {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
      }
    );
    if (responseData.status === 200) {
        console.log(responseData);
        console.log(responseData.data.message);
        await fetchingAllMessage();
    }
  } catch (error) {
    console.log(error);
  }
}

async function fetchingAllMessage(){
  try {
    document.getElementById("chatMsg").value = "";
    const chatContainer = document.querySelector(".chatContainer");
    while(chatContainer.firstChild){
      chatContainer.removeChild(chatContainer.firstChild);
    }
    console.log(chatContainer.length);
   
    const token = localStorage.getItem("token");
    console.log(token);
    const responseData = await axios.get("http://localhost:3000/chat/getChat", {
      headers: {
        Authorization: token,
      },
    });
    console.log(responseData);
    showChat(responseData.data.result);
  } catch (error) {
    console.log(error);
    window.location.href = "../Login/login.html";
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await fetchingAllMessage();
  } catch (error) {
    console.log(error);
  }
});

function showChat(msg) {
  msg.map((userMsg)=>{
    const para = document.createElement("p");
    para.innerText = `${userMsg.userId}: ${userMsg.message}`;
    const chatContainer = document.querySelector(".chatContainer");
    chatContainer.append(para);
  })

}
