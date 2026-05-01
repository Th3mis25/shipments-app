document.addEventListener('DOMContentLoaded', function () {
    const spreadsheetId = '1ktiGku1avu7upJ8WcD1k9WVn7t7Djz0EQEAd4I1_1W0';
    const range = 'General!A2:V';
    const apiKey = 'AIzaSyBLc0GihCS__XvYbwoaA-f-GRlGnqOI-zY';

    window.showView = function (viewId) {
        document.querySelectorAll('.view').forEach(view => {
            view.style.display = view.id === viewId ? 'block' : 'none';
        });
    };

    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (!data.values) {
                console.error('No se encontraron datos en la respuesta');
                return;
            }

            const table = document.getElementById('embarquesTable').getElementsByTagName('tbody')[0];
            data.values.forEach(row => {
                const newRow = table.insertRow();
                row.forEach(cell => {
                    const newCell = newRow.insertCell();
                    newCell.textContent = cell;
                });
            });
        })
        .catch(error => console.error('Error al cargar los datos:', error));

    function addNewRecordToSheet(recordData) {
        const apiEndpoint = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/General!A2:V:append?valueInputOption=RAW&key=${apiKey}`;
        const requestData = {
            range: 'General!A2:V',
            majorDimension: 'ROWS',
            values: [recordData]
        };

        fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                alert('Record added successfully!');
            })
            .catch(error => {
                console.error('Error al agregar el registro:', error);
            });
    }

    const shipmentForm = document.getElementById('shipment-form');
    shipmentForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const newRecord = [
            document.getElementById('trip').value,
            document.getElementById('trailer').value,
            document.getElementById('client').value,
            document.getElementById('reference').value,
            document.getElementById('origin').value,
            document.getElementById('destination').value,
            document.getElementById('tr-mx').value,
            document.getElementById('tr-usa').value,
            document.getElementById('gps').value,
            document.getElementById('loading').value
        ];

        addNewRecordToSheet(newRecord);
        shipmentForm.reset();
    });
});
