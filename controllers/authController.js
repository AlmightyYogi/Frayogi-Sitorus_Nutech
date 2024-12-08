const bcrypt = require('bcryptjs');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const register = async (req, res) => {
  const { email, first_name, last_name, password } = req.body;
  try {
    const [data] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (data.length) {
      return res.status(400).json({
        status: 102,
        message: "Email sudah ada",
        data: null
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (email, first_name, last_name, password) VALUES (?, ?, ?, ?)", [email, first_name, last_name, hashedPassword]);
    
    return res.status(201).json({
      status: 0,
      message: "Registrasi berhasil silahkan login",
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      status: 102,
      message: error.message,
      data: null
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({
        status: 102,
        message: 'Parameter email tidak sesuai format',
        data: null,
      });
    }

    if (!password || password.length < 8) {
      return res.status(400).json({
        status: 103,
        message: 'Username atau password salah',
        data: null,
      });
    }

    const [data] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (!data.length) {
      return res.status(401).json({
        status: 103,
        message: 'Username atau password salah',
        data: null,
      });
    }

    const user = data[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 103,
        message: 'Username atau password salah',
        data: null,
      });
    }

    const token = jwt.sign({ email: user.email, id: user.id }, process.env.JWT_SECRET, { expiresIn: '12h' });

    return res.status(200).json({
      status: 0,
      message: 'Login Sukses',
      data: {
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const [data] = await db.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
    if (!data.length) {
      return res.status(400).json({
        status: 108,
        message: 'Token tidak valid atau pengguna tidak ditemukan',
        data: null,
      });
    }

    const user = data[0];
    return res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_image: user.profile_image || '',
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  const { first_name, last_name } = req.body;

  try {
    if (!first_name || !last_name) {
      return res.status(400).json({
        status: 102,
        message: 'Parameter tidak lengkap',
        data: null,
      });
    }

    const [result] = await db.query("UPDATE users SET first_name = ?, last_name = ? WHERE id = ?", [first_name, last_name, req.user.id]);

    return res.status(200).json({
      status: 0,
      message: 'Update Profile berhasil',
      data: {
        email: req.user.email,
        first_name,
        last_name,
        profile_image: req.user.profile_image,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const updateProfileImage = async (req, res) => {
  try {
    if (!req.file || !['image/jpeg', 'image/png'].includes(req.file.mimetype)) {
      return res.status(400).json({
        status: 102,
        message: 'Format Image tidak sesuai',
        data: null,
      });
    }

    const originalName = req.file.originalname;
    const fileExtension = path.extname(originalName);
    const baseName = path.basename(originalName, fileExtension);
    const uploadDir = path.join(__dirname, '../uploads');
    let newFilePath = path.join(uploadDir, originalName);

    if (fs.existsSync(newFilePath)) {
      const timestamp = Date.now();
      const newFileName = `${baseName}_${timestamp}${fileExtension}`;
      newFilePath = path.join(uploadDir, newFileName);
    }

    fs.renameSync(req.file.path, newFilePath);

    const profileImageUrl = `${req.protocol}://${req.get('host')}/uploads/${path.basename(newFilePath)}`;

    const [result] = await db.query("UPDATE users SET profile_image = ? WHERE id = ?", [profileImageUrl, req.user.id]);

    return res.status(200).json({
      status: 0,
      message: 'Update Profile Image berhasil',
      data: {
        email: req.user.email,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        profile_image: profileImageUrl,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  updateProfileImage,
};