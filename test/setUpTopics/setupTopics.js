const co = require('co');

const chassis = require('../../lib');

const Events = chassis.Events;
const logger = chassis.Logger;
const config = chassis.config;

co(function* createTopics() {
  // create topics
  yield config.load(process.cwd() + '/test', logger);
  const cfg = yield config.get();

  let log = new logger(cfg.get('server:logger'));
  let events = new Events(cfg.get('events:kafkaTest'), log);
  yield events.start();
  let listOfTopics = [];

  process.argv.forEach( (value, index, array) => {
    if( index >=2 )
      listOfTopics.push(value);
  });

  for(let i=0; i< listOfTopics.length; i++) {
    let topicName = listOfTopics[i];
    yield events.topic(topicName);
  }

  // Give a delay of 3 seconds and exit the process
  // this delay is for the creation of topic via zookeeper
  setTimeout(function () {
    console.log('Exiting after topic creation');
    process.exit();
  }, 3000);
}).catch(err => {
  console.log(err);
});

