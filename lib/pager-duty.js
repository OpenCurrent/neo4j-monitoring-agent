'use strict';
const request = require('superagent');
const validate = require('./validator.js');

class PagerDuty {
  constructor (config) {
    const expectedKeys = [
      {name: 'uri', type: 'string', required: true},
      {name: 'source_name', type: 'string', required: true},
      {name: 'routing_key', type: 'string', required: true}
    ];
    try {
      validate(config, expectedKeys);
    } catch (e) {
      console.error(e.toString());
      throw new Error(e);
    }
    Object.assign(this, config);
    this.send = send.bind(this);
  }
}

function send (msg) {
  let reqBody = {
    routing_key: this.routing_key,
    event_action: 'trigger',
    payload: {
      severity: process.env.NODE_ENV === 'production' ? 'error' : 'info',
      source: this.source_name,
      class: 'uncaught error',
      summary: msg
    }
  };
  request
    .post(this.uri)
    .set('Content-type', 'application/json')
    .send(reqBody)
    .then((res) => {
      console.log(res.text);
    })
    .catch((e) => {
      console.error(e.toString());
    });
}

module.exports = PagerDuty;
