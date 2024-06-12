/*
    console.time(X) => start the time with the label X, not log the time to the terminal console
    console.timeLog(X) => log the time from the beginning of the label X to the current time to the terminal console
    console.timeEnd(X) => stop counting the time for the label X and log the current time to the terminal console
*/

const test = () => {
  console.time("check");
  console.timeLog("check");

  let a = 0;

  for (let i = 0; i < 100000000; i++) {
    a = a + 1;
  }

  console.timeLog("check");

  for (let i = 0; i < 100000000; i++) {
    a = a + 1;
  }

  console.timeEnd("check");
};

test();
