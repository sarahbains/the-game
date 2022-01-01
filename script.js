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
    rewards: [],
    bgProps: [],
    counter: 0,
    loopDuration: 1000 / 60,
    lastKeyFrame: null,
    randomMeteorInterval: null,
    gameBoard: $('#game-screen'),
    scoreBoard: $('#scoreboard'),
    playerPath: "../characters/fish.png",

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
        if(this.isRunning == true){
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
                this.rewards.forEach(prop => {
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
                        (game.players[0].dimensions[1] / 2), 
                        (game.obstacles[k].position[0] + game.obstacles[k].dimensions[0] /2), 
                        (game.obstacles[k].position[1] - game.obstacles[k].dimensions[1] /2), 
                        (game.obstacles[k].dimensions[0] / 2))){
                        this.isRunning = false;
                        game.switchScreen("#game-over-screen");
                        // console.log("crash");
                    }else{
                        // console.log("safe")
                    }
                }
                for(let k = 0; k < game.rewards.length; k++){
                    if(circleCollison(
                        (game.players[0].position[0] + game.players[0].dimensions[0] / 2), 
                        (game.players[0].position[1] - game.players[0].dimensions[1] / 2),
                        (game.players[0].dimensions[1] / 2), 
                        (game.rewards[k].position[0] + game.rewards[k].dimensions[0] /2), 
                        (game.rewards[k].position[1] - game.rewards[k].dimensions[1] /2), 
                        (game.rewards[k].dimensions[0] / 2))){
                        game.players[0].scorePoints(+5);
                        game.rewards[k].$dom.addClass('collected');
                        console.log(game.rewards[k])

                    }else{
                        // console.log("safe")
                    }
                }
            window.requestAnimationFrame(game.animateFunction.bind(this));
        }
       
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
        
        let score = document.createElement('div');
        score.setAttribute('id', `score-${game.players.length}`);
        score.innerHTML = oPlayer.score;
        this.scoreBoard.append(score);

    },
    //display and update player score
    updateScore(oPlayer) {
        const playerIndex = game.players.indexOf(oPlayer) + 1;
        let playerScore = document.querySelector (`div#score-${playerIndex}`);
        console.log(playerIndex);
        playerScore.innerHTML = oPlayer.score;
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

    addReward(oReward){
        const [left, top] = oReward.position;
        const [width, height] = oReward.dimensions;
        this.rewards.push(oReward);
        const domString = `<div id="player-${Date.now()}"
                              class="${oReward.classes}"               
                              style="width:${width}px;height:${height}px;
                              left:${left}px;top:${top}px;
                              background-image:url('${oReward.backgroundImage}');
                              background-position-x:0px;
                              background-position-y:0px;
                              background-repeat: no-repeat;
                              position: absolute;"
                              ></div>`;
       oReward.$dom = $(domString);
        $("#objects").append(oReward.$dom);
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

//     playerJump(){
//         $(game.players[0].$dom[0]).css('top',"0px");
//         game.players[0].isJumping = true;
//         setTimeout(game.playerFall, 1000);
       
//    },

//    playerFall(){
//        $(game.players[0].$dom[0]).css('top',"450px");
//        game.players[0].isJumping = false;
//    } 


    playerJump(){
        let currentTop = parseInt($(game.players[0].$dom[0]).css('top'));
        let newTop = Math.max(currentTop - 90, 0); 
        $(game.players[0].$dom[0]).css('top', newTop + 'px');
        game.players[0].isJumping = true;
        setTimeout(game.playerFall, 1000);
      },
      playerFall(){
        let currentTop = parseInt($(game.players[0].$dom[0]).css('top'));
        let newTop = Math.min(currentTop + 90, 450); 
        $(game.players[0].$dom[0]).css('top', '450px');
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
        maxJumpVelocity = 400,
        score = 0,

      ) {
        this.dimensions = dimensions;
        this.position = position;
        this.classes = classes;
        this.velocity = velocity;
        this.backgroundImage = backgroundImage;
        this.currentJumpVelocity = 0;
        this.maxJumpVelocity = maxJumpVelocity;
        this.isJumping = false;
        this.score = score;
      }
      updatePosition(elapsedTimeMS = 1000) {
        const playerEl = $(`.${this.classes}`);
         
          this.position = [playerEl.position( ).left, playerEl.position().top ];
        /* console.log(this.position); */
      }
      scorePoints(newScore) {
        let score = 0;
        this.score += newScore;
        game.updateScore(this);
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
        // if (obstacleEl.position().left < -obstacleEl.width()){
        //     obstacleEl.css("left",`${game.gameBoard.width()}px`)
        // }
        this.position = [obstacleEl.position().left, obstacleEl.position().top ];
        // console.log(this.position);
    }
}
class Reward {
    constructor(
        position = [0, 0],
        dimensions = [100, 100],
        velocity = [0, 0],
        classes = "reward",
        backgroundImage = "",
        
    ) {
        this.dimensions = dimensions;
        this.position = position;
        this.classes = classes;
        this.velocity = velocity;
        this.backgroundImage = backgroundImage;
    }
    updatePosition(){
        const rewardEl = $(`.${this.classes}`);
        rewardEl.css("left", `${rewardEl.position().left+this.velocity[0]}px`)
        
        this.position = [rewardEl.position().left, rewardEl.position().top ];
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
    updatePosition(elapsedMS= 1000){
        // const bgPropEl = $(`.${this.classes}`);
        // bgPropEl.css("left", `${bgPropEl.position().left+this.velocity[0]}px`)
        // if (bgPropEl.position().left < -bgPropEl.width()){
        //     bgPropEl.css("left",`${game.gameBoard.width()}px`)
        // this.$dom.css("background-repeat", 'repeat');
        // }
        const currentLeft = this.$dom.css("background-position-x");
        const currentTop = this.$dom.css("background-position-y");
        const newLeft =
          parseFloat(currentLeft.substr(0, currentLeft.length - 2)) +
          (this.velocity[0] / 1000) * elapsedMS;
        const newTop =
          parseFloat(currentTop.substr(0, currentTop.length - 2)) +
          (this.velocity[1] / 1000) * elapsedMS;
        this.$dom.css("background-position-x", `${newLeft}px`);
        this.$dom.css("background-position-y", `${newTop}px`);
        this.$dom.css("background-repeat", 'repeat');
    
   }
}
function setObjects(){
    const player = new Player(
        [70, 450],
        [69, 100],
        [0, 0],
        undefined,
        game.playerPath,
      );

      game.addPlayer(player);

      const bgImage = new BGProp(
            [0, 0],
            [1920, 1080],
            [-3, 0],
            "bg-space",
            "characters/space.jpeg"
          );
          game.addBGProp(bgImage);
  
}

//GENERATE RANDOM OBEJECTS
//Obstacles
setInterval(function generateObstacles(){
    if(game.isRunning){
        const yRange = Math.floor(Math.random() *450);
        const speedRange = Math.floor(Math.random() * 4);
        let obstacle = new Obstacle(
        [1950, 500 -yRange],
        [25, 25],
        [-9-speedRange, 0],
        "obstacle-moon" + Date.now(),
        "characters/moon-smaller.png"
    );
    // console.log("obstacle")
    game.addObstacle(obstacle);
    }
} , 2500);

//Stars
setInterval(function generateStars(){
    if(game.isRunning){
        const yRange = Math.floor(Math.random() * 450);
        const speedRange = Math.floor(Math.random() * 5);  
        let star = new Reward(
        [1950, 500 -yRange],
        [100, 100],
        [-3 - speedRange, 0],
        "reward-star" + Date.now(),
        "characters/star.png",
    );
    console.log("saturn")
    game.addReward(star);
    }  
} , 1000);



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
    quitGame();
});

$('#play-game').click(() => {
    game.switchScreen("#game-screen")
})

$('#end-game').click(() => {
    game.switchScreen("#game-over-screen")
})

$('#play-again').click(() => {
    game.switchScreen("#game-screen");
    $("#score").css('display', 'none');
})
function quitGame(){
    location.reload();
}
  //collision detection
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
       
        
        return false;
    }
}
 

// Countdown to begin game 
  document.addEventListener('DOMContentLoaded', () => {
    const timeLeftDisplay = document.querySelector('#time-left')
    const startBtn = document.querySelector('#play-game')
    const playAgain = document.querySelector('#play-again')

    let timeLeft = 5

    function countDown(){
        setObjects();
        let timeLeft = 5
        let counter = setInterval(myTimer, 1000);
        function myTimer(){
            if(timeLeft <= 0) {

                game.animateFunction();
                $('#countdown').hide();
                stopCounter();
            }
            timeLeftDisplay.innerHTML = timeLeft
            if(game.isRunning)timeLeft -=1
        }
        function stopCounter(){
            clearInterval(counter);
        }

    }
    startBtn.addEventListener('click', countDown)
    playAgain.addEventListener('click', resetGame)
   

    function resetGame(){
        game.players = [];
        game.obstacles = [];
        game.bgLayers = [];
        game.bgProps = [];
        game.counter = 0;
        game.rewards = [];
        $("#objects").empty();
        $('#countdown').show();
        document.querySelector('#time-left').innerHTML = "5"; 
        countDown();
        $('#score-1').remove();
    }
    
} )

// saving and displaying username input data  
    const startBtn = document.querySelector('#play-game')
    const scoreBoard = document.querySelector('#scoreboard');

    function displayPlayerName() {
        const userinput = document.getElementById("fname").value;
        scoreBoard.innerHTML = userinput;
    }
    startBtn.addEventListener('click', displayPlayerName);


// player jump on space bar
    $(window).keypress(function(e) {
        console.log(e);
        if (!game.players[0].isJumping && (e.keyCode == 0 || e.keyCode == 32)) {
         game.playerJump();
        
        }
      });


    $(document).ready(function(){
        $(".character-choose").click(function(){
          $(this).attr('id', 'chosen');
          $(".character-choose").not($(this)).removeAttr('id', 'chosen');
          game.playerPath = $(this).children("img").first().attr('src');
          
        });
      });  


     