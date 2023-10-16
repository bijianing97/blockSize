import Web3 from "web3";
const httpProvider = new Web3.providers.HttpProvider("http://127.0.0.1:42000");
const web3 = new Web3(httpProvider);

(async () => {
  const hardforkNumber = 15774234;
  const intervalArray = [
    10, 100, 1000, 10000, 20000, 30000, 50000, 80000, 100000,
  ];

  async function getBlockSize(blockNumber: number): Promise<number> {
    try {
      return Number((await web3.eth.getBlock(blockNumber)).size);
    } catch (error) {
      return await getBlockSize(blockNumber);
    }
  }
  const data = [["Interval", "totalSize", "averageSize"]];

  for (const interval of intervalArray) {
    let beforeSizeArray = [];
    for (let i = hardforkNumber - interval; i < hardforkNumber; i++) {
      beforeSizeArray.push(getBlockSize(i));
    }
    beforeSizeArray = await Promise.all(beforeSizeArray);
    const beforeTotalSize = beforeSizeArray.reduce((a, b) => a + b, 0);
    const beforeAverageSize = beforeTotalSize / interval;

    console.log(
      `interval: ${interval}, beforeTotalSize:${beforeTotalSize} ,beforeAverageSize: ${beforeAverageSize}`
    );

    let afterSizeArray = [];
    for (let i = hardforkNumber; i < hardforkNumber + interval; i++) {
      afterSizeArray.push(getBlockSize(i));
    }
    afterSizeArray = await Promise.all(afterSizeArray);
    const AfterTotalSize = afterSizeArray.reduce((a, b) => a + b, 0);
    const AfterAverageSize = AfterTotalSize / interval;
    console.log(
      `interval: ${interval}, AfterTotalSize:${AfterTotalSize} ,AfterAverageSize: ${AfterAverageSize}`
    );
  }
})();
