let { Task } = require('../tasks'); //  Task object holding all tasks...like DB
let task_object; // Task object from request received
let task_source; // Source where actions on a particular task will be taken on 
let counter; // Counter for setting status condition flag
let task_id; // Task id for editing or deleting
let status; //  Set operation state to either true or false
let status_message; //  Set message for each action
const view_object = { //    View object for transporting data to HTML views
    tasks: Task,
    meta: {
        title: 'Todo App',
        name: 'index'
    }
};

// POST: Creates a new task
exports.create = (req, res) => {    
    // Task object from receieved from request
    task_object = {
        title: req.body.title,
        content: req.body.content
    };
    // Check Task object if receieved task object already exist
    Task.pending.forEach(object => {
        // If task does not exist
        if (object.title !== task_object.title && object.content !== task_object.content) {
            // Set counter to false
            counter = 0;
            // Set status and status message
            status = true;
            status_message = 'Task successfully created!'
        } else { // If task already exist
            // Set counter to true
            counter = 1;
            // Set status and status message
            status = false;
            status_message = 'Task already exist!'
        }        
    });
    // If no entry    
    if (!counter) {
        // Create task
        Task.pending.unshift(task_object);
    }
    // Return corresponding status and status message to frontend
    res.json({status: status, status_message: status_message});
};

// GET: Index page
exports.index = (req, res) => {
    // Render index view with view object
    res.status(200).render('index', view_object);    
};

// POST: Draft a task
exports.draft = (req, res) => {
    // Get task id from request object
    task_id = req.params.task_id;    
    // Task source
    task_source = req.params.task_source;
    // Task object fetched from receieved from Task DB object using target source
    task_object = Task[task_source][task_id];
    // Set status and status message
    status = true;
    status_message = 'Task successfully saved to draft!';
    // Return draft object without drafted task
    Task[task_source] = Task[task_source].filter(task => {
        return(task.title !== task_object.title && task.content !== task_object.content);
    });
    // Add drafted task to draft object
    Task.draft.unshift(task_object);
    // Return corresponding status and status message to frontend
    res.json({status: status, status_message: status_message});
};

// POST: Complete a task
exports.complete = (req, res) => {
    // Get task id from request object
    task_id = req.params.task_id;    
    // Task source
    task_source = req.params.task_source;
    // Task object fetched from receieved from Task DB object using target source
    task_object = Task[task_source][task_id];
    // Set status and status message
    status = true;
    status_message = 'Task successfully set as completed!';
    // Return task source object without completed task
    Task[task_source] = Task[task_source].filter(task => {
        return(task.title !== task_object.title && task.content !== task_object.content);
    });
    // Add completed task to completed object
    Task.completed.unshift(task_object);
    // Return corresponding status and status message to frontend
    res.json({status: status, status_message: status_message});
};

// POST: Pending a task
exports.pending = (req, res) => {
    // Get task id from request object
    task_id = req.params.task_id;    
    // Task source
    task_source = req.params.task_source;
    // Task object fetched from receieved from Task DB object using target source
    task_object = Task[task_source][task_id];
    // Set status and status message
    status = true;
    status_message = 'Task successfully set as pending!';
    // Return task source object without pending task
    Task[task_source] = Task[task_source].filter(task => {
        return(task.title !== task_object.title && task.content !== task_object.content);
    });
    // Add pending task to pending object
    Task.pending.unshift(task_object);
    // Return corresponding status and status message to frontend
    res.json({status: status, status_message: status_message});
};

// POST: Delete a task
exports.delete = (req, res) => {
    // Get task id from request object
    task_id = req.params.task_id;    
    // Task object fetched from receieved from Task DB object using target source
    task_object = Task.pending[task_id];
    // Set status and status message
    status = true;
    status_message = 'Task successfully deleted!';
    // Return archive object without deleted task
    Task.pending = Task.pending.filter(task => {
        return(task.title !== task_object.title && task.content !== task_object.content);
    });
    // Add deleted task to archived object
    Task.archived.unshift(task_object);
    // Return corresponding status and status message to frontend
    res.json({status: status, status_message: status_message});
};

// POST: Edit task
exports.update = (req, res) => {
    // Get task id from request object
    task_id = req.params.task_id;
    // Task object from receieved from request
    task_object = {
        title: req.body.title,
        content: req.body.content
    };    
    // If task has been edited
    if (Task.pending[task_id].title !== task_object.title || Task.pending[task_id].content !== task_object.content) {
        // Save edited task
        Task.pending.splice(task_id, 1, task_object);        
        // Set status and status message
        status = true;
        status_message = 'Task successfully edited!'        
    } else { // If task has not been edited
        // Set status and status message
        status = false;
        status_message = 'Task not edited!'
    }
    // Return corresponding status and status message to frontend
    res.json({status: status, status_message: status_message});
};