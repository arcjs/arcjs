#!/bin/bash

sh .githooks/pre-commit/lint-typecheck
sh .githooks/pre-commit/prettier
sh .githooks/pre-commit/shrinkwrap
