import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { validateRequired, validateEmail, validatePhone } from '../../utils/validators';

/**
 * Formulario de alta de clientes.
 * @param {Object} props
 * @param {Function} props.onSubmit - Callback al enviar el formulario
 * @param {boolean} props.loading - Estado de carga
 */
function ClienteForm({ onSubmit, loading }) {
  const [form, setForm] = useState({ documento: '', razonSocial: '', responsable: '', telefono: '', email: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    newErrors.documento = validateRequired(form.documento, 'Documento');
    newErrors.razonSocial = validateRequired(form.razonSocial, 'Razón social');
    newErrors.responsable = validateRequired(form.responsable, 'Responsable');
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Documento (DNI/CUIT)" id="documento" value={form.documento}
        onChange={handleChange('documento')} error={errors.documento} placeholder="12345678 o 20-12345678-9" />
      <Input label="Razón Social" id="razonSocial" value={form.razonSocial}
        onChange={handleChange('razonSocial')} error={errors.razonSocial} placeholder="Nombre del comercio" />
      <Input label="Responsable" id="responsable" value={form.responsable}
        onChange={handleChange('responsable')} error={errors.responsable} placeholder="Persona responsable" />
      <Input label="Teléfono" id="telefono" value={form.telefono}
        onChange={handleChange('telefono')} error={errors.telefono} placeholder="+54 11 1234-5678" />
      <Input label="Email" id="email" type="email" value={form.email}
        onChange={handleChange('email')} error={errors.email} placeholder="contacto@comercio.com" />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Registrando...' : 'Registrar Cliente'}
      </Button>
    </form>
  );
}

export default ClienteForm;
