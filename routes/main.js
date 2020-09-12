module.exports = (app) => {
  app.use("/api/v1/user", require("./user"));
};
