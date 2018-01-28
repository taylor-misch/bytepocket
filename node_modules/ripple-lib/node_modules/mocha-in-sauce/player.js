'use strict';

var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;

function Player(browser, result) {
  this.browser = browser;
  this.result = result;
  this.stats = result;
}

inherits(Player, EventEmitter);

Player.prototype.run = function() {
  var indents = 0;
  var self = this;
  this.emit('start');
  this.result.serializedReport.forEach(function(event) {
    if (event.e === 'suite') {
      event.title = event.title + ' (' +
        self.browser.browserName + ' ' + self.browser.platform + ')';
      ++indents;
    } else if (event.e === 'suite end') {
      if (--indents === 0) {
        console.log();
      }
    }
    event.slow = function() {
      return this._slow;
    };
    event.fullTitle = function() {
      return this._fullTitle;
    };
    self.emit(event.e, event, event.err);
  });
  this.stats.start = new Date() - this.result.duration;
  this.emit('end');
};

module.exports = Player;
