export async function fetchMoviesList() {
  const response = fetch(`https://yts.mx/api/v2/list_movies.json?limit=6`, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      return data || {};
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  return response;
}

export async function findMovie(searchString) {
  const response = fetch(
    `https://yts.mx/api/v2/list_movies.json?query_term=${searchString}`,
    {
      method: "GET",
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      return data || {};
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  return response;
}
