'use client'
import { useUserChainInfo } from '@/modules/query'
import { getFormatAddress } from '@/utils'
import { useWindowSize } from '@uidotdev/usehooks'
import Image from 'next/image'
import { createHash } from 'crypto'
import { ClientOnly } from '@/modules/app'
import { ICollection } from '@/utils/models'

type HeaderProps = {
  isCollection?: boolean
  floorPrice?: string | undefined
  totalVolume?: number
  listed?: number
  uniqueHolders?: number
  totalSupply?: number
  transferCount?: number
  collection?: ICollection
  collectionFee?: string
}

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
    ${pixels
      .map(
        (color, i) =>
          `<rect x="${i % size}" y="${Math.floor(
            i / size,
          )}" width="1" height="1" fill="${color}" />`,
      )
      .join('')}
  </svg>`
}

export function Header({
  isCollection = false,
  floorPrice,
  totalVolume,
  listed,
  uniqueHolders,
  totalSupply,
  transferCount,
  collection,
  collectionFee,
}: HeaderProps) {
  const { activeAccount } = useUserChainInfo()
  const address = activeAccount?.address || ''
  const { width } = useWindowSize()
  const isMobile = width && width <= 440

  const userBackgroundImage = generatePixelatedImage(address, 100)
  const userProfileImage = generatePixelatedImage(address, 10)

  // Ensure floorPrice and listed are properly rounded
  const roundedFloorPrice = floorPrice ? parseFloat(floorPrice).toFixed(2) : '0.00'
  const roundedPercentage = listed ? Number(listed).toFixed(2) : '0.00'

  return (
    <ClientOnly>
      <div className="w-full">
        {!isMobile ? (
          <div className="relative">
            <div className="h-[50vh] lg:h-64 w-full overflow-hidden">
              {isCollection ? (
                <Image
                  src={collection?.backgroundImage || '/background.jpeg'}
                  alt="collection background"
                  width={2500}
                  height={1000}
                  quality={100}
                  objectFit="cover max-md:hidden"
                />
              ) : (
                <Image
                  src={userBackgroundImage}
                  alt="background"
                  width={2500}
                  height={1000}
                  quality={100}
                />
              )}
              <Image
                src="/gradients.png"
                alt="gradient"
                width={2000}
                height={1000}
                className="absolute bottom-0"
              />
            </div>

            <div className="absolute lg:-bottom-20 -bottom-0 w-full items-start lg:left-6 flex max-md:flex-col gap-4 text-3xl font-semibold z-10">
              <Image
                src={
                  isCollection
                    ? collection?.image!
                      ? collection?.image!
                      : '/logo.svg'
                    : userProfileImage
                }
                alt="profile"
                width={isMobile ? 100 : 170}
                height={isMobile ? 100 : 170}
                quality={100}
                className="rounded-2xl "
              />
              <div className="flex justify-between w-full max-lg:flex-col gap-4 max-md:gap-8 max-md:px-2">
                <span>
                  <h3 className="text-2xl">
                    {isCollection ? collection?.name! : getFormatAddress(address)}
                  </h3>
                  {isCollection && (
                    <p className="text-base font-normal mt-2 xl:max-w-[350px] text-muted-foreground">
                      {collection?.description}
                    </p>
                  )}
                </span>

                {isCollection ? (
                  <div className="flex lg:grid grid-cols-4 min-[1720px]:flex items-center gap-5 mr-12 flex-wrap">
                    <span>
                      <h3 className="font-bold text-2xl max-md:text-base whitespace-nowrap">
                        {roundedFloorPrice} XFI
                      </h3>
                      <p className="text-base font-normal max-md:text-xs text-muted-foreground">
                        Floor Price
                      </p>
                    </span>
                    <span>
                      <h3 className="font-bold text-2xl max-md:text-base whitespace-nowrap">
                        {totalVolume || 0} XFI
                      </h3>
                      <p className="text-base font-normal max-md:text-xs text-muted-foreground">
                        Volume
                      </p>
                    </span>
                    <span>
                      <h3 className="font-bold text-2xl max-md:text-base whitespace-nowrap">
                        {totalSupply || 0}
                      </h3>
                      <p className="text-base font-normal max-md:text-xs text-muted-foreground">
                        Total Supply
                      </p>
                    </span>
                    <span>
                      <h3 className="font-bold text-2xl max-md:text-base whitespace-nowrap">
                        {uniqueHolders || 0}
                      </h3>
                      <p className="text-base font-normal max-md:text-xs text-muted-foreground">
                        Unique Holders
                      </p>
                    </span>
                    <span>
                      <h3 className="font-bold text-2xl max-md:text-base whitespace-nowrap">
                        {transferCount || 0}
                      </h3>
                      <p className="text-base font-normal max-md:text-xs">Total Transfers</p>
                    </span>
                    <span>
                      <h3 className="font-bold text-2xl max-md:text-base whitespace-nowrap">
                        {collectionFee || 0} %
                      </h3>
                      <p className="text-base font-normal max-md:text-xs">Collection Fee</p>
                    </span>
                    <span>
                      <h3 className="font-bold text-2xl max-md:text-base whitespace-nowrap">
                        {roundedPercentage}%
                      </h3>
                      <p className="text-base font-normal max-md:text-xs text-muted-foreground">
                        Listed
                      </p>
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <MobileHeader
            isCollection={isCollection}
            userProfileImage={userProfileImage}
            isMobile={isMobile}
            collection={collection}
            roundedFloorPrice={roundedFloorPrice}
            roundedPercentage={roundedPercentage}
            totalVolume={totalVolume}
            totalSupply={totalSupply}
            uniqueHolders={uniqueHolders}
            transferCount={transferCount}
            collectionFee={collectionFee}
          />
        )}
      </div>
    </ClientOnly>
  )
}

type MobileHeaderProps = HeaderProps & {
  roundedFloorPrice?: string | undefined
  userBackgroundImage?: string
  userProfileImage?: string
  isMobile?: boolean
  roundedPercentage?: string
}
function MobileHeader({
  isCollection = false,
  roundedFloorPrice,
  totalVolume,
  roundedPercentage,
  uniqueHolders,
  totalSupply,
  transferCount,
  collection,
  collectionFee,
  userBackgroundImage,
  isMobile,
  userProfileImage,
}: MobileHeaderProps) {


  const { activeAccount } = useUserChainInfo()
  const address = activeAccount?.address || ''


  return (
    <div className="relative">
      <div className="w-full items-start lg:left-6 flex max-md:flex-col gap-4 text-3xl font-semibold z-10">
        <div className="flex gap-4">
          <Image
            src={
              isCollection
                ? collection?.image!
                  ? collection?.image!
                  : '/logo.svg'
                : userProfileImage || '/logo.svg'
            }
            alt="profile"
            width={isMobile ? 100 : 170}
            height={isMobile ? 100 : 170}
            quality={100}
            className="rounded-2xl "
          />

          <span>
            <h3 className="text-2xl">
              {isCollection ? collection?.name! : getFormatAddress(address || '')}
            </h3>
            {isCollection && (
              <p className="text-base font-normal mt-2 xl:max-w-[350px] text-muted-foreground">
                {collection?.description}
              </p>
            )}
          </span>
        </div>

        <div className="flex justify-between w-full max-lg:flex-col mt-6 gap-4 max-md:gap-8 max-md:px-2">
          {isCollection ? (
            <div className="flex lg:grid grid-cols-4 min-[1720px]:flex overflow-x-scroll  items-center gap-5 whitespace-nowrap">
              <span>
                <h3 className="font-bold text-2xl max-md:text-base whitespace-nowrap">
                  {roundedFloorPrice} XFI
                </h3>
                <p className="text-base font-normal max-md:text-xs text-muted-foreground">
                  Floor Price
                </p>
              </span>
              <span>
                <h3 className="font-bold text-2xl max-md:text-base whitespace-nowrap">
                  {totalVolume || 0} XFI
                </h3>
                <p className="text-base font-normal max-md:text-xs text-muted-foreground">Volume</p>
              </span>
              <span>
                <h3 className="font-bold text-2xl max-md:text-base whitespace-nowrap">
                  {totalSupply || 0}
                </h3>
                <p className="text-base font-normal max-md:text-xs text-muted-foreground">
                  Total Supply
                </p>
              </span>
              <span>
                <h3 className="font-bold text-2xl max-md:text-base whitespace-nowrap">
                  {uniqueHolders || 0}
                </h3>
                <p className="text-base font-normal max-md:text-xs text-muted-foreground">
                  Unique Holders
                </p>
              </span>
              <span>
                <h3 className="font-bold text-2xl max-md:text-base whitespace-nowrap">
                  {transferCount || 0}
                </h3>
                <p className="text-base font-normal max-md:text-xs">Total Transfers</p>
              </span>
              <span>
                <h3 className="font-bold text-2xl max-md:text-base whitespace-nowrap">
                  {collectionFee || 0} %
                </h3>
                <p className="text-base font-normal max-md:text-xs">Collection Fee</p>
              </span>
              <span>
                <h3 className="font-bold text-2xl max-md:text-base whitespace-nowrap">
                  {roundedPercentage}%
                </h3>
                <p className="text-base font-normal max-md:text-xs text-muted-foreground">Listed</p>
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
