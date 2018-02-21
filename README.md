## Neo4j Monitoring Agent

### Health Check of Neo4j nodes

- Alert to PagerDuty on Failover Events (Master to Slave)
- Alert to PagerDuty on Unavailability

### How it works

Sends an http request to neo4j endpoints as configured in config/\*.json

#### Note

The config module is used to manage different variation of configuration. 

default.json maybe used as reference on composing production.json or development.json. 

The name of the configuration that is sourced is specified via NODE\_ENV variable.

### Runbook

This service is hosted as a Container.  Build as you like.  Push to where you need it be.

To run or test, a PagerDuty account, service and api key is required.  

PagerDuty API key must be configured via config.

#### Build

$: docker build .
