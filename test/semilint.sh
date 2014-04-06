#!/bin/bash
# -*- coding: utf-8, tab-width: 2 -*-


function main () {
  local ORIG=
  local SEMI=
  for ORIG in test.js; do
    SEMI="${ORIG%.js}.semilint.js"
    sed "$ORIG" -re '
      s~^const ~var ~
      /^\/\*global/a "use strict";
      ' >"$SEMI"
    jsl "$SEMI" || return $?
    rm "$SEMI"
  done

  mocha -R spec 2>&1 | less -rS
  return 0
}







main "$@"; exit $?
