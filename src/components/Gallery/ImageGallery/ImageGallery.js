import React from 'react';
import './ImageGallery.css';
function ImageGallery({ file }) {
  const BASE_URL = 'https://video-editor-api.herokuapp.com/';
  return (
    <div className='imagegallery'>
      {file !== null ? (
        <div className='image-onefile'>
          <div>
            <img src={`${BASE_URL}${file}`} className='fileimage' alt='image' />
          </div>
        </div>
      ) : (
        <div style={{ display: 'block' }}></div>
      )}
    </div>
  );
}

export default ImageGallery;
