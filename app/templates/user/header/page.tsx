'use client';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useRouter } from 'next/navigation';
import { LogOut, Info, File, Home } from 'lucide-react';

const MySwal = withReactContent(Swal);

const Header: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [showWelcomeModal, setShowWelcomeModal] = useState(false); 
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('sessionToken');
    const welcomeShown = localStorage.getItem('welcomeShown'); 

    if (token && !welcomeShown) {
      setShowWelcomeModal(true);
      setIsModalOpen(true);
      localStorage.setItem('welcomeShown', 'true'); 
    }
  }, []);

  const handleTickets = () => {
    router.push('/panel');
  };

  const handleHome = () => {
    router.push('/');
  };

  const handleLogout = async () => {
    // Mostrar el mensaje de confirmación
    const confirmation = await MySwal.fire({
      title: 'Sesión de usuario',
      text: 'Estás a punto de cerrar sesión. ¿Deseas continuar?',
      icon: 'warning',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
    });
  
    if (confirmation.isConfirmed) {
      const token = localStorage.getItem('sessionToken');
  
      if (!token) {
        MySwal.fire({
          title: 'Error',
          text: 'No se encontró el token en el almacenamiento local.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
        return;
      }
  
      const res = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
  
      if (res.ok) {
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('welcomeShown');
  
        MySwal.fire({
          title: '¡Sesión cerrada!',
          text: 'Has cerrado sesión correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).then(() => {
          router.push('/accounts/inicio-sesion');
        });
      } else {
        MySwal.fire({
          title: 'Error',
          text: 'Hubo un problema al cerrar sesión. Intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      }
    }
  };
  



  return (
    <header className="bg-cyan-400 text-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            className="flex items-center gap-2 w-auto cursor-pointer hover:text-blue-300 transition duration-200 text-black"
            onClick={handleTickets}>
            <File className="w-6 h-6 cursor-pointer hover:text-blue-300 transition duration-200" size={20} />
            Solicitudes
          </button>
          <button
            className="flex items-center gap-2 w-auto cursor-pointer hover:text-blue-300 transition duration-200 text-black"
            onClick={() => setIsModalOpen(true)}
            >
            <Info
              className="w-6 h-6 cursor-pointer hover:text-blue-300 transition duration-200"
            />
            Informacion
          </button>
        </div>
        <div className="flex items-center space-x-3 mr-40">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="h-10 w-auto object-contain"
          />
          <h1 className="text-2xl font-bold tracking-wide text-black">Gestión de Soporte</h1>
        </div>

        <div className="flex items-center space-x-4">

          <button
            className="px-3 py-2 bg-blue-600 hover:bg-blue-800 text-white font-medium rounded-full transition duration-200 flex items-center justify-center"
            onClick={handleHome}
          >
            <Home size={20} />
          </button>

          <button
            className="px-4 py-2 bg-red-600 hover:bg-red-800 text-white font-medium rounded-full transition duration-200 flex items-center justify-center"
            onClick={handleLogout}
          >
            <LogOut className="h-6 w-6" />
            {isModalOpen && <span className="ml-2"></span>}
          </button>

          

        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full text-center">
            <h4 className="text-xl font-semibold text-gray-800 mb-4">
              Gestión de requerimientos informáticos
            </h4>
            <p className="text-gray-700 mb-6">
              Esta página está diseñada para gestionar las solicitudes de los distintos departamentos en relación a los problemas informáticos. Mediante esta página, usted podrá agilizar el proceso de soporte hacia los equipos en su poder.
            </p>
            <button
              className="w-full bg-blue-500 hover:bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
              onClick={() => setIsModalOpen(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;