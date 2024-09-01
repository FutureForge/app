import React, { forwardRef, useState, useRef } from 'react'
import { cn } from '../../utils'
import Image from 'next/image'

/* -------------------------------------------------------------------------------------------------
 * Text Field
 * -----------------------------------------------------------------------------------------------*/
export type TextFieldProps = React.ComponentPropsWithoutRef<'input'>

const TextField = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
  const { type, className, ...inputProps } = props
  return (
    <input
      autoComplete="off"
      type={type}
      className={cn(
        'flex h-[52px] w-full rounded-lg bg-tertiary px-4 text-sm outline-none transition-all duration-150 ease-out placeholder:text-muted-foreground',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:bg-transparent focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'h-full w-full bg-transparent px-4 outline-none',
        className,
      )}
      ref={ref}
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
  const { className } = props

  return (
    <textarea autoComplete="off" className={cn('bg-tertiary rounded-lg', className)} ref={ref} />
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
        <label htmlFor={htmlFor} {...labelProps} ref={ref} className={cn('text-white', className)}>
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

export type FileInputProps = React.ComponentPropsWithoutRef<'input'>

const FileInput = forwardRef<HTMLInputElement, FileInputProps>((props, ref) => {
  const [fileName, setFileName] = useState<string | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && validateFileType(file)) {
      setFileName(file.name)
      setFilePreview(URL.createObjectURL(file))
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
    if (file && validateFileType(file)) {
      setFileName(file.name)
      setFilePreview(URL.createObjectURL(file))
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(file)
        fileInputRef.current.files = dataTransfer.files
      }
    }
  }

  const validateFileType = (file: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    return validTypes.includes(file.type)
  }

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
      }}
      className='flex w-full h-full items-center justify-center cursor-pointer'
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept=".jpeg,.jpg,.png,.gif"
        style={{ display: 'none' }}
        {...props}
      />
      {filePreview ? (
        <Image
          src={filePreview}
          alt={fileName || 'Uploaded file'}
          style={{ maxWidth: '100%', maxHeight: '100%' }}
        />
      ) : (
        <p>Click or drag an image file (JPEG, JPG, PNG, GIF) to upload</p>
      )}
    </div>
  )
})
FileInput.displayName = 'FileInput'

export { TextField, TextArea, Label, FileInput, }
