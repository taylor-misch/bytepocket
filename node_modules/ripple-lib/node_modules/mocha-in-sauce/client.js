'use strict';

// serializes tests result so they can be played
// back on terminal
function serializeReport(runner) {
  var serialized = [];

  runner.on('suite', function(suite) {
    serialized.push({e: 'suite', title: suite.title});
  });

  runner.on('suite end', function() {
    serialized.push({e: 'suite end'});
  });

  runner.on('test', function(test) {
    serialized.push({e: 'test', fullTitle: test.fullTitle()});
  });

  runner.on('test end', function() {
    serialized.push({e: 'test end'});
  });

  runner.on('pending', function(test) {
    serialized.push({e: 'pending', title: test.title});
  });

  runner.on('pass', function(test) {
    serialized.push({
      e: 'pass',
      fullTitle: test.fullTitle(),
      title: test.title,
      duration: test.duration,
      _slow: test.slow(),
      speed: test.speed
    });
  });

  runner.on('fail', function(test, err) {
    serialized.push({e: 'fail', title: test.title,
      err: err,
      _fullTitle: test.fullTitle()
    });
  });

  runner.on('end', function() {
    window.serializedReport = serialized;
  });
}


function mochaSaucePlease(options, fn) {

    (function(runner) {

        // execute optional callback to give user access to the runner
        if(fn) {
            fn(runner);
        }

        if(!options) {
            options = {};
        }

        // in a PhantomJS environment, things are different
        if(!runner.on) {
            return;
        }

        // serialize report to send back
        mocha.reporter(serializeReport);
        new mocha._reporter(runner);

        // Generate XUnit coverage
        window.xUnitReport = 'off';
        if(options.xunit != false) {
            window.xUnitReport = '';
            (function() {
                var log = window.console && console.log;

                if(!window.console) {
                    window.console = {};
                }

                console.log = function() {
                    window.xUnitReport += arguments[0] + "\n"; // TODO: handle complex console.log
                    if(log) log.apply(console, arguments);
                };
            })();
            mocha.reporter("xunit", {});
            new mocha._reporter(runner);
        }

        // The Grid view needs more info about failures
        var failed = [];
        runner.on('fail', function(test, err) {
            failed.push({
                title: test.title,
                fullTitle: test.fullTitle(),
                error: {
                    message: err.message,
                    stack: err.stack
                }
            });
        });

        var failedTests = [];
        function logFailure(test, err) {
          var flattenTitles = function(test) {
            var titles = [];
            while (test.parent.title) {
              titles.push(test.parent.title);
              test = test.parent;
            }
            return titles.reverse();
          };
          failedTests.push({
            //name: test.title,
            name: test.fullTitle(),
            result: false,
            message: err.message,
            // new SauceLabs interface doesn't show stack and titles
            stack: err.stack,
            titles: flattenTitles(test)
          });
        };
        runner.on('fail', logFailure);

        // implement custom reporter for console to read back from Sauce
        runner.on('end', function() {
            runner.stats.failed = failed;
            runner.stats.xUnitReport = window.xUnitReport;
            runner.stats.serializedReport = window.serializedReport;
            window.mochaResults = runner.stats;
            window.mochaResults.reports = failedTests;
            window.chocoReady = true;
        });

    })(window.mochaPhantomJS ? mochaPhantomJS.run() : mocha.run());
}
