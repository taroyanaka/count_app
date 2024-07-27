const BetterSqlite3 = require('better-sqlite3');
// Initialize SQLite database
const db_for_pins = BetterSqlite3('pins.db');


// Function to validate text length
const validateText = (text) => {
    return typeof text === 'string' && text.length >= 1 && text.length <= 300;
};

// Function to initialize the database table
const initializeDatabase = () => {
    // Drop the existing 'pins' table if it exists
    db_for_pins.exec('DROP TABLE IF EXISTS pins');
    
    // Create a new 'pins' table
    db_for_pins.exec(`
        CREATE TABLE pins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lat REAL NOT NULL,
            lng REAL NOT NULL,
            text TEXT NOT NULL,
            created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `);
};


// Endpoint to initialize the database table
app.post('/api/init', (req, res) => {
    const { password } = req.body;

    if (password === 'init') {
        try {
            initializeDatabase();
            res.status(200).json({ message: 'Database initialized successfully.' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to initialize database.' });
        }
    } else {
        res.status(403).json({ error: 'Unauthorized: Invalid password.' });
    }
});

// Endpoint to save a pin
app.post('/api/pins', (req, res) => {
    const { lat, lng, text } = req.body;

    if (typeof lat !== 'number' || typeof lng !== 'number' || !validateText(text)) {
        return res.status(400).json({ error: 'Invalid input. Text must be between 1 and 300 characters.' });
    }

    const stmt = db_for_pins.prepare('INSERT INTO pins (lat, lng, text) VALUES (?, ?, ?)');
    const result = stmt.run(lat, lng, text);

    res.status(201).json({
        id: result.lastInsertRowid,
        lat,
        lng,
        text,
        created: new Date().toISOString(),
        updated: new Date().toISOString()
    });
});

// Endpoint to fetch all pins
app.get('/api/pins', (req, res) => {
    try {
        const stmt = db_for_pins.prepare('SELECT * FROM pins');
        const pins = stmt.all();
        res.status(200).json(pins);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve pins.' });
    }
});

// Endpoint to fetch a single pin by ID
app.get('/api/pins/:id', (req, res) => {
    const { id } = req.params;
    const stmt = db_for_pins.prepare('SELECT * FROM pins WHERE id = ?');
    const pin = stmt.get(id);

    if (pin) {
        res.status(200).json(pin);
    } else {
        res.status(404).json({ error: 'Pin not found' });
    }
});

// Endpoint to update a pin
app.put('/api/pins/:id', (req, res) => {
    const { id } = req.params;
    const { lat, lng, text } = req.body;

    if (typeof lat !== 'number' || typeof lng !== 'number' || !validateText(text)) {
        return res.status(400).json({ error: 'Invalid input. Text must be between 1 and 300 characters.' });
    }

    const stmt = db_for_pins.prepare('UPDATE pins SET lat = ?, lng = ?, text = ?, updated = CURRENT_TIMESTAMP WHERE id = ?');
    const result = stmt.run(lat, lng, text, id);

    if (result.changes) {
        res.status(200).json({ id, lat, lng, text, updated: new Date().toISOString() });
    } else {
        res.status(404).json({ error: 'Pin not found' });
    }
});

// Endpoint to delete a pin
app.delete('/api/pins/:id', (req, res) => {
    const { id } = req.params;
    const stmt = db_for_pins.prepare('DELETE FROM pins WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes) {
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Pin not found' });
    }
});
