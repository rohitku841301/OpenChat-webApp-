const socket = io("http://3.7.252.73:3000");
socket.on("connection", (socket) => {
  console.log("socket connected");
});

let groupId = null;
let memberUserId = null;
let userId = null;
let groupName = "";

//tools
function screenResize() {
  const width = window.innerWidth;
  if (width < 576) {
    if (groupId === null) {
      console.log("hoja");
      // document.querySelector(".left-part").style.width = "20%";
      document.querySelector(".left-part").style.maxWidth = "100%";
      document.querySelector(".right-part").style.display = "none";
      document.querySelector(".back").style.display = "block";
    } else {
      console.log("aagya");
      document.querySelector(".back").style.display = "block";

      document.querySelector(".right-part").style.display = "block";

      document.querySelector(".left-part").style.display = "none";
    }
  } else {
    document.querySelector(".back").style.display = "none";
    document.querySelector(".left-part").style.maxWidth = "300px";
    document.querySelector(".left-part").style.display = "block";
    document.querySelector(".right-part").style.display = "block";
  }
}
window.addEventListener("resize", screenResize);

document.querySelector(".back").addEventListener("click", async () => {
  // groupId=null
  document.querySelector(".left-part").style.maxWidth = "100%";
  document.querySelector(".right-part").style.display = "none";
  document.querySelector(".left-part").style.display = "block";

  await fetchingAllGroup();
});

function errorHandling(error){
  if(error.response.status === 400){
    alert(error.response.data.responseMessage)
  }else if(error.response.status === 401){
    alert(error.response.data.responseMessage)
    window.location.href = "../Login/login.html"
  }else if(error.response.status === 403){
    alert(error.response.data.responseMessage)
    window.location.href = "../Login/login.html"
  }else if(error.response.status === 404){
    alert(error.response.data.responseMessage)
  }else if(error.response.status===409){
    alert(error.response.data.responseMessage)
  }else if(error.response.status===500){
    alert(error.response.data.responseMessage)
  }else{
    console.log(error);
  }
}

document.getElementById("logout").addEventListener("click", ()=>{
  localStorage.clear("token");
  // window.location.href = "../Login/login.html";
  window.location.href = "../Homepage/homepage.html"

})



document.addEventListener("DOMContentLoaded", async () => {
  try {
    screenResize();
    if (groupId === null) {
      document.querySelector(".right-part-wrapper1").style.display = "none";
      document.querySelector(".right-part-wrapper2").style.display = "flex";
    }
    await fetchingAllGroup();
  } catch (error) {
    console.log(error);
    errorHandling(error)
  }
});

async function fetchingAllGroup() {
  try {
    const token = localStorage.getItem("token");
    const responseData = await axios.get(
      "http://3.7.252.73:3000/chat/showGroup",
      {
        headers: {
          Authorization: token,
        },
      }
    );

    if (responseData.status === 200) {
      const groupContainer = document.getElementById("groupNameContainer");
      while (groupContainer.firstChild) {
        groupContainer.removeChild(groupContainer.firstChild);
      }
      responseData.data.groupDetails.map((groupDetail) => {
        const h4 = document.createElement("h4");
        h4.innerText = groupDetail.groupName;
        h4.classList.add("singleGroup");
        h4.setAttribute("id", groupDetail.groupId);
        h4.setAttribute("onclick", "openGroupPage(event)");
        groupContainer.append(h4);
      });
    }
  } catch (error) {
    errorHandling(error)
  }
}




// ------------------------ hamburger-left-slider -----------------------
document
  .getElementById("hamburgerToOpen")
  .addEventListener("click", async () => {
    try {
      await fetchingUserDetails();
    } catch (error) {
      console.log(error);
    }
  });
async function fetchingUserDetails() {
  try {
    const token = localStorage.getItem("token");
    const responseData = await axios.get(
      "http://3.7.252.73:3000/user/userDetails",
      {
        headers: {
          Authorization: token,
        },
      }
    );
    if (responseData.status === 200) {
      showUserDetails(responseData.data.userDetails);
    }
  } catch (error) {
    if(error.response.status===500){
      alert(error.response.data.responseMessage)
    }else{
      console.log(error);
    }
  }
}
function showUserDetails(userDetails) {
  userId = userDetails.userId;
  document.querySelector(".userDetailName").innerText = userDetails.name;
  document.querySelector(".userDetailEmail").innerText = userDetails.email;
}

// --------------------------------------------------------------------------



// ------------------------------- socket implementation -----------------------
socket.on("message-received", async (msg) => {
  console.log(msg);
  await fetchingAllMessage();
});

socket.on("member-added", async (member) => {
  console.log("active");
  await fetchingAllGroup();
});







//openGroupPage ->
// 1. chat header
// 2. fetching all message

async function openGroupPage(event) {
  try {
    showChatHeader(event);
    screenResize();
    await fetchingAllMessage();
  } catch (error) {
    console.log(error);
    errorHandling(error)
  }
}

function showChatHeader(event) {
  document.querySelector(".right-part-wrapper1").style.display = "block";
  document.querySelector(".right-part-wrapper2").style.display = "none";

  const groupNameContainer = document.getElementById("groupNameContainer");
  const h4Elements = groupNameContainer.querySelectorAll("h4");
  h4Elements.forEach((h4) => {
    h4.style.backgroundColor = "#fcf6f5ff";
  });
  event.target.style.backgroundColor = "#d1d1d1";
  groupId = event.target.getAttribute("id");
  const chatHeader = document.querySelector(".chatHeader-GroupName");
  chatHeader.innerText = event.target.innerText;
}

async function fetchingAllMessage() {
  try {
    const chatContainer = document.querySelector(".chatContainer");
    // while (chatContainer.firstChild) {
    //   chatContainer.removeChild(chatContainer.firstChild);
    // }

    if (groupId === null) {
      console.log("nullll", groupId);

      document.querySelector(".right-part-wrapper1").style.display = "none";
      document.querySelector(".right-part-wrapper2").style.display = "flex";
    } else {
      const token = localStorage.getItem("token");
      const responseData = await axios.get(
        `http://3.7.252.73:3000/chat/showGroup/getGroupChat/${groupId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      if(responseData.status === 200){
      showChat(responseData.data.responseData);
        console.log("respo", responseData);
      }
    }
  } catch (error) {
    console.log(error);
    errorHandling(error);
  }
}

function showChat(msg) {
  const chatContainer = document.querySelector(".chatContainer");
  while (chatContainer.firstChild) {
    chatContainer.removeChild(chatContainer.firstChild);
  }

  msg.map((userMsg) => {
    const dateTime = new Date(userMsg.createdAt);
    const time = dateTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const msgBox = document.createElement("div");
    msgBox.classList.add("msg-box");

    const msgUserDetails = document.createElement("div");
    msgUserDetails.classList.add("msg-user-details");
    const h6 = document.createElement("h6");
    h6.classList.add("msg-user-name");
    h6.innerText = `~${userMsg.user.name}`;
    const p1 = document.createElement("p");
    p1.classList.add("msg-user-mail");
    p1.innerText = `${userMsg.user.email}`;
    msgUserDetails.append(h6);
    msgUserDetails.append(p1);

    const msgUserMsg = document.createElement("div");
    msgUserMsg.classList.add("msg-user-msg");
    if(userMsg.contentType === "text"){
      const p2 = document.createElement("p");
    p2.classList.add("user-msg");
    p2.innerText = `${userMsg.content}`;
    msgUserMsg.append(p2);
    }else{
      const imageUrl = document.createElement("img");
      imageUrl.classList.add("user-img");
      imageUrl.setAttribute("src", `${userMsg.content}`);
      imageUrl.setAttribute("alt", "userimageMedia")
      msgUserMsg.append(imageUrl)
    }
    // const p2 = document.createElement("p");
    // p2.classList.add("user-msg");
    // p2.innerText = `${userMsg.content}`;
    // msgUserMsg.append(p2);

    const msgTimeBox = document.createElement("div");
    msgTimeBox.classList.add("msg-time-box");
    const span = document.createElement("span");
    span.classList.add("msg-time");
    span.innerText = `${time}`;
    msgTimeBox.append(span);

    msgBox.append(msgUserDetails);
    msgBox.append(msgUserMsg);
    msgBox.append(msgTimeBox);
    chatContainer.append(msgBox);
    const chatContainerWrapper = document.querySelector(
      ".chatContainerWrapper"
    );
    chatContainerWrapper.scrollTop = chatContainerWrapper.scrollHeight;
  });
}


function updateFileName() {
  const fileInput = document.getElementById("fileInput");
  const selectedFileName = document.getElementById("selectedFileName");
  console.log(selectedFileName);
  if (fileInput.files.length > 0) {
    document.getElementById("chatMsg").style.display = "none";
    selectedFileName.textContent = `${fileInput.files[0].name.slice(
      0,
      20
    )} ...`;
    selectedFileName.style.display = "flex";
  } else {
    document.getElementById("chatMsg").style.display = "block";
    selectedFileName.textContent = "";
    selectedFileName.style.display = "none";
  }
}

document
  .querySelector(".deleteButton")
  .addEventListener("click", clearFormImage);
function clearFormImage() {
  const fileInput = document.getElementById("fileInput");
  const selectedFileName = document.getElementById("selectedFileName");
  if (fileInput.files.length > 0) {
    fileInput.value = "";
    selectedFileName.textContent = "";
    selectedFileName.style.display = "none";
    document.getElementById("chatMsg").style.display = "block";
  }
}

async function chatFormHandler(event) {
  try {
    event.preventDefault();
    const uploadFile = document.getElementById("fileInput");
    console.log("uploadFile", uploadFile.files[0]);
    let formData = new FormData();
    formData.append("file", uploadFile.files[0]);
    formData.append("chatMsg", event.target.chatMsg.value);

    const msg = {
      message: event.target.chatMsg.value,
    };
    if (msg.message || uploadFile) {
      const token = localStorage.getItem("token");
      console.log(token);
      const responseData = await axios.post(
        `http://3.7.252.73:3000/chat/postChat/${groupId}`,
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      if (responseData.status === 200) {
        document.getElementById("chatMsg").value = "";
        clearFormImage();
        console.log(responseData.data.message);
        socket.emit("front-message", responseData.data.message);
        await fetchingAllMessage();
      }
    } else {
      console.log("hvhg");
    }
  } catch (error) {
    console.log(error);
    errorHandling(error)
  }
}

// document
//   .getElementById("chatHeaderProfileOpen")
//   .addEventListener("click", chatGroupInfo);
document
  .getElementById("more-option-trigger")
  .addEventListener("click", showAddMemberOption);
async function showAddMemberOption() {
  try {
    const isAdmin = await checkYouAreAdmin();
    if (isAdmin) {
      document.getElementById("addMember").style.display = "flex";
    } else {
      document.getElementById("addMember").style.display = "none";
    }
  } catch (error) {
    console.log(error);
  }
}

async function checkYouAreAdmin() {
  try {
    const token = localStorage.getItem("token");
    const responseData = await axios.get(
      `http://3.7.252.73:3000/chat/checkYouAreAdmin/${groupId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log(responseData);
    if (responseData.status === 200) {
      return responseData.data.isAdmin;
    }
  } catch (error) {
    console.log(error);
    errorHandling(error)
  }
}

document.getElementById("groupInfo").addEventListener("click", chatGroupInfo);
async function chatGroupInfo(e) {
  try {
    // e.stopPropagation();
    console.log("aagya");
    const token = localStorage.getItem("token");
    console.log("aagya");
    console.log(groupId);
    const responseData = await axios.get(
      `http://3.7.252.73:3000/chat/showGroup/group-info/diff?groupId=${groupId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log(responseData);
    showGroupInfo(responseData.data.groupInfo);
  } catch (error) {
    console.log(error);
    errorHandling(error);
  }
}
function showGroupInfo(groupInfo) {
  const groupNameHeader = document.getElementById("groupNameHeader");
  const groupMemberCount = document.getElementById("groupMemberCount");
  const groupMemberCount1 = document.getElementById("groupMemberCount1");
  const groupCreatedAt = document.getElementById("groupCreatedAt");
  groupNameHeader.innerText = groupInfo.groupName;
  groupMemberCount.innerText = `${groupInfo.groupMemberCount} members`;
  groupMemberCount1.innerText = `${groupInfo.groupMemberCount} MEMBERS`;
  groupCreatedAt.innerText = groupInfo.groupCreatedAt.split("T")[0];
  const groupMemberDetails = document.getElementById("group-member-details");

  while (groupMemberDetails.firstChild) {
    groupMemberDetails.removeChild(groupMemberDetails.firstChild);
  }

  groupInfo.groupMember.map((member) => {
    const memberDiv = document.createElement("div");
    const memberBigDiv = document.createElement("div");
    memberBigDiv.classList.add("one-member");
    const memberSmallDiv = document.createElement("div");
    const memberH2 = document.createElement("h2");
    const memberP = document.createElement("p");
    memberH2.innerText = member.user.name;
    memberP.innerText = member.user.email;
    memberSmallDiv.append(memberH2);
    memberSmallDiv.append(memberP);
    const memberIsAdmin = document.createElement("p");
    memberIsAdmin.innerHTML = member.isAdmin ? "Admin" : ``;
    if (!member.isAdmin) {
      memberDiv.classList.add("all-nonAdmin");
    }
    memberDiv.setAttribute("id", `user-${member.userId}`);
    memberBigDiv.append(memberSmallDiv);
    memberBigDiv.append(memberIsAdmin);
    memberDiv.classList.add("all-member");

    memberBigDiv.addEventListener("click", openPromoteToAdmin);

    memberDiv.append(memberBigDiv);
    groupMemberDetails.append(memberDiv);
  });
}

async function addUserHandler(event) {
  try {
    event.preventDefault();
    console.log("sdkjnkl");
    const addUserData = {
      memberEmail: event.target.addUser.value,
      isAdmin: false,
    };
    console.log(JSON.stringify(addUserData));
    const token = localStorage.getItem("token");
    console.log("sad", groupId);
    const responseData = await axios.post(
      `http://3.7.252.73:3000/chat/showGroup/addUserToGroup?groupId=${groupId}`,
      JSON.stringify(addUserData),
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("adddd", responseData);
    if (responseData.status === 200) {
      socket.emit("add-member-notification", "member");
      alert(responseData.data.responseMessage)
    }
  } catch (error) {
    console.log(error);
    errorHandling(error)
  }
}

document.getElementById("leaveGroupPopup").addEventListener("click", () => {
  document.querySelector(
    ".leaveGroupMessage"
  ).innerText = `Exit "${groupName}" group`;
});

document.getElementById("exitGroup").addEventListener("click", async () => {
  try {
    console.log(userId);
    const token = localStorage.getItem("token");
    const responseData = await axios.delete(
      `http://3.7.252.73:3000/chat/showGroup/exit-group?groupId=${groupId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log(responseData);
    if (responseData.status === 200) {
      window.location.href = "../Homepage/homepage.html"
    }
  } catch (error) {
    console.log(error);
    errorHandling(error)
  }
});

async function openPromoteToAdmin(e) {
  e.stopPropagation();
  const isAdmin = await checkYouAreAdmin();
  if (isAdmin) {
    let targetElement = e.target;

    while (targetElement && !targetElement.classList.contains("all-member")) {
      targetElement = targetElement.parentNode;
    }
    console.log(targetElement);

    memberUserId = targetElement.getAttribute("id").split("-")[1];
    const closeBtn = document.getElementById("closePopup");
    const popupContainer = document.getElementById("popupContainer");
    closeBtn.addEventListener("click", function () {
      popupContainer.style.display = "none";
      document.querySelector(".overlay").style.display = "none";
    });
    console.log("myAccount", userId);

    if (targetElement.classList.contains("all-member")) {
      if (targetElement.classList.contains("all-nonAdmin")) {
        popupContainer.style.display = "block";
        document.querySelector(".overlay").style.display = "block";
        document.getElementById("makeUserAdmin").style.display = "flex";

        console.log("I m nonAdmin");
      } else if (memberUserId === userId) {
        console.log("do nothing");
      } else {
        console.log("i m admin");
        popupContainer.style.display = "block";
        document.querySelector(".overlay").style.display = "block";
        document.getElementById("makeUserAdmin").style.display = "none";
      }
    }
  } else {
    console.log("you are not allowed for this");
  }
}

document
  .getElementById("makeUserAdmin")
  .addEventListener("click", async (event) => {
    console.log(memberUserId, groupId);
    try {
      const token = localStorage.getItem("token");
      const userData = {
        userId: memberUserId,
        isAdmin: true,
      };
      const responseData = await axios.patch(
        `http://3.7.252.73:3000/chat/showGroup/group-info/promote-to-admin?groupId=${groupId}`,
        JSON.stringify(userData),
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(responseData);
      if (responseData.status === 200) {
        document.querySelector(".overlay").style.display = "none";
        popupContainer.style.display = "none";
        await chatGroupInfo();
      }
    } catch (error) {
      console.log(error);
    }
  });

document.getElementById("removeMember").addEventListener("click", async () => {
  try {
    const token = localStorage.getItem("token");
    console.log(token);
    const userData = {
      userId: memberUserId,
      isAdmin: false,
    };
    console.log(userData);
    const responseData = await axios.delete(
      `http://3.7.252.73:3000/chat/showGroup/group-info/removeMember/${memberUserId}?groupId=${groupId}`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(responseData);
    if (responseData.status === 200) {
      document.querySelector(".overlay").style.display = "none";
      popupContainer.style.display = "none";
      await chatGroupInfo();
    }
  } catch (error) {
    console.log(error);
  }
});

async function createGroup() {
  try {
    const groupName = document.getElementById("groupName").value;
    const groupObj = {
      groupName: groupName,
      isAdmin: true,
    };
    const token = localStorage.getItem("token");
    const responseData = await axios.post(
      "http://3.7.252.73:3000/chat/createGroup",
      JSON.stringify(groupObj),
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(responseData);
    if (responseData.status === 200) {
      await fetchingAllGroup();
    }
  } catch (error) {
    if (error.response.status === 404) {
      alert(error.response.data.responseMessage);
    } else if (error.response.status === 500) {
      alert(error.response.data.responseMessage);
    } else {
      console.log(error);
    }
  }
}

document.getElementById("create-group").addEventListener("click", createGroup);
