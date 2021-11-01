class Game{
    constructor(){ 
        this.resetTitle = createElement("h2");
        this.resetButton = createButton("");
        this.leaderBoardTitle = createElement("h2");
        this.leader1 = createElement("h2");
        this.leader2 = createElement("h2");   
        
        this.playerMoving = false;
        this.leftKeyActive = false;
        this.ghost = false;
    }

    getState(){
        var gameStateRef = database.ref("gameState");
        gameStateRef.on("value", function(data){
            gameState = data.val();
        });
    }

    updateState(state){
      database.ref("/").update({
          gameState : state
      });
  }

    start(){
        form = new Form();
        form.display();

        player = new Player();
        playerCount = player.getCount();

        zombie1 = createSprite(width/2-50, height - 100);
        zombie1.addImage("1zombie",zombie1Img);
        zombie1.addImage("hit",ghost);
        zombie1.scale = 0.16;

        zombie2 = createSprite(width/2+100, height-100);
        zombie2.addImage("2zombie",zombie2Img);
        zombie2.addImage("hit",ghost);
        zombie2.scale = 0.05;

        zombies = [zombie1, zombie2];

        flowers = new Group();
        foods = new Group();
        obstacles = new Group();

        var obstaclesPositions = [
            { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
            { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
            { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
            { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
            { x: width / 2, y: height - 2800, image: obstacle2Image },
            { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
            { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
            { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
            { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
            { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
            { x: width / 2, y: height - 5300, image: obstacle1Image },
            { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
          ];

          this.addSprites(flowers, 18, powerFlower, 0.1);

          this.addSprites(foods, 4, food, 0.1);

          this.addSprites(
            obstacles,
            obstaclesPositions.length,
            obstacle1Image,
            0.04,
            obstaclesPositions
          );

    }

    addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
        for (var i = 0; i < numberOfSprites; i++) {
          var x, y;
    
          if (positions.length > 0) {
            x = positions[i].x;
            y = positions[i].y;
            spriteImage = positions[i].image;
          } else {
            x = random(width / 2 + 150, width / 2 - 150);
            y = random(-height * 4.5, height - 400);
          }
          var sprite = createSprite(x, y);
          sprite.addImage("sprite", spriteImage);
    
          sprite.scale = scale;
          spriteGroup.add(sprite);
        }
      }

    handleElements(){
        form.hide();
        form.title.position(40, 50);
        form.title.class("gameTitleAfterEffect");

        this.resetButton.position(width/2+490, height/2-250);
        this.resetButton.class("resetButton");

        this.resetTitle.html("ResetGame");
        this.resetTitle.position(width/2+450, height/2-300);
        this.resetTitle.class("resetText");

        this.leaderBoardTitle.html("LeaderBoardTitle");
        this.leaderBoardTitle.position(width/2-650, height/2-300);
        this.leaderBoardTitle.class("resetText");

        this.leader1.position(width/2-650, height/2-200);
        this.leader1.class("leadersText");

        this.leader2.position(width/2-650, height/2-250);
        this.leader2.class("leadersText");
    }

    play(){
      this.handleElements();
      this.handleResetButton();

      Player.getPlayersInfo();

      if (allPlayers !== undefined) {
          image(lawn, 0, -height * 5, width, height * 6);
    
          this.showLife();
          this.showHungerBar();
          this.showLeaderBoard();
    
          var index = 0;
          for (var plr in allPlayers) {
            index = index + 1;
    
            var x = allPlayers[plr].positionX;
            var y = height - allPlayers[plr].positionY;

            var currentLife = allPlayers[plr].life;

            if(currentLife <= 0){
              zombies[index-1].changeImage("hit");
              zombies[index-1].scale = 0.3;
            } 

            zombies[index - 1].position.x = x;
            zombies[index - 1].position.y = y;
    
            if (index === player.index) {
              stroke(10);
              fill("red");
              ellipse(x, y, 60, 60);

              this.handlehunger(index); 
              this.handlePowerCoins(index);
              this.handleObstacleCollision(index);
              this.handleCollisionBetweenZombies(index)

                if(player.life <= 0){
                this.ghost = true;
                this.playerMoving = false;
              }
              
    
              camera.position.y = zombies[index - 1].position.y;
            }
          }

          if (this.playerMoving) {
            player.positionY += 5;
            player.update();
          }


          this.handlePlayerControls();

          const finshLine = height * 6 - 100;

          if (player.positionY > finshLine) {
            gameState = 2;
            player.rank += 1;
            Player.updateCarsAtEnd(player.rank);
            player.update();
            this.showRank();
          }

          drawSprites();

      }
  }

  handleResetButton(){
    this.resetButton.mousePressed(()=>{
        database.ref("/").set({
            gameState:0,
            playerCount:0,
            players:{}
        });

        window.location.reload();
    });
}

showLife() {
  push();
  image(bg, width / 2 - 130, height - player.positionY - 400, 20, 20);
  fill("white");
  rect(width / 2 - 100, height - player.positionY - 400, 185, 20);
  fill("#f50057");
  rect(width / 2 - 100, height - player.positionY - 400, player.life, 20);
  noStroke();
  pop();
}

showHungerBar() {
  push();
  image(hungerImg, width / 2 - 130, height - player.positionY - 350, 20, 20);
  fill("white");
  rect(width / 2 - 100, height - player.positionY - 350, 185, 20);
  fill("yellow");
  rect(width / 2 - 100, height - player.positionY - 350, player.fuel, 20);
  noStroke();
  pop();
}

    showLeaderBoard(){
        var leader1, leader2;
        var players = Object.values(allPlayers);
        if((players[0].rank === 0 && players[1].rank === 1 )|| players[0].rank === 1){
            leader1=
            players[0].rank+
            "&emsp";
            players[0].name+
            "&emsp";
            players[0].score

            leader2=
            players[1].rank+
            "&emsp";
            players[1].name+
            "&emsp";
            players[1].score

        }

        if(players[1]===1){
            leader1=
            players[1].rank+
            "&emsp";
            players[1].name+
            "&emsp";
            players[1].score

            leader2=
            players[0].rank+
            "&emsp";
            players[0].name+
            "&emsp";
            players[0].score

        }

        this.leader1.html(leader1);
        this.leader2.html(leader2);
    }

    handlePlayerControls() {
      if(!this.ghost){
      if (keyIsDown(UP_ARROW)) {
        this.playerMoving = true;
        player.positionY += 10;
        player.update();
      }
  
      if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
        this.leftKeyActive = true;
        player.positionX -= 5;
        player.update();
      }
  
      if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) {
        this.leftKeyActive = false;
        player.positionX += 5;
        player.update();
      }
    }
    }

    handlehunger(index) {
        zombies[index - 1].overlap(food, function(collector, collected) {
          player.hunger = 186;
          collected.remove();
        });
        if(this.playerMoving && player.hunger > 0){
          player.hunger -= 0.3;
        }
    
        if(player.hunger <= 0){
          gameState = 2;
          this.gameOver();
        }
      }
    
      handlePowerFlower(index) {
        zombies[index - 1].overlap(powerFlower, function(collector, collected) {
          player.score += 15;
          player.update();
          collected.remove();
        });
      }

      handleObstacleCollision(index) {
        if (cars[index - 1].collide(obstacles)) {
          if (this.leftKeyActive) {
            player.positionX += 100;
          } else {
            player.positionX -= 100;
          }
    
          if (player.life > 0) {
            player.life -= 185 / 4;
          }
    
          player.update();
        }
      }

      handleCollisionBetweenZombies(index){
        if(index === 1){
          if (zombies[index - 1].collide(zombies[1])){
          if (this.leftKeyActive) {
            player.positionX += 100;
          } else {
            player.positionX -= 100;
          }
    

          if (player.life > 0) {
            player.life -= 185 / 4;
          }
    
          player.update();
          }
        }
          if(index === 2){
          if (zombies[index-1].collide(zombies[0])){
          if (this.leftKeyActive) {
            player.positionX += 100;
          } else {
            player.positionX -= 100;
          }
    

          if (player.life > 0) {
            player.life -= 185 / 4;
          }
    
          player.update();
          }
        }
        
      }

      showRank() {
        swal({
          title: `Awesome!${"\n"}Rank${"\n"}${player.rank}`,
          text: "You reached the finish line successfully",
          imageUrl:
            "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
          imageSize: "100x100",
          confirmButtonText: "Ok"
        });
      }

      gameOver() {
        swal({
          title: `Game Over`,
          text: "Oops you lost the race....!!!",
          imageUrl:
            "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
          imageSize: "100x100",
          confirmButtonText: "Thanks For Playing"
        });
      }

}

