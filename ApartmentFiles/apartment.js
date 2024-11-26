/**
 * Project 4 Part 2
 * Giovanni Del Valle, Timmy Do
 * 
 * Objects:
 *  Building, Street Lamp : Timmy Do
 *  Trash Can, Traffic Cone : Giovanni Del Valle
 * 
 * Version Control : GitHub
 */


var canvas, gl;

var numVertices  = 0;
var pointsArray = [];
var colorsArray = [];
var normalsArray = [];
var texCoordsArray = [];

var lightPosition = vec4(2, 3, 2, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 0.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 0.0, 0.0, 1.0, 1.0);
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 50.0;

var ctm;
var ambientColor, diffuseColor, specularColor;

// texture coordinates
var texCoord = [
    vec2(0, .5),
    vec2(0, 0),
    vec2(.5, .5),
    vec2(.5, 0),
];

var texture;

// Variables that control the orthographic projection bounds.
var y_max = 5;
var y_min = -5;
var x_max = 8;
var x_min = -8;
var near = -50;
var far = 50;

var MatrixStack = [];
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var diffuseProductLoc, ambientProductLoc;

var ApartmentIndex, ApartmentAmount;
var ApartmentRoofIndex, ApartmentRoofAmount;
var ApartmentRailIndex, ApartmentRailAmount;
var ApartmentDoorIndex, ApartmentDoorAmount;

var StreetLampHeadIndex, StreetLampHeadAmount;
var StreetLightIndex, StreeLightAmount;
var StreetLampPoleIndex, StreetLampPoleAmount;

var ConeIndex, ConeAmount;
var CylinderIndex, CylinderAmount;
var TrashCanLidIndex, TrashCanStripIndex;
var TrashCanLidAmount, TrashCanStripAmount;
var FountainIndex, FountainAmount;

var dynamicVertices = [
    //Streetlight Top and Building Structure (Timmy Do)
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
var vertices = [
        



    ];

function rgb(r, g, b, a) {
    return vec4(r / 255, g / 255, b / 255, a / 255)
}

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
        vec4(0.2, 0.2, 0.2, 1.0), // windows

        // Trash Can Colors
        rgb(3, 132, 224, 255),
        rgb(1, 86, 147, 255),

        // Traffic Cone Colors,
        rgb(205, 205, 205, 255), // Gray
        rgb(255, 255, 255, 255), // White
        rgb(250, 105, 61, 255), // Bright Orange
        rgb(249, 231, 14, 255), // Yellow
    ];


// quad uses first index to set color for face
function quad(a, b, c, d, colorIndex) {

    var indices=[a, b, c, d];
    var normal = Newell(vertices, indices);

    // triangle a-b-c
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[colorIndex]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[b]);
     colorsArray.push(vertexColors[colorIndex]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[1]);

     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[colorIndex]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[2]);

     // triangle a-c-d
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[colorIndex]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[colorIndex]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[2]);

     pointsArray.push(vertices[d]);
     colorsArray.push(vertexColors[colorIndex]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[3]);
     numVertices = numVertices + 6;
}

function tri(a,b,c,colorIndex){
    var indices=[a, b, c];
    var normal = Newell(vertices, indices);

    // triangle a-b-c
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[colorIndex]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[b]);
     colorsArray.push(vertexColors[colorIndex]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[1]);

     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[colorIndex]);
     normalsArray.push(normal);
     texCoordsArray.push(texCoord[2]);

     numVertices = numVertices + 3;
}
// Everything made by tri() and quad() are all drawn at once. These dynamic functions will allow us to draw only some shapes (and repeated)
// THESE NEED TO BE USED ONLY AFTER ALL tri() AND quad() CALLS SINCE THIS MODIFIES pointsArray AND colorsArray WITHOUT CHANGING numVertices
// THIS CAN LEAD TO numVertices BEING "OFF"
// It is up to the user of these functions to record the index and number of vertices created
function triDynamic(a, b, c, colorIndex) {
    let index = pointsArray.length;
    var indices=[a, b, c];
    var normal = Newell(dynamicVertices, indices);
    // triangle a-b-c
    pointsArray.push(dynamicVertices[a]);
    colorsArray.push(vertexColors[colorIndex]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[0]);

    pointsArray.push(dynamicVertices[b]);
    colorsArray.push(vertexColors[colorIndex]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[1]);

    pointsArray.push(dynamicVertices[c]);
    colorsArray.push(vertexColors[colorIndex]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[2]);

    return [index, /* Number of points created */ 3]
}
function quadDynamic(a, b, c, d, colorIndex) {
    let index = pointsArray.length;
    var indices=[a, b, c, d];
    var normal = Newell(dynamicVertices, indices);
    // triangle a-b-c
    pointsArray.push(dynamicVertices[a]);
    colorsArray.push(vertexColors[colorIndex]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[0]);

    pointsArray.push(dynamicVertices[b]);
    colorsArray.push(vertexColors[colorIndex]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[1]);

    pointsArray.push(dynamicVertices[c]);
    colorsArray.push(vertexColors[colorIndex]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[2]);

    // triangle a-c-d
    pointsArray.push(dynamicVertices[a]);
    colorsArray.push(vertexColors[colorIndex]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[0]);

    pointsArray.push(dynamicVertices[c]);
    colorsArray.push(vertexColors[colorIndex]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[2]);

    pointsArray.push(dynamicVertices[d]);
    colorsArray.push(vertexColors[colorIndex]);
    normalsArray.push(normal);
    texCoordsArray.push(texCoord[3]);

    return [index, /* Number of points created */ 6]
}
function cube(width, height, thickness, locX, locY, locZ, colorIndex){
    var index = dynamicVertices.length;
    dynamicVertices.push(vec4(locX,  locY + height,  locZ + thickness, 1.0 ));  // A (0)
    dynamicVertices.push(vec4(locX + width,  locY + height,  locZ + thickness, 1.0 ));  // B (1)
    dynamicVertices.push(vec4(locX, locY, locZ + thickness, 1.0 ));  // C (2)
    dynamicVertices.push(vec4(locX + width, locY,  locZ + thickness, 1.0 )); // D (3)
    dynamicVertices.push(vec4(locX, locY + height, locZ, 1.0 )); // E (4)
    dynamicVertices.push(vec4(locX + width,  locY + height, locZ, 1.0 )); // F (5)
    dynamicVertices.push(vec4(locX, locY, locZ, 1.0 )); // G (6)
    dynamicVertices.push(vec4(locX + width, locY, locZ, 1.0 ));  // H (7)

    quadDynamic(index + 2,index,index + 1,index + 3,colorIndex);
    quadDynamic(index + 3,index + 1,index + 5,index + 7,colorIndex + 1);
    quadDynamic(index + 7,index + 5,index + 4,index + 6,colorIndex);
    quadDynamic(index + 6,index + 4,index,index + 2,colorIndex + 1);
    quadDynamic(index,index + 4,index + 5,index + 1,colorIndex + 1);
    quadDynamic(index + 2,index + 6,index + 7,index + 3,colorIndex + 1);
}

function Newell(Vertices, indices)
{
   var L=indices.length;
   var x=0, y=0, z=0;
   var index, nextIndex;

   for (var i=0; i<L; i++)
   {
       index=indices[i];
       nextIndex = indices[(i+1)%L];

       x += (Vertices[index][1] - Vertices[nextIndex][1])*
            (Vertices[index][2] + Vertices[nextIndex][2]);
       y += (Vertices[index][2] - Vertices[nextIndex][2])*
            (Vertices[index][0] + Vertices[nextIndex][0]);
       z += (Vertices[index][0] - Vertices[nextIndex][0])*
            (Vertices[index][1] + Vertices[nextIndex][1]);
   }

   return (normalize(vec3(x, y, z)));
}
function cylinder(points, height, radius, locX, locY, locZ,colorIndex){
    // Circle variables
    
	var SIZE = points; // circle slices
	var angle = 2*Math.PI/SIZE;
    var center = vec4(locX,locY,locZ,1.0);
    var topIndices = [];
    var bottomIndices = [];
    var bottomCenterIndex = vertices.length;

    dynamicVertices.push(center);
    var index = dynamicVertices.length;

    // bottom circle vertices
	for  (var i=0; i<SIZE+1; i++) {
        var newBottomVertex = vec4(center[0]+radius*Math.cos(i*angle), locY, center[2]+radius*Math.sin(i*angle), 1.0);
	    dynamicVertices.push(newBottomVertex);
        bottomIndices.push(index + i);
	}

    center = vec4(locX, locY + height, locZ, 1.0);
    var topCenterIndex = dynamicVertices.length;

    dynamicVertices.push(center);
    index = dynamicVertices.length;

    // top circle vertices
	for  (var i=0; i<SIZE+1; i++) {
        var newTopVertex = vec4(center[0]+radius*Math.cos(i*angle), locY + height, center[2]+radius*Math.sin(i*angle), 1.0);
	    dynamicVertices.push(newTopVertex);
        topIndices.push(index + i);
	}

    // Make bottom circle
    for(var i=0; i<bottomIndices.length - 1; i++){
        triDynamic(bottomCenterIndex, bottomIndices[i], bottomIndices[i + 1], colorIndex + 1);
    }
    // Make top circle
    for(var i=0; i<topIndices.length - 1; i++){
        triDynamic(topCenterIndex, topIndices[i], topIndices[i + 1], colorIndex + 1);
    }
    //Make walls
    for(var i=0; i<topIndices.length - 1;i++){
        if(i % 2 == 0){
            quadDynamic(bottomIndices[i], topIndices[i], topIndices[i+1],bottomIndices[i+1],colorIndex + 1);
        }
        else{
            quadDynamic(bottomIndices[i], topIndices[i], topIndices[i+1],bottomIndices[i+1],colorIndex);
        }
    }
}

function MakeStreetLamp() {
    StreetLampHeadIndex = pointsArray.length;

    //Top
    triDynamic(0,8,4,1);//AIE
    quadDynamic(4,8,9,5,0);//EIJF
    triDynamic(5,9,1,1);//FJB
    quadDynamic(1,9,11,3,0);//BJLD
    triDynamic(3,11,7,1);//DLH
    quadDynamic(10,6,7,11,0);//KGHL
    triDynamic(2,6,10,1);//CGK
    quadDynamic(2,10,8,0,0);//CKIA
    quadDynamic(8,10,11,9,1);//IKLJ

    //Bottom
    triDynamic(12,20,16,1);//MUQ
    quadDynamic(16,20,21,17,0);//QUVR
    triDynamic(17,21,13,1);//RVN
    quadDynamic(13,21,23,15,0);//NVXP
    triDynamic(15,23,19,1);//PXT
    quadDynamic(22,18,19,23,0);//WSTX
    triDynamic(14,18,22,1);//OSW
    quadDynamic(14,22,20,12,0);//OWUM
    quadDynamic(20,22,23,21,1);//UWXV

    //Middle
    quadDynamic(12,32,36,16,0);//MM'Q'Q
    quadDynamic(16,36,37,17,1);//QQ'R'R
    quadDynamic(17,37,33,13,0);//RR'N'N
    quadDynamic(13,33,35,15,1);//NN'P'P 
    quadDynamic(15,35,39,19,0);//PP'T'T
    quadDynamic(19,39,38,18,1);//TT'S'S
    quadDynamic(18,38,34,14,0);//SS'O'O
    quadDynamic(14,34,32,12,1);//OO'M'M

    quadDynamic(0,24,28,4,0);//AA'E'E
    quadDynamic(4,28,29,5,1);//EE'F'F
    quadDynamic(5,29,25,1,0);//FF'B'B
    quadDynamic(1,25,27,3,1);//BB'D'D
    quadDynamic(3,27,31,7,0);//DD'H'H
    quadDynamic(7,31,30,6,1);//HH'G'G
    quadDynamic(6,30,26,2,0);//GG'C'C
    quadDynamic(2,26,24,0,1);//CC'A'A

    quadDynamic(24,32,36,28,1);//A'M'Q'E' //
    quadDynamic(29,37,33,25,1);//F'R'N'B' //
    quadDynamic(27,35,39,31,1);//D'P'T'H' //
    quadDynamic(30,38,34,26,1);//G'S'O'C' //

    StreetLampHeadAmount = pointsArray.length - StreetLampHeadIndex;
    StreetLightIndex = pointsArray.length;

    //Middle
    
    
    
    quadDynamic(28,36,37,29,2);//E'Q'R'F'
    
    quadDynamic(25,33,35,27,2);//B'N'P'D'
    
    quadDynamic(31,39,38,30,2);//H'T'S'G'
    
    quadDynamic(26,34,32,24,2);//C'O'M'A'

    StreetLightAmount = pointsArray.length - StreetLightIndex;

    
}

function DrawStreetLamp(){

    let black = vec4(0.3,0.3,0.3,1);
    
    // Draw Base

    // Choose Color
    gl.uniform4fv(diffuseProductLoc,
    flatten(mult(lightDiffuse, black)));
 
    gl.uniform4fv(ambientProductLoc,
    flatten(mult(lightAmbient, black)));

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, StreetLampHeadIndex, StreetLampHeadAmount );

    // RESET COLOR
    gl.uniform4fv(diffuseProductLoc,
        flatten(diffuseProduct) );
 
     gl.uniform4fv(ambientProductLoc,
         flatten(ambientProduct) );
}

function DrawStreetLight(){
    let yellow = vec4(1.0,1.0,0,1);
    
    // Draw Base

    // Choose Color
    gl.uniform4fv(diffuseProductLoc,
    flatten(mult(lightDiffuse, yellow)));
 
    gl.uniform4fv(ambientProductLoc,
    flatten(mult(lightAmbient, yellow)));

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, StreetLightIndex, StreetLightAmount );

    // RESET COLOR
    gl.uniform4fv(diffuseProductLoc,
        flatten(diffuseProduct) );
 
     gl.uniform4fv(ambientProductLoc,
         flatten(ambientProduct) );
}

function MakeBuilding(xLoc,yLoc,zLoc){

    ApartmentIndex = pointsArray.length;

    // Pillars
    cube(1,3,1,xLoc,yLoc,zLoc,3);
    cube(1,3,1,xLoc + 3,yLoc,zLoc,3);
    cube(1,3,1,xLoc + 6,yLoc,zLoc,3);
    cube(1,3,1,xLoc + 9,yLoc,zLoc,3);
    // Top part of building ( 1st floor)
    cube(15,3,6,xLoc - 1,yLoc + 3,zLoc - 4,3);
    // Pillars (2nd floor)
    cube(1,3,1,xLoc,yLoc + 6,zLoc,3);
    cube(1,3,1,xLoc + 3,yLoc + 6,zLoc,3);
    cube(1,3,1,xLoc + 6,yLoc + 6,zLoc,3);
    cube(1,3,1,xLoc + 9,yLoc + 6,zLoc,3);
    // Top part of building (2nd floor)
    cube(15,3,6,xLoc - 1,yLoc + 9,zLoc - 4,3);
    // Hind part of building
    cube(24,12,6,xLoc - 1,yLoc,zLoc - 10,3);

    // Pillars
    cube(1,3,1,xLoc + 30,yLoc,zLoc,3);
    cube(1,3,1,xLoc + 33,yLoc,zLoc,3);
    cube(1,3,1,xLoc + 36,yLoc,zLoc,3);
    cube(1,3,1,xLoc + 39,yLoc,zLoc,3);
    // Top part of building ( 1st floor)
    cube(15,3,6,xLoc + 26,yLoc + 3,zLoc - 4,3);
    // Pillars (2nd floor)
    cube(1,3,1,xLoc + 30,yLoc + 6,zLoc,3);
    cube(1,3,1,xLoc + 33,yLoc + 6,zLoc,3);
    cube(1,3,1,xLoc + 36,yLoc + 6,zLoc,3);
    cube(1,3,1,xLoc + 39,yLoc + 6,zLoc,3);
    // Top part of building (2nd floor)
    cube(15,3,6,xLoc + 26,yLoc + 9,zLoc - 4,3);
    cube(20,4,3,xLoc + 10.23,yLoc+6,zLoc-3.6,3);
    // Hind part of building
    cube(24,12,6,xLoc + 17,yLoc,zLoc - 10,3);

    // Front door section
    cube(6,6,5.9,xLoc + 17,yLoc,zLoc+3,3);

    ApartmentAmount = pointsArray.length - ApartmentIndex;

    ApartmentRailIndex = pointsArray.length;

    // Railing (2nd floor)
    cube(14.5,1,.5,xLoc + 26,yLoc+6,zLoc,5);
    cube(.5,1,5,xLoc + 40,yLoc+6,zLoc-5,5);

    // Railing (2nd floor)
    cube(14.5,1,.5,xLoc - 0.5,yLoc+6,zLoc,5);
    cube(.5,1,5,xLoc - 0.5,yLoc+6,zLoc-5,5);

    ApartmentRailAmount = pointsArray.length - ApartmentRailIndex;

    ApartmentDoorIndex = pointsArray.length;

    // Doors
    cube(1.5,2.5,0.1,xLoc + 7.25,yLoc + 6,zLoc-4,9);
    cube(1.5,2.5,0.1,xLoc + 1.25,yLoc + 6,zLoc-4,9);
    cube(1.5,2.5,0.1,xLoc + 7.25,yLoc,zLoc-4,9);
    cube(1.5,2.5,0.1,xLoc + 1.25,yLoc,zLoc-4,9);
    
    cube(1.5,2.5,0.1,xLoc + 37.25,yLoc + 6,zLoc-4,9);
    cube(1.5,2.5,0.1,xLoc + 31.25,yLoc + 6,zLoc-4,9);
    cube(1.5,2.5,0.1,xLoc + 37.25,yLoc,zLoc-4,9);
    cube(1.5,2.5,0.1,xLoc + 31.25,yLoc,zLoc-4,9);

    cube(20.2,2.5,1.5,xLoc + 10.22,yLoc+6,zLoc-2.7,9);

    // Entrance door
    cube(3,2.5,0.1,xLoc + 18.5,yLoc,zLoc+8.9,9);
    
    

    ApartmentDoorAmount = pointsArray.length - ApartmentDoorIndex;

    ApartmentRoofIndex = pointsArray.length;

    // Roof
    cube(43,1,13,xLoc-1.5,yLoc+12,zLoc-10.5,5);
    cube(7.2,1,5.9,xLoc + 16.5,yLoc+6,zLoc+3.5,5);

    ApartmentRoofAmount = pointsArray.length - ApartmentRoofIndex;

}

function MakeTrashCan(strip_height, strip_width, can_radius) {
    // Remember where our trash can begins
    let trash_can_index = vertices.length;
    let radius = can_radius;
    let precision = 12;

    let x = 0;
    let y = 0;
    let z = 0;

    
    TrashCanStripIndex = pointsArray.length;
    TrashCanStripAmount = pointsArray.length;
    // Draw Trash can strip
    let corners = [
                    vec3(radius, strip_height, strip_width), //upper_corner1
                    vec3(radius, strip_height, -strip_width), //upper_corner2
                    vec3(radius, -strip_height, -strip_width), //lower_corner1
                    vec3(radius, -strip_height, strip_width), //lower_corner2
    ];

    // Make the trash can grow taller upward rather than grow through the floor too
    for (let i = 0; i < 4; i++) {
        corners[i][1] = (corners[i][1] + strip_height) / 2;
    }

    let tau = Math.PI * 2;
    for (let i = 0; i < precision; i++) {
        let angle = tau / precision * i;
        // Remember where our strip begins
        let strip_index = dynamicVertices.length;
        
        let new_corners = []
        // Find rotated strip
        for (let j = 0; j < 4; j++) {
            let longer;
            if (i % (precision/4) ==0) {
                longer = 1.5;
                
            }
            else
            {
                longer = 1.0;
            }

            let cx = corners[j][0];
            let cz = corners[j][2];
            let current_angle = Math.atan2(cz, cx);
            let current_radius = Math.sqrt(cx * cx + cz * cz)
            // Displace the angle to find the new coordinates
            let sin = Math.sin(current_angle + angle);
            let cos = Math.cos(current_angle + angle);
            new_corners.push(vec4(
                cos * current_radius,
                corners[j][1] * longer,
                sin * current_radius,
                1
            ))
        }

        // Displace by x, y, z as center
        for (let j = 0; j < 4; j++) {
            let dx = new_corners[j][0];
            let dy = new_corners[j][1];
            let dz = new_corners[j][2];
            // Record in vertices array
            dynamicVertices.push(vec4(
                dx + x,
                dy + y,
                dz + z,
                1
            ));
        }
        // Create current strip
        quadDynamic(strip_index, strip_index + 1, strip_index + 2, strip_index + 3, 8 + i % 2)
    }

    // Calculate how many new vertices were created
    TrashCanStripAmount = pointsArray.length - TrashCanStripAmount;


    // Create bottom base
    // cylinder(precision, 0.2, radius, x, y, z, 8)

    TrashCanLidIndex = pointsArray.length;
    TrashCanLidAmount = pointsArray.length;

    // Create top lid
    // Represent mesh as a flat grid, then raise each point
    let lid_grid = [];
    // lid[i][j] = index
    let count = 7
    let center = [(count - 1) / 2, (count - 1) / 2]
    let max_dist = Math.sqrt(center[0] * center[0] + center[1] * center[1])
    let fz = (X, Y) => {
        let dx = X - center[0];
        let dy = Y - center[1];
        let dist = Math.sqrt(dx * dx + dy * dy)
        return 1 - dist / max_dist;
    };
    // Remember where our lid begins
    let lid_index = dynamicVertices.length;
    for (let i = 0; i < count; i++) {
        lid_grid[i] = [];
        for (let j = 0; j < count; j++) {
            let scale = radius / count;
            // Mult by scale to make the size of the grid from 1x1
            // Offset by -0.5 * radius to center grid
            // Offset by scale / 2 to perfectly center
            let point = vec4(   (i) * scale - 0.5 * radius + scale / 2, 
                                (j) * scale - 0.5 * radius + scale / 2, 
                                fz(i, j) * scale, 1);
            point = vec4(
                point[0] * 2.75 + x,
                point[2] * 2.75 + y + strip_height * 1.48,
                point[1] * 2.75 + z,
                1
            )
            lid_grid[i][j] = lid_index;
            lid_index++;
            dynamicVertices.push(point);
        }
    }
    
    

    for (let i = 0; i < lid_grid.length - 1; i++) {
        for (let j = 0; j < lid_grid[i].length - 1; j++) {
            quadDynamic(lid_grid[i][j], lid_grid[i + 1][j],
                lid_grid[i + 1][j + 1], lid_grid[i][j + 1],
                // Calculate which color to make checker pattern
                 8 + ( (i % 2) + (j % 2)) % 2
            )
        }
    }

    // Calculate how many new vertices were created
    TrashCanLidAmount = pointsArray.length - TrashCanLidAmount;

}
// Dimensions will be 1x1x1 and will rely on transformations
// These should only be called once
function DynamicCone() {
    var points=[];
    let radius = 1;
    let numSlices=16;
	var angleIncrement = 2*Math.PI/numSlices;

    // Remember where our Cone Begins
    let cone_index = dynamicVertices.length;
    ConeIndex = pointsArray.length;
    ConeAmount = 0;

    // side triangle points
    for (var angle=0; angle < (2*Math.PI); angle += angleIncrement)  {
        // top point
        dynamicVertices.push(vec4(0, radius, 0, 1)); // height of the cone > radius of the bottom circle

        // the other two points
	      var x=radius*Math.cos(angle);
        var y=radius*Math.sin(angle);
        dynamicVertices.push(vec4(x, 0, y, 1));

        x=radius*Math.cos(angle+angleIncrement);
        y=radius*Math.sin(angle+angleIncrement);
        dynamicVertices.push(vec4(x, 0, y, 1));
    }

    for (let i = cone_index; i < dynamicVertices.length - 2; i++) {
        let info = triDynamic(i, i + 1, i + 2, 12 + i % 2);
        ConeAmount += info[1];
    }

    cone_index = dynamicVertices.length;
    // another circle to cover the bottom
    for (var angle=0; angle <=2*Math.PI; angle += angleIncrement)  {
        // center point
        dynamicVertices.push(vec4(0, 0, 0, 1));

        // counter clock wise  --> the inside face is the front face
	    var x=radius*Math.cos(angle);
        var y=radius*Math.sin(angle);
        dynamicVertices.push(vec4(x, 0, y, 1));

	    x=radius*Math.cos(angle+angleIncrement);
        y=radius*Math.sin(angle+angleIncrement);

        dynamicVertices.push(vec4(x, 0, y, 1));
    }

    
    for (let i = cone_index; i < dynamicVertices.length - 2; i++) {
        let info = triDynamic(i, i + 1, i + 2, 12 + i % 2);
        ConeAmount += info[1];
    }
}
function DynamicCylinder(points, colorIndex) {
    let height = 1;
    let radius = 1;
    let locX = 0;
    let locY = 0;
    let locZ = 0;
    // Circle variables
    
	var SIZE = points; // circle slices
	var angle = 2*Math.PI/SIZE;
    var center = vec4(locX,locY,locZ,1.0);
    var topIndices = [];
    var bottomIndices = [];
    var bottomCenterIndex = dynamicVertices.length;

    CylinderIndex = pointsArray.length;
    CylinderAmount = 0;

    dynamicVertices.push(center);
    var index = dynamicVertices.length;

    // bottom circle vertices
	for  (var i=0; i<SIZE+1; i++) {
        var newBottomVertex = vec4(center[0]+radius*Math.cos(i*angle), locY, center[2]+radius*Math.sin(i*angle), 1.0);
	    dynamicVertices.push(newBottomVertex);
        bottomIndices.push(index + i);
	}

    center = vec4(locX, locY + height, locZ, 1.0);
    var topCenterIndex = dynamicVertices.length;

    dynamicVertices.push(center);
    index = dynamicVertices.length;

    // top circle vertices
	for  (var i=0; i<SIZE+1; i++) {
        var newTopVertex = vec4(center[0]+radius*Math.cos(i*angle), locY + height, center[2]+radius*Math.sin(i*angle), 1.0);
	    dynamicVertices.push(newTopVertex);
        topIndices.push(index + i);
	}

    

    // Make bottom circle
    for(var i=0; i<bottomIndices.length - 1; i++){
        let info = triDynamic(bottomCenterIndex, bottomIndices[i], bottomIndices[i + 1], colorIndex + 1);
        let index = info[0];
        let amount_added = info[1];
        CylinderAmount += amount_added;
    }
    // Make top circle
    for(var i=0; i<topIndices.length - 1; i++){
        let info = triDynamic(topCenterIndex, topIndices[i], topIndices[i + 1], colorIndex + 1);
        let amount_added = info[1];
        CylinderAmount += amount_added;
    }
    //Make walls
    for(var i=0; i<topIndices.length - 1;i++){
        if(i % 2 == 0){
            let info = quadDynamic(bottomIndices[i], topIndices[i], topIndices[i+1],bottomIndices[i+1],colorIndex + 1);
            let amount_added = info[1];
            CylinderAmount += amount_added;
        }
        else{
            let info = quadDynamic(bottomIndices[i], topIndices[i], topIndices[i+1],bottomIndices[i+1],colorIndex);
            let amount_added = info[1];
            CylinderAmount += amount_added;
        }
    }
}

function DrawCylinder() {
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, CylinderIndex, CylinderAmount );
}

function DrawCone() {
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, ConeIndex, ConeAmount );
}

function DrawTrashCanLid() {
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, TrashCanLidIndex, TrashCanLidAmount );
}

function DrawTrashCanStrips() {
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, TrashCanStripIndex, TrashCanStripAmount );
}

function DrawTrashCan() {
    let red = rgb(245, 20, 0, 255);
    let black = rgb(0, 0, 0, 255);

    // Choose Color
    gl.uniform4fv(diffuseProductLoc,
        flatten(mult(lightDiffuse, red)));

    gl.uniform4fv(ambientProductLoc,
        flatten(mult(lightAmbient, red)));


    // Draw Lid and Strips
    MatrixStack.push(modelViewMatrix);
    DrawTrashCanLid()
    DrawTrashCanStrips()
    modelViewMatrix = MatrixStack.pop();

    // Draw Base

    // Choose Color
    gl.uniform4fv(diffuseProductLoc,
        flatten(mult(lightDiffuse, black)));

    gl.uniform4fv(ambientProductLoc,
        flatten(mult(lightAmbient, black)));
    MatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, scale4(3, 0.2, 3));
    DrawCylinder();
    modelViewMatrix = MatrixStack.pop();

    
    // RESET COLOR
    gl.uniform4fv(diffuseProductLoc,
        flatten(diffuseProduct) );

    gl.uniform4fv(ambientProductLoc,
        flatten(ambientProduct) );
}

function DrawTrafficCone() {

    let black = vec4(0.3,0.3,0.3,1);
    let white = vec4(1,1,1,1);
    let orange = rgb(245, 120, 0, 255);
    
    // Draw Base

    // Choose Color
    gl.uniform4fv(diffuseProductLoc,
        flatten(mult(lightDiffuse, black)));
 
     gl.uniform4fv(ambientProductLoc,
     flatten(mult(lightAmbient, black)));

    MatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, mult(translate(0,-0.1,0), scale4(2, 0.1, 2)));
    DrawCylinder();
    modelViewMatrix = MatrixStack.pop();

    // Draw Cone

    // Choose Color
    gl.uniform4fv(diffuseProductLoc,
        flatten(mult(lightDiffuse, orange)));
 
     gl.uniform4fv(ambientProductLoc,
     flatten(mult(lightAmbient, orange)));

    MatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, scale4(1, 2, 1));
    DrawCone();
    modelViewMatrix = MatrixStack.pop();

    // Draw Strips

    // Choose Color
    gl.uniform4fv(diffuseProductLoc,
        flatten(mult(lightDiffuse, white)));
    
    gl.uniform4fv(ambientProductLoc,
    flatten(mult(lightAmbient, white)));

    MatrixStack.push(modelViewMatrix);
    let transform = mult(translate(0, 0.85, 0), scale4(0.7, 0.2, 0.7));
    modelViewMatrix = mult(modelViewMatrix, transform);
    DrawCylinder();
    modelViewMatrix = MatrixStack.pop();

    MatrixStack.push(modelViewMatrix);
    transform = mult(translate(0, 1.25, 0), scale4(0.5, 0.2, 0.5));
    modelViewMatrix = mult(modelViewMatrix, transform);
    DrawCylinder();
    modelViewMatrix = MatrixStack.pop();


    // RESET COLOR
    gl.uniform4fv(diffuseProductLoc,
       flatten(diffuseProduct) );

    gl.uniform4fv(ambientProductLoc,
        flatten(ambientProduct) );
}

function DrawFountain() {
    let gray = vec4(0.3, 0.3, 0.3, 1.0)

    // Choose Color
    gl.uniform4fv(diffuseProductLoc,
        flatten(mult(lightDiffuse, gray)));
 
    gl.uniform4fv(ambientProductLoc,
        flatten(mult(lightAmbient, gray)));

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, FountainIndex, FountainAmount );

    // RESET COLOR
    gl.uniform4fv(diffuseProductLoc,
        flatten(diffuseProduct) );
 
     gl.uniform4fv(ambientProductLoc,
         flatten(ambientProduct) );
}

<<<<<<< Updated upstream
function DrawSnowFlake() {
    let white = vec4(1,1,1,1);
    
    // Draw Base

    // Choose Color
    gl.uniform4fv(diffuseProductLoc,
        flatten(mult(lightDiffuse, white)));
 
     gl.uniform4fv(ambientProductLoc,
     flatten(mult(lightAmbient, white)));



    let width = 0.1;
    let height = 1.0;
    MatrixStack.push(modelViewMatrix);
    let transform = scale4(width, 1, width);
    modelViewMatrix = mult(modelViewMatrix, mult(transform, translate(0, -0.5, 0)));
    DrawCylinder();
    modelViewMatrix = MatrixStack.pop();

    MatrixStack.push(modelViewMatrix);
    transform = mult(rotate(45, [1, 0, 0]), scale4(width, height, width));
    modelViewMatrix = mult(modelViewMatrix, mult(transform, translate(0, -0.5, 0)));
    DrawCylinder();
    modelViewMatrix = MatrixStack.pop();

    MatrixStack.push(modelViewMatrix);
    transform = mult(rotate(-45, [1, 0, 0]), scale4(width, height, width));
    modelViewMatrix = mult(modelViewMatrix, mult(transform, translate(0, -0.5, 0)));
    DrawCylinder();
    modelViewMatrix = MatrixStack.pop();

    MatrixStack.push(modelViewMatrix);
    transform = mult(rotate(90, [1, 0, 0]), scale4(width, height, width));
    modelViewMatrix = mult(modelViewMatrix, mult(transform, translate(0, -0.5, 0)));
    DrawCylinder();
    modelViewMatrix = MatrixStack.pop();

    // RESET COLOR
    gl.uniform4fv(diffuseProductLoc,
    flatten(diffuseProduct) );

    gl.uniform4fv(ambientProductLoc,
    flatten(ambientProduct) );
=======
function DrawStreetLampPole() {
    let gray = vec4(0.2, 0.2, 0.2, 1.0)

    // Choose Color
    gl.uniform4fv(diffuseProductLoc,
        flatten(mult(lightDiffuse, gray)));
 
    gl.uniform4fv(ambientProductLoc,
        flatten(mult(lightAmbient, gray)));

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, StreetLampPoleIndex, StreetLampPoleAmount );

    // RESET COLOR
    gl.uniform4fv(diffuseProductLoc,
        flatten(diffuseProduct) );
 
     gl.uniform4fv(ambientProductLoc,
         flatten(ambientProduct) );
}

function DrawBuilding(xLoc, yLoc, zLoc){

    let gray = vec4(0.2, 0.2, 0.2, 1.0)
    let white = vec4(1.0, 1.0, 1.0, 1.0)

    // Choose Color
    gl.uniform4fv(diffuseProductLoc,
        flatten(mult(lightDiffuse, gray)));
 
    gl.uniform4fv(ambientProductLoc,
        flatten(mult(lightAmbient, gray)));

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, ApartmentIndex, ApartmentAmount );

    MatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(xLoc + 20,yLoc,zLoc -5));
    modelViewMatrix = mult(modelViewMatrix, scale4(10, 15, 10));
    DrawCylinder(8,5);//(8,1,10.5,xLoc + 20,yLoc+15,zLoc -5,5);
    modelViewMatrix = MatrixStack.pop();

    gl.uniform4fv(diffuseProductLoc,
        flatten(mult(lightDiffuse, white)));
 
    gl.uniform4fv(ambientProductLoc,
        flatten(mult(lightAmbient, white)));

    MatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(xLoc + 20,yLoc+15,zLoc -5));
    modelViewMatrix = mult(modelViewMatrix, scale4(10.5, 1, 10.5));
    DrawCylinder(8,5);//(8,1,10.5,xLoc + 20,yLoc+15,zLoc -5,5);
    modelViewMatrix = MatrixStack.pop();

    MatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(xLoc + 20,yLoc+6,zLoc -5));
    modelViewMatrix = mult(modelViewMatrix, scale4(10.5, 1, 10.5));
    DrawCylinder(8,5);//(8,1,10.5,xLoc + 20,yLoc+15,zLoc -5,5);
    modelViewMatrix = MatrixStack.pop();

    //DynamicCylinder(8,5);//(8,15,10,xLoc + 20,yLoc,zLoc -5,3);
    //DynamicCylinder(8,5);//(8,1,10.5,xLoc + 20,yLoc+6,zLoc -5,5);

    // RESET COLOR
    gl.uniform4fv(diffuseProductLoc,
        flatten(diffuseProduct) );
 
     gl.uniform4fv(ambientProductLoc,
         flatten(ambientProduct) );
}

function DrawApartmentRails(){

    let gray = vec4(1.0, 1.0, 1.0, 1.0)

    // Choose Color
    gl.uniform4fv(diffuseProductLoc,
        flatten(mult(lightDiffuse, gray)));
 
    gl.uniform4fv(ambientProductLoc,
        flatten(mult(lightAmbient, gray)));

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, ApartmentRailIndex, ApartmentRailAmount );

    // RESET COLOR
    gl.uniform4fv(diffuseProductLoc,
        flatten(diffuseProduct) );
 
     gl.uniform4fv(ambientProductLoc,
         flatten(ambientProduct) );
}
function DrawApartmentRoof(){
    let gray = vec4(1.0, 1.0, 1.0, 1.0)

    // Choose Color
    gl.uniform4fv(diffuseProductLoc,
        flatten(mult(lightDiffuse, gray)));
 
    gl.uniform4fv(ambientProductLoc,
        flatten(mult(lightAmbient, gray)));

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, ApartmentRoofIndex, ApartmentRoofAmount );

    // RESET COLOR
    gl.uniform4fv(diffuseProductLoc,
        flatten(diffuseProduct) );
 
     gl.uniform4fv(ambientProductLoc,
         flatten(ambientProduct) );
}

function DrawApartmentDoors(){
    let gray = vec4(0.8, 0.8, 0.8, 1.0)

    // Choose Color
    gl.uniform4fv(diffuseProductLoc,
        flatten(mult(lightDiffuse, gray)));
 
    gl.uniform4fv(ambientProductLoc,
        flatten(mult(lightAmbient, gray)));

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, ApartmentDoorIndex, ApartmentDoorAmount );

    // RESET COLOR
    gl.uniform4fv(diffuseProductLoc,
        flatten(diffuseProduct) );
 
     gl.uniform4fv(ambientProductLoc,
         flatten(ambientProduct) );
>>>>>>> Stashed changes
}

// Fountain initial 2d line points for surface of revolution  (25 points)
var fountainPoints = [
	[1.0, 0.0, 0.0],
    [1.0, 0.1, 0.0],
    [0.9, 0.1, 0.0],
    [0.9, 0.2, 0.0],
    [0.7, 0.2, 0.0],// <-
    [0.7, 0.3, 0.0],// <-
    [0.9, 0.3, 0.0],
    [0.9, 0.4, 0.0],
    [0.8, 0.4, 0.0],
    [0.8, 0.1, 0.0],
    [0.2, 0.1, 0.0],
    [0.2, 0.9, 0.0],
    [0.3, 0.9, 0.0],
    [0.3, 1.0, 0.0],
    [0.0, 1.0, 0.0],


];

var streetLampPoints = [
    [0.0,1.1,0.0],
    [0.1,1.1,0.0],
    [0.2,1.0,0.0],
    [0.1,-0.3,0.0],
    [0.1,0.9,0.0],
    [0.2,-0.4,0.0],
    [0.3,-0.4,0.0],
    [0.3,-0.5,0.0],
    [0.0,-0.5,0.0]

]

//Sets up the vertices array so the Fountain can be drawn
function SurfaceRevPoints(points)
{
    // Remember where our Surface of Revolution starts
    let index = dynamicVertices.length;
    let point_count = points.length;
	//Setup initial points matrix
	for (var i = 0; i < point_count; i++)
	{
		dynamicVertices.push(vec4(points[i][0], points[i][1],
            points[i][2], 1));
	}

	var r;
    var t=Math.PI/12;

    // sweep the original curve another "angle" degree
    for (var j = 0; j < 24; j++)
    {
        var angle = (j+1)*t;

        // for each sweeping step, generate new points corresponding to the original points
            for(var i = 0; i < point_count ; i++ )
            {
                r = dynamicVertices[index + i][0];
                dynamicVertices.push(vec4(r*Math.cos(angle), dynamicVertices[index + i][1], -r*Math.sin(angle), 1));
            }
    }

    var N = points.length;
    // quad strips are formed slice by slice (not layer by layer)
    for (var i=0; i<24; i++) // slices
    {
        for (var j=0; j < N - 1; j++)  // layers
        {
                quadDynamic(
                    index + i*N+j, 
                    index + (i+1)*N+j, 
                    index + (i+1)*N+(j+1), 
                    index + i*N+(j+1));
        }
    }
}

function MakeFountain() {
    // Remember where our Fountain is
    FountainIndex = pointsArray.length;
    SurfaceRevPoints(fountainPoints);
    // Calculate how many new points were created
    FountainAmount = pointsArray.length - FountainIndex;
}

function MakeStreetLampPole() {
    StreetLampPoleIndex = pointsArray.length;

    SurfaceRevPoints(streetLampPoints);

    StreetLampPoleAmount = pointsArray.length - StreetLampPoleIndex;
}

function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
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

var doAnimate = true;

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
    MakeStreetLampPole();

    MakeBuilding(1.5,-0.8,-0.5);
    MakeTrashCan(4, .5, 3);

    // DYNAMIC CALLS DOWN HERE ONLY

    DynamicCylinder(8, 10);
    DynamicCone();
    MakeFountain();

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    // set up normal buffer
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    // set up texture buffer
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    // create the texture object
    texture = gl.createTexture();

    // create the image object
    texture.image = new Image();

    // register the event handler to be called on loading an image
    texture.image.onload = function() {  loadTexture(texture);}

    // Tell the broswer to load an image
    texture.image.src='marble2.jpg';   // test with different marble textures images

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    // var cBuffer = gl.createBuffer();
    // gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    // gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    // var vColor = gl.getAttribLocation( program, "vColor" );
    // gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    // gl.enableVertexAttribArray( vColor);

    diffuseProductLoc = gl.getUniformLocation(program, "diffuseProduct");
    ambientProductLoc = gl.getUniformLocation(program, "ambientProduct")

    gl.uniform4fv(ambientProductLoc,
       flatten(ambientProduct));
    gl.uniform4fv(diffuseProductLoc,
       flatten(diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
       flatten(specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
       flatten(lightPosition) );
    
    gl.uniform1f(gl.getUniformLocation(program,
    "shininess"),materialShininess);

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

    // Set the position of the eye
    document.getElementById("eyeValue").onclick=function() {
        eyeX=document.parameterForm.xValue.value;
        eyeY=document.parameterForm.yValue.value;
        eyeZ=document.parameterForm.zValue.value;
        // render();
    };

    // These four just set the handlers for the buttons.
    document.getElementById("thetaup").addEventListener("click", function(e) {
        AllInfo.theta += AllInfo.dr;
        // render();
    });
    document.getElementById("thetadown").addEventListener("click", function(e) {
        AllInfo.theta -= AllInfo.dr;
        // render();
    });
    document.getElementById("phiup").addEventListener("click", function(e) {
        AllInfo.phi += AllInfo.dr;
        // render();
    });
    document.getElementById("phidown").addEventListener("click", function(e) {
        AllInfo.phi -= AllInfo.dr;
        // render();
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
        // render();
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
        // render();
    });

    document.addEventListener("mouseup", function(e) {
        AllInfo.mouseDownLeft = false;
        AllInfo.mouseDownRight = false;
        // render();
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
        // render();
    });

    window.addEventListener('keydown', function(event) {
        // Change color choice on "c" click
        if (event.key == 'a' || event.key == 'A') {
            doAnimate = !doAnimate;
            console.log("DOASDKOAD");
        }
    });
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
    render();

    let intervalId = setInterval(Animate, 10);
    // Animate();
}

function loadTexture(texture)
{
     // Flip the image's y axis
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // Enable texture unit 0
    gl.activeTexture(gl.TEXTURE0);

    // bind the texture object to the target
    gl.bindTexture( gl.TEXTURE_2D, texture );

    // set the texture image
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture.image );

    // set the texture parameters
    //gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);

    // set the texture unit 0 the sampler
    // gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
    // This has an error for god knows why. I've put this code somewhere else. CTRL+F to find it
}

let MAX_SNOWFLAKES = 70;

var snowflakes = [

];

var flake_orientations = [

];

function RegulateSnowflakes() {
    for (let i = snowflakes.length - 1; i >= 0; i--) {
        let position = snowflakes[i];
        if (position[1] < 0) {
            snowflakes.splice(i, 1);
            flake_orientations.splice(i, 1);
        }
    }

    while (snowflakes.length < MAX_SNOWFLAKES) {
        let width = 100
        let x = Math.random() * width - width / 2;
        let z = Math.random() * width - width / 2;
        let y = Math.random() * 50 + 40;

        let tau = Math.PI * 2;

        let ax = Math.random() * tau;
        let ay = Math.random() * tau;
        let az = Math.random() * tau;

        snowflakes.push(vec3(x, y, z));
        flake_orientations.push(vec3(ax, ay, az));
    }
}

function Animate() {
    if (!doAnimate) return;
    RegulateSnowflakes();
    for (let i = 0; i < snowflakes.length; i++) {
        let pos = snowflakes[i];
        snowflakes[i] = vec3(
            pos[0],
            pos[1] - 0.2,
            pos[2]
        );
    }
}

var at = vec3(0, 0, 0);
var up = vec3(0, 1, 0);
var eye = vec3(2, 2, 2);

var eyeX=2, eyeY=2, eyeZ=2; // default eye position input values

var render = function() {

    // Animate();

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

    MatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, mult(translate(0,0,15), scale4(2, 2, 2)));
    DrawTrafficCone();
    modelViewMatrix = MatrixStack.pop();

    MatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-8, 0, 5));
    DrawTrashCan();
    modelViewMatrix = MatrixStack.pop();

    MatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(-20, 0, 10));
    modelViewMatrix = mult(modelViewMatrix, scale4(8, 8, 8));
    DrawFountain();
<<<<<<< Updated upstream
    modelViewMatrix = MatrixStack.pop();

    for (let i = 0; i < snowflakes.length; i++) {
        let white = vec4(1,1,1,1);
        // Choose Color
        gl.uniform4fv(diffuseProductLoc,
            flatten(mult(lightDiffuse, white)));
    
        gl.uniform4fv(ambientProductLoc,
        flatten(mult(lightAmbient, white)));

        MatrixStack.push(modelViewMatrix);
        let pos = snowflakes[i];

        let rot = flake_orientations[i];
        let transform = mult(translate(pos[0], pos[1], pos[2]), rotate(90, [rot[0], rot[1], rot[2]]));
        modelViewMatrix = mult(modelViewMatrix, transform);
        DrawSnowFlake();
        modelViewMatrix = MatrixStack.pop();

        // RESET COLOR
        gl.uniform4fv(diffuseProductLoc,
            flatten(diffuseProduct) );
     
         gl.uniform4fv(ambientProductLoc,
             flatten(ambientProduct) );
    }

    requestAnimFrame(render);
=======

    MatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(4, 1.05, 2));
    modelViewMatrix = mult(modelViewMatrix, scale4(.2, .2, .2));
    
    DrawStreetLamp();
    DrawStreetLight();

    modelViewMatrix = mult(modelViewMatrix, translate(0, -4, 0));
    modelViewMatrix = mult(modelViewMatrix, scale4(2, 3, 2));
    DrawStreetLampPole();
    modelViewMatrix = MatrixStack.pop();

    MatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, translate(.5, 0.1, -1.8));
    modelViewMatrix = mult(modelViewMatrix, scale4(0.2, 0.2, 0.2));
    DrawBuilding(1.5,-0.8,-0.5);
    DrawApartmentRails();
    DrawApartmentRoof();
    DrawApartmentDoors();
    modelViewMatrix = MatrixStack.pop();

>>>>>>> Stashed changes
}
