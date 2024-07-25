import ErrorHandler from "../middleware/error.js";
import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import User from "../models/userSchema.js"
import { imageUploader } from "../utils/imageUploader.js"
import zod from "zod"
import { User } from "../models/userSchema.js";
import { generateToken } from "../utils/JwtToken.js"
import { loginSuccessEmail } from "../mail/templates/loginSuccessEmail.js"
import { emailSender } from "../utils/EmailSender.js"
import { use } from "bcrypt/promises.js";
const signUpdata = zod.object({
  fullName: zod.string().min(3).max(30),
  email: zod.string().email(),
  password: zod.string().min(6).max(20),
  phone: zod.string().min(10).max(10),
  aboutMe: zod.string().min(10).max(500),
  avatar: zod.string(),
  resume: zod.string(),
  githubURL: zod.string(),
  instagramURL: zod.string(),
  linkedlnURL: zod.string(),
  twitterURL: zod.string(),
})

const updateData = zod.object({
  fullName: zod.string().min(3).max(30),
  email: zod.string().email(),
  phone: zod.string().min(10).max(10),
  aboutMe: zod.string().min(10).max(500),
  avatar: zod.string(),
  resume: zod.string(),
  githubURL: zod.string(),
  instagramURL: zod.string(),
  linkedlnURL: zod.string(),
  twitterURL: zod.string(),
})

const logindata = zod.object({
  email: zod.string().email(),
  password: zod.string().min(6).max(20),
})

class UserController {

  static register = catchAsyncErrors(async (req, res, next) => {

    if (!req.files || Object.keys(req.files).length == 0) {
      return next(new ErrorHandler("Please upload a file", 400));
    }


    const { fullName, email, password, phone, aboutMe, githubURL, instagramURL, linkedlnURL, twitterURL } = signUpdata.parse(req.body);
    const avatar = req.files.avatar;
    const resume = req.files.resume;

    // all fields are required
    if (!fullName || !email || !password || !phone || !aboutMe || !githubURL || !instagramURL || !linkedlnURL || !twitterURL) {
      return next(new ErrorHandler("Please fill all the fields", 400));
    }
    // check if user already exists
    const user = await User.findOne({
      $or: [
        { fullName },
        { email }
      ]
    })

    if (user) return next(new ErrorHandler("User already exists", 400));

    const [avatarUpload, resumeUpload] = await Promise.all([
      imageUploader(avatar, process.env.FOLDER_NAME, 500, 'auto'),
      imageUploader(resume, process.env.FOLDER_NAME, 500, 'auto'),
    ]);

    const createUser = new User({
      fullName,
      email,
      password,
      phone,
      aboutMe,
      githubURL,
      instagramURL,
      linkedlnURL,
      twitterURL,
      avatar: avatarUpload.secure_url || user.avatar.secure_url,
      resume: resumeUpload.secure_url || user.resume.secure_url,
    });
    await createUser.save();

    generateToken(user, "User created successfully", 201, res);
    await emailSender(user.email, "Registered Successfully", loginSuccessEmail(user.fullName))

  })

  static login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = logindata.parse(req.body);
    if (!email || !password) {
      return next(new ErrorHandler("Please enter email and password", 400));
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ErrorHandler("Incorrect password", 400));
    }
    generateToken(user, "User logged in successfully", 200, res);
    await emailSender(user.email, "Logged In Successfully", loginSuccessEmail(user.fullName))

  })

  static updateProfile = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user.id;

    // Validate request body
    const { fullName, email, phone, aboutMe, githubURL, instagramURL, linkedlnURL, twitterURL } = updateData.parse(req.body);

    // Handle file uploads
    const avatarFile = req.files?.avatar;
    const resumeFile = req.files?.resume;

    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Upload new files and delete old ones if new files are provided
    const [avatarUpload, resumeUpload] = await Promise.all([
      avatarFile ? imageUploader(avatarFile, process.env.FOLDER_NAME, 500, 'auto', user.avatar.public_id) : user.avatar,
      resumeFile ? imageUploader(resumeFile, process.env.FOLDER_NAME, 600, 'auto', user.resume.public_id) : user.resume
    ]);

    // Update user profile
    const updatedProfile = await User.findByIdAndUpdate(userId, {
      fullName,
      email,
      phone,
      aboutMe,
      githubURL,
      instagramURL,
      linkedlnURL,
      twitterURL,
      avatar: avatarUpload.secure_url || user.avatar.secure_url,
      resume: resumeUpload.secure_url || user.resume.secure_url
    }, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedProfile
    });
  })

  static getUser = catchAsyncErrors(async (req, res, next) => {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    res.status(200).json({
      success: true,
      user
    })
  })

  static logout = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true
    })
    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    })

  })

  static updatePassword = catchAsyncErrors(async (req, res, next) => {
    const { curentPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");
    if (!curentPassword || !newPassword || !confirmPassword) {
      return next(new ErrorHandler("Please enter all fields", 400));
    }
    if (newPassword !== confirmPassword) {
      return next(new ErrorHandler("New password and confirm password do not match", 400));
    }
    const isPasswordMatch = await user.comparePassword(curentPassword);
    if (!isPasswordMatch) {
      return next(new ErrorHandler("Current password is incorrect", 400));
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });
  });

  static getUserForPortfolio = catchAsyncErrors(async (req, res, next) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    res.status(200).json({
      success: true,
      user
    })
  })

  static forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new ErrorHandler("Email not found", 404));
    }

    const resetToken = user.getresetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${process.env.DASHBOARD_URL}/reset-password/${resetToken}`;

    const message = `Your Reset Password Token is:- \n\n ${resetPasswordUrl}  \n\n If 
      You've not requested this email then, please ignore it.`;


    try {
      await sendEmail({
        email: user.email,
        subject: `Personal Portfolio Dashboard Password Recovery`,
        message,
      });
      res.status(201).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new ErrorHandler(error.message, 500));
    }

  })

  static resetPassword = catchAsyncErrors(async (req, res, next) => {

    const { token } = req.params;
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
  if(!user) {
    return next(new ErrorHandler("Invalid or expired token", 400));
  }

  if(req.body.password !== req.body.confirmPassword) {
  return next(new ErrorHandler("Password and confirm password do not match", 400));
}
user.password = req.body.password;
user.resetPasswordToken = undefined;
user.resetPasswordExpire = undefined;
await user.save();

generateToken(user, "Reset Password Successfully!", 200, res);
})
}

export default UserController;



