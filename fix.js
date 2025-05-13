const fs = require('fs');

// Read the file
const filePath = './src/utils/index.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Replace the camelizeConvert function
const originalFunction = `export const camelizeConvert = (obj: any) => {
  return _.transform(obj, (acc: any, value, key: any, target) => {
    const camelKey = _.isArray(target) ? key : _.camelCase(key);
    acc[camelKey] = _.isObject(value) ? camelizeConvert(value) : value;
  });
};`;

const fixedFunction = `export const camelizeConvert = (obj: any) => {
  // Add base case to prevent stack overflow
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  return _.transform(obj, (acc: any, value, key: any, target) => {
    const camelKey = _.isArray(target) ? key : _.camelCase(key);
    
    // Better handling for different types of values
    if (_.isArray(value)) {
      acc[camelKey] = value.map(item => _.isObject(item) ? camelizeConvert(item) : item);
    } else if (_.isObject(value) && !_.isFunction(value) && value !== null) {
      acc[camelKey] = camelizeConvert(value);
    } else {
      acc[camelKey] = value;
    }
  });
};`;

content = content.replace(originalFunction, fixedFunction);

// Write the file
fs.writeFileSync(filePath, content, 'utf8');

console.log('Fixed camelizeConvert function to prevent stack overflow'); 