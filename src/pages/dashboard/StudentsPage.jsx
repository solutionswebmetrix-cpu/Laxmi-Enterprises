import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Search, Camera, X, Upload, FileDown, RefreshCw, Database } from 'lucide-react';
import Webcam from "react-webcam";
import { useAuth } from '../../contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';

const StudentsPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      setShowForm(true);
    }
  }, [searchParams]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState("user");
  const webcamRef = useRef(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [schoolSettings, setSchoolSettings] = useState({
    schoolName: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    father: '',
    mother: '',
    gender: 'Male',
    className: '',
    section: '',
    rollNo: '',
    dob: '',
    blood: '',
    address: '',
    mobile: '',
    photo: '',
    schoolName: '',
    cardStatus: 'Pending'
  });

  useEffect(() => {
    fetchStudents();
    fetchSchoolSettings();
  }, []);

  const fetchSchoolSettings = async () => {
    try {
      const res = await axios.get('/api/auth/school-settings');
      setSchoolSettings(res.data);
      // Auto-fill school info if not editing
      if (!editingStudent) {
        setFormData(prev => ({
          ...prev,
          schoolName: res.data.schoolName || ''
        }));
      }
    } catch (err) {
      console.error('Error fetching school settings:', err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get('/api/students');
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formDataFile = new FormData();
        formDataFile.append('photo', file);
        const res = await axios.post('/api/students/upload-photo', formDataFile, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setFormData({ ...formData, photo: res.data.url });
      } catch (err) {
        console.error('Error uploading photo:', err);
        const errorMsg = err.response?.data?.message || err.message || 'Unknown error';
        alert(`Photo upload failed: ${errorMsg}. Please check your connection or server status.`);
      }
    }
  };



  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setFormData({ ...formData, photo: imageSrc });
    setIsCameraOpen(false);
  }, [webcamRef, formData]);

  const uploadToCloudinary = async (base64Image) => {
    try {
      const response = await fetch(base64Image);
      const blob = await response.blob();
      const uploadData = new FormData();
      uploadData.append('photo', blob, 'capture.jpg');
      const res = await axios.post('/api/students/upload-photo', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data.url;
    } catch (err) {
      console.error('Cloudinary upload error', err);
      throw new Error('Photo upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.photo) {
      alert('Please select or capture a student photo');
      return;
    }

    setLoading(true);
    try {
      let submissionData = { ...formData };
      
      // If photo is base64, upload it first
      if (submissionData.photo && submissionData.photo.startsWith('data:image')) {
        submissionData.photo = await uploadToCloudinary(submissionData.photo);
      }

      if (editingStudent) {
        await axios.put(`/api/students/${editingStudent._id}`, submissionData);
        alert('Student updated successfully!');
      } else {
        await axios.post('/api/students', submissionData);
        alert('Student added successfully!');
      }
      fetchStudents();
      setShowForm(false);
      setEditingStudent(null);
      setFormData({
        name: '',
        father: '',
        mother: '',
        gender: 'Male',
        className: '',
        section: '',
        rollNo: '',
        dob: '',
        blood: '',
        address: '',
        mobile: '',
        photo: '',
        schoolName: schoolSettings.schoolName || '',
        cardStatus: 'Pending'
      });
    } catch (err) {
      console.error('Error saving student:', err);
      const serverMsg = err.response?.data?.message || err.response?.data?.error;
      const genericMsg = 'Failed to save student. Please check all fields.';
      
      if (serverMsg) {
        alert('Error: ' + serverMsg);
      } else {
        alert('Error: ' + (err.message || genericMsg));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      father: student.father,
      mother: student.mother || '',
      gender: student.gender || 'Male',
      className: student.className,
      section: student.section || '',
      rollNo: student.rollNo || '',
      dob: new Date(student.dob).toISOString().split('T')[0],
      blood: student.blood || '',
      address: student.address,
      mobile: student.mobile,
      photo: student.photo,
      schoolName: student.schoolName || schoolSettings.schoolName || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await axios.delete(`/api/students/${id}`);
        fetchStudents();
      } catch (err) {
        console.error('Error deleting student:', err);
      }
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.className.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
        <div className="flex items-center gap-2">
          {user?.role === 'admin' && (
            <button
              onClick={async () => {
                try {
                  const res = await axios.get('/api/students/export', { responseType: 'blob' });
                  const url = window.URL.createObjectURL(new Blob([res.data]));
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', 'students.xlsx');
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                } catch (err) {
                  console.error('Error exporting students:', err);
                }
              }}
              className="mr-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center font-bold text-sm shadow-md"
            >
              <FileDown size={18} className="mr-2" />
              Export Excel
            </button>
          )}
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center font-bold text-sm shadow-md"
          >
            <Plus size={20} className="mr-2" />
            Add Student
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full max-w-md"
          />
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </h2>
            
            {/* <div className="mb-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xs font-bold text-indigo-700 flex items-center gap-2">
              <Database size={16} />
              Note: Enter the college name and principal details for this student.
            </div> */}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Father's Name *</label>
                <input
                  type="text"
                  name="father"
                  value={formData.father}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mother's Name</label>
                <input
                  type="text"
                  name="mother"
                  value={formData.mother}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
                <input
                  type="text"
                  name="className"
                  value={formData.className}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                <input
                  type="text"
                  name="section"
                  value={formData.section}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Roll No.</label>
                <input
                  type="text"
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                <input
                  type="text"
                  name="blood"
                  value={formData.blood}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile *</label>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-3">Student Photo *</label>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <label className="flex flex-col items-center justify-center p-4 bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl cursor-pointer hover:bg-blue-100 transition-all group">
                    <Upload className="w-5 h-5 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-blue-700 text-xs font-bold uppercase tracking-wider">Gallery</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCameraOpen(true)}
                    className="flex flex-col items-center justify-center p-4 bg-orange-50 border-2 border-dashed border-orange-200 rounded-xl hover:bg-orange-100 transition-all group"
                  >
                    <Camera className="w-5 h-5 text-orange-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-orange-700 text-xs font-bold uppercase tracking-wider">Live Camera</span>
                  </button>
                </div>
                {formData.photo && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <img src={formData.photo} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-gray-300 shadow-sm" />
                    <div className="flex-grow">
                      <p className="text-xs font-bold text-gray-700">Photo captured/selected</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Ready to save</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, photo: ''})}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>

              <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 mt-2 mb-2">
                <div className="md:col-span-2">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">College/School Information</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">College/School Name *</label>
                  <input
                    type="text"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  />
                </div>

              </div>

              {/* Camera Modal */}
              {isCameraOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 z-[60] flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl overflow-hidden max-w-md w-full">
                    <div className="p-4 border-b flex justify-between items-center">
                      <h3 className="font-bold">Take Student Photo</h3>
                      <div className="flex items-center gap-2">
                        <button 
                          type="button"
                          onClick={() => setFacingMode(prev => (prev === "user" ? "environment" : "user"))}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="Switch Camera"
                        >
                          <RefreshCw size={20} />
                        </button>
                        <button onClick={() => setIsCameraOpen(false)} className="text-gray-500 hover:text-gray-700">
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                    <div className="aspect-video bg-black flex items-center justify-center">
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode: facingMode }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex flex-col items-center gap-2">
                      <button
                        type="button"
                        onClick={capture}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2 w-full justify-center"
                      >
                        <Camera size={20} /> Capture
                      </button>
                      <p className="text-xs text-gray-500 font-medium">
                        Current: {facingMode === "user" ? "Front Camera" : "Back Camera"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="md:col-span-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingStudent(null);
                    setFormData({
                      name: '',
                      father: '',
                      mother: '',
                      gender: 'Male',
                      className: '',
                      section: '',
                      rollNo: '',
                      dob: '',
                      blood: '',
                      address: '',
                      mobile: '',
                      photo: '',
                      schoolName: schoolSettings.schoolName || '',
                      cardStatus: 'Pending'
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingStudent ? 'Update Student' : 'Save Student'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {student.photo && (
                        <img
                          className="h-10 w-10 rounded-full mr-3"
                          src={student.photo}
                          alt={student.name}
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">Father: {student.father}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.className}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-[150px] truncate">
                    {student.schoolName || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.mobile}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      student.cardStatus === 'Printed' ? 'bg-green-100 text-green-800' : 
                      student.cardStatus === 'Generated' ? 'bg-blue-100 text-blue-800' : 
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {student.cardStatus || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(student)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3 p-2 hover:bg-indigo-50 rounded-full transition-colors"
                      title="Edit student"
                    >
                      <Edit size={18} />
                    </button>
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete student"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredStudents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No students found
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsPage;