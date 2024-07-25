import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    Phone: {
        type: String,
        required: true
    },
    aboutMe: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true
    },
    resume: {
        type: String,
        required: true
    },
    githubURL: {
        type: String,
    },
    instragramURL: {
        type: String,
    },
    linkedlnURL: {
        type: String,
    },
    twitterURL: {
        type: String,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpire: {
        type: Date,
    }
})

export const User = mongoose.model("User", userSchema);


userSchema.pre('save', async (next) => {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.comparePassword = async (password) => {
    return bcrypt.compare(password, this.password)
}

userSchema.methods.generateJWT = async () => {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE })
}

userSchema.methods.getresetPasswordToken=()=> {

    // generate token
    const resetToken = crypto.randomBytes(20).toString("hex");
    console.log("Reset Token",resetToken);

    this.resetPasswordToken = crypto.createHash("sha256")
        .update(resetToken)
        .digest("hex");


    this.resetPasswordExpire=Date.now() + 15 * 60 * 1000;
    return resetToken;
}

