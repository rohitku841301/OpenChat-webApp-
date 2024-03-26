async function loginFormHandler(event) {
  try {
    event.preventDefault();
    let formValidation = true;     
    const loginFormData = {
      email: event.target.email.value,
      password: event.target.password.value,
    };
    formValidation = loginValidationHandler(loginFormData);
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
        const msg = responseData.data.responseMessage;
        localStorage.setItem("token", responseData.data.token);
        alert(msg);
        window.location.href = "../Homepage/homepage.html";
      }
    }
  } catch (error) {
    console.log(error);
    if (error.response.status === 401) {
      alert(error.response.data.responseMessage);
    }else if(error.response.status=== 404) {
      alert(error.response.data.responseMessage);
    }
    else if (error.response.status === 500) {
      alert(error.response.data.responseMessage);
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
