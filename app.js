document.addEventListener("DOMContentLoaded", () => {
  const scaleButtons = document.querySelectorAll(".scale-btn");
  const tonesButtons = document.querySelectorAll(".tone-btn");
  const whiteKeys = document.querySelectorAll(".white");

  const playButton = document.getElementById("play-btn");
  const pauseButton = document.getElementById("pause-btn");
  const playTQButton = document.getElementById("playtq-btn");
  const showTQButton = document.getElementById("showtq-btn");
  const selectedElementTextDiv = document.getElementById("element-text");
  const tiquitaqaTextDiv = document.getElementById("tq-text");

  let selectedScale = null;
  let currentScale = "Bayaty";
  let intervalId = null;
  let isSwitchOn = false;
  let selectedNote = "";
  let avoided = [];
  let tqList = [];

  const notes = ["do", "ri", "mi", "fa", "sol", "la", "si", "do-", "ri"];

  function toggleSwitch() {
    isSwitchOn = !isSwitchOn;

    if (selectedElementTextDiv) {
      selectedElementTextDiv.innerText = "";
    }
    updatePauseButtonLabel();
  }

  function updatePauseButtonLabel() {
    const pauseButton = document.getElementById("pause-btn");
    if (pauseButton) {
      pauseButton.textContent = isSwitchOn ? "Pause" : "Show";
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
      // console.log("temp", temp);
      avoided = temp;
    }
  };

  // Function to handle play/pause button click
  const handlePlayButton = () => {
    if (isSwitchOn) {
      intervalId = setInterval(playRandomTone, 4000);
    } else {
      if (selectedElementTextDiv) {
        selectedElementTextDiv.innerText = "";
      }
      playRandomTone();
    }

    playButton?.classList.remove("off");
    playButton?.classList.add("on");
    pauseButton?.classList.remove("on");
    pauseButton?.classList.add("off");
  };

  const playRandomTone = () => {
    let finalNotesList = getFianlList();
    const randomIndex = Math.floor(Math.random() * finalNotesList.length);

    selectedNote = finalNotesList[randomIndex];
    let audioPath;

    if (isSwitchOn) {
      audioPath = `audioAuto/${currentScale}/${selectedNote}.mp3`;
    } else {
      audioPath = `audio/${currentScale}/${selectedNote}.mp3`;
    }

    const audio = new Audio(audioPath);
    audio.play();
  };

  // keyboard pressing

  const whiteKeyPressed = (event) => {
    const clickedTone = event.target;
    console.log("pressed", clickedTone.dataset.key);

    let keyAudioPath;

    keyAudioPath = `audio/${currentScale}/${clickedTone.dataset.key}.mp3`;

    const keyAudio = new Audio(keyAudioPath);
    keyAudio.play();
  };
  // Function to stop playing
  const stopPlaying = () => {
    if (isSwitchOn) {
      clearInterval(intervalId);
      pauseButton?.classList.remove("off");
      pauseButton?.classList.add("on");

      playButton?.classList.remove("on");
      playButton?.classList.add("off");
    } else {
      if (selectedElementTextDiv) {
        selectedElementTextDiv.innerText = selectedNote;
      }
    }
  };

  const playTQ = () => {
    if (tiquitaqaTextDiv) {
      tiquitaqaTextDiv.innerText = "";
    }

    tqList = getRandomElementsFromArray(notes, 4);
    console.log("randomelements", tqList);
    playSoundsSequentially(tqList);
  };
  const showTQ = () => {
    if (tiquitaqaTextDiv) {
      tiquitaqaTextDiv.innerHTML = "";
      let content = "";
      for (const element of tqList) {
        content += element + "<br>";
      }
      tiquitaqaTextDiv.insertAdjacentHTML("beforeend", content);
    }
  };

  // calculate final list with avoided
  const getFianlList = () => {
    let final = notes.filter((x) => !avoided.includes(x));

    return final;
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

  // helper function
  function getRandomElementsFromArray(array, count) {
    const randomElements = [];

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * array.length);
      randomElements.push(array[randomIndex]);
    }

    return randomElements;
  }

  function playSoundsSequentially(soundsArray) {
    let index = 0;

    function playNextSound() {
      if (index < soundsArray.length) {
        let keyAudioPath;
        keyAudioPath = `audio/${currentScale}/${soundsArray[index]}.mp3`;
        const audio = new Audio(keyAudioPath);
        audio.onended = playNextSound;
        audio.play();
        index++;
      }
    }

    playNextSound();
  }

  // Add event listeners to the play and pause buttons
  playButton?.addEventListener("click", handlePlayButton);
  pauseButton?.addEventListener("click", stopPlaying);
  playTQButton?.addEventListener("click", playTQ);
  showTQButton?.addEventListener("click", showTQ);

  document
    .getElementById("toggle-switch")
    ?.addEventListener("click", toggleSwitch);
});
