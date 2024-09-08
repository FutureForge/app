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
      <div className="relative h-48 md:h-64 overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src={backgroundImage} 
            alt="background" 
            layout="fill" 
            objectFit="cover" 
            quality={100} 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50" />
        </div>
      </div>
      <div className="relative z-10 px-6 -mt-16 md:-mt-20">
        <div className="flex items-end space-x-5">
          <Image
            src={profileImage}
            alt="profile"
            width={isMobile ? 100 : 140}
            height={isMobile ? 100 : 140}
            quality={100}
            className="rounded-2xl border-4 border-white shadow-lg"
          />
          <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            {getFormatAddress(address)}
          </h3>
        </div>
      </div>
    </div>
  )
}
