// ./validation.js

// Vérifier si le titre est valide
export const isTitleValid = (title) =>
 title && typeof title === "string" && title.length >= 5 && title.length <= 20;

// Vérifier si la description est valide
export const isDescriptionValid = (description) =>
 description &&
 typeof description === "string" &&
 description.length >= 5 &&
 description.length <= 50;

// Vérifier si l'email est valide
export const isEmailValid = (email) => {
 // Expression régulière pour vérifier la validité de l'email
 const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
 return email && typeof email === "string" && emailRegex.test(email);
};

// verifier si le password est valide
export const isPasswordValid = (password) =>
 password &&
 typeof password === "string" &&
 password.length >= 8 &&
 password.length <= 16;
