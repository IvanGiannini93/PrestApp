import { useState, useCallback } from 'react';
import { getClientes, createCliente } from '../api/clienteApi';

/**
 * Hook personalizado para gestión de clientes.
 * Provee estado y operaciones CRUD para clientes.
 * @returns {Object} Estado y funciones de gestión de clientes
 */
export function useClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getClientes();
      setClientes(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  }, []);

  const addCliente = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createCliente(data);
      setClientes((prev) => [...prev, response.data.data]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear cliente');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { clientes, loading, error, fetchClientes, addCliente };
}
