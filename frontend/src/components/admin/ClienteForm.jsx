import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { validateRequired, validateEmail, validatePhone } from '../../utils/validators';

/**
 * Formulario de alta de clientes.
 */
function ClienteForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    nombre: '', apellido: '', documento: '', telefono: '', email: '', razonSocial: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    newErrors.nombre = validateRequired(form.nombre, 'Nombre');
    newErrors.apellido = validateRequired(form.apellido, 'Apellido');
    newErrors.documento = validateRequired(form.documento, 'Documento');
    newErrors.telefono = validatePhone(form.telefono);
    newErrors.email = validateEmail(form.email);

    const filtered = Object.fromEntries(Object.entries(newErrors).filter(([, v]) => v !== null));
    setErrors(filtered);
    return Object.keys(filtered).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    }
  };

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: null });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Datos personales */}
      <div>
        <p className="text-sm font-medium text-gray-600 mb-3">Datos personales</p>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Nombre *" id="nombre" value={form.nombre}
            onChange={handleChange('nombre')} error={errors.nombre} placeholder="Juan" />
          <Input label="Apellido *" id="apellido" value={form.apellido}
            onChange={handleChange('apellido')} error={errors.apellido} placeholder="Pérez" />
        </div>
        <div className="mt-3">
          <Input label="Documento (DNI/CUIT) *" id="documento" value={form.documento}
            onChange={handleChange('documento')} error={errors.documento} placeholder="12345678" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <Input label="Teléfono *" id="telefono" value={form.telefono}
            onChange={handleChange('telefono')} error={errors.telefono} placeholder="1112345678" />
          <Input label="Email *" id="email" type="email" value={form.email}
            onChange={handleChange('email')} error={errors.email} placeholder="juan@email.com" />
        </div>
      </div>

      {/* Datos del comercio */}
      <div className="border-t pt-4">
        <p className="text-sm font-medium text-gray-600 mb-3">Datos del comercio <span className="text-gray-400 font-normal">(opcional)</span></p>
        <Input label="Nombre del comercio" id="razonSocial" value={form.razonSocial}
          onChange={handleChange('razonSocial')} placeholder="Mi Negocio S.R.L." />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Registrando...' : 'Registrar Cliente'}
      </Button>
    </form>
  );
}

export default ClienteForm;
