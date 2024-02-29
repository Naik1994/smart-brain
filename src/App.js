import React from 'react';
import './App.css';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Logo from './components/Logo/Logo';
import Navigation from './components/Navigation/Navigation';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

const PAT = process.env.REACT_APP_PAT;
const USER_ID = process.env.REACT_APP_USER_ID;       
const APP_ID = process.env.REACT_APP_APP_ID;
const MODEL_ID = process.env.REACT_APP_MODEL_ID;
const MODEL_VERSION_ID = process.env.REACT_APP_MODEL_VERSION_ID;

const initialState = {
  search: "",
  inputImage: "",
  box: [],
  route: "signin",
  isSignedIn: false,
  profile: {
    id: "",
    name: "",
    email: "",
    entries: "",
    joined: ""
  }
};

class App extends React.Component {
  constructor() {
    super();
    this.state = initialState;
  }

  searchInput = (event) => {
    this.setState({search: event.target.value});
  }

  calculateLocation = (region) => {
    const image = document.getElementById('faceRec');
    const boundingBox = region.region_info.bounding_box;
    return {
      left_col: Number(boundingBox.left_col.toFixed(3)) * Number(image.width),
      top_row: Number(boundingBox.top_row.toFixed(3)) * Number(image.height),
      right_col: Number(image.width) - (Number(boundingBox.right_col.toFixed(3)) * Number(image.width)),
      bottom_row: Number(image.height) - (Number(boundingBox.bottom_row.toFixed(3)) * Number(image.height))
    }
  }

  displayFaceBox = (boxes) => {
    this.setState({box: boxes});
  } 

  onButtonClick = () => {
    this.setState({ inputImage: this.state.search });
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
      },
      body: JSON.stringify({
        "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
        },
        "inputs": [
          {
            "data": {
              "image": {
                "url": this.state.search
              }
            }
          }
        ]
      })
    })
      .then(response => response.json())
      .then(result => {
        const regions = result.outputs[0].data.regions;
        const boxes = [];
        regions.forEach(region => {
          if (region.data.concepts[0].name === "Human face") {
            boxes.push(this.calculateLocation(region));
          }
        });
        this.displayFaceBox(boxes);

        fetch(`${process.env.REACT_APP_BACKEND_SERVER}/image`, {
          method: "PUT",
          headers: {"content-type": "application/json"},
          body: JSON.stringify({id: this.state.profile.id})
        })
        .then(response => response.json())
        .then(data => {
          if (data.entries) {
            this.setState(Object.assign(this.state.profile, {entries: data.entries}))
          }
        })
      })
      .catch(error => console.log('error', error));
  }

  changeRoute = (route) => {
    if (route === "home") {
      this.setState({isSignedIn: true});
    } else {
      this.setState(initialState);
    }
    this.setState({route});
  }

  updateProfile = (data) => {
    this.setState({
      profile: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    });
  }

  render() {
    const { isSignedIn, box, inputImage, route } = this.state;
    return (
      <>
        <div className="App">
          <Navigation isSignedIn={isSignedIn} onRouteChange={this.changeRoute} />
          {
            route === "home" ?
            <>
                <Logo />
                <Rank user={this.state.profile} />
                <ImageLinkForm onSearch={this.searchInput} onClick={this.onButtonClick} />
                <FaceRecognition box={box} imageUrl={inputImage} />
              </>
            :
              ( route === "signin" ?
                <SignIn updateProfile={this.updateProfile} onRouteChange={this.changeRoute} />
              :
                <Register updateProfile={this.updateProfile} onRouteChange={this.changeRoute} />
              )
          }
        </div>
        <ParticlesBg type="cobweb" color="#ffffff" bg={true} />
      </>
    );
  }
}

export default App;
