<<<<<<< HEAD
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
=======
// validation.js
// Vérifier si le titre et la description sont valides

export const isTitleValid = (title) => {
  if (typeof title !== "string") return false;
  const trimmedTitle = title.trim();
  return trimmedTitle.length >= 5 && trimmedTitle.length <= 20;
};

export const isDescriptionValid = (description) => {
  if (typeof description !== "string") return false;
  const trimmedDescription = description.trim();
  return trimmedDescription.length >= 5 && trimmedDescription.length <= 50;
};

>>>>>>> b0cf12c441c23ca4225e25c7d94d8d0d81bf833d
