//./validation.js
// verifier si la description est valide
export const isTitleValid = (title) =>
 title && typeof title === "string" && title.length >= 5 && title.length <= 20;

export const isDescriptionValid = (description) =>
 description &&
 typeof description === "string" &&
 description.length >= 5 &&
 description.length <= 50;
