module list {
  
  export interface IList<T> {
    isEmpty(): boolean
    head: T
    tail: IList<T>
  }

  
  interface IListNode<T> {
    value: T
    previous: IListNode<T>
    next: IListNode<T>
  }
  
  var __node = function <T>(v: T, previous?: IListNode<T>, next?: IListNode<T>): IListNode<T> {
    var node = {
      value: v,
      previous: previous,
      next: next
    };
    if (next) {
      next.previous = node;
    }
    if (previous) {
      previous.next = node;
    }
    return node
  };

  class List<T> {
    
    protected _length: number = 0;
    protected _head: IListNode<T>;
    
    constructor() {
      
    }
    
    push(v: T) {
      
    }
    
    
  }
  
}
export = list