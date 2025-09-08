const express = require("express");
const {
  getUser,
  getTotalUsers,
  getAllUsersData,
  updateUserRole,
  deleteCounsellor,
  uploadDocuments,
  updateUserStep,
  getStudents,
  getCounsellors,
  updateCounsellorProfile,
  updateStudentProfile,
  getStudentsOfParticularCounsellor,
  deleteStudentOfParticularCounsellor,
  updateStudentProgress
} = require("../controllers/userController");
const router = express.Router();
const upload = require('../middleware/fileUpload');
const { authenticate } = require("../middleware/auth");

router
  .get("/get-total-users", getTotalUsers)
  .put("/updateuserrole/:id", updateUserRole)
  .put("/upload-documents/:id", upload.single("image"), uploadDocuments)
  .put("/update-user-step/:userId", updateUserStep)
  .get("/get-all-users", getAllUsersData)
  .get("/get-user/:id", getUser)
  .get("/get-students", getStudents)
  .get("/get-counsellors", getCounsellors)
  .delete("/delete-counsellor/:id", deleteCounsellor)
  .get("/getstudentsofparticularcounsellor/:id", getStudentsOfParticularCounsellor)
  .delete("/deletestudentofparticularcounsellor/:id", authenticate, deleteStudentOfParticularCounsellor)
  .put("/updatecounsellorprofile/:id", upload.single("profileImage"), updateCounsellorProfile)
  .put("/updatestudentprofile/:id",
    upload.fields([
      { name: "profileImage", maxCount: 1 },
      { name: "documents[0][image]" },
      { name: "documents[1][image]" },
      { name: "documents[2][image]" },
    ]),
    updateStudentProfile)
  .put("/updatestudentprogress/:id", updateStudentProgress)

module.exports = router;
