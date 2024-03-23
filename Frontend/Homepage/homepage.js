const socket = io("http://3.7.252.73:3000");
socket.on("connection", (socket) => {
  console.log("socket connected");
});

let groupId = null;
let memberUserId = null;
let userId = null;
let groupName = "";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await fetchingAllGroup();
  } catch (error) {
    console.log("yaha bhi");
    console.log(error);
    // window.location.href = "../Login/login.html";
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
    console.log(error);
    // window.location.href = "../Login/login.html"
  }
}

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
    console.log(error);
  }
}
function showUserDetails(userDetails) {
  userId = userDetails.userId;
  document.querySelector(".userDetailName").innerText = userDetails.name;
  document.querySelector(".userDetailEmail").innerText = userDetails.email;
}

//openGroupPage ->
// 1. chat header
// 2. fetching all message

async function openGroupPage(event) {
  try {
    showChatHeader(event);
    await fetchingAllMessage();
  } catch (error) {
    console.log(error);
  }
}

function showChatHeader(event) {
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

socket.on("message-received", async (msg) => {
  console.log(msg);
  await fetchingAllMessage();
});



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

      showChat(responseData.data.responseData);
    }
  } catch (error) {
    console.log("yha aarha hai");
    console.log(error);
    // window.location.href = "../Login/login.html";
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
    const p2 = document.createElement("p");
    p2.classList.add("user-msg");
    p2.innerText = `${userMsg.message}`;
    msgUserMsg.append(p2);

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



async function chatFormHandler(event) {
  try {
    event.preventDefault();
    const msg = {
      message: event.target.chatMsg.value,
    };
    console.log(msg);
    if (msg.message) {
      const token = localStorage.getItem("token");
      const responseData = await axios.post(
        `http://3.7.252.73:3000/chat/postChat/${groupId}`,
        JSON.stringify(msg),
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      if (responseData.status === 200) {
        document.getElementById("chatMsg").value = "";
        console.log(responseData.data.message);
        socket.emit("front-message", responseData.data.message);
        await fetchingAllMessage();
      }
    } else {
      console.log("hvhg");
    }
  } catch (error) {
    console.log(error);
  }
}

document
  .getElementById("chatHeaderProfileOpen")
  .addEventListener("click", chatGroupInfo);
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
    if (error.response.status === 500) {
      alert(error.response.data.responseMessage);
    }
  }
}
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

document.getElementById("groupInfo").addEventListener("click", chatGroupInfo);
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

socket.on("member-added", async (member) => {
  console.log("active");
  await fetchingAllGroup();
});

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
    console.log("adddd",responseData);
    if(responseData.status===200){
      console.log("hlwwww");
      socket.emit("add-member-notification", "member");
    }
  } catch (error) {
    console.log(error);
  }
}

document.getElementById("leaveGroupPopup").addEventListener("click", () => {
  document.querySelector(
    ".leaveGroupMessage"
  ).innerText = `Exit "${groupName}" group`;
});

document.getElementById("exitGroup").addEventListener("click", async () => {
  try {
    const token = localStorage.getItem("token");
    const responseData = await axios.delete(
      `http://3.7.252.73:3000/chat/showGroup/exit-group/${userId}?groupId=${groupId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log(responseData);
    if (responseData.status === 200) {
      await fetchingAllGroup();
    }
  } catch (error) {
    console.log(error);
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

document
  .getElementById("create-group")
  .addEventListener("click", createGroup);
