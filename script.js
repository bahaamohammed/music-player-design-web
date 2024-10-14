let progress = document.getElementById("progress");
let song = document.getElementById("song");
let previous = document.getElementById("previous");
let play = document.getElementById("play");
let next = document.getElementById("next");
let fileInput = document.getElementById("fileInput");
let upload = document.getElementById("upload");
let song_name = document.getElementById("song-name");

// Placeholder for the list of songs
let songs = [];
let currentSongIndex = 0;

upload.addEventListener("click", function(){
    fileInput.click();
});

// When the user selects files, store them in the songs array
fileInput.addEventListener("change", function(event) {
    songs = Array.from(event.target.files); // Convert FileList to an array
    currentSongIndex = 0;
    loadSong(currentSongIndex); // Load the first song
});

// Load and play the song at the current index
function loadSong(songIndex) {
    const controls = document.querySelector('.controls'); // Select the controls div

    if (songs.length === 0) {
        controls.style.display = 'none'; // Hide controls if no songs
        return; // Exit the function if the songs array is empty
    } else {
        controls.style.display = 'flex'; // Show controls if songs are available
    }
    
    if (songs.length > 0) {
        let file = songs[songIndex];

        let fileName = file.name; // Get the full filename

        // Remove the file extension (.mp3)
        let fileNameWithoutExtension = fileName.split('.').slice(0, -1).join('.');

        // Capitalize the first letter of the filename
        let formattedFileName = fileNameWithoutExtension.charAt(0).toUpperCase() + fileNameWithoutExtension.slice(1);

        song_name.innerHTML = formattedFileName;

        let url = URL.createObjectURL(file); // Create a temporary URL for the file
        song.src = url;
        song.load(); // Reload the audio element with the new song

        // Wait for the metadata to be loaded before setting progress.max
        song.addEventListener('loadedmetadata', function() {
            progress.max = Math.round(song.duration); // Set the max value to song duration
        });

        song.play().catch(error => {
            alert("Playback failed: " + error);
        });

        play.classList.replace("fa-play", "fa-pause");
    }
}


// Play/pause toggle button
play.addEventListener("click", function() {
    if (song.paused) {
        song.play().catch(error => {
            alert("Playback failed: " + error);
        });
        play.classList.replace("fa-play", "fa-pause");
    } else {
        song.pause();
        play.classList.replace("fa-pause", "fa-play");
    }
});

// Update progress bar as the song plays
song.ontimeupdate = function() {
    progress.value = song.currentTime;
}

// Reset play button icon when the song ends
song.onended = function() {
    play.classList.replace("fa-pause", "fa-play");
    progress.value = 0;  // Reset progress bar
}

// Manually update song's currentTime when progress bar is clicked/changed
progress.addEventListener("input", function() {
    song.currentTime = progress.value;
});

// You can add your logic for previous and next buttons as needed
previous.addEventListener("click", function() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1; // Loop to the last song
    }
    loadSong(currentSongIndex); // Load and play the previous song
});

next.addEventListener("click", function() {
    currentSongIndex++;
    if (currentSongIndex >= songs.length) {
        currentSongIndex = 0; // Loop back to the first song
    }
    loadSong(currentSongIndex); // Load and play the next song
});

// Ensure the progress bar updates only while the song is playing
let progressInterval;
song.addEventListener('play', function() {
    if (!progressInterval) {
        progressInterval = setInterval(() => {
            progress.value = song.currentTime;
        }, 500);
    }
});

song.addEventListener('pause', function() {
    clearInterval(progressInterval);
    progressInterval = null;
});
