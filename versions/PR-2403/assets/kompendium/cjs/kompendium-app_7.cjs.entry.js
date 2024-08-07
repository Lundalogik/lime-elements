'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-4264cbf1.js');
const markdownTypes = require('./markdown-types-265472a0.js');
const types = require('./types-6c41e57a.js');
const _commonjsHelpers = require('./_commonjsHelpers-206db00d.js');
const domUtils = require('./dom-utils-384f57f3.js');
const activeRouter = require('./active-router-64317b4c.js');

/**
 * Fuse.js v6.4.6 - Lightweight fuzzy-search (http://fusejs.io)
 *
 * Copyright (c) 2021 Kiro Risk (http://kiro.me)
 * All Rights Reserved. Apache Software License 2.0
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

function isArray(value) {
  return !Array.isArray
    ? getTag(value) === '[object Array]'
    : Array.isArray(value)
}

// Adapted from: https://github.com/lodash/lodash/blob/master/.internal/baseToString.js
const INFINITY = 1 / 0;
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value
  }
  let result = value + '';
  return result == '0' && 1 / value == -INFINITY ? '-0' : result
}

function toString(value) {
  return value == null ? '' : baseToString(value)
}

function isString(value) {
  return typeof value === 'string'
}

function isNumber(value) {
  return typeof value === 'number'
}

// Adapted from: https://github.com/lodash/lodash/blob/master/isBoolean.js
function isBoolean(value) {
  return (
    value === true ||
    value === false ||
    (isObjectLike$1(value) && getTag(value) == '[object Boolean]')
  )
}

function isObject$1(value) {
  return typeof value === 'object'
}

// Checks if `value` is object-like.
function isObjectLike$1(value) {
  return isObject$1(value) && value !== null
}

function isDefined(value) {
  return value !== undefined && value !== null
}

function isBlank(value) {
  return !value.trim().length
}

// Gets the `toStringTag` of `value`.
// Adapted from: https://github.com/lodash/lodash/blob/master/.internal/getTag.js
function getTag(value) {
  return value == null
    ? value === undefined
      ? '[object Undefined]'
      : '[object Null]'
    : Object.prototype.toString.call(value)
}

const EXTENDED_SEARCH_UNAVAILABLE = 'Extended search is not available';

const INCORRECT_INDEX_TYPE = "Incorrect 'index' type";

const LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY = (key) =>
  `Invalid value for key ${key}`;

const PATTERN_LENGTH_TOO_LARGE = (max) =>
  `Pattern length exceeds max of ${max}.`;

const MISSING_KEY_PROPERTY = (name) => `Missing ${name} property in key`;

const INVALID_KEY_WEIGHT_VALUE = (key) =>
  `Property 'weight' in key '${key}' must be a positive integer`;

const hasOwn = Object.prototype.hasOwnProperty;

class KeyStore {
  constructor(keys) {
    this._keys = [];
    this._keyMap = {};

    let totalWeight = 0;

    keys.forEach((key) => {
      let obj = createKey(key);

      totalWeight += obj.weight;

      this._keys.push(obj);
      this._keyMap[obj.id] = obj;

      totalWeight += obj.weight;
    });

    // Normalize weights so that their sum is equal to 1
    this._keys.forEach((key) => {
      key.weight /= totalWeight;
    });
  }
  get(keyId) {
    return this._keyMap[keyId]
  }
  keys() {
    return this._keys
  }
  toJSON() {
    return JSON.stringify(this._keys)
  }
}

function createKey(key) {
  let path = null;
  let id = null;
  let src = null;
  let weight = 1;

  if (isString(key) || isArray(key)) {
    src = key;
    path = createKeyPath(key);
    id = createKeyId(key);
  } else {
    if (!hasOwn.call(key, 'name')) {
      throw new Error(MISSING_KEY_PROPERTY('name'))
    }

    const name = key.name;
    src = name;

    if (hasOwn.call(key, 'weight')) {
      weight = key.weight;

      if (weight <= 0) {
        throw new Error(INVALID_KEY_WEIGHT_VALUE(name))
      }
    }

    path = createKeyPath(name);
    id = createKeyId(name);
  }

  return { path, id, weight, src }
}

function createKeyPath(key) {
  return isArray(key) ? key : key.split('.')
}

function createKeyId(key) {
  return isArray(key) ? key.join('.') : key
}

function get(obj, path) {
  let list = [];
  let arr = false;

  const deepGet = (obj, path, index) => {
    if (!isDefined(obj)) {
      return
    }
    if (!path[index]) {
      // If there's no path left, we've arrived at the object we care about.
      list.push(obj);
    } else {
      let key = path[index];

      const value = obj[key];

      if (!isDefined(value)) {
        return
      }

      // If we're at the last value in the path, and if it's a string/number/bool,
      // add it to the list
      if (
        index === path.length - 1 &&
        (isString(value) || isNumber(value) || isBoolean(value))
      ) {
        list.push(toString(value));
      } else if (isArray(value)) {
        arr = true;
        // Search each item in the array.
        for (let i = 0, len = value.length; i < len; i += 1) {
          deepGet(value[i], path, index + 1);
        }
      } else if (path.length) {
        // An object. Recurse further.
        deepGet(value, path, index + 1);
      }
    }
  };

  // Backwards compatibility (since path used to be a string)
  deepGet(obj, isString(path) ? path.split('.') : path, 0);

  return arr ? list : list[0]
}

const MatchOptions = {
  // Whether the matches should be included in the result set. When `true`, each record in the result
  // set will include the indices of the matched characters.
  // These can consequently be used for highlighting purposes.
  includeMatches: false,
  // When `true`, the matching function will continue to the end of a search pattern even if
  // a perfect match has already been located in the string.
  findAllMatches: false,
  // Minimum number of characters that must be matched before a result is considered a match
  minMatchCharLength: 1
};

const BasicOptions = {
  // When `true`, the algorithm continues searching to the end of the input even if a perfect
  // match is found before the end of the same input.
  isCaseSensitive: false,
  // When true, the matching function will continue to the end of a search pattern even if
  includeScore: false,
  // List of properties that will be searched. This also supports nested properties.
  keys: [],
  // Whether to sort the result list, by score
  shouldSort: true,
  // Default sort function: sort by ascending score, ascending index
  sortFn: (a, b) =>
    a.score === b.score ? (a.idx < b.idx ? -1 : 1) : a.score < b.score ? -1 : 1
};

const FuzzyOptions = {
  // Approximately where in the text is the pattern expected to be found?
  location: 0,
  // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
  // (of both letters and location), a threshold of '1.0' would match anything.
  threshold: 0.6,
  // Determines how close the match must be to the fuzzy location (specified above).
  // An exact letter match which is 'distance' characters away from the fuzzy location
  // would score as a complete mismatch. A distance of '0' requires the match be at
  // the exact location specified, a threshold of '1000' would require a perfect match
  // to be within 800 characters of the fuzzy location to be found using a 0.8 threshold.
  distance: 100
};

const AdvancedOptions = {
  // When `true`, it enables the use of unix-like search commands
  useExtendedSearch: false,
  // The get function to use when fetching an object's properties.
  // The default will search nested paths *ie foo.bar.baz*
  getFn: get,
  // When `true`, search will ignore `location` and `distance`, so it won't matter
  // where in the string the pattern appears.
  // More info: https://fusejs.io/concepts/scoring-theory.html#fuzziness-score
  ignoreLocation: false,
  // When `true`, the calculation for the relevance score (used for sorting) will
  // ignore the field-length norm.
  // More info: https://fusejs.io/concepts/scoring-theory.html#field-length-norm
  ignoreFieldNorm: false
};

var Config = {
  ...BasicOptions,
  ...MatchOptions,
  ...FuzzyOptions,
  ...AdvancedOptions
};

const SPACE = /[^ ]+/g;

// Field-length norm: the shorter the field, the higher the weight.
// Set to 3 decimals to reduce index size.
function norm(mantissa = 3) {
  const cache = new Map();
  const m = Math.pow(10, mantissa);

  return {
    get(value) {
      const numTokens = value.match(SPACE).length;

      if (cache.has(numTokens)) {
        return cache.get(numTokens)
      }

      const norm = 1 / Math.sqrt(numTokens);

      // In place of `toFixed(mantissa)`, for faster computation
      const n = parseFloat(Math.round(norm * m) / m);

      cache.set(numTokens, n);

      return n
    },
    clear() {
      cache.clear();
    }
  }
}

class FuseIndex {
  constructor({ getFn = Config.getFn } = {}) {
    this.norm = norm(3);
    this.getFn = getFn;
    this.isCreated = false;

    this.setIndexRecords();
  }
  setSources(docs = []) {
    this.docs = docs;
  }
  setIndexRecords(records = []) {
    this.records = records;
  }
  setKeys(keys = []) {
    this.keys = keys;
    this._keysMap = {};
    keys.forEach((key, idx) => {
      this._keysMap[key.id] = idx;
    });
  }
  create() {
    if (this.isCreated || !this.docs.length) {
      return
    }

    this.isCreated = true;

    // List is Array<String>
    if (isString(this.docs[0])) {
      this.docs.forEach((doc, docIndex) => {
        this._addString(doc, docIndex);
      });
    } else {
      // List is Array<Object>
      this.docs.forEach((doc, docIndex) => {
        this._addObject(doc, docIndex);
      });
    }

    this.norm.clear();
  }
  // Adds a doc to the end of the index
  add(doc) {
    const idx = this.size();

    if (isString(doc)) {
      this._addString(doc, idx);
    } else {
      this._addObject(doc, idx);
    }
  }
  // Removes the doc at the specified index of the index
  removeAt(idx) {
    this.records.splice(idx, 1);

    // Change ref index of every subsquent doc
    for (let i = idx, len = this.size(); i < len; i += 1) {
      this.records[i].i -= 1;
    }
  }
  getValueForItemAtKeyId(item, keyId) {
    return item[this._keysMap[keyId]]
  }
  size() {
    return this.records.length
  }
  _addString(doc, docIndex) {
    if (!isDefined(doc) || isBlank(doc)) {
      return
    }

    let record = {
      v: doc,
      i: docIndex,
      n: this.norm.get(doc)
    };

    this.records.push(record);
  }
  _addObject(doc, docIndex) {
    let record = { i: docIndex, $: {} };

    // Iterate over every key (i.e, path), and fetch the value at that key
    this.keys.forEach((key, keyIndex) => {
      // console.log(key)
      let value = this.getFn(doc, key.path);

      if (!isDefined(value)) {
        return
      }

      if (isArray(value)) {
        let subRecords = [];
        const stack = [{ nestedArrIndex: -1, value }];

        while (stack.length) {
          const { nestedArrIndex, value } = stack.pop();

          if (!isDefined(value)) {
            continue
          }

          if (isString(value) && !isBlank(value)) {
            let subRecord = {
              v: value,
              i: nestedArrIndex,
              n: this.norm.get(value)
            };

            subRecords.push(subRecord);
          } else if (isArray(value)) {
            value.forEach((item, k) => {
              stack.push({
                nestedArrIndex: k,
                value: item
              });
            });
          }
        }
        record.$[keyIndex] = subRecords;
      } else if (!isBlank(value)) {
        let subRecord = {
          v: value,
          n: this.norm.get(value)
        };

        record.$[keyIndex] = subRecord;
      }
    });

    this.records.push(record);
  }
  toJSON() {
    return {
      keys: this.keys,
      records: this.records
    }
  }
}

function createIndex(keys, docs, { getFn = Config.getFn } = {}) {
  const myIndex = new FuseIndex({ getFn });
  myIndex.setKeys(keys.map(createKey));
  myIndex.setSources(docs);
  myIndex.create();
  return myIndex
}

function parseIndex(data, { getFn = Config.getFn } = {}) {
  const { keys, records } = data;
  const myIndex = new FuseIndex({ getFn });
  myIndex.setKeys(keys);
  myIndex.setIndexRecords(records);
  return myIndex
}

function computeScore(
  pattern,
  {
    errors = 0,
    currentLocation = 0,
    expectedLocation = 0,
    distance = Config.distance,
    ignoreLocation = Config.ignoreLocation
  } = {}
) {
  const accuracy = errors / pattern.length;

  if (ignoreLocation) {
    return accuracy
  }

  const proximity = Math.abs(expectedLocation - currentLocation);

  if (!distance) {
    // Dodge divide by zero error.
    return proximity ? 1.0 : accuracy
  }

  return accuracy + proximity / distance
}

function convertMaskToIndices(
  matchmask = [],
  minMatchCharLength = Config.minMatchCharLength
) {
  let indices = [];
  let start = -1;
  let end = -1;
  let i = 0;

  for (let len = matchmask.length; i < len; i += 1) {
    let match = matchmask[i];
    if (match && start === -1) {
      start = i;
    } else if (!match && start !== -1) {
      end = i - 1;
      if (end - start + 1 >= minMatchCharLength) {
        indices.push([start, end]);
      }
      start = -1;
    }
  }

  // (i-1 - start) + 1 => i - start
  if (matchmask[i - 1] && i - start >= minMatchCharLength) {
    indices.push([start, i - 1]);
  }

  return indices
}

// Machine word size
const MAX_BITS = 32;

function search(
  text,
  pattern,
  patternAlphabet,
  {
    location = Config.location,
    distance = Config.distance,
    threshold = Config.threshold,
    findAllMatches = Config.findAllMatches,
    minMatchCharLength = Config.minMatchCharLength,
    includeMatches = Config.includeMatches,
    ignoreLocation = Config.ignoreLocation
  } = {}
) {
  if (pattern.length > MAX_BITS) {
    throw new Error(PATTERN_LENGTH_TOO_LARGE(MAX_BITS))
  }

  const patternLen = pattern.length;
  // Set starting location at beginning text and initialize the alphabet.
  const textLen = text.length;
  // Handle the case when location > text.length
  const expectedLocation = Math.max(0, Math.min(location, textLen));
  // Highest score beyond which we give up.
  let currentThreshold = threshold;
  // Is there a nearby exact match? (speedup)
  let bestLocation = expectedLocation;

  // Performance: only computer matches when the minMatchCharLength > 1
  // OR if `includeMatches` is true.
  const computeMatches = minMatchCharLength > 1 || includeMatches;
  // A mask of the matches, used for building the indices
  const matchMask = computeMatches ? Array(textLen) : [];

  let index;

  // Get all exact matches, here for speed up
  while ((index = text.indexOf(pattern, bestLocation)) > -1) {
    let score = computeScore(pattern, {
      currentLocation: index,
      expectedLocation,
      distance,
      ignoreLocation
    });

    currentThreshold = Math.min(score, currentThreshold);
    bestLocation = index + patternLen;

    if (computeMatches) {
      let i = 0;
      while (i < patternLen) {
        matchMask[index + i] = 1;
        i += 1;
      }
    }
  }

  // Reset the best location
  bestLocation = -1;

  let lastBitArr = [];
  let finalScore = 1;
  let binMax = patternLen + textLen;

  const mask = 1 << (patternLen - 1);

  for (let i = 0; i < patternLen; i += 1) {
    // Scan for the best match; each iteration allows for one more error.
    // Run a binary search to determine how far from the match location we can stray
    // at this error level.
    let binMin = 0;
    let binMid = binMax;

    while (binMin < binMid) {
      const score = computeScore(pattern, {
        errors: i,
        currentLocation: expectedLocation + binMid,
        expectedLocation,
        distance,
        ignoreLocation
      });

      if (score <= currentThreshold) {
        binMin = binMid;
      } else {
        binMax = binMid;
      }

      binMid = Math.floor((binMax - binMin) / 2 + binMin);
    }

    // Use the result from this iteration as the maximum for the next.
    binMax = binMid;

    let start = Math.max(1, expectedLocation - binMid + 1);
    let finish = findAllMatches
      ? textLen
      : Math.min(expectedLocation + binMid, textLen) + patternLen;

    // Initialize the bit array
    let bitArr = Array(finish + 2);

    bitArr[finish + 1] = (1 << i) - 1;

    for (let j = finish; j >= start; j -= 1) {
      let currentLocation = j - 1;
      let charMatch = patternAlphabet[text.charAt(currentLocation)];

      if (computeMatches) {
        // Speed up: quick bool to int conversion (i.e, `charMatch ? 1 : 0`)
        matchMask[currentLocation] = +!!charMatch;
      }

      // First pass: exact match
      bitArr[j] = ((bitArr[j + 1] << 1) | 1) & charMatch;

      // Subsequent passes: fuzzy match
      if (i) {
        bitArr[j] |=
          ((lastBitArr[j + 1] | lastBitArr[j]) << 1) | 1 | lastBitArr[j + 1];
      }

      if (bitArr[j] & mask) {
        finalScore = computeScore(pattern, {
          errors: i,
          currentLocation,
          expectedLocation,
          distance,
          ignoreLocation
        });

        // This match will almost certainly be better than any existing match.
        // But check anyway.
        if (finalScore <= currentThreshold) {
          // Indeed it is
          currentThreshold = finalScore;
          bestLocation = currentLocation;

          // Already passed `loc`, downhill from here on in.
          if (bestLocation <= expectedLocation) {
            break
          }

          // When passing `bestLocation`, don't exceed our current distance from `expectedLocation`.
          start = Math.max(1, 2 * expectedLocation - bestLocation);
        }
      }
    }

    // No hope for a (better) match at greater error levels.
    const score = computeScore(pattern, {
      errors: i + 1,
      currentLocation: expectedLocation,
      expectedLocation,
      distance,
      ignoreLocation
    });

    if (score > currentThreshold) {
      break
    }

    lastBitArr = bitArr;
  }

  const result = {
    isMatch: bestLocation >= 0,
    // Count exact matches (those with a score of 0) to be "almost" exact
    score: Math.max(0.001, finalScore)
  };

  if (computeMatches) {
    const indices = convertMaskToIndices(matchMask, minMatchCharLength);
    if (!indices.length) {
      result.isMatch = false;
    } else if (includeMatches) {
      result.indices = indices;
    }
  }

  return result
}

function createPatternAlphabet(pattern) {
  let mask = {};

  for (let i = 0, len = pattern.length; i < len; i += 1) {
    const char = pattern.charAt(i);
    mask[char] = (mask[char] || 0) | (1 << (len - i - 1));
  }

  return mask
}

class BitapSearch {
  constructor(
    pattern,
    {
      location = Config.location,
      threshold = Config.threshold,
      distance = Config.distance,
      includeMatches = Config.includeMatches,
      findAllMatches = Config.findAllMatches,
      minMatchCharLength = Config.minMatchCharLength,
      isCaseSensitive = Config.isCaseSensitive,
      ignoreLocation = Config.ignoreLocation
    } = {}
  ) {
    this.options = {
      location,
      threshold,
      distance,
      includeMatches,
      findAllMatches,
      minMatchCharLength,
      isCaseSensitive,
      ignoreLocation
    };

    this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();

    this.chunks = [];

    if (!this.pattern.length) {
      return
    }

    const addChunk = (pattern, startIndex) => {
      this.chunks.push({
        pattern,
        alphabet: createPatternAlphabet(pattern),
        startIndex
      });
    };

    const len = this.pattern.length;

    if (len > MAX_BITS) {
      let i = 0;
      const remainder = len % MAX_BITS;
      const end = len - remainder;

      while (i < end) {
        addChunk(this.pattern.substr(i, MAX_BITS), i);
        i += MAX_BITS;
      }

      if (remainder) {
        const startIndex = len - MAX_BITS;
        addChunk(this.pattern.substr(startIndex), startIndex);
      }
    } else {
      addChunk(this.pattern, 0);
    }
  }

  searchIn(text) {
    const { isCaseSensitive, includeMatches } = this.options;

    if (!isCaseSensitive) {
      text = text.toLowerCase();
    }

    // Exact match
    if (this.pattern === text) {
      let result = {
        isMatch: true,
        score: 0
      };

      if (includeMatches) {
        result.indices = [[0, text.length - 1]];
      }

      return result
    }

    // Otherwise, use Bitap algorithm
    const {
      location,
      distance,
      threshold,
      findAllMatches,
      minMatchCharLength,
      ignoreLocation
    } = this.options;

    let allIndices = [];
    let totalScore = 0;
    let hasMatches = false;

    this.chunks.forEach(({ pattern, alphabet, startIndex }) => {
      const { isMatch, score, indices } = search(text, pattern, alphabet, {
        location: location + startIndex,
        distance,
        threshold,
        findAllMatches,
        minMatchCharLength,
        includeMatches,
        ignoreLocation
      });

      if (isMatch) {
        hasMatches = true;
      }

      totalScore += score;

      if (isMatch && indices) {
        allIndices = [...allIndices, ...indices];
      }
    });

    let result = {
      isMatch: hasMatches,
      score: hasMatches ? totalScore / this.chunks.length : 1
    };

    if (hasMatches && includeMatches) {
      result.indices = allIndices;
    }

    return result
  }
}

class BaseMatch {
  constructor(pattern) {
    this.pattern = pattern;
  }
  static isMultiMatch(pattern) {
    return getMatch$1(pattern, this.multiRegex)
  }
  static isSingleMatch(pattern) {
    return getMatch$1(pattern, this.singleRegex)
  }
  search(/*text*/) {}
}

function getMatch$1(pattern, exp) {
  const matches = pattern.match(exp);
  return matches ? matches[1] : null
}

// Token: 'file

class ExactMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return 'exact'
  }
  static get multiRegex() {
    return /^="(.*)"$/
  }
  static get singleRegex() {
    return /^=(.*)$/
  }
  search(text) {
    const isMatch = text === this.pattern;

    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, this.pattern.length - 1]
    }
  }
}

// Token: !fire

class InverseExactMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return 'inverse-exact'
  }
  static get multiRegex() {
    return /^!"(.*)"$/
  }
  static get singleRegex() {
    return /^!(.*)$/
  }
  search(text) {
    const index = text.indexOf(this.pattern);
    const isMatch = index === -1;

    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, text.length - 1]
    }
  }
}

// Token: ^file

class PrefixExactMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return 'prefix-exact'
  }
  static get multiRegex() {
    return /^\^"(.*)"$/
  }
  static get singleRegex() {
    return /^\^(.*)$/
  }
  search(text) {
    const isMatch = text.startsWith(this.pattern);

    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, this.pattern.length - 1]
    }
  }
}

// Token: !^fire

class InversePrefixExactMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return 'inverse-prefix-exact'
  }
  static get multiRegex() {
    return /^!\^"(.*)"$/
  }
  static get singleRegex() {
    return /^!\^(.*)$/
  }
  search(text) {
    const isMatch = !text.startsWith(this.pattern);

    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, text.length - 1]
    }
  }
}

// Token: .file$

class SuffixExactMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return 'suffix-exact'
  }
  static get multiRegex() {
    return /^"(.*)"\$$/
  }
  static get singleRegex() {
    return /^(.*)\$$/
  }
  search(text) {
    const isMatch = text.endsWith(this.pattern);

    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [text.length - this.pattern.length, text.length - 1]
    }
  }
}

// Token: !.file$

class InverseSuffixExactMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return 'inverse-suffix-exact'
  }
  static get multiRegex() {
    return /^!"(.*)"\$$/
  }
  static get singleRegex() {
    return /^!(.*)\$$/
  }
  search(text) {
    const isMatch = !text.endsWith(this.pattern);
    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices: [0, text.length - 1]
    }
  }
}

class FuzzyMatch extends BaseMatch {
  constructor(
    pattern,
    {
      location = Config.location,
      threshold = Config.threshold,
      distance = Config.distance,
      includeMatches = Config.includeMatches,
      findAllMatches = Config.findAllMatches,
      minMatchCharLength = Config.minMatchCharLength,
      isCaseSensitive = Config.isCaseSensitive,
      ignoreLocation = Config.ignoreLocation
    } = {}
  ) {
    super(pattern);
    this._bitapSearch = new BitapSearch(pattern, {
      location,
      threshold,
      distance,
      includeMatches,
      findAllMatches,
      minMatchCharLength,
      isCaseSensitive,
      ignoreLocation
    });
  }
  static get type() {
    return 'fuzzy'
  }
  static get multiRegex() {
    return /^"(.*)"$/
  }
  static get singleRegex() {
    return /^(.*)$/
  }
  search(text) {
    return this._bitapSearch.searchIn(text)
  }
}

// Token: 'file

class IncludeMatch extends BaseMatch {
  constructor(pattern) {
    super(pattern);
  }
  static get type() {
    return 'include'
  }
  static get multiRegex() {
    return /^'"(.*)"$/
  }
  static get singleRegex() {
    return /^'(.*)$/
  }
  search(text) {
    let location = 0;
    let index;

    const indices = [];
    const patternLen = this.pattern.length;

    // Get all exact matches
    while ((index = text.indexOf(this.pattern, location)) > -1) {
      location = index + patternLen;
      indices.push([index, location - 1]);
    }

    const isMatch = !!indices.length;

    return {
      isMatch,
      score: isMatch ? 0 : 1,
      indices
    }
  }
}

// ❗Order is important. DO NOT CHANGE.
const searchers = [
  ExactMatch,
  IncludeMatch,
  PrefixExactMatch,
  InversePrefixExactMatch,
  InverseSuffixExactMatch,
  SuffixExactMatch,
  InverseExactMatch,
  FuzzyMatch
];

const searchersLen = searchers.length;

// Regex to split by spaces, but keep anything in quotes together
const SPACE_RE = / +(?=([^\"]*\"[^\"]*\")*[^\"]*$)/;
const OR_TOKEN = '|';

// Return a 2D array representation of the query, for simpler parsing.
// Example:
// "^core go$ | rb$ | py$ xy$" => [["^core", "go$"], ["rb$"], ["py$", "xy$"]]
function parseQuery(pattern, options = {}) {
  return pattern.split(OR_TOKEN).map((item) => {
    let query = item
      .trim()
      .split(SPACE_RE)
      .filter((item) => item && !!item.trim());

    let results = [];
    for (let i = 0, len = query.length; i < len; i += 1) {
      const queryItem = query[i];

      // 1. Handle multiple query match (i.e, once that are quoted, like `"hello world"`)
      let found = false;
      let idx = -1;
      while (!found && ++idx < searchersLen) {
        const searcher = searchers[idx];
        let token = searcher.isMultiMatch(queryItem);
        if (token) {
          results.push(new searcher(token, options));
          found = true;
        }
      }

      if (found) {
        continue
      }

      // 2. Handle single query matches (i.e, once that are *not* quoted)
      idx = -1;
      while (++idx < searchersLen) {
        const searcher = searchers[idx];
        let token = searcher.isSingleMatch(queryItem);
        if (token) {
          results.push(new searcher(token, options));
          break
        }
      }
    }

    return results
  })
}

// These extended matchers can return an array of matches, as opposed
// to a singl match
const MultiMatchSet = new Set([FuzzyMatch.type, IncludeMatch.type]);

/**
 * Command-like searching
 * ======================
 *
 * Given multiple search terms delimited by spaces.e.g. `^jscript .python$ ruby !java`,
 * search in a given text.
 *
 * Search syntax:
 *
 * | Token       | Match type                 | Description                            |
 * | ----------- | -------------------------- | -------------------------------------- |
 * | `jscript`   | fuzzy-match                | Items that fuzzy match `jscript`       |
 * | `=scheme`   | exact-match                | Items that are `scheme`                |
 * | `'python`   | include-match              | Items that include `python`            |
 * | `!ruby`     | inverse-exact-match        | Items that do not include `ruby`       |
 * | `^java`     | prefix-exact-match         | Items that start with `java`           |
 * | `!^earlang` | inverse-prefix-exact-match | Items that do not start with `earlang` |
 * | `.js$`      | suffix-exact-match         | Items that end with `.js`              |
 * | `!.go$`     | inverse-suffix-exact-match | Items that do not end with `.go`       |
 *
 * A single pipe character acts as an OR operator. For example, the following
 * query matches entries that start with `core` and end with either`go`, `rb`,
 * or`py`.
 *
 * ```
 * ^core go$ | rb$ | py$
 * ```
 */
class ExtendedSearch {
  constructor(
    pattern,
    {
      isCaseSensitive = Config.isCaseSensitive,
      includeMatches = Config.includeMatches,
      minMatchCharLength = Config.minMatchCharLength,
      ignoreLocation = Config.ignoreLocation,
      findAllMatches = Config.findAllMatches,
      location = Config.location,
      threshold = Config.threshold,
      distance = Config.distance
    } = {}
  ) {
    this.query = null;
    this.options = {
      isCaseSensitive,
      includeMatches,
      minMatchCharLength,
      findAllMatches,
      ignoreLocation,
      location,
      threshold,
      distance
    };

    this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
    this.query = parseQuery(this.pattern, this.options);
  }

  static condition(_, options) {
    return options.useExtendedSearch
  }

  searchIn(text) {
    const query = this.query;

    if (!query) {
      return {
        isMatch: false,
        score: 1
      }
    }

    const { includeMatches, isCaseSensitive } = this.options;

    text = isCaseSensitive ? text : text.toLowerCase();

    let numMatches = 0;
    let allIndices = [];
    let totalScore = 0;

    // ORs
    for (let i = 0, qLen = query.length; i < qLen; i += 1) {
      const searchers = query[i];

      // Reset indices
      allIndices.length = 0;
      numMatches = 0;

      // ANDs
      for (let j = 0, pLen = searchers.length; j < pLen; j += 1) {
        const searcher = searchers[j];
        const { isMatch, indices, score } = searcher.search(text);

        if (isMatch) {
          numMatches += 1;
          totalScore += score;
          if (includeMatches) {
            const type = searcher.constructor.type;
            if (MultiMatchSet.has(type)) {
              allIndices = [...allIndices, ...indices];
            } else {
              allIndices.push(indices);
            }
          }
        } else {
          totalScore = 0;
          numMatches = 0;
          allIndices.length = 0;
          break
        }
      }

      // OR condition, so if TRUE, return
      if (numMatches) {
        let result = {
          isMatch: true,
          score: totalScore / numMatches
        };

        if (includeMatches) {
          result.indices = allIndices;
        }

        return result
      }
    }

    // Nothing was matched
    return {
      isMatch: false,
      score: 1
    }
  }
}

const registeredSearchers = [];

function register(...args) {
  registeredSearchers.push(...args);
}

function createSearcher(pattern, options) {
  for (let i = 0, len = registeredSearchers.length; i < len; i += 1) {
    let searcherClass = registeredSearchers[i];
    if (searcherClass.condition(pattern, options)) {
      return new searcherClass(pattern, options)
    }
  }

  return new BitapSearch(pattern, options)
}

const LogicalOperator = {
  AND: '$and',
  OR: '$or'
};

const KeyType = {
  PATH: '$path',
  PATTERN: '$val'
};

const isExpression = (query) =>
  !!(query[LogicalOperator.AND] || query[LogicalOperator.OR]);

const isPath = (query) => !!query[KeyType.PATH];

const isLeaf = (query) =>
  !isArray(query) && isObject$1(query) && !isExpression(query);

const convertToExplicit = (query) => ({
  [LogicalOperator.AND]: Object.keys(query).map((key) => ({
    [key]: query[key]
  }))
});

// When `auto` is `true`, the parse function will infer and initialize and add
// the appropriate `Searcher` instance
function parse(query, options, { auto = true } = {}) {
  const next = (query) => {
    let keys = Object.keys(query);

    const isQueryPath = isPath(query);

    if (!isQueryPath && keys.length > 1 && !isExpression(query)) {
      return next(convertToExplicit(query))
    }

    if (isLeaf(query)) {
      const key = isQueryPath ? query[KeyType.PATH] : keys[0];

      const pattern = isQueryPath ? query[KeyType.PATTERN] : query[key];

      if (!isString(pattern)) {
        throw new Error(LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY(key))
      }

      const obj = {
        keyId: createKeyId(key),
        pattern
      };

      if (auto) {
        obj.searcher = createSearcher(pattern, options);
      }

      return obj
    }

    let node = {
      children: [],
      operator: keys[0]
    };

    keys.forEach((key) => {
      const value = query[key];

      if (isArray(value)) {
        value.forEach((item) => {
          node.children.push(next(item));
        });
      }
    });

    return node
  };

  if (!isExpression(query)) {
    query = convertToExplicit(query);
  }

  return next(query)
}

// Practical scoring function
function computeScore$1(
  results,
  { ignoreFieldNorm = Config.ignoreFieldNorm }
) {
  results.forEach((result) => {
    let totalScore = 1;

    result.matches.forEach(({ key, norm, score }) => {
      const weight = key ? key.weight : null;

      totalScore *= Math.pow(
        score === 0 && weight ? Number.EPSILON : score,
        (weight || 1) * (ignoreFieldNorm ? 1 : norm)
      );
    });

    result.score = totalScore;
  });
}

function transformMatches(result, data) {
  const matches = result.matches;
  data.matches = [];

  if (!isDefined(matches)) {
    return
  }

  matches.forEach((match) => {
    if (!isDefined(match.indices) || !match.indices.length) {
      return
    }

    const { indices, value } = match;

    let obj = {
      indices,
      value
    };

    if (match.key) {
      obj.key = match.key.src;
    }

    if (match.idx > -1) {
      obj.refIndex = match.idx;
    }

    data.matches.push(obj);
  });
}

function transformScore(result, data) {
  data.score = result.score;
}

function format(
  results,
  docs,
  {
    includeMatches = Config.includeMatches,
    includeScore = Config.includeScore
  } = {}
) {
  const transformers = [];

  if (includeMatches) transformers.push(transformMatches);
  if (includeScore) transformers.push(transformScore);

  return results.map((result) => {
    const { idx } = result;

    const data = {
      item: docs[idx],
      refIndex: idx
    };

    if (transformers.length) {
      transformers.forEach((transformer) => {
        transformer(result, data);
      });
    }

    return data
  })
}

class Fuse {
  constructor(docs, options = {}, index) {
    this.options = { ...Config, ...options };

    if (
      this.options.useExtendedSearch &&
      !true
    ) {
      throw new Error(EXTENDED_SEARCH_UNAVAILABLE)
    }

    this._keyStore = new KeyStore(this.options.keys);

    this.setCollection(docs, index);
  }

  setCollection(docs, index) {
    this._docs = docs;

    if (index && !(index instanceof FuseIndex)) {
      throw new Error(INCORRECT_INDEX_TYPE)
    }

    this._myIndex =
      index ||
      createIndex(this.options.keys, this._docs, {
        getFn: this.options.getFn
      });
  }

  add(doc) {
    if (!isDefined(doc)) {
      return
    }

    this._docs.push(doc);
    this._myIndex.add(doc);
  }

  remove(predicate = (/* doc, idx */) => false) {
    const results = [];

    for (let i = 0, len = this._docs.length; i < len; i += 1) {
      const doc = this._docs[i];
      if (predicate(doc, i)) {
        this.removeAt(i);
        i -= 1;
        len -= 1;

        results.push(doc);
      }
    }

    return results
  }

  removeAt(idx) {
    this._docs.splice(idx, 1);
    this._myIndex.removeAt(idx);
  }

  getIndex() {
    return this._myIndex
  }

  search(query, { limit = -1 } = {}) {
    const {
      includeMatches,
      includeScore,
      shouldSort,
      sortFn,
      ignoreFieldNorm
    } = this.options;

    let results = isString(query)
      ? isString(this._docs[0])
        ? this._searchStringList(query)
        : this._searchObjectList(query)
      : this._searchLogical(query);

    computeScore$1(results, { ignoreFieldNorm });

    if (shouldSort) {
      results.sort(sortFn);
    }

    if (isNumber(limit) && limit > -1) {
      results = results.slice(0, limit);
    }

    return format(results, this._docs, {
      includeMatches,
      includeScore
    })
  }

  _searchStringList(query) {
    const searcher = createSearcher(query, this.options);
    const { records } = this._myIndex;
    const results = [];

    // Iterate over every string in the index
    records.forEach(({ v: text, i: idx, n: norm }) => {
      if (!isDefined(text)) {
        return
      }

      const { isMatch, score, indices } = searcher.searchIn(text);

      if (isMatch) {
        results.push({
          item: text,
          idx,
          matches: [{ score, value: text, norm, indices }]
        });
      }
    });

    return results
  }

  _searchLogical(query) {

    const expression = parse(query, this.options);

    const evaluate = (node, item, idx) => {
      if (!node.children) {
        const { keyId, searcher } = node;

        const matches = this._findMatches({
          key: this._keyStore.get(keyId),
          value: this._myIndex.getValueForItemAtKeyId(item, keyId),
          searcher
        });

        if (matches && matches.length) {
          return [
            {
              idx,
              item,
              matches
            }
          ]
        }

        return []
      }

      /*eslint indent: [2, 2, {"SwitchCase": 1}]*/
      switch (node.operator) {
        case LogicalOperator.AND: {
          const res = [];
          for (let i = 0, len = node.children.length; i < len; i += 1) {
            const child = node.children[i];
            const result = evaluate(child, item, idx);
            if (result.length) {
              res.push(...result);
            } else {
              return []
            }
          }
          return res
        }
        case LogicalOperator.OR: {
          const res = [];
          for (let i = 0, len = node.children.length; i < len; i += 1) {
            const child = node.children[i];
            const result = evaluate(child, item, idx);
            if (result.length) {
              res.push(...result);
              break
            }
          }
          return res
        }
      }
    };

    const records = this._myIndex.records;
    const resultMap = {};
    const results = [];

    records.forEach(({ $: item, i: idx }) => {
      if (isDefined(item)) {
        let expResults = evaluate(expression, item, idx);

        if (expResults.length) {
          // Dedupe when adding
          if (!resultMap[idx]) {
            resultMap[idx] = { idx, item, matches: [] };
            results.push(resultMap[idx]);
          }
          expResults.forEach(({ matches }) => {
            resultMap[idx].matches.push(...matches);
          });
        }
      }
    });

    return results
  }

  _searchObjectList(query) {
    const searcher = createSearcher(query, this.options);
    const { keys, records } = this._myIndex;
    const results = [];

    // List is Array<Object>
    records.forEach(({ $: item, i: idx }) => {
      if (!isDefined(item)) {
        return
      }

      let matches = [];

      // Iterate over every key (i.e, path), and fetch the value at that key
      keys.forEach((key, keyIndex) => {
        matches.push(
          ...this._findMatches({
            key,
            value: item[keyIndex],
            searcher
          })
        );
      });

      if (matches.length) {
        results.push({
          idx,
          item,
          matches
        });
      }
    });

    return results
  }
  _findMatches({ key, value, searcher }) {
    if (!isDefined(value)) {
      return []
    }

    let matches = [];

    if (isArray(value)) {
      value.forEach(({ v: text, i: idx, n: norm }) => {
        if (!isDefined(text)) {
          return
        }

        const { isMatch, score, indices } = searcher.searchIn(text);

        if (isMatch) {
          matches.push({
            score,
            key,
            value: text,
            idx,
            norm,
            indices
          });
        }
      });
    } else {
      const { v: text, n: norm } = value;

      const { isMatch, score, indices } = searcher.searchIn(text);

      if (isMatch) {
        matches.push({ score, key, value: text, norm, indices });
      }
    }

    return matches
  }
}

Fuse.version = '6.4.6';
Fuse.createIndex = createIndex;
Fuse.parseIndex = parseIndex;
Fuse.config = Config;

{
  Fuse.parseQuery = parse;
}

{
  register(ExtendedSearch);
}

const appCss = "*,*::before,*::after{box-sizing:border-box}ul[class],ol[class]{padding:0}body,h1,h2,h3,h4,p,ul[class],ol[class],li,figure,figcaption,blockquote,dl,dd{margin:0}ul[class],ol[class]{list-style:none}a:not([class]){text-decoration-skip-ink:auto}img{max-width:100%}input,button,textarea,select{font:inherit}@media (prefers-reduced-motion: reduce){*{animation-duration:0.01ms !important;animation-iteration-count:1 !important;transition-duration:0.01ms !important;scroll-behavior:auto !important}}:root{--width-nav-panel:16rem}@keyframes spin{to{transform:rotate(360deg)}}.loading-screen{display:flex;flex-direction:row;align-items:center;justify-content:center;position:absolute;top:0;right:0;bottom:0;left:0}.loading-screen-icon{animation:spin 0.35s linear infinite;border-radius:50%;border-style:solid;border-width:0.125rem;border-color:rgb(var(--kompendium-color-blue-default));border-top-color:transparent;display:inline-block;height:1.25rem;width:1.25rem}.loading-screen-text{padding-left:0.75rem;color:rgb(var(--kompendium-contrast-1100))}:host{display:block;margin:0;padding:0}main{padding:1.25rem 2rem;margin-left:var(--width-nav-panel)}main kompendium-guide{display:block;width:100%;max-width:60rem}@media (max-width: 1000px){main{padding-top:2.625rem;margin-left:0}}";

const App = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    /**
     * Path to `kompendium.json`
     */
    this.path = '/kompendium.json';
    this.onMessage = this.onMessage.bind(this);
  }
  componentWillLoad() {
    this.createWebSocket();
    this.fetchData();
  }
  watchData() {
    const options = {
      includeScore: true,
      includeMatches: true,
      ignoreLocation: true,
      threshold: 0.4,
    };
    const index = Fuse.parseIndex(this.data.index.data);
    this.index = new Fuse(this.data.index.documents, options, index);
  }
  createWebSocket() {
    if (this.socket) {
      return;
    }
    const url = getSocketUrl(location);
    this.socket = new WebSocket(url);
    this.socket.addEventListener('message', this.onMessage);
  }
  onMessage(event) {
    var _a;
    try {
      const data = JSON.parse(event.data);
      if (((_a = data.buildLog) === null || _a === void 0 ? void 0 : _a.progress) === 1) {
        this.fetchData();
      }
    }
    catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }
  async fetchData() {
    const data = await fetch(this.path);
    this.data = await data.json();
    const typeNames = this.data.types.map((type) => type.name);
    markdownTypes.setTypes(typeNames);
  }
  render() {
    if (!this.data) {
      return (index.h("div", { class: "loading-screen" }, index.h("div", { class: "loading-screen-icon" }), index.h("div", { class: "loading-screen-text" }, "Loading...")));
    }
    return (index.h("div", { class: "kompendium-body" }, index.h("kompendium-navigation", { menu: this.data.menu, header: this.data.title, logo: this.data.logo, index: this.index }), index.h("main", { role: "main" }, index.h("stencil-router", { historyType: "hash" }, index.h("stencil-route-switch", { scrollTopOffset: 0 }, index.h("stencil-route", { url: "/", component: "kompendium-markdown", componentProps: {
        text: this.data.readme,
      }, exact: true }), index.h("stencil-route", { url: "/component/:name/:section?", component: "kompendium-component", componentProps: {
        docs: this.data.docs,
        schemas: this.data.schemas,
        examplePropsFactory: this.examplePropsFactory,
      } }), index.h("stencil-route", { url: "/type/:name", component: "kompendium-type", componentProps: {
        types: this.data.types,
      } }), index.h("stencil-route", { url: "/debug/:name", component: "kompendium-debug", componentProps: {
        docs: this.data.docs,
        schemas: this.data.schemas,
      } }), index.h("stencil-route", { component: "kompendium-guide", componentProps: {
        data: this.data,
      } }))))));
  }
  static get watchers() { return {
    "data": ["watchData"]
  }; }
};
function getSocketUrl(location) {
  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${location.hostname}:${location.port}/`;
}
App.style = appCss;

const darkmodeSwitchCss = ":host{--toggle-size:1.25rem}:host *{box-sizing:border-box}.mode-toggle{margin:0.75rem;position:relative;width:var(--toggle-size);height:var(--toggle-size);transition:opacity 0.3s ease;opacity:0.7}.mode-toggle:hover{opacity:1}.mode-visualization{pointer-events:none;position:absolute;width:var(--toggle-size);height:var(--toggle-size)}.circle{transition:background-color 0.6s ease;border-radius:50%;width:var(--toggle-size);height:var(--toggle-size);overflow:hidden;display:flex;align-items:center;justify-content:center;transform:translate3d(0, 0, 0)}.circle:after{transition:transform 0.7s ease, background-color 0.4s ease;content:\"\";display:block;border-radius:50%;width:calc(var(--toggle-size) - 0.25rem);height:calc(var(--toggle-size) - 0.25rem)}.ray{transition:opacity 0.6s ease, transform 0.6s cubic-bezier(0.37, -0.03, 0.4, 1.18);position:absolute;top:0;left:0;width:var(--toggle-size);height:var(--toggle-size)}.ray:before,.ray:after{content:\"\";display:block;height:0.375rem;width:0.125rem;border-radius:var(--toggle-size);background-color:rgba(var(--kompendium-color-orange-light), 1);position:absolute;left:0;right:0;margin:auto}.ray:before{top:-0.5rem}.ray:after{bottom:-0.5rem}.ray.three:before,.ray.three:after,.ray.four:before,.ray.four:after{height:0.25rem}input[type=checkbox]{-webkit-appearance:none;position:absolute;width:100%;height:100%;margin:0;cursor:pointer;border-radius:0.125rem}input[type=checkbox]:focus{outline:none}input[type=checkbox]:focus-visible{outline:none;box-shadow:var(--kompendium-shadow-depth-8-focused)}input[type=checkbox]:not(:checked)+.mode-visualization .circle{background-color:rgba(var(--kompendium-color-orange-default), 1);box-shadow:0 0 0.5rem 0.125rem rgba(var(--kompendium-color-orange-light), 0.8), 0 0 0.25rem 0.1875rem rgb(var(--kompendium-color-white))}input[type=checkbox]:not(:checked)+.mode-visualization .circle:after{background-color:rgba(var(--kompendium-color-orange-default), 1);transform:translate3d(1rem, -1rem, 0)}input[type=checkbox]:not(:checked)+.mode-visualization .ray{opacity:0.6}input[type=checkbox]:not(:checked)+.mode-visualization .ray.three,input[type=checkbox]:not(:checked)+.mode-visualization .ray.four{opacity:0.4}input[type=checkbox]:not(:checked)+.mode-visualization .ray.one{transform:rotate(0deg) scale(1)}input[type=checkbox]:not(:checked)+.mode-visualization .ray.two{transform:rotate(90deg) scale(1)}input[type=checkbox]:not(:checked)+.mode-visualization .ray.three{transform:rotate(45deg) scale(1)}input[type=checkbox]:not(:checked)+.mode-visualization .ray.four{transform:rotate(-45deg) scale(1)}input[type=checkbox]:checked+.mode-visualization .circle{background-color:rgba(var(--kompendium-contrast-1700), 0.7);box-shadow:0 0 0.5rem 0.125rem rgba(var(--kompendium-color-white), 0.4), 0 0 0.25rem 0.125rem rgb(var(--kompendium-color-black))}input[type=checkbox]:checked+.mode-visualization .circle:after{transform:translate3d(0.25rem, -0.25rem, 0);background-color:rgb(var(--kompendium-contrast-400))}input[type=checkbox]:checked+.mode-visualization .ray{opacity:0}input[type=checkbox]:checked+.mode-visualization .ray.one{transform:rotate(60deg) scale(0.5)}input[type=checkbox]:checked+.mode-visualization .ray.two{transform:rotate(150deg) scale(0.5)}input[type=checkbox]:checked+.mode-visualization .ray.three{transform:rotate(105deg) scale(0.5)}input[type=checkbox]:checked+.mode-visualization .ray.four{transform:rotate(15deg) scale(0.5)}";

const DEFAULT = 'system-default';
const LIGHT = 'force-light';
const DARK = 'force-dark';
const CHECKBOX_LIGHT = false;
const CHECKBOX_DARK = true;
const LOCALSTORAGE_KEY = 'kompendium-theme';
const DarkmodeSwitch = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.theme = 'system-default';
    this.getSelectRef = (element) => {
      this.checkbox = element;
    };
    this.handleSystemThemeChange = (e) => {
      this.systemSettingIsDark = !!e.matches;
      if (this.theme === DEFAULT) {
        this.checkbox.checked = !this.checkbox.checked;
      }
    };
    this.handleThemeChange = () => {
      const checkboxValue = !!this.checkbox.checked;
      let newTheme = DEFAULT;
      if (this.systemSettingIsDark) {
        if (checkboxValue === CHECKBOX_LIGHT) {
          newTheme = LIGHT;
        }
      }
      else {
        if (checkboxValue === CHECKBOX_DARK) {
          newTheme = DARK;
        }
      }
      this.setTheme(newTheme);
      document.dispatchEvent(new CustomEvent(types.THEME_EVENT_NAME, { detail: newTheme }));
    };
    this.setTheme = (value) => {
      this.theme = value;
      document.querySelector('html').dataset.theme = value;
      localStorage.setItem(LOCALSTORAGE_KEY, value);
    };
    const colorSchemeMediaQueryFallback = {
      addEventListener: () => { },
      matches: false,
    };
    this.colorSchemeMediaQuery =
      (window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)')) ||
        colorSchemeMediaQueryFallback;
  }
  connectedCallback() {
    this.colorSchemeMediaQuery.addEventListener('change', this.handleSystemThemeChange);
  }
  disconnectedCallback() {
    this.colorSchemeMediaQuery.removeEventListener('change', this.handleSystemThemeChange);
  }
  componentWillLoad() {
    this.systemSettingIsDark = this.colorSchemeMediaQuery.matches;
    this.setTheme((localStorage.getItem(LOCALSTORAGE_KEY) || DEFAULT));
  }
  render() {
    const props = {
      checked: this.theme === DARK ||
        (this.theme === DEFAULT && this.systemSettingIsDark),
    };
    return (index.h("div", { class: "mode-toggle" }, index.h("input", Object.assign({ type: "checkbox", onChange: this.handleThemeChange, ref: this.getSelectRef }, props)), index.h("div", { class: "mode-visualization" }, index.h("div", { class: "circle" }), index.h("div", { class: "ray one" }), index.h("div", { class: "ray two" }), index.h("div", { class: "ray three" }), index.h("div", { class: "ray four" }))));
  }
};
DarkmodeSwitch.style = darkmodeSwitchCss;

const navigationCss = "*,*::before,*::after{box-sizing:border-box}ul[class],ol[class]{padding:0}body,h1,h2,h3,h4,p,ul[class],ol[class],li,figure,figcaption,blockquote,dl,dd{margin:0}ul[class],ol[class]{list-style:none}a:not([class]){text-decoration-skip-ink:auto}img{max-width:100%}input,button,textarea,select{font:inherit}@media (prefers-reduced-motion: reduce){*{animation-duration:0.01ms !important;animation-iteration-count:1 !important;transition-duration:0.01ms !important;scroll-behavior:auto !important}}:root{--width-nav-panel:16rem}:host{display:block;font-family:var(--kompendium-font-primary);--size-show-nav-panel-button:2.25rem}header a{text-decoration:none;color:unset}.nav-panel-scrim{display:none;z-index:99;position:fixed;top:0;right:0;bottom:0;left:0}.nav-panel{transition:transform 0.44s cubic-bezier(1, 0.12, 0.2, 0.88), background-color 0.3s ease;width:var(--width-nav-panel);height:100vh;position:fixed;background-color:rgb(var(--kompendium-contrast-400));display:flex;flex-direction:column}.nav-panel .panel-header{transition:border 0.3s ease;flex-direction:row;padding:1rem;border-bottom:1px solid rgb(var(--kompendium-contrast-600));margin-bottom:0.5rem}.nav-panel .panel-list{overflow-y:auto}.nav-panel .panel-list:not(.chapters){padding:0 0.75rem 2rem 0.75rem}.nav-panel.display-nav-panel{z-index:100}.branding-and-mode{display:flex;align-items:center;margin-bottom:0.75rem}.branding-and-mode h1{all:unset;font-size:1rem;font-weight:normal;color:rgb(var(--kompendium-contrast-900));flex-grow:1;line-height:1}.branding-and-mode a{border-radius:0.125rem}.branding-and-mode a:focus{outline:none}.branding-and-mode a:focus-visible{outline:none;box-shadow:var(--kompendium-shadow-depth-8-focused)}.branding-and-mode kompendium-darkmode-switch{position:relative;flex-shrink:0;margin-left:0.75rem;padding-left:0.5rem}.branding-and-mode kompendium-darkmode-switch:before{transition:background-color 0.3s ease;content:\"\";position:absolute;background-color:rgb(var(--kompendium-contrast-600));border-radius:0.5rem;height:1.25rem;width:0.125rem;left:0.0625rem;top:0;bottom:0;margin:auto}.powered-by{position:absolute;bottom:0;left:0;font-size:0.75rem;padding:0.5rem 0.75rem;background-color:rgba(var(--kompendium-contrast-100), 0.4);backdrop-filter:blur(0.25rem);width:100%}.powered-by p{padding-left:1.75rem;background-image:url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 148 80\" xmlns=\"http://www.w3.org/2000/svg\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" stroke-linejoin=\"round\" stroke-miterlimit=\"2\"><path fill=\"none\" d=\"M-.003 0h148v80h-148z\"/><path d=\"M148.008 20c0-11.038-8.96-20-19.999-20H19.977c-11.038 0-20 8.962-20 20v40c0 11.038 8.962 20 20 20H128.01c11.038 0 20-8.962 20-20V20z\" fill=\"rgb(36,71,88)\"/><path d=\"M26.564 43.651v14.604H19.26V43.65h7.304zm0-7.302H19.26V21.745h7.304V36.35z\" fill=\"rgb(255,160,0)\"/><path d=\"M106.82 58.254v-7.303h7.304V43.65h7.304v-7.301h-7.304v-7.303h-7.304v-7.302h7.304v7.302h7.304v7.303h7.293v7.301h-7.293v7.302h-7.304v7.303h-7.304zm-43.812 0v-7.303h7.304V43.65h7.304v-7.301h7.303v-7.303h7.293v-7.302h7.304v7.302h-7.304v7.303H84.92v7.301h-7.303v7.302h-7.304v7.303h-7.304zm-14.597 0v-7.303h-7.304V43.65h-7.304v-7.301h7.304v-7.303h7.304v-7.302h7.293v7.302H48.41v7.303h-7.304v7.301h7.304v7.302h7.293v7.303H48.41z\" fill=\"rgb(0,200,82)\"/></svg>');background-position:left center;background-repeat:no-repeat;background-size:1.5rem}.powered-by a{transition:color 0.2s ease;color:rgb(var(--kompendium-color-blue-default));text-decoration:none}.powered-by a:hover{color:rgb(var(--kompendium-color-blue-light))}.nav-panel__responsive-menu{transition:background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease-out;box-shadow:var(--kompendium-button-shadow-normal);transition:all 0.2s ease;display:none;cursor:pointer;position:absolute;top:0.75rem;right:calc((var(--size-show-nav-panel-button) * -1) - 1rem);width:var(--size-show-nav-panel-button);height:var(--size-show-nav-panel-button);margin:0.25rem;border-radius:50%;text-align:center;font-weight:bold;background-color:rgba(var(--kompendium-contrast-200), 0.7);backdrop-filter:blur(0.25rem);color:rgb(var(--kompendium-contrast-900))}.nav-panel__responsive-menu:hover{box-shadow:var(--kompendium-button-shadow-hovered)}.nav-panel__responsive-menu:active{box-shadow:var(--kompendium-button-shadow-pressed);transform:translate3d(0, 0.08rem, 0)}.nav-panel__responsive-menu:focus{outline:none}.nav-panel__responsive-menu:focus-visible{outline:none;box-shadow:var(--kompendium-shadow-depth-8-focused)}.nav-panel__responsive-menu span{transition:background-color 0.2s ease, transform 0.2s ease 0.3s, opacity 0.15s ease 0.3s;display:block;position:absolute;left:0;right:0;margin:auto;height:0.125rem;width:1rem;border-radius:0.25rem;background-color:rgb(var(--kompendium-contrast-900))}.nav-panel__responsive-menu span:nth-child(1){top:0.75rem}.nav-panel__responsive-menu span:nth-child(2),.nav-panel__responsive-menu span:nth-child(3){top:0;bottom:0}.nav-panel__responsive-menu span:nth-child(4){bottom:0.75rem}.nav-panel__responsive-menu:hover span{background-color:rgb(var(--kompendium-contrast-1200))}@media (max-width: 1000px){.nav-panel-scrim.display-nav-panel{display:block}.nav-panel{transform:translate3d(calc(var(--width-nav-panel) * -1), 0, 0)}.nav-panel.display-nav-panel{transform:translate3d(0, 0, 0);box-shadow:0 0.09375rem 0.225rem 0 rgba(0, 0, 0, 0.232), 0 0.01875rem 0.05625rem 0 rgba(0, 0, 0, 0.208)}.nav-panel.display-nav-panel .nav-panel__responsive-menu{right:calc( (var(--size-show-nav-panel-button) * -1) - 0.3125rem );border-radius:0 0.5rem 0.5rem 0}.nav-panel.display-nav-panel .nav-panel__responsive-menu span:nth-child(1),.nav-panel.display-nav-panel .nav-panel__responsive-menu span:nth-child(4){transform:scaleX(0);opacity:0}.nav-panel.display-nav-panel .nav-panel__responsive-menu span:nth-child(2){transform:rotate(45deg)}.nav-panel.display-nav-panel .nav-panel__responsive-menu span:nth-child(3){transform:rotate(-45deg)}.nav-panel__responsive-menu{display:block}}.panel-item{transition:opacity 0.2s ease;width:100%;border-radius:0.375rem}.panel-item.active{background-color:rgb(var(--kompendium-contrast-100), 0.5)}.panel-link{display:grid;grid-auto-flow:column;grid-template-columns:1fr 1.75rem;line-height:1.75rem;color:rgb(var(--kompendium-contrast-900));text-decoration:none;border-radius:0.375rem}.panel-link:hover,.panel-link.active{color:rgb(var(--kompendium-color-blue-default))}.panel-link.active svg{transform:scale(0.64) rotate(-90deg)}.panel-link:focus{outline:none}.panel-link:focus-visible{outline:none;box-shadow:var(--kompendium-shadow-depth-8-focused)}.panel-link svg{visibility:hidden;transition:transform 0.2s ease;transform:scale(0.64) rotate(90deg);height:2rem}.panel-link.has-children svg{visibility:visible}.link-text{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;width:100%;padding-left:0.5rem}.chapters{height:0}.chapters>.panel-item{padding:0 0.5rem}.chapters:not(.active){visibility:hidden}.chapters.active{transition:height 0.2s ease;height:100%}.chapters.active .panel-item{opacity:1;transition-delay:0.2s}.chapters.active .panel-item:nth-child(1){transition-delay:0s}.chapters.active .panel-item:nth-child(2){transition-delay:0.04s}.chapters.active .panel-item:nth-child(3){transition-delay:0.06s}.chapters.active .panel-item:nth-child(4){transition-delay:0.08s}.chapters.active .panel-item:nth-child(5){transition-delay:0.1s}.chapters.active .panel-item:nth-child(6){transition-delay:0.12s}.chapters.active .panel-item:nth-child(7){transition-delay:0.14s}.chapters.active .panel-item:nth-child(8){transition-delay:0.15s}.chapters.active .panel-item:nth-child(9){transition-delay:0.16s}.chapters.active .panel-item:nth-child(10){transition-delay:0.17s}.chapters.active .panel-item:nth-child(11){transition-delay:0.18s}.chapters.active .panel-item:nth-child(12){transition-delay:0.19s}.chapters.active .panel-item:last-child{margin-bottom:0.5rem}.chapters .panel-link.has-children svg{visibility:hidden}.chapters .panel-item{opacity:0}.chapters .panel-item .chapters{font-size:0.8125rem;padding-left:0.5rem}.chapters .panel-item .chapters:first-child{margin-top:0.25rem}";

const Navigation = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.route = '';
    this.displayNavPanel = false;
    this.toggleMenu = () => {
      this.displayNavPanel = !this.displayNavPanel;
    };
    this.stopPropagationOfNavClick = (event) => {
      event.stopPropagation();
    };
    this.setRoute = this.setRoute.bind(this);
    this.renderMenuItem = this.renderMenuItem.bind(this);
  }
  connectedCallback() {
    window.addEventListener('hashchange', this.setRoute);
    this.setRoute();
  }
  disconnectedCallback() {
    window.removeEventListener('hashchange', this.setRoute);
  }
  setRoute() {
    this.route = location.hash.substr(1);
  }
  render() {
    return [
      index.h("div", { class: {
          'nav-panel-scrim': true,
          'display-nav-panel': this.displayNavPanel,
        }, onClick: this.toggleMenu }),
      index.h("nav", { class: {
          'nav-panel': true,
          'display-nav-panel': this.displayNavPanel,
        }, onClick: this.stopPropagationOfNavClick }, index.h("a", { class: "nav-panel__responsive-menu", onClick: this.toggleMenu }, index.h("span", null), index.h("span", null), index.h("span", null), index.h("span", null)), index.h("header", { class: "panel-header" }, index.h("div", { class: "branding-and-mode" }, index.h("h1", null, this.renderHeader()), index.h("kompendium-darkmode-switch", null)), index.h("kompendium-search", { index: this.index })), this.renderChapters(this.menu)),
    ];
  }
  renderHeader() {
    let content = this.header;
    if (this.logo) {
      content = index.h("img", { alt: this.header, src: this.logo });
    }
    return index.h("a", { href: "#" }, content);
  }
  renderChapters(menu) {
    if (!menu || !menu.length) {
      return;
    }
    return (index.h("ul", { class: "panel-list" }, menu.map(this.renderMenuItem), index.h("div", { class: "powered-by" }, index.h("p", null, "Powered by\u00A0", index.h("a", { href: "https://github.com/jgroth/kompendium" }, "Kompendium")))));
  }
  renderMenuItem(item) {
    const itemClassList = {
      active: this.isRouteActive(item.path),
      'panel-item': true,
    };
    const chapterClassList = {
      active: this.isRouteActive(item.path),
      chapters: true,
      'panel-list': true,
    };
    const chapters = item.children || [];
    const anchorClassList = {
      'panel-link': true,
      active: this.isRouteActive(item.path),
      'has-children': !!chapters.length,
    };
    const anchorAdditionalProps = {};
    if (!chapters.length) {
      anchorAdditionalProps.onClick = this.toggleMenu;
    }
    return (index.h("li", { class: itemClassList }, index.h("a", Object.assign({ class: anchorClassList, href: '#' + item.path }, anchorAdditionalProps), index.h("span", { class: "link-text" }, item.title), index.h("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", width: "24", height: "24" }, index.h("path", { fill: "none", d: "M0 0h24v24H0z" }), index.h("path", { id: "arrow", d: "M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z", fill: "currentColor" }))), index.h("ul", { class: chapterClassList }, chapters.map(this.renderMenuItem))));
  }
  isRouteActive(route) {
    return this.route.startsWith(route);
  }
};
Navigation.style = navigationCss;

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof _commonjsHelpers.commonjsGlobal == 'object' && _commonjsHelpers.commonjsGlobal && _commonjsHelpers.commonjsGlobal.Object === Object && _commonjsHelpers.commonjsGlobal;

var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')();

var _root = root;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return _root.Date.now();
};

var now_1 = now;

/** Used to match a single whitespace character. */
var reWhitespace = /\s/;

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
 * character of `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the index of the last non-whitespace character.
 */
function trimmedEndIndex(string) {
  var index = string.length;

  while (index-- && reWhitespace.test(string.charAt(index))) {}
  return index;
}

var _trimmedEndIndex = trimmedEndIndex;

/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;

/**
 * The base implementation of `_.trim`.
 *
 * @private
 * @param {string} string The string to trim.
 * @returns {string} Returns the trimmed string.
 */
function baseTrim(string) {
  return string
    ? string.slice(0, _trimmedEndIndex(string) + 1).replace(reTrimStart, '')
    : string;
}

var _baseTrim = baseTrim;

/** Built-in value references. */
var Symbol = _root.Symbol;

var _Symbol = Symbol;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto$1.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/** Built-in value references. */
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

var _getRawTag = getRawTag;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

var _objectToString = objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? _getRawTag(value)
    : _objectToString(value);
}

var _baseGetTag = baseGetTag;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike_1(value) && _baseGetTag(value) == symbolTag);
}

var isSymbol_1 = isSymbol;

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol_1(value)) {
    return NAN;
  }
  if (isObject_1(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject_1(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = _baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

var toNumber_1 = toNumber;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber_1(wait) || 0;
  if (isObject_1(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber_1(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now_1();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now_1());
  }

  function debounced() {
    var time = now_1(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

var debounce_1 = debounce;

const searchCss = "*,*::before,*::after{box-sizing:border-box}ul[class],ol[class]{padding:0}body,h1,h2,h3,h4,p,ul[class],ol[class],li,figure,figcaption,blockquote,dl,dd{margin:0}ul[class],ol[class]{list-style:none}a:not([class]){text-decoration-skip-ink:auto}img{max-width:100%}input,button,textarea,select{font:inherit}@media (prefers-reduced-motion: reduce){*{animation-duration:0.01ms !important;animation-iteration-count:1 !important;transition-duration:0.01ms !important;scroll-behavior:auto !important}}:host{display:block}:host(:focus) .result.has-results,:host(:focus-within) .result.has-results{display:block}@keyframes display-search-results{0%{opacity:0;transform:translate3d(0, -1.25rem, -1rem) rotateX(10deg)}50%{opacity:1}100%{transform:translate3d(0, 0, 0) rotateX(0)}}.search-box{z-index:1;display:flex;flex-direction:column;position:relative;perspective:60rem}.search-box .result.has-results{animation:display-search-results 0.28s ease-out forwards;position:absolute;background:rgb(var(--kompendium-contrast-200));padding:0.5rem;margin-top:2rem;width:100%;border-radius:5px;box-shadow:var(--kompendium-shadow-depth-16);display:none;max-height:calc(100vh - 6rem);overflow-y:auto}.search-box .result.has-results li a{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;transition:background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease-out;display:block;width:100%;padding:0.5rem 0.75rem;border-radius:0.25rem}.search-box .result.has-results li a:hover{box-shadow:var(--kompendium-button-shadow-hovered)}.search-box .result.has-results li a:active{box-shadow:var(--kompendium-button-shadow-pressed);transform:translate3d(0, 0.08rem, 0)}.search-box .result.has-results li a:focus{outline:none}.search-box .result.has-results li a:focus-visible{outline:none;box-shadow:var(--kompendium-shadow-depth-8-focused)}.search-box .result.has-results li:hover a{background:rgb(var(--kompendium-contrast-100))}input{transition:background-color 0.2s ease;border:0;border-radius:0.25rem;padding:0 0.25rem 0 2.25rem;color:rgb(var(--kompendium-contrast-1200));height:2rem;line-height:2rem;-webkit-appearance:textfield;background-color:rgb(var(--kompendium-contrast-300));background-image:url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" fill-rule=\"evenodd\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-miterlimit=\"1.5\" clip-rule=\"evenodd\" viewBox=\"0 0 400 400\"><defs/><path fill=\"none\" d=\"M0 0h400v400H0z\"/><path d=\"M275.621 258.31l-16.962 16.979 50.965 50.964.008.009c4.637 4.637 12.268 4.637 16.905 0l.032-.033c4.687-4.687 4.642-12.33.025-16.946l-50.964-50.965-.009-.008z\" fill=\"rgb(48,48,66)\"/><circle cx=\"200\" cy=\"200\" r=\"99.5\" fill=\"rgb(33,150,243)\" fill-opacity=\".3\" stroke=\"rgb(48,48,66)\" stroke-width=\"13.27\" transform=\"translate(19.096 19.096) scale(.90452)\"/><ellipse cx=\"163.443\" cy=\"186.777\" rx=\"32.324\" ry=\"22.133\" fill=\"rgb(255,255,255)\" fill-opacity=\".3\" transform=\"rotate(-45 128.405 173.5)\"/></svg>');background-repeat:no-repeat;background-position:left center}input::placeholder{color:rgb(var(--kompendium-contrast-800))}input:active,input:focus,input:hover{background-color:rgb(var(--kompendium-contrast-200))}input:focus{outline:none}input::-webkit-search-cancel-button{-webkit-appearance:none;transition:background-color 0.2s ease;height:1.25rem;width:1.25rem;border-radius:50%;cursor:pointer;background-color:rgb(var(--kompendium-contrast-800));background-repeat:no-repeat;background-position:center;background-size:0.75rem;background-image:url(\"data:image/svg+xml; utf8, <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><defs/><path fill='rgb(255,255,255)' d='M7.219 5.781L5.78 7.22 14.563 16 5.78 24.781 7.22 26.22 16 17.437l8.781 8.782 1.438-1.438L17.437 16l8.782-8.781L24.78 5.78 16 14.563z'/></svg>\")}input::-webkit-search-cancel-button:hover{background-color:rgb(var(--kompendium-contrast-1000))}a{text-decoration:none;color:unset}a:hover,a.active{color:rgb(var(--kompendium-color-blue-default))}";

const Search = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.documents = [];
    this.renderDocument = (document) => {
      return (index.h("li", null, index.h("a", { href: '#' + document.path, onClick: this.handleLinkClick }, index.h("span", { class: "link-text" }, document.title))));
    };
    this.handleChangeInput = (event) => {
      const query = event.target.value;
      this.search(query);
    };
    this.handleLinkClick = () => {
      var _a;
      (_a = this.host.shadowRoot.activeElement) === null || _a === void 0 ? void 0 : _a.blur();
    };
    this.search = debounce_1(this.search, 300);
  }
  componentDidLoad() {
    this.host.shadowRoot.querySelector('input').focus();
  }
  render() {
    const classList = {
      result: true,
      'has-results': this.documents.length > 0,
    };
    return (index.h("div", { class: "search-box" }, index.h("input", { type: "search", autoFocus: true, placeholder: "Search", onInput: this.handleChangeInput }), index.h("ul", { class: classList }, this.documents.map(this.renderDocument))));
  }
  search(query) {
    const index = this.index;
    const result = index.search(query);
    this.documents = result.map((doc) => doc.item).slice(0, 10);
  }
  get host() { return index.getElement(this); }
};
Search.style = searchCss;

const routeCss = "stencil-route.inactive{display:none}";

const Route = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.group = null;
    this.match = null;
    this.componentProps = {};
    this.exact = false;
    this.scrollOnNextRender = false;
    this.previousMatch = null;
  }
  // Identify if the current route is a match.
  computeMatch(newLocation) {
    const isGrouped = this.group != null || (this.el.parentElement != null && this.el.parentElement.tagName.toLowerCase() === 'stencil-route-switch');
    if (!newLocation || isGrouped) {
      return;
    }
    this.previousMatch = this.match;
    return this.match = domUtils.matchPath(newLocation.pathname, {
      path: this.url,
      exact: this.exact,
      strict: true
    });
  }
  async loadCompleted() {
    let routeViewOptions = {};
    if (this.history && this.history.location.hash) {
      routeViewOptions = {
        scrollToId: this.history.location.hash.substr(1)
      };
    }
    else if (this.scrollTopOffset) {
      routeViewOptions = {
        scrollTopOffset: this.scrollTopOffset
      };
    }
    // After all children have completed then tell switch
    // the provided callback will get executed after this route is in view
    if (typeof this.componentUpdated === 'function') {
      this.componentUpdated(routeViewOptions);
      // If this is an independent route and it matches then routes have updated.
      // If the only change to location is a hash change then do not scroll.
    }
    else if (this.match && !domUtils.matchesAreEqual(this.match, this.previousMatch) && this.routeViewsUpdated) {
      this.routeViewsUpdated(routeViewOptions);
    }
  }
  async componentDidUpdate() {
    await this.loadCompleted();
  }
  async componentDidLoad() {
    await this.loadCompleted();
  }
  render() {
    // If there is no activeRouter then do not render
    // Check if this route is in the matching URL (for example, a parent route)
    if (!this.match || !this.history) {
      return null;
    }
    // component props defined in route
    // the history api
    // current match data including params
    const childProps = Object.assign({}, this.componentProps, { history: this.history, match: this.match });
    // If there is a routerRender defined then use
    // that and pass the component and component props with it.
    if (this.routeRender) {
      return this.routeRender(Object.assign({}, childProps, { component: this.component }));
    }
    if (this.component) {
      const ChildComponent = this.component;
      return (index.h(ChildComponent, Object.assign({}, childProps)));
    }
  }
  get el() { return index.getElement(this); }
  static get watchers() { return {
    "location": ["computeMatch"]
  }; }
};
activeRouter.ActiveRouter.injectProps(Route, [
  'location',
  'history',
  'historyType',
  'routeViewsUpdated'
]);
Route.style = routeCss;

const getUniqueId = () => {
  return ((Math.random() * 10e16).toString().match(/.{4}/g) || []).join('-');
};
const getMatch = (pathname, url, exact) => {
  return domUtils.matchPath(pathname, {
    path: url,
    exact: exact,
    strict: true
  });
};
const isHTMLStencilRouteElement = (elm) => {
  return elm.tagName === 'STENCIL-ROUTE';
};
const RouteSwitch = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.group = getUniqueId();
    this.subscribers = [];
    this.queue = index.getContext(this, "queue");
  }
  componentWillLoad() {
    if (this.location != null) {
      this.regenerateSubscribers(this.location);
    }
  }
  async regenerateSubscribers(newLocation) {
    if (newLocation == null) {
      return;
    }
    let newActiveIndex = -1;
    this.subscribers = Array.prototype.slice.call(this.el.children)
      .filter(isHTMLStencilRouteElement)
      .map((childElement, index) => {
      const match = getMatch(newLocation.pathname, childElement.url, childElement.exact);
      if (match && newActiveIndex === -1) {
        newActiveIndex = index;
      }
      return {
        el: childElement,
        match: match
      };
    });
    if (newActiveIndex === -1) {
      return;
    }
    // Check if this actually changes which child is active
    // then just pass the new match down if the active route isn't changing.
    if (this.activeIndex === newActiveIndex) {
      this.subscribers[newActiveIndex].el.match = this.subscribers[newActiveIndex].match;
      return;
    }
    this.activeIndex = newActiveIndex;
    // Set all props on the new active route then wait until it says that it
    // is completed
    const activeChild = this.subscribers[this.activeIndex];
    if (this.scrollTopOffset) {
      activeChild.el.scrollTopOffset = this.scrollTopOffset;
    }
    activeChild.el.group = this.group;
    activeChild.el.match = activeChild.match;
    activeChild.el.componentUpdated = (routeViewUpdatedOptions) => {
      // After the new active route has completed then update visibility of routes
      this.queue.write(() => {
        this.subscribers.forEach((child, index) => {
          child.el.componentUpdated = undefined;
          if (index === this.activeIndex) {
            return child.el.style.display = '';
          }
          if (this.scrollTopOffset) {
            child.el.scrollTopOffset = this.scrollTopOffset;
          }
          child.el.group = this.group;
          child.el.match = null;
          child.el.style.display = 'none';
        });
      });
      if (this.routeViewsUpdated) {
        this.routeViewsUpdated(Object.assign({ scrollTopOffset: this.scrollTopOffset }, routeViewUpdatedOptions));
      }
    };
  }
  render() {
    return (index.h("slot", null));
  }
  get el() { return index.getElement(this); }
  static get watchers() { return {
    "location": ["regenerateSubscribers"]
  }; }
};
activeRouter.ActiveRouter.injectProps(RouteSwitch, [
  'location',
  'routeViewsUpdated'
]);

const warning = (value, ...args) => {
    if (!value) {
        console.warn(...args);
    }
};

// Adapted from the https://github.com/ReactTraining/history and converted to TypeScript
const createTransitionManager = () => {
    let prompt;
    let listeners = [];
    const setPrompt = (nextPrompt) => {
        warning(prompt == null, 'A history supports only one prompt at a time');
        prompt = nextPrompt;
        return () => {
            if (prompt === nextPrompt) {
                prompt = null;
            }
        };
    };
    const confirmTransitionTo = (location, action, getUserConfirmation, callback) => {
        // TODO: If another transition starts while we're still confirming
        // the previous one, we may end up in a weird state. Figure out the
        // best way to handle this.
        if (prompt != null) {
            const result = typeof prompt === 'function' ? prompt(location, action) : prompt;
            if (typeof result === 'string') {
                if (typeof getUserConfirmation === 'function') {
                    getUserConfirmation(result, callback);
                }
                else {
                    warning(false, 'A history needs a getUserConfirmation function in order to use a prompt message');
                    callback(true);
                }
            }
            else {
                // Return false from a transition hook to cancel the transition.
                callback(result !== false);
            }
        }
        else {
            callback(true);
        }
    };
    const appendListener = (fn) => {
        let isActive = true;
        const listener = (...args) => {
            if (isActive) {
                fn(...args);
            }
        };
        listeners.push(listener);
        return () => {
            isActive = false;
            listeners = listeners.filter(item => item !== listener);
        };
    };
    const notifyListeners = (...args) => {
        listeners.forEach(listener => listener(...args));
    };
    return {
        setPrompt,
        confirmTransitionTo,
        appendListener,
        notifyListeners
    };
};

const createScrollHistory = (win, applicationScrollKey = 'scrollPositions') => {
    let scrollPositions = new Map();
    const set = (key, value) => {
        scrollPositions.set(key, value);
        if (domUtils.storageAvailable(win, 'sessionStorage')) {
            const arrayData = [];
            scrollPositions.forEach((value, key) => {
                arrayData.push([key, value]);
            });
            win.sessionStorage.setItem('scrollPositions', JSON.stringify(arrayData));
        }
    };
    const get = (key) => {
        return scrollPositions.get(key);
    };
    const has = (key) => {
        return scrollPositions.has(key);
    };
    const capture = (key) => {
        set(key, [win.scrollX, win.scrollY]);
    };
    if (domUtils.storageAvailable(win, 'sessionStorage')) {
        const scrollData = win.sessionStorage.getItem(applicationScrollKey);
        scrollPositions = scrollData ?
            new Map(JSON.parse(scrollData)) :
            scrollPositions;
    }
    if ('scrollRestoration' in win.history) {
        history.scrollRestoration = 'manual';
    }
    return {
        set,
        get,
        has,
        capture
    };
};

// Adapted from the https://github.com/ReactTraining/history and converted to TypeScript
const PopStateEvent = 'popstate';
const HashChangeEvent$1 = 'hashchange';
/**
 * Creates a history object that uses the HTML5 history API including
 * pushState, replaceState, and the popstate event.
 */
const createBrowserHistory = (win, props = {}) => {
    let forceNextPop = false;
    const globalHistory = win.history;
    const globalLocation = win.location;
    const globalNavigator = win.navigator;
    const canUseHistory = domUtils.supportsHistory(win);
    const needsHashChangeListener = !domUtils.supportsPopStateOnHashChange(globalNavigator);
    const scrollHistory = createScrollHistory(win);
    const forceRefresh = (props.forceRefresh != null) ? props.forceRefresh : false;
    const getUserConfirmation = (props.getUserConfirmation != null) ? props.getUserConfirmation : domUtils.getConfirmation;
    const keyLength = (props.keyLength != null) ? props.keyLength : 6;
    const basename = props.basename ? domUtils.stripTrailingSlash(domUtils.addLeadingSlash(props.basename)) : '';
    const getHistoryState = () => {
        try {
            return win.history.state || {};
        }
        catch (e) {
            // IE 11 sometimes throws when accessing window.history.state
            // See https://github.com/ReactTraining/history/pull/289
            return {};
        }
    };
    const getDOMLocation = (historyState) => {
        historyState = historyState || {};
        const { key, state } = historyState;
        const { pathname, search, hash } = globalLocation;
        let path = pathname + search + hash;
        warning((!basename || domUtils.hasBasename(path, basename)), 'You are attempting to use a basename on a page whose URL path does not begin ' +
            'with the basename. Expected path "' + path + '" to begin with "' + basename + '".');
        if (basename) {
            path = domUtils.stripBasename(path, basename);
        }
        return domUtils.createLocation(path, state, key || domUtils.createKey(keyLength));
    };
    const transitionManager = createTransitionManager();
    const setState = (nextState) => {
        // Capture location for the view before changing history.
        scrollHistory.capture(history.location.key);
        Object.assign(history, nextState);
        // Set scroll position based on its previous storage value
        history.location.scrollPosition = scrollHistory.get(history.location.key);
        history.length = globalHistory.length;
        transitionManager.notifyListeners(history.location, history.action);
    };
    const handlePopState = (event) => {
        // Ignore extraneous popstate events in WebKit.
        if (!domUtils.isExtraneousPopstateEvent(globalNavigator, event)) {
            handlePop(getDOMLocation(event.state));
        }
    };
    const handleHashChange = () => {
        handlePop(getDOMLocation(getHistoryState()));
    };
    const handlePop = (location) => {
        if (forceNextPop) {
            forceNextPop = false;
            setState();
        }
        else {
            const action = 'POP';
            transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
                if (ok) {
                    setState({ action, location });
                }
                else {
                    revertPop(location);
                }
            });
        }
    };
    const revertPop = (fromLocation) => {
        const toLocation = history.location;
        // TODO: We could probably make this more reliable by
        // keeping a list of keys we've seen in sessionStorage.
        // Instead, we just default to 0 for keys we don't know.
        let toIndex = allKeys.indexOf(toLocation.key);
        let fromIndex = allKeys.indexOf(fromLocation.key);
        if (toIndex === -1) {
            toIndex = 0;
        }
        if (fromIndex === -1) {
            fromIndex = 0;
        }
        const delta = toIndex - fromIndex;
        if (delta) {
            forceNextPop = true;
            go(delta);
        }
    };
    const initialLocation = getDOMLocation(getHistoryState());
    let allKeys = [initialLocation.key];
    let listenerCount = 0;
    let isBlocked = false;
    // Public interface
    const createHref = (location) => {
        return basename + domUtils.createPath(location);
    };
    const push = (path, state) => {
        warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to push when the 1st ' +
            'argument is a location-like object that already has state; it is ignored');
        const action = 'PUSH';
        const location = domUtils.createLocation(path, state, domUtils.createKey(keyLength), history.location);
        transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
            if (!ok) {
                return;
            }
            const href = createHref(location);
            const { key, state } = location;
            if (canUseHistory) {
                globalHistory.pushState({ key, state }, '', href);
                if (forceRefresh) {
                    globalLocation.href = href;
                }
                else {
                    const prevIndex = allKeys.indexOf(history.location.key);
                    const nextKeys = allKeys.slice(0, prevIndex === -1 ? 0 : prevIndex + 1);
                    nextKeys.push(location.key);
                    allKeys = nextKeys;
                    setState({ action, location });
                }
            }
            else {
                warning(state === undefined, 'Browser history cannot push state in browsers that do not support HTML5 history');
                globalLocation.href = href;
            }
        });
    };
    const replace = (path, state) => {
        warning(!(typeof path === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to replace when the 1st ' +
            'argument is a location-like object that already has state; it is ignored');
        const action = 'REPLACE';
        const location = domUtils.createLocation(path, state, domUtils.createKey(keyLength), history.location);
        transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
            if (!ok) {
                return;
            }
            const href = createHref(location);
            const { key, state } = location;
            if (canUseHistory) {
                globalHistory.replaceState({ key, state }, '', href);
                if (forceRefresh) {
                    globalLocation.replace(href);
                }
                else {
                    const prevIndex = allKeys.indexOf(history.location.key);
                    if (prevIndex !== -1) {
                        allKeys[prevIndex] = location.key;
                    }
                    setState({ action, location });
                }
            }
            else {
                warning(state === undefined, 'Browser history cannot replace state in browsers that do not support HTML5 history');
                globalLocation.replace(href);
            }
        });
    };
    const go = (n) => {
        globalHistory.go(n);
    };
    const goBack = () => go(-1);
    const goForward = () => go(1);
    const checkDOMListeners = (delta) => {
        listenerCount += delta;
        if (listenerCount === 1) {
            win.addEventListener(PopStateEvent, handlePopState);
            if (needsHashChangeListener) {
                win.addEventListener(HashChangeEvent$1, handleHashChange);
            }
        }
        else if (listenerCount === 0) {
            win.removeEventListener(PopStateEvent, handlePopState);
            if (needsHashChangeListener) {
                win.removeEventListener(HashChangeEvent$1, handleHashChange);
            }
        }
    };
    const block = (prompt = '') => {
        const unblock = transitionManager.setPrompt(prompt);
        if (!isBlocked) {
            checkDOMListeners(1);
            isBlocked = true;
        }
        return () => {
            if (isBlocked) {
                isBlocked = false;
                checkDOMListeners(-1);
            }
            return unblock();
        };
    };
    const listen = (listener) => {
        const unlisten = transitionManager.appendListener(listener);
        checkDOMListeners(1);
        return () => {
            checkDOMListeners(-1);
            unlisten();
        };
    };
    const history = {
        length: globalHistory.length,
        action: 'POP',
        location: initialLocation,
        createHref,
        push,
        replace,
        go,
        goBack,
        goForward,
        block,
        listen,
        win: win
    };
    return history;
};

// Adapted from the https://github.com/ReactTraining/history and converted to TypeScript
const HashChangeEvent = 'hashchange';
const HashPathCoders = {
    hashbang: {
        encodePath: (path) => path.charAt(0) === '!' ? path : '!/' + domUtils.stripLeadingSlash(path),
        decodePath: (path) => path.charAt(0) === '!' ? path.substr(1) : path
    },
    noslash: {
        encodePath: domUtils.stripLeadingSlash,
        decodePath: domUtils.addLeadingSlash
    },
    slash: {
        encodePath: domUtils.addLeadingSlash,
        decodePath: domUtils.addLeadingSlash
    }
};
const createHashHistory = (win, props = {}) => {
    let forceNextPop = false;
    let ignorePath = null;
    let listenerCount = 0;
    let isBlocked = false;
    const globalLocation = win.location;
    const globalHistory = win.history;
    const canGoWithoutReload = domUtils.supportsGoWithoutReloadUsingHash(win.navigator);
    const keyLength = (props.keyLength != null) ? props.keyLength : 6;
    const { getUserConfirmation = domUtils.getConfirmation, hashType = 'slash' } = props;
    const basename = props.basename ? domUtils.stripTrailingSlash(domUtils.addLeadingSlash(props.basename)) : '';
    const { encodePath, decodePath } = HashPathCoders[hashType];
    const getHashPath = () => {
        // We can't use window.location.hash here because it's not
        // consistent across browsers - Firefox will pre-decode it!
        const href = globalLocation.href;
        const hashIndex = href.indexOf('#');
        return hashIndex === -1 ? '' : href.substring(hashIndex + 1);
    };
    const pushHashPath = (path) => (globalLocation.hash = path);
    const replaceHashPath = (path) => {
        const hashIndex = globalLocation.href.indexOf('#');
        globalLocation.replace(globalLocation.href.slice(0, hashIndex >= 0 ? hashIndex : 0) + '#' + path);
    };
    const getDOMLocation = () => {
        let path = decodePath(getHashPath());
        warning((!basename || domUtils.hasBasename(path, basename)), 'You are attempting to use a basename on a page whose URL path does not begin ' +
            'with the basename. Expected path "' + path + '" to begin with "' + basename + '".');
        if (basename) {
            path = domUtils.stripBasename(path, basename);
        }
        return domUtils.createLocation(path, undefined, domUtils.createKey(keyLength));
    };
    const transitionManager = createTransitionManager();
    const setState = (nextState) => {
        Object.assign(history, nextState);
        history.length = globalHistory.length;
        transitionManager.notifyListeners(history.location, history.action);
    };
    const handleHashChange = () => {
        const path = getHashPath();
        const encodedPath = encodePath(path);
        if (path !== encodedPath) {
            // Ensure we always have a properly-encoded hash.
            replaceHashPath(encodedPath);
        }
        else {
            const location = getDOMLocation();
            const prevLocation = history.location;
            if (!forceNextPop && domUtils.locationsAreEqual(prevLocation, location)) {
                return; // A hashchange doesn't always == location change.
            }
            if (ignorePath === domUtils.createPath(location)) {
                return; // Ignore this change; we already setState in push/replace.
            }
            ignorePath = null;
            handlePop(location);
        }
    };
    const handlePop = (location) => {
        if (forceNextPop) {
            forceNextPop = false;
            setState();
        }
        else {
            const action = 'POP';
            transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
                if (ok) {
                    setState({ action, location });
                }
                else {
                    revertPop(location);
                }
            });
        }
    };
    const revertPop = (fromLocation) => {
        const toLocation = history.location;
        // TODO: We could probably make this more reliable by
        // keeping a list of paths we've seen in sessionStorage.
        // Instead, we just default to 0 for paths we don't know.
        let toIndex = allPaths.lastIndexOf(domUtils.createPath(toLocation));
        let fromIndex = allPaths.lastIndexOf(domUtils.createPath(fromLocation));
        if (toIndex === -1) {
            toIndex = 0;
        }
        if (fromIndex === -1) {
            fromIndex = 0;
        }
        const delta = toIndex - fromIndex;
        if (delta) {
            forceNextPop = true;
            go(delta);
        }
    };
    // Ensure the hash is encoded properly before doing anything else.
    const path = getHashPath();
    const encodedPath = encodePath(path);
    if (path !== encodedPath) {
        replaceHashPath(encodedPath);
    }
    const initialLocation = getDOMLocation();
    let allPaths = [domUtils.createPath(initialLocation)];
    // Public interface
    const createHref = (location) => ('#' + encodePath(basename + domUtils.createPath(location)));
    const push = (path, state) => {
        warning(state === undefined, 'Hash history cannot push state; it is ignored');
        const action = 'PUSH';
        const location = domUtils.createLocation(path, undefined, domUtils.createKey(keyLength), history.location);
        transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
            if (!ok) {
                return;
            }
            const path = domUtils.createPath(location);
            const encodedPath = encodePath(basename + path);
            const hashChanged = getHashPath() !== encodedPath;
            if (hashChanged) {
                // We cannot tell if a hashchange was caused by a PUSH, so we'd
                // rather setState here and ignore the hashchange. The caveat here
                // is that other hash histories in the page will consider it a POP.
                ignorePath = path;
                pushHashPath(encodedPath);
                const prevIndex = allPaths.lastIndexOf(domUtils.createPath(history.location));
                const nextPaths = allPaths.slice(0, prevIndex === -1 ? 0 : prevIndex + 1);
                nextPaths.push(path);
                allPaths = nextPaths;
                setState({ action, location });
            }
            else {
                warning(false, 'Hash history cannot PUSH the same path; a new entry will not be added to the history stack');
                setState();
            }
        });
    };
    const replace = (path, state) => {
        warning(state === undefined, 'Hash history cannot replace state; it is ignored');
        const action = 'REPLACE';
        const location = domUtils.createLocation(path, undefined, domUtils.createKey(keyLength), history.location);
        transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
            if (!ok) {
                return;
            }
            const path = domUtils.createPath(location);
            const encodedPath = encodePath(basename + path);
            const hashChanged = getHashPath() !== encodedPath;
            if (hashChanged) {
                // We cannot tell if a hashchange was caused by a REPLACE, so we'd
                // rather setState here and ignore the hashchange. The caveat here
                // is that other hash histories in the page will consider it a POP.
                ignorePath = path;
                replaceHashPath(encodedPath);
            }
            const prevIndex = allPaths.indexOf(domUtils.createPath(history.location));
            if (prevIndex !== -1) {
                allPaths[prevIndex] = path;
            }
            setState({ action, location });
        });
    };
    const go = (n) => {
        warning(canGoWithoutReload, 'Hash history go(n) causes a full page reload in this browser');
        globalHistory.go(n);
    };
    const goBack = () => go(-1);
    const goForward = () => go(1);
    const checkDOMListeners = (win, delta) => {
        listenerCount += delta;
        if (listenerCount === 1) {
            win.addEventListener(HashChangeEvent, handleHashChange);
        }
        else if (listenerCount === 0) {
            win.removeEventListener(HashChangeEvent, handleHashChange);
        }
    };
    const block = (prompt = '') => {
        const unblock = transitionManager.setPrompt(prompt);
        if (!isBlocked) {
            checkDOMListeners(win, 1);
            isBlocked = true;
        }
        return () => {
            if (isBlocked) {
                isBlocked = false;
                checkDOMListeners(win, -1);
            }
            return unblock();
        };
    };
    const listen = (listener) => {
        const unlisten = transitionManager.appendListener(listener);
        checkDOMListeners(win, 1);
        return () => {
            checkDOMListeners(win, -1);
            unlisten();
        };
    };
    const history = {
        length: globalHistory.length,
        action: 'POP',
        location: initialLocation,
        createHref,
        push,
        replace,
        go,
        goBack,
        goForward,
        block,
        listen,
        win: win
    };
    return history;
};

const getLocation = (location, root) => {
  // Remove the root URL if found at beginning of string
  const pathname = location.pathname.indexOf(root) == 0 ?
    '/' + location.pathname.slice(root.length) :
    location.pathname;
  return Object.assign({}, location, { pathname });
};
const HISTORIES = {
  'browser': createBrowserHistory,
  'hash': createHashHistory
};
const Router = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.root = '/';
    this.historyType = 'browser';
    // A suffix to append to the page title whenever
    // it's updated through RouteTitle
    this.titleSuffix = '';
    this.routeViewsUpdated = (options = {}) => {
      if (this.history && options.scrollToId && this.historyType === 'browser') {
        const elm = this.history.win.document.getElementById(options.scrollToId);
        if (elm) {
          return elm.scrollIntoView();
        }
      }
      this.scrollTo(options.scrollTopOffset || this.scrollTopOffset);
    };
    this.isServer = index.getContext(this, "isServer");
    this.queue = index.getContext(this, "queue");
  }
  componentWillLoad() {
    this.history = HISTORIES[this.historyType](this.el.ownerDocument.defaultView);
    this.history.listen((location) => {
      location = getLocation(location, this.root);
      this.location = location;
    });
    this.location = getLocation(this.history.location, this.root);
  }
  scrollTo(scrollToLocation) {
    const history = this.history;
    if (scrollToLocation == null || this.isServer || !history) {
      return;
    }
    if (history.action === 'POP' && Array.isArray(history.location.scrollPosition)) {
      return this.queue.write(() => {
        if (history && history.location && Array.isArray(history.location.scrollPosition)) {
          history.win.scrollTo(history.location.scrollPosition[0], history.location.scrollPosition[1]);
        }
      });
    }
    // okay, the frame has passed. Go ahead and render now
    return this.queue.write(() => {
      history.win.scrollTo(0, scrollToLocation);
    });
  }
  render() {
    if (!this.location || !this.history) {
      return;
    }
    const state = {
      historyType: this.historyType,
      location: this.location,
      titleSuffix: this.titleSuffix,
      root: this.root,
      history: this.history,
      routeViewsUpdated: this.routeViewsUpdated
    };
    return (index.h(activeRouter.ActiveRouter.Provider, { state: state }, index.h("slot", null)));
  }
  get el() { return index.getElement(this); }
};

exports.kompendium_app = App;
exports.kompendium_darkmode_switch = DarkmodeSwitch;
exports.kompendium_navigation = Navigation;
exports.kompendium_search = Search;
exports.stencil_route = Route;
exports.stencil_route_switch = RouteSwitch;
exports.stencil_router = Router;
