const {
  authenticateUser,
  accessControl,
  rootAccess,
  userAccess,
} = require("../utils/middlewares");

module.exports = (app) => {
  app.use("/api/v1/user", require("./user"));
  app.use("/api/v1/order", authenticateUser, require("./order"));
  app.use(
    "/api/v1/item",
    authenticateUser,
    rootAccess,
    accessControl,
    require("./item")
  );
};
