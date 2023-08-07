import React, { useState } from 'react';

const App = () => {
  const [selectedTab, setSelectedTab] = useState(1);
  const [imageLocation, setImageLocation] = useState('');
  const [fileLocation, setFileLocation] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (selectedTab === 1 && (fileExtension === 'jpg' || fileExtension === 'jpeg' || fileExtension === 'png')) {
      const uploadTask = uploadFile(file, 'images');
      uploadTask.then((location) => setImageLocation(location));
    } else if (selectedTab === 2) {
      const uploadTask = uploadFile(file, 'files');
      uploadTask.then((location) => setFileLocation(location));
    }
  };

  const uploadFile = (file, folder) => {
    return new Promise((resolve) => {
      const uploadTask = setInterval(() => {
        if (uploadProgress < 100) {
          setUploadProgress(uploadProgress + 10);
        } else {
          clearInterval(uploadTask);
          setUploadProgress(0);
          const location = `../upload/${folder}/${file.name}`;
          resolve(location);
        }
      }, 500);
    });
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 to-pink-500 p-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <div className="flex mb-4">
          <button
            className={`py-2 px-4 rounded-tl rounded-bl focus:outline-none ${
              selectedTab === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setSelectedTab(1)}
          >
            Image
          </button>
          <button
            className={`py-2 px-4 rounded-tr rounded-br focus:outline-none ${
              selectedTab === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setSelectedTab(2)}
          >
            File
          </button>
        </div>
        <input
          type="file"
          accept=".jpg, .jpeg, .png"
          onChange={handleFileUpload}
          className="mb-4"
        />
        {uploadProgress > 0 && (
          <div className="mb-4">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Upload Progress
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {uploadProgress}%
                  </span>
                </div>
              </div>
              <div className="flex h-2 mb-4 overflow-hidden text-xs bg-blue-200 rounded">
                <div
                  style={{ width: `${uploadProgress}%` }}
                  className="flex flex-col whitespace-nowrap justify-center bg-blue-500"
                ></div>
              </div>
            </div>
          </div>
        )}
        {selectedTab === 1 && imageLocation && (
          <div>
            <p>Image location: {imageLocation}</p>
            <img src={imageLocation} alt="Uploaded" className="w-full mt-4" />
          </div>
        )}
        {selectedTab === 2 && fileLocation && (
          <div>
            <p>File location: {fileLocation}</p>
          </div>
        )}
        <button
          className="py-2 px-4 mt-4 bg-blue-500 text-white rounded-full w-full focus:outline-none"
          onClick={() => {}}
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default App;
