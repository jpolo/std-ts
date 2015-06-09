module list {
  
  export interface IList<T> {
    isEmpty(): boolean
    head: T
    tail: IList<T>
  }

  
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
  var __nodeConnect = function <T>(l: INode<T>, r: INode<T>) {
    l.next = r;
    r.previous = l;
  };

  class List<T> {
    
    //static isList() {}
    
    protected _length: number = 0;
    protected _head: INode<T>;
    
    constructor() {
      
    }
    
    push(v: T): void {
      var head = this._head;
      var node = __node(v);
      
      if (!head) {
        head = this._head = node.previous = node.next = node;  
      } else {
        __nodeConnect(head.previous, node);
        __nodeConnect(node, head);
      }
      this._length += 1;
    }
    
    pop(): T {
      var returnValue: T;
      if (this._length > 0) {
        
        this._length -= 1;
      }
      return returnValue;
    }
    
    shift(): T {
      var returnValue: T;
      if (this._length > 0) {
        
        this._length -= 1;
      }
      return returnValue;
    }
    
    unshift(v: T) {
      var head = this._head;
      var node = __node(v);
      
      if (!head) {
        head = this._head = node.previous = node.next = node;  
      } else {
        __nodeConnect(node, head.next);
        __nodeConnect(node, head);
      }
      this._length += 1;
    }
    
    
    
    
    
  }
  
}
export = list