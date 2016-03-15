import { IHash, hashString } from "./hash";

// reference: https://github.com/npm/node-semver/blob/master/semver.js

// Util
function Has(o: any, prop: string) { return (prop in o) }
function ToUint32(o: any) { return o >>>0 }
function ToString(o: any): string { return "" + o }
function SemVerStringify(v: ISemVer) {
  let s = "";
  s += v.major + '.' + v.minor + '.' + v.patch;
  if (v.prerelease.length) {
    s += '-' + v.prerelease.join('.');
  }
  return s;
}
function SemVerCompare(a: ISemVer, b: ISemVer) {
  return __cmpMain(a, b) || __cmpPre(a, b);
}

export interface ISemVer {
  major: number;
  minor: number;
  patch: number;
  prerelease: Array<number|string>;
  build: Array<string>;
}

export class SemVer implements ISemVer, IHash {

  static cast(o: any): SemVer {
    let returnValue: SemVer = null;
    if (o) {
      if (o instanceof SemVer) {
        returnValue = o;
      } else if (typeof o === "string") {
        returnValue = SemVer.parse(o);
      } else if (SemVer.isSemVer(o)) {
        returnValue = new SemVer(
          o.major,
          o.minor,
          o.patch
        );
      }
    }
    return returnValue;
  }

  static compare(a: ISemVer, b: ISemVer): number {
    return SemVerCompare(a, b);
  }

  static isSemVer(o: any): boolean {
    return (o && (
      o instanceof SemVer ||
      (
        Has(o, "major") &&
        Has(o, "minor") &&
        Has(o, "patch")
      )
    ));
  }

  /*static compareMain(a: ISemVer, b: ISemVer): number {
    return __cmpMain(a, b);
  }

  static comparePre(a: ISemVer, b: ISemVer): number {
    return __cmpPre(a, b);
  }*/

  static parse(s: string, loose = false): SemVer {
    let m = s.trim().match(loose ? re[LOOSE] : re[FULL]);

    if (!m) {
      throw new TypeError('Invalid Version: ' + s);
    }

    // this.raw = version;

    // these are actually numbers
    let major = +m[1];
    let minor = +m[2];
    let patch = +m[3];

    // numberify any prerelease numeric ids
    let prerelease = [];
    if (m[4]) {
      prerelease = m[4].split(".").map(function(id) {
        return (/^[0-9]+$/.test(id)) ? +id : id;
      });
    }

    let build = m[5] ? m[5].split(".") : [];
    return new SemVer(
      major,
      minor,
      patch,
      prerelease,
      build
    );
  }

  static stringify(v: ISemVer): string {
    return SemVerStringify(v);
  }

  major: number;
  minor: number;
  patch: number;
  prerelease: Array<number|string>;
  build: Array<string>;

  constructor(
    major = 0,
    minor = 0,
    patch = 0,
    prerelease?: Array<number|string>,
    build?: Array<string>
  ) {
    this.major = ToUint32(major);
    this.minor = ToUint32(minor);
    this.patch = ToUint32(patch);
    this.prerelease = prerelease ? prerelease.slice() : []; // copy
    this.build = build ? build.slice() : []; // copy
  }

  compare(o: ISemVer): number {
    return SemVerCompare(this, o);
  }

  equals(o: any): boolean {
    return (
      this === o ||
      (
        o instanceof SemVer &&
        SemVerCompare(this, o) === 0
      )
    );
  }

  hashCode() {
    return hashString(this.toString());
  }

  inspect() {
    return `SemVer { "${this.toString()}" }`;
  }

  toJSON() {
    return ToString(this);
  }

  toString(): string {
    return SemVerStringify(this);
  }

}



function __cmpIdentifiers(a: number|string, b: number|string): number {
  return NaN;
  /*let anum = numeric.test(a);
  let bnum = numeric.test(b);

  if (anum && bnum) {
    a = +a;
    b = +b;
  }

  return (anum && !bnum) ? -1 :
         (bnum && !anum) ? 1 :
         a < b ? -1 :
         a > b ? 1 :
         0;*/
}

function __cmpMain(a: ISemVer, b: ISemVer): number {
  return (
    __cmpIdentifiers(a.major, b.major) ||
    __cmpIdentifiers(a.minor, b.minor) ||
    __cmpIdentifiers(a.patch, b.patch)
  );
}

function __cmpPre(a: ISemVer, b: ISemVer): number {
  let apre = a.prerelease;
  let bpre = b.prerelease;

  // NOT having a prerelease is > having one
  if (apre.length && !bpre.length) {
    return -1;
  } else if (!apre.length && bpre.length) {
    return 1;
  } else if (!apre.length && !bpre.length) {
    return 0;
  }

  let i = 0;
  do {
    let av = apre[i];
    let avundef = av === undefined;
    let bv = bpre[i];
    let bvundef = bv === undefined;

    if (avundef && bvundef) {
      return 0;
    } else if (bvundef) {
      return 1;
    } else if (avundef) {
      return -1;
    } else if (av === bv) {
      continue;
    } else {
      return __cmpIdentifiers(av, bv);
    }
  } while (++i);
}

// The actual regexps go on exports.re
let re: RegExp[] = [];
let src: string[] = [];
let R = 0;

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.

// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.

let NUMERICIDENTIFIER = R++;
src[NUMERICIDENTIFIER] = "0|[1-9]\\d*";
let NUMERICIDENTIFIERLOOSE = R++;
src[NUMERICIDENTIFIERLOOSE] = "[0-9]+";


// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.

let NONNUMERICIDENTIFIER = R++;
src[NONNUMERICIDENTIFIER] = "\\d*[a-zA-Z-][a-zA-Z0-9-]*";


// ## Main Version
// Three dot-separated numeric identifiers.

let MAINVERSION = R++;
src[MAINVERSION] = '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                   '(' + src[NUMERICIDENTIFIER] + ')';

let MAINVERSIONLOOSE = R++;
src[MAINVERSIONLOOSE] = '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                        '(' + src[NUMERICIDENTIFIERLOOSE] + ')';

// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.

let PRERELEASEIDENTIFIER = R++;
src[PRERELEASEIDENTIFIER] = '(?:' + src[NUMERICIDENTIFIER] +
                            '|' + src[NONNUMERICIDENTIFIER] + ')';

let PRERELEASEIDENTIFIERLOOSE = R++;
src[PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[NUMERICIDENTIFIERLOOSE] +
                                 '|' + src[NONNUMERICIDENTIFIER] + ')';


// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.

let PRERELEASE = R++;
src[PRERELEASE] = '(?:-(' + src[PRERELEASEIDENTIFIER] +
                  '(?:\\.' + src[PRERELEASEIDENTIFIER] + ')*))';

let PRERELEASELOOSE = R++;
src[PRERELEASELOOSE] = '(?:-?(' + src[PRERELEASEIDENTIFIERLOOSE] +
                       '(?:\\.' + src[PRERELEASEIDENTIFIERLOOSE] + ')*))';

// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.

let BUILDIDENTIFIER = R++;
src[BUILDIDENTIFIER] = '[0-9A-Za-z-]+';

// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.

let BUILD = R++;
src[BUILD] = '(?:\\+(' + src[BUILDIDENTIFIER] +
             '(?:\\.' + src[BUILDIDENTIFIER] + ')*))';


// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.

// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.

let FULL = R++;
let FULLPLAIN = 'v?' + src[MAINVERSION] +
                src[PRERELEASE] + '?' +
                src[BUILD] + '?';

src[FULL] = '^' + FULLPLAIN + '$';

// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
let LOOSEPLAIN = '[v=\\s]*' + src[MAINVERSIONLOOSE] +
                 src[PRERELEASELOOSE] + '?' +
                 src[BUILD] + '?';

let LOOSE = R++;
src[LOOSE] = '^' + LOOSEPLAIN + '$';

let GTLT = R++;
src[GTLT] = '((?:<|>)?=?)';

// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
let XRANGEIDENTIFIERLOOSE = R++;
src[XRANGEIDENTIFIERLOOSE] = `${src[NUMERICIDENTIFIERLOOSE]}|x|X|\\*`;
let XRANGEIDENTIFIER = R++;
src[XRANGEIDENTIFIER] = `${src[NUMERICIDENTIFIER]}|x|X|\\*`;

let XRANGEPLAIN = R++;
src[XRANGEPLAIN] = '[v=\\s]*(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                   '(?:' + src[PRERELEASE] + ')?' +
                   src[BUILD] + '?' +
                   ')?)?';

let XRANGEPLAINLOOSE = R++;
src[XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                        '(?:' + src[PRERELEASELOOSE] + ')?' +
                        src[BUILD] + '?' +
                        ')?)?';

let XRANGE = R++;
src[XRANGE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAIN] + '$';
let XRANGELOOSE = R++;
src[XRANGELOOSE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAINLOOSE] + '$';

// Tilde ranges.
// Meaning is "reasonably at or greater than"
let LONETILDE = R++;
src[LONETILDE] = '(?:~>?)';

let TILDETRIM = R++;
src[TILDETRIM] = '(\\s*)' + src[LONETILDE] + '\\s+';
re[TILDETRIM] = new RegExp(src[TILDETRIM], 'g');
let tildeTrimReplace = '$1~';

let TILDE = R++;
src[TILDE] = '^' + src[LONETILDE] + src[XRANGEPLAIN] + '$';
let TILDELOOSE = R++;
src[TILDELOOSE] = '^' + src[LONETILDE] + src[XRANGEPLAINLOOSE] + '$';

// Caret ranges.
// Meaning is "at least and backwards compatible with"
let LONECARET = R++;
src[LONECARET] = '(?:\\^)';

let CARETTRIM = R++;
src[CARETTRIM] = '(\\s*)' + src[LONECARET] + '\\s+';
re[CARETTRIM] = new RegExp(src[CARETTRIM], 'g');
let caretTrimReplace = '$1^';

let CARET = R++;
src[CARET] = '^' + src[LONECARET] + src[XRANGEPLAIN] + '$';
let CARETLOOSE = R++;
src[CARETLOOSE] = '^' + src[LONECARET] + src[XRANGEPLAINLOOSE] + '$';

// A simple gt/lt/eq thing, or just "" to indicate "any version"
let COMPARATORLOOSE = R++;
src[COMPARATORLOOSE] = '^' + src[GTLT] + '\\s*(' + LOOSEPLAIN + ')$|^$';
let COMPARATOR = R++;
src[COMPARATOR] = '^' + src[GTLT] + '\\s*(' + FULLPLAIN + ')$|^$';


// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
let COMPARATORTRIM = R++;
src[COMPARATORTRIM] = '(\\s*)' + src[GTLT] +
                      '\\s*(' + LOOSEPLAIN + '|' + src[XRANGEPLAIN] + ')';

// this one has to use the /g flag
re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], 'g');
let comparatorTrimReplace = '$1$2$3';


// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
let HYPHENRANGE = R++;
src[HYPHENRANGE] = '^\\s*(' + src[XRANGEPLAIN] + ')' +
                   '\\s+-\\s+' +
                   '(' + src[XRANGEPLAIN] + ')' +
                   '\\s*$';

let HYPHENRANGELOOSE = R++;
src[HYPHENRANGELOOSE] = '^\\s*(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s+-\\s+' +
                        '(' + src[XRANGEPLAINLOOSE] + ')' +
                        '\\s*$';

// Star ranges basically just allow anything at all.
let STAR = R++;
src[STAR] = '(<|>)?=?\\s*\\*';

// Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.
for (let i = 0; i < R; i++) {
  //debug(i, src[i]);
  if (!re[i])
    re[i] = new RegExp(src[i]);
}
