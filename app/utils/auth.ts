export async function validarSesion() {
  try {
    const response = await fetch('/api/validate', {
      method: 'GET',
      credentials: 'include', 
    });

    const text = await response.text();
    try {
      const data = JSON.parse(text); 
      if (response.ok) {
        console.log('Sesión válida:', data); 
        return { valid: true, data }; 
      } else {
        console.error('Error:', data.message);
        return { valid: false, message: data.message };
      }
    } catch (e) {
      console.error('Error al parsear JSON:', e);
      console.error('Respuesta del servidor:', text);
      return { valid: false, message: 'Error al obtener respuesta válida del servidor' };
    }
  } catch (error) {
    console.error('Error al validar sesión:', error);
    return { valid: false, message: 'Error de red o servidor' };
  }
}
