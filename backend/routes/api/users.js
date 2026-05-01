const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const router = express.Router();

// ─── MEMBER ROUTES ───────────────────────────────────────────────

// GET /api/users/me — get own profile
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/users/me — update own profile
router.put("/me", auth, async (req, res) => {
  try {
    const { fullName, phone, password } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (fullName) user.fullName = fullName;
    if (phone !== undefined) user.phone = phone;

    // Allow password update
    if (password) {
      if (password.length < 8) {
        return res
          .status(400)
          .json({ message: "Password must be at least 8 characters" });
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

// ─── ADMIN ROUTES ────────────────────────────────────────────────

// GET /api/users — admin: get all users
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

// GET /api/users/:id — admin: get single user
router.get("/:id", auth, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/users — admin: create user
router.post("/", auth, admin, async (req, res) => {
  try {
    const { fullName, email, phone, password, role, status } = req.body;

    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Full name, email and password are required" });
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

// PUT /api/users/:id — admin: edit any user
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
      const saltRounds = Number(process.env.BCRYPT_SALT) || 10;
      user.passwordHash = await bcrypt.hash(password, saltRounds);
    }

    await user.save();
    res.json({ message: "User updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/users/:id — admin: delete user
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    // Prevent deleting own account
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
