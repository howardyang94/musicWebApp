var tag = document.createElement('script');
tag.id = 'iframe-demo';
tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
let player = [], nextId
function onYouTubeIframeAPIReady() {
    // console.log(window.count);
    for(let i = 0; i < window.count; i++){
        const element = document.getElementById(`yp${i}`)
        if(!element) {
            console.log('no element yp', i)
            break
        }
        player[i] = new YT.Player(`yp${i}`, {
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            },
        });
    }
    // console.log(player)
}

function onPlayerReady(event) {
  console.log('onplayerReady', event.target.f.id)
}

function onPlayerStateChange(event) {
    console.log('onStateChange', event.target.f.id, event.data)
    if(event.data === YT.PlayerState.PLAYING) {
        nextId = event.target.j
        console.log('next', nextId)
        // set all other started videos to unstarted
        // viewcount for video goes up when user manually clicks on unstarted video
        for(let i = 0; i < player.length; i++) {
            if(player[i].getPlayerState() > 0 && i != nextId-1) {
                player[i].stopVideo();
            }
        }
        console.log(nextId)
    } else if (event.data == YT.PlayerState.ENDED && nextId < player.length) {
    // autoplay next video on page
        player[nextId].playVideo()
    }
}
