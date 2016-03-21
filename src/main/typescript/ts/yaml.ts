/* tslint:disable:max-line-length */
function TokenCreate(t: Token, re: RegExp): {0: Token; 1: RegExp} { return <any>[t, re]; }
function StringCount(str: string, needle: string, toIndex: number): number {
  let n = 0;
  let i = str.indexOf(needle);
  while (i !== -1 && i < toIndex) {
    n++;
    i = str.indexOf(needle, i + 1);
  }
  return n;
}

/**
 * Grammar tokens.
 */
enum Token {
  COMMENT,
  INDENT,
  DEDENT,
  SPACE,
  TRUE,
  FALSE,
  NULL,
  STRING,
  TIMESTAMP,
  FLOAT,
  INT,
  DOC,
  COMMA,
  CURLY_BRACE_OPEN,
  CURLY_BRACE_CLOSE,
  SQUARED_BRACKET_OPEN,
  SQUARED_BRACKET_CLOSE,
  DASH,
  COLON,
  ID
}

interface ITokenMatch {
  token: Token;
  matches: RegExpExecArray;
  sourceURL: string;
  lineNumber: number;
  columnNumber: number;
}

export interface IParserOption {
  sourceURL?: string;
}

const TOKENS: {0: Token; 1: RegExp}[] = [
  TokenCreate(Token.COMMENT, /^#[^\n]*/),
  TokenCreate(Token.INDENT, /^\n( *)/),
  TokenCreate(Token.SPACE, /^ +/),
  TokenCreate(Token.TRUE, /^\b(true|True|TRUE)\b/),
  TokenCreate(Token.FALSE, /^\b(false|False|FALSE)\b/),
  TokenCreate(Token.NULL, /^\b(null|Null|NULL|~)\b/),
  TokenCreate(Token.STRING, /^"(.*?)"/),
  TokenCreate(Token.STRING, /^'(.*?)'/),
  TokenCreate(Token.TIMESTAMP, /^((\d{4})-(\d\d?)-(\d\d?)(?:(?:[ \t]+)(\d\d?):(\d\d)(?::(\d\d))?)?)/),
  TokenCreate(Token.FLOAT, /^(\d+\.\d+)/),
  TokenCreate(Token.INT, /^(\d+)/),
  TokenCreate(Token.DOC, /^---/),
  TokenCreate(Token.COMMA, /^,/),
  TokenCreate(Token.CURLY_BRACE_OPEN, /^\{(?![^\n\}]*\}[^\n]*[^\s\n\}])/),
  TokenCreate(Token.CURLY_BRACE_CLOSE, /^\}/),
  TokenCreate(Token.SQUARED_BRACKET_OPEN, /^\[(?![^\n\]]*\][^\n]*[^\s\n\]])/),
  TokenCreate(Token.SQUARED_BRACKET_CLOSE, /^\]/),
  TokenCreate(Token.DASH, /^\-/),
  TokenCreate(Token.COLON, /^[:]/),
  TokenCreate(Token.STRING, /^(?![^:\n\s]*:[^\/]{2})(([^:,\]\}\n\s]|(?!\n)\s(?!\s*?\n)|:\/\/|,(?=[^\n]*\s*[^\]\}\s\n]\s*\n)|[\]\}](?=[^\n]*\s*[^\]\}\s\n]\s*\n))*)(?=[,:\]\}\s\n]|$)/),
  TokenCreate(Token.ID, /^([\w][\w -]*)/)
];



export function parse(s: string, options?: IParserOption) {
  return parser.parse(parser.tokenize(s, options || {}));
}


export function stringify(o: any) {
  return undefined;
}



module parser {
  let FILE_ANONYMOUS = "<anonymous>";

  interface IState extends Array<ITokenMatch> { }

  function error(sourceURL: string, lineNumber: number, columnNumber: number, message: string) {
    let s = (
      message +
      " (" +
      (!sourceURL ? FILE_ANONYMOUS : sourceURL) +
      ":" + lineNumber +
      ":" + columnNumber +
      ")"
    );
    return new SyntaxError(s);
  }

  function peek(state: IState): ITokenMatch {
    return state[0];
  }

  function peekType(state: IState, type: Token): boolean {
    let head = state[0];
    return head && head.token === type;
  }

  function advance(state: IState): ITokenMatch {
    return state.shift();
  }

  function advanceValue(state: IState) {
    return advance(state).matches[1];
  }

  function accept(state: IState, type: Token): ITokenMatch {
    return peekType(state, type) ? advance(state) : null;
  }

  function expect(state: IState, type: Token, message: string) {
    if (!accept(state, type)) {
      let tokenMatch = peek(state);
      throw error(
        tokenMatch.sourceURL,
        tokenMatch.lineNumber,
        tokenMatch.columnNumber,
        message + ", " + _context(tokenMatch.matches.input)
      );
    }
  }

  function ignoreSpace(state: IState) {
    while (peekType(state, Token.SPACE)) {
      advance(state);
    }
  }

  function ignoreWhitespace(state: IState) {
    while (peekType(state, Token.SPACE) ||
           peekType(state, Token.INDENT) ||
           peekType(state, Token.DEDENT)) {
      advance(state);
    }
  }

  /**
   *   block
   * | doc
   * | list
   * | inlineList
   * | hash
   * | inlineHash
   * | string
   * | float
   * | int
   * | true
   * | false
   * | null
   */
  export function parse(state: IState) {
    switch (peek(state).token) {
      case Token.DOC:
        return parseDoc(state);
      case Token.DASH:
        return parseList(state);
      case Token.CURLY_BRACE_OPEN:
        return parseInlineHash(state);
      case Token.SQUARED_BRACKET_OPEN:
        return parseInlineList(state);
      case Token.ID:
        return parseHash(state);
      case Token.STRING:
        return advanceValue(state);
      case Token.TIMESTAMP:
        return parseTimestamp(state);
      case Token.FLOAT:
        return parseFloat(advanceValue(state));
      case Token.INT:
        return parseInt(advanceValue(state));
      case Token.TRUE:
        advanceValue(state);
        return true;
      case Token.FALSE:
        advanceValue(state);
        return false;
      case Token.NULL:
        advanceValue(state);
        return null;
    }
  }

  function parseDoc(state: IState) {
    accept(state, Token.DOC);
    expect(state, Token.INDENT, "expected indent after document");
    let val = parse(state);
    expect(state, Token.DEDENT, "document not properly dedented");
    return val;
  }

  /**
   *  ( id ':' - expr -
   *  | id ':' - indent expr dedent
   *  )+
   */
  function parseHash(state: IState) {
    let id: string;
    let hash = {};
    while (peekType(state, Token.ID) && (id = advanceValue(state))) {
      expect(state, Token.COLON, "expected semi-colon after id");
      ignoreSpace(state);
      if (accept(state, Token.INDENT)) {
        hash[id] = parse(state);
        expect(state, Token.DEDENT, "hash not properly dedented");
      } else {
        hash[id] = parse(state);
      }
      ignoreSpace(state);
    }
    return hash;
  }

  /**
   * '{' (- ','? ws id ':' - expr ws)* '}'
   */
  function parseInlineHash(state: IState) {
    let hash = {};
    let id;
    let i = 0;
    accept(state, Token.CURLY_BRACE_OPEN);
    while (!accept(state, Token.CURLY_BRACE_CLOSE)) {
      ignoreSpace(state);
      if (i !== 0)  {
        expect(state, Token.COMMA, "expected comma");
      }
      ignoreWhitespace(state);
      if (peekType(state, Token.ID) && (id = advanceValue(state))) {
        expect(state, Token.COLON, "expected colon after id");
        ignoreSpace(state);
        hash[id] = parse(state);
        ignoreWhitespace(state);
      }
      ++i;
    }
    return hash;
  }

  /**
   *  ( '-' - expr -
   *  | '-' - indent expr dedent
   *  )+
   */
  function parseList(state: IState) {
    let list = [];
    while (accept(state, Token.DASH)) {
      ignoreSpace(state);
      if (accept(state, Token.INDENT)) {
        list.push(parse(state));
        expect(state, Token.DEDENT, "list item not properly dedented");
      } else {
        list.push(parse(state));
      }
      ignoreSpace(state);
    }
    return list;
  }

  /**
   * '[' (- ','? - expr -)* ']'
   */
  function parseInlineList(state: IState) {
    let list = [];
    let i = 0;
    accept(state, Token.SQUARED_BRACKET_OPEN);
    while (!accept(state, Token.SQUARED_BRACKET_CLOSE)) {
      ignoreSpace(state);
      if (i !== 0) {
        expect(state, Token.COMMA, "expected comma");
      }
      ignoreSpace(state);
      list.push(parse(state));
      ignoreSpace(state);
      ++i;
    }
    return list;
  }

  /**
   * yyyy-mm-dd hh:mm:ss
   *
   * For full format: http://yaml.org/type/timestamp.html
   */
  function parseTimestamp(state: IState) {
    let matches = advance(state).matches;
    let date = new Date("");
    let year = parseInt(matches[2]);
    let month = parseInt(matches[3]);
    let day = parseInt(matches[4]);
    let hour = parseInt(matches[5]) || 0;
    let min = parseInt(matches[6]) || 0;
    let sec = parseInt(matches[7]) || 0;

    date.setUTCFullYear(year, month - 1, day);
    date.setUTCHours(hour);
    date.setUTCMinutes(min);
    date.setUTCSeconds(sec);
    date.setUTCMilliseconds(0);
    return date;
  }

  export function tokenize(str: string, options: IParserOption): ITokenMatch[] {
    let strLength = str.length;
    let strConsumedLength = 0;
    let TOKEN_COUNT = TOKENS.length;
    let tokenMatch: ITokenMatch;
    let captures: RegExpExecArray;
    let ignore = false;
    let input;
    let indents = 0;
    let lastIndents = 0;
    let stack = [];
    let indentAmount = -1;
    let sourceURL = options.sourceURL;
    let lineNumber = NaN;
    let columnNumber = NaN;
    let buffer = str;

    // Windows new line support (CR+LF, \r\n)
    buffer = buffer.replace(/\r\n/g, "\n");

    while (buffer.length) {
      for (let i = 0; i < TOKEN_COUNT; ++i) {
        let matcher = TOKENS[i];
        let tokenType = matcher[0];
        let re = matcher[1];
        if (captures = re.exec(buffer)) {
          //consume
          buffer = buffer.replace(re, "");
          strConsumedLength = (strLength - buffer.length);

          lineNumber = StringCount(str, "\n", strConsumedLength) + 1;
          columnNumber = strConsumedLength - str.lastIndexOf("\n", strConsumedLength);
          tokenMatch = {
            token: tokenType,
            matches: captures,
            sourceURL: sourceURL,
            lineNumber: lineNumber,
            columnNumber: columnNumber
          };

          switch (tokenMatch.token) {
            case Token.COMMENT:
              ignore = true;
              break;
            case Token.INDENT:
              lastIndents = indents;
              // determine the indentation amount from the first indent
              if (indentAmount === -1) {
                indentAmount = captures[1].length;
              }

              indents = captures[1].length / indentAmount;
              if (indents === lastIndents) {
                ignore = true;
              } else if (indents > lastIndents + 1) {
                throw new SyntaxError("invalid indentation, got " + indents + " instead of " + (lastIndents + 1));
              } else if (indents < lastIndents) {
                input = captures.input;
                tokenMatch = {
                  token: Token.DEDENT,
                  matches: null,
                  sourceURL: sourceURL,
                  lineNumber: lineNumber,
                  columnNumber: columnNumber
                };
                //tokenMatch['input'] = input
                while (--lastIndents > indents) {
                  stack.push(tokenMatch);
                }
              }
          }
          break;
        }
      }
      if (!ignore) {
        if (tokenMatch) {
          stack.push(tokenMatch);
          tokenMatch = null;
        } else {
          throw new SyntaxError(_context(buffer));
        }
      }

      ignore = false;
    }
    return stack;
  }

  function _context(str: string) {
    return (
      typeof str !== "string" ? "" :
      "near \"" +
      (str
        .slice(0, 25)
        .replace(/\n/g, '\\n')
        .replace(/"/g, '\\\"')) +
      "\""
    );
  }
}
