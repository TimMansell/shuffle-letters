'use strict';

const animatingElements = new WeakSet();

function range(start, end) {
  return Array.from({length: end - start + 1}, (_, i) => i + start);
}

function getRandomChar(type) {
  let pool = '';
  switch (type) {
    case 'lowerLetter':
      pool = 'abcdefghijklmnopqrstuvwxyz0123456789';
      break;
    case 'upperLetter':
      pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      break;
    case 'symbol':
      pool = ',.?/\\(^)![]{}*&^%$#\'"';
      break;
  }
  const poolArray = Array.from(pool);
  return poolArray[Math.floor(Math.random() * poolArray.length)];
}

function shuffleLetters(el, options) {
  return new Promise((resolve) => {
    if (animatingElements.has(el)) {
      return;
    }
    animatingElements.add(el);

    const strArray = Array.from(options.text || el.textContent);
    const msPerFrame = 1000 / options.fps;
    const types = [];
    const letters = [];

    strArray.forEach((char, i) => {
      if (char === ' ') {
        types[i] = 'space';
        return;
      } else if (/[a-z]/.test(char)) {
        types[i] = 'lowerLetter';
      } else if (/[A-Z]/.test(char)) {
        types[i] = 'upperLetter';
      } else {
        types[i] = 'symbol';
      }
      letters.push(i);
    });
    el.textContent = '';
    const len = letters.length;

    (function shuffle(start) {
      const shuffledArray = [].concat(strArray);

      if (start > len) {
        animatingElements.delete(el);
        return resolve();
      }

      range(Math.max(start, 0), len).forEach((i) => {
        shuffledArray[letters[i]] = i < (start + options.step)
          ? getRandomChar(types[letters[i]]) : '';
      });
      el.textContent = shuffledArray.join('');

      setTimeout(() => shuffle(start + 1), msPerFrame);
    })(-options.step);
  });
}

function isArrayLike(el) {
  return Array.isArray(el) || el instanceof NodeList || el instanceof HTMLCollection;
}

module.exports = function (el, options) {
  el = isArrayLike(el) ? Array.from(el) : [el];
  options = Object.assign({}, {
    step: 8,
    fps: 25,
    text: ''
  }, options);
  return Promise.all(el.map((e) => shuffleLetters(e, options)));
};
