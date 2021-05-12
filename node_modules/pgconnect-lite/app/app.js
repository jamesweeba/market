const {
  Pool
} = require('pg');
const QueryStream = require("pg-query-stream");
const JSONStream = require("JSONStream");
const pg2 = require("pg");

let Promise = require("bluebird");

var pool = null;


/**
 * Initialise pool configuration. Should be called once for an applicaiton. A recall creates a new connection poll to database
 * @param {*} dbConfig Pool Configuration. 
 */
function init(dbConfig) {
  pool = new Pool(dbConfig)
}


/**
 * Get pool information 
 * 
 * @param {*} callback Callback(err,data) Pool information { totalClients, idleClients, waitingClients}
 * 
 *  
 */
function stats(callback) {
  if (pool == null) {
    return callback(Error("Pool not initialised. Call init() to initalise before calling stats"));
  }

  return callback(null, {
    totalClients: pool.totalCount,
    idleClients: pool.idleCount,
    waitingClients: pool.waitingCount
  });
}

/**
 * Commits all transactions on this connection
 * @param {*} connection Connection to database
 * @return {Promise} Promise object with success message
 */
function commit(connection) {
  return new Promise((resolve, reject) => {
    if (connection == null || connection.client == null) {
      let err =new Error("Connection is invalid. Call connect() to get a connection")
      // return reject({
      //   msg: "Connection is invalid. Call connect() to get a connection"
      // });
      throw err;
    }

    connection.client.query("COMMIT", err => {

      if (err) {

        return reject(err);

      } else {
        resolve({
          msg: "Transaction Committed Succesfully"
        });
      }
      connection.client.release();

    });
  })
}


/**
 * Connects to database and starts a transaction
 * @returns {Promise} Connection object to the database. The connection is in transaction mode,hence must be commited when ready
 */
function connect() {
  return new Promise((resolve, reject) => {
    if (pool == null) {
      return reject({
        msg: "Database connection not initialised. Call init() to initialise"
      });
    }

    pool
      .connect()
      .then(client => {
        client.query("BEGIN", err => {
          return reject({
            msg: "Error starting a stransaction",
            err
          });
        });
        resolve({
          client
        });
      })
      .catch(err => {
        reject({
          msg: "Error connecting to pool",
          err
        });
      })
  });
}


/**
 * Executes a select statement with a single result
 * @param {*} connection Connection to database. get connection by calling conect()
 * @param {*} sql The sql select statement. Ensure that the statement generates a single row
 * @param {array} params array  of parameters to be sent to sql statement
 * @returns {Promise} Promise object containing connection and data(The data returned by sql) {connection:{},data:{}}
 */
function fetchOne(connection, sql, params) {
  return new Promise((resolve, reject) => {

    if (connection == null || connection.client == null) {
      let error = new Error("Connection is invalid. Call connect() to get a connection")
      // return reject({
      //   msg: "Connection is invalid. Call connect() to get a connection"
      // });
      throw error;
    }

    var client = connection.client;

    client.query(sql, params, (err, result) => {
      if (err) {
        err.sql = sql;
        err.sql_params = params;
        return reject(err);
      }

      var output = {
        connection,
        data: null
      }

      if (result.rowCount > 0) {
        output.data = result.rows[0];
      }

      return resolve(output);
    });

  });

}



/**
 * Executes an sql select statement and return results. To be used when statement results in >=0 items
 * @param {*} connection Connection to database. Get connection from calling connect()
 * @param {string} sql Sql statement to be executed
 * @param {array?} params Parameters to passed to sql statement
 * 
 * @return {Promise} Promise object containing connection and data({count,items})
 */
function fetch(connection, sql, params = []) {
  return new Promise((resolve, reject) => {

    if (connection == null || connection.client == null) {
      var error = new Error("Connection is invalid. Call connect() to get a connection");
      error.info = {
        connection,
        sql,
        params
      }
      // return reject(error);
      throw error;
    }

    var client = connection.client;
    client.query(sql, params, (err, res) => {
      if (err) {
        err.sql = sql;
        err.sql_params = params;
        return reject(err);
      }

      resolve({
        connection,
        data: {
          count: res.rowCount,
          items: res.rows
        }
      });
    });
  });

}



/**
 * Executes sql insert statement on the given connection. Statement is added to transaction running on this connection and 
 *  must be commited to persist the data. Multiple statement can be chained and added to transaction before commiting. Commit by calling commit()
 * @param {*} connection The connection to the database. Get a connection by calling connect()
 * @param {string} sql The sql statement to be used for the insrtion. Insert sql statement
 * @param {array?} params An array of parameters to be passed to statement. This is optional
 * 
 * @returns {Promise} Promise object of connection and data ie { connection,data:{count,items}} 
 */
function insert(connection, sql, params = []) {
  return new Promise((resolve, reject) => {

    if (connection == null || connection.client == null) {
      var error = new Error("Connection is invalid. Call connect() to get a connection");
      error.info = {
        connection,
        sql,
        params
      }
      throw error;
    }

    var client = connection.client;
    client.query(sql, params, (err, res) => {

      if (err) {
        err.sql = sql;
        err.sql_params = params;
        return reject(err);

      }

      return resolve({
        connection,
        data: {
          count: res.rowCount,
          items: res.rows
        }
      });
    })
  });

}


/**
 * Executes an update statement on the given connection. Update only persis after transaction on connection is commited. Call commit() to persist transaction.
 * Commit() can only be called once on a connection. 
 * @param {*} connection The connection to the database. Get a connection by calling connect()
 * @param {string} sql The update sql statement
 * @param {array?} params Array of prameters to be passed to sql statement. This is optional. Only needed if statment is prameterised
 * 
 * @returns {Promise} Promise object containing connection and data {donnection,data}. Data contains {count,items} 
 */
function update(connection, sql, params = []) {
  return new Promise((resolve, reject) => {
    if (connection == null || connection.client == null) {
      var error = new Error("Connection is invalid. Call connect() to get a connection");
      error.info = {
        connection,
        sql,
        params
      }
      // return reject(error);
      throw error;
    }

    var client = connection.client;
    client.query(sql, params, (err, res) => {
      if (err) {
        err.sql = sql,
          err.sql_params = params;
        return reject(err);
      }


      resolve({
        connection,
        data: {
          count: res.rowCount,
          items: res.rows
        }
      });
    })
  });

}

/**
 * Rollback all sql on this connection. Connection is released to pool 
 * @param {*} connection Connection to the database. Call connect() To get a connection
 * @returns {Promise} Promise Object will rollback status
 */
function rollback(connection) {
  return new Promise((resolve, reject) => {

    if (connection == null || connection.client == null) {
      var error = new Error("Connection is invalid. Call connect() to get a connection");
      error.info = {
        connection,
        sql,
        params
      }
      throw error;
    }

    var client = connection.client;

    client.query("ROLLBACK", (err) => {

      client.release();

      if (err) {
        var error = new Error("Error rolling back transaction");
        error.info = {
          msg: err.message,
          sql: "ROLLBACK",
          params: null,
          err
        }
        return reject(err);
      }



      return resolve({
        msg: "Transaction rollback succesfull"
      });

    });
  });
}


/**
 * Stream database results intu an output stream. Output stream should be writable
 * @param {*} connection Connection to database
 * @param {string} sql Sql statement
 * @param {array} params paramters for sql statement
 * @param {object} outStream The wotput stream. should b writable
 * @param {*} done Called when streaming is complete.Callback function
 */
function stream(connection,sql,params,onData,done){
  const query = new QueryStream(sql,params);
  let client = connection.client;
  const stream = client.query(query);
  let counter=0;
  stream.on('end',()=>{
    done();
  });
  stream.on('data',data=>{
    counter = counter +1;
    onData(data,counter);
  })
}

module.exports = {


  init,


  stats,

  connect,

  commit,

  rollback,

  fetchOne,

  fetch,

  fetch,

  insert,
  update,
  stream
}