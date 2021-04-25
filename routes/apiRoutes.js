const router = require("express").Router();
const usersController = require("../controllers/usersController");

/*router.get(
  "/users",
  usersController.index,
  usersController.filterUsers,
  usersController.respondJSON
);*/
router.get(
  "/users/:id/follow",
  usersController.filterUsers,
  usersController.follow,
  usersController.respondJSON
);
router.get(
  "/users/:id/unfollow",
  usersController.filterUsers,
  usersController.unfollow,
  usersController.respondJSON
);
router.use(usersController.errorJSON);

module.exports = router;
