'use client';
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const generateRandomTicketNumber = () => {
  return 'T-' + Math.floor(Math.random() * 10000);
}

export default function Form() {
  const [setError] = useState('');
  const [formData, setFormData] = useState({
    name: "",
    area: "",
    problema: "",
    description: "",
    status: "Abierto",
    n_ticket: generateRandomTicketNumber(),
    user_id: "",
  });

  const maxCaracteres = 500;

  useEffect(() => {
    const fetchUserId = async () => {
      const token = localStorage.getItem('sessionToken');
  
      if (!token) {
        setError('No se encontró el token');
        return;
      }
  
      try {
        const response = await fetch('/api/get-user-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || 'Error al obtener el user_id');
          return;
        }
  
        const data = await response.json();
  
        if (data.user_id) {
          setFormData((prev) => {
            console.log('Estado previo:', prev);
            return { ...prev, user_id: data.user_id };
          });
        }
      } catch (error) {
        setError('Error al obtener el user_id desde el servidor.');
      }
    };
  
    fetchUserId();
  }, []);
  


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const caracteresRestantes = maxCaracteres - formData.description.length;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    console.log('Datos del formulario al enviar:', formData);

    console.log('user_id antes de enviar el formulario:', formData.user_id);
    if (!formData.user_id) {
      MySwal.fire({
        title: 'Error',
        text: 'El identificador de usuario no se ha cargado. Inténtalo de nuevo.',
        icon: 'error',
      });
      return;
    }


    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log('Respuesta al enviar el ticket:', response);

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }

      await response.json();
      MySwal.fire({
        title: 'Ticket enviado',
        text: 'Tu ticket ha sido enviado exitosamente con el siguiente número de seguimiento: ' + formData.n_ticket,
        icon: 'success',
      });

      setFormData({
        name: "",
        area: "",
        problema: "",
        description: "",
        status: "Abierto",
        n_ticket: generateRandomTicketNumber(),
        user_id: formData.user_id,
      });
    } catch (err) {
      console.error('Error al enviar el ticket:', err);
      setError("Error al enviar el ticket.");
      MySwal.fire({
        title: 'Error',
        text: 'Hubo un problema al enviar tu ticket',
        icon: 'error',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 max-w-lg mx-auto bg-blue-100 rounded-lg shadow-md">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-800">
          Nombre
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="area" className="block text-sm font-medium text-gray-800">
          Seleccione un departamento:
        </label>
        <select
          id="area"
          name="area"
          value={formData.area}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Seleccione un departamento</option>
          <option value="Administración Municipal">Administración Municipal</option>
          <option value="Operaciones">Operaciones</option>
          <option value="Secretaria Municipal">Secretaria Municipal</option>
          <option value="Secretaria de Planificación">Secretaria de Planificación</option>
          <option value="Medio Ambiente, Aseo y Ornato">Medio Ambiente, Aseo y Ornato</option>
          <option value="Obras Municipales">Obras Municipales</option>
          <option value="Desarrollo Comunitario">Desarrollo Comunitario</option>
          <option value="Adminitracion y Finanzas">Administracion y Finanzas</option>
          <option value="control">Control</option>
          <option value="Asesoria Juridica">Asesoria Juridica</option>
          <option value="Tránsito y Transporte Públicos">Tránsito y Transporte Públicos</option>
          <option value="Educación">Educación</option>
          <option value="Salud">Salud</option>
          <option value="Seguridad Pública">Seguridad Pública</option>
          <option value="Deportes, turismo, cultura y recreación">Deportes, turismo, cultura y recreación</option>
          <option value="Juzgado de Policia Local">Juzgado de Policia Local</option>
        </select>
      </div>

      <div>
        <label htmlFor="problema" className="block text-sm font-medium text-gray-700">
          Seleccione el problema asociado:
        </label>
        <select
          id="problema"
          name="problema"
          value={formData.problema}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Selecciona un problema</option>
          <option value="Problemas en la conexión a internet">Problemas en la conexión a internet</option>
          <option value="Fallas en el equipo">Fallas en el equipo</option>
          <option value="La pantalla no tiene visibilidad">La pantalla no tiene visibilidad</option>
          <option value="La impresora no está funcionando">La impresora no está funcionando</option>
          <option value="Perdida de archivos">Perdida de archivos</option>
          <option value="El citófono no está operativo">El citófono no está operativo</option>
          <option value="Instalación de programas y/o creación de usuario de caschile">Instalación de programas y/o creación de usuario de caschile</option>
          <option value="La tinta de la impresora se ha agotado">La tinta de la impresora se ha agotado</option>
          <option value="Otro (especificar)">Otro (especificar)</option>
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          name="description"
          id="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          maxLength={maxCaracteres}
          required
        ></textarea>
        <div className="text-right text-sm text-gray-500">
          {caracteresRestantes} Caracteres restantes
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Enviar ticket
      </button>
    </form>
  );
}