const workerpool = require('workerpool');

function hardOperation(coeffitient = 1) {
  const loopCount = coeffitient * 1e9;
  let result = 0;
  for (let i = 0; i < loopCount; i++) {
    result += Math.sqrt(Math.random());
  }

  return result;
}

workerpool.worker({
  hardOperation
})