# tricky-apis

This repository contains tricky APIs and in some instances 
vulnerable APIs that is difficult to assess with vanilla
a Burp suite setup.

The code in this repository should under no circumstances be 
used in production systems.

For detailed information regarding all APIs and how to attack them check out [https://www.shelltrail.com/research/reshaper-the-guide-to-ultimate-burp-plugin-for-advanced-shenanigans/](https://www.shelltrail.com/research/reshaper-the-guide-to-ultimate-burp-plugin-for-advanced-shenanigans/).

## node-api-csrf

An API that requires an unique CSRF token for each request.

## node-api-version

An API that requires an incrementing version number for each update.

## node-api-sqli

A trivial SQL injection which requires input in base64 format.

## node-api-sign

An API that requires a generated signature of the input for each input.

## node-api-pdf

A PDF generator which requires multiple endpoints in order to generate a PDF.
