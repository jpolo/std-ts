import { IIterator } from "../iterator"

interface IListData<T> {
  _head: INode<T>
  _length: number
}

interface INode<T> {
  value: T
  previous: INode<T>
  next: INode<T>
}

//ECMA like
function IsArray(o: any): boolean {
  return Array.isArray ? Array.isArray(o) : Object.prototype.toString.call(o) === "[object Array]"
}

function IsList(o: any): boolean {
  return o instanceof List
}

function NodeCreate<T>(v: T): INode<T> {
  return {
    value: v,
    previous: null,
    next: null
  }
}

function ListData<T>(list: List<T>): IListData<T> {
  return (<any>list)
}

function ListClear<T>(list: IListData<T>) {
  list._head = null
  list._length = 0
}

function ListEnqueueIterator<A, B>(list: IListData<B>, iter: IIterator<A>, mapFn: (v: A) => B): void {
  let iteratorResult = iter.next()

  //length >= 1
  if (!iteratorResult.done) {
    let head = list._head
    let node: INode<B>
    let lastNode: INode<B>
    let length = 0

    node = NodeCreate(mapFn(iteratorResult.value))
    lastNode = node
    if (!head) {
      head = list._head = node.previous = node.next = node
    } else {
      ListConnect(list, head.previous, node)
    }
    length += 1

    //length >= 2
    while (!(iteratorResult = iter.next()).done) {
      node = NodeCreate(mapFn(iteratorResult.value))
      ListConnect(list, lastNode, node)
      lastNode = node
      length += 1
    }

    ListConnect(list, lastNode, head)
    list._length += length
  }
}

function ListEnqueue<A, B>(list: IListData<B>, values: A[], mapFn: (v: A) => B): void
function ListEnqueue<A, B>(list: IListData<B>, values: List<A>, mapFn: (v: A) => B): void
function ListEnqueue<A, B>(list: IListData<B>, values: any, mapFn: (v: A) => B): void  {
  if (IsList(values)) {
    ListEnqueueIterator(list, new ListIterator<A>(values), mapFn)
  } else if (IsArray(values)) {
    let index = 0
    let length = values.length
    ListEnqueueIterator(list, {
      next() {
        let currentIndex = index
        index += 1
        return (
          currentIndex < length ?
            { done: false, value: values[currentIndex] } :
            { done: true, value: undefined }
        )
      }
    }, mapFn)
  }
}

function ListConnect<T>(list: IListData<T>, left: INode<T>, right: INode<T>): void {
  left.next = right
  right.previous = left
}

function ListDisconnect<T>(list: IListData<T>, node: INode<T>): void {
  if (node === node.next) {
    list._head = null
  } else {
    ListConnect(list, node.previous, node.next)
  }
}

function Identity<T>(o: T): T {
  return o
}

export default class List<T> {

  static from<A>(list: List<A>): List<A>
  static from<A, B>(list: List<A>, mapFn: (v: A) => B, thisp?: any): List<B>
  static from<A>(array: A[]): List<A>
  static from<A, B>(array: A[], mapFn: (v: A) => B, thisp?: any): List<B>
  static from(o: any, mapFn = Identity, thisp = null): List<any>  {
    return new List(o)
  }

  static isList(o: any): boolean {
    return IsList(o)
  }

  static of<S>(...values: S[]): List<S> {
    let list = new List<S>()
    ListEnqueue(ListData(list), values, Identity)
    return list
  }

  protected _length: number = 0
  protected _head: INode<T> = null

  constructor(a?: List<T>)
  constructor(a?: T[])
  constructor(a?: any) {
    let data = ListData(this)
    ListClear(data)
    if (a) {
      ListEnqueue(data, a, Identity)
    }
  }

  get length() {
    return ListData(this)._length
  }

  clear() {
    ListClear(ListData(this))
  }

  item(i: number): T {
    let returnValue: T
    let data = ListData(this)
    if (i >= 0) {
      let head = data._head
      let current = head
      let index = 0
      if (current !== null) {
        do {
          if (i === index) {
            returnValue = current.value
            break
          }
          index += 1
          current = current.next
        } while (current !== head)
      }
    }
    return returnValue
  }

  push(...values: T[]): number {
    let data = ListData(this)
    ListEnqueue(data, values, Identity)
    return data._length
  }

  pop(): T {
    let returnValue: T
    let data = ListData(this)
    let head = data._head
    if (head !== null) {
      let last = head.previous
      returnValue = last.value
      ListDisconnect(data, last)
      data._length -= 1
    }
    return returnValue
  }

  shift(): T {
    let returnValue: T
    let data = ListData(this)
    let head = data._head
    if (head !== null) {
      returnValue = head.value
      ListDisconnect(data, head)
      data._length -= 1
    }
    return returnValue
  }

  unshift(...values: T[]): number {
    let data = ListData(this)
    let head = data._head
    let lastNode = head && head.previous
    //ListEnqueue(data, values)
    if (lastNode) {
      data._head = lastNode.next
    }
    return data._length
  }

  toString() {
    let s = ""
    let iterator = new ListIterator(this)
    let iteratorResult = iterator.next()
    if (!iteratorResult.done) {
      s += " "
      s += iteratorResult.value
      while (!(iteratorResult = iterator.next()).done) {
        s += ", " + iteratorResult.value
      }
      s += " "
    }
    return "List {" + s + "}"
  }
}

class ListIterator<T> {

  private _data: IListData<T>
  private _current: INode<T>

  constructor(list: List<T>) {
    this._data = ListData(list)
    this._current = this._data._head
  }

  next() {
    let data = this._data
    let current = this._current
    let done = true
    let value: T
    if (current) {
      let next = current.next
      this._current = (next !== data._head) ? next : null
      done = false
      value = current.value
    }
    return {
      done: done,
      value: value
    }
  }
}
