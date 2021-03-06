const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const scale = 20;

context.scale(scale, scale);

function clean(){
	context.fillStyle = 'black';
	context.fillRect(0, 0, canvas.width, canvas.height);
}

let colors= {
	1: "purple",
	2: "brown",
	3: "teal",
	4: "green",
	5: "white",
	6: "maroon",
	7: "silver",
};

function Block(blckParams){
	const allBlocks = ["L","T","Z","S","O","I","J"];

	const blocks = {
		L : [
			[0, 0 , 1],
			[1, 1 , 1],
			[0, 0 , 0],
		],
		T:[
			[0, 2 , 0],
			[2, 2 , 2],
			[0, 0 , 0],
		],
		Z:[
			[3, 3 , 0],
			[0, 3 , 3],
			[0, 0 , 0],
		],
		S:[
			
			[0, 4 , 4],
			[4, 4 , 0],
			[0, 0 , 0],
		],
		O:[
			[5, 5 ],
			[5, 5 ],
		],
		I:[
			[0, 6, 0, 0],
			[0, 6, 0, 0],
			[0, 6, 0, 0],
			[0, 6, 0, 0],
		],
		J : [
			[7, 0 , 0],
			[7, 7 , 7],
			[0, 0 , 0],
		]
	};	

	let block = blocks[allBlocks[parseInt(Math.random() * 7)]];
	
	let coordinate = {
		x: parseInt(canvas.width/(2*scale)-2),
		y: 0
	};

	let touchesDown = false;
	let touchesSide = false;

	this.draw = function(){
		for (let i=0; i<block.length; i++) {
			for (let j=0; j<block[i].length; j++) {
				if(block[i][j]>0){
					context.fillStyle = colors[block[i][j]];
					context.fillRect(coordinate.x+j, coordinate.y+i, 1, 1);
				}
			}
		}			
	};

	this.move = function(x, y, allBlocks){
		if(!this.collide(x, y, allBlocks) && !touchesDown){
			console.log('not collide');
			clean();
			coordinate.x += x;
			coordinate.y += y;
			this.draw();
			allBlocks.draw();

		}else{
			console.log('collide');
		}

	};

	this.isTouchedDown = function(){
		return touchesDown;
	}

	this.rotate = function(){
		clean();
		for(let i=0; i<block.length; i++) {
			console.log(block[i,0]);
			/*for(let j=0; 0<block.length; j++){
				block[i][j] = block[j][i];
			}*/
		}
		this.draw();
	}

	this.collide = function(x, y, allBlocks){
		if(touchesDown){
			return true;
		}		
		touchesSide = false;
		for(let i=0; i<block.length;i++){
			for(let j=0; j<block[i].length;j++){
				if(block[i][j]>0){
					touchesDown = coordinate.y+y+i >= allBlocks.getAllRows().length || 
							(allBlocks.getAllRows()[coordinate.y+i][coordinate.x+x+j]==0 &&
						     	 allBlocks.getAllRows()[coordinate.y+y+i][coordinate.x+j]>0);

					if(touchesDown){
						return true;
					}		
					
					touchesSide = coordinate.x+x+j < 0 ||
							coordinate.x+x+j == allBlocks.getAllRows()[i].length ||
							(allBlocks.getAllRows()[coordinate.y+y+i][coordinate.x+j]==0 &&
						     	 allBlocks.getAllRows()[coordinate.y+i][coordinate.x+x+j]>0);
					if(touchesSide){
						return true;
					}		
				}				
				
			}
		}
	};

	this.addToBlocks = function(allBlocks) {
		for(let i=0; i<block.length; i++){
			for(let j=0; j<block[i].length;j++){
				if(block[i][j]>0){
					allBlocks.getAllRows()[coordinate.y+i][coordinate.x+j] = block[i][j];					
				}
			}
		}
	};
};


function AllBlocks(screen){
	let rows = new Array(screen.height / screen.scale);

	this.init = function(){
		for (let i = 0; i<rows.length ; i++) {
			let line = new Array(screen.width / screen.scale);
			for (let j = 0; j<line.length ; j++) {
				line[j] = 0;
			}
			rows[i] = line;
		}
		return this;
	};
	this.getAllRows = function(){
		return rows;
	};
	this.draw = function(){
		for (let i=0; i<rows.length; i++) {
			for (let j=0; j<rows[i].length; j++) {
				if(rows[i][j]>0){
					context.fillStyle = colors[rows[i][j]];
					context.fillRect(j, i, 1, 1);
				}
			}
		}			
	};	
}

function Game(){
	let block;
	let allBlocks;
	let speed = 2;
	let screen = {
		width: canvas.width,
		height: canvas.height,
		scale: scale
	}
	
	this.init = function(){
		clean();
		block = new Block({});
		block.draw();

		allBlocks = new AllBlocks(screen);
		allBlocks.init().draw();
		this.assignKeys();
	};

	this.update = function() {
		if(!block.isTouchedDown()){
			block.move(0,1,allBlocks);
		} else {
			console.log('new');
			block.addToBlocks(allBlocks);
			block = new Block({});
			block.draw();	
			allBlocks.draw();
		}

	};
	this.getSpeed = function(){
		return speed;
	};
	this.assignKeys = function(){
		window.addEventListener("keydown", function(e){
		    if(e.keyCode == 65){
		    	block.move(-1,0,allBlocks);
		    }
		    if(e.keyCode == 68){
		    	block.move(1,0,allBlocks);
		    }
		    /*if(e.keyCode == 115){
		    	block.rotate();
		    }*/
		    if(e.keyCode == 119){
		    	block.move(0,1,allBlocks);
		    }		    
		});
	}	
}

function Animation(){
	let t = 0;
	this.start = function(){
		game = new Game();
		game.init();		
		window.requestAnimationFrame(animate); 		
	};
	function animate(time){
		let timeSecond = parseInt(time / 1000 * game.getSpeed());
		
		if (t < timeSecond){
			game.update();
			t = timeSecond;
		}
		window.requestAnimationFrame(animate); 	
	};
}

animation = new Animation();
animation.start();
