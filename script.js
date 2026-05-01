document.addEventListener('DOMContentLoaded', function () {
    const spreadsheetId = '1ktiGku1avu7upJ8WcD1k9WVn7t7Djz0EQEAd4I1_1W0'; // ID de la hoja de Google
    const range = 'General!A2:V'; // Asegúrate de que este rango cubra todas las columnas

    const apiKey = 'AIzaSyBLc0GihCS__XvYbwoaA-f-GRlGnqOI-zY';  // Tu API Key

    // Solicitar los datos desde Google Sheets
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);  // Verifica que los datos sean correctos

            // Verifica que la propiedad 'values' esté presente
            if (data.values) {
                const table = document.getElementById('embarquesTable').getElementsByTagName('tbody')[0];
                data.values.forEach(row => {
                    let newRow = table.insertRow();
                    row.forEach((cell, index) => {
                        let newCell = newRow.insertCell();
                        newCell.textContent = cell; // Insertar los datos en las celdas
                    });
                });
            } else {
                console.error('No se encontraron datos en la respuesta');
            }
        })
        .catch(error => console.error('Error al cargar los datos:', error));

    // Función para agregar un nuevo registro a la hoja de cálculo
    function addNewRecordToSheet(recordData) {
        const apiEndpoint = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/General!A2:V:append?valueInputOption=RAW&key=${apiKey}`;

        const requestData = {
            range: "General!A2:V",
            majorDimension: "ROWS",
            values: [recordData]
        };

        // Enviar los datos al servidor
        fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Nuevo registro agregado:', data);
            alert("Record added successfully!");
        })
        .catch(error => {
            console.error("Error al agregar el registro:", error);
        });
    }

    // Escuchar el evento del botón de agregar
    const addButton = document.getElementById('add-button');
    addButton.addEventListener('click', function () {
        const trip = document.getElementById('trip').value;
        const trailer = document.getElementById('trailer').value;
        const client = document.getElementById('client').value;
        const reference = document.getElementById('reference').value;
        const origin = document.getElementById('origin').value;
        const destination = document.getElementById('destination').value;
        const trMx = document.getElementById('tr-mx').value;
        const trUsa = document.getElementById('tr-usa').value;
        const gps = document.getElementById('gps').value;
        const loading = document.getElementById('loading').value;

        // Crear un arreglo con los datos del nuevo registro
        const newRecord = [trip, trailer, client, reference, origin, destination, trMx, trUsa, gps, loading];

        // Llamar la función para agregar el nuevo registro
        addNewRecordToSheet(newRecord);

        // Limpiar los campos del formulario
        document.getElementById('shipment-form').reset();
    });
});