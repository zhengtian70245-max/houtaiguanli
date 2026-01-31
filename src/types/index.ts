export interface Column {
  prop?: string
  label: string
  width?: number
  minWidth?: number
  align?: 'left' | 'center' | 'right'
  type?: 'text' | 'status' | 'level' | 'date' | 'money' | 'action'
  slot?: string
}

export interface Action {
  type: string
  label: string
  size?: 'default' | 'small' | 'large'
  icon?: any
  disabled?: (row: any) => boolean
}

export interface Pagination {
  page: number
  size: number
  total: number
}

export interface Field {
  prop: string
  label: string
  type: 'input' | 'select' | 'date' | 'daterange' | 'number' | 'textarea' | 'radio' | 'checkbox' | 'switch' | 'upload'
  placeholder?: string
  startPlaceholder?: string
  endPlaceholder?: string
  inputType?: string
  showPassword?: boolean
  prefixIcon?: any
  options?: { value: any; label: string }[]
  min?: number
  max?: number
  step?: number
  precision?: number
  rows?: number
  disabled?: boolean
  activeText?: string
  inactiveText?: string
  action?: string
  headers?: Record<string, string>
  data?: Record<string, any>
  name?: string
  withCredentials?: boolean
  showFileList?: boolean
  drag?: boolean
  autoUpload?: boolean
  accept?: string
  limit?: number
  onPreview?: (file: any) => void
  onRemove?: (file: any, fileList: any) => void
  beforeUpload?: (file: any) => void
  beforeRemove?: (file: any, fileList: any) => void
  onSuccess?: (response: any, file: any, fileList: any) => void
  onError?: (error: any, file: any, fileList: any) => void
  onProgress?: (event: any, file: any, fileList: any) => void
  onChange?: (file: any, fileList: any) => void
  fileList?: any[]
  icon?: any
  tip?: string
}