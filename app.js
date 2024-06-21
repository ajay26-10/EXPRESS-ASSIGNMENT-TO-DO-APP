const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const taskList = [];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/create', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'create.html'));
});

app.get('/submit', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'submit.html'));
});

app.get('/view/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'viewTask.html'));
});

app.get('/viewall', (req, res) => {
    res.send(taskList);
});

app.get('/api/create/:id', (req, res) => {
    const id = req.params.id;
    const task = taskList.find(task => task.taskID == id);
    if (!task) {
        return res.status(404).send("Task Not Found. Check Task ID.");
    }
    res.json(task);
});

app.post('/create', (req, res) => {
    const { taskID, taskName, taskDetail } = req.body;
    console.log(req.body);
    const newTask = { taskID, taskName, taskDetail };
    taskList.push(newTask);
    console.log(taskList);
    res.redirect('/submit');
});

app.put('/api/create/:id', (req, res) => {
    const id = req.params.id;
    const { taskName, taskDetail } = req.body;
    const taskIndex = taskList.findIndex(task => task.taskID == id);

    if (taskIndex === -1) {
        return res.status(404).send("Task Not Found. Check Task ID.");
    }

    if (taskName) taskList[taskIndex].taskName = taskName;
    if (taskDetail) taskList[taskIndex].taskDetail = taskDetail;
    res.json(taskList[taskIndex]);
});

app.delete('/api/delete/:id', (req, res) => {
    const id = req.params.id;
    const taskIndex = taskList.findIndex(task => task.taskID == id);

    if (taskIndex === -1) {
        return res.status(404).send("Task Not Found. Check Task ID.");
    }
    const deletedTask = taskList.splice(taskIndex, 1);
    res.json(deletedTask);
});

app.listen(PORT, () => {
    console.log(`Server running at PORT ${PORT}`);
});
