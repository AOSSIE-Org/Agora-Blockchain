export const UnixTimeConvertor = (timestamp1: bigint) => {
  if (timestamp1 !== undefined) {
    const mssg = JSON.parse(
      JSON.stringify(timestamp1, (key, value) => value.toString())
    );
    var timestamp = parseInt(mssg, 10);
    timestamp = timestamp * 1000;
    var date = new Date(timestamp).toDateString();
    var timer = new Date(timestamp).toTimeString();
    timer = JSON.stringify(timer);
    date = JSON.stringify(date);
    const samay = timer.slice(1, 6);
    const time = date.slice(5, date.length - 5);
    return { day: time, time: samay };
  }
};

export const SumOfArray = (creditScores: number[]) => {
  let sum = 0;
  for (let i = 0; i < creditScores.length; i++) {
    sum = sum + creditScores[i];
  }
  return sum;
};
