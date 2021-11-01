class Form{
    constructor(){
        this.title = createImg("assets/ZombieInvasionTitle.png", "game title");
        this.input = createInput("").attribute("placeholder", "Enter you name");
        this.playButton = createButton("Play");
        this.greeting = createElement("h2");
    }

    setElementPosition(){
        this.title.position(width/2-50, height/2-50);
        this.input.position(width/12+450, height/2+250);
        this.playButton.position(width/12+500, height/2+300);
        this.greeting.position(width/2, height/2);
        
    }

    setElementStyle(){
        this.title.class("gameTitle");
        this.input.class("customInput");
        this.playButton.class("customButton");
        this.greeting.class("greeting");
    }

    hide(){
        this.title.hide();
        this.input.hide();
        this.playButton.hide();
        this.greeting.hide();
    }

    handleMousePressed(){
    this.playButton.mousePressed(()=>{
        this.title.hide();
        this.input.hide();
        this.playButton.hide();
        var message =  `hello ${this.input.value()}
        </br> wait for another player to join`;
        this.greeting.html(message);
        playerCount += 1;
        player.name = this.input.value();
        player.index = playerCount;
        player.addPlayer();
        player.updateCount(playerCount);
        player.getDistance();
    })
    }

    display(){
        this.setElementPosition();
        this.setElementStyle();
        this.handleMousePressed();
    }
}


