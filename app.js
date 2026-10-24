require("dotenv").config();
const express = require('express');
const app = express();

app.use(express.json());

let todos = [
    {id: 1, task: 'Learn Node.js', completed: false},
    {id: 2, task: 'Build CRUD API', completed: false},
];

// ALL CRUD ROUTES
// 1. READ ALL
app.get('/todos', (req, res) => {
    res.status(200).json(todos);
});

// BONUS TASK: GET /todos/active 
app.get('/todos/active', (req, res) => {
    const activeTodos = todos.filter(t => !t.completed); // !completed = false
    res.status(200).json(activeTodos);
});

// NEW TASK: GET /todos/:id - Single read
app.get('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);
    if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json(todo);
});

// 2. CREATE with VALIDATION TASK
app.post('/todos', (req, res) => {
    // VALIDATION: POST requires "task" field
    if (!req.body.task) {
        return res.status(400).json({ message: "Task field is required" });
    }

    const newTodo = { 
        id: todos.length + 1, 
        completed: false, // default false
        ...req.body 
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// 3. UPDATE PATCH
app.patch('/todos/:id', (req, res) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (!todo) return res.status(404).json({ message: "Todo not found"});
    Object.assign(todo, req.body);
    res.status(200).json(todo);
});

// 4. DELETE
app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = todos.length;
    todos = todos.filter((t) => t.id !== id);
    if (todos.length === initialLength) 
        return res.status(404).json({error: "Not found"});
    res.status(204).send();
});

// Error handler
app.use((err, req, res, next) => {
    res.status(500).json({error: 'Server error!' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>{
    console.log(`APP is listening on Port ${PORT}`);
});
