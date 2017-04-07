// expect sinon
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
chai.use(sinonChai);

// others
const del = require('del');
const fs = require('fs');
const using = require('data-driven');

// custom
const ArgV = require(appRoot + '/bin/ArgV');
const cfg = require(appRoot + '/main.config');
const envsub = require(appRoot + '/lib/index').envsub;
const envsubh = require(appRoot + '/lib/index').envsubh;
const LogDiff = require(appRoot + '/js/LogDiff');

let TestImports = {
  expect,
  sinon,
  del,
  fs,
  using,
  ArgV,
  cfg,
  envsub,
  envsubh,
  LogDiff
};

module.exports = TestImports;
