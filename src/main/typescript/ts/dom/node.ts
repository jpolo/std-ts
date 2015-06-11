module node {
  
  //Util
  var __isElement = function (o) {
    return o.nodeType === NodeType.ELEMENT_NODE;
  };
  var __isElementOrDocument = function (n: Node) {
    var nodeType = n.nodeType;
    return (
      nodeType === NodeType.ELEMENT_NODE ||
      nodeType === NodeType.DOCUMENT_FRAGMENT_NODE ||
      nodeType === NodeType.DOCUMENT_NODE
    );
  };
  var __setText = function (n: Node, text: string) {
    if (__isElementOrDocument(n)) {
      n.textContent = text;
    }
  };
  var __getText = function (n: Node) {
    var returnValue = "";
    var nodeType = n.nodeType;

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
  
  export function empty(node: Node): void {
    if (node.textContent.length) {
      node.textContent = "";
    }
  }
  
  export function nodeType(node: Node): NodeType {
    return node.nodeType;  
  }

  function place(node: Node, position: Position, refNode: Node): boolean {
    var parentNode: Node;
    var returnValue = false;
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
    }
    return returnValue;
  }
  
  export function remove(node: Node): boolean {
    var parentNode = node.parentNode;
    var returnValue = false;
    if (parentNode) {
      parentNode.removeChild(node);
      returnValue = true;
    }
    return returnValue;
  }

}
export = node;