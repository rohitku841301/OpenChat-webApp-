let groupId = null;

async function chatFormHandler(event) {
  try {
    event.preventDefault();
    const msg = {
      message: event.target.chatMsg.value,
    };
    console.log(msg);
    const token = localStorage.getItem("token");
    const responseData = await axios.post(
      `http://localhost:3000/chat/postChat/${groupId}`,
      JSON.stringify(msg),
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    if (responseData.status === 200) {
      console.log("postmsg", responseData);
      document.getElementById("chatMsg").value = "";
      await fetchingAllMessage();
    }
  } catch (error) {
    console.log(error);
  }
}

async function fetchingAllMessage() {
  try {
    const chatContainer = document.querySelector(".chatContainer");
    while (chatContainer.firstChild) {
      chatContainer.removeChild(chatContainer.firstChild);
    }
    console.log("chaeck", groupId);
    if (groupId === null) {
      console.log("nullll", groupId);

      document.querySelector(".right-part-wrapper1").style.display = "none";
      document.querySelector(".right-part-wrapper2").style.display = "flex";
    }
    // else {
    //   console.log("hey", groupId);

    //   console.log("yha aaraha hai kya");
    //   const token = localStorage.getItem("token");
    //   const responseData = await axios.get(
    //     `http://localhost:3000/chat/showGroup/${groupId}`,
    //     {
    //       headers: {
    //         Authorization: token,
    //       },
    //     }
    //   );
    //   console.log("all", responseData);
    //   showChat(responseData.data.responseData);
    // }
  } catch (error) {
    console.log(error);
    // window.location.href = "../Login/login.html";
  }
}

async function openGroupPage(event) {
  try {
    document.querySelector(".right-part-wrapper1").style.display = "block";
    document.querySelector(".right-part-wrapper2").style.display = "none";
    groupId = event.target.getAttribute("id");
    const chatHeader = document.querySelector(".chatHeader-GroupName");
    chatHeader.innerText = event.target.innerText;
    const token = localStorage.getItem("token");
    const responseData = await axios.get(
      `http://localhost:3000/chat/showGroup/${groupId}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log(responseData);
    showChat(responseData.data.responseData);
  } catch (error) {
    console.log(error);
  }
}

function showChat(msg) {
  const chatContainer = document.querySelector(".chatContainer");
  while (chatContainer.firstChild) {
    chatContainer.removeChild(chatContainer.firstChild);
  }
  msg.map((userMsg) => {
    const para = document.createElement("p");
    para.innerText = `${userMsg.userId}: ${userMsg.message}`;
    const chatContainer = document.querySelector(".chatContainer");
    chatContainer.append(para);
  });
}

async function fetchingUserDetails() {
  try {
    const token = localStorage.getItem("token");
    // console.log(token);
    const responseData = await axios.get(
      "http://localhost:3000/user/userDetails",
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
  document.querySelector(".userDetailName").innerText = userDetails.name;
  document.querySelector(".userDetailEmail").innerText = userDetails.email;
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await fetchingAllMessage();
    await fetchingAllGroup();
    await fetchingUserDetails();
  } catch (error) {
    console.log(error);
  }
});

async function fetchingAllGroup() {
  try {
    const token = localStorage.getItem("token");
    const responseData = await axios.get(
      "http://localhost:3000/chat/showGroup",
      {
        headers: {
          Authorization: token,
        },
      }
    );
    console.log("dkjs", responseData);
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
  }
}

document
  .getElementById("create-group")
  .addEventListener("click", async (event) => {
    try {
      const groupName = document.getElementById("groupName").value;
      const groupObj = {
        groupName: groupName,
      };
      console.log(groupName);
      const token = localStorage.getItem("token");
      const responseData = await axios.post(
        "http://localhost:3000/chat/createGroup",
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
      console.log(error);
    }
  });

async function addUserHandler(event) {
  try {
    event.preventDefault();
    console.log("sdkjnkl");
    const addUserData = {
      memberEmail: event.target.addUser.value,
    };
    console.log(JSON.stringify(addUserData));
    const token = localStorage.getItem("token");
    console.log("sad", groupId);
    const responseData = await axios.post(
      `http://localhost:3000/chat/showGroup/addUserToGroup?groupId=${groupId}`,
      JSON.stringify(addUserData),
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(responseData);
  } catch (error) {
    console.log(error);
  }
}

document.getElementById("groupInfo").addEventListener("click", async () => {
  try {
    console.log("aagya");
    const token = localStorage.getItem("token");
    console.log("aagya");
    console.log(groupId);
    const responseData = await axios.get(
      `http://localhost:3000/chat/showGroup/group-info/diff?groupId=${groupId}`,
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
});

function showGroupInfo(groupInfo) {
  const groupNameHeader = document.getElementById("groupNameHeader");
  const groupMemberCount = document.getElementById("groupMemberCount");
  const groupMemberCount1 = document.getElementById("groupMemberCount1");
  const groupCreatedAt = document.getElementById("groupCreatedAt");
  groupNameHeader.innerText = groupInfo.groupName;
  groupMemberCount.innerText = `${groupInfo.groupMemberCount} members`;
  groupMemberCount1.innerText = `${groupInfo.groupMemberCount} MEMBERS`;
  groupCreatedAt.innerText =groupInfo.groupCreatedAt.split("T")[0];
  const groupMemberDetails = document.getElementById("group-member-details");

  while (groupMemberDetails.firstChild) {
    groupMemberDetails.removeChild(groupMemberDetails.firstChild);
  }

  groupInfo.groupMember.map((member) => {
    const memberDiv = document.createElement("div");
    const memberH2 = document.createElement("h2");
    const memberP = document.createElement("p");
    memberDiv.classList.add("all-member")
    memberH2.innerText = member.name;
    memberP.innerText = member.email;
    memberDiv.append(memberH2);
    memberDiv.append(memberP);
    groupMemberDetails.append(memberDiv);
  });
}

//dumped zone

// const allMesssage = JSON.parse(localStorage.getItem("message"));
// allMesssage.push({
//   userId: responseData.data.userId,
//   message: responseData.data.message,
// });
// localStorage.setItem("message", JSON.stringify(allMesssage));

// setInterval(async() => {
//   await fetchingAllMessage();
// }, 1000);

// else {
//   const token = localStorage.getItem("token");
//   const responseData = await axios.get(
//     "http://localhost:3000/chat/getChat",
//     {
//       headers: {
//         Authorization: token,
//       },
//     }
//   );
//   console.log(responseData);
//   localStorage.setItem("message", JSON.stringify(responseData.data.result));
//   await fetchingAllMessage();
//   console.log("sdkj");
// }
