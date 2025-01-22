const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle the game details page
app.get('/game_details', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'game_details.html'));
});

// Handle the risk iq page
app.get('/risk_iq.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'risk_iq.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
