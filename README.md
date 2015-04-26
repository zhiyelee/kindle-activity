KA - kindle-activity
===========

Fetch and Display the kindle Recent Activity from the kindle profile page, like [Zhiyelee's Profile page](https://kindle.amazon.com/profile/zhiyelee/11533613)

## Installation

### Requirements

To deploy KA, you must install
* [MongoDB](http://www.mongodb.org/) [Install MongoDB](http://docs.mongodb.org/manual/installation/)
* NodeJS >= v0.11.13  Required by Koa

After installing `MongoDB`, run
```bash
# start mongod service, Linux version
sudo service mongod start
```

### Clone

Clone the repo
```bash
git clone https://github.com/zhiyelee/kindle-activity.git
cd kindle-activity
npm install
```

### Edit the config

Edit the `config.yml`, specify the `port` and `profileurl` etc

### Update the db

#### crontab

The config of the `crontab` can be configured in the `config.yaml`. The crontab can work during the application is running.

```bash
# start
npm start
```

#### manual

```bash
# fetch and update the db
./bin/fetch
```
### Start the server

```bash
# start
npm start
# OR use pm2
pm2 start app.js --node-args="--harmony"
```

## Nginx Config

In case you need, attacted the nginx config 

```
server {
    listen 80;
    listen [::]:80;
    server_name k.zhiye.li;

    # your log path
    access_log /var/log/nginx/k.zhiye.li.nginx.log;
    error_log /var/log/nginx/k.zhiye.li.nginx.err;

    location / {
        proxy_pass http://127.0.0.1:8094;
        proxy_set_header Host $http_host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_redirect off;
    }
}
```
