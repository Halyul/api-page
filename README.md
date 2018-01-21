# Doki Doki

这是一个获取客户端IP的小程序

This is a small app that can get client IP

## Usage

### Directly
```` bash
$ git clone https://github.com/Halyul/doki-doki.git
$ cd doki-doki
$ npm i
$ npm start
````

### Docker
I just tested docker-compose, so I will just provide how to configure

```` yaml
version: '3.2'
services:
  dokidoki:
    build:
      context: https://github.com/Halyul/doki-doki.git
    ports:
      - target: 3000
        published: 3000
        protocol: tcp
        mode: host
    volumes:
      - ./data:/dokidoki/data:rw # this folder stores json files
      - ./_config.json:/dokidoki/_config.json:ro # this is the config file
````
In order to get real client IP, you should use 3.2+ version of configuration file and with such `ports` configuration.

## Config
Use `_config.json` as sample.
```` json
{
  "public": false,
  "host": "http://example.com/dokidoki",
  "port": 3000,
  "key": "abcd1234",
  "times": 20
}
````
`public`: this can be used in public or not
`port`: which port should the app listen, default is 3000

`key`: the authorized key

`times`: after how many time the app should clean up data

## Example

### Private Mode
In this mode, your request key must match your configuration key.

If your client IP is 5.5.5.5

and config file is
```` json
{
  "public": false,
  "host": "6.6.6.6:3000",
  "port": 3000,
  "key": "1234567890",
  "times": 20
}
````

**All the reuqest can be used in curl or something like that**

#### add
Request to add IP data

`example.com/?request=add&key=[Your key here]&device=[Device name]`

`6.6.6.6:3000/?request=add&key=1234567890&device=Ubuntu`

If key is correct and device is set, the response is

```` json
{
  "status":"Succeeded",
  "getUrl":"http://6.6.6.6:3000/?request=get&key=1234567890&device=Ubuntu",
  "deleteUrl":"http://6.6.6.6:3000/?request=delete&key=1234567890&device=Ubuntu"
}
````

otherwise the response is 403 - `Forbidden`.

#### get
Request to get IP data

`example.com/?request=get&key=[Your key here]&device=[Device name]`

`http://6.6.6.6:3000/?request=get&key=1234567890&device=Ubuntu`

If key is correct and device is set, the response is

```` json
{
  "data": [
    {
      "IP": "::ffff:5.5.5.5",
      "time": "Sat Jan 13 2018 19:29:20 GMT-0500 (EST)"
    },
    {
      "IP": "5.5.5.5",
      "time": "Sat Jan 13 2018 19:29:21 GMT-0500 (EST)"
    }
  ],
  "times": 2
}

````

`IP`: you know what it is. About the `::ffff:` prefix, see [here](https://stackoverflow.com/questions/29411551/express-js-req-ip-is-returning-ffff127-0-0-1)

`time` is when the data is added

`times` counts after how many times the app will clean up data.

otherwise the response is 403 - `Forbidden`.

#### delete
Request to delete IP data

`example.com/?request=delete&key=[Your key here]&device=[Device name]`

`http://6.6.6.6:3000/?request=delete&key=1234567890&device=Ubuntu`

If key is correct and device is set, the response is

```` json
{
  "status":"Succeeded"
}
````

otherwise the response is 403 - `Forbidden`.

### Public Mode
In this mode, your request key need not to match your configuration key.

If your client IP is 5.5.5.5

and config file is
```` json
{
  "public": true,
  "host": "6.6.6.6:3000",
  "port": 3000,
  "key": "1234567890",
  "times": 20
}
````

**All the reuqest can be used in curl or something like that**

#### add
Request to add IP data

`example.com/?request=add&key=[Your key here]&device=[Device name]`

`6.6.6.6:3000/?request=add&key=1234567890&device=Ubuntu`

If key is correct and device is set, the response is

```` json
{
  "status":"Succeeded",
  "getUrl":"http://6.6.6.6:3000/?request=get&key=eae153eb56f80ef327acd2cdd3ef58e8336913a1",
  "deleteUrl":"http://6.6.6.6:3000/?request=delete&key=eae153eb56f80ef327acd2cdd3ef58e8336913a1"
}
````

otherwise the response is 403 - `Forbidden`.

#### get
Request to get IP data

`example.com/?request=get&key=[Your key here]&device=[Device name]`

`http://6.6.6.6:3000/?request=get&key=eae153eb56f80ef327acd2cdd3ef58e8336913a1`

If key is correct and device is set, the response is

```` json
{
  "data": [
    {
      "IP": "::ffff:5.5.5.5",
      "time": "Sat Jan 13 2018 19:29:20 GMT-0500 (EST)"
    },
    {
      "IP": "5.5.5.5",
      "time": "Sat Jan 13 2018 19:29:21 GMT-0500 (EST)"
    }
  ],
  "times": 2
}

````

`IP`: you know what it is. About the `::ffff:` prefix, see [here](https://stackoverflow.com/questions/29411551/express-js-req-ip-is-returning-ffff127-0-0-1)

`time` is when the data is added

`times` counts after how many times the app will clean up data.

otherwise the response is 403 - `Forbidden`.

#### delete
Request to delete IP data

`example.com/?request=delete&key=[Your key here]&device=[Device name]`

`http://6.6.6.6:3000/?request=delete&key=eae153eb56f80ef327acd2cdd3ef58e8336913a1`

If key is correct and device is set, the response is

```` json
{
  "status":"Succeeded"
}
````

otherwise the response is 403 - `Forbidden`.
