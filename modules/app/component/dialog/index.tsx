'use client'
import { ComponentPropsWithoutRef, ElementRef, ReactNode, forwardRef } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Drawer } from 'vaul'
import { useMediaQuery } from '@uidotdev/usehooks'
import { cn } from '../../utils'
// import { ScrollArea } from '../scroll-area/scroll-area'
// import { Heading } from '../heading/heading'
// import CloseIcon from '@/assets/svg/close.svg'

/* -------------------------------------------------------------------------------------------------
 * Root
 * -----------------------------------------------------------------------------------------------*/

type RootProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Root> & {
  nested?: boolean
}

const Root = (props: RootProps) => {
  const { nested = false, ...rootProps } = props
  const isMobile = useMediaQuery('(max-width: 440px)')
  const DrawerRoot = nested ? Drawer.NestedRoot : Drawer.Root
  const RootWrapper = isMobile ? DrawerRoot : DialogPrimitive.Root
  return <RootWrapper {...rootProps} />
}

/* -------------------------------------------------------------------------------------------------
 * Trigger
 * -----------------------------------------------------------------------------------------------*/

type TriggerElement = ElementRef<typeof DialogPrimitive.Trigger>
type TriggerProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>

const Trigger = forwardRef<TriggerElement, TriggerProps>((props, ref) => {
  const { asChild = true, ...triggerProps } = props
  const isMobile = useMediaQuery('(max-width: 440px)')
  const TriggerWrapper = isMobile ? Drawer.Trigger : DialogPrimitive.Trigger
  return <TriggerWrapper asChild={asChild} {...triggerProps} ref={ref} />
})

Trigger.displayName = 'DialogTrigger'

/* -------------------------------------------------------------------------------------------------
 * Content
 * -----------------------------------------------------------------------------------------------*/

type ContentElement = ElementRef<typeof DialogPrimitive.Content>
type ContentProps = Omit<ComponentPropsWithoutRef<typeof DialogPrimitive.Content>, 'onAnimationEnd'>

const Content = forwardRef<ContentElement, ContentProps>((props, ref) => {
  const isMobile = useMediaQuery('(max-width: 440px)')
  return isMobile ? <DrawerContent {...props} ref={ref} /> : <DialogContent {...props} ref={ref} />
})

Content.displayName = 'DialogContent'

const DialogContent = forwardRef<ContentElement, ContentProps>((props, ref) => {
  const { className, ...contentProps } = props
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/80 flex items-center justify-center data-[state=open]:animate-overlay-show data-[state=closed]:animate-overlay-hide px-4">
        <DialogPrimitive.Content
          className={cn(
            'relative bg-background border border-dialog-border rounded-[24px] max-h-[95vh] flex flex-col',
            'data-[state=open]:animate-dialog-show data-[state=closed]:animate-dialog-hide',
            className,
          )}
          {...contentProps}
          onPointerDownOutside={(event) => {
            contentProps.onPointerDownOutside?.(event)
            const target = event.target as HTMLElement
            if (target.closest('[data-sonner-toast]')) {
              event.preventDefault()
            }
          }}
          ref={ref}
        >
          {/* <Dialog.Close className="absolute top-4 right-4 p-2">
            <CloseIcon />
          </Dialog.Close> */}
          {contentProps.children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Overlay>
    </DialogPrimitive.Portal>
  )
})

DialogContent.displayName = 'DialogContent'

type DrawerContentElement = ElementRef<typeof Drawer.Content>
type DrawerContentProps = ComponentPropsWithoutRef<typeof Drawer.Content>

const DrawerContent = forwardRef<DrawerContentElement, DrawerContentProps>((props, ref) => {
  const { className, ...contentProps } = props
  return (
    <Drawer.Portal>
      <Drawer.Overlay className="fixed inset-0 bg-black/80" />
      <Drawer.Content
        className={cn(
          'bg-background flex flex-col rounded-t-[20px] max-h-[96%] h-full fixed bottom-0 left-0 right-0',
          className,
        )}
        {...contentProps}
        onOpenAutoFocus={(event) => {
          contentProps.onOpenAutoFocus?.(event)
          event.preventDefault()
        }}
        ref={ref}
      />
    </Drawer.Portal>
  )
})

DrawerContent.displayName = 'DialogContent'

/* -------------------------------------------------------------------------------------------------
 * Body
 * -----------------------------------------------------------------------------------------------*/

type BodyElement = ElementRef<'div'>
type BodyProps = Omit<ComponentPropsWithoutRef<'div'>, 'dir'>

const Body = forwardRef<BodyElement, BodyProps>((props, ref) => {
  const { className, ...bodyProps } = props
  return <div className="flex flex-1 overflow-auto">{bodyProps.children}</div>
})

Body.displayName = 'DialogBody'

/* -------------------------------------------------------------------------------------------------
 * Header
 * -----------------------------------------------------------------------------------------------*/

type HeaderElement = ElementRef<'div'>
type HeaderProps = ComponentPropsWithoutRef<'div'> & {
  icon?: ReactNode
}

const Header = forwardRef<HeaderElement, HeaderProps>((props, ref) => {
  const { className, icon, children, ...headerProps } = props
  return (
    <div
      className={cn('p-6 flex justify-center items-center gap-3.5', className)}
      {...headerProps}
      ref={ref}
    >
      {icon && (
        <div className="size-10 shrink-0 rounded-full border border-new-elements-border flex justify-center items-center text-new-muted-foreground">
          {icon}
        </div>
      )}
      <div>{children}</div>
    </div>
  )
})

Header.displayName = 'DialogHeader'

/* -------------------------------------------------------------------------------------------------
 * Title
 * -----------------------------------------------------------------------------------------------*/

type TitleElement = ElementRef<typeof DialogPrimitive.Title>
type TitleProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Title>

const Title = forwardRef<TitleElement, TitleProps>((props, ref) => {
  const { className, ...titleProps } = props
  const isMobile = useMediaQuery('(max-width: 440px)')
  const TitleWrapper = isMobile ? Drawer.Title : DialogPrimitive.Title
  return (
    <h3  className='text-2xl font-semibold'>
      <TitleWrapper
        className={cn('text-base font-medium', className)}
        {...titleProps}
        ref={ref}
      />
    </h3>
  )
})

Title.displayName = 'DialogTitle'

/* -------------------------------------------------------------------------------------------------
 * Description
 * -----------------------------------------------------------------------------------------------*/

type DescriptionElement = ElementRef<typeof DialogPrimitive.Description>
type DescriptionProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Description>

const Description = forwardRef<DescriptionElement, DescriptionProps>((props, ref) => {
  const { className, ...descriptionProps } = props
  const isMobile = useMediaQuery('(max-width: 440px)')
  const DescriptionWrapper = isMobile ? Drawer.Description : DialogPrimitive.Description
  return (
    <DescriptionWrapper
      className={cn('text-new-muted-foreground text-xs', className)}
      {...descriptionProps}
      ref={ref}
    />
  )
})

Description.displayName = 'DialogDescription'

export const Dialog = {
  Root,
  NestedRoot: Drawer.NestedRoot,
  Trigger,
  Content,
  Header,
  Body,
  Title,
  Description,
  Close: DialogPrimitive.Close,
}
