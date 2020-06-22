import React from 'react';
import './App.css';
import axios from 'axios';

require('dotenv').config()

function App() {
    return (
        <div className="header-title">
            <h1 className="title-text">My <span className="news">News</span>paper</h1>
            <h2 className="location-text">"<strong id="location-name">{getLocation()}</strong>"</h2>
            <div id="newscontents">
            </div>
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
                address = response.data.documents[0].address.region_1depth_name + " " + response.data.documents[0].address.region_2depth_name;
                document.getElementById("location-name").innerHTML = address;

                axios
                    .get(`/newscrawl?address=${address}`)
                    .then(function (response) {
                        if(response.data.length > 0) {
                            let HTML = "";
                            for(let i=0; i<response.data.length; i++) {
                                HTML += `<div class="newswrapper">`;
                                HTML += `<a href="${response.data[i].article}">`;
                                HTML += `<h3 class="news-title">${response.data[i].title}</h3>`;
                                HTML += `<span class="news-contents">${response.data[i].contents}</span>`;
                                HTML += `</a>`;
                                HTML += `</div>`;
                                document.getElementById("newscontents").innerHTML = HTML;
                            }
                        }
                    })
            })
        // https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${loc.lon}&y=${loc.lat}&input_coord=WGS84
        // process.env.REACT_APP_KAKAO_API_KEY // JAVASCRIPT
        // process.env.REACT_APP_KAKAO_RESTAPI_KEY // RESTAPI


    });
}

export default App;
