import { useState, useCallback } from 'react';
import { getClientes, createCliente } from '../api/clienteApi';

/**
 * Hook personalizado para gestión de clientes con paginación.
 * @returns {Object} Estado y funciones de gestión de clientes
 */
export function useClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const fetchClientes = useCallback(async (page = 0, size = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getClientes(page, size);
      const data = response.data.data;
      if (data && data.content) {
        setClientes(data.content);
        setTotalPages(data.totalPages || 0);
      } else if (Array.isArray(data)) {
        setClientes(data);
      } else {
        setClientes([]);
      }
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
      return response.data;
    } catch (err) {
      const responseData = err.response?.data;
      if (responseData?.errors && responseData.errors.length > 0) {
        setError(responseData.errors.join('. '));
      } else {
        setError(responseData?.message || 'Error al crear cliente');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { clientes, loading, error, totalPages, fetchClientes, addCliente };
}
