class Player{
    constructor(){
        this.name = null;
        this.index = null;
        this.positionX = 0;
        this.positionY = 0;
        this.rank = 0;
        this.score = 0;
        this.life = 186;
        this.speed = 186;
    }

    addPlayer(){
        var playerIndex = "players/player" + this.index;

        if(this.index === 1){
            this.positionX = width/2;
        }else{
            this.positionX = width/4;
        }

        database.ref(playerIndex).set({
            name:this.name,
            positionX:this.positionX,
            positionY:this.positionY,
            rank:this.rank = 0,
            rank:this.score = 0
        });
    }

    getDistance() {
        var playerDistanceRef = database.ref("players/player" + this.index);
        playerDistanceRef.on("value", data => {
          var data = data.val();
          this.positionX = data.positionX;
          this.positionY = data.positionY;
        });
      }

    getCount(){
        var playerCountRef = database.ref("playerCount");
        playerCountRef.on("value", data =>{
            playerCount = data.val();
        });
    }

    updateCount(count){
        database.ref("/").update({
            playerCount:count
        })
    }

    update() {
        var playerIndex = "players/player" + this.index;
        database.ref(playerIndex).update({
          positionX: this.positionX,
          positionY: this.positionY,
          rank:this.rank,
          score:this.score,
          life:this.life
        });
      }



    static getPlayersInfo(){
        var playersInfoRef = database.ref("players");
        playersInfoRef.on("value", data =>{
            allPlayers = data.val();
        });
    }

    getCarsAtEnd() {
        database.ref("carsAtEnd").on("value", data => {
          this.rank = data.val();
        });
      }
    
      static updateCarsAtEnd(rank) {
        database.ref("/").update({
          carsAtEnd: rank
        });
      }
}