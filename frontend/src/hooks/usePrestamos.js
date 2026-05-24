import { useState, useCallback } from 'react';
import { getPrestamos, getPrestamo, createPrestamo } from '../api/prestamoApi';

/**
 * Hook personalizado para gestión de préstamos.
 * Provee estado y operaciones para préstamos.
 * @returns {Object} Estado y funciones de gestión de préstamos
 */
export function usePrestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [prestamoActual, setPrestamoActual] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrestamos = useCallback(async (page = 0, size = 20) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPrestamos(page, size);
      setPrestamos(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar préstamos');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPrestamo = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPrestamo(id);
      setPrestamoActual(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar préstamo');
    } finally {
      setLoading(false);
    }
  }, []);

  const addPrestamo = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createPrestamo(data);
      setPrestamos((prev) => [...prev, response.data.data]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear préstamo');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    prestamos,
    prestamoActual,
    loading,
    error,
    fetchPrestamos,
    fetchPrestamo,
    addPrestamo,
  };
}
