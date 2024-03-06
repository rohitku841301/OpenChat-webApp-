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
        "http://localhost:3000/user/login",
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
        localStorage.setItem("token", responseData.data.token)
        alert(msg);
        window.location.href = "../Homepage/homepage.html"
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
  if (!email || !password) {
    return false;
  } else {
    return true;
  }
}
