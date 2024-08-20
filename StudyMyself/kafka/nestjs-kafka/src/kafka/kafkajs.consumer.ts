import {
  Consumer,
  ConsumerConfig,
  ConsumerSubscribeTopic,
  Kafka,
  KafkaMessage,
} from 'kafkajs';
import { IConsumer } from './consumer.interface';
import { Logger } from '@nestjs/common';
import { sleep } from 'src/sleep';
import * as retry from 'async-retry';
import { DatabaseService } from 'src/database/database.service';

export class KafkajsConsumer implements IConsumer {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;
  private readonly logger: Logger;

  constructor(
    private readonly topic: ConsumerSubscribeTopic,
    // private readonly databaseService: DatabaseService,
    config: ConsumerConfig,
    broker: string,
  ) {
    this.kafka = new Kafka({ brokers: [broker] });
    this.consumer = this.kafka.consumer(config);
    this.logger = new Logger(`${topic.topic}-${config.groupId}`);
  }

  async connect() {
    try {
      await this.consumer.connect();
    } catch (err) {
      this.logger.error('failed to connect to Kafka.', err);
      await sleep(5000);
      await this.connect();
    }
  }

  async consume(onMessage: (message: KafkaMessage) => Promise<void>) {
    await this.consumer.subscribe(this.topic);
    await this.consumer.run({
      eachMessage: async ({ message, partition }) => {
        this.logger.debug(`Processing message partition: ${partition}`);
        try {
          await retry(async () => onMessage(message), {
            retries: 3,
            onRetry: (error, attempt) =>
              this.logger.error(
                `Error consumming message, excuting retry ${attempt}/3`,
                error,
              ),
          });
        } catch (err) {
          this.logger.error(`Error consuming message. adding to dql...`, err);
          // await this.addMessageToDlq(message);
        }
      },
    });
  }

  private async addMessageToDlq(message: KafkaMessage) {
    // kafka 연결 3번 실패시 db안에 데이터 집어넣기
    // await this.databaseService
    //   .getDbHandle()
    //   .collection('dlq')
    //   .insertOne({ value: message.value, topic: this.topic.topic });
  }

  async disconnect() {
    await this.consumer.disconnect();
  }
}
