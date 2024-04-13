const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// In-memory data storage for users, teams, and quizzes
let users = {};
let teams = {};
let quizzes = {};

// Function to load data from a JSON file
function loadData() {
    try {
        const data = fs.readFileSync('data.json', 'utf8');
        const jsonData = JSON.parse(data);
        users = jsonData.users || {};
        teams = jsonData.teams || {};
        quizzes = jsonData.quizzes || {};
    } catch (err) {
        console.error('Error loading data:', err);
        users = {};
        teams = {};
        quizzes = {};
    }
}

// Function to save data to a JSON file
function saveData() {
    const data = {
        users: users,
        teams: teams,
        quizzes: quizzes
    };
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf8');
}

// Route to retrieve a user by ID
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    if (!users[id]) {
        return res.status(404).send('User not found.');
    }
    res.json(users[id]);
});

// Route to retrieve all users
app.get('/users', (req, res) => {
    loadData();
    res.json(Object.values(users));
});

// Route to create a new user
app.post('/users', (req, res) => {
    const { id, name, password, isTeamLeader = false } = req.body;
    if (users[id]) {
        return res.status(400).send('User already exists with the same ID.');
    }
    users[id] = { id, name, password, isTeamLeader };
    saveData();
    res.status(201).send('User created.');
});

// Route to delete a user
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    if (!users[id]) {
        return res.status(404).send('User not found.');
    }
    delete users[id];
    saveData();
    res.send('User deleted.');
});

// Route to create a team, checks if creator and users exist
app.post('/teams', (req, res) => {
    const { id, name, user_list, quiz_id, creator_id } = req.body;

    if (!users[creator_id]) {
        return res.status(404).send('Creator not found.');
    }

    if (teams[id]) {
        return res.status(400).send('Team already exists with the same ID.');
    }

    const allUsersExist = user_list.every(userId => users[userId]);
    if (!allUsersExist) {
        return res.status(400).send('One or more user IDs are invalid.');
    }

    if (quiz_id && !quizzes[quiz_id]) {
        return res.status(404).send('Quiz not found.');
    }

    teams[id] = { id, name, user_list, quiz_id, creator_id };
    saveData();
    res.status(201).send('Team created.');
});

// Route to retrieve all teams
app.get('/teams', (req, res) => {
    res.json(Object.values(teams));
});

// Route to delete a team
app.delete('/teams/:id', (req, res) => {
    const { id } = req.params;
    if (!teams[id]) {
        return res.status(404).send('Team not found.');
    }
    delete teams[id];
    saveData();
    res.send('Team deleted.');
});

// Route to create a quiz, checks if all referenced teams exist
app.post('/quiz', (req, res) => {
    const { id, title, description, date, team_list = [], location, theme } = req.body;

    if (quizzes[id]) {
        return res.status(400).send('Quiz already exists with the same ID.');
    }

    const allTeamsExist = team_list.every(teamId => teams[teamId]);
    if (!allTeamsExist) {
        return res.status(400).send('One or more team IDs are invalid.');
    }

    quizzes[id] = { id, title, description, date, team_list, location, theme };
    saveData();
    res.status(201).send('Quiz created.');
});

// Route to retrieve all quizzes
app.get('/quiz', (req, res) => {
    res.json(Object.values(quizzes));
});

// Route to delete a quiz
app.delete('/quiz/:id', (req, res) => {
    const { id } = req.params;
    if (!quizzes[id]) {
        return res.status(404).send('Quiz not found.');
    }
    delete quizzes[id];
    saveData();
    res.send('Quiz deleted.');
});

// Load data on server start
loadData();

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    loadData();
    // Save data before the server exits
    process.on('exit', saveData);
    // Handle abrupt program terminations
    process.on('SIGINT', function() {
        saveData();
        process.exit();
    });
});
