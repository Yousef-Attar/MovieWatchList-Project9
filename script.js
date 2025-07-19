const movieApi = "https://www.omdbapi.com/?apikey=635bb909"
const findFilm = document.getElementById("findFilm")
const searchList= document.getElementById("searchList")
const searchFilmEl = document.getElementById("searchFilm")

if(findFilm){
findFilm.addEventListener("submit" , e => {
    e.preventDefault()
    const searchFilm = searchFilmEl.value.trim()
    if (!searchFilm) return

    let innerHtml = ""
    searchList.innerHTML = ""
    
    fetch(`${movieApi}&s=${searchFilm}`)
    .then(res=> res.json())
    .then(data=>{
      if(!data.Search){
        searchList.classList.add("search-list")
        searchList.classList.remove("search-results")
        searchList.innerHTML = 
        `<h1>Unable to find what you’re looking for. Please try another search.</h1>`
      }
      else{
      const searchArray = data.Search || []
      searchList.classList.add("search-results")
      searchList.classList.remove("search-list")

      const promisesArray = searchArray.map(element =>
        fetch(`${movieApi}&i=${element.imdbID}`)
        .then(res => res.json())
        .then(data => {
            const poster = data.Poster !="N/A" && data.Poster ? data.Poster : "images/placeholder.jpg"
            innerHtml += `
                 <section class="flex-row result-movie">
                     <img src="${poster}" alt="poster of ${data.Title}">
                     <div class="flex-column movie-details">
                         <div class="flex-row">
                             <h1>${data.Title}</h1>
                             <div>
                                 <img src="images/star.png" alt="rating star yellow" width="15px">
                                 <span>${data.imdbRating}</span>
                             </div>
                         </div>
                         <div class="flex-row">
                             <span>${data.Runtime}</span>
                             <span>${data.Type}</span>
                             <div>
                                 <button class="add-btn" data-id="${data.imdbID}">+</button>
                                 <span>watchlist</span>
                             </div>
                         </div>
                         <p>
                             ${data.Plot}
                         </p>
                     </div>
                 </section>
                 <hr class="divider"></hr>
           `
        })
      )

      Promise.all(promisesArray).then(() => {
        searchList.innerHTML = innerHtml
      })

    }})
    .catch(err => {
      console.error(err)
      searchList.innerHTML = `<p>Something went wrong. Please try again later.</p>`
    })
})
}
//The Code below related to WATCHLIST page...
const watchlistContainer = document.getElementById("watchlistSection");
if(!localStorage.getItem("watchlist")){
  localStorage.setItem("watchlist" , JSON.stringify([]))
}
document.addEventListener('click' , (e) =>{
  if (e.target.classList.contains("add-btn")) {
  const movieId = e.target.dataset.id
  
  fetch(`${movieApi}&i=${movieId}`)
  .then(res=> res.json())
  .then(data =>{
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || []
    const alreadyAdded = watchlist.some(movie => movie.imdbID === data.imdbID)
    if(alreadyAdded){
      alert("This movie is already in your watchlist!")
      return
    }
    watchlist.push(data)
    localStorage.setItem("watchlist" , JSON.stringify(watchlist))
    alert(`${data.Title} added to your watchlist!`)
  })
}
else if(e.target.classList.contains("remove-btn")){
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  const deleteMovieId = e.target.dataset.id
  const updatedWatchlist = watchlist.filter((movie) =>{return movie.imdbID !== deleteMovieId})
  localStorage.setItem("watchlist" , JSON.stringify(updatedWatchlist))
  renderWatchlistSection()
}

})

  function renderWatchlistSection(){
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  let html = "";
  watchlist.forEach(movie => {
    html += `
      <section class="flex-row result-movie">
        <img src="${movie.Poster}" alt="poster of ${movie.Title}">
        <div class="flex-column movie-details">
          <div class="flex-row">
            <h1>${movie.Title}</h1>
            <div>
              <img src="images/star.png" alt="rating star yellow" width="15px">
              <span>${movie.imdbRating}</span>
            </div>
          </div>
          <div class="flex-row">
            <span>${movie.Runtime}</span>
            <span>${movie.Type}</span>
            <div>
              <button class="remove-btn" id=${movie.Title} data-id="${movie.imdbID}">-</button>
              <span>Remove</span>
            </div>
          </div>
          <p>${movie.Plot}</p>
        </div>
      </section>
      <hr class="divider">`;
  });
  watchlistContainer.innerHTML = html;
}
if (watchlistContainer) {
  renderWatchlistSection()
}