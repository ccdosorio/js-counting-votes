const { response, request } = require('express');

const { saveDB, readDB } = require('../helpers/saveFile');
const PoliticParty = require('../models/politicparty');

const politicGet = async (req = request, res = response) => {

    const data = readDB();

    res.json({ data });
};

const politicShortGet = async (req = request, res = response) => {
    const data = readDB();

    const sortedValues = data
        .flatMap(objeto => {
            const values = Object.values(objeto).slice(2); // Obtener los valores de col1 a col26
            const filteredValues = values.filter(valor => typeof valor === 'number' && valor > 0); // Filtrar los valores numéricos positivos
            const sortedFilteredValues = filteredValues.sort((a, b) => b - a); // Ordenar los valores filtrados en orden descendente
            return sortedFilteredValues.map(value => ({ value, name: objeto.name })); // Crear un objeto para cada valor filtrado
        })
        .sort((a, b) => b.value - a.value); // Ordenar los objetos en orden descendente según el valor máximo

    res.json({ short: sortedValues });
};

const politicPost = async (req = request, res = response) => {

    const body = req.body;

    const politic = new PoliticParty(body);

    const data = readDB();
    data.push(politic);

    saveDB(data);

    res.status(201).json(politic);
};

const politicDelete = async (req = request, res = response) => {

    const id = req.params.id;
    const data = readDB();
    const findIndex = data.findIndex(element => element.id === id);

    if (findIndex === -1) {
        return res.status(400).json({ msg: `El partido con id: ${id} no se encontro.` });
    }

    data.splice(findIndex, 1);
    saveDB(data);

    res.status(201).json({ msg: 'Partido eliminado con exito.' });
};


module.exports = {
    politicGet,
    politicShortGet,
    politicPost,
    politicDelete
};
