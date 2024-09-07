export function getCurrentBlockchainTimestamp(): bigint {
  // return BigInt(Date.now())
  return BigInt(Math.floor(new Date(Date.now()).getTime() / 1000))
}

export function getEndBlockchainTimestamp(date?: Date) {
  if (date) {
    return BigInt(Math.floor(date.getTime() / 1000))
  } else {
    return BigInt(Math.floor(new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).getTime() / 1000))
  }
}

export function isBidAmountValid({
  currentBid,
  newBidAmount,
  percentageIncrease,
}: {
  currentBid: number
  newBidAmount: number
  percentageIncrease: number
}): boolean {
  const requiredBid = currentBid * (1 + percentageIncrease / 100)
  return newBidAmount >= requiredBid
}

export function ensureSerializable(data: any): any {
  if (data === null || data === undefined) return data

  if (typeof data === 'bigint') return data.toString()

  if (Array.isArray(data)) return data.map(ensureSerializable)
  if (typeof data === 'object') {
    return Object.keys(data).reduce((result, key) => {
      result[key] = ensureSerializable(data[key])
      return result
    }, {} as Record<string, any>)
  }

  return data
}

export function getFormatAddress(address: string, width?: number): string {
  const xxl = 1800
  if (address && address.length !== 42) {
    return 'Invalid Ethereum Address'
  }
  if (width && width >= xxl) {
    return address
  }
  const start = address?.slice(0, 4)
  const end = address?.slice(-4)
  return `${start}...${end}`
}

export function formatBlockchainTimestamp(timestamp: string) {
  // Convert the timestamp to a Date object
  const date = new Date(parseInt(timestamp) * 1000)

  // Fix the error by specifying the correct types for the options object
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    // hour: 'numeric',
    // minute: 'numeric',
    // second: 'numeric',
    // timeZone: 'UTC',
  }

  // Format the date and time
  const formattedDate = date?.toLocaleString('en-US', options)

  return formattedDate
}
