// Document ready
(function() {
    var channel_max = 3;
    audiochannels = new Array();
    for(a = 0; a < channel_max; a++) {
        audiochannels[a] = new Array();
        audiochannels[a]['channel'] = new Audio();
        audiochannels[a]['finished'] = -1;
    }

    var user = getUrlVars()["user"];
    if(!user) {
        user = "SanchezSobrino";
    }

    var base_url = "https://api.github.com";
    ajax_get(base_url + "/users/" + user,
             function onSuccess(responseText) {
                 ajax_get(base_url + "/users/" + user + "/repos?sort=pushed",
                 function onSuccess(responseText) {
                     var latest_repo = JSON.parse(responseText)[0];
                     ajax_get(base_url + "/repos/" + user + "/" + latest_repo.name + "/commits",
                              function onSuccess(responseText) {
                                  var latest_commit = JSON.parse(responseText)[0];

                                  var repo_url = latest_repo.html_url;
                                  var repo_name = latest_repo.name;
                                  var author = latest_commit.commit.author.name;
                                  var commit_msg = latest_commit.commit.message;
                                  var login = latest_commit.html_url.split("/")[3];
                                  var author_url = "https://github.com/" + login;
                                  var commit_sha = latest_commit.sha;
                                  var commit_url = "https://github.com/" + login + "/" + repo_name + "/commit/" + commit_sha;

                                  document.getElementById("dialog-repo-url").href = repo_url;
                                  document.getElementById("dialog-author-url").href = author_url;
                                  document.getElementById("dialog-commit-url").href = commit_url;

                                  var sentence_1 = "* hey, it seems like the last commit was pushed to ";
                                  printSentence("dialog-text-1", sentence_1, "speech", 0);
                                  printSentence("dialog-repo-url", repo_name, "speech", sentence_1.length);
                                  var sentence_2 = " by ";
                                  printSentence("dialog-text-2", sentence_2, "speech", sentence_1.length + repo_name.length);
                                  printSentence("dialog-author-url", author, "speech", sentence_1.length + repo_name.length + sentence_2.length);
                                  var sentence_3 = ": ";
                                  printSentence("dialog-text-3", sentence_3, "speech", sentence_1.length + repo_name.length + sentence_2.length + author.length);
                                  printSentence("dialog-commit-url", "\"" + commit_msg + "\"", "speech", sentence_1.length + repo_name.length + sentence_2.length + author.length + sentence_3.length);
                              },
                              function onError(responseText) {
                                  console.error(responseText);
                              });
                 },
                 function onError(responseText) {
                     console.error(responseText);
                 });
             },
             function onError(responseText) {
                 var sentence_1 = "* hey, it seems like that user does not exist :( ...";
                 printSentence("dialog-text-1", sentence_1, "speech", 0);
             });

    function move_dog(speed, delay) {
        setTimeout(function() {
            function actually_move_it(speed) {
                var bg_music = document.getElementById("bg-music");
                var dog = document.getElementById("annonying-dog");
                dog.style.display = "block";
                if(dog.style.left == "") {
                    var position = 100 + ((window.innerWidth - 800) / 2) / 8;
                    bg_music.setAttribute('src', 'https://www.youtube.com/embed/woPff-Tpkns?list=PLe1V6p_XPgn7YSEpbRxFyWCTAkdng5xge&autoplay=1&loop=1');
                    dog.style.left = position + "%";
                }
                var pos = parseFloat(dog.style.left, 10);
                var limit = -(((window.innerWidth - 800) / 2 + 160) / 8);
                if(pos < limit) {
                    dog.style.display = "none";
                    dog.style.left = "";
                    move_dog(0.15, getRandomIntclusive(40000, 60000));
                    bg_music.setAttribute('src', 'https://www.youtube.com/embed/B2jVbSI9H4o?list=PLe1V6p_XPgn7YSEpbRxFyWCTAkdng5xge&autoplay=1&loop=1');
                    return;
                }
                dog.style.left = (pos - speed).toString() + "%";
                setTimeout(function() { actually_move_it(speed); }, 20);
            }
            actually_move_it(speed);
        }, delay);
    }
    move_dog(0.15, 5000);
})();

// Loads the specified user in the input box
// @arg e The event occured
function userInput(e) {
    if(e.keyCode == 13) {
        var input = document.getElementById('annonying-dog-input');
        document.location = "index.html?user=" + input.value;
        return false;
    }
    return true;
}

// Obtains the url variables in a server like way
// @return A dictionary indexed by the variable names
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });

    return vars;
}

// Plays a specified audio sound
// @arg s The id of the audio html tag
function play_multi_sound(s) {
    for(a = 0; a < audiochannels.length; a++) {
        thistime = new Date();
        if(audiochannels[a]['finished'] < thistime.getTime()) {
            audiochannels[a]['finished'] = thistime.getTime() + document.getElementById(s).duration*1000;
            audiochannels[a]['channel'].src = document.getElementById(s).src;
            audiochannels[a]['channel'].load();
            audiochannels[a]['channel'].play();
            break;
        }
    }
}

// Prints a sentence character by character with a sound effect
// @arg id The id of the html element where to print the sentence
// @arg sentence The string to print
// @arg sound The id of the audio html tag to be played on every character
// @arg delay The delay in characters you want it to wait prior showing
function printSentence(id, sentence, sound, delay) {
    for(var i = 0; i < sentence.length; i++) {
        (function(index) {
            setTimeout(function() {
                document.getElementById(id).innerHTML += sentence[index];
                play_multi_sound(sound);
            }, (50 * delay) + (50 * i));
        })(i);
    }
}

// Makes a GET asynchronous request
// @arg url The target URL
// @arg onSuccess The callback function to be run on success
// @arg onError The callback function to be run on error
function ajax_get(url, onSuccess, onError) {
    var xmlhttp;

    // Compatible with IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if(xmlhttp.readyState == 4) {
            if(xmlhttp.status == 200) {
                onSuccess(xmlhttp.responseText);
            }
            else {
                onError(xmlhttp.responseText);
            }
        }
    }

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

// Returns an integer between a minimum and a maximum value
// @arg min The minimum value, included
// @arg max The maximum value, included
// @return An integer between a minimum and a maximum value
function getRandomIntclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
