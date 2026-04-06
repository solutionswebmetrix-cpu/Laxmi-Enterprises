import React, { useState, useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import Webcam from "react-webcam";
import { Camera, X, RefreshCw, Upload } from 'lucide-react';

const IdCard = () => {
  const { isAuthenticated } = useAuth();
  const [saveStatus, setSaveStatus] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const webcamRef = useRef(null);
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolTagline: '',
    studentName: '',
    fatherName: '',
    motherName: '',
    className: '',
    section: '',
    rollNo: '',
    idNo: '',
    dob: '',
    gender: 'Male',
    bloodGroup: '',
    phone: '',
    address: '',
    photo: null,
  });

  const idCardRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setFormData({ ...formData, photo: imageSrc });
    setIsCameraOpen(false);
  }, [webcamRef, formData]);

  const uploadToCloudinary = async (base64Image) => {
    try {
      // Create a blob from base64
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

  const handleDownload = async () => {
    // Attempt to save to database only if authenticated
    if (isAuthenticated) {
      if (!formData.studentName || !formData.fatherName || !formData.className || !formData.dob || !formData.phone || !formData.address || !formData.photo) {
        const missing = [];
        if (!formData.studentName) missing.push('Student Name');
        if (!formData.fatherName) missing.push('Father Name');
        if (!formData.className) missing.push('Class');
        if (!formData.dob) missing.push('Date of Birth');
        if (!formData.phone) missing.push('Phone Number');
        if (!formData.address) missing.push('Address');
        if (!formData.photo) missing.push('Photo');

        setSaveStatus('error');
        alert(`Please fill all required fields: ${missing.join(', ')}`);
        setTimeout(() => setSaveStatus(null), 5000);
        return;
      }

      setSaveStatus('saving');
      try {
        let photoUrl = formData.photo;
        
        // If it's a base64 string, upload to Cloudinary first
        if (photoUrl && photoUrl.startsWith('data:image')) {
          photoUrl = await uploadToCloudinary(photoUrl);
        }

        await axios.post('/api/students', {
          name: formData.studentName,
          father: formData.fatherName,
          mother: formData.motherName, 
          className: formData.className, 
          section: formData.section,
          rollNo: formData.rollNo,
          dob: formData.dob,
          gender: formData.gender,
          blood: formData.bloodGroup,
          address: formData.address,
          mobile: formData.phone,
          photo: photoUrl
        });
        setSaveStatus('success');
        console.log('Student data saved to database');
        setTimeout(() => setSaveStatus(null), 3000);
      } catch (err) {
        setSaveStatus('error');
        console.error('Error saving student to database:', err.response?.data || err.message);
        setTimeout(() => setSaveStatus(null), 5000);
      }
    } else {
      console.log('Guest user: Skipping database save');
    }

    if (idCardRef.current) {
      html2canvas(idCardRef.current, {
        scale: 3, // Very high quality
        useCORS: true,
        backgroundColor: '#ffffff',
      }).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `${formData.studentName || 'id-card'}.png`;
        link.click();
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl items-start">
        {/* Form Section */}
        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-blue-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Generate ID Card</h2>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">School / College Name</label>
              <input
                type="text"
                name="schoolName"
                
                value={formData.schoolName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Tagline</label>
              <input
                type="text"
                name="schoolTagline"
             
                value={formData.schoolTagline}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Student Name</label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Father's Name</label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Mother's Name</label>
              <input
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Class</label>
              <input
                type="text"
                name="className"
                value={formData.className}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Section</label>
              <input
                type="text"
                name="section"
                value={formData.section}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Roll No.</label>
              <input
                type="text"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">ID No.</label>
              <input
                type="text"
                name="idNo"
                value={formData.idNo}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Date of Birth</label>
              <input
                type="date"
                name="dob"
                
                value={formData.dob}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Blood Group</label>
              <input
                type="text"
                name="bloodGroup"
                
                value={formData.bloodGroup}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Full Address</label>
              <textarea
                name="address"
                rows="2"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all duration-200 resize-none"
              ></textarea>
            </div>



            <div className="md:col-span-2 space-y-3">
              <label className="text-sm font-bold text-slate-700 ml-1">Student Photo Upload</label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col items-center justify-center p-4 bg-blue-50 border-2 border-dashed border-blue-200 rounded-2xl cursor-pointer hover:bg-blue-100 transition-all group">
                  <Upload className="w-6 h-6 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-blue-700 text-xs font-bold uppercase tracking-wider">From Gallery</span>
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setIsCameraOpen(true)}
                  className="flex flex-col items-center justify-center p-4 bg-orange-50 border-2 border-dashed border-orange-200 rounded-2xl hover:bg-orange-100 transition-all group"
                >
                  <Camera className="w-6 h-6 text-orange-500 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-orange-700 text-xs font-bold uppercase tracking-wider">Live Camera</span>
                </button>
              </div>
              {formData.photo && (
                <div className="mt-2 flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <img src={formData.photo} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-slate-300" />
                  <div className="flex-grow">
                    <p className="text-xs font-bold text-slate-700">Photo Ready</p>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Captured/Uploaded</p>
                  </div>
                  <button 
                    onClick={() => setFormData({...formData, photo: null})}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

            {/* Camera Modal */}
            {isCameraOpen && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl">
                  <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Capture Student Photo</h3>
                    <button onClick={() => setIsCameraOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="relative aspect-video bg-black flex items-center justify-center">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6 flex justify-center gap-4">
                    <button
                      type="button"
                      onClick={capture}
                      className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                    >
                      <Camera size={20} /> Capture Photo
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* ID Card Preview Section */}
        <div className="sticky top-24 flex flex-col items-center">
          <div 
            ref={idCardRef} 
            className="w-[320px] h-[540px] font-sans overflow-hidden flex flex-col relative"
            style={{ 
              borderRadius: '4px',
              backgroundColor: '#ffffff',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              border: '1px solid #f1f5f9'
            }}
          >
            
            <div className="py-4 px-2 flex items-center relative" style={{ backgroundColor: '#6390e9' }}>
              {/* Logo Mock */}
              {/* <div className="w-14 h-14 bg-white rounded-full flex flex-col items-center justify-center absolute left-2 border-2 border-blue-900 shadow-sm">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-black text-lg mb-0.5"></div>
              </div> */}
              
              <div className="flex-grow text-center ml-12">
                <h3 className="text-white font-extrabold text-[15px] leading-tight uppercase tracking-tight">
                  {formData.schoolName || ''}
                </h3>
              </div>
            </div>

            {/* Tagline */}
            <div className="text-center py-1.5 italic text-[11px] font-bold border-b" style={{ color: '#334155', backgroundColor: 'rgba(248, 250, 252, 0.5)', borderColor: '#f8fafc' }}>
              {formData.schoolTagline || ''}
            </div>

            {/* Title Bar - Orange with Curve */}
            <div className="mt-3 relative h-8 flex items-center">
              <div className="text-white py-1.5 px-10 text-[11px] font-black uppercase rounded-r-full shadow-md z-10" style={{ backgroundColor: '#f97316' }}>
                STUDENT ID CARD
              </div>
              {/* Curve design on left */}
              <div className="absolute top-[-30px] left-0 w-24 h-24 opacity-10 rounded-full -translate-x-12 z-0" style={{ backgroundColor: '#f97316' }}></div>
            </div>

            {/* Photo Section */}
            <div className="flex justify-center mt-6">
              <div className="w-36 h-40 rounded-3xl border-[6px] flex items-center justify-center overflow-hidden shadow-md" style={{ backgroundColor: '#f0f9ff', borderColor: '#7dd3fc' }}>
                {formData.photo ? (
                  <img src={formData.photo} alt="Student" className="w-full h-full object-cover" />
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

            {/* Details Section */}
            <div className="px-8 mt-4 flex-grow">
              <div className="space-y-1 text-[11px] font-bold" style={{ color: '#0f172a' }}>
                <div className="flex items-start">
                  <span className="w-24 shrink-0">Name</span>
                  <span className="mr-3">:</span>
                  <span className="uppercase text-[12px]">{formData.studentName || ''}</span>
                </div>
                <div className="flex items-start">
                  <span className="w-24 shrink-0">Father</span>
                  <span className="mr-3">:</span>
                  <span>{formData.fatherName || ''}</span>
                </div>
                <div className="flex items-start">
                  <span className="w-24 shrink-0">Mother</span>
                  <span className="mr-3">:</span>
                  <span>{formData.motherName || ''}</span>
                </div>
                <div className="flex items-start">
                  <span className="w-24 shrink-0">Class</span>
                  <span className="mr-3">:</span>
                  <span>{formData.className || ''} {formData.section ? `(${formData.section})` : ''}</span>
                </div>
                <div className="flex items-start">
                  <span className="w-24 shrink-0">Roll No.</span>
                  <span className="mr-3">:</span>
                  <span>{formData.rollNo || ''}</span>
                </div>
                <div className="flex items-start">
                  <span className="w-24 shrink-0">ID No.</span>
                  <span className="mr-3">:</span>
                  <span>{formData.idNo || ''}</span>
                </div>
                <div className="flex items-start">
                  <span className="w-24 shrink-0">Gender</span>
                  <span className="mr-3">:</span>
                  <span>{formData.gender || ''}</span>
                </div>
                <div className="flex items-start">
                  <span className="w-24 shrink-0">DOB</span>
                  <span className="mr-3">:</span>
                  <span>{formData.dob || ''}</span>
                </div>
                <div className="flex items-start">
                  <span className="w-24 shrink-0">Blood Group</span>
                  <span className="mr-3">:</span>
                  <span>{formData.bloodGroup || ''}</span>
                </div>
                <div className="flex items-start">
                  <span className="w-24 shrink-0">Phone</span>
                  <span className="mr-3">:</span>
                  <span>{formData.phone || ''}</span>
                </div>
                
                <div className="pt-1.5 border-t" style={{ borderColor: '#f1f5f9' }}>
                  <p className="leading-tight text-[10px]">
                    Address : <span className="font-semibold" style={{ color: '#334155' }}>{formData.address || ''}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Footer with Orange Wave */}
            <div className="relative h-24 mt-auto">
              <div className="absolute bottom-0 left-0 w-full h-12 rounded-t-[60px] flex items-end justify-center pb-2" style={{ backgroundColor: '#f97316' }}>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleDownload}
            className="mt-10 bg-[#1e3a8a] text-white px-12 py-4 rounded-2xl shadow-xl hover:bg-blue-900 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 font-black uppercase tracking-widest flex items-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download ID Card
          </button>
          
          {saveStatus === 'saving' && (
            <div className="mt-4 flex flex-col items-center">
              <RefreshCw className="w-6 h-6 text-blue-600 animate-spin mb-2" />
              <p className="text-blue-600 font-bold">Saving student data & uploading photo...</p>
            </div>
          )}
          {saveStatus === 'success' && (
            <p className="mt-4 text-green-600 font-bold">✓ Student data saved successfully!</p>
          )}
          {saveStatus === 'error' && (
            <p className="mt-4 text-red-600 font-bold">✗ Failed to save data. Please check all fields.</p>
          )}
          
          <p className="text-slate-400 text-xs mt-4 font-medium italic">High resolution PNG will be generated</p>
        </div>
      </div>
    </div>
  );
};

export default IdCard;
