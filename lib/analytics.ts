import ReactGA from "react-ga4";

export const initGA = () => {
  // console.log("GA init");
  ReactGA.initialize("G-B56XYR5WW0");
};

export const logPageView = () => {
  console.log(`Logging pageview for ${window.location.pathname}`);
  ReactGA.set({ page: window.location.pathname });
  ReactGA.send({
    hitType: "pageview",
    page:
      window.location.pathname + window.location.search + window.location.hash,
    title: document.title,
  });
};

export const logEvent = (category = "", action = "") => {
  if (category && action) {
    ReactGA.event({ category, action });
  }
};

export const logException = (description = "", fatal = false) => {
  if (description) {
    ReactGA.gtag("event", "exception", {
      description,
      fatal, // set to true if the error is fatal
    });
  }
};
