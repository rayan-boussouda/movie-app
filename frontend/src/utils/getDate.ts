export const getDate = (date: string, format: string) => {
  if (format === "year") {
    return new Date(date).getFullYear();
  }
  if (format === "fr-FR") {
    return new Date(date).toLocaleDateString("fr-FR");
  }
  if (format === "en-US") {
    return new Date(date).toLocaleDateString("en-US");
  }
  return date;
};
