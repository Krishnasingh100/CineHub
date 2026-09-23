// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err);
  if (res.headersSent) return;
  res.status(500).json({ error: "Something went wrong. Please try again." });
}

function notFound(req, res) {
  res.status(404).json({ error: "Not found." });
}

module.exports = { errorHandler, notFound };
