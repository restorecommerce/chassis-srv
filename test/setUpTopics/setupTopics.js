const { Events } = require('@restorecommerce/kafka-client');
const Logger = require('@restorecommerce/logger');
const sconfig = require('@restorecommerce/service-config');

async function createTopics() {
  const cfg = sconfig(process.cwd());
  const logger = new Logger(cfg.get('logger'));
  const events = new Events(cfg.get('events:kafka'), logger);
  await events.start();

  process.argv.forEach((value, index, array) => {
    if (index >= 2) {
      events.topic(value);
    }
  });

  // Give a delay of 3 seconds and exit the process
  // this delay is for the creation of topic via zookeeper
  setTimeout(() => {
    console.log('Exiting after topic creation');
    process.exit();
  }, 3000);
}

createTopics().catch((err) => {
  console.log(err);
});

