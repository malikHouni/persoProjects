
var myGamePiece;
var ListEnnemy=[];
var myMapTiles;
var currentLevel;//le level est un kson qui contient le nom du niveau, les ennemies et le map
var levelNum;
var time=0;
function startGame() {
    levelNum=0
    currentLevel=levelList[levelNum];
    myGamePiece = new component(30, 30, "#F0C240", currentLevel.Player[0].posx,currentLevel.Player[0].posy);

    myMapTiles = new mapTile();
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height =480;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[2]);
        //1nl,pour animer à different moment, c ici 
        this.interval = setInterval(function(){time+=1;updateGameArea()}, 100);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");            
        })
    }, 
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if(ListEnnemy.length==0){

            if(currentLevel == null){
                console.log("oops");
                this.context.font = "30px Comic Sans MS";
                this.context.fillStyle = "red";
                this.context.textAlign = "center";
                this.context.fillText("You win!,the end!", this.canvas.width/2, this.canvas.height/2); 
            }else{
                //48-57, on ajoute les ennemies...
                for(var i=0;i<currentLevel.Enemies.length;i++){
                    if(currentLevel.Enemies[i].dir=="l_r"){
                        myGameEnnemy = new componentEnnemyLeftToRight(30, 30, "#EC260F", currentLevel.Enemies[i].x,currentLevel.Enemies[i].y);
                        ListEnnemy.push(myGameEnnemy);
                    }else{
                        myGameEnnemy = new componentEnnemyUpToDown(30, 30, "#EC260F", currentLevel.Enemies[i].x,currentLevel.Enemies[i].y);
                        ListEnnemy.push(myGameEnnemy);
                    }
                }
            }     
        }
    }
}

function component(width, height, color, x, y) {
    this.gamearea = myGameArea;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        //console.log("current pos is:"+(this.x)*16/480+','+(this.y)*16/480)
        console.log("current pos is:"+(this.x)+','+(this.y))
        if( (this.x+this.speedX) >-30 && (this.x+this.speedX) <480){
            if( (this.y+this.speedY) >-30 && (this.y+this.speedY) <480){
               if(currentLevel.levelMap[(this.y+this.speedY)*16/480][(this.x+this.speedX)*16/480] != '2'){
                    this.x += this.speedX;
                    this.y += this.speedY;  
                }
                if(currentLevel.levelMap[(this.y)*16/480][(this.x)*16/480] == '0'){//tombe dans un trou
                    this.x = currentLevel.Player[0].posx;
                    this.y = currentLevel.Player[0].posy;  
                }
                for(var it=0;it<ListEnnemy.length;it++){//collision avec les ennemy
                    if(this.x==ListEnnemy[it].x && this.y==ListEnnemy[it].y){
                        this.x = currentLevel.Player[0].posx;
                        this.y = currentLevel.Player[0].posy;  
                    }
                }
            }
        }
        if(currentLevel.levelMap[(this.y)*16/480][(this.x)*16/480] == '7'){//on va au niveau suivant
            levelNum+=1;//on va au niveau suivant...
            currentLevel=levelList[levelNum];
            ListEnnemy=[];
            this.x = currentLevel.Player[0].posx;
            this.y = currentLevel.Player[0].posy;  
        }
    }    
}

//ennemy move left to right and reverse
function componentEnnemyLeftToRight(width, height, color, x, y) {
    this.gamearea = myGameArea;
    this.width = width;
    this.height = height;
    this.goLeft=false;
    this.goRight=false;
    this.speedX=0;
    this.speedY=0;    
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = "#E70B33";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        if(this.speedX==0){this.goRight=true;}
        if(this.goRight==true)
            this.speedX=30
        if(this.goLeft==true)
            this.speedX=-30
        
        if( (this.x+this.speedX) >-30 && (this.x+this.speedX) <480){
            if( (this.y+this.speedY) >-30 && (this.y+this.speedY) <480){
               if(currentLevel.levelMap[(this.y+this.speedY)*16/480][(this.x+this.speedX)*16/480] != '2'){
                    this.x += this.speedX;
                    this.y += this.speedY;  
                }else{//pour qu'il rebondissent quand il touche un mûr
                    if(this.goRight==true){
                        this.goRight=false;this.goLeft=true;
                    }else{
                        this.goLeft=false;this.goRight=true;
                    }
                }
            }
        }
        else{//pour quil rebondissent quand il touche les limites de la map
             if(this.goRight==true){
                        this.goRight=false;this.goLeft=true;
                    }else{
                        this.goLeft=false;this.goRight=true;
                    }
        }
    } 
}

//Ennemy move up to down and reverse
function componentEnnemyUpToDown(width, height, color, x, y) {
    this.gamearea = myGameArea;
    this.width = width;
    this.height = height;
    this.goUp=false;
    this.goDown=false;
    this.speedX=0;
    this.speedY=0;    
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = "#E70B33";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        if(this.speedY==0){this.goDown=true;}
        if(this.goDown==true)
            this.speedY=30
        if(this.goUp==true)
            this.speedY=-30
        
        if( (this.x+this.speedX) >-30 && (this.x+this.speedX) <480){
            if( (this.y+this.speedY) >-30 && (this.y+this.speedY) <480){
               if(currentLevel.levelMap[(this.y+this.speedY)*16/480][(this.x+this.speedX)*16/480] != '2'){
                    this.x += this.speedX;
                    this.y += this.speedY;  
                }else{//pour qu'il rebondissent quand il touche un mûr
                    if(this.goDown==true){
                        this.goDown=false;this.goUp=true;
                    }else{
                        this.goUp=false;this.goDown=true;
                    }
                }
            }else{//pour quil rebondissent quand il touche les limites de la map
            if(this.goDown==true){
                this.goDown=false;this.goUp=true;
            }else{
                this.goUp=false;this.goDown=true;
            }
        }
        }
    } 
}

function mapTile() {
    this.gamearea = myGameArea;
    this.update = function() {
        ctx = myGameArea.context;
       // ctx.fillStyle = color;
       // ctx.fillRect(this.x, this.y, this.width, this.height);
        for(var i=0;i<480;i+=30){
            for(var j=0;j<480;j+=30){
                if(currentLevel.levelMap[j*16/480][i*16/480] == '1'){//attention les i et j doivent etre inversés!!!!!!! 
                    ctx.fillStyle = "#37A016";//floor,grass
                    ctx.fillRect(i, j, 30, 30);
                }else if(currentLevel.levelMap[j*16/480][i*16/480] == '2'){//wall
                    ctx.fillStyle = "#ABB4A8";
                    ctx.fillRect(i, j, 30, 30);
                    ctx.fillStyle = "#353B34";
                    ctx.strokeRect(i-1,j-1,30,30);
                }else if(currentLevel.levelMap[j*16/480][i*16/480] == '0'){//danger
                    ctx.fillStyle = "#EC260F";
                    ctx.fillRect(i, j, 30, 30);
                    ctx.fillStyle = "#7A0D21";
                    ctx.strokeRect(i-1,j-1,30,30);
                }else if(currentLevel.levelMap[j*16/480][i*16/480] == '7'){//door
                    ctx.fillStyle = "black";
                    ctx.fillRect(i, j, 30, 30);
                    ctx.fillStyle = "#494545";
                    ctx.strokeRect(i-1,j-1,30,30);
                }
            }
        }
    } 
}

function updateGameArea() {
    myGameArea.clear();
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.speedX = -30; }
    if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.speedX = 30; }
    if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.speedY = -30; }
    if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speedY = 30; }
    myMapTiles.update();
    myGamePiece.newPos();    
    myGamePiece.update();
    for(var it=0;it<ListEnnemy.length;it++){
        ListEnnemy[it].newPos();
        ListEnnemy[it].update();    
    }
}

startGame()
