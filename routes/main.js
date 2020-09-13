module.exports = (app) => {
  app.use("/api/v1/user", require("./user"));
  app.use("/api/v1/order", require("./order"));
  app.use("/api/v1/item", require("./item"));
};
