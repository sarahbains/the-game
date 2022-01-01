"use strict";


const game = {
    title: 'Digital Dash',
    isRunning: false,
    currentScreen: $('#splash-screen'),
    mainWidth: 600,
    mainHeight: 600,
    gravity: 15,
    pressedKeys: [],
    players: [],
    obstacles: [],
    bgLayers: [],
    bgProps: [],
    counter: 0,
    loopDuration: 1000 / 60,
    lastKeyFrame: null,
    randomMeteorInterval: null,
    gameBoard: $('#game-screen'),
    objectDiv: $('#objects'),
    scoreBoard: $('#scoreboard'),


    switchScreen(id) {
        this.currentScreen = $(id);
        $('.screen').hide();
        $(this.currentScreen).show();
        
        if (id==="#game-screen"){
            $('#header .quit-button').show();
            this.isRunning = true;
        } else {
            $('#header .quit-button').hide();
            this.isRunning = false;
        }

        if (id==="#game-over-screen"){
            $('#header #help-button').hide();
        } else {
            $('#header #help-button').show();
        }
    },

    showModal() {
        console.log(this.currentScreen[0], $('#game-screen')[0])

        if (this.currentScreen[0]===$('#game-screen')[0]) {
            $('#gameplay-instructions').modal('show');
            this.isRunning = false;
        } else if (this.currentScreen[0]===$('#splash-screen')[0]) {
            $('#setup-instructions').modal('show');
        } 
    },
    

    animateFunction(timestamp) {
        if (!this.lastKeyFrame) this.lastKeyFrame = timestamp;
        const elapsedTime = timestamp - this.lastKeyFrame;
        if (this.lastKeyFrame - elapsedTime > this.loopDuration) {
            this.lastKeyFrame = timestamp;
            this.bgProps.forEach(prop => {
                prop.updatePosition()
            })
            this.obstacles.forEach(prop => {
                prop.updatePosition()
            })
            const elapsedMS = timestamp - game.lastKeyFrame;
            this.players.forEach(player =>{
                player.updatePosition(elapsedMS)
            })
        }
            for(let k = 0; k < game.obstacles.length; k++){
                if(circleCollison(
                    (game.players[0].position[0] + game.players[0].dimensions[0] / 2), 
                    (game.players[0].position[1] - game.players[0].dimensions[1] / 2),
                    (game.players[0].dimensions[0] / 2), 
                    (game.obstacles[k].position[0] + game.obstacles[k].dimensions[0] /2), 
                    (game.obstacles[k].position[1] - game.obstacles[k].dimensions[1] /2), 
                    (game.obstacles[k].dimensions[0] / 2))){
                
                    console.log("crash");
                }else{
                    
                }
            }
        window.requestAnimationFrame(game.animateFunction.bind(this));
    },

    addPlayer(oPlayer) {
        const [left, top] = oPlayer.position;
        const [width, height] = oPlayer.dimensions;
        this.players.push(oPlayer);
        const domString = `<div id="player-${Date.now()}"
                              class="${oPlayer.classes}"               
                              style="width:${width}px;height:${height}px;
                              left:${left}px;top:${top}px;
                              background-image:url('${oPlayer.backgroundImage}');
                              background-position-x:0px;
                              background-position-y:0px;
                              background-repeat: no-repeat;
                              position: absolute;"
                              ></div>`;
        oPlayer.$dom = $(domString);
        $("#objects").append(oPlayer.$dom);
        
    },

    addObstacle(oObstacle){
        const [left, top] = oObstacle.position;
        const [width, height] = oObstacle.dimensions;
        this.obstacles.push(oObstacle);
        const domString = `<div id="player-${Date.now()}"
                              class="${oObstacle.classes}"               
                              style="width:${width}px;height:${height}px;
                              left:${left}px;top:${top}px;
                              background-image:url('${oObstacle.backgroundImage}');
                              background-position-x:0px;
                              background-position-y:0px;
                              background-repeat: no-repeat;
                              position: absolute;"
                              ></div>`;
        oObstacle.$dom = $(domString);
        $("#objects").append(oObstacle.$dom);
    },

    addBGLayer(oBGLayer){
        const [left, top] = oBGLayer.position;
        const [width, height] = oBGLayer.dimensions;
        this.players.push(oBGLayer);
        const domString = `<div id="player-${Date.now()}"
                              class="${oBGLayer.classes}"               
                              style="width:${width}px;height:${height}px;
                              left:${left}px;top:${top}px;
                              background-image:url('${oBGLayer.backgroundImage}');
                              background-position-x:0px;
                              background-position-y:0px;
                              background-repeat: no-repeat;
                              position: absolute;"
                              ></div>`;
        oBGLayer.$dom = $(domString);
        $("#objects").append(oBGLayer.$dom);
    },

    addBGProp(oBGProp){
        const [left, top] = oBGProp.position;
        const [width, height] = oBGProp.dimensions;
        this.bgProps.push(oBGProp);
        const domString = `<div id="player-${Date.now()}"
                              class="${oBGProp.classes}"               
                              style="width:${width}px;height:${height}px;
                              left:${left}px;top:${top}px;
                              background-image:url('${oBGProp.backgroundImage}');
                              background-position-x:0px;
                              background-position-y:0px;
                              background-repeat: no-repeat;
                              position: absolute;"
                              ></div>`;
        oBGProp.$dom = $(domString);
        $("#objects").append(oBGProp.$dom);
    },


    playerJump(){
         $(game.players[0].$dom[0]).css('top',"230px");
         game.players[0].isJumping = true;
         setTimeout(game.playerFall, 1000);
        
    },

    playerFall(){
        $(game.players[0].$dom[0]).css('top',"330px");
        game.players[0].isJumping = false;
    } 
}

//classes///
class Player {
    constructor(
        position = [0, 0],
        dimensions = [100, 100],
        velocity = [0, 0],
        classes = "player",
        backgroundImage = "",
        maxJumpVelocity = 400
      ) {
        this.dimensions = dimensions;
        this.position = position;
        this.classes = classes;
        this.velocity = velocity;
        this.backgroundImage = backgroundImage;
        this.currentJumpVelocity = 0;
        this.maxJumpVelocity = maxJumpVelocity;
        this.isJumping = false;
      }
      updatePosition(elapsedTimeMS = 1000) {
        const playerEl = $(`.${this.classes}`);
         
          this.position = [playerEl.position( ).left, playerEl.position().top ];
        /* console.log(this.position); */
        
      }
    }

class BGLayer {
    constructor(
        position = [0, 0],
        dimensions = [100, 100],
        velocity = [0, 0],
        classes = "bg-layer",
        backgroundImage = ""
    ) {
        this.dimensions = dimensions;
        this.position = position;
        this.classes = classes;
        this.velocity = velocity;
        this.backgroundImage = backgroundImage;
    }

}
class Obstacle {
    constructor(
        position = [0, 0],
        dimensions = [100, 100],
        velocity = [0, 0],
        classes = "obstacle",
        backgroundImage = "",
        
    ) {
        this.dimensions = dimensions;
        this.position = position;
        this.classes = classes;
        this.velocity = velocity;
        this.backgroundImage = backgroundImage;
    }
    updatePosition(){
        const obstacleEl = $(`.${this.classes}`);
        obstacleEl.css("left", `${obstacleEl.position().left+this.velocity[0]}px`)
        if (obstacleEl.position().left < -obstacleEl.width()){
            obstacleEl.css("left",`${game.gameBoard.width()}px`)
        }
        this.position = [obstacleEl.position().left, obstacleEl.position().top ];
        // console.log(this.position);
    }
}

class BGProp {
    constructor(
      position = [0, 0],
      dimensions = [100, 100],
      velocity = [0, 0],
      classes = "bg-prop",
      backgroundImage = ""
    ) {
      this.dimensions = dimensions;
      this.position = position;
      this.classes = classes;
      this.velocity = velocity;
      this.backgroundImage = backgroundImage;
    }
    updatePosition(){
        const bgPropEl = $(`.${this.classes}`);
        bgPropEl.css("left", `${bgPropEl.position().left+this.velocity[0]}px`)
        if (bgPropEl.position().left < -bgPropEl.width()){
            bgPropEl.css("left",`${game.gameBoard.width()}px`)
        }
    }
}

    const player = new Player(
        [70, 330],
        [69, 100],
        [0, 0],
        undefined,
        "characters/fish2.png"
      );

      game.addPlayer(player);

    
      const saturn = new BGProp(
        [300, 50],
        [40, 40],
        [-1, 0],
        "bg-saturn",
        "characters/saturn.png"
      );
      game.addBGProp(saturn);

      const moonsm = new BGProp(
        [950, 600],
        [50, 50],
        [-1, 0],
        "bg-moonsm",
        "characters/moon-small.png"
      );
      game.addBGProp(moonsm);

      const moonsm2 = new BGProp(
        [15, 200],
        [25, 25],
        [-1, 0],
        "bg-moonsm2",
        "/characters/moon-smaller.png"
      );
      game.addBGProp(moonsm2);


      const earth = new BGProp(
        [400, 60],
        [100, 100],
        [-2, 0],
        "bg-earth",
        "/characters/earth.png"
      );
      game.addBGProp(earth);

      const moon = new Obstacle(
        [250, 350],
        [25, 25],
        [-1.5, 0],
        "obstacle-moon",
        "/characters/moon-smaller.png"
      );
      game.addObstacle(moon);

 


  //buttons//

$('#close-game-instructions').click(() => {
    $('#gameplay-instructions').modal('hide');
    if (game.currentScreen[0] === $('#game-screen')[0]) game.isRunning =true;
    console.log(game.isRunning);
})

$('#more-info').click(() => {
    $('#setup-instructions').modal('hide')
    $('#gameplay-instructions').modal('show');
})

$('#help-button').click(() => {
    game.showModal()
});

$('.quit-button').click(() => {
    game.switchScreen("#splash-screen")
});

$('#play-game').click(() => {
    game.switchScreen("#game-screen")
})

$('#end-game').click(() => {
    game.switchScreen("#game-over-screen")
})

$('#play-again').click(() => {
    game.switchScreen("#game-screen")
})
function circleCollison(p1x, p1y, r1, p2x, p2y, r2){
    let radiusSum;
    let xDiff;
    let yDiff;
    radiusSum = r1 + r2;
    xDiff = p1x - p2x;
    yDiff = p1y - p2y;
    if(radiusSum > Math.sqrt((xDiff * xDiff) + (yDiff * yDiff)) ){

        console.log('Player Coord: ' + p1x + ':' + p1y);
        console.log('Enemy Coord: ' + p2x + ':' + p2y);

        return true;
    }else{
        console.log('Player Coord: ' + p1x + ':' + p1y);
        
        return false;
    }
}
 

// Countdown to begin game 
  document.addEventListener('DOMContentLoaded', () => {
    const timeLeftDisplay = document.querySelector('#time-left')
    const startBtn = document.querySelector('#play-game')
    let timeLeft = 5

    function countDown(){
        let counter = setInterval(myTimer, 1000);
        function myTimer(){
            if(timeLeft <= 0) {

                game.animateFunction();
                $('#countdown').hide();
                stopCounter();
            }
            timeLeftDisplay.innerHTML = timeLeft
            timeLeft -=1
        }
        function stopCounter(){
            clearInterval(counter);
        }


    }
    startBtn.addEventListener('click', countDown)
} )

// saving and displaying username input data  
    const startBtn = document.querySelector('#play-game')
    const scoreBoard = document.querySelector('#scoreboard');

    function displayPlayerName() {
        const userinput = document.getElementById("fname").value;
        scoreBoard.innerHTML = userinput;
    }
    startBtn.addEventListener('click', displayPlayerName);


    //collision detection

    $(window).keypress(function(e) {
        console.log(e);
        if (!game.players[0].isJumping && (e.keyCode == 0 || e.keyCode == 32)) {
         game.playerJump();
        
        }
      });