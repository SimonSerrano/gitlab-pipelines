/**
 * Abstract service class
 *
 * @class Service
 */
abstract class Service {
  protected apiBaseUrl = `${
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001'
      : window.location.origin
  }${process.env.REACT_APP_HOMEPAGE || ''}/api`;

  protected abortSignal: AbortSignal;

  /**
   * Creates an instance of Service.
   * @param {AbortSignal} abortSignal
   * @memberof Service
   */
  constructor(abortSignal: AbortSignal) {
    this.abortSignal = abortSignal;
  }
}

export { Service };
