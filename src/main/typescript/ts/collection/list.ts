module list {
  /*
  export interface IList<T> {
    isEmpty(): boolean
    head: T
    tail: IList<T>
  }
  */

  
  interface INode<T> {
    value: T
    previous: INode<T>
    next: INode<T>
  }
  
  var __node = function <T>(v: T): INode<T> {
    return {
      value: v,
      previous: null,
      next: null
    };
  };
  var __nodeConnect = function <T>(list: List<T>, l: INode<T>, r: INode<T>) {
    l.next = r;
    r.previous = l;
  };
  var __nodeDisconnect = function <T>(list: List<T>, node: INode<T>) {
    if (node === node.next) {
      (<any>list)._head = null;
    } else {
      __nodeConnect(list, node.previous, node.next);
    }
  };
  var __nodeEnqueueValues = function <T>(l: List<T>, values: T[]) {
    var list = <any>l;
    var head = list._head;
    var valuec = values.length;
    var node: INode<T>;
    var lastNode: INode<T>;
    if (valuec >= 1) {
      node = __node(values[0]);
      lastNode = node;
      if (!head) {
        head = list._head = node.previous = node.next = node;
      } else {
        __nodeConnect(list, head.previous, node);
        //__nodeConnect(list, node, head);
      }
    }
    
    if (valuec >= 2) {
      for (var i = 1; i < valuec; i++) {
        node = __node(values[i]);
        __nodeConnect(list, lastNode, node);
      }
    }
    __nodeConnect(list, node, head);
    list._length += valuec;
  };

  class List<T> {
    
    //static isList() {}
    
    protected _length: number = 0;
    protected _head: INode<T> = null;
    
    constructor() {
      
    }
    
    get length() {
      return this._length;
    }
    
    push(values: T[]): number {
      __nodeEnqueueValues(this, values);
      return this._length;
    }
    
    pop(): T {
      var returnValue: T;
      var head = this._head;
      if (head !== null) {
        var last = head.previous;
        returnValue = last.value;
        __nodeDisconnect(this, last);
        this._length -= 1;
      }
      return returnValue;
    }
    
    shift(): T {
      var returnValue: T;
      var head = this._head;
      if (head !== null) {
        returnValue = head.value;
        __nodeDisconnect(this, head);
        this._length -= 1;
      }
      return returnValue;
    }
    
    unshift(values: T[]): number {
      var head = this._head;
      var lastNode = head && head.previous;
      __nodeEnqueueValues(this, values);
      if (lastNode) {
        this._head = lastNode.next;
      }
      return this._length;
    }
  }
  
}
export = list