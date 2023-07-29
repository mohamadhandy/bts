const express = require('express');
const pool = require('../db');
const router = express.Router();
const verifyToken = require('../middleware/auth');

// get all checklist endppoint
router.get('/', verifyToken, async (req, res) => {
  try {
    // get all checklist by user id
    const checklists = await pool.query('SELECT * FROM checklists WHERE user_id = $1', [req.authData.userId]);
    res.status(200).json({ message: 'Success', data: checklists.rows });
  } catch (error) {
    console.error('Error during fetching checklists:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// post request create checklist
router.post('/', verifyToken, async (req, res) => {
  const { name } = req.body;
  const user_id = req.authData.userId;

  try {
    const newChecklist = await pool.query(
      'INSERT INTO checklists (name, user_id) VALUES ($1, $2) RETURNING *',
      [name, user_id]
    );

    res.status(201).json({ message: 'Checklist created successfully', data: newChecklist.rows[0] });
  } catch (error) {
    console.error('Error during checklist creation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// delete checklist by id
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const user_id = req.authData.userId;

  try {
    // need to checklist and user id is the same
    const checklistToDelete = await pool.query('SELECT * FROM checklists WHERE id = $1 AND user_id = $2', [id, user_id]);
    if (checklistToDelete.rows.length === 0) {
      return res.status(404).json({ message: 'Checklist not found or unauthorized' });
    }

    // remove checklist if same
    await pool.query('DELETE FROM checklists WHERE id = $1', [id]);
    res.status(200).json({ message: 'Checklist deleted successfully' });
  } catch (error) {
    console.error('Error during checklist deletion:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
