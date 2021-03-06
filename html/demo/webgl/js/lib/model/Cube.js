const Cube = {
    "vertices": [
		-1, -1, -1,
		-1, -1,  1,
		-1,  1, -1,
		-1,  1,  1,
		 1, -1, -1,
		 1, -1,  1,
		 1,  1, -1,
		 1,  1,  1
    ],
    "triangles": [
		0, 1, 5,
		1, 0, 2,
		1, 3, 7,
		2, 0, 4,
		2, 3, 1,
		3, 2, 6,
		4, 5, 7,
		4, 6, 2,
		5, 4, 0,
		6, 7, 3,
		7, 5, 1,
		7, 6, 4 
    ],
	"perFace": 4,
    "faces": [
        0, 1, 5, 4,
        1, 3, 7, 5,
        2, 3, 1, 0,
        4, 5, 7, 6,
        4, 6, 2, 0,
        6, 7, 3, 2 
    ]
};

export default Cube;
