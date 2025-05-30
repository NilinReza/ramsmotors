import React, { useState, useRef } from 'react';
import { CloudArrowUpIcon, DocumentArrowUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

const VehicleImport = ({ onImport, onClose, isLoading = false }) => {
  const [importMethod, setImportMethod] = useState('csv'); // 'csv' or 'json'
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [importSettings, setImportSettings] = useState({
    skipFirstRow: true,
    updateExisting: false,
    createMissingFields: true
  });
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file) => {
    setSelectedFile(file);
    
    // Read and preview file content
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let data = [];
        
        if (file.type === 'application/json' || file.name.endsWith('.json')) {
          data = JSON.parse(e.target.result);
          setImportMethod('json');
        } else {
          // Parse CSV
          const csvData = parseCSV(e.target.result);
          data = csvData;
          setImportMethod('csv');
        }
        
        // Show first 5 rows for preview
        setPreviewData(data.slice(0, 5));
      } catch (error) {
        console.error('Error parsing file:', error);
        alert('Error parsing file. Please check the format and try again.');
      }
    };
    reader.readAsText(file);
  };

  const parseCSV = (csvText) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    return lines.slice(importSettings.skipFirstRow ? 1 : 0).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (!selectedFile || previewData.length === 0) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let data = [];
        
        if (importMethod === 'json') {
          data = JSON.parse(e.target.result);
        } else {
          data = parseCSV(e.target.result);
        }
        
        onImport(data, importSettings);
      } catch (error) {
        console.error('Error importing file:', error);
        alert('Error importing file. Please check the format and try again.');
      }
    };
    reader.readAsText(selectedFile);
  };

  const downloadTemplate = (format) => {
    const templateData = format === 'json' 
      ? [
          {
            make: "Toyota",
            model: "Camry",
            year: 2022,
            price: 25000,
            mileage: 15000,
            color: "White",
            transmission: "automatic",
            fuelType: "gasoline",
            bodyType: "sedan",
            engine: "2.5L 4-Cylinder",
            vin: "1HGBH41JXMN109186",
            description: "Excellent condition, well maintained",
            condition: "used",
            status: "available",
            features: ["Air Conditioning", "Bluetooth", "Backup Camera"]
          }
        ]
      : `make,model,year,price,mileage,color,transmission,fuelType,bodyType,engine,vin,description,condition,status,features
Toyota,Camry,2022,25000,15000,White,automatic,gasoline,sedan,2.5L 4-Cylinder,1HGBH41JXMN109186,Excellent condition,used,available,"Air Conditioning|Bluetooth|Backup Camera"`;

    const blob = new Blob([format === 'json' ? JSON.stringify(templateData, null, 2) : templateData], {
      type: format === 'json' ? 'application/json' : 'text/csv'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vehicle_template.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Import Vehicles</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Import Method Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Import Format
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="csv"
                  checked={importMethod === 'csv'}
                  onChange={(e) => setImportMethod(e.target.value)}
                  className="mr-2"
                />
                CSV File
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="json"
                  checked={importMethod === 'json'}
                  onChange={(e) => setImportMethod(e.target.value)}
                  className="mr-2"
                />
                JSON File
              </label>
            </div>
          </div>

          {/* Template Download */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Download Template</h3>
            <p className="text-sm text-blue-700 mb-3">
              Download a template file to see the required format and fields.
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => downloadTemplate('csv')}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Download CSV Template
              </button>
              <button
                onClick={() => downloadTemplate('json')}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Download JSON Template
              </button>
            </div>
          </div>

          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">
                Drop your {importMethod.toUpperCase()} file here
              </p>
              <p className="text-sm text-gray-600">
                or click to browse
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
                Choose File
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={importMethod === 'csv' ? '.csv' : '.json'}
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>

          {/* Selected File Info */}
          {selectedFile && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-900">
                    Selected: {selectedFile.name}
                  </p>
                  <p className="text-sm text-green-700">
                    Size: {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewData([]);
                  }}
                  className="text-green-600 hover:text-green-800"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Import Settings */}
          {selectedFile && (
            <div className="mt-6 p-4 border border-gray-200 rounded-md">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Import Settings</h3>
              <div className="space-y-3">
                {importMethod === 'csv' && (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={importSettings.skipFirstRow}
                      onChange={(e) => setImportSettings(prev => ({
                        ...prev,
                        skipFirstRow: e.target.checked
                      }))}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Skip first row (headers)</span>
                  </label>
                )}
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={importSettings.updateExisting}
                    onChange={(e) => setImportSettings(prev => ({
                      ...prev,
                      updateExisting: e.target.checked
                    }))}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Update existing vehicles (match by VIN)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={importSettings.createMissingFields}
                    onChange={(e) => setImportSettings(prev => ({
                      ...prev,
                      createMissingFields: e.target.checked
                    }))}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Create missing fields automatically</span>
                </label>
              </div>
            </div>
          )}

          {/* Data Preview */}
          {previewData.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Preview (First 5 rows)
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(previewData[0] || {}).map(key => (
                        <th
                          key={key}
                          className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previewData.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-3 py-2 whitespace-nowrap text-sm text-gray-900"
                          >
                            {Array.isArray(value) ? value.join(', ') : String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Required Fields Info */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <h3 className="text-sm font-medium text-yellow-900 mb-2">Required Fields</h3>
            <p className="text-sm text-yellow-700">
              Make sure your file includes these required fields: <strong>make</strong>, <strong>model</strong>, <strong>year</strong>, <strong>price</strong>, <strong>vin</strong>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!selectedFile || previewData.length === 0 || isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Importing...' : `Import ${previewData.length} Vehicles`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleImport;
