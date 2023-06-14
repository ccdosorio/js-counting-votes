// Referencias HTML
const formPolitic = document.getElementById('formPolitic'),
    formClear = document.getElementById('formClear');

formClear.style.display = 'none';

const btnGenerate = document.getElementById('btnGenerate'),
    btnSave = document.getElementById('btnSave'),
    btnClear = document.getElementById('btnClear');

const tbody = document.querySelector('tbody'),
    trTable = document.getElementById('trTable');

const toValueInput = document.getElementById('toValue');
const fromValueInput = document.getElementById('fromValue');

const switchToggle = document.getElementById('switchToggle');

const containerList = document.getElementById('listShort');

const getData = async () => {
    tbody.innerHTML = '';
    const { data } = await get('/api/politic/');
    data.forEach(item => {
        const row = tbody.insertRow();

        for (let key in item) {
            if (key !== 'id') {
                const cell = row.insertCell();
                cell.textContent = item[key];
            }
        }

        const deleteButtonCell = row.insertCell();
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.innerHTML = '<i class="bi bi-trash-fill"></i>';
        deleteButton.addEventListener('click', () => {
            deleteData(item.id);
        });

        deleteButtonCell.appendChild(deleteButton);
    });


}

const getShortData = async () => {
    containerList.innerHTML = '';

    const { short: data } = await get('/api/politic/short');

    containerList.classList.add('list-group');
    containerList.style.overflowY = 'auto';
    containerList.style.maxHeight = '400px';

    data.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');

        const position = index + 1;
        const content = `<b>Posicion ${position}:</b> ${item.value} | <b>Partido:</b> ${item.name}`;
        listItem.innerHTML = content;

        containerList.appendChild(listItem);
    });

    document.body.appendChild(containerList);


}

const getFormPolicit = () => {
    const formData = new FormData(formPolitic);

    const formValues = {};

    for (let [name, value] of formData) {
        if (name === 'name') {
            formValues[name] = value;
        } else {
            formValues[name] = Number(value);
        }
    }

    return formValues;
}


const getMessage = (iconType, title, message) => {
    Swal.fire({
        icon: iconType,
        title,
        text: message
    });
}

const generateInputs = () => {
    for (let i = 1; i <= 26; i++) {
        const divElement = document.createElement('div');
        divElement.className = 'col-2 mb-3';

        const labelElement = document.createElement('label');
        labelElement.className = 'form-label';
        labelElement.textContent = 'Valor ' + i;

        const inputElement = document.createElement('input');
        inputElement.type = 'number';
        inputElement.className = 'form-control';
        inputElement.id = 'col' + i;
        inputElement.name = 'col' + i;
        divElement.appendChild(labelElement);
        divElement.appendChild(inputElement);

        formPolitic.appendChild(divElement);
    }

}

const generateHeader = () => {
    for (let i = 1; i <= 26; i++) {
        const th = document.createElement('th');
        th.setAttribute('scope', 'col');
        th.textContent = 'Col' + i;
        trTable.appendChild(th);
    }

    const latTh = document.createElement('th');
    latTh.setAttribute('scope', 'col');
    latTh.textContent = 'Opciones';
    trTable.appendChild(latTh);
}

const generateValues = () => {

    const values = getFormPolicit();
    const col1Value = values.col1;

    for (let i = 2; i <= 26; i++) {
        const colXValue = (col1Value / i).toFixed(2);
        values['col' + i] = Number(colXValue);

        const input = document.getElementById('col' + i);

        if (input) {
            input.value = Number(colXValue);
        }
    }

}

const saveData = async () => {
    const values = getFormPolicit();
    const resp = await post('/api/politic/', values);
    if (resp) {
        getMessage('success', 'Exitoso!', 'Partido registrado con correctamente.');
    }

    formPolitic.reset();
    getData();
    getShortData();
}

const deleteData = async (id) => {
    const resp = await post(`/api/politic/delete/${id}`);
    if (resp) {
        getMessage('success', 'Exitoso!', resp.message);
    }
    getData();
    getShortData();
}

const clearValues = (to, from) => {
    const values = getFormPolicit();

    for (let i = to; i <= from; i++) {
        values['col' + i] = 0;

        const input = document.getElementById('col' + i);

        if (input) {
            input.value = 0;
        }
    }

    toValueInput.value = null;
    fromValueInput.value = null;
}

const init = async () => {
    generateInputs();
    generateHeader();
    getData();
    getShortData();
}

init();

// Eventos

btnGenerate.addEventListener('click', () => {
    const { name, col1 } = getFormPolicit();

    if (!name || col1 === 0) {
        getMessage('error', 'Error!', 'Debes ingresar el valor 1 y el nombre del partido');
        return;
    }

    generateValues();
});

btnSave.addEventListener('click', () => {
    if (!name || col1 === 0) {
        getMessage('error', 'Error!', 'Debes ingresar el valor 1 y el nombre del partido');
        return;
    }
    saveData();
});

btnClear.addEventListener('click', () => {
    const toValue = Number(toValueInput.value);
    const fromValue = Number(fromValueInput.value);

    if (!toValue || !fromValue) {
        getMessage('error', 'Error', 'Ingresa un rango valido.');
        return;
    }
    formClear.style.display = 'none';
    switchToggle.checked = false;
    clearValues(toValue, fromValue);
});

switchToggle.addEventListener('change', function (event) {
    if (event.target.checked) {
        formClear.style.display = '';
    } else {
        formClear.style.display = 'none';
    }
});

