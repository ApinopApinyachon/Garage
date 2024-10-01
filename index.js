const express = require('express');
const app = express();
const cors = require('cors')
const nano = require('nano')('http://admin:12345@localhost:5984'); 
app.use(express.json());

const db = nano.db.use('my-garage');

app.use(cors())

nano.db.create('my-garage', (err, body) => {
  if (!err) {
    console.log('Database created successfully');
  }
});


app.post('/create', async (req, res) => {
    try {
      const response = await db.insert(req.body);  
      res.json(response); 
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.get('/readall', async (req, res) => {
  try {
    const response = await db.list({ include_docs: true }); 
    const allDocs = response.rows.map(row => row.doc); 
    res.json(allDocs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/read/:id', async (req, res) => {
    try {
      const document = await db.get(req.params.id);  
      res.json(document); 
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});


app.put('/update/:id', async (req, res) => {
    try {
      const doc = await db.get(req.params.id);  
      const updatedDoc = { ...doc, ...req.body };
      const response = await db.insert(updatedDoc);  
      res.json(response); 
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.delete('/delete/:id', async (req, res) => {
    try {
      const doc = await db.get(req.params.id); 
      const response = await db.destroy(req.params.id, doc._rev);  
      res.json(response);  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
