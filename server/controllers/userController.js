import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        message: "Email is not registered",
        success: false,
      });
    }

    const checkPass = await bcrypt.compare(password, user.password);
    if (!checkPass) {
      return res.json({
        message: "Invalid Password",
        success: false,
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login Successful",
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    return res.json({
      message: error.message,
      success: false,
    });
  }
};


export const userRegister = async (req, res) => {
    const { email, password, username } = req.body;
    try {
        if (!email && !password && !username) {
            return res.json({
                message: "All fields"
            })
        }

        // console.log(req.body)

        let isExist = await User.findOne({ email });
        if (isExist) {
            return res.json({
                message: "Email allready Registered..",
                success: false
            })
        }

        let hashPass = await bcrypt.hash(password, 10);

        let user = new User({
            email,
            password: hashPass,
            username
        })

        await user.save()

        return res.json({
            message: "user Registered successfully",
            success: true
        })
    } catch (error) {
        console.log(error.message);
        return res.json({
            message: error.message,
            success: false
        })
    }
}