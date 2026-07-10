import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import axios from 'axios';

const Trackemis = () => {
  const navigate = useNavigate();
  const fetchemisdata = "https://asubeb.esbatech.org/attendance/fetchemisdata.php";
  
  // State variables
  const [schoolData, setSchoolData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLga, setSelectedLga] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [lgas, setLgas] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Overall statistics - FROM BACKEND (ALL records in database)
  const [overallStats, setOverallStats] = useState({
    total_schools: 0,
    total_teachers: 0,
    total_pupils: 0,
    total_lgas: 0
  });

  // Fetch data when dependencies change
  useEffect(() => {
    fetchSchoolData();
  }, [searchTerm, selectedLga, currentPage, sortField, sortDirection]);

  // Fetch school data from API
  const fetchSchoolData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const requestData = {
        search: searchTerm,
        lga: selectedLga,
        page: currentPage,
        limit: itemsPerPage,
        sort: sortField,
        order: sortDirection.toUpperCase()
      };

      // console.log('Sending request:', requestData);

      const response = await axios.post(fetchemisdata, requestData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      // console.log('Response:', response.data);

      // Check if response is successful
      if (response.data && response.data.code === "sw321") {
        let data = [];
        let total = 0;
        let stats = {
          total_schools: 0,
          total_teachers: 0,
          total_pupils: 0,
          total_lgas: 0
        };
        
        // Handle different response structures
        if (response.data.msg && typeof response.data.msg === 'object') {
          data = response.data.msg.data || [];
          total = response.data.msg.total || 0;
          
          // Get overall stats from backend
          if (response.data.msg.overall_stats) {
            stats = response.data.msg.overall_stats;
          }
          
          setCurrentPage(response.data.msg.page || 1);
        } else if (response.data.data) {
          data = response.data.data || [];
          total = response.data.total || 0;
          
          // Get overall stats from backend
          if (response.data.overall_stats) {
            stats = response.data.overall_stats;
          }
        } else {
          data = response.data.msg || [];
          total = data.length;
        }

        setSchoolData(data);
        setTotalRecords(total);
        setTotalPages(Math.ceil(total / itemsPerPage));
        
        // UPDATE OVERALL STATS FROM BACKEND (NOT CALCULATED FROM PAGINATED DATA)
        setOverallStats(stats);

        // Extract unique LGAs for filter
        if (data && data.length > 0) {
          const uniqueLgas = [...new Set(data.map(item => item.lga).filter(Boolean))];
          setLgas(uniqueLgas);
        }
      } else {
        setError(response.data?.msg || 'Failed to fetch data');
        setSchoolData([]);
        setTotalRecords(0);
        setTotalPages(0);
      }
    } catch (err) {
      // console.error('Error fetching school data:', err);
      // console.error('Error response:', err.response?.data);
      
      if (err.response) {
        setError(`Server error: ${err.response.status} - ${err.response.statusText}`);
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('Error: ' + err.message);
      }
      
      setSchoolData([]);
      setTotalRecords(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle LGA filter change
  const handleLgaFilter = (e) => {
    setSelectedLga(e.target.value);
    setCurrentPage(1);
  };

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Handle pagination
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedLga('');
    setCurrentPage(1);
  };

  // View school details
  const viewSchoolDetails = (school) => {
    setSelectedSchool(school);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedSchool(null);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-NG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Get class count summary for a single school
  const getClassSummary = (school) => {
    const classes = [
      { has: school.has_pre_nursery_1, count: school.pre_nursery_1 },
      { has: school.has_pre_nursery_2, count: school.pre_nursery_2 },
      { has: school.has_pre_nursery_3, count: school.pre_nursery_3 },
      { has: school.has_eccde_1, count: school.eccde_1 },
      { has: school.has_eccde_2, count: school.eccde_2 },
      { has: school.has_eccde_3, count: school.eccde_3 },
      { has: school.has_primary_1, count: school.primary_1 },
      { has: school.has_primary_2, count: school.primary_2 },
      { has: school.has_primary_3, count: school.primary_3 },
      { has: school.has_primary_4, count: school.primary_4 },
      { has: school.has_primary_5, count: school.primary_5 },
      { has: school.has_primary_6, count: school.primary_6 }
    ];
    
    const activeClasses = classes.filter(c => c.has === '1' || c.has === 1);
    const totalPupils = activeClasses.reduce((sum, c) => sum + parseInt(c.count || 0), 0);
    
    return { active: activeClasses.length, total: totalPupils };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-t-xl shadow-lg p-6 border-b-4 border-blue-600">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                <span className="bg-blue-600 text-white p-2 rounded-lg mr-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                </span>
                EMIS School Records
              </h1>
              <p className="text-gray-600 mt-1 ml-1">Anambra State Education Management Information System</p>
            </div>
            {/* <Link 
              to="/dashboard" 
              className="mt-3 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100/80 backdrop-blur-sm hover:bg-blue-200/80 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link> */}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-lg rounded-b-xl shadow-lg p-6">
          {/* Filters and Search */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search School
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by school name..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 backdrop-blur-sm"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by LGA
              </label>
              <select
                value={selectedLga}
                onChange={handleLgaFilter}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/70 backdrop-blur-sm"
              >
                <option value="">All LGAs</option>
                {lgas.map((lga, index) => (
                  <option key={index} value={lga}>
                    {lga}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end justify-end space-x-2">
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-100/80 backdrop-blur-sm text-gray-700 rounded-lg hover:bg-gray-200/80 transition-colors duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset Filters
              </button>
              <button
                onClick={fetchSchoolData}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Summary - Glassmorphism Design with Overall Stats from Backend */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/30 backdrop-blur-xl rounded-xl p-5 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Schools</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{overallStats.total_schools.toLocaleString()}</p>
                </div>
                {/* <div className="bg-blue-500/20 p-3 rounded-full backdrop-blur-sm">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div> */}
              </div>
              <p className="text-xs text-gray-500 mt-2">All records in database</p>
            </div>

            <div className="bg-white/30 backdrop-blur-xl rounded-xl p-5 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Total LGAs</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{overallStats.total_lgas.toLocaleString()}</p>
                </div>
                {/* <div className="bg-green-500/20 p-3 rounded-full backdrop-blur-sm">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div> */}
              </div>
              <p className="text-xs text-gray-500 mt-2">Unique LGAs in database</p>
            </div>

            <div className="bg-white/30 backdrop-blur-xl rounded-xl p-5 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Total Teachers</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{overallStats.total_teachers.toLocaleString()}</p>
                </div>
                {/* <div className="bg-purple-500/20 p-3 rounded-full backdrop-blur-sm">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div> */}
              </div>
              <p className="text-xs text-gray-500 mt-2">All teachers in database</p>
            </div>

            <div className="bg-white/30 backdrop-blur-xl rounded-xl p-5 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Total Pupils</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{overallStats.total_pupils.toLocaleString()}</p>
                </div>
                {/* <div className="bg-orange-500/20 p-3 rounded-full backdrop-blur-sm">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div> */}
              </div>
              <p className="text-xs text-gray-500 mt-2">All pupils in database</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 text-red-700 rounded">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* Table */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50/80 backdrop-blur-sm">
                    <tr>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                        onClick={() => handleSort('school_name')}
                      >
                        <div className="flex items-center">
                          School Name
                          {sortField === 'school_name' && (
                            <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                        onClick={() => handleSort('lga')}
                      >
                        <div className="flex items-center">
                          LGA
                          {sortField === 'lga' && (
                            <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Teachers
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Classes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pupils
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                        onClick={() => handleSort('created_at')}
                      >
                        <div className="flex items-center">
                          Submitted
                          {sortField === 'created_at' && (
                            <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-200">
                    {schoolData.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="mt-2">No school records found</p>
                          <p className="text-sm mt-1">Try adjusting your search or filters</p>
                        </td>
                      </tr>
                    ) : (
                      schoolData.map((school, index) => {
                        const summary = getClassSummary(school);
                        return (
                          <tr key={school.id || index} className="hover:bg-white/50 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {school.school_name.toUpperCase() || 'N/A'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100/80 backdrop-blur-sm text-blue-800">
                                {school.lga || 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {school.num_teachers || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              <span className="font-medium">{summary.active}</span>
                              <span className="text-gray-400 ml-1">classes</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              <span className="font-medium">{summary.total}</span>
                              <span className="text-gray-400 ml-1">pupils</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(school.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                onClick={() => viewSchoolDetails(school)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 0 && (
                <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-4">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white/70 backdrop-blur-sm hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white/70 backdrop-blur-sm hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">
                          {schoolData.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0}
                        </span> to{' '}
                        <span className="font-medium">
                          {Math.min(currentPage * itemsPerPage, totalRecords)}
                        </span>{' '}
                        of <span className="font-medium">{totalRecords}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white/70 backdrop-blur-sm text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 10) {
                            pageNum = i + 1;
                          } else if (currentPage <= 6) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 5) {
                            pageNum = totalPages - 9 + i;
                          } else {
                            pageNum = currentPage - 5 + i;
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => paginate(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === pageNum
                                  ? 'z-10 bg-blue-50/80 backdrop-blur-sm border-blue-500 text-blue-600'
                                  : 'bg-white/70 backdrop-blur-sm border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        {totalPages > 10 && currentPage < totalPages - 5 && (
                          <>
                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white/70 backdrop-blur-sm text-sm font-medium text-gray-700">
                              ...
                            </span>
                            <button
                              onClick={() => paginate(totalPages)}
                              className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white/70 backdrop-blur-sm text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                              {totalPages}
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white/70 backdrop-blur-sm text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* View Details Modal with Glassmorphism */}
      {showModal && selectedSchool && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">School Details</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">School Name</p>
                  <p className="font-medium">{selectedSchool.school_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">LGA</p>
                  <p className="font-medium">{selectedSchool.lga || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Number of Teachers</p>
                  <p className="font-medium">{selectedSchool.num_teachers || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date Submitted</p>
                  <p className="font-medium">{formatDate(selectedSchool.created_at)}</p>
                </div>
              </div>

              <h4 className="font-semibold text-gray-700 mb-3 border-b pb-2">Class Enrollment Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Pre Nursery */}
                <div className="bg-blue-50/80 backdrop-blur-sm p-3 rounded-lg border border-blue-100/50">
                  <h5 className="font-medium text-blue-800 mb-2">Pre Nursery</h5>
                  <div className="space-y-1 text-sm">
                    <p>Class 1: {selectedSchool.has_pre_nursery_1 === '1' || selectedSchool.has_pre_nursery_1 === 1 ? selectedSchool.pre_nursery_1 || 0 : 'N/A'}</p>
                    <p>Class 2: {selectedSchool.has_pre_nursery_2 === '1' || selectedSchool.has_pre_nursery_2 === 1 ? selectedSchool.pre_nursery_2 || 0 : 'N/A'}</p>
                    <p>Class 3: {selectedSchool.has_pre_nursery_3 === '1' || selectedSchool.has_pre_nursery_3 === 1 ? selectedSchool.pre_nursery_3 || 0 : 'N/A'}</p>
                  </div>
                </div>

                {/* ECCDE */}
                <div className="bg-green-50/80 backdrop-blur-sm p-3 rounded-lg border border-green-100/50">
                  <h5 className="font-medium text-green-800 mb-2">ECCDE</h5>
                  <div className="space-y-1 text-sm">
                    <p>Class 1: {selectedSchool.has_eccde_1 === '1' || selectedSchool.has_eccde_1 === 1 ? selectedSchool.eccde_1 || 0 : 'N/A'}</p>
                    <p>Class 2: {selectedSchool.has_eccde_2 === '1' || selectedSchool.has_eccde_2 === 1 ? selectedSchool.eccde_2 || 0 : 'N/A'}</p>
                    <p>Class 3: {selectedSchool.has_eccde_3 === '1' || selectedSchool.has_eccde_3 === 1 ? selectedSchool.eccde_3 || 0 : 'N/A'}</p>
                  </div>
                </div>

                {/* Primary */}
                <div className="bg-purple-50/80 backdrop-blur-sm p-3 rounded-lg border border-purple-100/50">
                  <h5 className="font-medium text-purple-800 mb-2">Primary</h5>
                  <div className="space-y-1 text-sm">
                    <p>Class 1: {selectedSchool.has_primary_1 === '1' || selectedSchool.has_primary_1 === 1 ? selectedSchool.primary_1 || 0 : 'N/A'}</p>
                    <p>Class 2: {selectedSchool.has_primary_2 === '1' || selectedSchool.has_primary_2 === 1 ? selectedSchool.primary_2 || 0 : 'N/A'}</p>
                    <p>Class 3: {selectedSchool.has_primary_3 === '1' || selectedSchool.has_primary_3 === 1 ? selectedSchool.primary_3 || 0 : 'N/A'}</p>
                    <p>Class 4: {selectedSchool.has_primary_4 === '1' || selectedSchool.has_primary_4 === 1 ? selectedSchool.primary_4 || 0 : 'N/A'}</p>
                    <p>Class 5: {selectedSchool.has_primary_5 === '1' || selectedSchool.has_primary_5 === 1 ? selectedSchool.primary_5 || 0 : 'N/A'}</p>
                    <p>Class 6: {selectedSchool.has_primary_6 === '1' || selectedSchool.has_primary_6 === 1 ? selectedSchool.primary_6 || 0 : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white/80 backdrop-blur-xl border-t border-gray-200 px-6 py-4 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trackemis;