const { io } = require('socket.io-client');
const s1 = io('http://localhost:5050');
console.log('s1 connected?', s1.connected);
s1.disconnect();
const s2 = io('http://localhost:5050');
console.log('s1 === s2?', s1 === s2);
console.log('s2 connected?', s2.connected);
s2.connect(); // Force connect
setTimeout(() => {
  console.log('s2 connected after 1s?', s2.connected);
  process.exit(0);
}, 1000);
