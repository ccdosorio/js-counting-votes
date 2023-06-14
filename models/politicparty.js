const { v4: uuidv4 } = require('uuid');

class PoliticParty {
    constructor({ name, ...cols }) {
        this.id = uuidv4();
        this.name = name;
        Object.assign(this, cols);
    }
}


module.exports = PoliticParty;