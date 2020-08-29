import React, { useEffect, useState } from "react";

import { fetchMoviesList, findMovie } from "../libs/apis";
import Loader from "../images/loader.gif";
import Chart from "../images/chart-bar.svg";
import list from "../images/list.svg";
import search from "../images/search.svg";
import user from "../images/user.svg";

import "./styles.scss";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [searchString, setSearchString] = useState("");
  const [errorId, setErrorId] = useState(null);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (!navigator.onLine) {
      const storedMovies = JSON.parse(localStorage.getItem("moviesList"));
      setMovies(storedMovies);
    } else {
      getMoviesList();
      setOffline(false);
    }
  }, []);

  const getMoviesList = () => {
    try {
      setLoading(true);
      fetchMoviesList().then((res) => {
        if (res && res.status === "ok") {
          const moviesList =
            res.data &&
            res.data.movies &&
            res.data.movies.map((movie) => {
              return {
                id: movie.id,
                title: movie.title,
                coverImage: movie.medium_cover_image,
                year: movie.year,
              };
            });
          localStorage.setItem(
            "moviesList",
            JSON.stringify(moviesList.slice(0, 4))
          );
          setMovies(moviesList);
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  const getSearchResults = async (key) => {
    setOffline(false);
    try {
      if (key === "Enter") {
        if (!navigator.onLine) {
          setOffline(true);
          setSearchString("");
        } else {
          setLoading(true);
          findMovie(searchString).then((res) => {
            if (res && res.status === "ok") {
              const moviesList =
                res.data &&
                res.data.movies &&
                res.data.movies.map((movie) => {
                  return {
                    id: movie.id,
                    title: movie.title,
                    coverImage: movie.medium_cover_image,
                    year: movie.year,
                  };
                });
              setMovies(moviesList);
              setSearchString("");
              setLoading(false);
            } else {
              setLoading(false);
              setSearchString("");
            }
          });
        }
      }
    } catch (e) {
      setLoading(false);
      setSearchString("");
    }
  };

  const renderMovieCards = () => {
    return (movies || []).length > 0
      ? movies.map((movie) => {
          return (
            <div
              style={{ display: movie.id === errorId ? "none" : "block" }}
              key={movie.id}
              className="movie-card"
            >
              <div className="img-container">
                <img
                  src={movie.coverImage}
                  alt=""
                  onError={() => setErrorId(movie.id)}
                />
              </div>
              <div className="details">
                <div className="title">{movie.title}</div>
                <div className="year">{movie.year}</div>
              </div>
            </div>
          );
        })
      : !loading && (
          <div className="error-msg">No Search Results Found...!</div>
        );
  };

  return (
    <div className="home-page">
      <header>
        <div className="left-side">Sample</div>
        <div className="right-side">
          <span>4K</span>
          <img src={Chart} alt="" />
          <img src={list} alt="" />
          <img src={user} alt="" />
        </div>
      </header>
      <section className="main-container">
        <section className="first-container">
          <div className="search-area">
            <input
              onChange={(e) => setSearchString(e.target.value)}
              onKeyPress={(e) => getSearchResults(e.key)}
              value={searchString}
            />
            <img
              src={search}
              alt=""
              onClick={() => getSearchResults("Enter")}
            />
            {offline && <div className="error-msg">You are Offline!</div>}
          </div>
        </section>
        <section className="second-container">
          {loading && (
            <div className="loader-overlay">
              <img src={Loader} alt="" />
            </div>
          )}
          {renderMovieCards()}
        </section>
      </section>
    </div>
  );
};

export default App;
