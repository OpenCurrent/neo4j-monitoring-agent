'use strict';

module.exports = validateParams;

function validateParams (config, _expectedKeys) {
  // deep copy
  let expectedKeys = _expectedKeys.map((key) => {
    return key;
  });

  Object.keys(config).forEach((configKey) => {
    // check if provided key is expected
    let idx = expectedKeys
      .map((expected) => { return expected.name; })
      .indexOf(configKey);

    if (idx < 0) {
      let errSpec = 'unexpected property: ' + configKey;
      console.log(expectedKeys);
      throw new Error(errSpec);
    }

    // check if provided key is of expected type
    let expectedType = expectedKeys[idx].type;
    let actualType = typeof config[configKey];
    if (actualType !== expectedType) {
      let errSpec =
        'property configKey is of unexpected type: ' + actualType +
        '\n' +
        'expected type is: ' + expectedType;
      throw new Error(errSpec);
    }

    // remove property from the list after
    //  it's been validated
    expectedKeys.splice(idx, 1);
  });

  // only include required keys by this point
  expectedKeys = expectedKeys.filter((key) => {
    return key.required;
  });

  // check if all required keys were provided
  if (expectedKeys.length > 0) {
    var errSpec = 'config object is missing the following keys:\n';
    expectedKeys.forEach((key) => {
      errSpec += `${key.name} of type ${key.type}\n`;
    });
    throw new Error(errSpec);
  }
}
