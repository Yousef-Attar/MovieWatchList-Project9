const movieApi = "http://www.omdbapi.com/?apikey=635bb909"
const findFilm = document.getElementById("findFilm")
const searchList= document.getElementById("searchList")
const searchFilmEl = document.getElementById("searchFilm")

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
            const poster = data.Poster !=="N/A" ? data.Poster : "images/placeholder.jpg"
            innerHtml += `
                 <section class="flex-row result-movie">
                     <img src="${poster}" alt="poster for the movie">
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
                                 <button>+</button>
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

// const movieApi = "http://www.omdbapi.com/?apikey=635bb909";
// const findFilm = document.getElementById("findFilm");
// const searchList = document.getElementById("searchList");
// const searchFilmEl = document.getElementById("searchFilm");

// findFilm.addEventListener("submit", e => {
//   e.preventDefault();
//   const query = searchFilmEl.value.trim();
//   if (!query) return;

//   let innerHtml = "";
//   searchList.innerHTML = "";
//   searchList.classList.add("search-results");
//   searchList.classList.remove("search-list");

//   fetch(`${movieApi}&s=${encodeURIComponent(query)}`)
//     .then(res => res.json())
//     .then(data => {
//       const searchArray = data.Search || [];

//       const detailPromises = searchArray.map(element =>
//         fetch(`${movieApi}&i=${element.imdbID}`)
//           .then(res => res.json())
//           .then(movie => {
//             // build your snippet
//             const poster = movie.Poster !== "N/A"
//               ? movie.Poster
//               : "images/placeholder.png";
//             innerHtml += `
//               <section class="flex-row result-movie">
//                 <img src="${poster}"
//                      alt="poster for ${movie.Title}"
//                      onerror="this.src='images/placeholder.png'">
//                 <div class="flex-column movie-details">
//                   <div class="flex-row">
//                     <h1>${movie.Title}</h1>
//                     <div>
//                       <img src="images/star.png" alt="rating star" width="15px">
//                       <span>${movie.imdbRating}</span>
//                     </div>
//                   </div>
//                   <div class="flex-row">
//                     <span>${movie.Runtime}</span>
//                     <span>${movie.Type}</span>
//                     <div>
//                       <button>+</button>
//                       <span>watchlist</span>
//                     </div>
//                   </div>
//                   <p>${movie.Plot}</p>
//                 </div>
//               </section>
//               <hr class="divider">
//             `;
//           })
//       );

//       Promise.all(detailPromises).then(() => {
//         searchList.innerHTML = innerHtml;
//       });
//     })
//     .catch(err => {
//       console.error(err);
//       searchList.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
//     });
// });
