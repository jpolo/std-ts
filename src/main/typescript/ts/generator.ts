import { IIterableIterator, IIteratorResult } from "./iterator";


export interface IGenerator<Yield> extends IIterableIterator<Yield> {
  /* next(n: Next): IIteratorResult<Yield | Return>;*/
}
