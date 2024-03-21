async function loginFormHandler(event) {
  try {
    event.preventDefault();
    console.log("sdkj");
    let formValidation = true;
    const loginFormData = {
      email: event.target.email.value,
      password: event.target.password.value,
    };
    formValidation = loginValidationHandler(loginFormData);
    console.log(".....");

    if (formValidation) {
      const responseData = await axios.post(
        "http://3.7.252.73:3000/user/login",
        JSON.stringify(loginFormData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (responseData.status === 200) {
        console.log(responseData);
        const msg = responseData.data.reponseMessage;
        localStorage.setItem("token", responseData.data.token);
        alert(msg);
        window.location.href = "../Homepage/homepage.html";
      }
    }
  } catch (error) {
    if (error.response.status === 404) {
      alert(error.response.data.reponseMessage);
    } else if (error.response.status === 500) {
      alert(error.response.data.reponseMessage);
    } else {
      console.log(error);
    }
  }
}

function loginValidationHandler({ email, password }) {
  if (!email) {
    document.getElementById("formError1").innerText = "-required";
  } else {
    document.getElementById("formError1").innerText = "*";
  }
  if (!password) {
    document.getElementById("formError2").innerText = "-required";
  } else {
    document.getElementById("formError2").innerText = "*";
  }
  if (!email || !password) {
    return false;
  } else {
    return true;
  }
}
