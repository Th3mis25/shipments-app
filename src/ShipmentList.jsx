import React, { useMemo, useState } from 'react';
import './ShipmentList.css';

const initialForm = {
  trip: '',
  trailer: '',
  client: '',
  reference: '',
  origin: '',
  destination: '',
  trMx: '',
  trUsa: '',
  gps: '',
  loading: '',
  status: '',
  date: ''
};

export default function ShipmentList({ shipments, onCreateShipment, isCreating }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const columns = useMemo(
    () => [
      'Trip', 'Trailer', 'Client', 'Reference', 'Origin', 'Destination',
      'TR-MX', 'TR-USA', 'GPS', 'Loading', 'Status', 'Date'
    ],
    []
  );

  const validate = () => {
    const newErrors = {};
    ['trip', 'client', 'destination', 'status', 'date'].forEach((field) => {
      if (!formData[field].trim()) {
        newErrors[field] = 'Campo obligatorio';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setFormData(initialForm);
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const record = [
      formData.trip,
      formData.trailer,
      formData.client,
      formData.reference,
      formData.origin,
      formData.destination,
      formData.trMx,
      formData.trUsa,
      formData.gps,
      formData.loading,
      formData.status,
      formData.date
    ];

    await onCreateShipment(record);
    closePanel();
  };

  return (
    <section className="shipment-list-container">
      <button
        type="button"
        className="add-record-button"
        aria-label="Crear nuevo registro"
        onClick={() => setIsPanelOpen(true)}
      >
        +
      </button>

      <h1>Shipment Tracking</h1>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>{columns.map((name) => <th key={name}>{name}</th>)}</tr>
          </thead>
          <tbody>
            {shipments.map((row, index) => (
              <tr key={`shipment-${index}`}>
                {columns.map((_, idx) => <td key={`${index}-${idx}`}>{row[idx] || '-'}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={`panel-overlay ${isPanelOpen ? 'open' : ''}`} onClick={closePanel} />
      <aside className={`slide-panel ${isPanelOpen ? 'open' : ''}`}>
        <div className="panel-header">
          <h2>Nuevo envío</h2>
          <button type="button" onClick={closePanel}>×</button>
        </div>

        <form className="shipment-form" onSubmit={handleSubmit}>
          {[
            ['trip', 'Número de envío *'],
            ['trailer', 'Trailer'],
            ['client', 'Destinatario *'],
            ['reference', 'Referencia / BL'],
            ['origin', 'Origen'],
            ['destination', 'Destino *'],
            ['trMx', 'TR-MX'],
            ['trUsa', 'TR-USA'],
            ['gps', 'GPS'],
            ['loading', 'Cita de carga'],
            ['status', 'Estado *'],
            ['date', 'Fecha *']
          ].map(([name, label]) => (
            <label key={name}>
              {label}
              <input
                type={name === 'date' ? 'date' : 'text'}
                name={name}
                value={formData[name]}
                onChange={handleChange}
              />
              {errors[name] && <span className="error">{errors[name]}</span>}
            </label>
          ))}

          <button type="submit" className="submit-btn" disabled={isCreating}>
            {isCreating ? 'Guardando...' : 'Guardar registro'}
          </button>
        </form>
      </aside>
    </section>
  );
}
