import * as vector4 from './vector4'

// Constant
const IDENTITY: Quaternion = [0, 0, 0, 1]

// Util
export type Quaternion = [number, number, number, number]
const F64Array: any = (typeof Float64Array !== 'undefined') ? Float64Array : Array
function ArrayCreate (): any {
  return new F64Array(4)
}

export const add = vector4.add

export function conjugate (q: Quaternion, dest?: Quaternion): Quaternion {
  const r = dest || ArrayCreate()
  r[0] = -q[0]
  r[1] = -q[1]
  r[2] = -q[2]
  r[3] = q[3]
  return r
}

export const copy = vector4.copy

export const create = vector4.create

export const dot = vector4.dot

export function identity (dest?: Quaternion): Quaternion {
  return copy(IDENTITY, dest)
}

export function invert (q: Quaternion, dest?: Quaternion): Quaternion {
  const q0 = q[0], q1 = q[1], q2 = q[2], q3 = q[3]
  const dot = q0 * q0 + q1 * q1 + q2 * q2 + q3 * q3
  const invDot = dot ? 1.0 / dot : 0
  const r = dest || ArrayCreate()
  r[0] = -q0 * invDot
  r[1] = -q1 * invDot
  r[2] = -q2 * invDot
  r[3] = q3 * invDot
  return r
}

export const length = vector4.length

export const lengthSquared = vector4.lengthSquared

export const multiply = vector4.multiply

export const negate = vector4.negate

export const normalize = vector4.normalize

export const scale = vector4.scale

export const subtract = vector4.subtract
