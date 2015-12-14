(function() {
    var channel_max = 3;
    audiochannels = new Array();
    for(a = 0; a < channel_max; a++) {
        audiochannels[a] = new Array();
        audiochannels[a]['channel'] = new Audio();
        audiochannels[a]['finished'] = -1;
    }

    var sentences = ["* i've gotten a ton of work done today. a skele-ton.",
                     "* i'm sans. sans the skeleton."];
    printSentence("dialog-line", sentences[getRandomIntclusive(0, 1)], "speech");
})();

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
function printSentence(id, sentence, sound) {
    for(var i = 0; i < sentence.length; i++) {
        (function(index) {
            setTimeout(function() {
                document.getElementById(id).innerHTML += sentence[index];
                play_multi_sound(sound);
            }, 50 * i);
        })(i);
    }
}

function getRandomIntclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
