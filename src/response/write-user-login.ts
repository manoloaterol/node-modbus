import { FC } from '../codes/index.js'
import WriteUserLoginRequestBody from '../request/write-user-login.js'
import ModbusWriteResponseBody from './write-response.body.js'

/** WriteUserLogin Resonse Body (Function code 0x43)
 * @extends ModbusResponseBody
 * @class
 */
export default class WriteUserLoginResponseBody extends ModbusWriteResponseBody {

  get value () {
    return this._value
  }

  get byteCount () {
    return 2 // FC + 1 byte for success (00) or failure (01)
  }

  /** Create WriteUserLoginResponseBody from Request
   * @param {WriteUserLoginRequestBody} request
   * @param {Buffer} coil
   * @returns WriteUserLoginResponseBody
   */
  public static fromRequest (requestBody: WriteUserLoginRequestBody) {
    const value = -1

    return new WriteUserLoginResponseBody(value)
  }

  public static fromBuffer (buffer: Buffer) {
    const fc = buffer.readUInt8(0)
    const value = buffer.readUInt8(1)

    if (fc !== FC.WRITE_USER_LOGIN) {
      return null
    }

    return new WriteUserLoginResponseBody(value)
  }

  private _value: number

  constructor (value: number) {
    super(FC.WRITE_USER_LOGIN)
    this._value = value
  }

  public createPayload () {
    const payload = Buffer.alloc(2)

    payload.writeUInt8(this._fc, 0)
    payload.writeUInt16BE(this._value, 1)

    return payload
  }
}
