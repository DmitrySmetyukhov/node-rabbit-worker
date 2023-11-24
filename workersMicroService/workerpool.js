const workerpool = require('workerpool');

const MAX_ACTIVE_WORKERS_COUNT_ALLOWED = 2;

const pool = workerpool.pool(__dirname + '/worker.js', { maxWorkers: MAX_ACTIVE_WORKERS_COUNT_ALLOWED });


function runTask(coeficient = 1) {
    pool.exec('hardOperation', [coeficient])
        .then(function (result) {
            console.log(result)
        })
        .catch(function (err) {
            console.error(err);
        })
        .then(function () {
            console.log('worker is terminated. work is done!')
            pool.terminate(); // terminate all workers when done
        });
}

runTask()