export function convertToBlockchainTimestamp(dateTimeString?: string): bigint {
  let date: Date;

  if (dateTimeString) {
    const dateTimeParts = dateTimeString.split(", ");
    const datePart = dateTimeParts[0].split("/").reverse().join("-");
    const timePart = dateTimeParts[1].split(" ")[0];
    const timezone = dateTimeParts[1].split(" ")[1];

    const isoString = `${datePart}T${timePart}${timezone}`;

    date = new Date(isoString);
  } else {
    date = new Date();
    date.setDate(date.getDate() + 7);
  }

  return BigInt(date.getTime());
}

export function getCurrentBlockchainTimestamp(): bigint {
  return BigInt(Date.now());
}

export function isBidAmountValid({
  currentBid,
  newBidAmount,
  percentageIncrease,
}: {
  currentBid: number;
  newBidAmount: number;
  percentageIncrease: number;
}): boolean {
  const requiredBid = currentBid * (1 + percentageIncrease / 100);
  return newBidAmount >= requiredBid;
}
