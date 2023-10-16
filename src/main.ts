import Web3 from "web3";
const httpProvider = new Web3.providers.HttpProvider("http://127.0.0.1:42000");
const web3 = new Web3(httpProvider);

(async () => {
  const hardforkNumber = 15774234;
  const intervalArray = [
    10, 100, 1000, 10000, 20000, 30000, 50000, 80000, 100000,
  ];

  async function subsection(
    interval: number,
    forwardOrback: boolean
  ): Promise<number> {
    const minInterval = 100;
    const intervalNumber = Math.floor(interval / minInterval);
    let totalSize = 0;
    for (let i = 0; i < intervalNumber; i++) {
      let start, end: number;
      if (forwardOrback) {
        start = hardforkNumber + i * minInterval;
        end = hardforkNumber + (i + 1) * minInterval;
      } else {
        start = hardforkNumber - (intervalNumber - i) * minInterval;
        end = hardforkNumber - (intervalNumber - i + 1) * minInterval;
      }
      const sizeArray = [];
      for (let j = start; j < end; j++) {
        sizeArray.push(getBlockSize(j));
      }
      const sizeArrayEnd = await Promise.all(sizeArray);
      const totalSizeEnd = sizeArrayEnd.reduce((a, b) => a + b, 0);
      totalSize += totalSizeEnd;
    }
    return totalSize;
  }

  async function getBlockSize(blockNumber: number): Promise<number> {
    try {
      return Number((await web3.eth.getBlock(blockNumber)).size);
    } catch (error) {
      return await getBlockSize(blockNumber);
    }
  }
  const data = [["Interval", "totalSize", "averageSize"]];

  for (const interval of intervalArray) {
    const forwardSize = await subsection(interval, true);
    const backwardSize = await subsection(interval, false);
    console.log(`interval: ${interval}`);
    console.log(
      `before hardfork total size is: ${backwardSize},average size is: ${
        backwardSize / interval
      }`
    );
    console.log(
      `after hardfork total size is: ${forwardSize},average size is: ${
        forwardSize / interval
      }`
    );
  }
})();
