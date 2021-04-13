docker-build:
	docker build . -t kafkajs-consumer-race-condition-example

start:
	docker-compose -f kafka-stack.yaml up

test:
	docker-compose -f kafka-stack.yaml scale test=0
	docker-compose -f kafka-stack.yaml scale test=32

kill:
	docker-compose -f kafka-stack.yaml down
