const candles = document.querySelectorAll('.flame');
const message = document.getElementById('message');
const relightButton = document.getElementById('relightButton');

let blowing = false;
let audioContext;
let analyser;
let dataArray;

async function startListening() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    checkVolume();
  } catch (err) {
    message.textContent = "Microphone access denied or not available.";
    console.error(err);
  }
}

function checkVolume() {
  analyser.getByteFrequencyData(dataArray);
  const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;
  
  if (volume > 30 && !blowing) {
    blowing = true;
    blowOutCandles();
  }
  
  if (!blowing) {
    requestAnimationFrame(checkVolume);
  }
}

function blowOutCandles() {
  candles.forEach(flame => {
    flame.style.animation = 'none';
    flame.style.opacity = '0';
  });
  message.textContent = "🎉 Happy Birthday! Candles blown out!";
  
  // Show relight button
  relightButton.style.display = 'inline-block';
  createFallingFlowers();
}

function relightCandles() {
  candles.forEach(flame => {
    flame.style.animation = 'flicker 0.2s infinite';
    flame.style.opacity = '1';
  });
  message.textContent = "Blow near the microphone to blow out the candles!";
  
  relightButton.style.display = 'none';
  blowing = false;
  checkVolume();
}

relightButton.addEventListener('click', relightCandles);

// Start listening when page loads
window.addEventListener('load', () => {
  message.textContent = "Blow near the microphone to blow out the candles!";
  startListening();
});
const birthdaySong = document.getElementById('birthdaySong');
const playSongButton = document.getElementById('playSongButton');

playSongButton.addEventListener('click', () => {
  if (birthdaySong.paused) {
    birthdaySong.play();
    playSongButton.textContent = '⏸️ Pause Birthday Song';
  } else {
    birthdaySong.pause();
    playSongButton.textContent = '🎵 Play Birthday Song';
  }
});
function createFallingFlowers() {
  const flowerInterval = setInterval(() => {
    const flower = document.createElement('div');
    flower.classList.add('flower');
    flower.textContent = "🌼🌸"
    flower.style.left = Math.random() * 100 + 'vw';
    flower.style.animationDuration = (Math.random() * 3 + 2) + 's';
    flower.style.top = "-30px"; 

    document.body.appendChild(flower);

    setTimeout(() => {
      flower.remove();
    }, 5000);
  }, 300);

  // Stop after 10 seconds
  setTimeout(() => {
    clearInterval(flowerInterval);
  }, 10000);
}
