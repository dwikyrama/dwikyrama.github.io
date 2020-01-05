// Membuat basisdata footballDB
var dbPromised = idb.open('footballDB', 1, upgradeDb => {
  var teamObjectStore = upgradeDb.createObjectStore('teams', {
    keyPath: 'id'
  });
  teamObjectStore.createIndex('shortName', 'shortName', { unique: false });

  var matchObjectStore = upgradeDb.createObjectStore('matches', {
    keyPath: 'id'
  });
  matchObjectStore.createIndex('matchday', 'matchday', { unique: false });
});

function saveTeam(teams) {
  dbPromised
    .then(function (db) {
      var tx = db.transaction("teams", "readwrite");
      var store = tx.objectStore("teams");
      console.log(teams);
      store.put(teams);
      return tx.complete;
    })
    .then(function () {
      console.log("Tim favorit berhasil disimpan.");
    })
    .catch(function () {
      console.log("Tim favorit tidak tersimpan.");
    });
}

function getAll() {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        var tx = db.transaction("teams", "readonly");
        var store = tx.objectStore("teams");
        return store.getAll();
      })
      .then(function (teams) {
        resolve(teams);
      });
  });
}

function deleteTeam(teams) {
  dbPromised
    .then(function (db) {
      var tx = db.transaction("teams", "readwrite");
      var store = tx.objectStore("teams");
      store.delete(teams);
      return tx.complete;
    })
    .then(function () {
      console.log("Tim dihapus.");
    })
    .catch(function () {
      console.log("Tim gagal dihapus.");
    });
}

function saveMatches(matches) {
  dbPromised
    .then(function (db) {
      var tx = db.transaction("matches", "readwrite");
      var store = tx.objectStore("matches");
      console.log(matches.match);
      store.put(matches.match);
      return tx.complete;
    })
    .then(function () {
      console.log("Jadwal berhasil disimpan.");
    })
    .catch(function () {
      console.log("Jadwal tidak tersimpan.");
    });
}

function getAllSavedMatches() {
  return new Promise(function (resolve, reject) {
    dbPromised
      .then(function (db) {
        var tx = db.transaction("matches", "readonly");
        var store = tx.objectStore("matches");
        return store.getAll();
      })
      .then(function (matches) {
        resolve(matches);
      });
  });
}

function deleteMatches(matches) {
  dbPromised
    .then(function (db) {
      var tx = db.transaction("matches", "readwrite");
      var store = tx.objectStore("matches");
      store.delete(matches);
      return tx.complete;
    })
    .then(function () {
      console.log("Jadwal dihapus.");
    })
    .catch(function () {
      console.log("Jadwal gagal dihapus.");
    });
}