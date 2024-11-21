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

var MatrixStack = [];
var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var ConeIndex, ConeAmount;
var CylinderIndex, CylinderAmount;
var CylinderIndex2, CylinderAmount2; // TODO : Remove and Materials

var dynamicVertices = [];
var vertices = [
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
// Everything made by tri() and quad() are all drawn at once. These dynamic functions will allow us to draw only some shapes (and repeated)
// THESE NEED TO BE USED ONLY AFTER ALL tri() AND quad() CALLS SINCE THIS MODIFIES pointsArray AND colorsArray WITHOUT CHANGING numVertices
// THIS CAN LEAD TO numVertices BEING "OFF"
// It is up to the user of these functions to record the index and number of vertices created
function triDynamic(a, b, c, colorIndex) {
    let index = pointsArray.length;
    pointsArray.push(dynamicVertices[a]);
    colorsArray.push(vertexColors[colorIndex]);
    pointsArray.push(dynamicVertices[b]);
    colorsArray.push(vertexColors[colorIndex]);
    pointsArray.push(dynamicVertices[c]);
    colorsArray.push(vertexColors[colorIndex]);
    console.log(dynamicVertices[a][0])
    return [index, /* Number of points created */ 3]
}
function quadDynamic(a, b, c, d, colorIndex) {
    let index = pointsArray.length;
    pointsArray.push(dynamicVertices[a]);
    colorsArray.push(vertexColors[colorIndex]);
    pointsArray.push(dynamicVertices[b]);
    colorsArray.push(vertexColors[colorIndex]);
    pointsArray.push(dynamicVertices[c]);
    colorsArray.push(vertexColors[colorIndex]);
    pointsArray.push(dynamicVertices[a]);
    colorsArray.push(vertexColors[colorIndex]);
    pointsArray.push(dynamicVertices[c]);
    colorsArray.push(vertexColors[colorIndex]);
    pointsArray.push(dynamicVertices[d]);
    colorsArray.push(vertexColors[colorIndex]);
    return [index, /* Number of points created */ 6]
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

function MakeTrashCan(x, y, z, strip_height, strip_width, can_radius) {
    // Remember where our trash can begins
    let trash_can_index = vertices.length;
    let radius = can_radius;
    let precision = 12;

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
        let strip_index = vertices.length;
        
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
            vertices.push(vec4(
                dx + x,
                dy + y,
                dz + z,
                1
            ));
        }
        // Create current strip
        quad(strip_index, strip_index + 1, strip_index + 2, strip_index + 3, 8 + i % 2)
    }


    // Create bottom base
    cylinder(precision, 0.2, radius, x, y, z, 8)

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
    let lid_index = vertices.length;
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
            vertices.push(point);
        }
    }
    
    

    for (let i = 0; i < lid_grid.length - 1; i++) {
        for (let j = 0; j < lid_grid[i].length - 1; j++) {
            quad(lid_grid[i][j], lid_grid[i + 1][j],
                lid_grid[i + 1][j + 1], lid_grid[i][j + 1],
                // Calculate which color to make checker pattern
                 8 + ( (i % 2) + (j % 2)) % 2
            )
        }
    }

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

// We need to remove this and implement materials so we can change the colors of these objects
function DynamicCylinderGray(points, colorIndex) {
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

    CylinderIndex2 = pointsArray.length;
    CylinderAmount2 = 0;

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
        CylinderAmount2 += amount_added;
    }
    // Make top circle
    for(var i=0; i<topIndices.length - 1; i++){
        let info = triDynamic(topCenterIndex, topIndices[i], topIndices[i + 1], colorIndex + 1);
        let amount_added = info[1];
        CylinderAmount2 += amount_added;
    }
    //Make walls
    for(var i=0; i<topIndices.length - 1;i++){
        let info = quadDynamic(bottomIndices[i], topIndices[i], topIndices[i+1],bottomIndices[i+1],colorIndex + i % 2);
        let amount_added = info[1];
        CylinderAmount2 += amount_added;
    }
}

function DrawCylinder() {
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, CylinderIndex, CylinderAmount );
}

function DrawCylinder2() {
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, CylinderIndex2, CylinderAmount2 );
}

function DrawCone() {
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays( gl.TRIANGLES, ConeIndex, ConeAmount );
}

function DrawTrafficCone() {
    // Draw Base
    MatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, scale4(2, 0.1, 2));
    DrawCylinder2();
    modelViewMatrix = MatrixStack.pop();

    // Draw Cone
    MatrixStack.push(modelViewMatrix);
    modelViewMatrix = mult(modelViewMatrix, scale4(1, 2, 1));
    DrawCone();
    modelViewMatrix = MatrixStack.pop();

    // Draw Strips

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

    // MakeStreetLamp();  // created the color cube - point positions and face colors

    MakeBuilding(1.5,-0.8,-0.5);
    MakeTrashCan(-8, 0, 5, 4, .5, 3);
    // MakeTrashCan(5, 0, 0 , 4, .5, 3);

    // DYNAMIC CALLS DOWN HERE ONLY

    DynamicCylinder(8, 10);
    DynamicCylinderGray(8, 3);
    DynamicCone();

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

    modelViewMatrix = mult(modelViewMatrix, mult(translate(0,0,15), scale4(2, 2, 2)));
    DrawTrafficCone();
}
