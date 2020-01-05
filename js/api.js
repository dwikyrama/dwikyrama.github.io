const base_url = "https://api.football-data.org/v2/";

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}
// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}
// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

// Blok kode untuk mengambil data standing (ranking pertandingan)
function getStandings() {
  if ('caches' in window) {
    caches.match(base_url + "competitions/PL/standings?standingType=TOTAL").then(function (response) {
      if (response) {
        response.json().then(function (data) {
          var lastUpdatedHTML = "";
          lastUpdatedHTML = `
              Last updated<br/>${data.competition.lastUpdated.slice(0, 10)} ${data.competition.lastUpdated.slice(11, 16)}
            `;

          var standingsHTML = "";
          data.standings[0].table.forEach(function (standing) {
            standingsHTML += `
            <tr>
                <td>${standing.position}</td>
                <td class="fixed-height">
                  <a href="./team_info.html?team_id=${standing.team.id}">
                    <img class="standing-img" src="${standing.team.crestUrl.replace(/^http:\/\//i, 'https://')}" />
                  </a>
                </td>
                <td class="align-left-td fixed-height">
                  <a class="truncate" href="./team_info.html?team_id=${standing.team.id}">
                    ${standing.team.name}
                  </a>
                </td>
                <td>${standing.playedGames}</td>
                <td>${standing.won}</td>
                <td>${standing.draw}</td>
                <td>${standing.lost}</td>
                <td>${standing.goalsFor}</td>
                <td>${standing.goalsAgainst}</td>
                <td>${standing.goalDifference}</td>
                <td>${standing.points}</td>
            </tr>
            `;
          });
          // Sisipkan komponen tabel ke dalam elemen dengan id #standings
          document.getElementById("standings").innerHTML = standingsHTML;
          document.getElementById("last-updated").innerHTML = lastUpdatedHTML;
        })
      }
    })
  }

  fetch(base_url + "competitions/PL/standings?standingType=TOTAL", {
    headers: { 'X-Auth-Token': '91edc29ed6324ae0b36c5b14383062d0' }
  })
    .then(status)
    .then(json)
    .then(function (data) {
      var lastUpdatedHTML = "";
      lastUpdatedHTML = `
          Last updated<br/>${data.competition.lastUpdated.slice(0, 10)} ${data.competition.lastUpdated.slice(11, 16)}
        `;
      
      // Blok kode untuk menyusun komponen tabel standing
      var standingsHTML = "";
      data.standings[0].table.forEach(function (standing) {
        standingsHTML += `
            <tr>
                <td>${standing.position}</td>
                <td class="fixed-height">
                  <a href="./team_info.html?team_id=${standing.team.id}">
                    <img class="standing-img" src="${standing.team.crestUrl.replace(/^http:\/\//i, 'https://')}" />
                  </a>
                </td>
                <td class="align-left-td fixed-height">
                  <a class="truncate" href="./team_info.html?team_id=${standing.team.id}">
                    ${standing.team.name}
                  </a>
                </td>
                <td>${standing.playedGames}</td>
                <td>${standing.won}</td>
                <td>${standing.draw}</td>
                <td>${standing.lost}</td>
                <td>${standing.goalsFor}</td>
                <td>${standing.goalsAgainst}</td>
                <td>${standing.goalDifference}</td>
                <td>${standing.points}</td>
            </tr>
            `;
      });
      // Sisipkan komponen tabel ke dalam elemen dengan id #standings
      document.getElementById("standings").innerHTML = standingsHTML;
      document.getElementById("last-updated").innerHTML = lastUpdatedHTML;
    })
    .catch(error);
}

// Blok kode untuk mengambil data tim
function getTeams() {
  if ('caches' in window) {
    caches.match(base_url + "competitions/PL/teams").then(function (response) {
      if (response) {
        response.json().then(function (data) {
          var teamsHTML = "";
          data.teams.forEach(function (team) {
            teamsHTML += `
              <div class="col s12 m6 l4">
                <div class="card">
                    <a href="./team_info.html?team_id=${team.id}">
                    <div class="card-image waves-effect waves-block waves-light">
                        <img src="${team.crestUrl.replace(/^http:\/\//i, 'https://')}">
                    </div>
                    </a>
                    <div class="card-content">
                        <span class="card-title grey-text text-darken-4">${team.shortName}</span>
                        <p>Founded: ${team.founded}</p>
                    </div>
                </div>  
              </div>  
              `;
          });
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("teams").innerHTML = teamsHTML;
        })
      }
    })
  }
  fetch(base_url + "competitions/PL/teams", {
    headers: { 'X-Auth-Token': '91edc29ed6324ae0b36c5b14383062d0' }
  })
    .then(status)
    .then(json)
    .then(function (data) {
      // Objek/array JavaScript dari response.json() masuk lewat data.
      // Menyusun komponen card artikel secara dinamis
      var teamsHTML = "";
      data.teams.forEach(function (team) {
        teamsHTML += `
            <div class="col s12 m6 l4">
              <div class="card">
                  <a href="./team_info.html?team_id=${team.id}">
                  <div class="card-image waves-effect waves-block waves-light">
                      <img src="${team.crestUrl.replace(/^http:\/\//i, 'https://')}">
                  </div>
                  </a>
                  <div class="card-content">
                      <span class="card-title grey-text text-darken-4">${team.shortName}</span>
                      <p>Founded: ${team.founded}</p>
                  </div>
              </div>  
            </div>  
            `;
      });
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("teams").innerHTML = teamsHTML;
    })
    .catch(error);
}

function getTeamById() {
  return new Promise(function (resolve, reject) {
    // Ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("team_id");

    if ("caches" in window) {
      caches.match(base_url + "teams/" + idParam).then(function (response) {
        if (response) {
          response.json().then(function (data) {
            var teamHTML = `
          <h3>${data.name}</h3>
          <div class="row">
            <div class="col s12 m4">
              <img class="team-info-img" src="${data.crestUrl.replace(/^http:\/\//i, 'https://')}" />
            </div>
            <div class="col s12 m8">
                <ul class="collection">
                    <li class="collection-item">Founded <b>${data.founded}</b></li>
                    <li class="collection-item">Phone <b>${data.phone}</b></li>
                    <li class="collection-item">Email <b>${data.email}</b></li>
                    <li class="collection-item">Website <b>${data.website}</b></li>
                    <li class="collection-item">Address <b>${data.address}</b></li>
                </ul>
            </div>
          </div>       
        `;

            var playerHTML = "";
            data.squad.forEach(function (player) {
              var shirtNumber = "";
              if (player.shirtNumber) {
                shirtNumber = player.shirtNumber;
              }

              if (player.role == "PLAYER") {
                var dob = new Date(player.dateOfBirth).toUTCString();
                playerHTML += `
                  <tr>
                    <td>${player.name}</td>
                    <td>${player.position}</td>
                    <td class="center-align">${shirtNumber}</td>
                    <td class="right-align">
                      ${dob.slice(5, 16)} 
                    </td>
                    <td>${player.nationality}</td>
                  </tr>
                `;
              }
            });

            teamHTML += `
        <h5>Players</h5>
        <hr />  
        <table class="highlight responsive-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th class="center-align">Shirt Number</th>
                <th class="right-align">Birth Date</th>
                <th>Nationality</th>
              </tr>
            </thead>
            <tbody>
              ${playerHTML}
            <tbody>
          </table>
        `;
            // Sisipkan komponen tabel ke dalam elemen dengan id #body-content
            document.getElementById("body-content").innerHTML = teamHTML;
            // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
            resolve(data);
          });
        }
      });
    }

    fetch(base_url + "teams/" + idParam, {
      headers: { 'X-Auth-Token': '91edc29ed6324ae0b36c5b14383062d0' }
    })
      .then(status)
      .then(json)
      .then(function (data) {
        var teamHTML = `
          <h3>${data.name}</h3>
          <div class="row">
            <div class="col s12 m4">
              <img class="team-info-img" src="${data.crestUrl.replace(/^http:\/\//i, 'https://')}" />
            </div>
            <div class="col s12 m8">
                <ul class="collection">
                    <li class="collection-item">Founded <b>${data.founded}</b></li>
                    <li class="collection-item">Phone <b>${data.phone}</b></li>
                    <li class="collection-item">Email <b>${data.email}</b></li>
                    <li class="collection-item">Website <b>${data.website}</b></li>
                    <li class="collection-item">Address <b>${data.address}</b></li>
                </ul>
            </div>
          </div>       
        `;

        var playerHTML = "";
        data.squad.forEach(function (player) {
          var shirtNumber = "";
          if (player.shirtNumber) {
            shirtNumber = player.shirtNumber;
          }

          if (player.role == "PLAYER") {
            var dob = new Date(player.dateOfBirth).toUTCString();
            playerHTML += `
              <tr>
                <td>${player.name}</td>
                <td>${player.position}</td>
                <td class="center-align">${shirtNumber}</td>
                <td class="right-align">
                  ${dob.slice(5, 16)} 
                </td>
                <td>${player.nationality}</td>
              </tr>
            `;
          }
        });

        teamHTML += `
        <h5>Players</h5>
        <hr />  
        <table class="highlight responsive-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th class="center-align">Shirt Number</th>
                <th class="right-align">Birth Date</th>
                <th>Nationality</th>
              </tr>
            </thead>
            <tbody>
              ${playerHTML}
            <tbody>
          </table>
        `;

        // Sisipkan komponen tabel ke dalam elemen dengan id #body.content
        document.getElementById("body-content").innerHTML = teamHTML;
        // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
        resolve(data);
      });
  });
}

function getFavoriteTeams() {
  getAll().then(function(data) {
    console.log(data);
    // Menyusun komponen card artikel secara dinamis
    var teamsHTML = "";

    if (data.length == 0) {
      teamsHTML += `
        <p><em>Apparently, you don't have any favorite teams yet.</em></p>
      `
    } else {
      data.forEach(function (team) {
        teamsHTML += `
            <div class="col s12 m6 l4">
              <div class="card">
                    <div class="card-image waves-effect waves-block waves-light">
                        <a href="./team_info.html?team_id=${team.id}&saved=true">
                          <img src="${team.crestUrl.replace(/^http:\/\//i, 'https://')}">
                        </a>
                    </div>
                  <div class="card-content">
                        <a class="btn-floating btn-small right grey darken-3" id=${team.id} onclick="removeTeam(this)">
                          <i class="material-icons">clear</i>
                        </a>
                      <span class="card-title grey-text text-darken-4">${team.name}</span>
                      <p>Founded: ${team.founded}</p>
                  </div>
              </div>  
            </div>  
            `;
      });
    }
    // Sisipkan komponen card ke dalam elemen dengan id #body-content
    document.getElementById("teams").innerHTML = teamsHTML;
  });
}

function getFavoriteTeamById() {
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("team_id");
  var idParamInt = parseInt(idParam);

  getById(idParamInt).then(function(data) {
    var teamHTML = `
          <h3>${data.name}</h3>
          <div class="row">
            <div class="col s12 m4 l3">
              <img class="team-info-img" src="${data.crestUrl.replace(/^http:\/\//i, 'https://')}" />
            </div>
            <div class="col s12 m8 l9">
                <ul class="collection">
                    <li class="collection-item">Founded <b>${data.founded}</b></li>
                    <li class="collection-item">Phone <b>${data.phone}</b></li>
                    <li class="collection-item">Email <b>${data.email}</b></li>
                    <li class="collection-item">Website <b>${data.website}</b></li>
                    <li class="collection-item">Address <b>${data.address}</b></li>
                </ul>
            </div>
          </div>       
        `;

        var playerHTML = "";
        data.squad.forEach(function (player) {
          var shirtNumber = "";
          if (player.shirtNumber) {
            shirtNumber = player.shirtNumber;
          }

          if (player.role == "PLAYER") {
            var dob = new Date(player.dateOfBirth).toUTCString();
            playerHTML += `
              <tr>
                <td>${player.name}</td>
                <td>${player.position}</td>
                <td class="center-align">${shirtNumber}</td>
                <td class="right-align">
                  ${dob.slice(5, 16)} 
                </td>
                <td>${player.nationality}</td>
              </tr>
            `;
          }
        });

        teamHTML += `
        <h5>Players</h5>
        <hr />  
        <table class="highlight responsive-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Position</th>
                <th class="center-align">Shirt Number</th>
                <th class="right-align">Birth Date</th>
                <th>Nationality</th>
              </tr>
            </thead>
            <tbody>
              ${playerHTML}
            <tbody>
          </table>
        `;

        // Sisipkan komponen tabel ke dalam elemen dengan id #body.content
        document.getElementById("body-content").innerHTML = teamHTML;
  });
}

function getById(id) {
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        var tx = db.transaction("teams", "readonly");
        var store = tx.objectStore("teams");
        return store.get(id);
      })
      .then(function(teams) {
        resolve(teams);
      });
  });
}

function removeTeam(team) {
  var el = Number(team.id);
  // Delete team in database
  deleteTeam(el);
  // Delete team card
  deleteCard(team);
  M.toast({html: 'Favorite team removed!', classes: 'rounded', displayLength: 1500});
}

function deleteCard(card) {
  var i = card.parentNode.parentNode.parentNode;
  i.parentNode.removeChild(i);
}

// Blok kode untuk mengambil data jadwal pertandingan terkini
function getMatchday() {
  if ('caches' in window) {
    caches.match(base_url + "competitions/PL").then(function (response) {
      if (response) {
        response.json().then(function (data) {
          caches.match(base_url + "competitions/PL/matches?matchday=" + data.currentSeason.currentMatchday).then(function (response) {
            if (response) {
              response.json().then(function (data) {
                var lastUpdatedHTML = "";
                lastUpdatedHTML = `
                  Last updated<br/>${data.matches[0].lastUpdated.slice(0, 10)} ${data.matches[0].lastUpdated.slice(11, 16)}
                `;

                var dropdownHTML = "";
                dropdownHTML = `
                  Matchday ${data.matches[0].matchday}
                `;

                var matchesHTML = "";
                data.matches.forEach(function (match) {
                  var score;
                  if (match.score.fullTime.homeTeam) {
                    score = match.score.fullTime.homeTeam + ":" + match.score.fullTime.awayTeam;
                  } else {
                    score = "-:-";
                  }
                  
                  var day = new Date(match.utcDate).toString();

                  var saveButton = "";
                  if (match.status == "SCHEDULED") {
                    saveButton = `
                      <a class="btn-flat" id=${match.id} onclick="saveThenRemove(event)">
                        <i class="material-icons">save</i>
                      </a>
                    `;
                  }

                  matchesHTML += `
                  <tr>
                    <td">
                      ${day.slice(8, 10)} 
                      ${day.slice(4, 7)} 
                      ${day.slice(11, 15)}
                    </td>
                    <td>${day.slice(16, 21)}</td>
                    <td class="right-align">${match.homeTeam.name}</td>
                    <td class="center-align">${score}</td>
                    <td>${match.awayTeam.name}</td>
                    <td>${saveButton}</td>
                  </tr>
                    `;
                });
                // Sisipkan komponen ke dalam elemen menurut id
                document.getElementById("last-updated").innerHTML = lastUpdatedHTML;
                document.getElementById("dropdown-text").innerHTML = dropdownHTML;
                document.getElementById("matches").innerHTML = matchesHTML;
              })
            }
          })
        })
      }
    })
  }

  fetch(base_url + "competitions/PL", {
    headers: { 'X-Auth-Token': '91edc29ed6324ae0b36c5b14383062d0' }
  })
    .then(status)
    .then(json)
    .then(function (data) {
      fetch(base_url + "competitions/PL/matches?matchday=" + data.currentSeason.currentMatchday, {
        headers: { 'X-Auth-Token': '91edc29ed6324ae0b36c5b14383062d0' }
      })
        .then(status)
        .then(json)
        .then(function (data) {
          // Objek/array JavaScript dari response.json() masuk lewat data.

          var lastUpdatedHTML = "";
          lastUpdatedHTML = `
            Last updated<br/>${data.matches[0].lastUpdated.slice(0, 10)} ${data.matches[0].lastUpdated.slice(11, 16)}
          `;

          var dropdownHTML = "";
          dropdownHTML = `
            Matchday ${data.matches[0].matchday}
          `;

          var matchesHTML = "";
          data.matches.forEach(function (match) {
            var score;
            if (match.score.fullTime.homeTeam) {
              score = match.score.fullTime.homeTeam + ":" + match.score.fullTime.awayTeam;
            } else {
              score = "-:-";
            }

            // Get local time
            var day = new Date(match.utcDate).toString();

            var saveButton = "";
            if (match.status == "SCHEDULED") {
              saveButton = `
                <a class="btn-flat" id=${match.id} onclick="saveThenRemove(event)">
                  <i class="material-icons">save</i>
                </a>
              `;
            }
                  
            matchesHTML += `
                <tr>
                  <td>
                    ${day.slice(8, 10)} 
                    ${day.slice(4, 7)} 
                    ${day.slice(11, 15)}
                  </td>
                  <td>${day.slice(16, 21)}</td>
                  <td class="right-align">${match.homeTeam.name}</td>
                  <td class="center-align">${score}</td>
                  <td>${match.awayTeam.name}</td>
                  <td>${saveButton}</td>
                </tr>
                `;
          });

          // Sisipkan komponen ke dalam elemen menurut id
          document.getElementById("last-updated").innerHTML = lastUpdatedHTML;
          document.getElementById("dropdown-text").innerHTML = dropdownHTML;
          document.getElementById("matches").innerHTML = matchesHTML;

        })
        .catch(error);
    }).catch(error);
}

// Blok kode untuk mengambil data jadwal pertandingan menurut hari
function getMatchesByDay() {
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("matchday");

  if ('caches' in window) {
    caches.match(base_url + "competitions/PL/matches?matchday=" + idParam).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          var lastUpdatedHTML = "";
          lastUpdatedHTML = `
            Last updated<br/>${data.matches[0].lastUpdated.slice(0, 10)} ${data.matches[0].lastUpdated.slice(11, 16)}
          `;

          var dropdownHTML = "";
          dropdownHTML = `
            Matchday ${data.matches[0].matchday}
          `;

          var matchesHTML = "";
          data.matches.forEach(function (match) {
            var score;
            if (match.score.fullTime.homeTeam) {
              score = match.score.fullTime.homeTeam + ":" + match.score.fullTime.awayTeam;
            } else {
              score = "-:-";
            }

            var day = new Date(match.utcDate).toString();

            var saveButton = "";
            if (match.status == "SCHEDULED") {
              saveButton = `
                <a class="btn-flat" id=${match.id} onclick="saveThenRemove(event)">
                  <i class="material-icons">save</i>
                </a>
              `;
            }

            matchesHTML += `
            <tr>
              <td>
                ${day.slice(8, 10)} 
                ${day.slice(4, 7)} 
                ${day.slice(11, 15)}
              </td>
              <td>${day.slice(16, 21)}</td>
              <td class="right-align">${match.homeTeam.name}</td>
              <td class="center-align">${score}</td>
              <td>${match.awayTeam.name}</td>
              <td>${saveButton}</td>
            </tr>
                `;
          });
          // Sisipkan komponen ke dalam elemen menurut id
          document.getElementById("last-updated").innerHTML = lastUpdatedHTML;
          document.getElementById("dropdown-text").innerHTML = dropdownHTML;
          document.getElementById("matches").innerHTML = matchesHTML;
        })
      }
    })
  }

  fetch(base_url + "competitions/PL/matches?matchday=" + idParam, {
    headers: { 'X-Auth-Token': '91edc29ed6324ae0b36c5b14383062d0' }
  })
    .then(status)
    .then(json)
    .then(function (data) {
      var lastUpdatedHTML = "";
      lastUpdatedHTML = `
            Last updated<br/>${data.matches[0].lastUpdated.slice(0, 10)} ${data.matches[0].lastUpdated.slice(11, 16)}
          `;

      var dropdownHTML = "";
      dropdownHTML = `
            Matchday ${data.matches[0].matchday}
          `;

      var matchesHTML = "";
      data.matches.forEach(function (match) {
        var score;
        if (match.score.fullTime.homeTeam) {
          score = match.score.fullTime.homeTeam + ":" + match.score.fullTime.awayTeam;
        } else {
          score = "-:-";
        }

        var day = new Date(match.utcDate).toString();

        var saveButton = "";
        if (match.status == "SCHEDULED") {
          saveButton = `
            <a class="btn-flat" id=${match.id} onclick="saveThenRemove(event)">
              <i class="material-icons">save</i>
            </a>
          `;
        }

        matchesHTML += `
        <tr>
          <td>
            ${day.slice(8, 10)} 
            ${day.slice(4, 7)} 
            ${day.slice(11, 15)}
          </td>
          <td>${day.slice(16, 21)}</td>
          <td class="right-align">${match.homeTeam.name}</td>
          <td class="center-align">${score}</td>
          <td>${match.awayTeam.name}</td>
          <td>${saveButton}</td>
        </tr>
          `;
      });
      // Sisipkan komponen ke dalam elemen menurut id
      document.getElementById("last-updated").innerHTML = lastUpdatedHTML;
      document.getElementById("dropdown-text").innerHTML = dropdownHTML;
      document.getElementById("matches").innerHTML = matchesHTML;
    })
    .catch(error);
}

// Blok kode untuk menambahkan opsi hari pertandingan dalam dropdown
function getMatchdayDropdown() {
  var day;
  var matchdayHTML = "";
  for (day = 1; day < 39; day++) {
    matchdayHTML += `<li><a href="./match_info.html?matchday=${day}">Matchday ${day}</a></li>`;
  }
  document.getElementById("matchday-dropdown").innerHTML = matchdayHTML;
}

// Blok kode untuk menyimpan jadwal
function saveThenRemove(e) {
  var el = e.currentTarget;

  // Ambil data jadwal pertandingan menurut ID
  fetch(base_url + "matches/" + el.id, {
    headers: { 'X-Auth-Token': '91edc29ed6324ae0b36c5b14383062d0' }
  })
    .then(status)
    .then(json)
    .then(function (match) {
      saveMatches(match);
    })
    .catch(error);

  M.toast({html: 'Match schedule saved!', classes: 'rounded', displayLength: 1500});

  // Hapus button setelah menyimpan jadwal
  el.remove();
}

function getSavedMatches() {
  getAllSavedMatches().then(function(data) {
    console.log(data);
    // Menyusun komponen tabel jadwal tersimpan secara dinamis
    var matchesHTML = "";

    if (data.length == 0) {
      matchesHTML += `
        <p class="center-align"><em>Oops, you have no saved matches.</em></p>
      `
    } else {
      data.forEach(function (match) {
        var day = new Date(match.utcDate).toString();

        matchesHTML += `
        <tr>            
          <td>
            ${day.slice(8, 10)} 
            ${day.slice(4, 7)} 
            ${day.slice(11, 15)}
          </td>
          <td>${day.slice(16, 21)}</td>
          <td class="right-align">${match.homeTeam.name}</td>
          <td class="center-align">vs</td>
          <td>${match.awayTeam.name}</td>
          <td>
            <a class="btn-flat" id=${match.id} onclick="removeMatches(this)">
              <i class="material-icons">delete_forever</i>
            </a>
          </td>
        </tr>
        `;
      });
    }
    // Sisipkan komponen card ke dalam elemen dengan id #body-content
    document.getElementById("matches").innerHTML = matchesHTML;
  });
}

function removeMatches(match) {
  var el = Number(match.id);
  // Delete matches in database
  deleteMatches(el);
  // Delete matches in table
  deleteRow(match);
  M.toast({html: 'Match schedule removed!', classes: 'rounded', displayLength: 1500});
}

function deleteRow(row) {
  var i = row.parentNode.parentNode.rowIndex;
  document.getElementById("saved-matches").deleteRow(i);
}