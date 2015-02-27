import hash = require("ts/hash")
import IHash = hash.IHash
import IHashState = hash.IHashState


//reference: https://github.com/npm/node-semver/blob/master/semver.js
module semver {

  export interface ISemVer {
    major: number;
    minor: number;
    patch: number;
    prerelease: Array<number|string>;
    build: Array<string>;
  }
  
  export class SemVer implements ISemVer, IHash {
    
    static cast(o: any): SemVer {
      var returnValue: SemVer = null;
      if (o) {
        if (o instanceof SemVer) {
          returnValue = o;
        } else if (__isString(o)) {
          returnValue = SemVer.parse(o);
        } else if (
          ("major" in o) &&
          ("minor" in o) &&
          ("patch" in o)
        ) {
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
      return __cmp(a, b);
    }
    
    /*static compareMain(a: ISemVer, b: ISemVer): number {
      return __cmpMain(a, b);
    }
    
    static comparePre(a: ISemVer, b: ISemVer): number {
      return __cmpPre(a, b);
    }*/
    
    static parse(s: string, loose = false): SemVer {
      var m = s.trim().match(loose ? re[LOOSE] : re[FULL]);

      if (!m) {
        throw new TypeError('Invalid Version: ' + s);
      }
    
      //this.raw = version;
    
      // these are actually numbers
      var major = +m[1];
      var minor = +m[2];
      var patch = +m[3];
    
      // numberify any prerelease numeric ids
      var prerelease = [];
      if (m[4]) {
        prerelease = m[4].split('.').map(function(id) {
          return (/^[0-9]+$/.test(id)) ? +id : id;
        });
      }
    
      var build = m[5] ? m[5].split('.') : [];
      return new SemVer(
        major,
        minor,
        patch,
        prerelease,
        build
      );
    }
    
    static stringify(v: ISemVer): string {
      var s = "";
      s += v.major + '.' + v.minor + '.' + v.patch;
      if (v.prerelease.length) {
        s += '-' + v.prerelease.join('.');
      }
      return s;
    }
    
    constructor(
      public major = 0,
      public minor = 0,
      public patch = 0,
      public prerelease: Array<number|string> = [],
      public build: Array<string> = []
    ) {
      
    }
    
    compare(o: ISemVer): number {
      return __cmp(this, o);
    }
    
    equals(o: any): boolean {
      return (
        this === o ||
        (
          o instanceof SemVer &&
          __cmp(this, o) === 0
        )
      );
    }
    
    hash(s: IHashState) {
      s.writeUint8(this.major);
      s.writeUint8(this.minor); 
      s.writeUint8(this.patch);
      s.writeArray(this.prerelease);
    }
    
    inspect() {
      var s = 'SemVer { "';
      s += __str(this);
      s += '" }';
      return s;
    }
    
    toJSON() {
      return __str(this);  
    }
    
    toString(): string {
      return SemVer.stringify(this);
    }
    
  }
  
  //util
  function __isString(o: any) { return typeof o === "string"; }
  function __str(o) { return String(o); }
  function __cmp(a: ISemVer, b: ISemVer) {
    return __cmpMain(a, b) || __cmpPre(a, b);
  }
  function __cmpIdentifiers(a: number|string, b: number|string): number {
    return NaN;
    /*var anum = numeric.test(a);
    var bnum = numeric.test(b);
  
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
    var apre = a.prerelease;
    var bpre = b.prerelease;
    
    // NOT having a prerelease is > having one
    if (apre.length && !bpre.length) {
      return -1;
    } else if (!apre.length && bpre.length) {
      return 1;
    } else if (!apre.length && !bpre.length) {
      return 0;
    }

    var i = 0;
    do {
      var av = apre[i];
      var bv = bpre[i];
      if (av === undefined && bv === undefined) {
        return 0;
      } else if (bv === undefined) {
        return 1;
      } else if (av === undefined) {
        return -1;
      } else if (av === bv) {
        continue;
      } else {
        return __cmpIdentifiers(av, bv);
      }
    } while (++i);
  }
  
  // The actual regexps go on exports.re
  var re: RegExp[] = [];
  var src: string[] = [];
  var R = 0;
  
  // The following Regular Expressions can be used for tokenizing,
  // validating, and parsing SemVer version strings.
  
  // ## Numeric Identifier
  // A single `0`, or a non-zero digit followed by zero or more digits.
  
  var NUMERICIDENTIFIER = R++;
  src[NUMERICIDENTIFIER] = '0|[1-9]\\d*';
  var NUMERICIDENTIFIERLOOSE = R++;
  src[NUMERICIDENTIFIERLOOSE] = '[0-9]+';
  
  
  // ## Non-numeric Identifier
  // Zero or more digits, followed by a letter or hyphen, and then zero or
  // more letters, digits, or hyphens.
  
  var NONNUMERICIDENTIFIER = R++;
  src[NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*';
  
  
  // ## Main Version
  // Three dot-separated numeric identifiers.
  
  var MAINVERSION = R++;
  src[MAINVERSION] = '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                     '(' + src[NUMERICIDENTIFIER] + ')\\.' +
                     '(' + src[NUMERICIDENTIFIER] + ')';
  
  var MAINVERSIONLOOSE = R++;
  src[MAINVERSIONLOOSE] = '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                          '(' + src[NUMERICIDENTIFIERLOOSE] + ')\\.' +
                          '(' + src[NUMERICIDENTIFIERLOOSE] + ')';
  
  // ## Pre-release Version Identifier
  // A numeric identifier, or a non-numeric identifier.
  
  var PRERELEASEIDENTIFIER = R++;
  src[PRERELEASEIDENTIFIER] = '(?:' + src[NUMERICIDENTIFIER] +
                              '|' + src[NONNUMERICIDENTIFIER] + ')';
  
  var PRERELEASEIDENTIFIERLOOSE = R++;
  src[PRERELEASEIDENTIFIERLOOSE] = '(?:' + src[NUMERICIDENTIFIERLOOSE] +
                                   '|' + src[NONNUMERICIDENTIFIER] + ')';
  
  
  // ## Pre-release Version
  // Hyphen, followed by one or more dot-separated pre-release version
  // identifiers.
  
  var PRERELEASE = R++;
  src[PRERELEASE] = '(?:-(' + src[PRERELEASEIDENTIFIER] +
                    '(?:\\.' + src[PRERELEASEIDENTIFIER] + ')*))';
  
  var PRERELEASELOOSE = R++;
  src[PRERELEASELOOSE] = '(?:-?(' + src[PRERELEASEIDENTIFIERLOOSE] +
                         '(?:\\.' + src[PRERELEASEIDENTIFIERLOOSE] + ')*))';
  
  // ## Build Metadata Identifier
  // Any combination of digits, letters, or hyphens.
  
  var BUILDIDENTIFIER = R++;
  src[BUILDIDENTIFIER] = '[0-9A-Za-z-]+';
  
  // ## Build Metadata
  // Plus sign, followed by one or more period-separated build metadata
  // identifiers.
  
  var BUILD = R++;
  src[BUILD] = '(?:\\+(' + src[BUILDIDENTIFIER] +
               '(?:\\.' + src[BUILDIDENTIFIER] + ')*))';
  
  
  // ## Full Version String
  // A main version, followed optionally by a pre-release version and
  // build metadata.
  
  // Note that the only major, minor, patch, and pre-release sections of
  // the version string are capturing groups.  The build metadata is not a
  // capturing group, because it should not ever be used in version
  // comparison.
  
  var FULL = R++;
  var FULLPLAIN = 'v?' + src[MAINVERSION] +
                  src[PRERELEASE] + '?' +
                  src[BUILD] + '?';
  
  src[FULL] = '^' + FULLPLAIN + '$';
  
  // like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
  // also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
  // common in the npm registry.
  var LOOSEPLAIN = '[v=\\s]*' + src[MAINVERSIONLOOSE] +
                   src[PRERELEASELOOSE] + '?' +
                   src[BUILD] + '?';
  
  var LOOSE = R++;
  src[LOOSE] = '^' + LOOSEPLAIN + '$';
  
  var GTLT = R++;
  src[GTLT] = '((?:<|>)?=?)';
  
  // Something like "2.*" or "1.2.x".
  // Note that "x.x" is a valid xRange identifer, meaning "any version"
  // Only the first item is strictly required.
  var XRANGEIDENTIFIERLOOSE = R++;
  src[XRANGEIDENTIFIERLOOSE] = src[NUMERICIDENTIFIERLOOSE] + '|x|X|\\*';
  var XRANGEIDENTIFIER = R++;
  src[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + '|x|X|\\*';
  
  var XRANGEPLAIN = R++;
  src[XRANGEPLAIN] = '[v=\\s]*(' + src[XRANGEIDENTIFIER] + ')' +
                     '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                     '(?:\\.(' + src[XRANGEIDENTIFIER] + ')' +
                     '(?:' + src[PRERELEASE] + ')?' +
                     src[BUILD] + '?' +
                     ')?)?';
  
  var XRANGEPLAINLOOSE = R++;
  src[XRANGEPLAINLOOSE] = '[v=\\s]*(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                          '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                          '(?:\\.(' + src[XRANGEIDENTIFIERLOOSE] + ')' +
                          '(?:' + src[PRERELEASELOOSE] + ')?' +
                          src[BUILD] + '?' +
                          ')?)?';
  
  var XRANGE = R++;
  src[XRANGE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAIN] + '$';
  var XRANGELOOSE = R++;
  src[XRANGELOOSE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAINLOOSE] + '$';
  
  // Tilde ranges.
  // Meaning is "reasonably at or greater than"
  var LONETILDE = R++;
  src[LONETILDE] = '(?:~>?)';
  
  var TILDETRIM = R++;
  src[TILDETRIM] = '(\\s*)' + src[LONETILDE] + '\\s+';
  re[TILDETRIM] = new RegExp(src[TILDETRIM], 'g');
  var tildeTrimReplace = '$1~';
  
  var TILDE = R++;
  src[TILDE] = '^' + src[LONETILDE] + src[XRANGEPLAIN] + '$';
  var TILDELOOSE = R++;
  src[TILDELOOSE] = '^' + src[LONETILDE] + src[XRANGEPLAINLOOSE] + '$';
  
  // Caret ranges.
  // Meaning is "at least and backwards compatible with"
  var LONECARET = R++;
  src[LONECARET] = '(?:\\^)';
  
  var CARETTRIM = R++;
  src[CARETTRIM] = '(\\s*)' + src[LONECARET] + '\\s+';
  re[CARETTRIM] = new RegExp(src[CARETTRIM], 'g');
  var caretTrimReplace = '$1^';
  
  var CARET = R++;
  src[CARET] = '^' + src[LONECARET] + src[XRANGEPLAIN] + '$';
  var CARETLOOSE = R++;
  src[CARETLOOSE] = '^' + src[LONECARET] + src[XRANGEPLAINLOOSE] + '$';
  
  // A simple gt/lt/eq thing, or just "" to indicate "any version"
  var COMPARATORLOOSE = R++;
  src[COMPARATORLOOSE] = '^' + src[GTLT] + '\\s*(' + LOOSEPLAIN + ')$|^$';
  var COMPARATOR = R++;
  src[COMPARATOR] = '^' + src[GTLT] + '\\s*(' + FULLPLAIN + ')$|^$';
  
  
  // An expression to strip any whitespace between the gtlt and the thing
  // it modifies, so that `> 1.2.3` ==> `>1.2.3`
  var COMPARATORTRIM = R++;
  src[COMPARATORTRIM] = '(\\s*)' + src[GTLT] +
                        '\\s*(' + LOOSEPLAIN + '|' + src[XRANGEPLAIN] + ')';
  
  // this one has to use the /g flag
  re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], 'g');
  var comparatorTrimReplace = '$1$2$3';
  
  
  // Something like `1.2.3 - 1.2.4`
  // Note that these all use the loose form, because they'll be
  // checked against either the strict or loose comparator form
  // later.
  var HYPHENRANGE = R++;
  src[HYPHENRANGE] = '^\\s*(' + src[XRANGEPLAIN] + ')' +
                     '\\s+-\\s+' +
                     '(' + src[XRANGEPLAIN] + ')' +
                     '\\s*$';
  
  var HYPHENRANGELOOSE = R++;
  src[HYPHENRANGELOOSE] = '^\\s*(' + src[XRANGEPLAINLOOSE] + ')' +
                          '\\s+-\\s+' +
                          '(' + src[XRANGEPLAINLOOSE] + ')' +
                          '\\s*$';
  
  // Star ranges basically just allow anything at all.
  var STAR = R++;
  src[STAR] = '(<|>)?=?\\s*\\*';
  
  // Compile to actual regexp objects.
  // All are flag-free, unless they were created above with a flag.
  for (var i = 0; i < R; i++) {
    //debug(i, src[i]);
    if (!re[i])
      re[i] = new RegExp(src[i]);
  }
  
}
export = semver