var pg = require('pg');
var env = require('./../configs/env.json');
var config = require('./../configs/config.' + env.current + '.json');
var port = 5432
module.exports = {
    dbconfig: {
        user: config.user, //env var: PGUSER 
        database: config.database, //env var: PGDATABASE 
        password: config.password, //env var: PGPASSWORD 
        host: config.postgreaddress, // Server hosting the postgres database 
        port: port, //env var: PGPORT 
        max: 10, // max number of clients in the pool 
        idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed 
        ssl: config.ssl
    },
    doquery: function (query, callback) {
        var pool = new pg.Pool(this.dbconfig);
        const items = undefined;

        pool.connect(function (err, client, done) {
            if (err) {
                return console.error('error fetching client from pool', err);
            }
            client.query(query, function (err, result) {
                done();
                if (err) {
                    return console.error('error running query', err);
                }

                callback(result)

            });
        });

        pool.on('error', function (err, client) {
            console.error('idle client error', err.message, err.stack)
        })

    }
}
