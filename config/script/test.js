const chromeLauncher = require("chrome-launcher");
const constants = require("../constants.js");
const fs = require("fs");
const lighthouse = require("lighthouse");

const throttling = (config) => {
  switch (config) {
    case "3gfast":
      return constants.throttling.mobileSlow4G;
    case "3gslow":
      return constants.throttling.mobileRegular3G;
    case "cable":
      return constants.throttling.desktopDense4G;
    default:
      return null;
  }
};

const runLighthouseTest = async (url, options) => {
  try {
    const chrome = await chromeLauncher.launch({
      chromeFlags: ["--headless"],
    });

    const parameters = {
      log: options.logLevel,
      output: options.output,
      port: chrome.port,
    };

    const config = {
      extends: "lighthouse:default",
      settings: {
        // maxWaitForFcp: 15 * 1000,
        // maxWaitForLoad: 35 * 1000,
        formFactor: options.mobile ? "mobile" : "desktop",
        screenEmulation: options.mobile
          ? constants.screenEmulationMetrics.mobile
          : constants.screenEmulationMetrics.desktop,
        throttling: throttling(options.throttling),
        skipAudits: ["uses-http2"],
      },
    };

    const date = new Date().getTime();

    const runnerResult = await lighthouse(url, parameters, config);

    const reportHtml = runnerResult.report;
    fs.writeFileSync(`lh${options.name}${date}.html`, reportHtml);

    await chrome.kill();

    return "success";
  } catch (error) {
    console.log(error);
  }
};

process.on("message", async (data) => {
  try {
    const result = await runLighthouseTest(data.url, data.options);
    if (result) {
      process.send(result);
      process.exit();
    } else {
      process.send([{}]);
      process.exit();
    }
  } catch (error) {
    console.log("error in child", error);
    process.exit();
  }
});
