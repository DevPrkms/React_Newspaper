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

axios
    .get("/getNews")
    .then(function(response){
    console.log(response.data);
})

function getLocation() {
    navigator.geolocation.getCurrentPosition(function (position) {
        const loc = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        }

        let address = "";

        let page = 0;

        let cntcnt = 0;

        let option = {
            headers: {
                Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_RESTAPI_KEY}`,
            }
        }

        // 접속 로직 수정해야함
        // 1. 크롤링 요청 및 실행로직 분리 - 부하가 적으니 이게 맞을듯

        axios
            .get(`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${loc.lon}&y=${loc.lat}&input_coord=WGS84`, option)
            .then(function (response) {
                address = response.data.documents[0].address.region_1depth_name + " " + response.data.documents[0].address.region_2depth_name;
                document.getElementById("location-name").innerHTML = address;

                axios
                    .get(`/newscrawl?address=${address}&page=${page}`)
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

                function getDocumentHeight() {
                    const body = document.body;
                    const html = document.documentElement;

                    return Math.max(
                        body.scrollHeight, body.offsetHeight,
                        html.clientHeight, html.scrollHeight, html.offsetHeight
                    )
                }

                function getScrollTop() {
                    return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
                }

                function appendHtml(el, str) {
                    let div = document.createElement('div');
                    div.innerHTML = str;
                    while (div.children.length > 0) {
                        el.appendChild(div.children[0]);
                    }
                }

                window.onscroll = function() {
                    if (getScrollTop() < getDocumentHeight() - window.innerHeight) return;
                    page ++
                    axios
                        .get(`/newscrawl?address=${address}&page=${page}`)
                        .then(function (response) {
                            if (response.data.length > 0) {
                                let HTML = "";
                                for (let i = 0; i < response.data.length; i++) {
                                    HTML += `<div class="newswrapper">`;
                                    HTML += `<a href="${response.data[i].article}">`;
                                    HTML += `<h3 class="news-title">${response.data[i].title}</h3>`;
                                    HTML += `<span class="news-contents">${response.data[i].contents}</span>`;
                                    HTML += `</a>`;
                                    HTML += `</div>`;
                                    // document.getElementById("newscontents").appendChild(HTML);
                                }
                                appendHtml(document.getElementById("newscontents"), HTML);
                            }
                        })
                }
            })
        // https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${loc.lon}&y=${loc.lat}&input_coord=WGS84
        // process.env.REACT_APP_KAKAO_API_KEY // JAVASCRIPT
        // process.env.REACT_APP_KAKAO_RESTAPI_KEY // RESTAPI


    });
}

export default App;
