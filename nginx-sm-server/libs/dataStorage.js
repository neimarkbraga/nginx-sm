const path = require('path');
const fs = require('fs');

const dataPath = path.join(process.cwd(), 'data.json');
const dataValue = (() => fs.existsSync(dataPath) ? require(dataPath) : {})();

const createProxy = (value) => {
  if (typeof value === 'object' || Array.isArray(value)) {
    for (let key of Object.keys(value)) {
      value[key] = createProxy(value[key]);
    }
    return new Proxy(value, {
      set(target, p, value) {
        const origValue = target[p];
        target[p] = createProxy(value);

        if (JSON.stringify(origValue) !== JSON.stringify(value)) {
          fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        }
        return true;
      }
    });
  }
  return value;
};

const data = createProxy(dataValue);

module.exports = data;
