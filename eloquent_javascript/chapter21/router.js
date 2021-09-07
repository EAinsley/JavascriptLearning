/**
 * This module exports the Router class which allows adding new handlers
 * and resolve the requests.
 */
const { URL } = require("url");

/**
 * The Router class.
 */
module.exports = class Router {
  constructor() {
    this.routes = [];
  }

  /**
   * Register a new handler.
   * @param {String} method the request method
   * @param {RegExp} url the pattern of the request url
   * @param {Function} handler the request handler
   */
  add(method, url, handler) {
    this.routes.push({ method, url, handler });
  }

  /**
   * Resolve the requests.
   * @param {*} context
   * @param {Request} request the request object
   * @returns {Response} the response of the request
   */
  resolve(context, request) {
    const path = new URL(request.url).pathname;
    for (const { method, url, handler } of this.routes) {
      const match = url.exec(path);
      if (!match || request.method != method) continue;
      let urlParts = match.slice(1).map(decodeURIComponent);
      return handler(context, ...urlParts, request);
    }
    return null;
  }
};
