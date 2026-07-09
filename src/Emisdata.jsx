import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import axios from 'axios';

const Emisdata = () => {
  const navigate = useNavigate();
  
  // All 21 Local Government Areas in Anambra State
  const anambraLgas = [
    'Aguata', 'Anambra East', 'Anambra West', 'Anaocha', 'Awka North', 
    'Awka South', 'Ayamelum', 'Dunukofia', 'Ekwusigo', 'Idemili North', 
    'Idemili South', 'Ihiala', 'Njikoka', 'Nnewi North', 'Nnewi South', 
    'Ogbaru', 'Onitsha North', 'Onitsha South', 'Orumba North', 
    'Orumba South', 'Oyi'
  ];

  // State for form data
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolCode: '',
    lga: '',
    numTeachers: '',
    numNonTeaching: '',
    // Class enrollment
    preNursery1: '',
    preNursery2: '',
    preNursery3: '',
    eccde1: '',
    eccde2: '',
    eccde3: '',
    primary1: '',
    primary2: '',
    primary3: '',
    primary4: '',
    primary5: '',
    primary6: '',
    // Checkboxes for class availability
    hasPreNursery1: false,
    hasPreNursery2: false,
    hasPreNursery3: false,
    hasEccde1: false,
    hasEccde2: false,
    hasEccde3: false,
    hasPrimary1: false,
    hasPrimary2: false,
    hasPrimary3: false,
    hasPrimary4: false,
    hasPrimary5: false,
    hasPrimary6: false,
    // Additional info
    principalName: '',
    contactPhone: '',
    contactEmail: '',
    schoolAddress: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Validate form before submission
  const validateForm = () => {
    const errors = {};
    if (!formData.schoolName.trim()) errors.schoolName = 'School name is required';
    if (!formData.schoolCode.trim()) errors.schoolCode = 'School code is required';
    if (!formData.lga) errors.lga = 'Please select an LGA';
    if (!formData.numTeachers || formData.numTeachers < 0) errors.numTeachers = 'Please enter a valid number of teachers';
    if (!formData.principalName.trim()) errors.principalName = 'Principal name is required';
    if (!formData.contactPhone.trim()) errors.contactPhone = 'Contact phone is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // console.log(formData);

    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.error-message');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('processemisdata.php', formData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.data.success) {
        setSuccess('School data submitted successfully!');
        // Reset form after successful submission
        const resetData = {
          schoolName: '',
          schoolCode: '',
          lga: '',
          numTeachers: '',
          numNonTeaching: '',
          preNursery1: '',
          preNursery2: '',
          preNursery3: '',
          eccde1: '',
          eccde2: '',
          eccde3: '',
          primary1: '',
          primary2: '',
          primary3: '',
          primary4: '',
          primary5: '',
          primary6: '',
          hasPreNursery1: false,
          hasPreNursery2: false,
          hasPreNursery3: false,
          hasEccde1: false,
          hasEccde2: false,
          hasEccde3: false,
          hasPrimary1: false,
          hasPrimary2: false,
          hasPrimary3: false,
          hasPrimary4: false,
          hasPrimary5: false,
          hasPrimary6: false,
          principalName: '',
          contactPhone: '',
          contactEmail: '',
          schoolAddress: ''
        };
        setFormData(resetData);
        setFormErrors({});
        
        // setTimeout(() => {
        //   navigate('/dashboard');
        // }, 3000);
      } else {
        setError(response.data.message || 'Submission failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting data. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Class fields configuration
  const classFields = [
    { id: 'preNursery1', label: 'Pre Nursery 1', checkbox: 'hasPreNursery1' },
    { id: 'preNursery2', label: 'Pre Nursery 2', checkbox: 'hasPreNursery2' },
    { id: 'preNursery3', label: 'Pre Nursery 3', checkbox: 'hasPreNursery3' },
    { id: 'eccde1', label: 'ECCDE 1', checkbox: 'hasEccde1' },
    { id: 'eccde2', label: 'ECCDE 2', checkbox: 'hasEccde2' },
    { id: 'eccde3', label: 'ECCDE 3', checkbox: 'hasEccde3' },
    { id: 'primary1', label: 'Primary 1', checkbox: 'hasPrimary1' },
    { id: 'primary2', label: 'Primary 2', checkbox: 'hasPrimary2' },
    { id: 'primary3', label: 'Primary 3', checkbox: 'hasPrimary3' },
    { id: 'primary4', label: 'Primary 4', checkbox: 'hasPrimary4' },
    { id: 'primary5', label: 'Primary 5', checkbox: 'hasPrimary5' },
    { id: 'primary6', label: 'Primary 6', checkbox: 'hasPrimary6' }
  ];

  // Group classes for better display
  const groupedClasses = {
    'Pre Nursery': classFields.slice(0, 3),
    'ECCDE': classFields.slice(3, 6),
    'Primary': classFields.slice(6, 12)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-t-xl shadow-lg p-6 border-b-4 border-blue-600">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <span className="bg-blue-600 text-white p-2 rounded-lg mr-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </span>
                EMIS School Data Form
              </h1>
              <p className="text-gray-600 mt-1 ml-1">Anambra State Education Management Information System</p>
            </div>
            {/* <Link 
              to="/dashboard" 
              className="mt-3 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link> */}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-b-xl shadow-lg p-6 md:p-8">
          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* School Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-gray-200 pb-2 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-700 p-1 rounded mr-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </span>
                School Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      formErrors.schoolName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter full school name"
                  />
                  {formErrors.schoolName && (
                    <p className="mt-1 text-sm text-red-500 error-message">{formErrors.schoolName}</p>
                  )}
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="schoolCode"
                    value={formData.schoolCode}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      formErrors.schoolCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter school code"
                  />
                  {formErrors.schoolCode && (
                    <p className="mt-1 text-sm text-red-500 error-message">{formErrors.schoolCode}</p>
                  )}
                </div> */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Local Government Area <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="lga"
                    value={formData.lga}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 bg-white ${
                      formErrors.lga ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select LGA</option>
                    {anambraLgas.map((lga, index) => (
                      <option key={index} value={lga}>
                        {lga}
                      </option>
                    ))}
                  </select>
                  {formErrors.lga && (
                    <p className="mt-1 text-sm text-red-500 error-message">{formErrors.lga}</p>
                  )}
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School Address
                  </label>
                  <input
                    type="text"
                    name="schoolAddress"
                    value={formData.schoolAddress}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                    placeholder="Enter school address"
                  />
                </div> */}
              </div>
            </div>

            {/* Staff Information Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-gray-200 pb-2 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-700 p-1 rounded mr-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </span>
                Staff Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Teachers <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="numTeachers"
                    value={formData.numTeachers}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      formErrors.numTeachers ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter number of teachers"
                  />
                  {formErrors.numTeachers && (
                    <p className="mt-1 text-sm text-red-500 error-message">{formErrors.numTeachers}</p>
                  )}
                </div>

                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Non-Teaching Staff
                  </label>
                  <input
                    type="number"
                    name="numNonTeaching"
                    value={formData.numNonTeaching}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                    placeholder="Enter number of non-teaching staff"
                  />
                </div> */}
              </div>
            </div>

            {/* Class Enrollment Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-gray-200 pb-2 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-700 p-1 rounded mr-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </span>
                Class Enrollment
              </h3>
              
              <p className="text-sm text-gray-600 mb-4">
                Kindly fill in the number of class arms in your school, for example if Primary 1 has 
                Pri 1 A, B and C, this means you will check the box for Primary 1 and then add the number 
                3 in the N0 Arms box.
                Check the box to indicate class availability and enter the number of pupils
              </p>

              {Object.entries(groupedClasses).map(([groupName, classes]) => (
                <div key={groupName} className="mb-6">
                  <h4 className="text-md font-medium text-gray-700 bg-gray-50 px-3 py-2 rounded-md mb-3">
                    {groupName}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {classes.map(({ id, label, checkbox }) => (
                      <div key={id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name={checkbox}
                            checked={formData[checkbox]}
                            onChange={handleChange}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors duration-200"
                          />
                          <label className="ml-3 text-sm font-medium text-gray-700 min-w-[100px]">
                            {label}
                          </label>
                        </div>
                        <input
                          type="number"
                          name={id}
                          value={formData[id]}
                          onChange={handleChange}
                          disabled={!formData[checkbox]}
                          className={`w-27 px-3 py-1.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                            !formData[checkbox] 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                              : 'bg-white border-gray-300'
                          }`}
                          placeholder="N0 Arms"
                          min="0"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Information Section */}
            {/* <div>
              <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-gray-200 pb-2 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-700 p-1 rounded mr-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Principal Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="principalName"
                    value={formData.principalName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      formErrors.principalName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter principal's full name"
                  />
                  {formErrors.principalName && (
                    <p className="mt-1 text-sm text-red-500 error-message">{formErrors.principalName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                      formErrors.contactPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter phone number"
                  />
                  {formErrors.contactPhone && (
                    <p className="mt-1 text-sm text-red-500 error-message">{formErrors.contactPhone}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                    placeholder="Enter email address"
                  />
                </div>
              </div>
            </div> */}

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t-2 border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit School Data'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Emisdata;