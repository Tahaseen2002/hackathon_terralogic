import React, { useState } from 'react';

function FileUpload({ onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      await onUpload(selectedFile);
      setSelectedFile(null);
      // Reset file input
      document.getElementById('file-input').value = '';
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-section" style={{ margin: 0 }}>
      <div style={{ marginBottom: '8px' }}>
        <h2>📁 Import Data</h2>
        <p style={{ color: '#666', marginTop: '8px', fontSize: '14px' }}>
          Upload a CSV or Excel file containing your task and project data
        </p>
      </div>
      
      <div className="upload-area" onClick={() => document.getElementById('file-input').click()}>
        <input
          id="file-input"
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
        />
        <div style={{ 
          fontSize: '64px', 
          marginBottom: '16px',
          filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
        }}>
          {selectedFile ? '📄' : '📤'}
        </div>
        <p style={{ 
          fontSize: '20px', 
          color: '#2563eb', 
          fontWeight: '700',
          marginBottom: '8px'
        }}>
          {selectedFile ? selectedFile.name : 'Click to select a file'}
        </p>
        <p style={{ 
          fontSize: '14px', 
          color: '#999', 
          marginTop: '4px'
        }}>
          Supported formats: CSV, Excel (.xlsx, .xls)
        </p>
        {selectedFile && (
          <div style={{
            marginTop: '16px',
            padding: '8px 16px',
            background: 'rgba(37, 99, 235, 0.1)',
            borderRadius: '8px',
            display: 'inline-block',
            fontSize: '12px',
            color: '#2563eb',
            fontWeight: '600'
          }}>
            {(selectedFile.size / 1024).toFixed(2)} KB
          </div>
        )}
      </div>

      {selectedFile && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            className="upload-btn"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
                Uploading...
              </>
            ) : (
              <>
                <span>✅</span>
                Upload and Import
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
