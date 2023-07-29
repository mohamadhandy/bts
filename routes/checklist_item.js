const express = require('express');
const pool = require('../db');
const router = express.Router();
const verifyToken = require('../middleware/auth');

// get all checklist item by checklist id
router.get('/:checklistId/item', verifyToken, async (req, res) => {
  const { checklistId } = req.params;
  const user_id = req.authData.userId;

  try {
    // check checklist id and userid
    const checklist = await pool.query('SELECT * FROM checklists WHERE id = $1 AND user_id = $2', [checklistId, user_id]);
    if (checklist.rows.length === 0) {
      return res.status(404).json({ message: 'Checklist not found or unauthorized' });
    }

    // get all checklist item if not err
    const checklistItems = await pool.query('SELECT * FROM checklist_items WHERE checklist_id = $1', [checklistId]);
    res.status(200).json({ message: 'Success', data: checklistItems.rows });
  } catch (error) {
    console.error('Error during fetching checklist items:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// create checklist item by checklist id
router.post('/:checklistId/item', verifyToken, async (req, res) => {
  const { checklistId } = req.params;
  const { itemName } = req.body;
  const user_id = req.authData.userId;

  try {
    // check user and checklist id
    const checklist = await pool.query('SELECT * FROM checklists WHERE id = $1 AND user_id = $2', [checklistId, user_id]);
    if (checklist.rows.length === 0) {
      return res.status(404).json({ message: 'Checklist not found or unauthorized' });
    }

    // insert checklist item if not err
    const newItem = await pool.query(
      'INSERT INTO checklist_items (item_name, checklist_id) VALUES ($1, $2) RETURNING *',
      [itemName, checklistId]
    );

    res.status(201).json({ message: 'Checklist item created successfully', data: newItem.rows[0] });
  } catch (error) {
    console.error('Error during checklist item creation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// get checklist item by id checklist item by checklist id
router.get('/:checklistId/item/:itemId', verifyToken, async (req, res) => {
  const { checklistId, itemId } = req.params;

  try {
    const checklistItem = await pool.query('SELECT * FROM checklist_items WHERE id = $1 AND checklist_id = $2', [itemId, checklistId]);
    if (checklistItem.rows.length === 0) {
      return res.status(404).json({ message: 'Checklist item not found or unauthorized' });
    }

    res.status(200).json({ message: 'Success', data: checklistItem.rows[0] });
  } catch (error) {
    console.error('Error during fetching checklist item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// delete checklist item by id
// API endpoint "delete checklist item"
router.delete('/:checklistId/item/:itemId', verifyToken, async (req, res) => {
  const { itemId, checklistId } = req.params;

  try {
    const checklistItem = await pool.query('SELECT * FROM checklist_items WHERE id = $1 AND checklist_id = $2', [itemId, checklistId]);
    if (checklistItem.rows.length === 0) {
      return res.status(404).json({ message: 'Checklist item not found or unauthorized' });
    }

    // remove checklist item by checklist id
    await pool.query('DELETE FROM checklist_items WHERE id = $1', [itemId]);
    res.status(200).json({ message: 'Checklist item deleted successfully' });
  } catch (error) {
    console.error('Error during checklist item deletion:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// rename itemName
router.put('/:checklistId/item/rename/:itemId', verifyToken, async (req, res) => {
  const { itemId, checklistId } = req.params;
  const { itemName } = req.body;

  try {
    const checklistItem = await pool.query('SELECT * FROM checklist_items WHERE id = $1 AND checklist_id = $2', [itemId, checklistId]);
    if (checklistItem.rows.length === 0) {
      return res.status(404).json({ message: 'Checklist item not found or unauthorized' });
    }

    // Update itemName
    const updatedItem = await pool.query(
      'UPDATE checklist_items SET item_name = $1 WHERE id = $2 RETURNING *',
      [itemName, itemId]
    );

    res.status(200).json({ message: 'Checklist item updated successfully', data: updatedItem.rows[0] });
  } catch (error) {
    console.error('Error during updating checklist item:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// update status
router.put('/:checklistId/item/:itemId', verifyToken, async (req, res) => {
  const { itemId, checklistId } = req.params;

  try {
    const checklistItem = await pool.query('SELECT * FROM checklist_items WHERE id = $1 AND checklist_id = $2', [itemId, checklistId]);
    if (checklistItem.rows.length === 0) {
      return res.status(404).json({ message: 'Checklist item not found or unauthorized' });
    }

    // Update status to true
    await pool.query('UPDATE checklist_items SET status = true WHERE id = $1', [itemId]);
    res.status(200).json({ message: 'Checklist item status updated to true' });
  } catch (error) {
    console.error('Error during updating checklist item status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
