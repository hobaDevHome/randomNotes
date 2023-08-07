document.addEventListener("DOMContentLoaded", () => {
  const scaleButtons = document.querySelectorAll(".scale-btn");
  const tonesButtons = document.querySelectorAll(".tone-btn");
  const whiteKeys = document.querySelectorAll(".white");

  const playButton = document.getElementById("play-btn");
  const pauseButton = document.getElementById("pause-btn");

  const playTQButton = document.getElementById("playtq-btn");
  const showTQButton = document.getElementById("showtq-btn");

  const playTatiButton = document.getElementById("playtati-btn");
  const showTatiButton = document.getElementById("showtati-btn");

  const showSButton = document.getElementById("showS-btn");
  const playSButton = document.getElementById("playS-btn");
  const pauseSButton = document.getElementById("puase2-btn");

  const selectedElementTextDiv = document.getElementById("element-text");
  const tiquitaqaTextDiv = document.getElementById("tq-text");
  const tatiTextDiv = document.getElementById("tati-text");
  const serietextDiv = document.getElementById("series-text");

  const replayButton1 = document.getElementById("replay-btn1");
  const replayButton2 = document.getElementById("replay-btn2");
  const replayButton3 = document.getElementById("replay-btn3");
  const replayButton4 = document.getElementById("replay-btn4");

  let selectedScale = null;
  let currentScale = "Bayaty";
  let intervalId = null;
  let isSwitchOn = false;
  let selectedNote = "";
  let avoided = [];
  let tqList = [];
  let currentlyPlayingAudio = null;
  let isSeriesPlaying = false;
  let index = 0;

  const notes = ["do", "ri", "mi", "fa", "sol", "la", "si", "do-", "ri-"];

  function toggleSwitch() {
    isSwitchOn = !isSwitchOn;
    if (selectedElementTextDiv) {
      selectedElementTextDiv.innerText = "";
    }
    if (isSwitchOn) {
      intervalId = setInterval(playRandomTone, 4000);
    } else {
      stopPlaying();
    }
  }

  // Function to handle scale button click
  const handleScaleClick = (event) => {
    const clickedScale = event.target;
    currentScale = clickedScale.innerText;

    scaleButtons.forEach((button) => {
      button.classList.remove("selected-scale");
    });

    if (selectedScale === clickedScale) {
      selectedScale.classList.remove("selected-scale");
      selectedScale = null;
    } else {
      if (selectedScale) {
        selectedScale.classList.remove("selected-scale");
      }
      clickedScale.classList.add("selected-scale");
      selectedScale = clickedScale;
      if (selectedElementTextDiv) {
        selectedElementTextDiv.innerText = "";
      }
    }
  };

  const handleToneClick = (event) => {
    const clickedTone = event.target;

    clickedTone.classList.toggle("tone-not-selected");
    if (clickedTone.classList.contains("tone-not-selected")) {
      avoided.push(notes[clickedTone.dataset.note]);
    } else {
      let temp = [...avoided];
      temp = avoided.filter((e) => e != notes[clickedTone.dataset.note]);
      avoided = temp;
    }
  };

  // Function to handle play/pause button click
  const handlePlayButton = () => {
    if (selectedElementTextDiv) {
      selectedElementTextDiv.innerText = "";
    }
    if (!isSwitchOn) {
      playRandomTone();
    }
  };

  const playRandomTone = () => {
    let finalNotesList = notes.filter((x) => !avoided.includes(x));
    const randomIndex = Math.floor(Math.random() * finalNotesList.length);

    selectedNote = finalNotesList[randomIndex];
    let audioPath;
    stopCurrentlyPlaying();

    if (isSwitchOn) {
      audioPath = `audioAuto/${currentScale}/${selectedNote}.mp3`;
    } else {
      audioPath = `audio/${currentScale}/${selectedNote}.mp3`;
    }

    const audio = new Audio(audioPath);
    audio.play();
    currentlyPlayingAudio = audio;
  };

  // keyboard pressing

  const whiteKeyPressed = (event) => {
    const clickedTone = event.target;
    console.log("pressed", clickedTone.dataset.key);
    stopCurrentlyPlaying();

    let keyAudioPath;

    keyAudioPath = `audio/${currentScale}/${clickedTone.dataset.key}.mp3`;

    const keyAudio = new Audio(keyAudioPath);
    keyAudio.play();
    currentlyPlayingAudio = keyAudio;
  };
  // Function to stop playing
  const stopPlaying = () => {
    clearInterval(intervalId);
  };

  const showSingleNote = () => {
    if (selectedElementTextDiv) {
      selectedElementTextDiv.innerText = selectedNote;
    }
  };

  const playTQ = (event) => {
    console.log("play tati");
    index = 0;
    if (tiquitaqaTextDiv) {
      tiquitaqaTextDiv.innerText = "";
    }
    if (tatiTextDiv) {
      tatiTextDiv.innerText = "";
    }
    const clickedScale = event.target;
    let finalNotesList = notes.filter((x) => !avoided.includes(x));
    console.log("clickedScale.dataset.seq", clickedScale);
    tqList = getRandomElementsFromArray(
      finalNotesList,
      clickedScale.dataset.seq
    );
    console.log("tqList", tqList);
    if (!isSwitchOn) {
      isSeriesPlaying = true;
      playSoundsSequentially(tqList);
    }
  };
  const showTQ = (event) => {
    const clickedScale = event.target;
    let content = "";

    let len = clickedScale.dataset.seq;
    for (const element of tqList) {
      content += element + " ";
    }
    if (tiquitaqaTextDiv) {
      tiquitaqaTextDiv.innerHTML = "";
    }
    if (tatiTextDiv) {
      tatiTextDiv.innerHTML = "";
    }
    if (serietextDiv) {
      serietextDiv.innerHTML = "";
    }

    if (len == "2") {
      if (tatiTextDiv) {
        tatiTextDiv.insertAdjacentHTML("beforeend", content);
      }
    }
    if (len == "4") {
      if (tiquitaqaTextDiv) {
        tiquitaqaTextDiv.insertAdjacentHTML("beforeend", content);
      }
    }
    if (len == "40") {
      console.log(len);
      if (serietextDiv) {
        serietextDiv.insertAdjacentHTML("beforeend", content);
      }
    }
  };

  const replyNote = (event) => {
    console.log("re-play single note");

    let audioPath;
    stopCurrentlyPlaying();

    if (isSwitchOn) {
      audioPath = `audioAuto/${currentScale}/${selectedNote}.mp3`;
    } else {
      audioPath = `audio/${currentScale}/${selectedNote}.mp3`;
    }

    const audio = new Audio(audioPath);
    audio.play();
    currentlyPlayingAudio = audio;
  };

  const replyTati = (event) => {
    if (!isSwitchOn) {
      playSoundsSequentially(tqList);
    }
  };

  const pauseTQ = () => {
    isSeriesPlaying = false;
    console.log("playing puased");
  };
  // Add click event listeners to the buttons
  scaleButtons.forEach((button) => {
    button.addEventListener("click", handleScaleClick);

    if (button.innerHTML == "Bayaty") {
      button.classList.add("selected-scale");
    }
  });

  tonesButtons.forEach((button) => {
    button.addEventListener("click", handleToneClick);
  });
  whiteKeys.forEach((button) => {
    button.addEventListener("click", whiteKeyPressed);
  });

  // Add event listeners to the play and pause buttons
  playButton?.addEventListener("click", handlePlayButton);
  pauseButton?.addEventListener("click", showSingleNote);
  playTQButton?.addEventListener("click", playTQ);
  showTQButton?.addEventListener("click", showTQ);
  playSButton?.addEventListener("click", playTQ);
  showSButton?.addEventListener("click", showTQ);
  pauseSButton?.addEventListener("click", pauseTQ);
  playTatiButton?.addEventListener("click", playTQ);
  showTatiButton?.addEventListener("click", showTQ);
  replayButton1?.addEventListener("click", replyNote);
  replayButton2?.addEventListener("click", replyTati);
  replayButton3?.addEventListener("click", replyTati);
  replayButton4?.addEventListener("click", replyTati);

  document
    .getElementById("toggle-switch")
    ?.addEventListener("click", toggleSwitch);

  // helper function
  function getRandomElementsFromArray(array, count) {
    const randomElements = [];
    console.log("get ranodm", count);

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * array.length);
      randomElements.push(array[randomIndex]);
    }

    return randomElements;
  }

  function playSoundsSequentially(soundsArray) {
    function playNextSound() {
      console.log("index", index);
      if (index < soundsArray.length) {
        stopCurrentlyPlaying();
        let keyAudioPath;
        keyAudioPath = `audio/${currentScale}/${soundsArray[index]}.mp3`;
        const audio = new Audio(keyAudioPath);
        audio.onended = playNextSound;
        audio.play();
        currentlyPlayingAudio = audio;
        index++;
      }
    }

    playNextSound();
  }

  function stopCurrentlyPlaying() {
    if (currentlyPlayingAudio) {
      currentlyPlayingAudio.pause();
    }
  }
});
