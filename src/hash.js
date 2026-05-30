const crypto = require("crypto");

function hashData(value) {
  if (!value) return null;
  return crypto
    .createHash("sha256")
    .update(value.trim().toLowerCase())
    .digest("hex");
}

function hashUserData(customer) {
  return {
    em: hashData(customer.email),
    ph: hashData(customer.phone),
    fn: hashData(customer.first_name),
    ln: hashData(customer.last_name),
    ct: hashData(customer.city),
    st: hashData(customer.province_code),
    zp: hashData(customer.zip),
    country: hashData(customer.country_code),
  };
}

module.exports = { hashData, hashUserData };
