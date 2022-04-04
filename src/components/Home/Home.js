import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import ImageGallery from '../Gallery/ImageGallery/ImageGallery';
import VideoGallery from '../Gallery/VideoGallery/VideoGallery';
import Navbar from '../Navbar/Navbar';
import './Home.css';
import Progress_bar from '../Progress_bar.js/Progress_bar';
function Home() {
  const BASE_URL = 'https://video-editor-api.herokuapp.com/';

  const [imagefile, setImagefile] = useState(null);
  const [imagefiles, setImagefiles] = useState([]);
  const [textfile, setTextfile] = useState(null);
  const [videofiles, setVideofiles] = useState([]);
  const [textfiles, setTextfiles] = useState([]);
  const [videofile, setVideofile] = useState(null);
  const [mergeImagefiles, setMergeImagefiles] = useState([]);
  const [mergeVideofiles, setMergeVideofiles] = useState([]);
  const [fullmergedfile, setFullmergedfile] = useState('');
  const [length, setLength] = useState(false);

  const [audiourl, setAudiourl] = useState('');
  const [clicked, setClicked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressbar, setProgressbar] = useState(false);
  useEffect(() => {
    if (mergeVideofiles.length > 1) {
      setLength(true);
    }
    if (mergeVideofiles.length < 1) {
      setLength(false);
    }
  }, [mergeImagefiles, mergeVideofiles, length]);

  const uploadImage = (e) => {
    e.preventDefault();
    setProgress(0);
    setProgressbar(true);
    const formData = new FormData();
    formData.append('my_file', e.target.files[0]);
    setProgress(40);
    axios
      .post('https://video-editor-api.herokuapp.com/upload_file', formData)
      .then((response) => {
        setProgress(70);
        setImagefile(response.data.file_path);
        setImagefiles((file) => {
          return [...file, response.data.file_path];
        });
        setProgress(90);
        setProgressbar(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    // console.log('image btn');
  };
  const uploadVideo = (e) => {
    e.preventDefault();
    setProgress(0);
    setProgressbar(true);
    const formData = new FormData();
    formData.append('my_file', e.target.files[0]);
    setProgress(40);
    axios
      .post('https://video-editor-api.herokuapp.com/upload_file', formData)
      .then((response) => {
        setVideofile(response.data.file_path);
        setProgress(70);
        setVideofiles((file) => {
          return [...file, response.data.file_path];
        });
        setProgress(90);
        setProgressbar(false);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    // console.log('video btn');
  };

  const uploadTranscript = (e) => {
    e.preventDefault();
    setProgress(0);
    setProgressbar(true);
    const formData = new FormData();
    formData.append('my_file', e.target.files[0]);
    setProgress(40);
    axios
      .post('https://video-editor-api.herokuapp.com/upload_file', formData)
      .then((response) => {
        const formDatas = new FormData();
        formDatas.append('file_path', response.data.file_path);
        axios
          .post(
            'https://video-editor-api.herokuapp.com/text_file_to_audio',
            formDatas
          )
          .then((response) => {
            setTextfile(response.data.audio_file_path);
            setTextfiles((file) => {
              return [...file, response.data.audio_file_path];
            });
            setProgress(90);
            setProgressbar(false);
            let url = `${BASE_URL}${response.data.audio_file_path}`;
            setAudiourl(url);
            // console.log(url);
          });
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    // console.log('upload text');
  };

  const createAudio = (e) => {
    e.preventDefault();
    if (audiourl !== null) {
      window.open(audiourl);
    } else {
      window.Error();
    }
    // console.log('create Audio');
  };

  const merge = (e) => {
    e.preventDefault();
    setProgress(0);
    setProgressbar(true);
    if (videofile === null) {
      // THIS GIVES ERROR
      // const formData = new FormData();
      // formData.append('image_file_path', imagefile);
      // formData.append('audio_file_path', textfile);
      //  axios.post(
      //   'https://video-editor-api.herokuapp.com/merge_image_and_audio',
      //   formData
      // )
      //   .then((response) => {
      //     console.log('response is ', response.data.video_file_path);
      //     setMergeImagefiles((file) => {
      //       return [...file, response.data.video_file_path];
      //     });
      //   })
      //   .catch((error) => {
      //     console.error('Error:', error);
      //   });
      setProgress(40);
      setMergeImagefiles((file) => {
        return [...file, imagefile];
      });
      setProgress(90);
      setProgressbar(false);
    }
    if (imagefile === null) {
      // setVideofile(null);
      const formData = new FormData();
      setProgress(40);
      formData.append('video_file_path', videofile);
      formData.append('audio_file_path', textfile);
      axios
        .post(
          'https://video-editor-api.herokuapp.com/merge_video_and_audio',
          formData
        )
        .then((response) => {
          setMergeVideofiles((file) => [
            ...file,
            response.data.video_file_path,
          ]);
          setProgress(90);
          setProgressbar(false);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }

    // console.log('merge all');
    setImagefile(null);
    setVideofile(null);
    setAudiourl(null);
  };

  const mergeAllVideo = (e) => {
    e.preventDefault();

    const formData = new FormData();
    mergeVideofiles?.map((file) => {
      formData.append('video_file_path_list', file);
    });
    axios
      .post('https://video-editor-api.herokuapp.com/merge_all_video', formData)
      .then((response) => {
        setFullmergedfile(response.data.video_file_path);
        let url = `${BASE_URL}${response.data.video_file_path}`;
        window.open(url);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    setClicked(true);
  };
  const downloadVideo = (e) => {
    e.preventDefault();
    axios.get(
      `https://video-editor-api.herokuapp.com/download_file?file_path=${fullmergedfile}`
    );
    window.open(
      `https://video-editor-api.herokuapp.com/download_file?file_path=${fullmergedfile}`
    );
  };
  const clearAll = (e) => {
    // e.preventDefault();
    setImagefiles([]);
    setMergeImagefiles([]);
    setTextfiles([]);
    setVideofiles([]);
    setMergeVideofiles([]);
    setFullmergedfile([]);
    setAudiourl(null);
    setImagefile(null);
    setVideofile(null);
    setClicked(false);
  };
  return (
    <div className='home'>
      <Navbar />
      {progressbar && (
        <Progress_bar bgcolor='orange' progress={progress} height={15} />
      )}
      <div className='buttons'>
        <div className='first-block'>
          <button className='btn'>
            <label htmlFor='image'>upload image</label>
          </button>
          <input
            style={{ display: 'none' }}
            type='file'
            id='image'
            accept='.png,.jpeg,.jpg'
            onChange={(e) => uploadImage(e)}
          />
          <div className='h1'>
            <h1>OR</h1>
          </div>
          <button className='video btn'>
            <label htmlFor='video'>upload Video</label>
          </button>
          <input
            style={{ display: 'none' }}
            type='file'
            id='video'
            accept='.mp4,.mkv'
            onChange={(e) => uploadVideo(e)}
          />
        </div>
        <div className='second-block'>
          <button className='btn'>
            <label htmlFor='text'>upload Transcript</label>
          </button>
          <input
            style={{ display: 'none' }}
            type='file'
            id='text'
            accept='.txt'
            onChange={(e) => uploadTranscript(e)}
          />
          <button className='btn' onClick={(e) => createAudio(e)}>
            Create Audio
          </button>
          <button className='btn' onClick={(e) => merge(e)}>
            Merge
          </button>
        </div>
      </div>
      <div className='posts'>
        <div className='images'>
          <div className='box'>
            {imagefiles?.map((file) => {
              return <ImageGallery key={file} file={file} />;
            })}
          </div>
          <div className='box'>
            {mergeImagefiles?.map((file) => {
              return <ImageGallery key={file} file={file} />;
            })}
          </div>
        </div>
        <div className='videos'>
          <div className='box'>
            {videofiles?.map((file) => {
              return <VideoGallery key={file} file={file} />;
            })}
          </div>
          <div className='box'>
            {mergeVideofiles?.map((file) => {
              return <VideoGallery key={file} file={file} />;
            })}
          </div>
        </div>
      </div>
      {length && (
        <div className='mergeAllbtn'>
          <button
            className='merge-allvideo-btn'
            onClick={(e) => mergeAllVideo(e)}
          >
            Merge All
          </button>
          <button className='clear-allvideo-btn' onClick={(e) => clearAll(e)}>
            Clear All
          </button>

          {clicked && (
            <button
              className='download-video-btn'
              onClick={(e) => downloadVideo(e)}
            >
              <FaDownload className='download-video-btn' download />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
