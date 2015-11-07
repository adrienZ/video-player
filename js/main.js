var pause = true,
    minutes = 0,
    seconds = 0,
    hours = 0,
    speedValues = [0, 1, 2, 3, 4, 5, 6, 9, , , 14], //not very proud of this, check line 426 for explanations
    totalTime = undefined,
    isFullscreen = false,
    resume = 0,
    hd = false, // i do not know how to test an internet connection speed
    countdown = 5, //not the final https://www.youtube.com/watch?v=9jK-NcRmVcw
    player = {}; // the choosen one




player.container = document.querySelector('.embedded-container');
var playerQuery = function (query) {
    return player.container.querySelector(query);
}; // useful shortener
player.video = playerQuery('.embedded-video'),
    player.remote = playerQuery('.player-remote');

//
//
// THE BASIC FEATURES + SOME CSS, THE WEIRD innerHTML COMES FROM THE USE OF A WEBFONT
//
//
play_pause = function () {
    if (pause == false) {
        player.video.pause();
        pause = true;
        playerQuery('.play-pause').innerHTML = 'L';

        player.video.classList.add('blur');
        playerQuery('.follow').classList.add('freeze');
        playerQuery('.dot').classList.add('freeze');


    } else {
        player.video.play();
        pause = false;
        playerQuery('.play-pause').innerHTML = 'J';
        player.video.classList.remove('blur');
        playerQuery('.follow').classList.remove('freeze');
        playerQuery('.dot').classList.remove('freeze');

    }

};
playerQuery('video').addEventListener('click', function (e) {
        play_pause();
    }),
    playerQuery('.play-pause').addEventListener('click', function () {
        play_pause();
    }),
    //
    //
    // CATCHING THE DATA I NEED
    //
    //
    player.video.addEventListener('loadedmetadata', function () {
        bufferBar();
        // seconds to date format
        totalTime = parseInt(player.video.duration);
        while (totalTime > 0) {
            if (totalTime > 3600) {
                hours++;
                totalTime -= 3600;
            } else if (totalTime >= 60) {
                minutes++;
                totalTime -= 60;
            } else if (totalTime >= 1) {
                seconds++
                totalTime -= 1;
            }
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        } else {
            minutes = minutes;

        };

        minutes += ':';
        hours += ':';

        if (seconds < 10) {
            seconds = '0' + seconds;
        } else {
            seconds = seconds;
        };
        if (hours < 10 && hours > 0) {
            hours = '0' + hours;
        } else if (hours > 9) {
            hours = hours;
        } else {
            hours = '';
        };

        play_pause();
    });

//
//
// I'M NOT SURE IF THIS ONE WORKS, BUT IT SHOULD
//
//
function bufferBar() {
    if (player.video.buffered.length > 0) {
        playerQuery('.buffer').style.width = (player.video.buffered.end(0) * 100 / player.video.duration) + 1 + '%';
    }
}
player.video.addEventListener("progress", function () {
    bufferBar();
});

player.video.addEventListener("canplaytrought", function () {
    bufferBar();
});


//
//
// VOLUME GESTION PART
//
//

// changing the input volume position
function volumeValue(newValue) {
    player.video.volume = (newValue) / 100;
    if (player.video.volume == 0) {
        player.video.muted == true;
        playerQuery('.mute').innerHTML = 'V'

    } else {
        playerQuery('.mute').innerHTML = 'W';
    }

}

// clicking directly on the icon will mute the video
playerQuery('.mute').addEventListener('click', function () {
        if (player.video.muted == true) {
            player.video.muted = false;
            playerQuery('.mute').innerHTML = 'W';
            playerQuery(".volume").value = player.video.volume * 100;


        } else {
            playerQuery('.mute').innerHTML = 'V'
            playerQuery('.volume').value = 0;

            player.video.muted = true;
        }
    }),
    playerQuery('.settings').addEventListener('click', function (e) {
        playerQuery('.settings-ui').classList.toggle('expand');
        if (playerQuery('.settings-ui').classList.contains('expand')) {
            playerQuery('.settings').style.transform = 'rotate(20deg)'
        } else {
            playerQuery('.settings').style.transform = 'rotate(0deg)'

        }
    }),


    //
    // THIS PART CONTAIN ALL THE EVENT LISTENER OF ALL THE BUTTONS 
    //
    //    
    //    
    //    
    //


    // NOT ONLY FULLSCREEN THE VIDEO BUT THE ENTIER PLAYER
    playerQuery('.fullscreen').addEventListener('click', function () {
        if (player.video.requestFullscreen) {
            playerQuery('.core').requestFullscreen();
        } else if (player.video.mozRequestFullScreen) {
            playerQuery('.core').mozRequestFullScreen();
        } else if (player.video.webkitRequestFullScreen) {
            playerQuery('.core').webkitRequestFullScreen();
        } else if (player.video.msRequestFullscreen) {
            playerQuery('.core').msRequestFullscreen();
        }
    }),
    // well, my player does not fullfill the screen, it get even smaller than before !!



    // this trick is 100% improvable, but it will do the work
    playerQuery('.embedded-player-az').addEventListener('mousemove', function () {
        if ((!document.mozFullScreen && !document.webkitIsFullScreen)) {
            //FullScreen is disabled
            player.video.classList.remove('full');
            document.body.classList.remove('full');
        } else {
            //FullScreen is enabled
            player.video.classList.add('full');
            document.body.classList.add('full');

        }
    })

// on this one, the video stop and back to begin on firefox and safari, but it work on chrome i'm a little bit confuse why.
playerQuery('.video-change').addEventListener('click', function () {
    // backup currentTime
    resume = player.video.currentTime;

    // unluckly, this innerHTML erase the webm and ogg videos but i needed to be sure the right video was playing.
    if (hd == false) {
        playerQuery('.video-change').getElementsByTagName('p')[0].innerHTML = 'SD';
        player.video.innerHTML = '<source src="http://adrienzaganelli.com/projects/video-player/videos/norway720.mp4" type="video/mp4">';
        hd = true;

    } else {
        player.video.innerHTML = '<source src="http://adrienzaganelli.com/projects/video-player/videos/norway360.mp4" type="video/mp4">';
        playerQuery('.video-change').getElementsByTagName('p')[0].innerHTML = 'HD';
        hd = false;

    }
    player.video.innerHTML += '<track src="adrienzaganelli.com/video-player/caption/video.vtt" kind="subtitles" mode="showing" default>';
    playerQuery(".subtiles").style.display = "none" // is undefined or blocked
    player.video.load();
    // restore previous currentTime
    player.video.currentTime = resume;
    //only work on chrome, on the others broswer it show multiples icons instead of text #grumpyCode
    seconds = hours = minutes = 0;

    pause = false;
    play_pause();
});


// WEB VTT ISN'T EASY TO TEST ON CHROME, severals mindblows because of this. 
playerQuery('.subtiles').addEventListener('click', function () {
    if (player.video.textTracks[0].mode == 'showing') {
        player.video.textTracks[0].mode = 'disabled';
    } else {
        player.video.textTracks[0].mode = 'showing';
    }
    playerQuery('.subtiles').classList.toggle('disabled')
});





// 
//    
//  /!\   i coded this before your seek bar demo, this solution isn't as good however it work as well  /!\
//
//

//requirements
elemWidth = parseFloat(getComputedStyle(playerQuery('.embedded-player-az')).width),
    theTarget = playerQuery('.dot'),
    container = playerQuery('.progressVid');

function getClickPosition(e) {
    var parentPosition = getPosition(e.currentTarget);
    var xPosition = e.clientX - parentPosition.x - (theTarget.clientWidth / 2);
    var yPosition = e.clientY - parentPosition.y - (theTarget.clientHeight / 2);
    player.video.currentTime = (xPosition / elemWidth) * player.video.duration;
    playerQuery('.dot').style.transition = 'none';
    playerQuery('.follow').style.transition = 'none';
    playerQuery('.dot').style.left = (player.video.currentTime / player.video.duration) + '%';
    playerQuery('.follow').style.width = ((player.video.currentTime / player.video.duration) * 100) + 1 + '%';
}

function getPosition(element) {
    var xPosition = 0;
    var yPosition = 0;
    while (element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }
    return {
        x: xPosition,
        y: yPosition
    };
};

// onclick call of the functions above
playerQuery('.progressVid').addEventListener('click', getClickPosition, false);


// let's see a beautiful gradient
player.video.addEventListener('playing', function () {
    bufferBar();
    videoProgress();
});


//
//    
//  I DOES NOT LISTEN TO PROGRESS EVENT BECAUSE IT CREATES TO MANY BUGS THIS IS A FALLBACK.
//
//
function videoProgress() {
    // set up time convertion of total time


    setInterval(function () {
        //progress Bar style
        playerQuery('.dot').style.left = 'calc(' + (player.video.currentTime / player.video.duration) * 100 + '%)';
        //the +1 is here to fill space between .space and .dot
        playerQuery('.follow').style.width = ((player.video.currentTime / player.video.duration) * 100) + 1 + '%';


        // avoid .dot from overflowwing
        if (playerQuery('.dot').style.left > 'calc(98%') {
            playerQuery('.dot').style.visibility = 'hidden';
        }

        //
        //    
        //  SET UP TIME OF CURRENT TIME, Cseconds = Current seconds.
        //
        //

        //parse seconds into hours format
        var actualTime = parseInt(player.video.currentTime),
            Cminutes = 0,
            Cseconds = 0,
            Chours = 0;
        while (actualTime > 0) {
            if (totalTime > 3600) {
                Chours++;
                actualTime -= 3600;
            } else if (actualTime >= 60) {
                Cminutes++;
                actualTime -= 60;
            } else if (actualTime >= 1) {
                Cseconds++
                actualTime -= 1;
            }
        }


        // fixing 0 display issues
        if (Cminutes < 10) {
            Cminutes = '0' + Cminutes;
        } else {
            Cminutes = Cminutes;
        };

        Cminutes += ':';
        Chours += ':';

        if (Cseconds < 10) {
            Cseconds = '0' + Cseconds;
        } else {
            Cseconds = Cseconds;
        };
        if (Chours < 10 && Chours > 0) {
            Chours = '0' + Chours;
        } else if (hours > 9) {
            Chours = Chours;
        } else {
            Chours = '';
        };


        // here is time of the video !
        playerQuery('.videoTime').innerHTML = Chours + Cminutes + Cseconds + ' / ' + hours + minutes + seconds;
    }, 500)
}




//
//
//     YOU CAN APPLY FILTERS OR DIFFERENT FEATURES BY CLICKING ON THE SETTINGS INTERFACE
//
//

function settings(e) {
    switch (e.className) {
        //
        // the different filters does not concatenate, i run out of time to fix it, you need to toogle a button to remove EACH filter.
        //        
    case 'black':
        playerQuery('.embedded-video').classList.toggle('grayscale');
        break;
    case 'nightmode':
        playerQuery('.embedded-video').classList.toggle('night');
        break;
    case 'sepiabtn':
        playerQuery('.embedded-video').classList.toggle('sepia');
        break;
    case 'negative':
        playerQuery('.embedded-video').classList.toggle('invert');
        break;
    case 'dl': //downloadvideo
        var link = document.createElement('a');
        link.href = player.video.currentSrc;
        link.setAttribute('download', player.title); //don't work on safari :(, seems like it need php (src:stackoverflow.com)
        link.click();
        break;
    case 'speed':
        // the using of an array is not optimized, could be improved    
        player.video.playbackRate = speedValues[player.video.playbackRate];
        player.video.playbackRate++;

        // UX : click on the button to speed up the video until the plabackrate reboot     
        playerQuery('.speed').getElementsByTagName('span')[0].innerHTML = player.video.playbackRate;
        if (player.video.playbackRate == 15) {
            player.video.playbackRate = 1;
            playerQuery('.speed').getElementsByTagName('span')[0].innerHTML = 'normal';

        }
        break;
    case 'infos': //slide info panel from the right of the screen
        document.querySelector('.info-panel').classList.toggle('slide')
        player.container.classList.toggle('decal')
        break;
    default:
        break;
    }

}



//
//
//     THIS PART IS ABOUT SHOWING THE DIFFERENT PARAMETERS OF THE VIDEO IN THE INFO PANEL
//
//
function showInfos(info, target) {
    target.innerHTML = ': ' + info;
}


window.setInterval(function () {
    showInfos(parseFloat(player.video.currentTime), document.querySelector('.attributes-values .currentTime'))
    showInfos(parseInt(player.video.duration), document.querySelector('.attributes-values .videoLenght'))
    showInfos('x' + player.video.playbackRate, document.querySelector('.attributes-values .speedRate'))
    showInfos(player.video.videoWidth + ' x ' + player.video.videoHeight, document.querySelector('.attributes-values .size'))
    showInfos(player.video.muted, document.querySelector('.attributes-values .mute'))
    showInfos(player.video.loop, document.querySelector('.attributes-values .loops'))
    showInfos(player.video.volume * 100 + '%', document.querySelector('.attributes-values .volume'));
}, 400);






//
//
//     REPLAY SCENARIO AT THE END OF A VIDEO
//
//

player.video.addEventListener('ended', function () {
    playerQuery('.replay').style.display = 'block';
    var replay = setInterval(function () {
        playerQuery('.replay').innerHTML = 'This video will replay in ' + countdown + ' seconds';
        countdown--;
    }, 1000);
    setTimeout(function () {
        playerQuery('.replay').style.display = 'none';
        countdown = 5;
        pause = true;
        clearInterval(replay)
        play_pause();
    }, 6000)
});

//keyboard, the click way
window.addEventListener('keydown', function (e) {

    if (e.keyCode == 32) { // spacebar
        e.preventDefault();
        playerQuery(".play-pause").click();
    }
    if (e.keyCode == 77) { // M 
        e.preventDefault();
        playerQuery(".mute").click();
    }
    if (e.keyCode == 67) { // C
        e.preventDefault();
        playerQuery(".subtiles").click();
    }
    if (e.keyCode == 72) { // H
        e.preventDefault();
        playerQuery(".video-change").click();
    }

    if (e.keyCode == 81) { // Q
        //e.preventDefault(); block cmd+Q
        player.video.currentTime = 0;
        player.video.pause();
        pause = true;
    }
    if (e.keyCode == 83) { // S
        e.preventDefault();
        playerQuery(".settings").click();
    }
    if (e.keyCode == 70) { // F
        e.preventDefault();
        playerQuery(".fullscreen").click();
    }
    if (e.keyCode == 73) { // I
        //e.preventDefault(); block the console
        playerQuery(".infos").click();
    }
});


console.log(player);
console.log("SHORCUTS : SPACE ==> play/pause; M ==> mute; C ==> hide/show subtiles; H --> hd/sd; Q ==> stop;  S ==> settings; F ==> fullscreen mode; I ==> show/hide info panel");