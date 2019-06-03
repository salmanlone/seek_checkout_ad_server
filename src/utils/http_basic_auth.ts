/**
 * @swagger
 * securityDefinitions:
 *  basicAuth:
 *    type: basic
 *    scheme: basic
 */

import { Request, Response, Next } from 'restify';
const _ = require('lodash');

export default (username, password) => {
  return function (req: Request, res: Response, next: Next) {
    res.header('WWW-Authenticate', 'Basic realm="Admin Access"');
    let authHeader = req.header('Authorization');

    if (_.isEmpty(authHeader)) {
      res.send(401);
      return next(false);
    }

    let authHeaderParts = _.split(authHeader, ' ');

    if (_.isEqual(_.lowerCase(authHeaderParts[0]), "basic")) {
      let encodedAuth = authHeaderParts[1];
      let buff = new Buffer(encodedAuth, 'base64');
      let credentials = buff.toString('ascii');

      let credentialParts = _.split(credentials, ':');
      let suppliedUser = credentialParts[0];
      let suppliedPass = credentialParts[1];

      if (
        _.isEqual(suppliedUser, username) &&
        _.isEqual(suppliedPass, password)
      ) {
        return next();
      }
      else {
        res.send(401);
        return next(false);
      }
    }
  }
}