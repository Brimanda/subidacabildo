'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home, Layout, Users, LogOut, Ticket } from 'lucide-react'; // Elimina Calendar y Tickets
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export default function SidebarComponent() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

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

    const confirmation = await MySwal.fire({
      title: 'Sesión de usuario',
      text: 'Estás a punto de cerrar sesión. ¿Deseas continuar?',
      icon: 'warning',
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
    });

    if (confirmation.isConfirmed) {
      const res = await fetch('/api/logout', { method: 'POST' });

      if (res.ok) {
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
      className={`fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-cyan to-blue transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20"
        }`}
    >
      <div className="flex h-full flex-col items-center gap-4 px-4 py-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full text-blue-600">
          <img src="/images/logo.png" alt="Logo" />
        </div>
        <nav className="flex text-white flex-1 flex-col items-center space-y-4 pt-8">
          <NavItem href="/" icon={<Home />} label="Inicio" isOpen={isSidebarOpen} />
          <NavItem href="/admin" icon={<Layout />} label="Panel" isOpen={isSidebarOpen} />
          <NavItem href="/admin/cuentas" icon={<Users />} label="Cuentas" isOpen={isSidebarOpen} />
          <NavItem href="/admin/tickets" icon={<Ticket />} label="Tickets" isOpen={isSidebarOpen} />
        </nav>
        <button
          className="mt-auto text-white hover:bg-blue-700"
          onClick={handleLogout}
        >
          <LogOut className="h-6 w-6" />
          {isSidebarOpen && <span className="ml-2">Salir</span>}
        </button>
      </div>
    </aside>
  );
}

function NavItem({ href, icon, label, isOpen }: { href: string; icon: React.ReactNode; label: string; isOpen: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center rounded-lg p-3 text-white transition-colors hover:bg-blue-700 ${isOpen ? 'w-full justify-start' : 'w-12 justify-center'
        }`}
    >
      {icon}
      {isOpen && <span className="ml-3">{label}</span>}
    </Link>
  );
}
