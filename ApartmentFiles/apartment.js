var canvas, gl;

var numVertices  = 36;
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
        vec4(-1,  1,  1, 1.0 ),  // A (0)
        vec4( 1,  1,  1, 1.0 ),  // B (1)
        vec4(-1, -1,  1, 1.0 ),  // C (2)
        vec4( 1, -1,  1, 1.0 ), // D (3)
        vec4( -1, 1, -1, 1.0 ), // E (4)
        vec4( 1,  1, -1, 1.0 ), // F (5)
        vec4( -1,-1, -1, 1.0 ), // G (6)
        vec4( 1, -1, -1, 1.0 ),  // H (7)
    ];

var vertexColors = [
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red (0 front)
        vec4( 0.8, 0.8, 0.2, 1.0 ),  // yellowish-green (1)
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green (2)
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue (3 right)
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta (4)
        vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan (5 top)
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow (6 left)
    ];


// quad uses first index to set color for face
function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[b]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[d]);
     colorsArray.push(vertexColors[a]);
}

// Each face is formed with two triangles
function colorCube() {
    quad( 0, 1, 3, 2 );  // front(ABDC) red
    quad( 4, 5, 7, 6 );  // back(EFHG)  magenta
    quad( 3, 1, 5, 7 );  // right (DBFH) blue
    quad( 6, 2, 0, 4 );  // left (GCAE) yellow
    quad( 2, 6, 7, 3 ); // bottom (CGHD) green
    quad( 5, 4, 0, 1); // top (AEFB) cyan
}

// namespace contain all the project information
var AllInfo = {

    // Camera pan control variables.
    zoomFactor : 8,
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

    colorCube();  // created the color cube - point positions and face colors

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
