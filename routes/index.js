var express = require('express');
var router = express.Router();
var taskController = require('../controllers/taskController');

/* POST: Add new task. */
router.post('/create/', taskController.create);

/* GET: Fetch all tasks. */
router.get('/', taskController.index);

/* POST: Edit specified task. */
router.post('/edit/:task_id', taskController.update);

/* POST: Draft specified task. */
router.post('/draft/:task_id/:task_source', taskController.draft);

/* POST: complete specified task. */
router.post('/complete/:task_id/:task_source', taskController.complete);

/* POST: Pend specified task. */
router.post('/pending/:task_id/:task_source', taskController.pending);

/* POST: Delete selected task. */
router.post('/delete/:task_id', taskController.delete);

module.exports = router;
