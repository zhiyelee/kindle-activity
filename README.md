KA - kindle-activity
===========

Fetch and display kindle Recent Activity from the kindle profile page, like [Zhiyelee's Profile page](https://kindle.amazon.com/profile/zhiyelee/11533613)

## Installation

### Requirements

To deploy KA, you must install [Mongodb](http://www.mongodb.org/) firstly. In case you have not install it,  refer this doc: [Install MongoDB](http://docs.mongodb.org/manual/installation/)

After installing Mongodb, run
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

```bash
# fetch and update the db
# todo crontab
node index.js
```

### Start the server

```bash
# start
npm start
# OR use pm2
pm2 start app.js --node-args="--harmony"
```
