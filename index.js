'use strict';

const config = require('config');
const request = require('superagent');
const debug = require('debug')('neo4j-cluster-monitor');
const PagerDuty = require('./lib/pager-duty.js');
const pd = new PagerDuty(config.pagerDuty);
const role = {};

config.neo4j.forEach((host) => {
  role[host.url] = 'bootstrap';
});

setInterval(availCheck, config.timers.avail);

function availCheck () {
  config.neo4j.forEach((host) => {
    request
      .get(host.url + '/db/manage/server/ha/available')
      .then((res) => {
        /**
         * Check global role object
         * ie. Who was and who is master?
         */
        if (
          role[host.url] !== 'bootstrap' &&
          res.text !== role[host.url]
        ) {
          let msg = 'Neo4j Failover occured! ' +
            `${host.url} was ${role[host.url]}` +
            ` : ${host.url} now is ${res.text}`;
          console.log(msg);

          // Send alert via PagerDuty
          pd.send('neo4j-cluster-monitor' + msg);
        }
        /**
         * Set the current role of
         *   the host.
         * ie. role['neo4j-node1'] = 'master'
         */
        role[host.url] = res.text;
        debug(role);
      })
      .catch((e) => {
        let msg = ('Neo4j host', host.url, 'is unavailable!', e.toString());

        // Send alert message to Pager Duty;
        pd.send(msg);
      });
  });
}
