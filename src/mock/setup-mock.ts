import { debug } from './env'

interface SetupMockOptions {
  mock?: boolean
  setup: () => void
}

export default ({ mock, setup }: SetupMockOptions) => {
  if (mock !== false && debug) {
    setup()
  }
}

interface SuccessResponse<T = any> {
  code: number
  msg: string
  data: T
}

export function successResponseWrap<T>(data: T, msg = '操作成功'): SuccessResponse<T> {
  return {
    code: 200,
    msg,
    data
  }
}

export function errorResponseWrap(msg = '操作失败', code = 400): SuccessResponse<null> {
  return {
    code,
    msg,
    data: null
  }
}