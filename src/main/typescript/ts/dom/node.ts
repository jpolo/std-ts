//Util
const __isNode = function (o) {
  return (
    typeof Node === "object" ? o instanceof Node :
    o &&
    typeof o === "object" &&
    typeof o.nodeType === "number" &&
    typeof o.nodeName === "string"
  );
};
const __isElement = function (o) {
  return o.nodeType === NodeType.ELEMENT_NODE;
};
const __isElementOrDocument = function (n: Node) {
  let nodeType = n.nodeType;
  return (
    nodeType === NodeType.ELEMENT_NODE ||
    nodeType === NodeType.DOCUMENT_FRAGMENT_NODE ||
    nodeType === NodeType.DOCUMENT_NODE
  );
};
const __setText = function (n: Node, text: string) {
  if (__isElementOrDocument(n)) {
    n.textContent = text;
  }
};
const __getText = function (n: Node) {
  let returnValue = "";
  let nodeType = n.nodeType;

  if (
    nodeType === NodeType.ELEMENT_NODE ||
    nodeType === NodeType.DOCUMENT_FRAGMENT_NODE ||
    nodeType === NodeType.DOCUMENT_NODE
  ) {
    // Use textContent for elements
    // innerText usage removed for consistency of new lines (jQuery #11153)
    returnValue = n.textContent;
    if (typeof returnValue !== "string") {
      returnValue = "";
      // Traverse its children
      for (n = n.firstChild; n; n = n.nextSibling) {
        returnValue += __getText(n);
      }
    }
  } else if (
    nodeType === NodeType.TEXT_NODE ||
    nodeType === NodeType.CDATA_SECTION_NODE
  ) {
    returnValue = n.nodeValue;
  }
  return returnValue;
};

export enum NodeType {
  ELEMENT_NODE = 1,
  ATTRIBUTE_NODE = 2,
  TEXT_NODE = 3,
  CDATA_SECTION_NODE = 4,
  ENTITY_REFERENCE_NODE = 5,
  ENTITY_NODE = 6,
  PROCESSING_INSTRUCTION_NODE = 7,
  COMMENT_NODE = 8,
  DOCUMENT_NODE = 9,
  DOCUMENT_TYPE_NODE = 10,
  DOCUMENT_FRAGMENT_NODE = 11,
  NOTATION_NODE = 12
}

export enum ErrorCode {
  INDEX_SIZE_ERR = 1,
  HIERARCHY_REQUEST_ERR = 3,
  WRONG_DOCUMENT_ERR = 4,
  INVALID_CHARACTER_ERR = 5,
  NO_MODIFICATION_ALLOWED_ERR = 7,
  NOT_FOUND_ERR = 8,
  NOT_SUPPORTED_ERR = 9,
  INVALID_STATE_ERR = 11,
  SYNTAX_ERR = 12,
  INVALID_MODIFICATION_ERR = 13,
  NAMESPACE_ERR = 14,
  INVALID_ACCESS_ERR = 15,
  TYPE_MISMATCH_ERR = 17,
  SECURITY_ERR = 18,
  NETWORK_ERR = 19,
  ABORT_ERR = 20,
  URL_MISMATCH_ERR = 21,
  QUOTA_EXCEEDED_ERR = 22,
  TIMEOUT_ERR = 23,
  INVALID_NODE_TYPE_ERR = 24,
  DATA_CLONE_ERR = 25
}

export enum Position {
  BEFORE, AFTER, FIRST, LAST, REPLACE
}

/*
export class DOMError implements Error {

  code: number;
  name: string;
  message: string;

  constructor(code: number, message: string) {
    let name = ErrorCode[code];
    if (name === undefined) {
      throw new TypeError("Unknown exception code: " + code);
    }
    this.name = name;
    this.code = code;
    this.message = message;
  }

  toString() {
    return this.name + ": DOM Exception " + this.code;
  }
}*/

export function contains(parentNode: Node, node: Node): boolean {
  let returnValue = false;
  if (returnValue !== null && returnValue !== undefined) {
    if (parentNode === node) {
      returnValue = true;
    } else {
      returnValue = !!(node.compareDocumentPosition(parentNode) & Node.DOCUMENT_POSITION_CONTAINS);
    }
  }
  return returnValue;
}

export function empty(node: Node): void {
  if (node.textContent.length) {
    node.textContent = "";
  }
}

export function isNode(o: any): boolean {
  return __isNode(o);
}

export function nodeType(node: Node): NodeType {
  return node.nodeType;
}

export function place(node: Node, position: Position, refNode: Node): boolean {
  let parentNode: Node;
  let returnValue = false;
  switch (position) {
    case Position.BEFORE:
      parentNode = refNode.parentNode;
      if (parentNode) {
        parentNode.insertBefore(node, refNode);
        returnValue = true;
      }
      break;
    case Position.AFTER:
      parentNode = refNode.parentNode;
      if (parentNode) {
        parentNode.insertBefore(node, refNode.nextSibling);
        returnValue = true;
      }
      break;
    case Position.FIRST:
      refNode.insertBefore(node, refNode.firstChild);
      break;
    case Position.LAST:
      refNode.appendChild(node);
      break;
    case Position.REPLACE:
      parentNode = refNode.parentNode;
      if (parentNode) {
        parentNode.replaceChild(node, refNode);
        returnValue = true;
      }
      break;
    default:
      throw new Error(position + " is not a valid position");
  }
  return returnValue;
}

export function remove(node: Node): boolean {
  let parentNode = node.parentNode;
  let returnValue = false;
  if (parentNode) {
    parentNode.removeChild(node);
    returnValue = true;
  }
  return returnValue;
}
