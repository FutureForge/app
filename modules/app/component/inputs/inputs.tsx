import React, { forwardRef, useState, useRef } from 'react'
import { cn } from '../../utils'
import Image from 'next/image'
import { Icon } from '../icon-selector/icon-selector'

/* -------------------------------------------------------------------------------------------------
 * Text Field
 * -----------------------------------------------------------------------------------------------*/
export type TextFieldProps = React.ComponentPropsWithoutRef<'input'>

const TextField = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
  const { type, className, ...inputProps } = props

  // Function to prevent negative input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === 'number' && (e.key === '-' || e.key === 'e')) {
      e.preventDefault()
    }
  }


  return (
    <input
      autoComplete="off"
      type={type}
      className={cn(
        'flex h-[45px] w-full rounded-xl bg-sec-bg px-4 text-sm outline-none transition-all duration-150 ease-out placeholder:text-muted-foreground',
        'focus-visible:bg-transparent focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
        type === 'number' && 'hide-arrows',
      )}
      ref={ref}
      onKeyDown={handleKeyDown}
      {...inputProps}
    />
  )
})
TextField.displayName = 'TextField'

/* -------------------------------------------------------------------------------------------------
 * Text Area
 * -----------------------------------------------------------------------------------------------*/

export type TextAreaProps = React.ComponentPropsWithoutRef<'textarea'>
const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => {
  const { className, ...textareaProps } = props

  return (
    <textarea
      autoComplete="off"
      className={cn('bg-sec-bg rounded-xl resize-none h-[138px] p-4', className)}
      ref={ref}
      {...textareaProps}
    />
  )
})
TextArea.displayName = 'TextArea'

/* -------------------------------------------------------------------------------------------------
 * FormFieldLabel
 * -----------------------------------------------------------------------------------------------*/

const LABEL_NAME = 'FormLabel'

type FormLabelElement = React.ElementRef<'label'>
export interface FormLabelProps extends React.ComponentPropsWithoutRef<'label'> {
  trailing?: React.ReactNode
}

const Label = React.forwardRef<FormLabelElement, FormLabelProps>((props, ref) => {
  const { className, trailing, children, htmlFor, ...labelProps } = props

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <label
          htmlFor={htmlFor}
          {...labelProps}
          ref={ref}
          className={cn('text-white font-medium text-sm', className)}
        >
          {children}
        </label>
      </div>
      {trailing}
    </div>
  )
})

Label.displayName = LABEL_NAME

/* -------------------------------------------------------------------------------------------------
 * File Input
 * -----------------------------------------------------------------------------------------------*/

const FileInput = forwardRef<HTMLInputElement, FileInputProps & { key?: string }>((props, ref) => {
  const { onChange, ...otherProps } = props
  const [fileName, setFileName] = useState<string | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MAX_FILE_SIZE_MB = 50
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (validateFileType(file) && validateFileSize(file)) {
        setFileName(file.name)
        setFilePreview(URL.createObjectURL(file))
        setError(null)
        // Call the onChange prop with the selected file
        if (onChange) {
          onChange(event)
        }
      }
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    const file = event.dataTransfer.files?.[0]
    if (file) {
      if (validateFileType(file) && validateFileSize(file)) {
        setFileName(file.name)
        setFilePreview(URL.createObjectURL(file))
        setError(null)
        // Create a new change event and call onChange
        if (onChange && fileInputRef.current) {
          const dataTransfer = new DataTransfer()
          dataTransfer.items.add(file)
          fileInputRef.current.files = dataTransfer.files
          const newEvent = new Event('change', { bubbles: true })
          onChange(newEvent as unknown as React.ChangeEvent<HTMLInputElement>)
        }
      }
    }
  }

  const validateFileType = (file: File) => {
    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/avif',
      'image/svg+xml',
      'video/mp4',
    ]
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a JPG, PNG, GIF, SVG, or MP4 file.')
      return false
    }
    return true
  }

  const validateFileSize = (file: File) => {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`)
      return false
    }
    return true
  }

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <>
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="flex w-full h-full items-center relative text-center bg-sec-bg justify-center cursor-pointer rounded-2xl"
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept=".jpeg,.jpg,.png,.gif,.svg,.mp4,.webp,.avif"
          style={{ display: 'none' }}
          {...otherProps}
        />
        {filePreview ? (
          filePreview.endsWith('.mp4') ? (
            <video src={filePreview} controls style={{ maxWidth: '100%', maxHeight: '100%' }} />
          ) : (
            <Image
              src={filePreview}
              alt={fileName || 'Uploaded file'}
              layout="fill"
              className="absolute inset-0 rounded-xl border border-sec-bg"
              style={{ maxWidth: '100%', maxHeight: '100%' }}
            />
          )
        ) : (
          <div className="flex flex-col items-center justify-center gap-6 py-8">
            <Icon iconType={'download'} className="w-20 max-md:w-10" />
            <div className="flex flex-col gap-4">
              <p className="font-medium text-muted-foreground">Drag and drop media</p>
              <p>Browse Files</p>
              <span>
                <p className="text-sm text-muted-foreground">Max size: 50MB</p>
                <p className="text-sm text-muted-foreground">JPG, PNG, GIF, SVG, MP4</p>
              </span>
            </div>
          </div>
        )}
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </>
  )
})
FileInput.displayName = 'FileInput'

export { TextField, TextArea, Label, FileInput }

export type FileInputProps = React.ComponentPropsWithoutRef<'input'>
