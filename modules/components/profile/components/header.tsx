import { useMediaQuery } from '@uidotdev/usehooks'
import Image from 'next/image'



export function Header() {
  const isMobile = useMediaQuery('(max-width: 440px)')
 
  return (
    <div className="w-full">
      <div className="relative">
        <Image src={'/placeHolder.png'} alt="background" width={2000} height={1000} quality={100} />
        <Image
          src="/gradients.png"
          alt="gradient"
          width={2000}
          height={1000}
          className="absolute bottom-0"
        />
        <div className="absolute lg:-bottom-20 -bottom-14 items-start left-6 flex gap-4 text-3xl font-semibold z-10">
          <Image
            src={'/Asset.png'}
            alt="profile"
            width={isMobile ? 100 : 170}
            height={isMobile ? 100 : 170}
            quality={100}
            className="rounded-2xl"
          />

          <h3>AnimaKid</h3>
        </div>
      </div>
    </div>
  )
}
