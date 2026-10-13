const songs = [
    {
        title: "Life Goes On",
        artist: "Oliver Tree",
        cover: "https://avatars.mds.yandex.net/i?id=2f56132e48738cc703df78e7111c8f249ee1b960-12522259-images-thumbs&n=13",
        src: "./audio/song2.mp3",
        duration: "04:01"
    },
    {
        title: "Self Aware",
        artist: "Temper City",
        cover: "https://images.genius.com/3f517b638fe10dfe8caffec5a7029628.1000x1000x1.png",
        src: "./audio/song1.mp3",
        duration: "04:01"
    },
    {
        title: "Back to Friends",
        artist: "Lauren Spencer Smith",
        cover: "https://avatars.mds.yandex.net/i?id=a6763b4e14b455a371ab35d96747f07cd42c2eee-5260040-images-thumbs&n=13",
        src: "./audio/back to friends.mp3",
        duration: "03:15"
    },
    {
        title: "daylight",
        artist: "davit kushner",
        cover: "https://avatars.mds.yandex.net/i?id=5e72fb6432004f6be9562595553a02160e72da17-4904510-images-thumbs&n=13",
        src: "./audio/daylight.mp3",
        duration: "03:15"
    },



];

let currentIndex = 0;
let isPlaying = false;
let repeat = false;

const audio = document.getElementById("audio-player");
const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const titleEl = document.getElementById("player-title");
const artistEl = document.getElementById("player-artist");
const coverEl = document.getElementById("player-cover");
const currentTimeEl = document.getElementById("current-time");
const durationTimeEl = document.getElementById("duration-time");
const progressFill = document.querySelector(".progress-fill");
const progressContainer = document.querySelector(".progress-container");
const songsListContainer = document.getElementById("songs-list");
const repeatBtn = document.querySelector(".fa-rotate-right")?.closest("button");
const searchInput = document.querySelector(".search-box input");

function renderSongs() {
    if (!songsListContainer) return;
    songsListContainer.innerHTML = "";

    songs.forEach((song, index) => {
        const songRow = document.createElement("div");
        songRow.classList.add("song-row");
        songRow.onclick = () => playSelectedSong(index);

        songRow.innerHTML = `
            <div class="song-details">
                <img src="${song.cover}" alt="${song.title}">
                <div>
                    <p class="song-title">${song.title}</p>
                    <p class="song-artist">${song.artist}</p>
                </div>
            </div>
            <div class="song-meta">
                <span class="time">${song.duration || '00:00'}</span>
                <button class="play-btn-pink">
                    <i class="fa-solid fa-play"></i>
                </button>
            </div>
        `;
        songsListContainer.appendChild(songRow);
    });
}

function loadSong(song) {
    titleEl.textContent = song.title;
    artistEl.textContent = song.artist;
    coverEl.src = song.cover;
    audio.src = song.src;
    audio.currentTime = 0;
    progressFill.style.width = "0%";
    currentTimeEl.textContent = "0:00";
    durationTimeEl.textContent = "-0:00";
}

async function playSong() {
    try {
        await audio.play();
        isPlaying = true;
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    } catch (error) {
        console.log("Audio fayl ijro etilmadi:", audio.src);
        isPlaying = false;
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
}

function pauseSong() {
    audio.pause();
    isPlaying = false;
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
}

function playSelectedSong(index) {
    currentIndex = index;
    loadSong(songs[currentIndex]);
    playSong();
}

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = Math.floor(seconds % 60);
    return `${minutes}:${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;
}

if (progressContainer) {
    progressContainer.addEventListener("click", (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;

        if (duration) {
            audio.currentTime = (clickX / width) * duration;
        }
    });
}

playBtn.addEventListener("click", () => {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    loadSong(songs[currentIndex]);
    playSong();
});

nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % songs.length;
    loadSong(songs[currentIndex]);
    playSong();
});

audio.addEventListener("timeupdate", () => {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;

    const current = audio.currentTime;
    const duration = audio.duration;

    const progressPercent = (current / duration) * 100;
    progressFill.style.width = `${progressPercent}%`;

    currentTimeEl.textContent = formatTime(current);
    durationTimeEl.textContent = `-${formatTime(duration - current)}`;
});

audio.addEventListener("ended", () => {
    if (repeat) {
        audio.currentTime = 0;
        playSong();
        return;
    }
    currentIndex = (currentIndex + 1) % songs.length;
    loadSong(songs[currentIndex]);
    playSong();
});

if (repeatBtn) {
    repeatBtn.addEventListener("click", () => {
        repeat = !repeat;
        repeatBtn.style.opacity = repeat ? "1" : "0.5";
    });
}

if (searchInput) {
    searchInput.addEventListener("input", () => {
        const search = searchInput.value.toLowerCase().trim();
        document.querySelectorAll(".song-row").forEach((row) => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(search) ? "flex" : "none";
        });
    });
}

document.querySelectorAll(".sidebar a").forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
    });
});

renderSongs();
loadSong(songs[currentIndex]);  