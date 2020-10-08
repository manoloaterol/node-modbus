import { FC } from '../codes'

import ModbusRequestBody from './request-body.js'

import Debug = require('debug'); const debug = Debug('write-user-login')

/** Write User Login Body
 * @extends ModbusRequestBody
 */
export default class WriteUserLoginRequestBody extends ModbusRequestBody {

  get count () {
    return 0
  }

  /** Values to be written */
  get values () {
    return this._values
  }

  get valuesAsArray () {
    return this._valuesAsArray
  }

  get valuesAsBuffer () {
    return this._valuesAsBuffer
  }

  get byteCount () {
    return this._byteCount
  }

  get numberOfBytes () {
    return this._numberOfBytes
  }

  get name () {
    return 'WriteUserLogin' as const
  }

  public static fromBuffer (buffer: Buffer) {
    try {
      const fc = buffer.readUInt8(0)
      const values = buffer.slice(1, buffer.length -1)

      if (fc !== FC.WRITE_USER_LOGIN) {
        return null
      }

      return new WriteUserLoginRequestBody(values)
    } catch (e) {
      return null
    }
  }
  private _values: number[] | Buffer
  private _byteCount: number
  private _numberOfBytes: number
  private _valuesAsBuffer: Buffer
  private _valuesAsArray: number[]

  /** Create a new Write User Logins Request Body.
   * @param {number[] | Buffer} values Values to be written. Either a Array of UInt16 values or a Buffer.
   * @throws {InvalidStartAddressException} When address is larger than 0xFFFF.
   * @throws {InvalidArraySizeException}
   * @throws {InvalidBufferSizeException}
   */
  constructor (values: number[] | Buffer) {
    super(FC.WRITE_USER_LOGIN)
    if (Array.isArray(values) && values.length > 0x7b) {
      throw new Error('InvalidArraySize')
    }
    if (values instanceof Buffer && values.length > 0x7b * 2) {
      throw new Error('InvalidBufferSize')
    }
    this._values = values

    if (this._values instanceof Buffer) {
      this._byteCount = Math.min(this._values.length + 1, 0xF6)
      this._numberOfBytes = this._values.length
      this._valuesAsBuffer = this._values
      this._valuesAsArray = []
      for (let i = 0; i < this._values.length; i += 2) {
        this._valuesAsArray.push(this._values.readUInt16BE(i))
      }
    } else if (this._values instanceof Array) {
      this._valuesAsArray = this._values
      this._byteCount = Math.min(this._values.length * 2 + 6, 0xF6)
      this._numberOfBytes = Math.floor(this._values.length * 2)
      this._valuesAsBuffer = Buffer.alloc(this._numberOfBytes)
      this._values.forEach((v, i) => {
        this._valuesAsBuffer.writeUInt16BE(v, i * 2)
      })
    } else {
      throw new Error('InvalidType_MustBeBufferOrArray')
    }
  }

  public createPayload () {
    const payload = Buffer.alloc(1 + this._numberOfBytes)
    payload.writeUInt8(this._fc, 0) // function code
    this._valuesAsBuffer.copy(payload, 1)
    debug("payload:")
    debug(payload)
    return payload
  }
}

export function isWriteUserLoginRequestBody (x: any): x is WriteUserLoginRequestBody {
  if (x instanceof WriteUserLoginRequestBody) {
    return true
  } else {
    return false
  }
}
