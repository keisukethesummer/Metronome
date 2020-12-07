'use strict'

//テンポ初期設定値
let tempoVal = 60;
let rhythm = 60000 / tempoVal / 12; 

//テンポ設定
const currentTempo = document.getElementById('current-tempo');
currentTempo.textContent = tempoVal;

function down() {
  tempoVal --;
  rhythm = 60000 / tempoVal / 12;
  currentTempo.textContent = tempoVal;
}
function up() {
  tempoVal ++;
  rhythm = 60000 / tempoVal / 12;
  currentTempo.textContent = tempoVal;
}

// テンポ設定ボタン
const slowBtn = document.getElementById('slow');
slowBtn.addEventListener('click', () => {
  down();
});

const fastButton = document.getElementById('fast');
fastButton.addEventListener('click', () => {
  up();
});

// 星の生成
const stars = [];

for (let i = 0; i < 12; i++) {
  const star = document.createElement('div');
  star.textContent = '★';
  star.addEventListener('click', () => {
    star.classList.toggle('active')
  });
  stars.push(star);
}

const pointers = document.getElementById('pointers');
stars.forEach((star) => {
  pointers.appendChild(star);
});

//スタート
let timeoutId;

function move() {
  loop(stars, lightning, rhythm);
  return;
}

//停止
function stop() {
  clearTimeout(timeoutId);
  stars.forEach((star) => {
    star.classList.remove('time');
  });
  return;
}

//スタートボタン
const btn = document.getElementById('btn');
btn.addEventListener('click', () => {
  if (!btn.classList.contains('on')) {
    btn.classList.add('on');
    btn.textContent = '⬛︎';
    move();
  }else{
    btn.classList.remove('on');
    btn.textContent = '▶️';
    stop();
  }
  return;
});



function lightning(star, i){
  star.classList.add('time');
  if (i === 0) {
    stars[stars.length - 1].classList.remove('time');
  }else if(i === stars.length - 1){
    stars[i - 1].classList.remove('time');
    setTimeout(() => {
      move();
    }, rhythm);
  }else{
    stars[i - 1].classList.remove('time');
  }
  return;
}

//ゆっくりループ
function loop(array, callback, interval){
  array.forEach((d, i) => {
    timeoutId = setTimeout(() => {
      callback(d, i);
    }, i * interval);
  });
  return;
}