const router = require("express").Router();
const usersController = require("../controllers/usersController");

//ROUTES GO HERE

router.get("/signup", usersController.getSignUpPage);
router.post(
  "/create",
  usersController.validate,
  usersController.create,
  usersController.redirectView
);
router.get("/login", usersController.getLoginPage);
router.post(
  "/login",
  usersController.authenticate,
  usersController.redirectView
);
router.get("/logout", usersController.logout, usersController.redirectView);
router.delete(
  "/notifications/:id/:story/delete",
  usersController.dismiss,
  usersController.redirectView
);
router.get("/:id/notifications", usersController.getNotificationsPage);
//Messages related routes
router.get(
  "/:from/:to/messages",
  /*userController.filterMessages,*/
  usersController.getMessagesPage
);
router.get(
  "/:id/connections",
  usersController.filterUsers,
  usersController.showConnectios
);
router.get("/:id/edit", usersController.edit);
router.get("/:id/change", usersController.change);
router.put(
  "/:id/change",
  usersController.validatePasswordChange,
  usersController.changePassword,
  usersController.redirectView
);
router.put(
  "/:id/update",
  usersController.validateUpdate,
  usersController.update,
  usersController.redirectView
);
router.get("/:id", usersController.show, usersController.showView);
router.delete(
  "/:id/delete",
  usersController.delete,
  usersController.redirectView
);

module.exports = router;
