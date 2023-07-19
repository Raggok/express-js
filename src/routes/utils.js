export const tryCatchWrapper = (fun) => {
  return async (req, res, next) => {
    try {
      await fun(req, res, next);
    } catch (e) {
      next(e);
    }
  };
};
