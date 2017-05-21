var path_join = require('path').join,
    pouchdb = require('pouchdb');

function connect (remote, db_name) {
  var db = new pouchdb(path_join('data', db_name)),
      opts = {
        continuous: true
      };

  db.replicate.to([remote, db_name].join('/'), opts);
  db.replicate.from([remote, db_name].join('/'), opts);

  return db;
}

module.exports = function(app, prefix, admin_url){
  // sync with a cloudant database; for example, "users"
  var cloudant = connect(admin_url, 'users');

  // convenience method for generating route paths
  // from the prefix and a given path
  // good for, say, API versioning
  function makePath(path){
    return '/' + [prefix, path].join('/');
  }

  app.get(makePath('users'), function(req, res){
    // return the contents of the 'users' database
    cloudant.allDocs(req.query, function (err, body) {
      res.json(err || body);
    });
  });
};
