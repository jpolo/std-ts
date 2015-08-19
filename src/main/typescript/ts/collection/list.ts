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
const IsArray = Array.isArray || function (o: any): boolean {
  return Object.prototype.toString.call(o) === "[object Array]"
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

function ListEnqueue<T>(list: IListData<T>, values: T[]): void {
  let head = list._head
  let valuec = values.length
  let node: INode<T>
  let lastNode: INode<T>
  if (valuec >= 1) {
    node = NodeCreate(values[0])
    lastNode = node
    if (!head) {
      head = list._head = node.previous = node.next = node
    } else {
      ListConnect(list, head.previous, node)
    }
  }

  if (valuec >= 2) {
    for (let i = 1; i < valuec; i++) {
      node = NodeCreate(values[i])
      ListConnect(list, lastNode, node)
      lastNode = node
    }
  }
  ListConnect(list, lastNode, head)
  list._length += valuec
}

function ListEnqueueMap<T>(list: IListData<T>, values: T[]): void {
  if (IsList(values)) {
    let iterator = new ListIterator(values)
    let iteratorResult
    while (!(iteratorResult = iterator.next()).done) {
      this.push(iteratorResult.value)
    }
  } else if (IsArray(values)) {
    ListEnqueue(data, values)
  }
}

function ListConnect<T>(list: IListData<T>, l: INode<T>, r: INode<T>): void {
  l.next = r
  r.previous = l
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

export class List<T> {

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
    ListEnqueue(ListData(list), values)
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
      if (IsList(a)) {
        let iterator = new ListIterator(a)
        let iteratorResult
        while (!(iteratorResult = iterator.next()).done) {
          this.push(iteratorResult.value)
        }
      } else if (IsArray(a)) {
        ListEnqueue(data, a)
      }
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
    ListEnqueue(data, values)
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
    ListEnqueue(data, values)
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

  protected _data: IListData<T>
  protected _current: INode<T>

  constructor(list: List<T>) {
    this._data = ListData(list)
    this._current = this._getHead()
  }

  next() {
    let current = this._current
    let done = true
    let value: T
    if (current) {
      let next = current.next
      this._current = (next !== this._getHead()) ? next : null
      done = false
      value = current.value
    }
    return {
      done: done,
      value: value
    }
  }

  _getHead(): INode<T> {
    return this._data._head
  }
}
