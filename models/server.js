const express = require('express');
const cors = require('cors');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);

        this.paths = {
            politic: '/api/politic',
        };

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    middlewares() {

        // CORS
        this.app.use(cors());

        this.app.use(express.json());

        // Directorio Público
        this.app.use(express.static('public'));

    }

    routes() {
        this.app.use(this.paths.politic, require('../routes/politicparty'));
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Server running on PORT: ', this.port);
        });
    }

}




module.exports = Server;