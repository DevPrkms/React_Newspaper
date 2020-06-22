import React from 'react';
import './App.css';
import axios from 'axios';

require('dotenv').config()

function App() {
    return (
        <div className="header-title">
            <h1 className="title-text">My <span className="news">News</span>paper</h1>
            <h2 className="location-text">"<strong id="location-name">{getLocation()}</strong>"</h2>
            <script type="text/javascript"
                    src="//dapi.kakao.com/v2/maps/sdk.js?appkey=ee5034816b5ab89d5e485be488b3f1cf&libraries=services"></script>
        </div>
    );
}

function getLocation() {
    navigator.geolocation.getCurrentPosition(function (position) {
        const loc = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        }

        let address = "";

        let option = {
            headers: {
                Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_RESTAPI_KEY}`,
            }
        }

        axios
            .get(`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${loc.lon}&y=${loc.lat}&input_coord=WGS84`, option)
            .then(function (response) {
                console.log(response.data)
                address = response.data.documents[0].address.region_1depth_name + " " + response.data.documents[0].address.region_2depth_name;
                document.getElementById("location-name").innerHTML = address;
            })
        // https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${loc.lon}&y=${loc.lat}&input_coord=WGS84
        // process.env.REACT_APP_KAKAO_API_KEY // JAVASCRIPT
        // process.env.REACT_APP_KAKAO_RESTAPI_KEY // RESTAPI

    });
}

export default App;
