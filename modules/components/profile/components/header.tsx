import { useUserChainInfo } from '@/modules/query'
import { getFormatAddress } from '@/utils'
import { useMediaQuery } from '@uidotdev/usehooks'
import Image from 'next/image'
import { createHash } from 'crypto'

// Function to generate a color based on hash
function generateColor(hash: string, index: number): string {
  const hue = parseInt(hash.substr(index * 2, 2), 16) % 360
  return `hsl(${hue}, 70%, 50%)`
}

// Function to generate pixelated image data
function generatePixelatedImage(address: string, size: number): string {
  const hash = createHash('sha256').update(address).digest('hex')
  const pixels = []
  for (let i = 0; i < size * size; i++) {
    pixels.push(generateColor(hash, i % 32))
  }
  return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    ${pixels.map((color, i) => `<rect x="${i % size}" y="${Math.floor(i / size)}" width="1" height="1" fill="${color}" />`).join('')}
  </svg>`
}

export function Header() {
  const { activeAccount } = useUserChainInfo()
  const address = activeAccount?.address || ''
  const isMobile = useMediaQuery('(max-width: 440px)')

  const backgroundImage = generatePixelatedImage(address, 100)
  const profileImage = generatePixelatedImage(address, 10)

  return (
    <div className="w-full">
      <div className="relative">
        <div className="h-48 md:h-64 w-full overflow-hidden" >
          <Image
            src={backgroundImage}
            alt="background"
            width={2000}
            height={1000}
            quality={100}
            className=""
          />
          <Image
            src="/gradients.png"
            alt="gradient"
            width={2000}
            height={1000}
            className="absolute bottom-0"
          />
        </div>

        <div className="absolute lg:-bottom-20 -bottom-14 items-start left-6 flex gap-4 text-3xl font-semibold z-10">
          <Image
            src={profileImage}
            alt="profile"
            width={isMobile ? 100 : 170}
            height={isMobile ? 100 : 170}
            quality={100}
            className="rounded-2xl"
          />

          <h3>{getFormatAddress(address)}</h3>
        </div>
      </div>
    </div>
  )
}
