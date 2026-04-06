import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Download, FileText } from 'lucide-react';

const BulkUploadPage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setFile(selectedFile);
      setMessage('');
    } else {
      setFile(null);
      setMessage('Please select a valid Excel file (.xlsx)');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/api/students/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(res.data.message);
      setFile(null);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    // This would normally create and download an Excel file
    // For now, we'll just show an alert
    alert('Template download feature would create an Excel file with sample data. In a real implementation, use a library like xlsx to generate the file.');
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bulk Upload</h1>
        <p className="text-gray-600 mt-2">Upload student data from Excel files</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center mb-8">
            <Upload className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Student Data</h2>
            <p className="text-gray-600">
              Upload an Excel file (.xlsx) containing student information
            </p>
          </div>

          <div className="space-y-6">
            {/* Template Download */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Download Template</h3>
              <p className="text-gray-600 mb-4">
                Get the Excel template with the correct format for bulk upload
              </p>
              <button
                onClick={downloadTemplate}
                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 flex items-center mx-auto"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Template
              </button>
            </div>

            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />
                  <span className="text-lg font-medium text-gray-900 mb-2">
                    {file ? file.name : 'Choose Excel file'}
                  </span>
                  <span className="text-gray-600">
                    {file ? 'File selected' : 'Click to browse or drag and drop'}
                  </span>
                </label>
              </div>
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Students
                </>
              )}
            </button>

            {/* Message */}
            {message && (
              <div className={`p-4 rounded-lg ${
                message.includes('success') || message.includes('added')
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-8 border-t pt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Instructions</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>• Download the Excel template first to see the required format</p>
              <p>• Required columns: Name, Father, Class, DOB, Address, Mobile</p>
              <p>• Optional columns: Mother, Blood, Photo (URL)</p>
              <p>• Date format: YYYY-MM-DD (e.g., 2005-05-15)</p>
              <p>• File must be in .xlsx format</p>
              <p>• Maximum file size: 10MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadPage;