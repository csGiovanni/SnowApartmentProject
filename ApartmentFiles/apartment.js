var canvas, gl;

var numVertices  = 0;
var pointsArray = [];
var colorsArray = [];

// Variables that control the orthographic projection bounds.
var y_max = 5;
var y_min = -5;
var x_max = 8;
var x_min = -8;
var near = -50;
var far = 50;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

/*
      E ----  F
     /|     / |
    A ---  B  |
    | |    |  |
    | G----+- H
    |/     | /
    C------D/                 */
var vertices = [
        //Streetlight Top (Timmy Do)
        vec4( -1,  0.5,  -0.8, 1.0 ),  // A (0)
        vec4( 1,  0.5,  -0.8, 1.0 ),  // B (1)
        vec4( -1,  0.5,  0.8, 1.0 ),  // C (2)
        vec4( 1,  0.5,  0.8, 1.0 ), // D (3)
        vec4( -0.8,  0.5,  -1, 1.0 ),  // E (4)
        vec4( 0.8,  0.5,  -1, 1.0 ),  // F (5)
        vec4( -0.8,  0.5,  1, 1.0 ),  // G (6)
        vec4( 0.8,  0.5,  1, 1.0 ), // H (7)

        vec4( -0.7,  0.8,  -0.7, 1.0 ),  // I (8)
        vec4( 0.7,  0.8,  -0.7, 1.0 ),  // J (9)
        vec4( -0.7,  0.8,  0.7, 1.0 ),  // K (10)
        vec4( 0.7,  0.8,  0.7, 1.0 ), // L (11)

        vec4( -1,  -0.5,  -0.8, 1.0 ),  // M (12)
        vec4( 1,  -0.5,  -0.8, 1.0 ),  // N (13)
        vec4( -1,  -0.5,  0.8, 1.0 ),  // O (14)
        vec4( 1,  -0.5,  0.8, 1.0 ), // P (15)
        vec4( -0.8,  -0.5,  -1, 1.0 ),  // Q (16)
        vec4( 0.8,  -0.5,  -1, 1.0 ),  // R (17)
        vec4( -0.8,  -0.5,  1, 1.0 ),  // S (18)
        vec4( 0.8,  -0.5,  1, 1.0 ), // T (19)

        vec4( -0.7,  -0.8,  -0.7, 1.0 ),  // U (20)
        vec4( 0.7,  -0.8,  -0.7, 1.0 ),  // V (21)
        vec4( -0.7,  -0.8,  0.7, 1.0 ),  // W (22)
        vec4( 0.7,  -0.8,  0.7, 1.0 ), // X (23)

        vec4( -0.8,  0.4,  -0.6, 1.0 ),  // A' (24)
        vec4( 0.8,  0.4,  -0.6, 1.0 ),  // B' (25)
        vec4( -0.8,  0.4,  0.6, 1.0 ),  // C' (26)
        vec4( 0.8,  0.4,  0.6, 1.0 ), // D' (27)
        vec4( -0.6,  0.4,  -0.8, 1.0 ),  // E' (28)
        vec4( 0.6,  0.4,  -0.8, 1.0 ),  // F' (29)
        vec4( -0.6,  0.4,  0.8, 1.0 ),  // G' (30)
        vec4( 0.6,  0.4,  0.8, 1.0 ), // H' (31)

        vec4( -0.8,  -0.4,  -0.6, 1.0 ),  // M' (32)
        vec4( 0.8,  -0.4,  -0.6, 1.0 ),  // N' (33)
        vec4( -0.8,  -0.4,  0.6, 1.0 ),  // O'(34)
        vec4( 0.8,  -0.4,  0.6, 1.0 ), // P' (35)
        vec4( -0.6,  -0.4,  -0.8, 1.0 ),  // Q' (36)
        vec4( 0.6,  -0.4,  -0.8, 1.0 ),  // R' (37)
        vec4( -0.6,  -0.4,  0.8, 1.0 ),  // S' (38)
        vec4( 0.6,  -0.4,  0.8, 1.0 ) // T' (39)



    ];

var vertexColors = [
        // Lamp colors
        vec4(0.5, 0.5, 0.5, 1.0), // Metal
        vec4(0.4, 0.4, 0.4, 1.0), // Darker Metal
        vec4(1, 1, 0.25, 1.0), // Light

        // Building colors
        vec4(0.6, 0.6, 0.6, 1.0), // gray
        vec4(0.5, 0.5, 0.5, 1.0), // gray (shade)
        vec4(0.9, 0.9, 0.9, 1.0), // snow
        vec4(0.7, 0.7, 0.7, 1.0), // snow (shade)
        vec4(0.2, 0.2, 0.2, 1.0) // windows
    ];


// quad uses first index to set color for face
function quad(a, b, c, d, colorIndex) {
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[colorIndex]);
     pointsArray.push(vertices[b]);
     colorsArray.push(vertexColors[colorIndex]);
     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[colorIndex]);
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[colorIndex]);
     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[colorIndex]);
     pointsArray.push(vertices[d]);
     colorsArray.push(vertexColors[colorIndex]);
     numVertices = numVertices + 6;
}

function tri(a,b,c,colorIndex){
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[colorIndex]);
     pointsArray.push(vertices[b]);
     colorsArray.push(vertexColors[colorIndex]);
     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[colorIndex]);
     numVertices = numVertices + 3;
}
function cube(width, height, thickness, locX, locY, locZ, colorIndex){
    var index = vertices.length;
    vertices.push(vec4(locX,  locY + height,  locZ + thickness, 1.0 ));  // A (0)
    vertices.push(vec4(locX + width,  locY + height,  locZ + thickness, 1.0 ));  // B (1)
    vertices.push(vec4(locX, locY, locZ + thickness, 1.0 ));  // C (2)
    vertices.push(vec4(locX + width, locY,  locZ + thickness, 1.0 )); // D (3)
    vertices.push(vec4(locX, locY + height, locZ, 1.0 )); // E (4)
    vertices.push(vec4(locX + width,  locY + height, locZ, 1.0 )); // F (5)
    vertices.push(vec4(locX, locY, locZ, 1.0 )); // G (6)
    vertices.push(vec4(locX + width, locY, locZ, 1.0 ));  // H (7)

    quad(index + 2,index,index + 1,index + 3,colorIndex);
    quad(index + 3,index + 1,index + 5,index + 7,colorIndex + 1);
    quad(index + 7,index + 5,index + 4,index + 6,colorIndex);
    quad(index + 6,index + 4,index,index + 2,colorIndex + 1);
    quad(index,index + 4,index + 5,index + 1,colorIndex + 1);
    quad(index + 2,index + 6,index + 7,index + 3,colorIndex + 1);
}
function cylinder(points, height, radius, locX, locY, locZ,colorIndex){
    // Circle variables
    
	var SIZE = points; // circle slices
	var angle = 2*Math.PI/SIZE;
    var center = vec4(locX,locY,locZ,1.0);
    var topIndices = [];
    var bottomIndices = [];
    var bottomCenterIndex = vertices.length;

    vertices.push(center);
    var index = vertices.length;

    // bottom circle vertices
	for  (var i=0; i<SIZE+1; i++) {
        var newBottomVertex = vec4(center[0]+radius*Math.cos(i*angle), locY, center[2]+radius*Math.sin(i*angle), 1.0);
	    vertices.push(newBottomVertex);
        bottomIndices.push(index + i);
	}

    center = vec4(locX, locY + height, locZ, 1.0);
    var topCenterIndex = vertices.length;

    vertices.push(center);
    index = vertices.length;

    // top circle vertices
	for  (var i=0; i<SIZE+1; i++) {
        var newTopVertex = vec4(center[0]+radius*Math.cos(i*angle), locY + height, center[2]+radius*Math.sin(i*angle), 1.0);
	    vertices.push(newTopVertex);
        topIndices.push(index + i);
	}

    // Make bottom circle
    for(var i=0; i<bottomIndices.length - 1; i++){
        tri(bottomCenterIndex, bottomIndices[i], bottomIndices[i + 1], colorIndex + 1);
    }
    // Make top circle
    for(var i=0; i<topIndices.length - 1; i++){
        tri(topCenterIndex, topIndices[i], topIndices[i + 1], colorIndex + 1);
    }
    //Make walls
    for(var i=0; i<topIndices.length - 1;i++){
        if(i % 2 == 0){
            quad(bottomIndices[i], topIndices[i], topIndices[i+1],bottomIndices[i+1],colorIndex + 1);
        }
        else{
            quad(bottomIndices[i], topIndices[i], topIndices[i+1],bottomIndices[i+1],colorIndex);
        }
    }
}

// Each face is formed with two triangles
function MakeStreetLamp() {
    //Top
    tri(0,8,4,1);//AIE
    quad(4,8,9,5,0);//EIJF
    tri(5,9,1,1);//FJB
    quad(1,9,11,3,0);//BJLD
    tri(3,11,7,1);//DLH
    quad(10,6,7,11,0);//KGHL
    tri(2,6,10,1);//CGK
    quad(2,10,8,0,0);//CKIA
    quad(8,10,11,9,1);//IKLJ

    //Middle
    quad(0,24,28,4,0);//AA'E'E
    quad(4,28,29,5,1);//EE'F'F
    quad(5,29,25,1,0);//FF'B'B
    quad(1,25,27,3,1);//BB'D'D
    quad(3,27,31,7,0);//DD'H'H
    quad(7,31,30,6,1);//HH'G'G
    quad(6,30,26,2,0);//GG'C'C
    quad(2,26,24,0,1);//CC'A'A

    
    quad(12,32,36,16,0);//MM'Q'Q
    quad(16,36,37,17,1);//QQ'R'R
    quad(17,37,33,13,0);//RR'N'N
    quad(13,33,35,15,1);//NN'P'P 
    quad(15,35,39,19,0);//PP'T'T
    quad(19,39,38,18,1);//TT'S'S
    quad(18,38,34,14,0);//SS'O'O
    quad(14,34,32,12,1);//OO'M'M
    
    quad(24,32,36,28,1);//A'M'Q'E'
    quad(28,36,37,29,2);//E'Q'R'F'
    quad(29,37,33,25,1);//F'R'N'B'
    quad(25,33,35,27,2);//B'N'P'D'
    quad(27,35,39,31,1);//D'P'T'H'
    quad(31,39,38,30,2);//H'T'S'G'
    quad(30,38,34,26,1);//G'S'O'C'
    quad(26,34,32,24,2);//C'O'M'A'

    //Bottom
    tri(12,20,16,1);//MUQ
    quad(16,20,21,17,0);//QUVR
    tri(17,21,13,1);//RVN
    quad(13,21,23,15,0);//NVXP
    tri(15,23,19,1);//PXT
    quad(22,18,19,23,0);//WSTX
    tri(14,18,22,1);//OSW
    quad(14,22,20,12,0);//OWUM
    quad(20,22,23,21,1);//UWXV

}

function MakeBuilding(xLoc,yLoc,zLoc){
    // Pillars
    cube(1,3,1,xLoc,yLoc,zLoc,3);
    cube(1,3,1,xLoc + 3,yLoc,zLoc,3);
    cube(1,3,1,xLoc + 6,yLoc,zLoc,3);
    cube(1,3,1,xLoc + 9,yLoc,zLoc,3);
    // Top part of building
    cube(15,3,6,xLoc - 1,yLoc + 3,zLoc - 4,3);
    // Hind part of building
    cube(24,12,6,xLoc - 1,yLoc,zLoc - 10,3);
    // Right part of building
    cylinder(8,15,10,xLoc + 20,yLoc,zLoc -5,3);

}

// namespace contain all the project information
var AllInfo = {

    // Camera pan control variables.
    zoomFactor : 1,
    translateX : 0,
    translateY : 0,

    // Camera rotate control variables.
    phi : 1,
    theta : 0.5,
    radius : 1,
    dr : 2.0 * Math.PI/180.0,

    // Mouse control variables
    mouseDownRight : false,
    mouseDownLeft : false,

    mousePosOnClickX : 0,
    mousePosOnClickY : 0
};

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    MakeStreetLamp();  // created the color cube - point positions and face colors

    MakeBuilding(1.5,-0.8,-0.5);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    // Set the position of the eye
    document.getElementById("eyeValue").onclick=function() {
        eyeX=document.parameterForm.xValue.value;
        eyeY=document.parameterForm.yValue.value;
        eyeZ=document.parameterForm.zValue.value;
        render();
    };

    // These four just set the handlers for the buttons.
    document.getElementById("thetaup").addEventListener("click", function(e) {
        AllInfo.theta += AllInfo.dr;
        render();
    });
    document.getElementById("thetadown").addEventListener("click", function(e) {
        AllInfo.theta -= AllInfo.dr;
        render();
    });
    document.getElementById("phiup").addEventListener("click", function(e) {
        AllInfo.phi += AllInfo.dr;
        render();
    });
    document.getElementById("phidown").addEventListener("click", function(e) {
        AllInfo.phi -= AllInfo.dr;
        render();
    });

    // Set the scroll wheel to change the zoom factor.
    // wheelDelta returns an integer value indicating the distance that the mouse wheel rolled.
    // Negative values mean the mouse wheel rolled down. The returned value is always a multiple of 120.
    document.getElementById("gl-canvas").addEventListener("wheel", function(e) {
        if (e.wheelDelta > 0) {
            AllInfo.zoomFactor = Math.max(0.1, AllInfo.zoomFactor - 0.1);
        } else {
            AllInfo.zoomFactor += 0.1;
        }
        render();
    });

    //************************************************************************************
    //* When you click a mouse button, set it so that only that button is seen as
    //* pressed in AllInfo. Then set the position. The idea behind this and the mousemove
    //* event handler's functionality is that each update we see how much the mouse moved
    //* and adjust the camera value by that amount.
    //************************************************************************************
    document.getElementById("gl-canvas").addEventListener("mousedown", function(e) {
        if (e.which == 1) {
            AllInfo.mouseDownLeft = true;
            AllInfo.mouseDownRight = false;
            AllInfo.mousePosOnClickY = e.y;
            AllInfo.mousePosOnClickX = e.x;
        } else if (e.which == 3) {
            AllInfo.mouseDownRight = true;
            AllInfo.mouseDownLeft = false;
            AllInfo.mousePosOnClickY = e.y;
            AllInfo.mousePosOnClickX = e.x;
        }
        render();
    });

    document.addEventListener("mouseup", function(e) {
        AllInfo.mouseDownLeft = false;
        AllInfo.mouseDownRight = false;
        render();
    });

    document.addEventListener("mousemove", function(e) {
        if (AllInfo.mouseDownRight) {
            AllInfo.translateX += (e.x - AllInfo.mousePosOnClickX)/30;
            AllInfo.mousePosOnClickX = e.x;

            AllInfo.translateY -= (e.y - AllInfo.mousePosOnClickY)/30;
            AllInfo.mousePosOnClickY = e.y;
        } else if (AllInfo.mouseDownLeft) {
            AllInfo.phi += (e.x - AllInfo.mousePosOnClickX)/100;
            AllInfo.mousePosOnClickX = e.x;

            AllInfo.theta += (e.y - AllInfo.mousePosOnClickY)/100;
            AllInfo.mousePosOnClickY = e.y;
        }
        render();
    });

    render();
}

var at = vec3(0, 0, 0);
var up = vec3(0, 1, 0);
var eye = vec3(2, 2, 2);

var eyeX=2, eyeY=2, eyeZ=2; // default eye position input values

var render = function() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Setup the projection matrix.
    // Study 1) Use a fixed viewing volume
   //projectionMatrix = ortho(-2, 2, -2, 2, -10, 10);

    // Study 2) Use a viewing volume changed via mouse movements

    projectionMatrix = ortho( x_min*AllInfo.zoomFactor - AllInfo.translateX,
                              x_max*AllInfo.zoomFactor - AllInfo.translateX,
                              y_min*AllInfo.zoomFactor - AllInfo.translateY,
                              y_max*AllInfo.zoomFactor - AllInfo.translateY,
                              near, far);

    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

    // Setup the initial model-view matrix.

    // study 1) learn the effect of eye position by entering specific eye positions from user interface
    //eye= vec3(eyeX, eyeY, eyeZ);

    // Study 2) Setup the eye to move around different points on a sphere
    /*eye = vec3( AllInfo.radius*Math.cos(AllInfo.phi),
                AllInfo.radius*Math.sin(AllInfo.theta),
                AllInfo.radius*Math.sin(AllInfo.phi));*/

    eye = vec3( AllInfo.radius*Math.cos(AllInfo.phi)*Math.sin(AllInfo.theta),
                AllInfo.radius*Math.sin(AllInfo.phi)*Math.sin(AllInfo.theta),
                AllInfo.radius*Math.cos(AllInfo.theta));

    modelViewMatrix = lookAt(eye, at, up);
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
}
