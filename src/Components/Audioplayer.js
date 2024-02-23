import React, { useState, useEffect } from "react";

function App() {
  const [files, setFiles] = useState([]);
  const [playingFile, setPlayingFile] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  const handleFileUpload = (e) => {
    const newFiles = [...files];
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    newFiles.push({ name: file.name, url });
    setFiles(newFiles);
    localStorage.setItem("audioFiles", JSON.stringify(newFiles));
  };

  useEffect(() => {
    const storedFiles = localStorage.getItem("audioFiles");
    if (storedFiles) {
      const loadedFiles = JSON.parse(storedFiles);
      setFiles(loadedFiles);
    }
  }, []);

  const handleProgress = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  const handleAudioEnd = () => {
    const currentIdx = files.indexOf(playingFile);
    if (currentIdx < files.length - 1) {
      const nextFile = files[currentIdx + 1];
      setPlayingFile(nextFile);
      setCurrentTime(0);
      localStorage.setItem("playingFileIndex", currentIdx + 1);
      localStorage.setItem("currentTime", currentTime);
    }
  };

  useEffect(() => {
    const savedTime = localStorage.getItem("audioTime");
    const savedFile = localStorage.getItem("audioFile");
    if (savedFile && savedTime) {
      const file = files.find((f) => f.name === savedFile);
      if (file) {
        setPlayingFile(file);
        setCurrentTime(parseFloat(savedTime));
      }
    }
  }, [files]);

  useEffect(() => {
    if (playingFile) {
      localStorage.setItem("audioTime", currentTime);
      localStorage.setItem("audioFile", playingFile.name);
    }
  }, [currentTime, playingFile]);

  return (
    <div>
      <label htmlFor="audio">Add Song to Playlist + </label>
      <input
        id="audio"
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
      />
      <div className="playlist">
        <h2>My Playlist</h2>
        <div className="songs">
          {files.length === 0 ? (
            <div className="no-songs">
              <h1>Create your playlist by adding songs..</h1>
            </div>
          ) : (
            ""
          )}
          {files.map((file, index) => (
            <div
              className={
                files.indexOf(playingFile) === index ? "song active" : "song"
              }
              onClick={() => setPlayingFile(file)}
              key={file.name}
            >
              {index + 1}. {file.name.split(".mp3")[0].toUpperCase()}
            </div>
          ))}
        </div>
      </div>

      {playingFile !== null ? (
        <div className="song-player">
          <h2>Playing: {playingFile.name.split(".mp3")[0].toUpperCase()}</h2>
          <br />
          <audio
            autoPlay
            src={playingFile.url}
            onTimeUpdate={handleProgress}
            onEnded={handleAudioEnd}
            controls
          />
        </div>
      ) : (
        <div className="song-player-dummy">
          <h2>Playing: __</h2>
          <br />
          <audio autoPlay src="" controls />
        </div>
      )}
    </div>
  );
}

export default App;
