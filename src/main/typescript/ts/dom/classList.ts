// Util
const hasClassList = 'classList' in document.createElement('div');

const TokenError: any = /*DOMException || */TypeError;
function OwnKeys(o: any) {
  let ks: string[];
  if (Object.keys) {
    ks = Object.keys(o);
  } else {
    // TODO
  }
  return ks;
}
function ArrayToDict(a: string[]|DOMTokenList) {
  const returnValue: {[k: string]: boolean} = {};
  for (let i = 0, l = a.length; i < l; ++i) {
    returnValue[a[i]] = true;
  }
  return returnValue;
}
function AssertToken(token: string): string {
  if (token === '') {
    throw new TokenError('An invalid or illegal string was specified');
  } else if (/\s/.test(token)) {
    throw new TokenError('String contains an invalid character');
  }
  return token;
}
let __classListGet = function (element: HTMLElement): string[] {
  return element.className.split(/\s+/);
};
const __classListSet = function (element: HTMLElement, classNames: string[]) {
  element.className = classNames.join(' ');
};
let __classListContains = function (element: HTMLElement, className: string): boolean {
  return typeof className === 'string' && element.classList.contains(className);
};
let __classListAdd = function (element: HTMLElement, className: string) {
  element.classList.add(className);
};
let __classListRemove = function (element: HTMLElement, className: string) {
  element.classList.remove(className);
};

// Compat
if (!hasClassList) {
  __classListGet = function (element: HTMLElement): string[] {
    return element.className.split(/\s+/);
  };
  __classListContains = function (element: HTMLElement, className: string): boolean {
    return typeof className === 'string' && ((' ' + element.className + ' ').indexOf(' ' + className + ' ') !== -1);
  };
  __classListAdd = function (element: HTMLElement, className: string) {
    const elementClassName = element.className;
    if (
      typeof className === 'string' &&
      ((' ' + elementClassName + ' ').indexOf(' ' + className + ' ') === -1)
    ) {
      element.className += (elementClassName.length ? ' ' : '') + className;
    }
  };
   __classListRemove = function (element: HTMLElement, className: string) {
    const classList = __classListGet(element);
    const i = classList.indexOf(classList[0]);
    if (i !== -1) {
      classList.splice(i, 1);
      __classListSet(element, classList);
    }
  };
}

export function contains(element: HTMLElement, className: string): boolean {
  return __classListContains(element, className);
}

export function add(element: HTMLElement, ...classNames: string[]): void {
  const l = classNames.length;
  if (element && l !== 0) {
    const classNamesNew: string[] = [];
    for (const className of classNames) {
      AssertToken(className);
      if (typeof className === 'string' && !__classListContains(element, className)) {
        classNamesNew.push(className);
      }
    }
    if (classNames.length !== 0) {
      element.className += (element.className.length ? ' ' : '') + classNamesNew.join(' ');
    }
  }

  // return
}

export function remove(element: HTMLElement, ...classNames: string[]): void {
  const l = classNames.length;
  if (l === 0) {
    // Do nothing
  } else if (l === 1) {
    __classListRemove(element, classNames[0]);
  } else {
    const classIndex = ArrayToDict(__classListGet(element));
    let changed = false;
    for (const className of classNames) {
      AssertToken(className);
      if (classIndex.hasOwnProperty(className)) {
        delete classIndex[className];
        changed = true;
      }
    }
    if (changed) {
      __classListSet(element, OwnKeys(classIndex));
    }
  }
}

export function toggle(element: HTMLElement, className: string, condition?: boolean): boolean {
  AssertToken(className);
  if (condition === undefined) {
    condition = !__classListContains(element, className);
  }
  (condition ? __classListAdd : __classListRemove)(element, className);
  return condition;
}
