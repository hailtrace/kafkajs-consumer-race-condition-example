# KafkaJS Disconnect Race Condition Test

To run the test:

1. `make docker-build`
2. `make start` - Wait for kafka to start up and connect to it from Conduktor.
3. Open up a new terminal window and `make test` - Runs 32 instances of a consumer.

This project tests a race condition that happens if you attept to disconnect a consumer and it's consumer group re-balances.
1. Many consumers will disconnect without any issues.
2. Some will throw an error 'ERR_STREAM_WRITE_AFTER_END'.
3. In our more complex production implementation, some will not actually disconnect.

You will see the following errors in some of the consumers. In other scenarios (in production), the consumers actually run the `disconnect()` function but then reconnect after the rebalance finishes. In a tool like Conduktor, you can see them still connected to the broker.

```json

{"level":"ERROR","timestamp":"2021-04-13T17:10:43.019Z","logger":"kafkajs","message":"[Connection] Connection error: write after end","broker":"kafka1:19092","clientId":"kafkajs-consumer-race-condition-example","stack":"Error [ERR_STREAM_WRITE_AFTER_END]: write after end\n    at Socket.Writable.write (internal/streams/writable.js:292:11)\n    at Object.sendRequest (/app/node_modules/kafkajs/src/network/connection.js:312:27)\n    at SocketRequest.send [as sendRequest] (/app/node_modules/kafkajs/src/network/requestQueue/index.js:139:23)\n    at SocketRequest.send (/app/node_modules/kafkajs/src/network/requestQueue/socketRequest.js:85:10)\n    at RequestQueue.sendSocketRequest (/app/node_modules/kafkajs/src/network/requestQueue/index.js:168:19)\n    at RequestQueue.push (/app/node_modules/kafkajs/src/network/requestQueue/index.js:148:12)\n    at /app/node_modules/kafkajs/src/network/connection.js:307:29\n    at new Promise (<anonymous>)\n    at sendRequest (/app/node_modules/kafkajs/src/network/connection.js:302:14)\n    at async Connection.send (/app/node_modules/kafkajs/src/network/connection.js:321:53)"}

```

I can clarify if you need more explanation. Feel free to message me in the KafkaJS slack.

