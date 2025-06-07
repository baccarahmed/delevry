import React, { useState, useEffect } from 'react';
import './App.css';

// Components importés
import Header from './components/Header';
import ClientDashboard from './components/ClientDashboard';
import RestaurantDashboard from './components/RestaurantDashboard';
import DriverDashboard from './components/DriverDashboard';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import Register from './components/Register';
import TrackingPage from './components/TrackingPage';

export default function App() {
  const [user, setUser] = useState(null);
  const [route, setRoute] = useState(window.location.hash.slice(1) || '/');

  // Charger l'utilisateur connecté depuis localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Gérer les changements de hash
  useEffect(() => {
    window.addEventListener('hashchange', () => {
      setRoute(window.location.hash.slice(1));
    });
    return () => window.removeEventListener('hashchange', () => {});
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setRoute('/');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setRoute('/login');
  };

  return (
    <div>
      <Header user={user} onLogout={logout} />
      <main className="container mx-auto px-4 py-8">
        {route === '/' && user && <Home user={user} />}
        {route === '/login' && <Login onLogin={login} />}
        {route === '/register' && <Register onLogin={login} />}
        {route === '/client' && user?.role === 'client' && <ClientDashboard />}
        {route === '/restaurant' && user?.role === 'restaurant' && <RestaurantDashboard />}
        {route === '/driver' && user?.role === 'driver' && <DriverDashboard />}
        {route === '/admin' && user?.role === 'admin' && <AdminDashboard />}
        {route.startsWith('/tracking') && <TrackingPage orderId={route.split('/').pop()} />}
      </main>
    </div>
  );
}

function Home({ user }) {
  return (
    <div className="text-center py-12">
      <h1 className="text-3xl font-bold mb-6">Bienvenue chez FoodDelivery</h1>
      <p className="mb-6">Connectez-vous ou inscrivez-vous pour commencer.</p>

      {user ? (
        <>
          <p>Connecté en tant que : <strong>{user.role}</strong></p>
          <button onClick={() => window.location.hash = `#${user.role}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Accéder à mon espace
          </button>
        </>
      ) : (
        <div className="space-x-4">
          <a href="#/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Se connecter</a>
          <a href="#/register" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">S’inscrire</a>
        </div>
      )}
    </div>
  );
}