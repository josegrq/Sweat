const router = require("express").Router();
const storyController = require("../controllers/storyController");
const tagsController = require("../controllers/tagController");
var multer = require("multer");

//Set up Multer for Storage of posts
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
var upload = multer({ storage: storage });

//User stories
//router.get("/stories/showFeed", storyController.index, storyController.indexView);
router.get("/:id/story", storyController.new);
router.post(
  "/story/create",
  upload.single("image"),
  storyController.create,
  storyController.extractTags,
  storyController.redirectView
);
router.get("/", storyController.index, storyController.indexView);
router.get("/:id/show", storyController.show, storyController.showView);
router.get("/:id/showFeed", storyController.index, storyController.indexView);

//Story updates
router.get("/:id/edit", storyController.edit);
router.put(
  "/:id/update",
  //storyController.validateUpdate,
  storyController.update,
  storyController.extractTags,
  storyController.redirectView
);
//Story delete
router.delete(
  "/:id/delete",
  storyController.delete,
  storyController.redirectView
);

module.exports = router;
