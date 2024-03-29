exports.getPagination = (page, size) => {
  const limit = size ? +size : 24;
  const offset = page ? (page - 1) * limit : 0;

  return { limit, offset };
};
