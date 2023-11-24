const express = require('express');


const app = express();

app.get('/', (req, res) => {
    res.send('Hello')
});

app.post('/calculate', (req, res) => {
    res.send('Calculate')
})

app.listen(3000, () => {
    console.log('Server started on PORT: 3000')
})