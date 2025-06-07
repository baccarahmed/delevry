import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

export default function DriverDashboard() {
  const [deliveries, setDeliveries] = useState([]);

  const socket = io('https://your-backend-url.onrender.com'); 

  useEffect(() => {
    socket.on('order:availableForDriver', (delivery) => {
      setDeliveries(prev => [...prev, delivery]);
    });
  }, []);

  const acceptDelivery = (delivery) => {
    socket.emit('driver:acceptedOrder', { ...delivery, status: 'en_route' });
    setDeliveries(deliveries.filter(d => d.productId !== delivery.productId));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Nouvelles livraisons disponibles</h2>
      <ul className="space-y-4">
        {deliveries.map(order => (
          <li key={order.productId} className="border p-4 rounded shadow flex justify-between items-center">
            <span>Commande #{order.productId}</span>
            <button onClick={() => acceptDelivery(order)} className="btn-warning">
              Accepter
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}