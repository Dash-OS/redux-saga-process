import { IS_PROCESS } from './context';

/**
 * Process
 * @type {Class}
 *
 *  Our Process is the class which users will extend
 *  so that we can identify a Process.  User may optionally
 *  assign static properties to alter the behavior of a given
 *  Process.
 *  
 */
export default class Process {
  static isProcess = IS_PROCESS;
}
