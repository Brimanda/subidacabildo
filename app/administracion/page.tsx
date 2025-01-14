'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Sidebar from '../templates/admin/templates/header/sidebar';
import {
  Users,
  Ticket,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import ActivitiesComp from '@/components/Dashboard';

const MySwal = withReactContent(Swal);

// Interfaz para tipar los datos del dashboard
interface DashboardData {
  totalUsers: number;
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  ticketsByDepartment: Record<string, number>;  // Asegúrate de que sea un objeto
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalUsers: 0,
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    ticketsByDepartment: {},  // Inicializa ticketsByDepartment como un objeto vacío
  });

  interface Activity {
    user_id: string;
    action: string;
    created_at: string;
  }

  const [activitiesData, setActivitiesData] = useState<Activity[]>([]);
  const router = useRouter();

  useEffect(() => {
    const validateSessionAndFetchData = async () => {
      const token = localStorage.getItem('sessionToken');
      if (!token) {
        router.push('/accounts/inicio-sesion');
        return;
      }

      try {
        const res = await fetch('/api/validate', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('No autorizado');

        const sessionData = await res.json();
        if (sessionData.role !== 'admin') {
          router.push('/');
          return;
        }

        setIsAdmin(true);

        const dashboardRes = await fetch('/api/dashboard', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!dashboardRes.ok) throw new Error('Error al obtener datos');

        const dashboardInfo = await dashboardRes.json();

        // Asegúrate de que ticketsByDepartment sea un objeto
        setDashboardData({
          ...dashboardInfo,
          ticketsByDepartment: dashboardInfo.ticketsByDepartment || {},  // Si es undefined o null, convierte en objeto vacío
        });

      } catch (error) {
        console.error('Error:', error);
        router.push('/accounts/inicio-sesion');
      } finally {
        setLoading(false);
      }
    };

    validateSessionAndFetchData();
  }, [router]);

  const handleLogout = async () => {
    const result = await MySwal.fire({
      title: '¿Cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch('/api/logout', { method: 'POST' });
        if (res.ok) {
          localStorage.removeItem('sessionToken');
          router.push('/accounts/inicio-sesion');
        } else {
          MySwal.fire('Error', 'No se pudo cerrar la sesión', 'error');
        }
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Cargando...
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-100 to-blue-200">
      <Sidebar />
      <div className="flex-1 ml-16">
        <header className="bg-sky-600 shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-white">
              Panel de Administración de Tickets Internos
            </h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[ 
              { title: 'Total Usuarios', value: dashboardData.totalUsers, icon: <Users className="h-6 w-6 text-blue-500" /> },
              { title: 'Total Tickets', value: dashboardData.totalTickets, icon: <Ticket className="h-6 w-6 text-green-500" /> },
              { title: 'Tickets Abiertos', value: dashboardData.openTickets, icon: <AlertCircle className="h-6 w-6 text-yellow-500" /> },
              { title: 'Tickets Resueltos', value: dashboardData.resolvedTickets, icon: <CheckCircle className="h-6 w-6 text-purple-500" /> },
            ].map((item, index) => (
              <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">{item.icon}</div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {item.title}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {item.value}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg p-5">
              <h3 className="text-lg font-semibold">Tickets por Departamento</h3>
              {
                dashboardData.ticketsByDepartment && 
                Object.entries(dashboardData.ticketsByDepartment).length > 0 ? (
                  Object.entries(dashboardData.ticketsByDepartment).map(([department, ticketCount]) => (
                    <div key={department} className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>{department}</span>
                      <span className="font-medium text-gray-900">{ticketCount}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500">No hay tickets por departamento.</div>
                )
              }
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
