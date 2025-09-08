const userModel = require("../models/userModel.js");
const cloudinary = require("../config/cloudinary.js");
const mongoose = require("mongoose");
const fs = require("fs");

const getTotalUsers = async (req, res) => {
  try {
    const totalUser = await userModel.find().countDocuments();
    const getUserRoles = await userModel.aggregate([
      {
        $match: { role: { $ne: "admin" } },
      },
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    const getUserHoursSpent = await userModel
      .find()
      .sort({ hoursSpent: -1 })
      .limit(6)
      .select("name hoursSpent");

    res
      .status(200)
      .send({ totalUser, getUserRoles, success: true, getUserHoursSpent });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const getAllUsersData = async (req, res) => {
  try {
    const allUsers = await userModel.find();
    res.status(200).send({ allUsers, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    );

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const uploadDocuments = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const image = req.file;

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let imageUrl;
    if (image) {
      const result = await cloudinary.uploader.upload(image.path, {
        folder: "user_documents",
      });
      imageUrl = result.secure_url;
    }

    user.documents.push({ title, image: imageUrl });

    await user.save();

    return res
      .status(200)
      .json({ message: "Document uploaded successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateUserStep = async (req, res) => {
  try {
    const { userId } = req.params;
    const { stepNumber, completed } = req.body;

    if (!stepNumber || typeof completed !== "boolean") {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const progressIndex = user.progress.findIndex(
      (step) => step.stepNumber === stepNumber
    );
    if (progressIndex === -1) {
      return res.status(400).json({ message: "Invalid step number" });
    }

    user.progress[progressIndex].completed = completed;
    await user.save();

    res.status(200).json({
      message: "Progress updated successfully",
      progress: user.progress,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user, message: 'User Found' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await userModel.find({ role: "student" });
    res.status(200).json({ students });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getCounsellors = async (req, res) => {
  try {
    const counsellors = await userModel.find({ role: "counsellor" });
    res.status(200).json({ success: true, message: 'Counsellors found', counsellors });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteCounsellor = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getStudentsOfParticularCounsellor = async (req, res) => {
  const { id } = req.params;

  try {
    const counsellor = await userModel.findById(id).populate("students");

    if (!counsellor) {
      return res.status(404).json({ success: false, message: "Counsellor not found" });
    }

    return res.status(200).json({ success: true, students: counsellor.students, message: `Found ${counsellor.students.length} students` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteStudentOfParticularCounsellor = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const student = await userModel.findByIdAndDelete(id, { session });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const counsellorId = req.user.userId;

    const updateCounsellor = await userModel.findByIdAndUpdate(
      counsellorId,
      { $pull: { students: id } },
      { session }
    );

    if (!updateCounsellor) {
      // If the update fails, abort the transaction
      await session.abortTransaction();
      return res.status(500).json({
        success: false,
        message: "Failed to remove student form counsellor student list. Student deletion failed",
      });
    }

    // if everything every operation wrapped with session succeeds then complete those transactions
    await session.commitTransaction();

    return res.status(200).send({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    console.error(error);
    // Abort transaction in case of any error
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: "An error occurred during student deletion",
      error: error.message || error,
    });
  } finally {
    session.endSession();
  }
}

const updateCounsellorProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const profileImage = req.file;

    if (profileImage) {
      const result = await cloudinary.uploader.upload(profileImage.path, {
        folder: 'user_documents'
      })

      updatedData.profileImage = result.secure_url;

      fs.unlinkSync(profileImage.path);
    }

    const updatedUser = await userModel.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).send({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

const updateStudentProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const formData = req.body;

    // get all the text data first
    const updateData = {
      name: formData.name,
      email: formData.email,
      bio: formData.bio,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      country: formData.country,
    };

    const documents = [];
    // there are maximum three document fields as of now
    for (let i = 0; i < 3; i++) {
      const title = req.body.documents?.[i]?.title;
      const imageFile = req.files?.[`documents[${i}][image]`]?.[0];

      // upload document to cloudinary and save the uploaded file link in the array
      if (title && imageFile) {
        const result = await cloudinary.uploader.upload(imageFile.path, {
          folder: 'user_documents',
        });

        documents.push({
          title,
          image: result.secure_url,
        });

        // delete from the local folder after cloudinary upload
        fs.unlinkSync(imageFile.path);
      }

    }

    if (documents.length > 0) {
      updateData.documents = documents;
    }

    // do the same process like document upload to profileImage upload as well
    const profileImage = req.files?.profileImage?.[0];
    if (profileImage) {
      const result = await cloudinary.uploader.upload(profileImage.path, {
        folder: 'user_documents'
      })

      updateData.profileImage = result.secure_url;

      fs.unlinkSync(profileImage.path);
    }

    const updatedStudent = await userModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.json({ success: true, message: "Profile updated successfully", student: updatedStudent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateStudentProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;

    const student = await userModel.findById(id);

    student.progress = progress;

    const documentsStep = student.progress.find(step => step.stepName === 'Documents');

    // once the student submits all the documents and they are verified by the counsellor, mark the student as verified 
    if (!student.isVerified && documentsStep.status === 'COMPLETED') {
      student.isVerified = true
    }

    await student.save();

    res.status(200).json({ success: true, message: "Progress updated successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

module.exports = {
  getUser,
  getTotalUsers,
  getAllUsersData,
  updateUserRole,
  deleteCounsellor,
  uploadDocuments,
  updateUserStep,
  getStudents,
  getCounsellors,
  getStudentsOfParticularCounsellor,
  updateCounsellorProfile,
  deleteStudentOfParticularCounsellor,
  updateStudentProfile,
  updateStudentProgress
};
