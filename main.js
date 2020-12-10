'use strict'

//テンポ初期設定値
let tempoVal = 80;
let rhythm = 60000 / tempoVal / 12; 

//テンポ設定
if(!HTMLElement.prototype.hold){
  Object.defineProperty(HTMLElement.prototype, 'hold', {
    // configurable: true,
    // enumerable: false,
    // writable: true,
    
    value: function(callback,holdTime) {
      this.addEventListener('mousedown', function (event) {
        // event.preventDefault();
        callback(); //event.preventDefaultでクリック等のイベントが解除されてしまうので、要素初タッチ時にも処理を行うようcallbackを設置しておく。
        let time = 0;
        const interval = setInterval(function(){
          time += 100;
          if(time > holdTime){
            callback();
          }
        },60);
        this.addEventListener('mouseup', function (event) {
          // event.preventDefault();
          clearInterval(interval);
        });
      });
    }
  });
}

let intervalId;
const currentTempo = document.getElementById('current-tempo');
currentTempo.textContent = tempoVal;

function down() {
  if (tempoVal === 20 ){
    return;
  }
  if (tempoVal === 240) {
    fastBtn.classList.remove('disabled');
  }
  tempoVal --;
  if (tempoVal === 20) {
    slowBtn.classList.add('disabled');
  }
  rhythm = 60000 / tempoVal / 12;
  currentTempo.textContent = tempoVal;
}
function up() {
  if (tempoVal === 240 ){
    return;
  }
  if (tempoVal === 20){
    slowBtn.classList.remove('disabled');
  }
  tempoVal ++;
  if (tempoVal === 240) {
    fastBtn.classList.add('disabled');
  }
  rhythm = 60000 / tempoVal / 12;
  currentTempo.textContent = tempoVal;
}

// テンポ設定ボタン

const slowBtn = document.getElementById('slow');
slowBtn.hold(()=>{down()},300);

const fastBtn = document.getElementById('fast');
fastBtn.hold(()=>{up()},300);

// 星の生成
const stars = [];

for (let i = 0; i < 12; i++) {
  const star = document.createElement('div');
  star.textContent = '★';
  stars.push(star);
}

const pointers = document.getElementById('pointers');
stars.forEach((star, i) => {
  if (i !== 0){
    star.addEventListener('click', () => {
      star.classList.toggle('active');
    });
  }
  pointers.appendChild(star);
});
stars[0].classList.add('active', 'base');
stars[0].addEventListener('transitionend', () => {
  stars[0].classList.remove('time');
});

// アニメーションの生成
const ripples = document.getElementById('ripples')
const ripple = document.createElement('div');
ripple.textContent = '○';
// ripple.classList.add('ripple');
ripples.appendChild(ripple);

//スタート
let timeoutId;

function move() {
  loop(stars, lightning, rhythm);
}

//停止
function stop() {
  clearTimeout(timeoutId);
}

//スタート・停止ボタン
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
    clearInterval(rippleId);
    reset();
  }
});


let rippleId;
function lightning(star, i){
  if (!btn.classList.contains('on')) {
    return;
  }
  if (star.classList.contains('active')) {
    star.classList.add('time');
  }
  if (i === 0) {
    stars[stars.length - 1].classList.remove('time');
    ripple.classList.add('ripple');
  }else if(i === stars.length - 1){
    stars[i - 1].classList.remove('time');
    ripple.classList.remove('ripple');
    setTimeout(() => {
      move();
    }, rhythm);
  }else{
    stars[i - 1].classList.remove('time');
  }
}

//ゆっくりループ
function loop(array, callback, interval){
  if (!btn.classList.contains('on')) {
    return;
  }
  array.some((d, i) => {
    timeoutId = setTimeout(() => {
      if (!btn.classList.contains('on')) {
        return true;
      }
      callback(d, i);
    }, i * interval);
  });
}

function reset() {
  if (!btn.classList.contains('on')){
    stars.forEach((star) => {
      star.classList.remove('time');
    })
  }
  ripple.classList.remove('ripple');
};
