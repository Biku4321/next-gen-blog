const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-');
};

export default slugify;
