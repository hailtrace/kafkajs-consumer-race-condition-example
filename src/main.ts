import { Kafka } from 'kafkajs';

const delay = (time: number) => new Promise((request) => setTimeout(request, time));

async function main() {
  const kafka = new Kafka({
    clientId: 'kafkajs-consumer-race-condition-example',
    brokers: [
      'kafka1:19092'
    ]
  });

  const admin = kafka.admin();
  await admin.connect();

  await admin.createTopics({
    topics: [
      {
        topic: 'commands',
        numPartitions: 32,
      },
    ],
  });

  await admin.disconnect();

  const consumer = kafka.consumer({
    groupId: 'test-consumer-group-id',
  });
  await consumer.connect();
  await consumer.subscribe({ topic: 'commands', fromBeginning: true });
  await consumer.run({
    eachBatch: async (): Promise<void> => {
      console.log('batch processed.');
    },
  });
  const delayAmount = 10000 + (Math.random() * 10000);

  console.log(`Delaying ${(delayAmount / 1000).toFixed(2)} before disconnect...`)
  await delay(delayAmount);
  await consumer.disconnect();
  console.log('Disconnect.');
}

main().catch((ex) => {
  console.error(ex);
  process.kill(1);
});
