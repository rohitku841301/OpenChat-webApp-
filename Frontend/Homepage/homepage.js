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
      showChat(responseData.data.message);
    }
  } catch (error) {
    console.log(error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    const responseData = await axios.get("http://localhost:3000/chat/getChat", {
      headers: {
        Authorization: token,
      },
    });
    console.log(responseData);
  } catch (error) {
    console.log(error);
    window.location.href = "../Login/login.html";
  }
});

function showChat(msg) {
  const para = document.createElement("p");
  para.innerText = msg;
  const chatContainer = document.querySelector(".chatContainer");
  chatContainer.append(para);
}
