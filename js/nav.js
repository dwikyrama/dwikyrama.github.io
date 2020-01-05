document.addEventListener("DOMContentLoaded", function() {  
  // Activate sidebar nav
  var sidenavElems = document.querySelectorAll(".sidenav");
  M.Sidenav.init(sidenavElems);
  loadNav();

  function loadNav() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status != 200) return;
   
        // Muat daftar tautan menu
        document.querySelectorAll(".topnav, .sidenav").forEach(function(elm) {
          elm.innerHTML = xhttp.responseText;
        });
   
        // Daftarkan event listener untuk setiap tautan menu
        document.querySelectorAll(".sidenav a, .topnav a").forEach(function(elm) {
          elm.addEventListener("click", function(event) {
            // Tutup sidenav
            var sidenav = document.querySelector(".sidenav");
            M.Sidenav.getInstance(sidenav).close();
   
            // Muat konten halaman yang dipanggil
            page = event.target.getAttribute("href").substr(1);
            loadPage(page);
          });
        });
      }
    };
    xhttp.open("GET", "nav.html", true);
    xhttp.send();
  }

  var pathname = window.location.pathname;
  var page = window.location.hash.substr(1);
  if (pathname == "/" || pathname == "/index.html") {
    if (page == "") {
      page = "home";
    }
  } loadPage(page);
  
  function loadPage(page) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        var content = document.querySelector("#body-content");

        // Get page content
        if (page === "home") {
          getStandings();
        } else if (page === "team") {
          getTeams();
        } else if (page === "saved") {
          getFavoriteTeams();
          getSavedMatches();
        }

        // Get page status
        if (this.status == 200) {
          content.innerHTML = xhttp.responseText;
          // Initialize all materialize components
          M.AutoInit();
        } else if (this.status == 404) {
          console.log("<p>Halaman tidak ditemukan.</p>");
        } else {
          console.log("<p>Ups.. halaman tidak dapat diakses.</p>");
        }
      }
    };
    xhttp.open("GET", "pages/" + page + ".html", true);
    xhttp.send();
  }
});