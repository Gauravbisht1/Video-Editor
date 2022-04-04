import React from 'react';
import './VideoGallery.css';

function VideoGallery({ file }) {
  const BASE_URL = 'https://video-editor-api.herokuapp.com/';
  return (
    <div className='videogallery'>
      <div className='video-onefile'>
        <div>
          <video width='450' height='450' controls>
            <source src={`${BASE_URL}${file}`} type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}

export default VideoGallery;
