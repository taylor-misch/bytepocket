'use strict';

/**
 * This is alpha and probably NOT stable. Use at your own risk.
 *
 * It's also heavily inspired by/stolen from mocha-cloud (https://github.com/visionmedia/mocha-cloud) and
 * uses a similar API to connect safely to mocha-cloud-grid-view.
 *
 * Copyright 2013 Paul Bakaus, licensed under MIT
 * "mocha-cloud" is Copyright 2013 TJ Holowaychuk
 */

var wd = require('wd'),
    path = require('path'),
    Emitter = require('events').EventEmitter,
    debug = require('debug')('mocha-sauce'),
    Batch = require('batch'),
    request = require('request'),
    Player = require('./player'),
    mocha = require('mocha'),
    sauceConnectLauncher = require('sauce-connect-launcher'),
    Promise = require("bluebird");



function MochaSauce(conf) {
    this.name = conf.name;
    this.user = conf.username || process.env.SAUCE_USERNAME;
    this.key = conf.accessKey || process.env.SAUCE_ACCESS_KEY;
    this.host = conf.host || process.env.SELENIUM_HOST || "ondemand.saucelabs.com";
    this.port = conf.port || process.env.SELENIUM_PORT || 80;

    this.browsers = [];

    this._url = conf.url || '';
    this._concurrency = 2;
    this.tags = conf.tags || [];
    this.build = conf.build || '';
    this.seleniumVersion = conf.seleniumVersion;
    this.tunnelIdentifier = conf.tunnelIdentifier;
    this._video = false;
    this._screenshots = false;
    this._runSauceConnect = conf.runSauceConnect || false;
    this._sauceConnectProcess = null;
}

MochaSauce.prototype.__proto__ = Emitter.prototype;

MochaSauce.prototype.build = function(build) {
    this.build = build;
    return this;
};

MochaSauce.prototype.tags = function(tags) {
    this.tags = tags;
    return this;
};

MochaSauce.prototype.url = function(url) {
    this._url = url;
    return this;
};

MochaSauce.prototype.concurrency = function(num) {
    this._concurrency = num;
    return this;
};

MochaSauce.prototype.record = function(video, screenshots) {

    if(screenshots === undefined) {
        screenshots = video;
    }

    this._video = video;
    this._screenshots = screenshots;

    return this;
};

MochaSauce.prototype.browser = function(conf) {
    debug('add %s %s %s', conf.browserName || conf.app, conf.version, conf.platform);
    conf.version = conf.version || '';
    this.browsers.push(conf);
};

MochaSauce.prototype.runConnect = function() {
  var self = this;
  return new Promise(function(resolve, reject)  {
    var config = {
      verbose: true,
      logger: console.log,
      // special key to allow websockets through sauce connect
      'no-ssl-bump-domains': 'all',
      'no-proxy-caching': true
    };

    if (process.env.CIRCLE_BUILD_NUM) {
      config.logfile = path.join(process.env.CIRCLE_ARTIFACTS, 'sc.log');
    }
    if (self.tunnelIdentifier) {
        config['tunnel-identifier'] = self.tunnelIdentifier;
    }

    sauceConnectLauncher(config, function(err, sauceConnectProcess) {
      if (err) {
        console.error(err.message);
        reject(err);
        return;
      }
      console.log('Sauce Connect ready');
      self._sauceConnectProcess = sauceConnectProcess;
      self.emit('connected', sauceConnectProcess);
      resolve(sauceConnectProcess);
    });
  });
}


MochaSauce.prototype.start = function(fn) {
    var self = this;
    if (this._runSauceConnect) {
        this.runConnect().then(function(sauceConnectProcess) {
            self.startTesting(function(err, res) {
                sauceConnectProcess.close(function() {
                    console.log('Closed Sauce Connect process');
                });
                fn(err, res);
            });
        }).catch(fn);
    } else {
        self.startTesting(fn);
    }
};

MochaSauce.prototype.startTesting = function(fn) {
    var self = this;
    var batch = new Batch();
    fn = fn || function() {};

    batch.concurrency(this._concurrency);

    this.browsers.forEach(function(conf) {
        conf.tags = self.tags;
        conf.name = self.name;
        conf.build = self.build;

        // disable Sauce features not needed for unit tests (video + screenshot recording)
        conf['record-video'] = self._video;
        conf['record-screenshots'] = self._screenshots;
        if (self.seleniumVersion) {
            conf.seleniumVersion = self.seleniumVersion;
        }
        if (self.tunnelIdentifier) {
            conf.tunnelIdentifier = self.tunnelIdentifier;
        }

        batch.push(function(done) {

            // initialize remote connection to Sauce Labs
            debug('running %s %s %s', conf.browserName || conf.app, conf.version, conf.platform);
            var browser = wd.remote(self.host, self.port, self.user, self.key);
            self.emit('init', conf);

            browser.init(conf, function() {

                debug('open %s', self._url);
                self.emit('start', conf);

                // load the test site
                browser.get(self._url, function(err) {
                    if (err) return done(err);

                    // wait until choco is ready
                    function doItAgain() {

                        browser.eval('window.chocoReady', function(err, res) {

                            if(res !== true) {
                                setTimeout(function() {
                                    doItAgain();
                                }, 1000);
                                return;
                            }

                            if (err) return done(err);

                            browser.eval('JSON.stringify(window.mochaResults)', function(err, res) {
                                if (err) return done(err);

                                // convert stringified object back to parsed
                                res = JSON.parse(res);

                                // add browser conf to be able to identify in the end callback
                                res.browser = conf;

                                debug('results %j', res);
                                var oridDuration = res.duration;
                                if (res.duration) {
                                    res.duration = res.duration / 1000;
                                }

                                // update Sauce Labs with custom test data
                                var xUnitReport = res.xUnitReport;
                                var serializedReport = res.serializedReport;
                                var failed = res.failed;
                                delete res.xUnitReport;
                                delete res.serializedReport
                                delete res.failed;
                                var mochaRes = { mocha: res };
                                // SauceLabs has limit for 'custom-data' field in 64K
                                while(JSON.stringify(mochaRes).length > 65535
                                  && mochaRes.mocha.reports && mochaRes.mocha.reports.length > 0) {
                                  mochaRes.mocha.reports.pop();
                                }
                                var data = {
                                    'custom-data': mochaRes,
                                    'passed': !res.failures
                                };

                                request({
                                    method: "PUT",
                                    uri: ["https://", self.user, ":", self.key, "@saucelabs.com/rest", "/v1/", self.user, "/jobs/", browser.sessionID].join(''),
                                    headers: {'Content-Type': 'application/json'},
                                    body: JSON.stringify(data)
                                }, function (/*error, response, body*/) {
                                    res.xUnitReport = xUnitReport;
                                    res.failed = failed;
                                    res.serializedReport = serializedReport;
                                    if (res.duration) {
                                        res.duration = oridDuration;
                                    }

                                    if (res && res.serializedReport) {
                                        self.replay(conf, res);
                                    }
                                    self.emit('end', conf, res);
                                    browser.quit();
                                    done(null, res);
                                });

                            });

                        });
                    }
                    doItAgain();
                });
            });
        });
    });

    batch.end(fn);
};

MochaSauce.prototype.replay = function(browser, result) {
  var runner = new Player(browser, result);

  var spec = new mocha.reporters.Spec(runner);
  runner.run();
}


module.exports = MochaSauce;
module.exports.GridView = require('./grid');
