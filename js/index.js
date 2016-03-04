var sketch = angular.module('sketch', []);
sketch.controller('sketchController', ['$scope', function($scope){
	$scope.canvasWH = {width:600,height:600};
	// $scope.ca = {width:20,height:20};
	var current;  //保存当前的画布状态
	var canvas = document.querySelector("canvas");
	var ctx = canvas.getContext("2d");
	$scope.tool = "line";	
	$scope.tools = {
		"橡皮":"clear","画圆":"arc","矩形":"rect","画线":"line","铅笔":"suiyi","选择":"select"
	};
	$scope.strokeStyle = "#0f0";
	$scope.csState = {
		fillStyle:"#000000",
		strokeStyle:"#000000",
		lineWidth:1,
		style:'stroke'
	}
	$scope.setStyle = function(s){
		$scope.csState.style = s;
	}
	var clearCanvas = function(){
		ctx.clearRect(0,0,$scope.canvasWH.width,$scope.canvasWH.height);
	}
	var setmousemove = {
		line:function(evs){//画直线
			canvas.onmousemove = function(ev){
				clearCanvas();
				if(current){
					ctx.putImageData(current,0,0);
				}
				ctx.beginPath();
				ctx.moveTo(evs.offsetX,evs.offsetY);
				ctx.lineTo(ev.offsetX,ev.offsetY);
				ctx.stroke();
			}
		},
		arc:function(evs){//画圆
			canvas.onmousemove = function(ev){
				clearCanvas();
				if(current){
					ctx.putImageData(current,0,0);
				}
				ctx.beginPath();
				ctx.moveTo(ev.offsetX,evs.offsetY);
				var r = Math.abs(ev.offsetX-evs.offsetX);
				ctx.arc(evs.offsetX,evs.offsetY,r,0,Math.PI*2);
				if($scope.csState.style == "fill"){
					ctx.fill();
				}else{
					ctx.stroke();
				}
			}
		},
		suiyi:function(evs){//画随意线
			ctx.beginPath();
			ctx.moveTo(evs.offsetX,evs.offsetY);
			canvas.onmousemove = function(ev){
				clearCanvas();
				if(current){
					ctx.putImageData(current,0,0);
				}
				
				ctx.lineTo(ev.offsetX,ev.offsetY);
				ctx.stroke();
			}
		},
		rect:function(evs){//画矩形
			canvas.onmousemove = function(ev){
				clearCanvas();
				if(current){
					ctx.putImageData(current,0,0);
				}
				ctx.beginPath();
				ctx.moveTo(evs.offsetX,evs.offsetY);
				var x = ev.offsetX - evs.offsetX - 0.5;
				var y = ev.offsetY - evs.offsetY - 0.5;
				if($scope.csState.style == "fill"){
					ctx.fillRect(evs.offsetX,evs.offsetY,x,y);
				}else{
					ctx.strokeRect(evs.offsetX,evs.offsetY,x,y);
				}
				
			}
		},
		clear:function(evs){//橡皮擦
			canvas.onmousemove = function(ev){
				var x = ev.offsetX - evs.offsetX;
				var y = ev.offsetY - evs.offsetY;
				ctx.clearRect(evs.offsetX,evs.offsetY,x,y);
			}
		}
	}
	//画矩形
	canvas.onmousedown = function(e){
		var evs = e||window.event;
		ctx.strokeStyle = $scope.csState.strokeStyle;
		ctx.fillStyle = $scope.csState.fillStyle;
		ctx.lineWidth = $scope.csState.lineWidth;
		setmousemove[$scope.tool](evs);
		document.onmouseup = function(){
			canvas.onmousemove = null;
			canvas.onmouseup = null;
			current = ctx.getImageData(0,0,$scope.canvasWH.width,$scope.canvasWH.height);
		}
	}
	$scope.setTool = function(tool){
		$scope.tool = tool;
	}
	$scope.save = function(ev){
		if(current){
			ev.srcElement.href = canvas.toDataURL();
			ev.srcElement.download = "mypic.png";			
		}
		else{
			alert("空画布");
		}
	}
	$scope.newSketch = function(){
		if(current){
			var a = confirm("是否保存图片");
			if(a){
				location.href = (canvas.toDataURL().replace('data:image/png','data:stream/octet'));
				current = null;
			}else{
				clearCanvas();
				current = null;
			}
		}else{
			clearCanvas();
			current = null;
		}
	}
}])