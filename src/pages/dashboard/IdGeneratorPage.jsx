import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Download, FileText, Search, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const IdGeneratorPage = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]); // Array of student IDs for multi-select
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Pending');
  const [schoolData, setSchoolData] = useState({
    schoolName: '',
    schoolTagline: ''
  });
  const idCardRef = useRef(null);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('/api/students');
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const fetchSchoolSettings = async () => {
    try {
      const res = await axios.get('/api/auth/school-settings');
      setSchoolData({
        schoolName: res.data.schoolName || 'Your College Name',
        schoolTagline: res.data.schoolTagline || 'Excellence in Education'
      });
    } catch (err) {
      console.error('Error fetching school settings:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchSchoolSettings();
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        student.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || student.cardStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDownloadSingle = async () => {
    if (!selectedStudent) return;
    const canvas = await html2canvas(idCardRef.current, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 10, 10, 80, 130);
    pdf.save(`${selectedStudent.name}-id-card.pdf`);

    // Update status to Printed
    try {
      await axios.patch(`/api/students/${selectedStudent._id}/status`, { cardStatus: 'Printed' });
      fetchStudents();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDownloadBulk = async () => {
    if (students.length === 0) return;
    const pdf = new jsPDF('l', 'mm', 'a4'); // Use Landscape for 10 cards (5x2)
    let x = 10;
    let y = 10;
    const cardWidth = 54;
    const cardHeight = 86;
    const marginX = 3;
    const marginY = 5;

    for (let i = 0; i < students.length; i++) {
      setSelectedStudent(students[i]);
      // Wait for re-render
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(idCardRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');

      pdf.addImage(imgData, 'PNG', x, y, cardWidth, cardHeight);

      // Update status to Printed
      try {
        await axios.patch(`/api/students/${students[i]._id}/status`, { cardStatus: 'Printed' });
      } catch (err) {
        console.error('Error updating status for bulk:', err);
      }

      x += cardWidth + marginX;
      // After 5 cards, wrap to next row or next page
      if ((i + 1) % 5 === 0) {
        x = 10;
        y += cardHeight + marginY;
      }
      
      // After 10 cards, add a new page
      if ((i + 1) % 10 === 0 && i < students.length - 1) {
        pdf.addPage('l', 'mm', 'a4');
        x = 10;
        y = 10;
      }
    }
    pdf.save('bulk-id-cards.pdf');
    fetchStudents();
  };

  const handleSelectAll = () => {
    const allFilteredSelected = filteredStudents.length > 0 && 
                               filteredStudents.every(s => selectedIds.includes(s._id));
    
    if (allFilteredSelected) {
      // Deselect only the currently visible ones
      const filteredIds = filteredStudents.map(s => s._id);
      setSelectedIds(selectedIds.filter(id => !filteredIds.includes(id)));
    } else {
      // Select all currently visible ones, keeping existing ones from other filters
      const filteredIds = filteredStudents.map(s => s._id);
      setSelectedIds([...new Set([...selectedIds, ...filteredIds])]);
    }
  };

  const toggleSelectStudent = (e, id) => {
    e.stopPropagation();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} student records? This action cannot be undone.`)) {
      try {
        await axios.post('/api/students/bulk-delete', { studentIds: selectedIds });
        setSelectedIds([]);
        setSelectedStudent(null);
        fetchStudents();
        alert('Students deleted successfully.');
      } catch (err) {
        console.error('Error in bulk delete:', err);
        alert(err.response?.data?.message || 'Failed to delete students.');
      }
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student record? This action cannot be undone.')) {
      try {
        await axios.delete(`/api/students/${studentId}`);
        setSelectedStudent(null);
        fetchStudents();
      } catch (err) {
        console.error('Error deleting student:', err);
        alert('Failed to delete student.');
      }
    }
  };

  const standardTemplate = {
    bgColor: '#1e40af', // Professional Navy Blue
    accentColor: '#f97316', // Professional Orange
    textColor: '#ffffff'
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ID Card Generator</h1>
          <p className="text-gray-500 mt-1">Select a student to generate their ID card</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full md:w-64"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Pending">Pending (Wait for print)</option>
            <option value="Printed">Already Printed</option>
            <option value="All">All Students</option>
          </select>
          <button
            onClick={handleDownloadBulk}
            disabled={filteredStudents.length === 0}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <FileText size={20} />
            Download Bulk (PDF)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Student Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col max-h-[700px]">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                {user?.role === 'admin' && filteredStudents.length > 0 && (
                  <input
                    type="checkbox"
                    checked={filteredStudents.length > 0 && filteredStudents.every(s => selectedIds.includes(s._id))}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    title="Select All"
                  />
                )}
                <h2 className="font-bold text-gray-700">Student List ({filteredStudents.length})</h2>
              </div>
              {selectedIds.length > 0 && (
                <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {selectedIds.length} Selected
                </span>
              )}
            </div>
            <div className="overflow-y-auto flex-grow">
              {filteredStudents.map((student) => (
                <div
                  key={student._id}
                  onClick={() => setSelectedStudent(student)}
                  className={`w-full p-4 text-left border-b hover:bg-gray-50 transition-colors flex items-center gap-3 relative group cursor-pointer ${
                    selectedStudent?._id === student._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  {user?.role === 'admin' && (
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(student._id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleSelectStudent(e, student._id);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  )}
                  {student.photo && (
                    <img src={student.photo} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                  )}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-gray-900 truncate">{student.name}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        student.cardStatus === 'Printed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {student.cardStatus || 'Pending'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{student.className}</p>
                  </div>
                  {user?.role === 'admin' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(student._id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-full transition-all"
                      title="Delete student"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              {filteredStudents.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <Search size={40} className="mx-auto mb-2 opacity-20" />
                  <p>No students found for this filter</p>
                </div>
              )}
            </div>
          </div>

          {/* Download Buttons */}
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Download</h2>
            <div className="space-y-3">
              <button
                onClick={handleDownloadSingle}
                disabled={!selectedStudent}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mb-3"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Single Card
              </button>

              {user?.role === 'admin' && (
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <p className="text-sm font-bold text-gray-700 mb-1">Admin Actions</p>
                  
                  {/* Bulk Delete Button */}
                  <button
                    onClick={handleBulkDelete}
                    disabled={selectedIds.length === 0}
                    className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 flex items-center justify-center transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Delete Selected ({selectedIds.length})
                  </button>

                  {/* Single Delete Button */}
                  <button
                    onClick={() => selectedStudent && handleDelete(selectedStudent._id)}
                    disabled={!selectedStudent}
                    className="w-full bg-red-50 text-red-600 py-3 px-4 rounded-lg hover:bg-red-100 border border-red-200 flex items-center justify-center transition-colors font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Delete Single Record
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ID Card Preview */}
        <div className="lg:col-span-2 flex justify-center">
          {selectedStudent ? (
            <div className="sticky top-6">
              <div
                ref={idCardRef}
                className="w-[320px] h-[520px] font-sans overflow-hidden flex flex-col relative"
                style={{
                  borderRadius: '4px',
                  backgroundColor: standardTemplate.bgColor,
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                  border: '1px solid #f3f4f6'
                }}
              >
                <div className="py-4 px-2 flex items-center relative" style={{ color: '#ffffff' }}>
                  <div className="flex-grow text-center ml-12">
                    <h3 className="font-extrabold text-[15px] leading-tight uppercase tracking-tight" style={{ color: '#ffffff' }}>
                      {selectedStudent.schoolName || schoolData.schoolName}
                    </h3>
                  </div>
                </div>

                <div className="text-center py-1.5 italic text-[11px] font-bold border-b" style={{ color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.2)', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
                  {schoolData.schoolTagline}
                </div>

                <div className="mt-3 relative h-8 flex items-center">
                  <div
                    className="py-1.5 px-10 text-[11px] font-black uppercase rounded-r-full shadow-md z-10"
                    style={{ backgroundColor: standardTemplate.accentColor, color: '#ffffff' }}
                  >
                    STUDENT ID CARD
                  </div>
                  <div
                    className="absolute top-[-30px] left-0 w-24 h-24 rounded-full -translate-x-12 z-0 opacity-20"
                    style={{ backgroundColor: standardTemplate.accentColor }}
                  />
                </div>

                <div className="flex justify-center mt-6">
                  <div
                    className="w-36 h-40 rounded-3xl border-[6px] flex items-center justify-center overflow-hidden shadow-md"
                    style={{ borderColor: standardTemplate.accentColor, backgroundColor: '#f0f9ff' }}
                  >
                    {selectedStudent.photo ? (
                      <img src={selectedStudent.photo} alt="Student" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center" style={{ color: '#93c5fd' }}>
                        <svg className="w-16 h-16 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        <span className="text-[9px] font-black uppercase tracking-widest mt-1">Photo</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-8 mt-6 flex-grow">
                  <div className="space-y-1.5 text-[12px] font-bold" style={{ color: '#ffffff' }}>
                    <div className="flex items-start">
                      <span className="w-24 shrink-0">Name</span>
                      <span className="mr-3">:</span>
                      <span className="uppercase text-[13px]">{selectedStudent.name}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-24 shrink-0">Father</span>
                      <span className="mr-3">:</span>
                      <span>{selectedStudent.father}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-24 shrink-0">Class</span>
                      <span className="mr-3">:</span>
                      <span>{selectedStudent.className}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-24 shrink-0">DOB</span>
                      <span className="mr-3">:</span>
                      <span>{new Date(selectedStudent.dob).toLocaleDateString()}</span>
                    </div>
                    {selectedStudent.blood && (
                      <div className="flex items-start">
                        <span className="w-24 shrink-0">Blood</span>
                        <span className="mr-3">:</span>
                        <span>{selectedStudent.blood}</span>
                      </div>
                    )}
                    <div className="flex items-start">
                      <span className="w-24 shrink-0">Phone</span>
                      <span className="mr-3">:</span>
                      <span>{selectedStudent.mobile}</span>
                    </div>

                    <div className="pt-2 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                      <p className="leading-tight text-[11px]">
                        Address: <span className="font-semibold">{selectedStudent.address}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative h-24 mt-auto">
                  <div
                    className="absolute bottom-0 left-0 w-full h-12 rounded-t-[60px] flex items-end justify-center pb-2"
                    style={{ backgroundColor: standardTemplate.accentColor }}
                  >
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-20">
              <div className="text-6xl mb-4">🎓</div>
              <p className="text-xl">Select a student to preview ID card</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IdGeneratorPage;