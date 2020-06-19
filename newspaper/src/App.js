import React from 'react';
import './App.css';
require('dotenv').config()

function App() {
    return (
        <div className="header-title">
            <h1 className="title-text">My <span className="news">News</span>paper</h1>
            <h2 className="location-text">"<strong id="location-name">{getLocation()}</strong>"</h2>
            <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=ee5034816b5ab89d5e485be488b3f1cf&libraries=services"></script>
        </div>
    );
}

function getLocation() {
    navigator.geolocation.getCurrentPosition(function (position) {
        const loc = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        }

        fetch(`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${loc.lon}&y=${loc.lat}&input_coord=WGS84`, {
            headers: {
                Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_API_KEY}`
            }
        })


        document.getElementById("location-name").innerHTML = `위도 : ${loc.lat}, 경도 : ${loc.lon}`;
    });
}
export default App;
