var blobs;
var maxBlobs;
var clickRadius = 50;
window.onload = function(){
	var width = document.querySelector("canvas").width;
	var height = document.querySelector("canvas").height;
	var scrnArea = window.innerWidth * window.innerHeight;
	maxBlobs = scrnArea / 3500;
	if(localStorage.getItem("maxBlobs")){
		maxBlobs = Number(localStorage.getItem("maxBlobs"));
	}
	var rippleno = 0;
	var inripple = false;
	var queripple = false;
	var ripplecoords = [0, 0];
	window.addEventListener("keydown", function(e){
		var key = e.keyCode || e.which;
		if(key == 38) maxBlobs ++;
		if(key == 40) maxBlobs --;
		if(key == 32){
			for(var i = 0; i < maxBlobs; i++) blobs[i].lastMovedRadian -= Math.PI;
		}
		if(key == 83){
			localStorage.setItem("maxBlobs", String(maxBlobs));
		}
		if(key == 82 && !e.ctrlKey){
			maxBlobs = scrnArea / 3500;
			localStorage.setItem("maxBlobs", String(maxBlobs));
		}
		if(maxBlobs < 0) maxBlobs = 0;
	});
	window.addEventListener("click", function(e){
		var coords = [e.clientX, e.clientY];
		for(var i = 0; i < maxBlobs; i++){
			if(Math.sqrt((blobs[i].x * width - coords[0]) * (blobs[i].x * width - coords[0]) + (blobs[i].y * height - coords[1]) * (blobs[i].y * height - coords[1])) <= clickRadius + blobs[i].radius)
				blobs[i].lastMovedRadian -= Math.PI;
		}
		ripplecoords = coords;
		ripple(coords);
	});
	var Dot = function(r){
		this.radius = r;
		this.x = Math.random();
		this.y = Math.random();
		this.hue = Math.floor(Math.random() * 360);
		this.opacity = 100 - r;
		this.moveBy = ((101 - this.radius) / 13000);//((101 - this.radius) / 7000);
		this.lastMovedRadian = Math.random() * 2 * Math.PI;
		this.lastFlipped = 0;
		this.move = function(){
			if(this.lastFlipped > 0) this.lastFlipped --;
			this.lastMovedRadian += (Math.random() - 0.5) / 4;
			this.x += this.moveBy * Math.sin(this.lastMovedRadian);
			this.y += this.moveBy * Math.cos(this.lastMovedRadian);
			if(this.x < 0) {this.x = 0; this.lastMovedRadian = Math.PI * 0.5;}
			if(this.y < 0) {this.y = 0; this.lastMovedRadian = 0;}
			if(this.x > 1) {this.x = 1; this.lastMovedRadian = Math.PI * 1.5;}
			if(this.y > 1) {this.y = 1; this.lastMovedRadian = Math.PI;}
		}
	}
	var ctx = document.querySelector("canvas").getContext("2d");
	var ctx2 = document.getElementById("icn").getContext("2d");
	function ripple(c){
		rippleno = 0;
		inripple = true;
		queripple = true;
	}
	var colonVisible = true;
	blobs = [];
	for(var i = 0; i < 100000; i++){
		blobs.push(new Dot(Math.floor(Math.random() * 100)));
	}
	var d = new Date();
	ctx2.fillText((d.getHours() < 10? ("0" + d.getHours()): (d.getHours())) + ":" + (d.getMinutes() < 10? ("0" + d.getMinutes()): (d.getMinutes())), 0, 12);
	var uri = document.getElementById("icn").toDataURL();
	document.getElementById("icnholder").href = uri;
	var k = 0;
	setInterval(function(){
		document.body.style.backgroundColor = "hsl(" + Math.floor(k / 10) % 361 + ", 100%, 92%)";
		ctx2.clearRect(0, 0, 27, 16);
		if(document.querySelector("canvas").width != window.innerWidth) document.querySelector("canvas").width = window.innerWidth;
		if(document.querySelector("canvas").height != window.innerHeight) document.querySelector("canvas").height = window.innerHeight;
		width = document.querySelector("canvas").width;
		height = document.querySelector("canvas").height;
		ctx.clearRect(0, 0, width, height);
		for(var i = 0; i < maxBlobs; i++){
			ctx.fillStyle = "hsla(" + blobs[i].hue + ", 100%, 50%, " + (blobs[i].opacity / 100) + ")";
			ctx.beginPath();
			ctx.arc(blobs[i].x * width, blobs[i].y * height, blobs[i].radius, 0, 2 * Math.PI, false);
			ctx.fill();
			blobs[i].move();
		}
		if(inripple){
			if(queripple){
				queripple = false;
				rippleno = 0;
			}
			ctx.fillStyle = "hsla(0, 100%, 50%, " + (1 - (rippleno / clickRadius)) +  ")";
			ctx.beginPath();
			ctx.arc(ripplecoords[0], ripplecoords[1], rippleno, 0, 2 * Math.PI, false);
			ctx.fill();
			rippleno += 3;
			if(rippleno >= clickRadius) inripple = false;
		}
		d = new Date();
		document.getElementById("time").innerText = (d.getHours() < 10? ("0" + d.getHours()): (d.getHours())) + ":" + (d.getMinutes() < 10? ("0" + d.getMinutes()): (d.getMinutes()));
		ctx2.fillText(document.getElementById("time").innerText, 0, 12);
		if(d.getSeconds() < 1){
			uri = document.getElementById("icn").toDataURL();
			document.getElementById("icnholder").href = uri;
		}
		k++;
	}, 20);
}