import { forwardRef } from 'react'
import { buttonStyles } from './button.styles'
import { VariantProps } from 'tailwind-variants'
import { Slot } from '@radix-ui/react-slot'

type ButtonElement = React.ElementRef<'button'>
type ButtonVariants = VariantProps<typeof buttonStyles>
type ButtonProps = React.ComponentPropsWithoutRef<'button'> &
  ButtonVariants & {
    asChild?: boolean
  }

export const Button = forwardRef<ButtonElement, ButtonProps>((props, ref) => {
  const {
    asChild = false,
    type = 'button',
    className,
    variant,
    size,
    active,
    ...buttonProps
  } = props
  const Component = asChild ? Slot : 'button'

  return (
    <Component
      type={type}
      className={buttonStyles({ variant, size, active, className })}
      {...buttonProps}
      ref={ref}
    />
  )
})

Button.displayName = 'Button'
