const { performance } = require("perf_hooks");

function addProperties(obj) {
  return obj.a + obj.b + obj.c;
}

const monoObjects = Array.from({ length: 1000000 }, (_, i) => ({
  a: i,
  b: i,
  c: i,
}));

const megaObjects = Array.from({ length: 1000000 }, (_, i) => {
  const configs = [
    { a: i, b: i, c: i },
    { b: i, c: i, a: i },
    { c: i, a: i, b: i },
    { a: i, c: i, b: i },
    { c: i, b: i, a: i },
    { b: i, a: i, c: i },
  ];
  return configs[i % 6];
});

function runBenchmark(name, data) {
  // --- 1. WARM-UP ---
  for (let i = 0; i < 10000; i++) {
    addProperties(data[i % 1000]);
  }

  // --- 2. MEASUREMENT ---
  const start = performance.now();
  for (let i = 0; i < data.length; i++) {
    addProperties(data[i]);
  }
  const end = performance.now();

  console.log(`${name} results:`);
  console.log(`Execution time: ${(end - start).toFixed(4)} ms`);
}

console.log("Starting V8 Performance Experiment...\n");

runBenchmark("Monomorphic (Fast Path)", monoObjects);
runBenchmark("Megamorphic (Slow Path)", megaObjects);
