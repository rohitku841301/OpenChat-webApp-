async function loginFormHandler(event) {
  try {
    event.preventDefault();
    let formValidation = true;

    const loginFormData = {
      name: event.target.name.value,
      email: event.target.email.value,
      phone: event.target.phone.value,
      password: event.target.password.value,
    };
    formValidation = loginValidationHandler(loginFormData);
    if (formValidation) {
      const responseData = await axios.post()
    }
  } catch (error) {}
}

function loginValidationHandler({ name, email, phone, password }) {
  if (!name || !email || !phone || !password) {
    return false;
  }else{
    return true;
  }
}
