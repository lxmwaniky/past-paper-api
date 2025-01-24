const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({ message: 'Navigate to /api/v1/papers' });
});

module.exports = router;
