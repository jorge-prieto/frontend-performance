import type { NextPage } from "next";
import { getPerformanceScore } from "../services/runPerformance";

const Home: NextPage = () => {
  const runTest = async () => {
    const url = setUpQuery();
    const data = await getPerformanceScore(url);
    console.log(data);
    // await fetch(url, {
    //   mode: "no-cors",
    //   headers: {
    //     "Access-Control-Allow-Origin": "*",
    //   },
    // })
    //   .then((response) => response.json())
    //   .then((json) => {
    //     // See https://developers.google.com/speed/docs/insights/v5/reference/pagespeedapi/runpagespeed#response
    //     // to learn more about each of the properties in the response object.
    //     showInitialContent(json.id);
    //     const cruxMetrics = {
    //       "First Contentful Paint":
    //         json.loadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS.category,
    //       "First Input Delay":
    //         json.loadingExperience.metrics.FIRST_INPUT_DELAY_MS.category,
    //     };
    //     showCruxContent(cruxMetrics);
    //     const lighthouse = json.lighthouseResult;
    //     const lighthouseMetrics = {
    //       "First Contentful Paint":
    //         lighthouse.audits["first-contentful-paint"].displayValue,
    //       "Speed Index": lighthouse.audits["speed-index"].displayValue,
    //       "Time To Interactive": lighthouse.audits["interactive"].displayValue,
    //       "First Meaningful Paint":
    //         lighthouse.audits["first-meaningful-paint"].displayValue,
    //       "First CPU Idle": lighthouse.audits["first-cpu-idle"].displayValue,
    //       "Estimated Input Latency":
    //         lighthouse.audits["estimated-input-latency"].displayValue,
    //     };
    //     showLighthouseContent(lighthouseMetrics);
    //   });
  };

  const setUpQuery = () => {
    const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed`;
    const parameters: any = {
      url: encodeURIComponent("https://www.elcolombiano.com"),
    };
    let query = `${api}?`;
    for (const key in parameters) {
      query += `${key}=${parameters[key]}`;
    }
    return query;
  };

  function showInitialContent(id: any) {
    document.body.innerHTML = "";
    const title = document.createElement("h1");
    title.textContent = "PageSpeed Insights API Demo";
    document.body.appendChild(title);
    const page = document.createElement("p");
    page.textContent = `Page tested: ${id}`;
    document.body.appendChild(page);
  }

  function showCruxContent(cruxMetrics: any) {
    const cruxHeader = document.createElement("h2");
    cruxHeader.textContent = "Chrome User Experience Report Results";
    document.body.appendChild(cruxHeader);
    for (const key in cruxMetrics) {
      const p = document.createElement("p");
      p.textContent = `${key}: ${cruxMetrics[key]}`;
      document.body.appendChild(p);
    }
  }

  function showLighthouseContent(lighthouseMetrics: any) {
    const lighthouseHeader = document.createElement("h2");
    lighthouseHeader.textContent = "Lighthouse Results";
    document.body.appendChild(lighthouseHeader);
    for (const key in lighthouseMetrics) {
      const p = document.createElement("p");
      p.textContent = `${key}: ${lighthouseMetrics[key]}`;
      document.body.appendChild(p);
    }
  }

  const handleClick = () => {
    runTest();
  };
  return (
    <div className="font-normal flex justify-center items-center my-80 text-white">
      <button
        type="button"
        className="bg-black rounded py-2 px-8"
        onClick={handleClick}
      >
        {" "}
        RUN TEST{" "}
      </button>
    </div>
  );
};

export default Home;
