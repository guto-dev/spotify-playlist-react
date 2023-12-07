import './App.css';
import {useEffect, useState} from "react";
import axios from "axios";

function App() {

  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID
  const REDIRECT_URI = "http://localhost:3000/callback" 
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"

  const [token, setToken] = useState("")
  const [playlist, setPlaylist] = useState("")

  useEffect( () => {
  
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

      if (!token && hash) {
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

        window.location.hash = ""
        window.localStorage.setItem("token", token)
      }

      setToken(token)

    }, [])
  
    const logout = () => {
      setToken("")
      setPlaylist([]);
      window.localStorage.removeItem("token")
    }

    const buscarPlaylists = async (e) =>{
      e.preventDefault()
      try {
        const { data } = await axios.get("https://api.spotify.com/v1/me/playlists", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
  
        setPlaylist(data.items)
      } catch (error) {
        console.error("Erro ao buscar playlists:", error)
      }
    }

    const renderPlaylists = () => {
      return (
        <div>
          <h2>Suas playlists:</h2>
          <ul>
            {playlist.map((playlist, index) => (
              <li key={index}>
                <strong>Playlist {index + 1}:</strong>
                <p>Nome: {playlist.name}</p>
                <p><a href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer">{playlist.external_urls.spotify}</a></p>
              </li>
            ))}
          </ul>
        </div>
      )
    }

    const handleLogin = () => {
      window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`;
    };

  return (
    <div className="App">
      <header className="App-header">
        <h1>App Playlist</h1>
        {!token ?

          <button onClick={handleLogin}>Logar com Spotify</button>
        : 
        <button onClick={logout}>Logout</button>}

          {token ?

          <form onSubmit={buscarPlaylists}>
          <button type={"submit"}>Search</button>
          </form>
          
          : <h2>Por favor, faça o login para acessar as funcionalidades</h2>
          }

          {playlist.length > 0 && renderPlaylists()}

      </header>
    </div>
  );
}

export default App;
