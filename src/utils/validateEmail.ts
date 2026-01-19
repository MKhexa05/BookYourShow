export const validateEmail = (email:string) => {
  const regex = /^[^\s@]+@[^\s@]+$/;

  return regex.test(email);
};


