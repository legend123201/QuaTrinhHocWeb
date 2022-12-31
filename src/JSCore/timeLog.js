const test = () => {
  console.time("answer time");
  console.time("answer time 1");

  let a = 0;

  for (let i = 0; i < 100000000; i++) {
    a = a + 1;
  }

  console.timeLog("answer time");
  console.timeEnd("answer time 1");
  console.time("answer time 2");

  for (let i = 0; i < 100000000; i++) {
    a = a + 1;
  }

  console.timeEnd("answer time");
  console.timeEnd("answer time 2");
};

test();
