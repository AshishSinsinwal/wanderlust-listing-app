// ==============================
// Utility: Wrap Async Errors
// ==============================
// Automatically catches async errors in route handlers and passes them to next()
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
