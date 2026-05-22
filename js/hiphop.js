(function () {
  // ========== Web Audio API HipHop 鼓机 ==========

  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var ctx = null;

  var isPlaying = false;
  var currentBeatIndex = 0;
  var tempo = 90;
  var timerID = null;
  var nextStepTime = 0;
  var currentStep = 0;
  var totalSteps = 16;
  var swing = 0;

  var masterGain = null;

  var beats = {
    boombap: {
      name: 'Boom Bap 经典',
      desc: '90 BPM · Kick + Snare + Hi-Hat',
      tempo: 90,
      steps: 16,
      swing: 0.15,
      pattern: {
        kick:  [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0],
        snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
        hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,1,1,0],
        openhat: [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,0,1]
      }
    },
    trap: {
      name: 'Trap 氛围',
      desc: '140 BPM · 808 + 高速 Hi-Hat',
      tempo: 140,
      steps: 16,
      swing: 0.05,
      pattern: {
        kick:  [1,0,0,1, 0,0,1,0, 1,0,1,0, 0,1,0,1],
        snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
        hihat: [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0],
        openhat: [0,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,1,0],
        rim:   [0,0,1,0, 0,1,0,0, 0,0,1,0, 0,0,0,0]
      }
    },
    oldschool: {
      name: 'Old School 律动',
      desc: '85 BPM · 经典鼓机风格',
      tempo: 85,
      steps: 16,
      swing: 0.2,
      pattern: {
        kick:  [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,1],
        snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
        hihat: [1,0,1,0, 1,0,1,1, 1,0,1,0, 1,0,1,0],
        openhat: [0,0,0,0, 0,0,0,1, 0,0,0,0, 0,0,0,1],
        clap:  [0,0,0,0, 0,0,0,0, 0,0,0,0, 1,0,0,0]
      }
    },
    lofi: {
      name: 'Lo-Fi 慢拍',
      desc: '80 BPM · 柔拍 + 松弛律动',
      tempo: 80,
      steps: 16,
      swing: 0.25,
      pattern: {
        kick:  [1,0,0,0, 0,0,1,0, 1,0,0,0, 0,0,0,0],
        snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
        hihat: [0,1,0,0, 0,1,1,0, 0,1,0,0, 0,1,0,1],
        rim:   [0,0,0,1, 0,0,0,0, 0,0,0,1, 0,0,0,0]
      }
    }
  };

  var beatKeys = ['boombap', 'trap', 'oldschool', 'lofi'];

  // ========== 鼓声合成 ==========

  function createKick(time, freq, decay, vol) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq || 150, time);
    osc.frequency.exponentialRampToValueAtTime(40, time + 0.08);
    gain.gain.setValueAtTime((vol || 0.9), time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + (decay || 0.35));
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(time);
    osc.stop(time + (decay || 0.35));
  }

  function create808Kick(time) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(60, time);
    osc.frequency.exponentialRampToValueAtTime(30, time + 0.15);
    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.6);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(time);
    osc.stop(time + 0.6);
  }

  function createSnare(time, vol) {
    var noise = ctx.createBufferSource();
    var noiseGain = ctx.createGain();
    var bufferSize = ctx.sampleRate * 0.15;
    var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    noise.buffer = buffer;

    var bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 3000;
    bandpass.Q.value = 0.8;

    noiseGain.gain.setValueAtTime((vol || 0.7), time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

    noise.connect(bandpass);
    bandpass.connect(noiseGain);
    noiseGain.connect(masterGain);
    noise.start(time);
    noise.stop(time + 0.15);

    var osc = ctx.createOscillator();
    var oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, time);
    oscGain.gain.setValueAtTime(0.4, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
    osc.connect(oscGain);
    oscGain.connect(masterGain);
    osc.start(time);
    osc.stop(time + 0.1);
  }

  function createHihat(time, vol, decay) {
    var noise = ctx.createBufferSource();
    var noiseGain = ctx.createGain();
    var bufferSize = ctx.sampleRate * 0.05;
    var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    noise.buffer = buffer;

    var highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 7000;

    noiseGain.gain.setValueAtTime((vol || 0.3), time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + (decay || 0.05));

    noise.connect(highpass);
    highpass.connect(noiseGain);
    noiseGain.connect(masterGain);
    noise.start(time);
    noise.stop(time + (decay || 0.05));
  }

  function createOpenHat(time) {
    var noise = ctx.createBufferSource();
    var noiseGain = ctx.createGain();
    var bufferSize = ctx.sampleRate * 0.3;
    var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    noise.buffer = buffer;

    var highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 8000;

    noiseGain.gain.setValueAtTime(0.25, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

    noise.connect(highpass);
    highpass.connect(noiseGain);
    noiseGain.connect(masterGain);
    noise.start(time);
    noise.stop(time + 0.25);
  }

  function createRim(time) {
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, time);
    osc.frequency.exponentialRampToValueAtTime(600, time + 0.02);
    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(time);
    osc.stop(time + 0.06);
  }

  function createClap(time) {
    for (var i = 0; i < 3; i++) {
      var noise = ctx.createBufferSource();
      var noiseGain = ctx.createGain();
      var bufferSize = ctx.sampleRate * 0.04;
      var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      var data = buffer.getChannelData(0);
      for (var j = 0; j < bufferSize; j++) {
        data[j] = Math.random() * 2 - 1;
      }
      noise.buffer = buffer;

      var bandpass = ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.value = 2000;
      bandpass.Q.value = 1;

      noiseGain.gain.setValueAtTime(0.3, time + i * 0.015);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, time + i * 0.015 + 0.04);

      noise.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(masterGain);
      noise.start(time + i * 0.015);
      noise.stop(time + i * 0.015 + 0.04);
    }
  }

  // ========== 播放引擎 ==========

  function ensureCtx() {
    if (!ctx) {
      ctx = new AudioContext();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.8;
      masterGain.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  function scheduleStep() {
    var beat = beats[beatKeys[currentBeatIndex]];
    var pattern = beat.pattern;
    var stepDuration = 60.0 / beat.tempo / 4;

    while (nextStepTime < ctx.currentTime + 0.15) {
      var step = currentStep % beat.steps;
      var swingOffset = (step % 2 === 1) ? beat.swing * stepDuration * 0.5 : 0;
      var time = nextStepTime + swingOffset;

      if (pattern.kick && pattern.kick[step]) {
        if (currentBeatIndex === 1) {
          create808Kick(time);
        } else {
          createKick(time, 140, 0.35, 0.9);
        }
      }
      if (pattern.snare && pattern.snare[step]) {
        createSnare(time, 0.7);
      }
      if (pattern.hihat && pattern.hihat[step]) {
        createHihat(time, 0.25, 0.05);
      }
      if (pattern.openhat && pattern.openhat[step]) {
        createOpenHat(time);
      }
      if (pattern.rim && pattern.rim[step]) {
        createRim(time);
      }
      if (pattern.clap && pattern.clap[step]) {
        createClap(time);
      }

      currentStep++;
      nextStepTime += stepDuration;
    }

    updateProgress();
    timerID = setTimeout(scheduleStep, 25);
  }

  function startPlayback() {
    ensureCtx();
    if (isPlaying) return;
    isPlaying = true;
    currentStep = 0;
    nextStepTime = ctx.currentTime + 0.1;
    updatePlayButton();
    scheduleStep();
  }

  function stopPlayback() {
    isPlaying = false;
    if (timerID) {
      clearTimeout(timerID);
      timerID = null;
    }
    updatePlayButton();
    updateProgress();
  }

  function togglePlay() {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  }

  function loadBeat(index) {
    var wasPlaying = isPlaying;
    if (wasPlaying) stopPlayback();

    currentBeatIndex = index;
    currentStep = 0;
    var beat = beats[beatKeys[index]];

    var trackTitle = document.getElementById('trackTitle');
    var trackDesc = document.getElementById('trackDesc');
    if (trackTitle) trackTitle.textContent = beat.name;
    if (trackDesc) trackDesc.textContent = beat.desc;

    var items = document.querySelectorAll('.playlist-item');
    items.forEach(function (item, i) {
      item.classList.toggle('active', i === index);
    });

    var fill = document.getElementById('progressFill');
    if (fill) fill.style.width = '0%';

    if (wasPlaying) startPlayback();
  }

  function updateProgress() {
    var fill = document.getElementById('progressFill');
    if (fill && isPlaying) {
      var beat = beats[beatKeys[currentBeatIndex]];
      var pct = (currentStep % beat.steps) / beat.steps * 100;
      fill.style.width = pct + '%';
    } else if (fill && !isPlaying) {
      fill.style.width = '0%';
    }
  }

  function updatePlayButton() {
    var playBtn = document.getElementById('playBtn');
    if (playBtn) {
      playBtn.textContent = isPlaying ? '⏸' : '▶';
    }

    var vinyl = document.getElementById('vinyl');
    if (vinyl) {
      if (isPlaying) {
        vinyl.classList.add('playing');
      } else {
        vinyl.classList.remove('playing');
      }
    }
  }

  // ========== UI 事件绑定 ==========

  document.getElementById('playBtn').addEventListener('click', togglePlay);

  document.getElementById('prevBtn').addEventListener('click', function () {
    var idx = (currentBeatIndex - 1 + beatKeys.length) % beatKeys.length;
    loadBeat(idx);
  });

  document.getElementById('nextBtn').addEventListener('click', function () {
    var idx = (currentBeatIndex + 1) % beatKeys.length;
    loadBeat(idx);
  });

  document.getElementById('progressBar').addEventListener('click', function (e) {
    if (!isPlaying) return;
    var rect = this.getBoundingClientRect();
    var pct = (e.clientX - rect.left) / rect.width;
    var beat = beats[beatKeys[currentBeatIndex]];
    currentStep = Math.floor(pct * beat.steps);
    nextStepTime = ctx.currentTime + 0.05;
  });

  var volumeSlider = document.getElementById('volumeSlider');
  volumeSlider.addEventListener('input', function () {
    if (masterGain) {
      masterGain.gain.value = this.value / 100 * 0.9;
    }
  });

  var playlistItems = document.querySelectorAll('.playlist-item');
  playlistItems.forEach(function (item, index) {
    item.addEventListener('click', function () {
      if (index === currentBeatIndex) {
        togglePlay();
      } else {
        loadBeat(index);
        if (!isPlaying) startPlayback();
      }
    });
  });

  // ========== 滚动渐显动画 ==========
  var observerOptions = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.artist-card, .intro-card, .timeline-item').forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.2,0,0.2,1), transform 0.6s cubic-bezier(0.2,0,0.2,1)';
    observer.observe(el);
  });

  // ========== Hero 向下滚动箭头 ==========
  var scrollArrow = document.querySelector('.hero-scroll');
  if (scrollArrow) {
    scrollArrow.addEventListener('click', function () {
      var intro = document.querySelector('.intro');
      if (intro) intro.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ========== 初始化 ==========
  if (volumeSlider) {
    volumeSlider.value = 80;
  }

  var timeEl = document.getElementById('duration');
  if (timeEl) timeEl.textContent = 'Live';

  var curTimeEl = document.getElementById('currentTime');
  if (curTimeEl) curTimeEl.textContent = 'WEB';

})();
