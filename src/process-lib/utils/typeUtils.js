// We use the lodash webpack plugin to only extract the required lodash functions
import _ from 'lodash';
import { Wildcard, hasWildcard } from 'wildcard-utils';

import ToReduxType from 'to-redux-type';
import { DO_NOT_MONITOR } from '../context';

/**
 * getTypePattern
 * @param  {[type]} obj      [description]
 * @param  {[type]} config [description]
 * @return {TypePattern}   [description]
 */
export function getTypePattern(obj, config = {}) {
  let types,
    pattern = [];
  if (obj instanceof Map) {
    types = [...obj.keys()];
  } else if (_.isPlainObject(obj)) {
    if (config.handleObject && config.handleObject === 'match') {
      // check if object matches shape instead of using its keys
      // as expected types.
      types = [obj];
    } else {
      types = Object.keys(obj);
    }
  } else if (typeof obj === 'function' || typeof obj === 'string') {
    types = [obj];
  } else {
    return DO_NOT_MONITOR;
  }

  for (let type of types) {
    parseTypeForPattern(type, pattern, config);
  }

  return pattern;
}

/**
 * parseTypeForPattern
 * @param  {[type]} type    [description]
 * @param  {[type]} pattern [description]
 * @param  {[type]} config  [description]
 * @return {[type]}         [description]
 */
export function parseTypeForPattern(type, pattern, config) {
  if (typeof type === 'function') {
    pattern.push(type);
  } else {
    if (typeof type === 'string') {
      type = ToReduxType(type);
      if (hasWildcard(type) && config.wildcard === true) {
        config.hasWildcard = true;
        const WC = new Wildcard(type);
        pattern.push(action => WC.match(action.type));
      } else {
        pattern.push(type);
      }
    } else {
      if (Array.isArray(type)) {
        type = ToReduxType(type);
        if (config.wildcard === true && hasWildcard(type)) {
          config.hasWildcard = true;
          const WC = new Wildcard(type);
          pattern.push(action => WC.match(action.type));
        } else {
          pattern.push(type);
        }
      } else if (_.isPlainObject(type)) {
        pattern.push(action =>
          Object.keys(type).every(x => type[x] === action[x]),
        );
      }
    }
  }
}
