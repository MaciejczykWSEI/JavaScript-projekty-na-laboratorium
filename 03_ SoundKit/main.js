const sounds = {
    65: "boom",
    83: "clap",
    68: "hihat",
    70: "kick",
    71: "openhat",
    72: "ride",
    74: "snare",
    75: "tink",
    76: "tom"
}
const audios = {};
const tracks = [[]]; //kanały nagrywania
let currentTrack;
const states = {
    NORMAL: 'normal',
    PLAY: 'play',
    REC: 'rec'
}
let currentState = states.NORMAL;
let timeStamp;

window.addEventListener('keydown', keyDownEvent)
window.addEventListener('click', clickEvent)

function animateButton(key) {
    const btn = document.querySelector(`[data-key="${key}"`)
    btn.classList.add('enlarge');

    setTimeout(()=> {
        btn.classList.remove('enlarge');
    }, 100)
}

function playSound(i) {
    audios[i].currentTime = 0;
    audios[i].play();

    animateButton(i);
}

function loadAudio() {
    Object.keys(sounds).forEach(i => audios[i] = new Audio(`audio/${sounds[i]}.wav`));
}

function clickEvent(e) { //Sprawdź na jaki element naciśnięto
    if (e.target.classList.contains('sound-btn')) { //Przycisk grający dźwięk
    
        if (currentState === states.REC) { //Wsadź dżwięk do ścieżki nagrywania
            insertSound(e.target.dataset.key);
        }
        playSound(e.target.dataset.key);

    } else if (e.target.classList.contains('play-btn')) { //Przycisk odtwarzania

        if (currentState === states.REC) stopRecording(currentTrack);

        currentTrack = Number(e.target.dataset.track);

        playTrack(currentTrack);

    } else if (e.target.classList.contains('rec-btn')) { //Przycisk nagrywania

        if (currentState === states.REC) stopRecording(currentTrack);
        else {
            currentTrack = Number(e.target.dataset.track);

            const btn = document.querySelector(`[data-rec="${currentTrack}"`);
            btn.textContent = 'STOP';

            currentState = states.REC;
            tracks[currentTrack] = []; //Reset previous recording

            timeStamp = Date.now();
        }
    }
}
function stopRecording(track) {
    const btn = document.querySelector(`[data-rec="${track}"`);
    btn.textContent = 'REC';
    currentState = states.NORMAL;

    const info = document.querySelector(`.info-${currentTrack}`);
    const trackNum = tracks[currentTrack].length;
    info.textContent = (trackNum)? `Ilość dźwięków: ${trackNum}` : `Kanał jest pusty`;
}
function keyDownEvent(e) { //Sprawdź jaki klawisz klawiatury naciśnięto
    if (!audios[e.keyCode]) return; //Nie wciśnięto poprawnego klawisza
   
    if (currentState === states.REC) { //wsadź dżwięk do ścieżki nagrywania
        insertSound(e.keyCode);
    }
    if (currentState !== states.PLAY) playSound(e.keyCode);
}

function insertSound(sound) {
    const delay = Date.now() - timeStamp;
    timeStamp = Date.now();
    tracks[currentTrack].push({ delay, sound })
}

async function playTrack(trackNum) {
    function timeout(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }

    if (!tracks[trackNum]) return; //Ścieżka jest pusta
    currentState = states.PLAY;

    for (let i = 0; i < tracks[trackNum].length; i++) {
        await timeout(tracks[trackNum][i].delay);  //Poczekaj przed odtwarzaniem dźwięku
        playSound(tracks[trackNum][i].sound); //Odtwórz dźwięk
    }
    currentState = states.NORMAL;
}

loadAudio();