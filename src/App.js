import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BsPlayFill, BsPauseFill } from 'react-icons/bs';
import './App.css';
// import './MusicPlayer.css';



const App = () => {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5); 

  const audioRef = useRef(null);
  const isInitialPlay = useRef(true);


  useEffect(() => {
    // Fetch song data from the music API
    const options = {
      method: 'GET',
      url: 'https://spotify23.p.rapidapi.com/playlist_tracks/',
      params: {
        id: '37i9dQZF1DX4Wsb4d7NKfP',
        offset: '0',
        limit: '100'
      },
      headers: {
        'X-RapidAPI-Key': '2d48ebed28mshd087b77993e8e37p12eb3ejsn2cd34e468b16',
        'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
      }
    };

    const fetchSongs = async () => {
      try {
        const response = await axios.request(options);
        console.log(response.data.items);
        setSongs(response.data.items);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSongs();
  }, []);

  useEffect(() => {
    if (isInitialPlay.current) {
      isInitialPlay.current = false;
      return;
    }

    if (currentSong && isPlaying) {
      audioRef.current.play();
    }
  }, [currentSong, isPlaying]);

  const playSong = (song) => {
    // Play the selected song
    setCurrentSong(song);
    setIsPlaying(true);
  };

  const pauseSong = () => {
    // Pause the currently playing song
    setIsPlaying(false);
    audioRef.current.pause();
  };

  const handleVolumeChange = (e) => {
    // Update the volume when the user adjusts the volume slider
    const volume = e.target.value;
    setVolume(volume);
    audioRef.current.volume = volume;
  };

  return (
    <div className='music-player'>
      <h1 className="title">Music Player</h1>
      <div className="song-list">
        {songs.map((song, index) => (
          <div className="song" key={index}>
            <img className="album-cover" src={(song.track != null && song.track.album !=null && song.track.album.images[0]) ?  song.track.album.images[0].url : songs[0].track.album.images[0].url } alt={"Song title"} />
            <div className="song-info">
              <h3 className="song-title">{(song.track != null && song.track.name !=null) ?  song.track.name : songs[0].track.name }</h3>
              <p className="artist">{(song.track != null && song.track.artists[0]) ?  song.track.artists[0].name : songs[0].track.artists[0].name}</p>
            </div>
            {currentSong === song && isPlaying ? (
              <BsPauseFill className="icon" onClick={pauseSong} />
            ) : (
              <BsPlayFill className="icon" onClick={() => playSong(song)} />
            )}
          </div>
        ))}
      </div>
      {currentSong && (
        <div className="audio-container">
          <audio
            ref={audioRef}
            src={(currentSong.track != null && currentSong.track.preview_url != null ) ?  currentSong.track.preview_url : songs[0].track.preview_url } // Replace with the appropriate property for the song's audio URL from your API response
            onEnded={pauseSong}
            volume={volume}
          />
          <div className="volume-control">
            <label htmlFor="volume-slider" className="volume-label">Volume</label>
            <input
              type="range"
              id="volume-slider"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
