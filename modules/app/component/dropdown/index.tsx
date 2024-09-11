import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react'
import { cn } from '../../utils'

/* -------------------------------------------------------------------------------------------------
 * Trigger
 * -----------------------------------------------------------------------------------------------*/

type TriggerElement = ElementRef<typeof DropdownMenu.Trigger>
type TriggerProps = ComponentPropsWithoutRef<typeof DropdownMenu.Trigger>

const Trigger = forwardRef<TriggerElement, TriggerProps>((props, ref) => {
  const { asChild = true, ...triggerProps } = props

  return <DropdownMenu.Trigger asChild={asChild} {...triggerProps} ref={ref} />
})

Trigger.displayName = 'DropdownTrigger'

/* -------------------------------------------------------------------------------------------------
 * Content
 * -----------------------------------------------------------------------------------------------*/

type ContentElement = ElementRef<typeof DropdownMenu.Content>
type ContentProps = ComponentPropsWithoutRef<typeof DropdownMenu.Content>

const Content = forwardRef<ContentElement, ContentProps>((props, ref) => {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        className={cn(
          'bg-background min-w-[--radix-dropdown-menu-trigger-width] border border-sec-bg rounded-xl p-3',
          'origin-[--radix-dropdown-menu-content-transform-origin]',
        )}
        ref={ref}
        {...props}
      />
    </DropdownMenu.Portal>
  )
})
Content.displayName = 'DropdownContent'

/* -------------------------------------------------------------------------------------------------
 * Item
 * -----------------------------------------------------------------------------------------------*/

type ItemElelment = ElementRef<typeof DropdownMenu.Item>
type ItemProps = ComponentPropsWithoutRef<typeof DropdownMenu.Item>

const Item = forwardRef<ItemElelment, ItemProps>((props, ref) => {
  return <DropdownMenu.Item ref={ref} {...props} />
})

Item.displayName = 'DropdownItem'

/* -------------------------------------------------------------------------------------------------
 * SubTrigger
 * -----------------------------------------------------------------------------------------------*/

type SubTriggerElement = ElementRef<typeof DropdownMenu.SubTrigger>
type SubTriggerProps = ComponentPropsWithoutRef<typeof DropdownMenu.SubTrigger>

const SubTrigger = forwardRef<SubTriggerElement, SubTriggerProps>((props, ref) => {
  const { asChild = true, ...subTriggerProps } = props
  return <DropdownMenu.SubTrigger asChild={asChild} ref={ref} {...subTriggerProps} />
})

SubTrigger.displayName = 'DropdownSubTrigger'

/* -------------------------------------------------------------------------------------------------
 * SubContent
 * -----------------------------------------------------------------------------------------------*/
type SubContentElement = ElementRef<typeof DropdownMenu.SubContent>
type SubContentProps = ComponentPropsWithoutRef<typeof DropdownMenu.SubContent>

const SubContent = forwardRef<SubContentElement, SubContentProps>((props, ref) => {
  return <DropdownMenu.SubContent ref={ref} {...props} />
})

SubContent.displayName = 'DropdownSubContent'

export const Dropdown = {
  Root: DropdownMenu.Root,
  Group: DropdownMenu.Group,
  Label: DropdownMenu.Label,
  CheckboxItem: DropdownMenu.CheckboxItem,
  RadioGroup: DropdownMenu.RadioGroup,
  RadioItem: DropdownMenu.RadioItem,
  ItemIndicator: DropdownMenu.ItemIndicator,
  Separator: DropdownMenu.Separator,
  Sub: DropdownMenu.Sub,
  Arrow: DropdownMenu.Arrow,
  Trigger,
  Content,
  Item,
  SubContent,
  SubTrigger,
}
