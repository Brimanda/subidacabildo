'use client'

import { ChevronDownIcon, ChevronUpIcon, SearchIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';

type Ticket = {
  n_ticket: string;
  name: string;
  area: string;
  problema: string;
  description: string;
  status: 'Abierto' | 'Cerrado';
  created_at: string;
  user_id: number;
  resolution?: string;
  hour_resolution?: string;
};

const TicketList: React.FC = () => {
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const toggleExpand = (ticketId: string) => {
    setExpandedTicket(expandedTicket === ticketId ? null : ticketId);
  };

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'Abierto':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cerrado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    async function fetchTickets() {
      try {
        const response = await fetch('/api/tickets');

        if (!response.ok) {
          throw new Error('Error al obtener los tickets');
        }

        const result = await response.json();
        setTickets(result);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter(ticket =>
    ticket.n_ticket.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.problema.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastTicket = currentPage * itemsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - itemsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden mx-auto max-w-6xl">
          <div className="p-8 bg-gradient-to-r from-sky-400 to-sky-300">
            <h2 className="text-4xl font-extrabold text-white text-center">Mis Tickets de Soporte</h2>
            <p className="mt-2 text-xl text-white text-center">Visualiza y gestiona tus tickets de soporte técnico</p>
          </div>
          <div className="p-6">
            <div className="flex items-center mb-6 bg-white rounded-lg shadow-md">
              <input
                type="text"
                placeholder="Buscar tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow px-6 py-3 text-lg border-none focus:ring-2 focus:ring-blue-500 rounded-l-lg"
              />
              <button className="bg-sky-300 text-white px-8 py-3 text-lg rounded-r-lg hover:bg-sky-400 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center">
                <SearchIcon className="w-6 h-6 mr-2" />
                <span>Buscar</span>
              </button>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Ticket', 'Problema', 'Estado', 'Fecha', 'Detalles'].map((header) => (
                      <th key={header} scope="col" className="px-6 py-3 text-left text-lg font-semibold text-gray-600 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentTickets.map((ticket) => (
                    <React.Fragment key={ticket.n_ticket}>
                      <tr className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-lg font-medium text-gray-900">{ticket.n_ticket}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-500">{ticket.problema}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-500">
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-medium">
                          <button
                            onClick={() => toggleExpand(ticket.n_ticket)}
                            className="text-sky-600 hover:text-sky-700 focus:outline-none focus:underline flex items-center justify-end transition duration-300 ease-in-out"
                            aria-expanded={expandedTicket === ticket.n_ticket}
                            aria-controls={`details-${ticket.n_ticket}`}
                          >
                            {expandedTicket === ticket.n_ticket ? (
                              <ChevronUpIcon className="w-6 h-6 mr-1" />
                            ) : (
                              <ChevronDownIcon className="w-6 h-6 mr-1" />
                            )}
                            <span>
                              {expandedTicket === ticket.n_ticket ? 'Ocultar' : 'Mostrar'}
                            </span>
                          </button>
                        </td>
                      </tr>
                      {expandedTicket === ticket.n_ticket && (
                        <tr id={`details-${ticket.n_ticket}`}>
                          <td colSpan={5} className="px-6 py-4 whitespace-normal bg-gray-50">
                            <div className="text-lg text-gray-900 space-y-4">
                              <p><span className="font-semibold">Área:</span> {ticket.area}</p>
                              <p><span className="font-semibold">Descripción:</span> {ticket.description}</p>
                              <p><span className="font-semibold">Creado por:</span> {ticket.name}</p>
                              {ticket.resolution && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                                  <p className="font-semibold text-xl mb-2 text-green-800">Resolución:</p>
                                  <p className="text-green-700">{ticket.resolution}</p>
                                  <p className="text-gray-600 text-sm">Hora de resolución: {ticket.hour_resolution}</p>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center items-center mt-8 space-x-4">
              <button
                className="px-6 py-3 text-lg font-semibold text-white bg-sky-300 rounded-md hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <span className="text-lg font-medium text-gray-700">
                Página {currentPage} de {totalPages}
              </span>
              <button
                className="px-6 py-3 text-lg font-semibold text-white bg-sky-300 rounded-md hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketList;
