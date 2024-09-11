import { tv } from 'tailwind-variants'

export const buttonStyles = tv({
  base: 'inline-flex justify-center items-center w-full font-medium',
  variants: {
    variant: {
      primary: 'bg-primary text-muted-foreground rounded-[10px]',
      secondary:
        'bg-sec-btn text-white px-2 rounded-lg hover:bg-sec-btn/80 duration-300 ease-in-out transition-all',
      outline: 'bg-background text-foreground px-3 rounded-[30px] border border-foreground gap-2',
    },
    size: {
      sm: 'h-8',
      md: 'h-12',
    },
    active: {
      true: '',
    },
    disabled: {
      true: 'opacity-50 cursor-not-allowed pointer-events-none',
    },
  },
  compoundVariants: [
    {
      variant: 'outline',
      active: true,
      className: 'bg-primary text-primary-foreground shadow-[2px_2px_0_0_#000000]',
    },
  ],
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})
