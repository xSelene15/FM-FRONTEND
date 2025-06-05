import React, { useState } from 'react';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    paternalSurname: '',
    maternalSurname: '',
    city: '',
    country: '',
    postalCode: '',
    address: '',
    dateOfBirth: '',
    dniRut: '',
    password: '',
    phoneNumber: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.paternalSurname) newErrors.paternalSurname = 'Paternal surname is required';
    if (!formData.maternalSurname) newErrors.maternalSurname = 'Maternal surname is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (!formData.postalCode) newErrors.postalCode = 'Postal code is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.dniRut) newErrors.dniRut = 'DNI/RUT is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      console.log('Form submitted:', formData);
      // Handle successful form submission (e.g., send data to an API)
    } else {
      setErrors(validationErrors);
    }
  };

  return (



    <form onSubmit={handleSubmit}>
      <div>
        <label>First Name:</label>
        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
        {errors.firstName && <span>{errors.firstName}</span>}
      </div>
      <div>
        <label>Paternal Surname:</label>
        <input type="text" name="paternalSurname" value={formData.paternalSurname} onChange={handleChange} />
        {errors.paternalSurname && <span>{errors.paternalSurname}</span>}
      </div>
      <div>
        <label>Maternal Surname:</label>
        <input type="text" name="maternalSurname" value={formData.maternalSurname} onChange={handleChange} />
        {errors.maternalSurname && <span>{errors.maternalSurname}</span>}
      </div>
      <div>
        <label>City:</label>
        <input type="text" name="city" value={formData.city} onChange={handleChange} />
        {errors.city && <span>{errors.city}</span>}
      </div>
      <div>
        <label>Country:</label>
        <input type="text" name="country" value={formData.country} onChange={handleChange} />
        {errors.country && <span>{errors.country}</span>}
      </div>
      <div>
        <label>Postal Code:</label>
        <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} />
        {errors.postalCode && <span>{errors.postalCode}</span>}
      </div>
      <div>
        <label>Address:</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} />
        {errors.address && <span>{errors.address}</span>}
      </div>
      <div>
        <label>Date of Birth:</label>
        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
        {errors.dateOfBirth && <span>{errors.dateOfBirth}</span>}
      </div>
      <div>
        <label>DNI/RUT:</label>
        <input type="text" name="dniRut" value={formData.dniRut} onChange={handleChange} />
        {errors.dniRut && <span>{errors.dniRut}</span>}
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} />
        {errors.password && <span>{errors.password}</span>}
      </div>
      <div>
        <label>Phone Number:</label>
        <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
        {errors.phoneNumber && <span>{errors.phoneNumber}</span>}
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default RegistrationForm;