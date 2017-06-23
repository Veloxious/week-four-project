//const token = /*Replace with a valid API Key then uncomment*/
const input = document.querySelector('.searchform')
const results = document.querySelector('.results')
const form = document.querySelector('.search-form')
let artistName = ''
var artistID = ''
let songs = []

form.addEventListener('submit', function(evt) {
  evt.preventDefault()
  let search = input.value
  input.value = ""
  searchArtists(search)
})

function searchArtists(search) {
  results.textContent = "Results on the horizon."
  fetch(`https://api.soundcloud.com/users/?client_id=${token}&q=${search}`)
    .then(function(res) {
      return res.json()
    })
    .then(function(json) {
      console.log(json)
      results.textContent = ""
      for (let i = 0; i < json.length; i++) {
        const img = json[i].avatar_url
        const name = json[i].username
        const id = json[i].id
        const html = `
        <div class="artist" id="${id}">
          <div class="image">
            <img src="${img}">
          </div>
          <div class="name">
            ${name}
          </div>
        </div>
        `
        results.insertAdjacentHTML('beforeend', html)
      }
    })
    .then(function() {
      const artistBlocks = document.querySelectorAll('.artist')
      for (let i = 0; i < artistBlocks.length; i++) {
        const artist = artistBlocks[i]
        artist.addEventListener('click', function() {
          results.textContent = ""
          artistName = artist.querySelector('.name').textContent
          var artistID = artistBlocks[i].id
          pullTracks(artistID)
        })
      }
    })
}

function pullTracks(artistID) {
  fetch(`https://api.soundcloud.com/users/${artistID}/tracks?client_id=${token}`)
    .then(function(res) {
      console.log(res);
      return res.json()
    })
    .then(function(json) {
        if (json.length > 0) {
          for (let i = 0; i < json.length; i++) {
            const artwork = json[i].artwork_url
            const title = json[i].title
            const songStream = json[i].stream_url
            const artist = json[i].user.username
            const html = `
           <div class="song" id="${songStream}">
             <div class="artwork">
               <img src="${artwork}">
             </div>
             <div class="title">
               ${title} <br> ${artist}
             </div>
           </div>
           `
            document.querySelector(".results").insertAdjacentHTML('beforeend', html)
          }
        } else {
          document.querySelector('.results').textContent = 'Uh oh!  This artist doesn\'t have any songs available for free.'
        }
        const songs = document.querySelectorAll('.song')
        const audio = document.querySelector('.music-player')
        const album = document.querySelector('.album')
        for (let i = 0; i < songs.length; i++) {
          const song = songs[i]
          song.addEventListener('click', function() {
            console.log('click');
            audio.src = song.id + `?client_id=${token}`;
            audio.autoplay = true
          })
        }

    })

}
