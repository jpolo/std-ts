interface INode<T> {
  value: T
  previous: INode<T>
  next: INode<T>
}

//ECMA like

function NodeCreate<T>(v: T): INode<T> {
  return {
    value: v,
    previous: null,
    next: null
  };
}

function NodeConnect<T>(list: List<T>, l: INode<T>, r: INode<T>) {
  l.next = r;
  r.previous = l;
}

function NodeDisconnect<T>(list: List<T>, node: INode<T>) {
  if (node === node.next) {
    (<any>list)._head = null;
  } else {
    NodeConnect(list, node.previous, node.next);
  }
};

function NodeEnqueue<T>(l: List<T>, values: T[]) {
  let list = <any>l;
  let head = list._head;
  let valuec = values.length;
  let node: INode<T>;
  let lastNode: INode<T>;
  if (valuec >= 1) {
    node = NodeCreate(values[0]);
    lastNode = node;
    if (!head) {
      head = list._head = node.previous = node.next = node;
    } else {
      NodeConnect(list, head.previous, node);
      //__nodeConnect(list, node, head);
    }
  }
  
  if (valuec >= 2) {
    for (let i = 1; i < valuec; i++) {
      node = NodeCreate(values[i]);
      NodeConnect(list, lastNode, node);
      lastNode = node;
    }
  }
  NodeConnect(list, lastNode, head);
  list._length += valuec;
};

export class List<T> {
  
  //static isList() {}
  
  protected _length: number = 0;
  protected _head: INode<T> = null;
  
  constructor() {
    
  }
  
  get length() {
    return this._length;
  }
  
  clear() {
    this._length = 0;
    this._head = null;  
  }
  
  item(i: number): T {
    let returnValue: T;
    if (i >= 0) {
      let head = this._head;
      let current = head;
      let index = 0;
      if (current !== null) {
        do {
          if (i === index) {
            returnValue = current.value;
            break;
          }
          index += 1;
          current = current.next;
        } while (current !== head) 
      }
    }
    return returnValue;
  }
  
  push(...values: T[]): number {
    NodeEnqueue(this, values);
    return this._length;
  }
  
  pop(): T {
    let returnValue: T;
    let head = this._head;
    if (head !== null) {
      let last = head.previous;
      returnValue = last.value;
      NodeDisconnect(this, last);
      this._length -= 1;
    }
    return returnValue;
  }
  
  shift(): T {
    let returnValue: T;
    let head = this._head;
    if (head !== null) {
      returnValue = head.value;
      NodeDisconnect(this, head);
      this._length -= 1;
    }
    return returnValue;
  }
  
  unshift(...values: T[]): number {
    let head = this._head;
    let lastNode = head && head.previous;
    NodeEnqueue(this, values);
    if (lastNode) {
      this._head = lastNode.next;
    }
    return this._length;
  }
  
  toString() {
    let s = "";
    let head = this._head;
    let current = head;
    if (head) {
      s += " ";
      s += head.value;
      while ((current = current.next) !== head) {
        s += ", " + current.value;
      }
      s += " ";
    }
    return "List {" + s + "}";
  }
}
