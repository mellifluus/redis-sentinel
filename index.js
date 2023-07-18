const Redis = require("ioredis")
const fastify = require('fastify')()

let count = 0
let interval = null

const findMissing = (a, l=true) => Array.from(Array(Math.max(...a)).keys()).map((n, i) => a.indexOf(i) < 0  && (!l || i > Math.min(...a)) ? i : null).filter(f=>f);

const redis = new Redis({
  sentinels: [
    { host: "redis-node-0.redis-headless.default.svc.cluster.local", port: 26379 },
    { host: "redis-node-1.redis-headless.default.svc.cluster.local", port: 26380 },
    { host: "redis-node-2.redis-headless.default.svc.cluster.local", port: 26381 },
  ],
  name: "mymaster",
})

redis.on('close', () => {
  console.log('Failover detected')
})

redis.on('ready', async () => {
  console.log('Connected to redis')
})

redis.on('error', function(err) {
  // ioredis throws errors when it's not able to connect to the master even though sentinels are managing it
})

fastify.get('/start', async (req, res) => {
  interval = setInterval(() => {
    console.log(count)
    redis.set(count, 'test')
    count++
  }, 50)
  res.send('Start inserting data to redis')
})

fastify.get('/stop', (req, res) => {
  clearInterval(interval)
  res.send('Stop inserting data to redis')
})

fastify.get('/check', async (req, res) => {
  const keys = await redis.keys('*')
  const sortedKeys = keys.map((key) => parseInt(key)).sort((a, b) => a - b)
  const missingKeys = findMissing(sortedKeys)
  res.send(`Missing keys: ${missingKeys}`)
})

fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})
