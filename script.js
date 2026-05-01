document.addEventListener('DOMContentLoaded', function () {
    const spreadsheetId = '1ktiGku1avu7upJ8WcD1k9WVn7t7Djz0EQEAd4I1_1W0';
    const range = 'General!A2:V';
    const apiKey = 'AIzaSyBLc0GihCS__XvYbwoaA-f-GRlGnqOI-zY';
const appsScriptUrl = 'https://script.google.com/a/macros/tmtransportation.us/s/AKfycbwRGB3dZgJgnf2hIkU3PqGLIbgoPnUdukS6gqOiLCJ1GO9s1oW7f99mERIDWM-na2qV/exec';

    const tableBody = document.querySelector('#embarquesTable tbody');
    const modal = document.getElementById('shipment-modal');
    const openModalBtn = document.getElementById('add-shipment-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const shipmentForm = document.getElementById('shipment-form');
    const formError = document.getElementById('form-error');

    const fieldIds = [
        'trip', 'trailer', 'client', 'reference', 'origin', 'destination', 'tr-mx', 'tr-usa', 'gps', 'loading',
        'arrival-shipper', 'departure-plant', 'arrival-nld', 'nld-departure', 'delivery-appointment', 'eta',
        'arrival-destination', 'departure-destination', 'status', 'location', 'empty', 'notes'
    ];

    window.showView = function (viewId) {
        document.querySelectorAll('.view').forEach(view => {
            view.style.display = view.id === viewId ? 'block' : 'none';
        });
    };

    function addRowToTable(rowData) {
        const newRow = tableBody.insertRow();
        for (let i = 0; i < 22; i += 1) {
            const newCell = newRow.insertCell();
            newCell.textContent = rowData[i] || '';
        }
    }

    function openModal() {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
    }

    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (!data.values) return;
            data.values.forEach(addRowToTable);
        })
        .catch(error => console.error('Error loading data:', error));

    function addNewRecordToSheet(recordData) {
        return fetch(appsScriptUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ values: [recordData] })
        }).then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        });
    }

    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (event) {
        if (event.target === modal) closeModal();
    });

    shipmentForm.addEventListener('submit', function (event) {
        event.preventDefault();
        formError.textContent = '';

        if (!shipmentForm.checkValidity()) {
            formError.textContent = 'Please fill out all required fields.';
            shipmentForm.reportValidity();
            return;
        }

        const newRecord = fieldIds.map(id => document.getElementById(id).value.trim());

        addRowToTable(newRecord);
        addNewRecordToSheet(newRecord).catch(error => {
            console.error('Error adding record to sheet:', error);
            formError.textContent = 'Saved in table, but failed to sync with Google Sheets.';
        });

        shipmentForm.reset();
        closeModal();
    });
});
