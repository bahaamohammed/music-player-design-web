let progress = document.getElementById("progress");
let song = document.getElementById("song");
let previous = document.getElementById("previous");
let play = document.getElementById("play");
let next = document.getElementById("next");

song.onloadeddata = function() {
    // Set the max value of progress to the song duration
    progress.max = Math.round(song.duration);
    progress.value = song.currentTime;
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
    // Logic for previous song goes here
});

next.addEventListener("click", function() {
    // Logic for next song goes here
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
