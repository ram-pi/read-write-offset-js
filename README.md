# Read from a specific offset and partition and redirect to a specific topic

## Create kcat.config 

```
bootstrap.servers=<your-bootstrap-server>
security.protocol=SASL_SSL
sasl.mechanism=PLAIN
sasl.username=<your-api-key>
sasl.password=<your-api-secret>
```


## kcat

```
# read only
kcat -F kcat.config -C -t influx_input -p 0 -c 1 -o 3

# read and redirect
kcat -F kcat.config -C -t influx_input -p 0 -c 1 -o 3 | kcat -F kcat.config -P -t example_dlq
```

## Confluent Kafka Javascript

## Install the lilbrary

```
npm install @confluentinc/kafka-javascript
```

## Define a .env file with your properties

```
BOOTSTRAP_SERVERS=
SECURITY_PROTOCOL=
SASL_MECHANISM=
SASL_USERNAME=
SASL_PASSWORD=
TOPIC=
OFFSET=
PARTITION=
DLQ_TOPIC=
```

## Run 

```
./run.sh
```

