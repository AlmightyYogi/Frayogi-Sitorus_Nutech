const db = require('../config/db');

const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 3, offset = 0 } = req.query;

    const [result] = await db.query(
      `SELECT * FROM transactions WHERE user_id = ? ORDER BY created_on DESC LIMIT ?, ?`,
      [userId, parseInt(offset), parseInt(limit)]
    );

    res.status(200).json({
      status: 0,
      message: 'Get History Berhasil',
      data: {
        offset: parseInt(offset),
        limit: parseInt(limit),
        records: result
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 500,
      message: 'Internal server error',
      data: err.message
    });
  }
};

module.exports = { getHistory };
