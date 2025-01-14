'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, Users, LogOut, Tickets } from 'lucide-react'; // Elimina Calendar y Layout
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function SidebarComponent() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleMouseOver = () => setSidebarOpen(true);
    const handleMouseOut = () => setSidebarOpen(false);

    const sidebarElement = document.getElementById("sidebar");
    if (sidebarElement) {
      sidebarElement.addEventListener("mouseover", handleMouseOver);
      sidebarElement.addEventListener("mouseout", handleMouseOut);
    }

    return () => {
      if (sidebarElement) {
        sidebarElement.removeEventListener("mouseover", handleMouseOver);
        sidebarElement.removeEventListener("mouseout", handleMouseOut);
      }
    };
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem('sessionToken');
  
    const confirmation = await MySwal.fire({
      title: 'Sesión de usuario',
      text: 'Estás a punto de cerrar sesión. ¿Deseas continuar?',
      icon: 'warning',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
    });
  
    if (confirmation.isConfirmed) {
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
    <aside
      id="sidebar"
      className={`fixed left-0 top-0 z-40 h-screen bg-blue-50 shadow-lg transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-64" : "w-16"
        }`}
    >
      <div className="flex h-full flex-col items-start py-6 px-4">
        <div
          className={`mb-8 w-full flex flex-col items-center justify-center transition-all duration-300 ease-in-out ${isSidebarOpen ? 'opacity-100 scale-100' : 'opacity-100 scale-x-70 scale-y-55'}`}
        >
          <img src="/logo.jpg" alt="Logo" className="h-25 w-20 transition-all duration-300 ease-in-out" />

          <div className="flex items-center justify-center w-full mt-2">
            <span className={`text-xl font-bold flex items-center justify-center text-center text-blue-900 ${isSidebarOpen ? 'block' : 'hidden'}`}>
              Informática Municipal
            </span>
          </div>
        </div>
        <nav className="flex flex-1 flex-col items-start space-y-4 w-full">
          <NavItem href="/administracion" icon={<Home />} label="Inicio" isOpen={isSidebarOpen} isActive={pathname === '/administracion'} />
          <NavItem href="/administracion/users" icon={<Users />} label="Cuentas" isOpen={isSidebarOpen} isActive={pathname === '/administracion/users'} />
          <NavItem href="/administracion/tickets" icon={<Tickets />} label="Tickets" isOpen={isSidebarOpen} isActive={pathname === '/administracion/tickets'} />
          <br />
        </nav>
        
        <div className="mt-auto w-full flex items-center justify-center">
          <button
            onClick={handleLogout}
            className={`flex items-center rounded-lg p-2 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-full' : 'w-10 justify-center'} ${false ? 'bg-cyan-500 text-white hover:bg-cyan-600' : 'text-gray-600 hover:bg-blue-100 hover:text-blue-800'}`}
          >
            <LogOut />
            {isSidebarOpen && <span className="ml-3 text-sm">Cerrar sesión</span>}
          </button>
        </div>

      </div>
    </aside>
  );
}

import { ReactNode, FC } from 'react';

interface NavItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  isOpen: boolean;
  isActive: boolean;
}

const NavItem: FC<NavItemProps> = ({ href, icon, label, isOpen, isActive }) => {
  return (
    <Link
      href={href}
      className={`flex items-center rounded-lg p-2 transition-colors duration-200 ${isOpen ? 'w-full' : 'w-10 justify-center'
        } ${isActive
          ? 'bg-cyan-500 text-white hover:bg-cyan-600'
          : 'text-gray-600 hover:bg-blue-100 hover:text-blue-800'
        }`}
    >
      {icon}
      {isOpen && <span className="ml-3 text-sm">{label}</span>}
    </Link>
  );
}
