# Quick start

1. Start a local K8S cluster ( tested using Rancher Desktop )
2. Be EXTRA sure to switch `kubectl` context to your local cluster context `kubectl config use-context CONTEXT_NAME`
3. `npm i`
4. `npm run dev` - will take a minute, have to wait for redis instances to come alive

## Available commands

- `npm run getmaster`: Get current master node name
- `npm run killmaster`: Kills current master
- `npm run startcount`: Start inserting a bunch of incrementing integer keys in Redis
- `npm run stopcount`: Stop inserting
- `npm run check`: Checks all inserted keys in Redis and makes sure there's no gap between them
- `npm run reset`: Deletes all Redis keys and resets the count to 0
