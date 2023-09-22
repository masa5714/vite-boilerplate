let currentDevice = "";
const breakpoints = {
  sp: 430,
  tablet: 768,
};
const body = document.querySelector("body");

const detectViewport = (width) => {
  if (breakpoints.sp >= width) {
    body.dataset.viewport = "sp";
  } else if (breakpoints.tablet >= width) {
    body.dataset.viewport = "tablet";
  } else {
    body.dataset.viewport = "pc";
  }
};

const width = window.innerWidth;
detectViewport(width);
currentDevice = body.dataset.viewport;

window.addEventListener("resize", () => {
  const width = window.innerWidth;
  detectViewport(width);
});

const observerStartBody = (
  functions = {
    sp: null,
    tablet: null,
    pc: null,
  }
) => {
  deviceFunctionController(currentDevice, functions);
  const observer = new MutationObserver((element) => {
    const target = element[0].target;
    const viewport = target.dataset.viewport;
    if (currentDevice === viewport) {
      return;
    }
    currentDevice = viewport;
    deviceFunctionController(currentDevice, functions);
  });

  observer.observe(body, {
    attributes: true,
  });
};

const deviceFunctionController = (currentDevice, functions) => {
  if (currentDevice === "sp") {
    functions.pc && typeof functions.pc.remove === "function" ? functions.pc.remove() : null;
    functions.tablet && typeof functions.tablet.remove === "function" ? functions.tablet.remove() : null;
    functions.sp && typeof functions.sp.add === "function" ? functions.sp.add() : null;
  }
  if (currentDevice === "tablet") {
    functions.pc && typeof functions.pc.remove === "function" ? functions.pc.remove() : null;
    functions.sp && typeof functions.sp.remove === "function" ? functions.sp.remove() : null;
    functions.tablet && typeof functions.tablet.add === "function" ? functions.tablet.add() : null;
  }
  if (currentDevice === "pc") {
    functions.sp && typeof functions.sp.remove === "function" ? functions.sp.remove() : null;
    functions.tablet && typeof functions.tablet.remove === "function" ? functions.tablet.remove() : null;
    functions.pc && typeof functions.pc.add === "function" ? functions.pc.add() : null;
  }
};

export { observerStartBody };
