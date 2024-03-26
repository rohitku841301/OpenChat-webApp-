async function signupFormHandler(event) {
    try {
      event.preventDefault();
      let formValidation = true;
      const signupFormData = {
        name: event.target.name.value,
        email: event.target.email.value,
        phone: event.target.phone.value,
        password: event.target.password.value,
      };
      formValidation = signupValidationHandler(signupFormData);
      if (formValidation) {
        const responseData = await axios.post(
          "http://3.7.252.73:3000/user/signup",
          JSON.stringify(signupFormData),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (responseData.status === 200) {
          const msg = responseData.data.responseMessage;
          alert(msg);
          window.location.href = "../Login/login.html"
        }
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 404) {
        alert(error.response.data.responseMessage);
      } else if (error.response.status === 500) {
        alert(error.response.data.responseMessage);
      } else {
        console.log(error);
      }
    }
  }
  
  function signupValidationHandler({ name, email, phone, password }) {
    if(!name){
      document.getElementById("formError1").innerText = "-required"
    }else{
      document.getElementById("formError1").innerText = "*"
    }
    if(!email){
      document.getElementById("formError2").innerText = "-required"
    }else{
      document.getElementById("formError2").innerText = "*"
    }
    if(!phone){
      document.getElementById("formError3").innerText = "-required"
    }else{
      document.getElementById("formError3").innerText = "*"
    }
    if(!password){
      document.getElementById("formError4").innerText = "-required"
    }else{
      document.getElementById("formError4").innerText = "*"
    }
    if (!name || !email || !phone || !password) {
      return false;
    } else {
      return true;
    }
  }
  