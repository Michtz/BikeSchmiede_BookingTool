/**
 * Class providing integrated logging functions for a
 * better overview in the logs
 */

export class Logger {
  /**
   * Integrated logger
   * @param args output arguments
   */

  public static log(...args: Array<any>): void {
    const prefix: string = '[%cLog%c]';
    console.log(prefix, 'color: #4287f5', 'color: initial', ...args);
  }

  /**
   * Integrated info logger
   * @param args output arguments
   */

  public static info(...args: Array<any>): void {
    const prefix: string = '[%cInfo%c]';
    console.log(prefix, 'color: #4287f5', 'color: initial', ...args);
  }

  /**
   * Integrated warning logger
   * @param args output arguments
   */

  public static warn(...args: Array<any>): void {
    const prefix: string = '[%cWarning%c]';
    console.log(prefix, 'color: #f5b942', 'color: initial', ...args);
  }

  /**
   * Integrated error logger
   * @param args output arguments
   */

  public static error(...args: Array<any>): void {
    const prefix: string = '[%cError%c]';
    console.log(prefix, 'color: #f54242', 'color: initial', ...args);
  }

  /**
   * Integrated event logger
   * @param args output arguments
   */

  public static event(...args: Array<any>): void {
    const prefix: string = '[%cEvent%c]';
    console.log(prefix, 'color: #c842f5', 'color: initial', ...args);
  }
}
