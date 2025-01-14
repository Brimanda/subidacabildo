'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Activity {
  user_id: string;
  action: string;
  created_at: string;
}

export default function ActivitiesComponent() {
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [activitiesData, setActivitiesData] = useState<Activity[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchActivities = async () => {
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

        const activitiesRes = await fetch('/api/activity', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!activitiesRes.ok) throw new Error('Error al obtener actividades');

        const activitiesInfo = await activitiesRes.json();
        setActivitiesData(activitiesInfo);
      } catch (error) {
        console.error('Error:', error);
        router.push('/accounts/inicio-sesion');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [router]);

  if (loading) {
    return <div className="text-center py-4">Cargando actividades...</div>;
  }

  if (!isAdmin) return null;

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Actividades Recientes</h3>
      </div>
      <div className="border-t border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acción
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activitiesData.length > 0 ? (
                activitiesData.map((activity, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {activity.user_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.created_at}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    No hay actividades registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

