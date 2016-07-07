echo "setting up Kafka for identity-srv"

file="kafka_2.11-0.9.0.1.tgz"
if ! [ -f "$file" ]
then
	wget http://apache.mirror.iphh.net/kafka/0.9.0.1/kafka_2.11-0.9.0.1.tgz
  tar -zxvf kafka_2.11-0.9.0.1.tgz
fi

topicsInKafka=$(./kafka_2.11-0.9.0.1/bin/kafka-topics.sh --list --zookeeper 127.0.0.1:2181)
topics=("test" "io.restorecommerce.notify.notification")

for topic in "${topics[@]}"
do
  :
  if echo $topicsInKafka | grep -q $topic
  then
    echo $topic "does exist";
  else
    echo $topic "does not exist, creating it" $topic;
    ./kafka_2.11-0.9.0.1/bin/kafka-topics.sh --create --zookeeper 127.0.0.1:2181 --replication-factor 1 --partitions 1 --topic $topic
  fi
done