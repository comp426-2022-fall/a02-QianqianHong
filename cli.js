#!/usr/bin/env node
import minimist from 'minimist';
import moment from 'moment-timezone';
import fetch from 'node-fetch';

const args = minimist(process.argv.slice(2));

if (args.h) {
  console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
      -h            Show this help message and exit.
      -n, -s        Latitude: N positive; S negative.
      -e, -w        Longitude: E positive; W negative.
      -z            Time zone: uses tz.guess() from moment-timezone by default.
      -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
      -j            Echo pretty JSON from open-meteo API and exit.`);
  process.exit();
}

let latitude = '35';
let longitude = '-79';
if (args.n) {
  latitude = args.n;
} else if (args.s) {
  latitude = '-' + args.s;
}
if (args.e) {
  longitude = args.e;
} else if (args.w) {
  longitude = '-' + args.w;
} 

const timezone = args.z || moment.tz.guess();

const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&hourly=temperature_2m,windspeed_180m,winddirection_180m&daily=weathercode,precipitation_hours&temperature_unit=fahrenheit&timezone=' + timezone);
const data = await response.json();

const day_precipitation = data.daily.precipitation_hours[args.d];

if (args.j) {
  console.log(data); 
  process.exit();
}

let whichDay = '';
if (args.d == 0) {
  whichDay = "today.";
} else if (args.d > 1) {
  whichDay = "in " + days + " days.";
} else {
  whichDay = "tomorrow.";
}

if (day_precipitation == 0) {
  console.log("You will not need your galoshes " + whichDay);
} else {
  console.log("You might need your galoshes " + whichDay);
}

process.exit(0); 
