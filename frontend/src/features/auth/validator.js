// simple validation
export const loginValidate = (form) => {
  if (!form.email || !form.password) {
    return "All fields are required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    return "Enter a valid email";
  }

  if (form.password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return null;
};

export const registerValidate = (form) => {
  if (!form.name || !form.email || !form.password || !form.confirmPassword) {
    return "All fields are required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    return "Enter a valid email";
  }

  if (form.password.length < 6) {
    return "Password must be at least 6 characters";
  }

  if (form.password !== form.confirmPassword) {
    return "Passwords do not match";
  }

  return null;
};
