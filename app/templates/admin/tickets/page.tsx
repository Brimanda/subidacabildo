'use client';
import React, { useState, useEffect } from "react";
import { Search } from 'lucide-react';
import toast from "react-hot-toast";

interface Ticket {
  id: number;
  name: string;
  area: string;
  problema: string;
  status: string;
  n_ticket: string;
  description: string;
  resolution: string;
  hour_resolution: string;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [resolution, setResolution] = useState('');
  const [setIsEditingResolution] = useState(false);
  const [isModalViewOpen, setIsModalViewOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalAddResolution, setIsModalAddResolution] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('/api/tickets');
        if (!response.ok) throw new Error('Failed to fetch tickets');
        const data = await response.json();
        setTickets(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTickets();
  }, []);

  useEffect(() => {
    if (isModalViewOpen && selectedTicket) {
      setResolution(selectedTicket.resolution || '');
    }
  }, [isModalViewOpen, selectedTicket]);

  const filteredTickets = tickets.filter(ticket =>
    Object.values(ticket).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleOpenModal = (ticket: Ticket, action: "view" | "edit") => {
    setSelectedTicket(ticket);
    if (action === "view") {
      setIsModalViewOpen(true);
    } else if (action === "edit") {
      setIsModalEditOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalViewOpen(false);
    setIsModalEditOpen(false);
    setIsModalAddResolution(false);
    setSelectedTicket(null);
    setResolution('');
    setIsEditingResolution(false);
  };

  const handleResolutionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResolution(e.target.value);
  };

  const handleSubmitResolution = async () => {
    const currentDateTime = new Date().toLocaleString();
    try {
      const response = await fetch('/api/tickets', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ID: selectedTicket?.id,
          STATUS: 'Cerrado',
          RESOLUTION: resolution,
          HOUR_RESOLUTION: currentDateTime,
        }),
      });

      if (!response.ok) throw new Error('Failed to update resolution');

      setTickets(tickets.map(ticket =>
        ticket.id === selectedTicket?.id
          ? { ...ticket, resolution, hour_resolution: currentDateTime, status: 'Cerrado' }
          : ticket
      ));
      toast.success('Resolución agregada en el ticket correctamente', {
        duration: 3000,
        position: 'bottom-right',
        icon: '✅',
      });
      handleCloseModal();
    } catch (err) {
      console.error('Error updating resolution:', err);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 mx-auto">
        <main className="p-8">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-6 bg-blue-300">
              <h1 className="text-3xl font-bold text-black mb-2">Vista de Tickets</h1>
              <p className="text-black-100">Gestiona y visualiza todos los tickets del sistema</p>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar tickets..."
                    className="w-full pl-10 pr-4 py-2 border rounded-full text-gray-700 focus:outline-none focus:border-cyan-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-10">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
                  <p className="mt-2 text-cyan-600 font-semibold">Cargando tickets...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-cyan-50">
                      <tr>
                        {['ID', 'Nombre', 'Área', 'Problema', 'Estado', 'Acciones'].map((header) => (
                          <th key={header} className="px-6 py-3 text-left text-xs font-medium text-cyan-800 uppercase tracking-wider">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTickets.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                            No se encontraron tickets
                          </td>
                        </tr>
                      ) : (
                        filteredTickets.map((ticket) => (
                          <tr key={ticket.id} className="hover:bg-cyan-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.area}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ticket.problema}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ticket.status === 'Cerrado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {ticket.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {ticket.status === 'Cerrado' ? (
                                <>
                                  <button
                                    onClick={() => handleOpenModal(ticket, "view")}
                                    className="px-3 py-1 rounded-md text-white bg-cyan-500 hover:bg-cyan-600"
                                  >
                                    Ver
                                  </button>
                                  <button
                                    onClick={() => handleOpenModal(ticket, "edit")}
                                    className="px-3 py-1 rounded-md text-white bg-yellow-500 hover:bg-yellow-600 ml-2"
                                  >
                                    Editar
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSelectedTicket(ticket);
                                    setIsModalAddResolution(true);
                                  }}
                                  className="px-3 py-1 rounded-md text-white bg-cyan-500 hover:bg-cyan-600"
                                >
                                  Ver detalles
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      {isModalViewOpen && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative">
            <h2 className="text-2xl font-bold text-cyan-800 mb-4 text-center">
              Detalles del Ticket
            </h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-cyan-700">Número de Ticket:</span> {selectedTicket.n_ticket}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-semibold text-cyan-700">Problema:</span> {selectedTicket.problema}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-semibold text-cyan-700">Descripción:</span> {selectedTicket.description}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-semibold text-cyan-700">Resolucion:</span> {selectedTicket.resolution}
              </p>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalEditOpen && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative">
            <h2 className="text-2xl font-bold text-cyan-800 mb-4 text-center">
              Editar Resolución del Ticket
            </h2>
            <div className="space-y-4">
              <span className="font-semibold text-cyan-700">Resolucion:</span> {selectedTicket.resolution}
              <br />
              <br />
              <textarea
                id="resolution"
                rows={4}
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                value={resolution}
                onChange={handleResolutionChange}
                placeholder="Ingrese la resolución aquí..."
              ></textarea>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={handleSubmitResolution}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition duration-200"
              >
                Editar Resolución
              </button>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalAddResolution && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative">
            <h2 className="text-2xl font-bold text-cyan-800 mb-4 text-center">
              Agregar Resolución al Ticket
            </h2>
            <div className="space-y-4">
              <span className="font-semibold text-cyan-700">Número de Ticket:</span> {selectedTicket.n_ticket}
              <br />
              <span className="font-semibold text-cyan-700">Problema:</span> {selectedTicket.problema}
              <br />
              <span className="font-semibold text-cyan-700">Descripción del problema:</span> {selectedTicket.description}
              <br />
              <br />
              <textarea
                id="resolution"
                rows={4}
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                value={resolution}
                onChange={handleResolutionChange}
                placeholder="Ingrese la resolución aquí..."
              ></textarea>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={handleSubmitResolution}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition duration-200"
              >
                Agregar Resolución
              </button>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
