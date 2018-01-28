#!/usr/bin/env node --harmony
'use strict';
var renderFromPaths = require('json-schema-to-markdown-table').renderFromPaths;
var dirname = require('path').dirname;

function main() {
  if (process.argv.length !== 3 && process.argv.length !== 4) {
    console.error('usage: generate SCHEMA [SCHEMASDIR]');
    process.exit(2);
  }
  const filepath = process.argv[2];
  const schemasPath = process.argv.length > 3 ?
    process.argv[3] : dirname(filepath);
  console.log(renderFromPaths(filepath, schemasPath));
}

main();
