const async = require("async");
const fs = require("fs");
const yaml = require("js-yaml");
const fork = require("child_process").fork;

function runMultipleTest(url, options) {
  return new Promise((resolve, reject) => {
    const child = fork("./test.js");
    child.send({ url, options });
    child.on("message", (result) => {
      resolve(result);
    });
    child.on("error", (error) => {
      reject(error);
    });
  });
}

(async () => {
  try {
    let fileContents = fs.readFileSync("../../config.yml", "utf8");
    let config = yaml.load(fileContents);

    let { applications: properties } = config;

    const options = {
      logLevel: "info",
      mobile: properties[0].mobile,
      name: properties[0].name,
      output: "html",
      throttling: properties[0].connectivity,
    };

    const max_threads = 1;

    async.timesLimit(
      properties[0].urlToTest.length,
      max_threads,
      (n, next) => {
        async.timesLimit(
          properties[0].iterations,
          max_threads,
          (test, nextTest) => {
            console.log(`${properties[0].urlToTest[n]} ${test}`);
            runMultipleTest(properties[0].urlToTest[n], options)
              .then((result) => {
                console.log(
                  `Test done for: ${properties[0].urlToTest[n]} iteration ${test}`
                );
                nextTest(null, result);
              })
              .catch((error) => {
                console.log("An error occured: ", error);
              });
          },
          function (err, stdoutArray) {
            // this runs after all processes have run; what's next?
            console.log("All processes have run: ", stdoutArray);
            next(null, stdoutArray);
          }
        );
      },
      function (err, stdoutArray) {
        // this runs after all processes have run; what's next?
        console.log("All processes have run: ", stdoutArray);
      }
    );
  } catch (error) {
    console.log(error);
  }
})();
