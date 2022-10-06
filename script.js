bonsai.run(document.getElementById('movie'), {
    code: function() {
	var points = [];
	var intPoints = [];
	var circles = [];
	var intCircles = [];
	var curve = [];
	var intCurve = [];
	var canvas1 = {};
	var canvas2 = {};
    var grid1=[0,375,750,375];
    var grid2=[375,750,375,0];  
	
	canvas2 = new Rect(750,0,stage.options.width,stage.options.height);
	canvas2.attr('fillColor', 'black');
	canvas2.addTo(stage);
      
	canvas1 = new Rect(0,0,(stage.options.width/2), stage.options.height);
	canvas1.attr('fillColor', 'white');
	canvas1.addTo(stage);

	var cGrid1=new Path(grid1);cGrid1.stroke('black',0.9);cGrid1.addTo(stage);
	var cGrid2=new Path(grid2);cGrid2.stroke('black',0.9);cGrid2.addTo(stage);
	
	function interp(ponto1, ponto2, t){
	  var coord1 = (1-t)*ponto1.x + t*ponto2.x
	  var coord2 = (1-t)*ponto1.y + t*ponto2.y
	  return new Point(coord1,coord2)
	}
	
	function deCasteljau(){
	  curve = []
	  updatePoints()
	  for (var t = 0; t <= 1; t+=0.001) {
		var auxPoints = []
		auxPoints = points
		while (auxPoints.length>1) {
		  var tamanho = auxPoints.length
		  var temp2 = []
		  for (var i = 0; i < tamanho-1; i++) {
			var newPoint = interp(auxPoints[i], auxPoints[i+1], t)
			temp2.push(newPoint)
		  }
		  auxPoints = temp2;
		}
		curve.push(auxPoints[0].x)
		curve.push(auxPoints[0].y)
	  }
	}

      
      
	function intDeCasteljau(){
	  intCurve = []
	  for (var t = 0; t <= 1; t+=0.001) {
		var auxPoints = []
		auxPoints = intPoints
		while (auxPoints.length>1) {
		  var tamanho = auxPoints.length
		  var temp2 = []
		  for (var i = 0; i < tamanho-1; i++) {
			var newPoint = interp(auxPoints[i], auxPoints[i+1], t)
			temp2.push(newPoint)
		  }
		  auxPoints = temp2;
		}
		intCurve.push(auxPoints[0].x+750)
		intCurve.push(auxPoints[0].y)
	  }
	}
	
	function updatePoints(){
		points = []	
		for(var i=0;i<circles.length;i++){
			points.push(new Point(circles[i].attr('x'), circles[i].attr('y')))
		}
	}

	canvas1.on('click', function(e) {
			curve = []
			var circ = new Circle(e.x, e.y, 3).fill('navy').on('drag', function(evt){
					this.attr({x: evt.x, y:evt.y});
			});
			//points.push(new Point(e.x, e.y))
			circles.push(circ);
        	circ.addTo(stage);
			intPoints = []
			intCircles = []
			intPaths = []
			updatePoints()
			var paths = []
			if(circles.length > 1){
				for(var i=0;i<circles.length-1;i++){
					paths.push(new Path([
						['moveTo', circles[i].attr('x'), circles[i].attr('y')],
						['lineTo', circles[i+1].attr('x'), circles[i+1].attr('y')]				
					]).stroke('green',0.9));			
				}
				if(points.length >= 3){
					deCasteljau()
					paths.push(new Path(curve).stroke('blue', 1))
				}
			}
			var stageObjects = [];
			stageObjects.push(canvas1)
			stageObjects.push(canvas2)
			stageObjects.push(cGrid1)
			stageObjects.push(cGrid2)
			paths.forEach(function(p){
				stageObjects.push(p);
			});
			circles.forEach(function(c) {
				stageObjects.push(c);
			});
			stage.children(stageObjects);
		
    });
		
	canvas2.on('click', function(evt) {
		/*var rect = new Rect(760, 10, 40, 40)
		rect.attr('fillColor', 'white');
		rect.addTo(stage);*/
		intPoints.push(new Point(evt.x-750, evt.y))
		//console.log(intPoints[0].x + ',' + intPoints[0].y + " " + points.length)
		var intCirc = new Circle(evt.x, evt.y, 3).fill('red')
		intCircles.push(intCirc);
		intCirc.addTo(stage);
		for(var i = 0; i < points.length; i++) {
			intPoints.push(new Point(intPoints[i].x + (points[i].x-375)/points.length,intPoints[i].y+( points[i].y-375)/points.length) )
			var circTemp = new Circle(intPoints[i+1].x+750, intPoints[i+1].y, 3).fill('red');
			intCircles.push(circTemp);
			circTemp.addTo(stage);
			/*console.log(intPoints[i+1].x+750 + ',' + intPoints[i+1].y)			
			console.log(intPoints[i+1].x + ',' + intPoints[i+1].y)			
			console.log(points[i].x + ',' + points[i].y)
			console.log(intPoints[i].x + ',' + intPoints[i].y)
			console.log(" ");*/
		}
		var intPaths = []
		for(var i=0;i<intCircles.length-1;i++){
			intPaths.push(new Path([
				['moveTo', intCircles[i].attr('x'), intCircles[i].attr('y')],
				['lineTo', intCircles[i+1].attr('x'), intCircles[i+1].attr('y')]				
			]).stroke('red',0.9));			
		}
		intPaths.forEach(function (p) {
			p.addTo(stage);
		})
		intDeCasteljau()
		var tempPath = new Path(intCurve).stroke('white', 0.9) 
		intPaths.push(tempPath)
		tempPath.addTo(stage)
		/*var stageObjects = [];
		stageObjects.push(canvas1)
		stageObjects.push(canvas2)
		intPaths.forEach(function(p){
			stageObjects.push(p);
		});
		intCircles.forEach(function(c) {
			stageObjects.push(c);
		});
		stage.children(stageObjects);*/
	})

    },
    width: 1500,
    height: 750
});
