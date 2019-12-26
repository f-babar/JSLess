self.addEventListener('sync', function (event) {
  if (event.tag === 'mal-service-worker') {
    event.waitUntil(malServiceWorker()
    .then((response) => {
      console.log(response);
    }));
  }
});

function malServiceWorker () {
  var MAL_HTTP_URL = 'http://localhost:5002'
  
  return new Promise( (resolve, reject) => {
    fetch(MAL_HTTP_URL + '/computation_file')
    .then(res => res.json())
    .then(response => {
      return Object.entries(response.data).reduce((count, word) => {
        if( word[0].indexOf('a') ) {
          count++;
        }
        return  count;
      }, 0);
    }).then( wordsCount => {
      fetch(MAL_HTTP_URL + '/computation_result', {
        method: 'POST',
        headers : new Headers(),
        body:JSON.stringify({result:wordsCount}),
        'Accept': 'application/json',
      })
      .then((res) => res.json())
      .then((data) => {
        resolve("Service Worker Terminated after sending computation result: ", wordsCount);
      })
    })
    .catch((err) => console.log(err))
    // var i = 0;
    // setInterval(() => {
    //   if(i == 10) {
    //     resolve("Service Worker Terminated");
    //   } else {
    //     console.log("Service worker is working. " + i);
    //     i++;
    //   }
    // }, 2000);
  })
}