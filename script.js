const API_KEY = "19f84e11932abbc79e6d83f82d6d1045";

// Called whe the page is loaded
window.onload = () => {
  getOriginals();
  getTrendingNow();
  getTopRated();
  getGenres();
};

async function getMovieTrailer(id) {
  var url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US`;
  return await fetch(url).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("something went wrong");
    }
  });
}

const setTrailer = (trailers) => {
  const iframe = document.getElementById("movieTrailer");
  const movieNotFound = document.querySelector(".movieNotFound");
  if (trailers.length > 0) {
    movieNotFound.classList.add("d-none");
    iframe.classList.remove("d-none");
    iframe.src = `https://www.youtube.com/embed/${trailers[0].key}`;
  } else {
    iframe.classList.add("d-none");
    movieNotFound.classList.remove("d-none");
  }
};

const setMovieDescription = (movieDescription) => {
  console.log(movieDescription);
  const titleSection = `<div class="modal__movie__description"><h5>Title</h5><h5>Description:</h5><h5>Release Date:</h5><h5>Rating:</h5></div>`;
  var descriptionSection = `<div class="modal_desc">`;
  const movieTitle = `<h5>${movieDescription.movie_title}</h5>`;
  const overview = `<h5>${movieDescription.overview}</h5>`;
  const releaseDate = `<h5>${movieDescription.release_date}</h5>`;
  const rating = `<h5>${movieDescription.rating}</h5>`;
  descriptionSection =
    descriptionSection +
    movieTitle +
    overview +
    releaseDate +
    rating +
    `</div>`;
  const movieDetails = titleSection + descriptionSection;

  document.getElementById("movie__desc").innerHTML = movieDetails;
};

const handleMovieSelection = (e, movieDescription) => {
  const id = e.target.getAttribute("data-id");
  const iframe = document.getElementById("movieTrailer");
  // here we need the id of the movie
  getMovieTrailer(id).then((data) => {
    const results = data.results;
    const youtubeTrailers = results.filter((result) => {
      if (result.site == "YouTube" && result.type == "Trailer") {
        return true;
      } else {
        return false;
      }
    });
    setTrailer(youtubeTrailers);
    setMovieDescription(movieDescription);
  });

  // open modal
  $("#trailerModal").modal("show");
  // we need to call the api with the ID
};

function showMovies(movies, element_selector, path_type) {
  var moviesEl = document.querySelector(element_selector);
  for (var movie of movies.results) {
    var imageElement = document.createElement("img");
    imageElement.setAttribute("data-id", movie.id);
    imageElement.src = `https://image.tmdb.org/t/p/original${movie[path_type]}`;
    let movieDescription = {
      movie_title:
        movie.name ||
        movie.original_name ||
        movie.original_title ||
        movie.name ||
        "",
      overview: movie.overview,
      release_date: movie.first_air_date,
      rating: movie.vote_average,
    };
    imageElement.addEventListener("click", (e) => {
      handleMovieSelection(e, movieDescription);
    });
    moviesEl.appendChild(imageElement);
  }
}

function fetchMoviesBasedOnGenre(genreId) {
  var url = "https://api.themoviedb.org/3/discover/movie?";
  url +=
    "api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1";
  url += `&with_genres=${genreId}`;
  return fetch(url).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("something went wrong");
    }
  }); // returns a promise already
}

function fetchMovies(url, element_selector, path_type) {
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("something went wrong");
      }
    })
    .then((data) => {
      showMovies(data, element_selector, path_type);
    })
    .catch((error_data) => {
      console.log(error_data);
    });
}

function showMoviesGenres(genres) {
  genres.genres.forEach(function (genre) {
    // get list of movies
    var movies = fetchMoviesBasedOnGenre(genre.id);
    movies
      .then(function (movies) {
        showMoviesBasedOnGenre(genre.name, movies);
      })
      .catch(function (error) {
        console.log("BAD BAD", error);
      });
    // show movies based on genre
  });
}

function showMoviesBasedOnGenre(genreName, movies) {
  let allMovies = document.querySelector(".movies");
  let genreEl = document.createElement("div");
  genreEl.classList.add("movies__header");
  genreEl.innerHTML = `
      <h2>${genreName}</h2>
  `;
  let moviesEl = document.createElement("div");
  moviesEl.classList.add("movies__container");
  moviesEl.setAttribute("id", genreName);

  for (var movie of movies.results) {
    var imageElement = document.createElement("img");
    imageElement.setAttribute("data-id", movie.id);
    imageElement.src = `https://image.tmdb.org/t/p/original${movie["backdrop_path"]}`;

    imageElement.addEventListener("click", (e) => {
      handleMovieSelection(e);
    });
    moviesEl.appendChild(imageElement);
  }

  allMovies.appendChild(genreEl);
  allMovies.appendChild(moviesEl);
}

function getGenres() {
  var url =
    "https://api.themoviedb.org/3/genre/movie/list?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US";
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("something went wrong");
      }
    })
    .then((data) => {
      showMoviesGenres(data);
    })
    .catch((error_data) => {
      console.log(error_data);
    });
}

function getOriginals() {
  var url =
    "https://api.themoviedb.org/3/discover/tv?api_key=19f84e11932abbc79e6d83f82d6d1045&with_networks=213";
  fetchMovies(url, ".original__movies", "poster_path");
}

function getTrendingNow() {
  var url =
    "https://api.themoviedb.org/3/trending/movie/week?api_key=19f84e11932abbc79e6d83f82d6d1045";
  fetchMovies(url, "#trending", "backdrop_path");
}

function getTopRated() {
  var url =
    "https://api.themoviedb.org/3/movie/top_rated?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US&page=1";
  fetchMovies(url, "#top_rated", "backdrop_path");
}
