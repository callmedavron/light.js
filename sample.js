const light = require('./light');
const server = new light();



server.get('/:name', async (req, res) => {
    return res.json(req.params.get);
});

server.post('/test/:id', (req, res) => {
    return res.json(req.params);
});

server.patch('/test', (req, res) => {
    return res.json(req.params);
});

server.delete('/test', (req, res) => {
    return res.json(req.params);
});

server.put('/test', (req, res) => {
    return res.json(req.params);
});

server.listen({ port: 4000 });