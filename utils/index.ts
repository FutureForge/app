export function convertToBlockchainTimestamp(dateTimeString?: string): bigint {
  console.log({ dateTimeString })

  let date: Date

  // Check if the input is a timestamp (numeric string)
  if (dateTimeString && !isNaN(Number(dateTimeString))) {
    date = new Date(Number(dateTimeString))
  } else if (dateTimeString) {
    // Handle date string in expected format (e.g., 'dd/mm/yyyy, hh:mm AM/PM')
    const dateTimeParts = dateTimeString.split(', ')
    const datePart = dateTimeParts[0]?.split('/')?.reverse()?.join('-')
    const timePart = dateTimeParts[1]?.split(' ')[0]
    const timezone = dateTimeParts[1]?.split(' ')[1]

    const isoString = `${datePart}T${timePart}${timezone}`

    date = new Date(isoString)
  } else {
    // If no input is provided, set the date to the current time plus 7 days
    date = new Date()
    date.setDate(date.getDate() + 7)
  }

  return BigInt(date.getTime())
}

export function getCurrentBlockchainTimestamp(): bigint {
  return BigInt(Date.now())
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
