const sanitizeString = str => {
  if (typeof str !== 'string') return str;
  return str.replace(/[<>]/g, '').trim();
};

const sanitizeObject = obj => {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = typeof value === 'string' ? sanitizeString(value) : value;
  }
  return result;
};

module.exports = { sanitizeString, sanitizeObject };