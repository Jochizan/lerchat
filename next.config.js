/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true
};

if (process.env.NODE_ENV === 'development') {
  console.log('info  - lanUrl:', `http://${require('address').ip()}:3000`)
}