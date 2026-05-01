import React, { useEffect, useState } from 'react';
import ShipmentList from './ShipmentList';

const spreadsheetId = '1ktiGku1avu7upJ8WcD1k9WVn7t7Djz0EQEAd4I1_1W0';
const range = 'General!A2:V';
const apiKey = 'AIzaSyBLc0GihCS__XvYbwoaA-f-GRlGnqOI-zY';
const appsScriptUrl = 'https://script.google.com/a/macros/tmtransportation.us/s/AKfycbwRGB3dZgJgnf2hIkU3PqGLIbgoPnUdukS6gqOiLCJ1GO9s1oW7f99mERIDWM-na2qV/exec';

export default function App() {
  const [shipments, setShipments] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setShipments(data.values || []))
      .catch((error) => console.error('Error al cargar los datos:', error));
  }, []);

  const createShipment = async (recordData) => {
    setIsCreating(true);
    const endpoint = appsScriptUrl;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [recordData] })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setShipments((prev) => [...prev, recordData]);
    } finally {
      setIsCreating(false);
    }
  };

  return <ShipmentList shipments={shipments} onCreateShipment={createShipment} isCreating={isCreating} />;
}
