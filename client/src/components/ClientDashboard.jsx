import React, { useState } from 'react';
import io from 'socket.io-client';

export default function ClientDashboard() {
  const [products] = useState([
    { id: 1, name: "Burger", price: 8.99, category: "burger" },
    { id: 2, name: "Pizza", price: 10.99, category: "pizza" },
    { id: 3, name: "Salade César", price: 6.99, category: "salade" },
  ]);

  const socket = io('https://your-backend-url.onrender.com'); 

  const handleOrder = async (product) => {
    const token = localStorage.getItem('token');
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        productId: product.id,
        productName: product.name,
        category: product.category,
        status: 'pending'
      })
    });

    const order = await res.json();
    socket.emit('order:request', order);
    alert("Commande envoyée au restaurant !");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Passer une commande</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="border p-4 rounded shadow hover:shadow-lg transition-shadow duration-300">
            <h3 className="font-bold text-lg">{p.name}</h3>
            <p>{p.price} €</p>
            <button onClick={() => handleOrder(p)} className="mt-2 btn-primary">
              Commander
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}