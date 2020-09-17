window.onload = () => {
  addMovies();
};
//Add movies to the front end

function addMovies() {
  //<img src="https://image.tmdb.org/t/p/original//scZlQQYnDVlnpxFTxaIv2g0BWnL.jpg" />;
  // Add image to the original__movies element

  var moviesEl = document.querySelector(".original__movies");
  console.log(moviesEl);

  moviesEl.innerHTML += `<img src="https://image.tmdb.org/t/p/original//scZlQQYnDVlnpxFTxaIv2g0BWnL.jpg" />`;
  moviesEl.innerHTML += `<img src="https://image.tmdb.org/t/p/original//scZlQQYnDVlnpxFTxaIv2g0BWnL.jpg" />`;
  moviesEl.innerHTML += `<img src="https://image.tmdb.org/t/p/original//scZlQQYnDVlnpxFTxaIv2g0BWnL.jpg" />`;
}
