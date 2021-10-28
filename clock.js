#!/usr/bin/env node
"use strict";

// Software for the Weasley Clock
// https://github.com/faceless2/weasleyclock
//
// Requires the "mqtt" and "pigpio" NodeJS modules to be installed.
//
// Controlled via MQTT - it connects to the specified host, and listens for the "ask" topic. 
// Messages have the following syntax:
//
//   {"motor":"all", "set":0}                             Set all motors to 0°
//   {"motor":["blue,"red"]", "set":"school"}             Set two motors to position "school"
//   {"motor":"black", "add":90}                          Add 90° to one motor
//   {"motor":"black", "add":90, "set":"school"}          Add 3° to one motor, and treat that position as "school" (to nudge the hands)
//   {"motor":"alice", "reset":"home"}                    Treat the current position as "home"
//
// Being able to nudge the motors a few degrees either way is necessary, as they will slip a bit.
// When motors finish a move, and every 15 minutes, they send a message to MQTT that looks like this:
//
//   {"when":12345, motors:[{"name":"black", "now":"school"}, {"name":"red", "now":"home"}, {"name":"blue", "now":274}...}
// 
// where "when" is milliseconds since the UNIX epoch and "now" is the position of the hand - a named point if known, degrees if not.
//
// In terms of wiring it up, obviously you'll need to play around with which one refers to which set of pins.
// The only thing to watch is the 5mm shaft has a different value for steps to the others.
// 

const mqttHost = "mqtt://mqtt.local";           // The MQTT host
const topicAsk  = "weasley/ask";                // The MQTT topic this listens to
const topicTell = "weasley/tell";               // The MQTT topic this code sends reports as
const rotation = 10000;                         // Controls speed of rotation
const points = [                                // The names of the points, starting 12 0° and moving clockwise. As many as you need.
    "home",
    "office",
    "travel",
    "pub",
    "parents",
    "shed",
    "school",
    "village"
];
const motors = [
    { ix: 0, names: ["alice", "silver"], steps: 4400, pins: [4, 25, 24, 23] },
    { ix: 1, names: ["bob", "black"], steps: 4106, pins: [20, 26, 16, 19 ] },   // 5mm shaft
    { ix: 2, names: ["charlie", "blue"], steps: 4400, pins: [13, 12, 6, 5] },
    { ix: 3, names: ["dave", "pink"], steps: 4400, pins: [17, 18, 27, 22] }
];


//---------------------------

process.stdin.destroy();
const Gpio = require("pigpio").Gpio;
const mqtt = require("mqtt")
const os = require("os")
const client  = mqtt.connect(mqttHost);

const patterns = [9, 8, 10, 4, 6, 2, 3, 1];     // Bitmasks for motor drive sequence
var timeout = null;

// Initialize stuff
for (let i=0;i<4;i++) {
    motors[i].pattern = motors[i].now = motors[i].target = motors[i].next = 0;
    motors[i].gpio = [null, null, null, null];
    for (let j=0;j<4;j++) {
        motors[i].gpio[j] = new Gpio(motors[i].pins[j], {mode: Gpio.OUTPUT});
    }
}
setInterval(report, 60000 * 15);        // Report every 15mins

client.on("connect", function(c) {
    console.log(c.sessionPresent ? "MQTT reconnected" : "MQTT connected");
    if (!c.sessionPresent) {
        client.subscribe(topicAsk);
    }
});

client.on("message", function (topic, msg) {
    var start = false;
    var orig = msg;
    var valid = false;
    try {
        msg = JSON.parse(msg);
        if (msg.motor === "all") {
            msg.motor = [0, 1, 2, 3];
        } else if (!Array.isArray(msg.motor)) {
            msg.motor = [msg.motor];
        }
        for (let x of msg.motor) {
            let motor = null;
            if (x === 0 || x === 1 || x === 2 || x === 3) {
                motor = motors[x];
            } else {
                for (let i=0;i<4;i++) {
                    if (motors[i].names.indexOf(x) >= 0) {
                        motor = motors[i];
                        break;
                    }
                }
            }
            if (!motor) {
                throw "Unknown motor: " + x;
            }
            if (typeof(msg.add) != "undefined") {
                let u = msg.set
                if (typeof(u) === "string") {
                    let t = points.indexOf(u);
                    if (t >= 0) {
                        u = t * 360 / points.length;
                    }
                }
                let v = msg.add;
                if (typeof(v) === "number") {
                    if (typeof(u) === "number") {
                        motor.now = Math.floor((u - v) / 360 * motor.steps);
                        motor.target = Math.floor(u / 360 * motor.steps);
                    } else {
                        motor.target += Math.floor(v / 360 * motor.steps);
                    }
                    valid = true;
                }
            } else if (typeof(msg.set) != "undefined") {
                let v = msg.set
                if (typeof(v) === "string") {
                    let t = points.indexOf(v);
                    if (t >= 0) {
                        v = t * 360 / points.length;
                    }
                }
                if (typeof(v) === "number") {
                    motor.target = Math.floor(v / 360 * motor.steps);
                    valid = true;
                }
            } else if (typeof(msg.reset) != "undefined") {
                let v = msg.reset
                if (typeof(v) === "string") {
                    let t = points.indexOf(v);
                    if (t >= 0) {
                        v = t * 360 / points.length;
                    }
                }
                if (typeof(v) === "number") {
                    motor.now = motor.target = Math.floor(v / 360 * motor.steps);
                    valid = true;
                }
            }
            if (valid) {
                if (motor.now == motor.target) {
                    report();
                } else if (!motor.next) {
                    motor.next = Date.now();
                    start = true;
                }
            }
        }
        if (!valid) {
            console.log("Bad request: \"" + orig + "\"");
        } else {
            console.log(JSON.stringify(msg));
        }
    } catch (e) {
        console.log("Bad request: \"" + orig + "\": " + e);
    }
    if (start && !timeout) {
//        console.log("Starting: "+JSON.stringify(motors));
        timeout = setTimeout(tick, 0)
    }
});

function tick() {
    var next = 0;
    for (let i=0;i<4;i++) {
        let motor = motors[i];
        if (motor.target != motor.now) {
            if (Date.now() >= motor.next) {
//                console.log("tick "+i+" "+motor.target+" "+motor.now+" "+motor.pattern);
                let pins = patterns[motor.pattern];
                for (let j=0;j<4;j++) {
                    motor.gpio[j].digitalWrite(pins & (1<<j) ? 1 : 0);
                }
                if (motor.target - motor.now > motor.steps / 2) {
                    motor.target -= motor.steps;
                } else if (motor.now - motor.target > motor.steps / 2) {
                    motor.target += motor.steps;
                }
                if (motor.target > motor.now) {
                    motor.pattern++;
                    motor.now++;
                } else {
                    motor.pattern--;
                    motor.now--;
                }
                motor.next += rotation / motor.steps;
                if (motor.pattern == patterns.length) {
                    motor.pattern -= patterns.length;
                } else if (motor.pattern == -1) {
                    motor.pattern += patterns.length;
                }
            }
            next = next == 0 ? motor.next : Math.min(next, motor.next);
        } else if (motor.next) {
            while (motor.now < 0) {
                motor.now += motor.steps;
                motor.target += motor.steps;
            }
            while (motor.now >= motor.steps) {
                motor.now -= motor.steps;
                motor.target -= motor.steps;
            }
            for (let j=0;j<4;j++) {
                motor.gpio[j].digitalWrite(0);
            }
            motor.next = 0;
            report();
        }
    }
    if (next > 0) {
        let delay = Math.max(0, next - Date.now());
        timeout = setTimeout(tick, delay);
    } else {
//        console.log("Stopping: "+JSON.stringify(motors));
        timeout = null;
    }
}

function report() {
//    console.log("Report: "+JSON.stringify(motor));
    var o = {};
    o.motors = [];
    o.when = Date.now();
    for (let i=0;i<motors.length;i++) {
        let motor = motors[i];
        let m = {};
        m.name = motor.names[0];
        m.now = motor.now; 
        let q = m.now / motor.steps * points.length;
        if (Math.abs(q - Math.round(q)) < 0.01) {
            q = Math.round(q);
            if (points[q]) {
                m.now = points[q];
            }
        }
        o.motors.push(m);
    }
    client.publish(topicTell, JSON.stringify(o));
}
