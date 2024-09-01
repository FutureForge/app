import React, {
  ComponentProps,
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  useState,
} from 'react'
import {
  Root,
  Trigger as SelectTrigger,
  Value as SelectValue,
  Icon as SelectIcon,
  Portal as SelectPortal,
  Content as SelectContent,
  Viewport as SelectViewport,
  Item as SelectItem,
  ItemText as SelectItemText,
  ItemIndicator as SelectItemIndicator,
  ScrollUpButton,
  ScrollDownButton,
} from '@radix-ui/react-select'
import { Button } from '../button'
import { cn } from '../../utils'
import { Icon } from '../icon-selector/icon-selector'

/* ----------------------------------------------------------------------------
 * Trigger
 * --------------------------------------------------------------------------*/

type TriggerElement = ElementRef<typeof SelectTrigger>
type ButtonProps = ComponentProps<typeof Button>
type TriggerProps = ComponentPropsWithoutRef<typeof SelectTrigger> & {
  placeholder?: string
  variant?: ButtonProps['variant']
  disabled?: boolean
}

const Trigger = forwardRef<TriggerElement, TriggerProps>((props, ref) => {
  const { placeholder, className, variant = 'secondary', disabled = false, ...triggerProps } = props

  return (
    <SelectTrigger
      className={cn(
        'py-[.625rem] px-2.5 flex justify-between font-graphik w-full text-foreground items-center gap-1 outline-none whitespace-nowrap [&[data-state=open]_svg]:rotate-180 [&_svg]:shrink-0 transition-all duration-300 ease-in-out',
        className,
      )}
      {...triggerProps}
      ref={ref}
      asChild
    >
      <button className="text-sm bg-sec-bg h-[45px] px-4 rounded-xl w-full">
        <SelectValue placeholder={placeholder} />
        <SelectIcon>
          <Icon iconType={'caret'} className="w-7" />
        </SelectIcon>
      </button>
    </SelectTrigger>
  )
})

Trigger.displayName = 'SelectTrigger'

/* ----------------------------------------------------------------------------
 * Content
 * --------------------------------------------------------------------------*/

type ContentElement = ElementRef<typeof SelectContent>
type ContentProps = ComponentPropsWithoutRef<typeof SelectContent>

const Content = forwardRef<ContentElement, ContentProps>((props, ref) => {
  const { children, sideOffset = 8, position = 'popper', className, ...contentProps } = props

  return (
    <SelectPortal>
      <SelectContent
        position={position}
        sideOffset={sideOffset}
        align="end"
        className={cn(
          'bg-background text-foreground px-2 rounded-[.9375rem] border border-foreground w-full flex items-center gap-8',
          className,
        )}
        {...contentProps}
        ref={ref}
      >
        <ScrollUpButton className="h-6 flex justify-center items-center">
          <Icon iconType="chevron" className="w-3 h-3 rotate-180" />
        </ScrollUpButton>
        <SelectViewport className="p-2 relative space-y-2.5 min-w-[--radix-select-trigger-width]">
          {children}
        </SelectViewport>
        <ScrollDownButton className="h-6 flex justify-center items-center">
          <Icon iconType="chevron" className="w-3 h-3" />
        </ScrollDownButton>
      </SelectContent>
    </SelectPortal>
  )
})

Content.displayName = 'SelectContent'

/* ----------------------------------------------------------------------------
 * Item
 * --------------------------------------------------------------------------*/

type ItemElement = ElementRef<typeof SelectItem>
type ItemProps = ComponentPropsWithoutRef<typeof SelectItem>

const Item = forwardRef<ItemElement, ItemProps>((props, ref) => {
  const { children, className, ...itemProps } = props
  return (
    <SelectItem
      className={cn(
        'outline-none !rounded-sm flex text-foreground items-center w-full font-graphik justify-between cursor-pointer',
        className,
      )}
      {...itemProps}
      ref={ref}
    >
      <SelectItemText className="flex gap-2">{children}</SelectItemText>
      <SelectItemIndicator>
        <Icon iconType={'check'} className="w-3 h-3" />
      </SelectItemIndicator>
    </SelectItem>
  )
})

Item.displayName = 'SelectItem'
/* ----------------------------------------------------------------------------
 * Exports
 * --------------------------------------------------------------------------*/

export const Select = {
  Root,
  Trigger,
  Content,
  Item,
}
