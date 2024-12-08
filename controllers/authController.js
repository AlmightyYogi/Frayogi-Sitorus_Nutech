const bcrypt = require('bcryptjs');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const path = require('path');
const fs = require('fs');

const register = async (req, res) => {
  const { email, first_name, last_name, password } = req.body;
  try {
    const [data] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (data.length) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query("INSERT INTO users (email, first_name, last_name, password) VALUES (?, ?, ?, ?)", [email, first_name, last_name, hashedPassword]);
    return res.status(201).json({
      status: 0,
      message: "Registrasi berhasil silahkan login",
      data: result
    })
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({
      status: 102,
      message: 'Parameter email tidak sesuai format',
      data: null
    });
  }

  if (!password || password.length < 8) {
    return res.status(400).json({
      status: 103,
      message: 'Username atau password salah',
      data: null
    });
  }

  User.findByEmail(email, (err, user) => {
    if (err) {
      console.error('Error finding user:', err);
      return res.status(500).json({
        status: 500,
        message: 'Internal server error',
        data: null
      });
    }

    if (!user) {
      return res.status(401).json({
        status: 103,
        message: 'Username atau password salah',
        data: null
      });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({
          status: 500,
          message: 'Internal server error',
          data: null
        });
      }

      if (!isMatch) {
        return res.status(401).json({
          status: 103,
          message: 'Username atau password salah',
          data: null
        });
      }

      const token = jwt.sign({ email: user.email, id: user.id }, process.env.JWT_SECRET, { expiresIn: '12h' });

      return res.status(200).json({
        status: 0,
        message: 'Login Sukses',
        data: {
          token: token
        }
      });
    });
  });
};

const getProfile = (req, res) => {
  User.findById(req.user.id, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        status: 108,
        message: 'Token tidak valid atau pengguna tidak ditemukan',
        data: null
      });
    }

    return res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_image: user.profile_image || ''
      }
    });
  });
};

const updateProfile = (req, res) => {
  const { first_name, last_name } = req.body;

  if (!first_name || !last_name) {
    return res.status(400).json({
      status: 102,
      message: 'Parameter tidak lengkap',
      data: null
    });
  }

  User.updateProfile(req.user.id, first_name, last_name, (err, result) => {
    if (err) return res.status(500).json({ status: 500, message: 'Gagal update profile', data: null });

    return res.status(200).json({
      status: 0,
      message: 'Update Profile berhasil',
      data: {
        email: req.user.email,
        first_name: first_name,
        last_name: last_name,
        profile_image: req.user.profile_image
      }
    });
  });
};

const updateProfileImage = (req, res) => {
    if (!req.file || !['image/jpeg', 'image/png'].includes(req.file.mimetype)) {
      return res.status(400).json({
        status: 102,
        message: 'Format Image tidak sesuai',
        data: null
      });
    }
  
    // Get the original file name and extension
    const originalName = req.file.originalname;
    const fileExtension = path.extname(originalName);
    const baseName = path.basename(originalName, fileExtension); // Get base name without extension
  
    // Path to store the file
    const uploadDir = path.join(__dirname, '../uploads');
    let newFilePath = path.join(uploadDir, originalName); // Keep the original name
  
    // Check if a file with the same name exists, if so, rename it
    if (fs.existsSync(newFilePath)) {
      const timestamp = Date.now();
      const newFileName = `${baseName}${fileExtension}`;
      newFilePath = path.join(uploadDir, newFileName);
    }
  
    // Move the file to the new path with the desired name
    fs.rename(req.file.path, newFilePath, (err) => {
      if (err) {
        return res.status(500).json({ status: 500, message: 'Failed to move the file', data: null });
      }
  
      // Construct the URL to access the file
      const profileImageUrl = `${req.protocol}://${req.get('host')}/uploads/${path.basename(newFilePath)}`;
  
      User.updateProfileImage(req.user.id, profileImageUrl, (err, result) => {
        if (err) return res.status(500).json({ status: 500, message: 'Gagal update profile image', data: null });
  
        return res.status(200).json({
          status: 0,
          message: 'Update Profile Image berhasil',
          data: {
            email: req.user.email,
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            profile_image: profileImageUrl
          }
        });
      });
    });
  };

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  updateProfileImage
};
