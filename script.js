const movieApi = "http://www.omdbapi.com/?apikey=635bb909"
const findFilm = document.getElementById("findFilm")
const searchListEl= document.getElementById("searchList")
const searchFilmEl = document.getElementById("searchFilm")
findFilm.addEventListener("submit" , e => {
    e.preventDefault()
    const searchFilm = searchFilmEl.value
    fetch(`${movieApi}&s=${searchFilm}`)
    .then(res=> res.json())
    .then(data=> console.log(data))
})