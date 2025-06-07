import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Bar,
  Pie,
  Line
} from 'react-chartjs-2';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [orderStats, setOrderStats] = useState({
    daily: [],
    monthly: [],
    categories: {}
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUsers();
    fetchOrders();
    fetchDrivers();
    fetchOrderStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des utilisateurs", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des commandes", err);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await axios.get('/api/admin/drivers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDrivers(res.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des livreurs", err);
    }
  };

  const fetchOrderStats = async () => {
    try {
      const res = await axios.get('/api/admin/order-stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrderStats(res.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des statistiques", err);
    }
  };

  // Données : Commandes par mois
  const orderMonthlyData = {
    labels: orderStats.monthly.map(m => m._id),
    datasets: [
      {
        label: 'Nombre de commandes',
        data: orderStats.monthly.map(m => m.count),
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1
      }
    ]
  };

  // Données : Répartition des catégories
  const categoryData = {
    labels: Object.keys(orderStats.categories),
    datasets: [
      {
        label: 'Catégories de plats',
        data: Object.values(orderStats.categories),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverOffset: 10
      }
    ]
  };

  // Données : Livreurs
  const driverDeliveryCount = drivers.map(d => d.deliveryCount || 0);
  const driverNames = drivers.map(d => d.name);

  const driverData = {
    labels: driverNames,
    datasets: [
      {
        label: 'Nombre de livraisons',
        data: driverDeliveryCount,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="p-6 space-y-10">
      <h2 className="text-3xl font-bold mb-6">Tableau de bord Administrateur</h2>

      {/* Graphique : Commandes par mois */}
      <section>
        <h3 className="text-xl font-semibold mb-2">Commandes par mois</h3>
        <Bar data={orderMonthlyData} />
      </section>

      {/* Graphique : Répartition des catégories */}
      <section>
        <h3 className="text-xl font-semibold mb-2">Répartition des catégories de plats</h3>
        <Pie data={categoryData} />
      </section>

      {/* Graphique : Livreurs */}
      <section>
        <h3 className="text-xl font-semibold mb-2">Nombre de livraisons par livreur</h3>
        <Bar data={driverData} options={{ indexAxis: 'y' }} />
      </section>

      {/* Tableau : Utilisateurs */}
      <section>
        <h3 className="text-xl font-semibold mb-2">Utilisateurs</h3>
        <table className="min-w-full bg-white shadow rounded overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Rôle</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{user._id}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4 capitalize">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Tableau : Livreurs */}
      <section>
        <h3 className="text-xl font-semibold mb-2">Livreurs</h3>
        <table className="min-w-full bg-white shadow rounded overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">Nom</th>
              <th className="py-2 px-4 text-left">Statut</th>
              <th className="py-2 px-4 text-left">Livraisons effectuées</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map(driver => (
              <tr key={driver._id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{driver.name}</td>
                <td className="py-2 px-4 capitalize">{driver.status}</td>
                <td className="py-2 px-4">{driver.deliveryCount || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Tableau : Commandes */}
      <section>
        <h3 className="text-xl font-semibold mb-2">Commandes</h3>
        <table className="min-w-full bg-white shadow rounded overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Statut</th>
              <th className="py-2 px-4 text-left">Client</th>
              <th className="py-2 px-4 text-left">Livreur</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{order._id}</td>
                <td className="py-2 px-4 capitalize">{order.status}</td>
                <td className="py-2 px-4">{order.userId?.email || 'Inconnu'}</td>
                <td className="py-2 px-4">{order.driverId?.name || 'Aucun'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}