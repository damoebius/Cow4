document.addEventListener('DOMContentLoaded', function(){
    var windowHeight = window.innerHeight
    var windowWidth = window.innerWidth



    if(windowWidth < 1150){
        document.getElementById('gameContainer').style.height = windowWidth + 'px';
        document.getElementById('gameContainer').style.width = windowWidth + 'px';
    } else {
        document.getElementById('gameContainer').style.height = windowHeight + 'px';
        document.getElementById('gameContainer').style.width = windowHeight + 'px';
    }
})
