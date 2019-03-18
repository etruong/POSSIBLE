import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../src/index.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: "1233291715",
      playlist: null,
      currentPlaylist: "",
      playlistTracks: null,
      playlistAudioInfo: null,
      access_token: "",
      error: ""
    }
  }

  submitUser = () => {
    if (this.state.user === "1233291715") { // change to 1233291715
      let url = "./data/list-playlist.JSON";
      fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.setState({ user: "", data: data, error: "", currentPlaylist: "", playlist: null });
          this.generateUserPlaylist();

        })
        .catch((error) => {
          this.setState({ error: error.message });
          console.log(error);
        });
    } else {
      this.setState({ error: "No user found with that user ID" });
    }
  }

  updateUser = (user) => {
    this.setState({ user: user });
  }

  updateSelectedPlaylist = (playlist) => {
    this.setState({ selectedPlaylist: playlist, playlistTracks: null, playlistAudioInfo: null});
    if (playlist != "") {
      this.generatePlaylistInfo(playlist);
      this.generatePlaylistAudio(playlist);
    }
  }

  generateUserPlaylist = () => {
    let playlistNames = [];
    this.state.data.items.forEach((item) => {
      playlistNames.push({ name: item.name, id: item.id });
    });
    this.setState({ playlist: playlistNames });
  }

  generatePlaylistInfo = (playlist) => {
    let url = "./data/playlist-tracks/"+ playlist + ".JSON";
    fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log (playlist);
          
          let list = "";
          data.tracks.items.forEach((track) => {
            list = list + track.track.id + ",";
          })
          console.log (list);

          this.setState({playlistTracks: data.tracks.items});
        })
        .catch((error) => {
          this.setState({ error: error.message });
          console.log(error);
        });
  }

  generatePlaylistAudio = (playlist) => {
    let url = "./data/audio-feature/"+ playlist + "-audio-feature.JSON";
    fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.setState({playlistAudioInfo: data.audio_features});
        })
        .catch((error) => {
          this.setState({ error: error.message });
          console.log(error);
        });
  }

  generateVisualizeDataInfo = () => {
    let trackInfo = [];
    this.state.playlistTracks.forEach((track) => {
      let trackID = track.track.id;
      let trackAudio = this.state.playlistAudioInfo.filter((item) => {
        return (trackID == item.id);
      });
      trackInfo.push({track: track.track, audio: trackAudio[0]});
    });
    return trackInfo;
  }

  render() {
    let error = this.state.error;
    if (error != "") {
      error = <p className="alert alert-danger mt-2">{error}</p>
    }

    let visualization = null;
    if (this.state.playlistAudioInfo != null && this.state.playlistTracks != null) {
      visualization = <DataDisplay data={this.generateVisualizeDataInfo()} />;
    }

    return (
      <div className="container">
        <Header />
        <main>

          <section>
            {/* Input User ID */}
            <IDInput user={this.state.user} updateUser={this.updateUser} submitUser={this.submitUser} />

            {/* Error Occurrence */}
            {error}

            {/* Generating Playlist based on user ID */}
            <PlaylistOptions
              playlistName={this.state.playlist}
              selectedPlaylist={this.state.currentPlaylist}
              updateCurrentPlaylist={this.updateSelectedPlaylist} />
          </section>

          <section>
            {visualization}
          </section>

        </main>
      </div>
    );
  }
}

export default App;

class Header extends Component {

  render() {
    return (
      <div className="jumbotron">
        <h1>POSSIBLE Spotify Application</h1>
        <p className="sub-heading">
          Please start by inserting a user id (try: 1233291715) below: 
        </p>
      </div>
    );
  }

}

class IDInput extends Component {

  handleInput = (event) => {
    console.log(event.target.value);
    this.props.updateUser(event.target.value);
  }

  render() {

    return (
      <div className="input-group">
        <div className="input-group-prepend">
          <label className="input-group-text">User ID</label>
        </div>
        <input className="form-control"
          value={this.props.user}
          onChange={this.handleInput}
          type="text" />
        <div className="input-group-append">
          <button className="btn" onClick={this.props.submitUser} >Find Playlists</button>
        </div>
      </div>
    );
  }
}

class PlaylistOptions extends Component {

  updateCurrentPlaylist = (event) => {
    this.props.updateCurrentPlaylist(event.target.value);
  }

  render() {

    if (this.props.playlistName != null) {
      let options = this.props.playlistName.map((playlist) => {
        return (<option key={playlist.id} value={playlist.id}>{playlist.name}</option>);
      });
      return (
        <div className="input-group mt-3">
          <div className="input-group-prepend">
            <span className="input-group-text">Select a playlist</span>
          </div>

          <select className="custom-select" selected={this.props.selectedPlaylist} onChange={this.updateCurrentPlaylist} >
            <option defaultChecked value="">Click Me</option>
            {options}
          </select>
        </div>
      );
    } else {
      return (null);
    }
  }
}

class DataDisplay extends Component {

  render () {

    let header = ["Track Name", "Artist", "Album", "Energy", "Valence"];
    header = header.map ((head) => {
      return <th key={head}>{head}</th>;
    })

    console.log (this.props.data);

    let body = this.props.data.map((track) => {
      return (
        <tr key={track.audio.id}>
          <td>{track.track.name}</td>
          <td>{track.track.artists[0].name}</td>
          <td>{track.track.album.name}</td>
          <td>{track.audio.energy}</td>
          <td>{track.audio.valence}</td>
        </tr>
      );
    });

    return (
      <table className="table mt-5 text-white">
        <thead className="header">
          <tr>
            {header}
          </tr>
        </thead>
        <tbody>
          {body}
        </tbody>
      </table>
    );
  }

}
