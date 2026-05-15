const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const router = express.Router();

// Strong password validation
const passwordRegex =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-\\[\]\\/]).{8,}$/;

// Member Routes
// GET /api/users/me  "Get my own profile"
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });

    let userData = user.toObject();

    if (user.needsExpiryToast) {
      userData.expiryMessage =
        "Your plan has expired and was automatically cancelled.";

      // Reset the flag
      user.needsExpiryToast = false;
      await user.save();
    }

    res.json(userData);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// PUT /api/users/me  "Update my own profile"
router.put("/me", auth, async (req, res) => {
  try {
    const { fullName, phone, password } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (fullName) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (password) {
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters and include at least one uppercase letter, one number, and one special character",
        });
      }
      const saltRounds = Number(process.env.BCRYPT_SALT) || 10;
      user.passwordHash = await bcrypt.hash(password, saltRounds);
    }

    await user.save();

    res.json({
      message: "Profile updated",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin Routes
// GET /api/users  "Get all users"
router.get("/", auth, admin, async (req, res) => {
  try {
    const { search } = req.query;
    const filter = search
      ? {
          $or: [
            { fullName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};
    const users = await User.find(filter)
      .select("-passwordHash")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/:id  "Get single user"
router.get("/:id", auth, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/users  "Create user"
router.post("/", auth, admin, async (req, res) => {
  try {
    const { fullName, email, phone, password, role, status } = req.body;

    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Full name, email and password are required" });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include at least one uppercase letter, one number, and one special character",
      });
    }

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already in use" });

    const saltRounds = Number(process.env.BCRYPT_SALT) || 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      fullName,
      email,
      passwordHash,
      phone,
      role: role || "member",
      status: status || "active",
    });

    res.status(201).json({
      message: "User created",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/:id  "Edit user"
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const { fullName, phone, role, status, password } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (fullName) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;
    if (role) user.role = role;
    if (status) user.status = status;

    if (password) {
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters and include at least one uppercase letter, one number, and one special character",
        });
      }
      const saltRounds = Number(process.env.BCRYPT_SALT) || 10;
      user.passwordHash = await bcrypt.hash(password, saltRounds);
    }

    await user.save();
    res.json({ message: "User updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/users/:id  "Delete user"
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    // Prevent deleting your own account
    if (req.params.id === req.user.id) {
      return res
        .status(400)
        .json({ message: "Cannot delete your own account" });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
