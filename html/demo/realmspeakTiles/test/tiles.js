const tiles =
{
	"Awful Valley": {
		"type": "valley",
		"normal": {
			"image": "./images/awfulvalley-normal.gif",
			"offroad": {
				"x": 46.9,
				"y": 81.5
			},
			"clearings": {
				"1": {
					"x": 27.2,
					"y": 35.6
				},
				"2": {
					"x": 26.4,
					"y": 64.3
				},
				"4": {
					"x": 62,
					"y": 59.6
				},
				"5": {
					"x": 49.5,
					"y": 20.9
				}
			},
			"paths": [
				{
					"clearings": [
						2,
						5
					]
				},
				{
					"clearings": [
						1,
						4
					]
				}
			],
			"exits": {
				"NW": 1,
				"SW": 2,
				"NE": 4,
				"SE": 4,
				"N": 5
			}
		},
		"enchanted": {
			"image": "./images/awfulvalley-enchanted.gif",
			"offroad": {
				"x": 48.3,
				"y": 81.5
			},
			"clearings": {
				"1": {
					"x": 28.6,
					"y": 35.8
				},
				"2": {
					"x": 28.4,
					"y": 65.2
				},
				"4": {
					"x": 60.6,
					"y": 57.3
				},
				"5": {
					"x": 50.2,
					"y": 20.2
				}
			},
			"paths": [
				{
					"clearings": [
						2,
						5
					]
				},
				{
					"clearings": [
						1,
						4
					]
				}
			],
			"exits": {
				"NW": 1,
				"SW": 2,
				"NE": 4,
				"SE": 4,
				"N": 5
			}
		}
	},
	"Bad Valley": {
		"type": "valley",
		"normal": {
			"image": "./images/badvalley-normal.gif",
			"offroad": {
				"x": 48.7,
				"y": 80.6
			},
			"clearings": {
				"1": {
					"x": 75,
					"y": 65
				},
				"2": {
					"x": 27.4,
					"y": 64.5
				},
				"4": {
					"x": 37.9,
					"y": 24.2
				},
				"5": {
					"x": 74.1,
					"y": 34.7
				}
			},
			"paths": [
				{
					"clearings": [
						1,
						4
					]
				},
				{
					"clearings": [
						2,
						5
					]
				}
			],
			"exits": {
				"SE": 1,
				"SW": 2,
				"NW": 4,
				"N": 4,
				"NE": 5
			}
		},
		"enchanted": {
			"image": "./images/badvalley-enchanted.gif",
			"offroad": {
				"x": 41.7,
				"y": 83.6
			},
			"clearings": {
				"1": {
					"x": 61.6,
					"y": 73.8
				},
				"2": {
					"x": 27.2,
					"y": 68
				},
				"4": {
					"x": 38.5,
					"y": 27.7
				},
				"5": {
					"x": 73.9,
					"y": 35.6
				}
			},
			"paths": [
				{
					"clearings": [
						2,
						5
					]
				},
				{
					"clearings": [
						1,
						4
					]
				}
			],
			"exits": {
				"SE": 1,
				"SW": 2,
				"NW": 4,
				"N": 4,
				"NE": 5
			}
		}
	},
	"Curst Valley": {
		"type": "valley",
		"normal": {
			"image": "./images/curstvalley-normal.gif",
			"offroad": {
				"x": 50.4,
				"y": 87.1
			},
			"clearings": {
				"1": {
					"x": 50,
					"y": 20
				},
				"2": {
					"x": 27.8,
					"y": 34.7
				},
				"4": {
					"x": 50.4,
					"y": 66.6
				},
				"5": {
					"x": 72.9,
					"y": 35.1
				}
			},
			"paths": [
				{
					"clearings": [
						2,
						5
					]
				},
				{
					"clearings": [
						1,
						4
					]
				}
			],
			"exits": {
				"N": 1,
				"NW": 2,
				"SW": 4,
				"SE": 4,
				"NE": 5
			}
		},
		"enchanted": {
			"image": "./images/curstvalley-enchanted.gif",
			"offroad": {
				"x": 50.6,
				"y": 84.8
			},
			"clearings": {
				"1": {
					"x": 50,
					"y": 20.9
				},
				"2": {
					"x": 28.6,
					"y": 34.9
				},
				"4": {
					"x": 50,
					"y": 65.5
				},
				"5": {
					"x": 73.9,
					"y": 34.2
				}
			},
			"paths": [
				{
					"clearings": [
						2,
						5
					]
				},
				{
					"clearings": [
						1,
						4
					]
				}
			],
			"exits": {
				"N": 1,
				"NW": 2,
				"SW": 4,
				"SE": 4,
				"NE": 5
			}
		}
	},
	"Dark Valley": {
		"type": "valley",
		"normal": {
			"image": "./images/darkvalley-normal.gif",
			"offroad": {
				"x": 49.1,
				"y": 80.8
			},
			"clearings": {
				"1": {
					"x": 73.3,
					"y": 34.7
				},
				"2": {
					"x": 52,
					"y": 20
				},
				"4": {
					"x": 38.3,
					"y": 58.2
				},
				"5": {
					"x": 75.2,
					"y": 67.1
				}
			},
			"paths": [
				{
					"clearings": [
						2,
						5
					]
				},
				{
					"clearings": [
						1,
						4
					]
				}
			],
			"exits": {
				"NE": 1,
				"N": 2,
				"SW": 4,
				"NW": 4,
				"SE": 5
			}
		},
		"enchanted": {
			"image": "./images/darkvalley-enchanted.gif",
			"offroad": {
				"x": 49.1,
				"y": 79.4
			},
			"clearings": {
				"1": {
					"x": 71.9,
					"y": 35.4
				},
				"2": {
					"x": 49.5,
					"y": 18.8
				},
				"4": {
					"x": 38.5,
					"y": 57.3
				},
				"5": {
					"x": 72.7,
					"y": 65.2
				}
			},
			"paths": [
				{
					"clearings": [
						2,
						5
					]
				},
				{
					"clearings": [
						1,
						4
					]
				}
			],
			"exits": {
				"NE": 1,
				"N": 2,
				"SW": 4,
				"NW": 4,
				"SE": 5
			}
		}
	},
	"Evil Valley": {
		"type": "valley",
		"normal": {
			"image": "./images/evilvalley-normal.gif",
			"offroad": {
				"x": 49.7,
				"y": 80.1
			},
			"clearings": {
				"1": {
					"x": 26.6,
					"y": 66.4
				},
				"2": {
					"x": 27.4,
					"y": 35.4
				},
				"4": {
					"x": 64.9,
					"y": 24.2
				},
				"5": {
					"x": 73.9,
					"y": 66.6
				}
			},
			"paths": [
				{
					"clearings": [
						2,
						5
					]
				},
				{
					"clearings": [
						1,
						4
					]
				}
			],
			"exits": {
				"SW": 1,
				"NW": 2,
				"N": 4,
				"NE": 4,
				"SE": 5
			}
		},
		"enchanted": {
			"image": "./images/evilvalley-enchanted.gif",
			"offroad": {
				"x": 57.6,
				"y": 82
			},
			"clearings": {
				"1": {
					"x": 38.1,
					"y": 74.3
				},
				"2": {
					"x": 28.2,
					"y": 36.3
				},
				"4": {
					"x": 61.4,
					"y": 29.6
				},
				"5": {
					"x": 72.3,
					"y": 66.6
				}
			},
			"paths": [
				{
					"clearings": [
						2,
						5
					]
				},
				{
					"clearings": [
						1,
						4
					]
				}
			],
			"exits": {
				"SW": 1,
				"NW": 2,
				"N": 4,
				"NE": 4,
				"SE": 5
			}
		}
	},
	"Linden Woods": {
		"type": "woods",
		"normal": {
			"image": "./images/lindenwoods-normal.gif",
			"offroad": {
				"x": 50.4,
				"y": 85.7
			},
			"clearings": {
				"2": {
					"x": 51.8,
					"y": 65.2
				},
				"4": {
					"x": 27.6,
					"y": 34.9
				},
				"5": {
					"x": 61.4,
					"y": 30
				}
			},
			"paths": [
				{
					"clearings": [
						2,
						4
					]
				}
			],
			"exits": {
				"SW": 2,
				"SE": 2,
				"NW": 4,
				"N": 5,
				"NE": 5
			}
		},
		"enchanted": {
			"image": "./images/lindenwoods-enchanted.gif",
			"offroad": {
				"x": 48.9,
				"y": 86.2
			},
			"clearings": {
				"2": {
					"x": 52.8,
					"y": 64.1
				},
				"4": {
					"x": 27.8,
					"y": 37
				},
				"5": {
					"x": 63.5,
					"y": 28.2
				}
			},
			"paths": [
				{
					"clearings": [
						4,
						5
					]
				}
			],
			"exits": {
				"SW": 2,
				"SE": 2,
				"NW": 4,
				"N": 5,
				"NE": 5
			}
		}
	},
	"Maple Woods": {
		"type": "woods",
		"normal": {
			"image": "./images/maplewoods-normal.gif",
			"offroad": {
				"x": 45.3,
				"y": 78.5
			},
			"clearings": {
				"2": {
					"x": 64.7,
					"y": 28.2
				},
				"4": {
					"x": 74.5,
					"y": 64.3
				},
				"5": {
					"x": 29.8,
					"y": 51.2
				}
			},
			"paths": [
				{
					"clearings": [
						2,
						4
					]
				}
			],
			"exits": {
				"N": 2,
				"NE": 2,
				"SE": 4,
				"SW": 5,
				"NW": 5
			}
		},
		"enchanted": {
			"image": "./images/maplewoods-enchanted.gif",
			"offroad": {
				"x": 47.7,
				"y": 80.1
			},
			"clearings": {
				"2": {
					"x": 65.3,
					"y": 26.5
				},
				"4": {
					"x": 75,
					"y": 65.9
				},
				"5": {
					"x": 25.8,
					"y": 51.2
				}
			},
			"paths": [
				{
					"clearings": [
						4,
						5
					]
				}
			],
			"exits": {
				"N": 2,
				"NE": 2,
				"SE": 4,
				"SW": 5,
				"NW": 5
			}
		}
	},
	"Nut Woods": {
		"type": "woods",
		"normal": {
			"image": "./images/nutwoods-normal.gif",
			"offroad": {
				"x": 24.5,
				"y": 48.4
			},
			"clearings": {
				"2": {
					"x": 37.7,
					"y": 26.1
				},
				"4": {
					"x": 72.3,
					"y": 32.6
				},
				"5": {
					"x": 50.2,
					"y": 66.2
				}
			},
			"paths": [
				{
					"clearings": [
						2,
						4
					]
				}
			],
			"exits": {
				"NW": 2,
				"N": 2,
				"NE": 4,
				"SW": 5,
				"SE": 5
			}
		},
		"enchanted": {
			"image": "./images/nutwoods-enchanted.gif",
			"offroad": {
				"x": 23.5,
				"y": 46.6
			},
			"clearings": {
				"2": {
					"x": 37.9,
					"y": 25.6
				},
				"4": {
					"x": 71.7,
					"y": 34.4
				},
				"5": {
					"x": 49.5,
					"y": 65
				}
			},
			"paths": [
				{
					"clearings": [
						4,
						5
					]
				}
			],
			"exits": {
				"NW": 2,
				"N": 2,
				"NE": 4,
				"SW": 5,
				"SE": 5
			}
		}
	},
	"Oak Woods": {
		"type": "woods",
		"normal": {
			"image": "./images/oakwoods-normal.gif",
			"offroad": {
				"x": 50.8,
				"y": 78.7
			},
			"clearings": {
				"2": {
					"x": 73.3,
					"y": 48.4
				},
				"4": {
					"x": 27,
					"y": 66.4
				},
				"5": {
					"x": 39.5,
					"y": 26.5
				}
			},
			"paths": [
				{
					"clearings": [
						2,
						4
					]
				}
			],
			"exits": {
				"NE": 2,
				"SE": 2,
				"SW": 4,
				"NW": 5,
				"N": 5
			}
		},
		"enchanted": {
			"image": "./images/oakwoods-enchanted.gif",
			"offroad": {
				"x": 49.5,
				"y": 79.2
			},
			"clearings": {
				"2": {
					"x": 69.7,
					"y": 51.2
				},
				"4": {
					"x": 27.8,
					"y": 65.9
				},
				"5": {
					"x": 40.1,
					"y": 28.6
				}
			},
			"paths": [
				{
					"clearings": [
						4,
						5
					]
				}
			],
			"exits": {
				"NE": 2,
				"SE": 2,
				"SW": 4,
				"NW": 5,
				"N": 5
			}
		}
	},
	"Pine Woods": {
		"type": "woods",
		"normal": {
			"image": "./images/pinewoods-normal.gif",
			"offroad": {
				"x": 47.5,
				"y": 72.7
			},
			"clearings": {
				"2": {
					"x": 23.9,
					"y": 46.1
				},
				"4": {
					"x": 47.3,
					"y": 20.2
				},
				"5": {
					"x": 73.5,
					"y": 51
				}
			},
			"paths": [
				{
					"clearings": [
						2,
						4
					]
				}
			],
			"exits": {
				"SW": 2,
				"NW": 2,
				"N": 4,
				"NE": 5,
				"SE": 5
			}
		},
		"enchanted": {
			"image": "./images/pinewoods-enchanted.gif",
			"offroad": {
				"x": 50.6,
				"y": 73.4
			},
			"clearings": {
				"2": {
					"x": 28,
					"y": 50.1
				},
				"4": {
					"x": 50.8,
					"y": 20.9
				},
				"5": {
					"x": 71.3,
					"y": 51
				}
			},
			"paths": [
				{
					"clearings": [
						4,
						5
					]
				}
			],
			"exits": {
				"SW": 2,
				"NW": 2,
				"N": 4,
				"NE": 5,
				"SE": 5
			}
		}
	},
	"Deep Woods": {
		"type": "mountain",
		"normal": {
			"image": "./images/deepwoods-normal.gif",
			"offroad": {
				"x": 58.6,
				"y": 28.9
			},
			"clearings": {
				"1": {
					"x": 33.8,
					"y": 26.8
				},
				"2": {
					"x": 77.6,
					"y": 51.5
				},
				"3": {
					"x": 61.4,
					"y": 81.5
				},
				"4": {
					"x": 18.3,
					"y": 52.2
				},
				"5": {
					"x": 30,
					"y": 76.2
				},
				"6": {
					"x": 48.9,
					"y": 57.5
				}
			},
			"paths": [
				{
					"type": "hidden",
					"clearings": [
						1,
						4
					]
				},
				{
					"clearings": [
						1,
						6
					]
				},
				{
					"clearings": [
						2,
						3
					]
				},
				{
					"clearings": [
						3,
						5
					]
				},
				{
					"type": "hidden",
					"clearings": [
						3,
						6
					]
				},
				{
					"clearings": [
						4,
						5
					]
				},
				{
					"clearings": [
						4,
						6
					]
				}
			],
			"exits": {
				"NW": 1,
				"N": 1,
				"NE": 2,
				"SE": 2,
				"SW": 5
			}
		},
		"enchanted": {
			"image": "./images/deepwoods-enchanted.gif",
			"offroad": {
				"x": 34.4,
				"y": 20.2
			},
			"clearings": {
				"1": {
					"x": 43.9,
					"y": 65.7
				},
				"2": {
					"x": 49.1,
					"y": 40.5
				},
				"3": {
					"x": 64.7,
					"y": 80.8
				},
				"4": {
					"x": 24.3,
					"y": 50.5
				},
				"5": {
					"x": 66.7,
					"y": 57.1
				},
				"6": {
					"x": 66.7,
					"y": 18.8
				}
			},
			"paths": [
				{
					"clearings": [
						1,
						3
					]
				},
				{
					"clearings": [
						1,
						4
					]
				},
				{
					"clearings": [
						2,
						5
					]
				},
				{
					"clearings": [
						2,
						6
					]
				},
				{
					"type": "hidden",
					"clearings": [
						3,
						4
					]
				},
				{
					"clearings": [
						3,
						5
					]
				},
				{
					"type": "hidden",
					"clearings": [
						4,
						6
					]
				},
				{
					"type": "hidden",
					"clearings": [
						3,
						6
					]
				}
			],
			"exits": {
				"SE": 3,
				"SW": 4,
				"NW": 4,
				"N": 6,
				"NE": 6
			}
		}
	},
	"Ledges": {
		"type": "mountain",
		"normal": {
			"image": "./images/ledges-normal.gif",
			"offroad": {
				"x": 19.9,
				"y": 51.7
			},
			"clearings": {
				"1": {
					"x": 55.2,
					"y": 73.1
				},
				"2": {
					"x": 73.7,
					"y": 37
				},
				"3": {
					"x": 76.4,
					"y": 64.5
				},
				"4": {
					"x": 51,
					"y": 50.3
				},
				"5": {
					"x": 31.4,
					"y": 29.3
				},
				"6": {
					"x": 35.4,
					"y": 82.7
				}
			},
			"paths": [
				{
					"type": "hidden",
					"clearings": [
						1,
						3
					]
				},
				{
					"clearings": [
						1,
						4
					]
				},
				{
					"clearings": [
						1,
						6
					]
				},
				{
					"clearings": [
						3,
						6
					]
				},
				{
					"type": "hidden",
					"clearings": [
						4,
						6
					]
				},
				{
					"clearings": [
						2,
						5
					]
				}
			],
			"exits": {
				"NE": 2,
				"SE": 3,
				"N": 4,
				"NW": 5
			}
		},
		"enchanted": {
			"image": "./images/ledges-enchanted.gif",
			"offroad": {
				"x": 19.3,
				"y": 53.3
			},
			"clearings": {
				"1": {
					"x": 56.4,
					"y": 71
				},
				"2": {
					"x": 73.1,
					"y": 30.7
				},
				"3": {
					"x": 79,
					"y": 60.3
				},
				"4": {
					"x": 50.2,
					"y": 48.4
				},
				"5": {
					"x": 28.2,
					"y": 31
				},
				"6": {
					"x": 33,
					"y": 81.8
				}
			},
			"paths": [
				{
					"type": "hidden",
					"clearings": [
						1,
						3
					]
				},
				{
					"clearings": [
						1,
						4
					]
				},
				{
					"clearings": [
						2,
						5
					]
				},
				{
					"clearings": [
						3,
						6
					]
				},
				{
					"type": "hidden",
					"clearings": [
						4,
						6
					]
				}
			],
			"exits": {
				"NE": 2,
				"SE": 3,
				"N": 4,
				"NW": 5
			}
		}
	},
	"Crag": {
		"type": "mountain",
		"normal": {
			"image": "./images/crag-normal.gif",
			"offroad": {
				"x": 82.6,
				"y": 53.8
			},
			"clearings": {
				"1": {
					"x": 46.7,
					"y": 84.8
				},
				"2": {
					"x": 50,
					"y": 18.6
				},
				"3": {
					"x": 34.4,
					"y": 39.8
				},
				"4": {
					"x": 64.7,
					"y": 67.1
				},
				"5": {
					"x": 66.3,
					"y": 39.8
				},
				"6": {
					"x": 32.4,
					"y": 65.2
				}
			},
			"paths": [
				{
					"clearings": [
						1,
						4
					]
				},
				{
					"type": "secret",
					"clearings": [
						1,
						6
					]
				},
				{
					"type": "hidden",
					"clearings": [
						2,
						3
					]
				},
				{
					"clearings": [
						2,
						5
					]
				},
				{
					"clearings": [
						3,
						5
					]
				},
				{
					"clearings": [
						3,
						6
					]
				},
				{
					"clearings": [
						4,
						6
					]
				}
			],
			"exits": {
				"N": 2
			}
		},
		"enchanted": {
			"image": "./images/crag-enchanted.gif",
			"offroad": {
				"x": 75.6,
				"y": 59.9
			},
			"clearings": {
				"1": {
					"x": 42.3,
					"y": 82.9
				},
				"2": {
					"x": 54.4,
					"y": 21.9
				},
				"3": {
					"x": 36.6,
					"y": 35.1
				},
				"4": {
					"x": 57.8,
					"y": 66.2
				},
				"5": {
					"x": 63.7,
					"y": 44.5
				},
				"6": {
					"x": 32.8,
					"y": 63.8
				}
			},
			"paths": [
				{
					"clearings": [
						1,
						4
					]
				},
				{
					"type": "hidden",
					"clearings": [
						2,
						3
					]
				},
				{
					"clearings": [
						2,
						5
					]
				},
				{
					"clearings": [
						3,
						5
					]
				},
				{
					"clearings": [
						3,
						6
					]
				},
				{
					"type": "secret",
					"clearings": [
						4,
						5
					]
				},
				{
					"clearings": [
						4,
						6
					]
				}
			],
			"exits": {
				"N": 2
			}
		}
	},
	"Mountain": {
		"type": "mountain",
		"normal": {
			"image": "./images/mountain-normal.gif",
			"offroad": {
				"x": 51,
				"y": 43.1
			},
			"clearings": {
				"1": {
					"x": 34.6,
					"y": 41.4
				},
				"2": {
					"x": 24.3,
					"y": 68.9
				},
				"3": {
					"x": 49.3,
					"y": 68
				},
				"4": {
					"x": 51.6,
					"y": 17
				},
				"5": {
					"x": 76.8,
					"y": 69.2
				},
				"6": {
					"x": 70.7,
					"y": 38.6
				}
			},
			"paths": [
				{
					"clearings": [
						1,
						3
					]
				},
				{
					"clearings": [
						2,
						4
					]
				},
				{
					"clearings": [
						2,
						5
					]
				},
				{
					"clearings": [
						3,
						6
					]
				},
				{
					"clearings": [
						5,
						6
					]
				},
				{
					"type": "hidden",
					"clearings": [
						4,
						6
					]
				}
			],
			"exits": {
				"SW": 2,
				"N": 4,
				"SE": 5
			}
		},
		"enchanted": {
			"image": "./images/mountain-enchanted.gif",
			"offroad": {
				"x": 52.6,
				"y": 45.4
			},
			"clearings": {
				"1": {
					"x": 38.1,
					"y": 42.6
				},
				"2": {
					"x": 25,
					"y": 65.7
				},
				"3": {
					"x": 53.4,
					"y": 66.8
				},
				"4": {
					"x": 51.2,
					"y": 18.6
				},
				"5": {
					"x": 76.2,
					"y": 68.2
				},
				"6": {
					"x": 68.5,
					"y": 42.4
				}
			},
			"paths": [
				{
					"clearings": [
						1,
						3
					]
				},
				{
					"type": "secret",
					"clearings": [
						1,
						4
					]
				},
				{
					"clearings": [
						2,
						4
					]
				},
				{
					"clearings": [
						2,
						5
					]
				},
				{
					"type": "hidden",
					"clearings": [
						3,
						6
					]
				},
				{
					"clearings": [
						4,
						6
					]
				},
				{
					"type": "hidden",
					"clearings": [
						5,
						6
					]
				}
			],
			"exits": {
				"SW": 2,
				"N": 4,
				"SE": 5
			}
		}
	},
	"Cliff": {
		"type": "mountain",
		"normal": {
			"image": "./images/cliff-normal.gif",
			"offroad": {
				"x": 48.9,
				"y": 82.2
			},
			"clearings": {
				"1": {
					"x": 27,
					"y": 35.4
				},
				"2": {
					"x": 27.4,
					"y": 66.4
				},
				"3": {
					"x": 49.5,
					"y": 50.5
				},
				"4": {
					"x": 74.1,
					"y": 33.7
				},
				"5": {
					"x": 73.9,
					"y": 67.3
				},
				"6": {
					"x": 50.8,
					"y": 19.5
				}
			},
			"paths": [
				{
					"clearings": [
						1,
						6
					]
				},
				{
					"clearings": [
						2,
						3
					]
				},
				{
					"type": "hidden",
					"clearings": [
						2,
						5
					]
				},
				{
					"clearings": [
						3,
						5
					]
				},
				{
					"type": "secret",
					"clearings": [
						3,
						6
					]
				},
				{
					"clearings": [
						4,
						6
					]
				}
			],
			"exits": {
				"NW": 1,
				"SW": 2,
				"NE": 4,
				"SE": 5
			}
		},
		"enchanted": {
			"image": "./images/cliff-enchanted.gif",
			"offroad": {
				"x": 50.2,
				"y": 75
			},
			"clearings": {
				"1": {
					"x": 26.4,
					"y": 35.6
				},
				"2": {
					"x": 25.8,
					"y": 66.6
				},
				"3": {
					"x": 49.3,
					"y": 50.5
				},
				"4": {
					"x": 73.1,
					"y": 36.1
				},
				"5": {
					"x": 72.7,
					"y": 67.1
				},
				"6": {
					"x": 50.2,
					"y": 20.5
				}
			},
			"paths": [
				{
					"clearings": [
						1,
						6
					]
				},
				{
					"clearings": [
						2,
						3
					]
				},
				{
					"type": "hidden",
					"clearings": [
						2,
						5
					]
				},
				{
					"clearings": [
						3,
						5
					]
				},
				{
					"type": "secret",
					"clearings": [
						3,
						6
					]
				},
				{
					"clearings": [
						4,
						6
					]
				}
			],
			"exits": {
				"NW": 1,
				"SW": 2,
				"NE": 4,
				"SE": 5
			}
		}
	},
	"Borderland": {
		"type": "cave",
		"normal": {
			"image": "./images/borderland-normal.gif",
			"offroad": {
				"x": 62,
				"y": 75.9
			},
			"clearings": {
				"1": {
					"x": 34.4,
					"y": 18.8
				},
				"2": {
					"x": 77.6,
					"y": 48.4
				},
				"3": {
					"x": 63.9,
					"y": 21.4
				},
				"4": {
					"x": 33.2,
					"y": 84.6
				},
				"5": {
					"x": 37.5,
					"y": 62.7
				},
				"6": {
					"x": 46.1,
					"y": 40.3
				}
			},
			"paths": [
				{
					"clearings": [
						1,
						6
					]
				},
				{
					"clearings": [
						2,
						3
					]
				},
				{
					"clearings": [
						3,
						6
					]
				},
				{
					"type": "secret",
					"clearings": [
						4,
						5
					]
				},
				{
					"type": "caves",
					"clearings": [
						4,
						6
					]
				},
				{
					"clearings": [
						3,
						5
					]
				}
			],
			"exits": {
				"N": 1,
				"NE": 2,
				"SE": 4,
				"S": 2,
				"NW": 5,
				"SW": 1
			}
		},
		"enchanted": {
			"image": "./images/borderland-enchanted.gif",
			"offroad": {
				"x": 61.4,
				"y": 17.7
			},
			"clearings": {
				"1": {
					"x": 40.7,
					"y": 15.1
				},
				"2": {
					"x": 85.4,
					"y": 50.1
				},
				"3": {
					"x": 64.9,
					"y": 45.4
				},
				"4": {
					"x": 47.9,
					"y": 74.1
				},
				"5": {
					"x": 29.8,
					"y": 60.3
				},
				"6": {
					"x": 40.9,
					"y": 42.4
				}
			},
			"paths": [
				{
					"clearings": [
						1,
						6
					]
				},
				{
					"clearings": [
						2,
						3
					]
				},
				{
					"clearings": [
						3,
						6
					]
				},
				{
					"type": "secret",
					"clearings": [
						4,
						5
					]
				},
				{
					"type": "caves",
					"clearings": [
						4,
						6
					]
				},
				{
					"clearings": [
						3,
						5
					]
				}
			],
			"exits": {
				"NW": 5,
				"SW": 1,
				"N": 1,
				"NE": 2,
				"SE": 4,
				"S": 2
			}
		}
	},
	"High Pass": {
		"type": "cave",
		"normal": {
			"image": "./images/highpass-normal.gif",
			"offroad": {
				"x": 24.5,
				"y": 62.4
			},
			"clearings": {
				"1": {
					"x": 68.9,
					"y": 58.9
				},
				"2": {
					"x": 49.5,
					"y": 19.8
				},
				"3": {
					"x": 72.7,
					"y": 34.4
				},
				"4": {
					"x": 43.5,
					"y": 55.4
				},
				"5": {
					"x": 50,
					"y": 82
				},
				"6": {
					"x": 26.2,
					"y": 33.5
				}
			},
			"paths": [
				{
					"clearings": [
						1,
						4
					]
				},
				{
					"clearings": [
						1,
						5
					]
				},
				{
					"type": "caves",
					"clearings": [
						3,
						6
					]
				},
				{
					"clearings": [
						2,
						4
					]
				}
			],
			"exits": {
				"N": 2,
				"NE": 3,
				"S": 5,
				"NW": 6
			}
		},
		"enchanted": {
			"image": "./images/highpass-enchanted.gif",
			"offroad": {
				"x": 27.8,
				"y": 76.6
			},
			"clearings": {
				"1": {
					"x": 67.7,
					"y": 62
				},
				"2": {
					"x": 51.8,
					"y": 17.7
				},
				"3": {
					"x": 73.1,
					"y": 34.9
				},
				"4": {
					"x": 40.3,
					"y": 58.9
				},
				"5": {
					"x": 51.2,
					"y": 82.7
				},
				"6": {
					"x": 27.6,
					"y": 34
				}
			},
			"paths": [
				{
					"clearings": [
						1,
						4
					]
				},
				{
					"clearings": [
						1,
						5
					]
				},
				{
					"type": "caves",
					"clearings": [
						3,
						6
					]
				},
				{
					"clearings": [
						2,
						4
					]
				}
			],
			"exits": {
				"N": 2,
				"NE": 3,
				"S": 5,
				"NW": 6
			}
		}
	},
	"Ruins": {
		"type": "cave",
		"normal": {
			"image": "./images/ruins-normal.gif",
			"offroad": {
				"x": 19.9,
				"y": 52.9
			},
			"clearings": {
				"1": {
					"x": 31.2,
					"y": 34.7
				},
				"2": {
					"x": 64.5,
					"y": 19.5
				},
				"3": {
					"x": 75,
					"y": 66.4
				},
				"4": {
					"x": 46.9,
					"y": 60.6
				},
				"5": {
					"x": 29.6,
					"y": 77.3
				},
				"6": {
					"x": 66.3,
					"y": 41.7
				}
			},
			"paths": [
				{
					"clearings": [
						1,
						2
					]
				},
				{
					"clearings": [
						1,
						4
					]
				},
				{
					"type": "hidden",
					"clearings": [
						1,
						5
					]
				},
				{
					"clearings": [
						3,
						5
					]
				},
				{
					"clearings": [
						3,
						6
					]
				},
				{
					"clearings": [
						4,
						6
					]
				}
			],
			"exits": {
				"NW": 1,
				"N": 2,
				"NE": 2,
				"SE": 3,
				"SW": 5
			}
		},
		"enchanted": {
			"image": "./images/ruins-enchanted.gif",
			"offroad": {
				"x": 35.4,
				"y": 13.9
			},
			"clearings": {
				"1": {
					"x": 28,
					"y": 34.9
				},
				"2": {
					"x": 63.9,
					"y": 20.7
				},
				"3": {
					"x": 72.9,
					"y": 77.6
				},
				"4": {
					"x": 45.9,
					"y": 53.6
				},
				"5": {
					"x": 31.6,
					"y": 72
				},
				"6": {
					"x": 68.1,
					"y": 46.8
				}
			},
			"paths": [
				{
					"type": "hidden",
					"clearings": [
						1,
						2
					]
				},
				{
					"type": "hidden",
					"clearings": [
						1,
						4
					]
				},
				{
					"clearings": [
						1,
						5
					]
				},
				{
					"type": "hidden",
					"clearings": [
						2,
						6
					]
				},
				{
					"clearings": [
						3,
						5
					]
				},
				{
					"type": "secret",
					"clearings": [
						3,
						6
					]
				},
				{
					"clearings": [
						4,
						6
					]
				}
			],
			"exits": {
				"NW": 1,
				"N": 2,
				"SE": 3,
				"SW": 5,
				"NE": 6
			}
		}
	},
	"Caves": {
		"type": "cave",
		"normal": {
			"image": "./images/caves-normal.gif",
			"offroad": {
				"x": 43.7,
				"y": 17.9
			},
			"clearings": {
				"1": {
					"x": 75,
					"y": 68.5
				},
				"2": {
					"x": 26.6,
					"y": 65.7
				},
				"3": {
					"x": 46.3,
					"y": 51.7
				},
				"4": {
					"x": 55.4,
					"y": 82.7
				},
				"5": {
					"x": 27.4,
					"y": 35.4
				},
				"6": {
					"x": 63.9,
					"y": 20.2
				}
			},
			"paths": [
				{
					"type": "caves",
					"clearings": [
						1,
						6
					]
				},
				{
					"type": "secret",
					"clearings": [
						2,
						3
					]
				},
				{
					"type": "caves",
					"clearings": [
						2,
						4
					]
				},
				{
					"type": "caves",
					"clearings": [
						3,
						5
					]
				},
				{
					"type": "caves",
					"clearings": [
						4,
						6
					]
				}
			],
			"exits": {
				"SE": 1,
				"SW": 2,
				"NW": 5
			}
		},
		"enchanted": {
			"image": "./images/caves-enchanted.gif",
			"offroad": {
				"x": 42.5,
				"y": 13.2
			},
			"clearings": {
				"1": {
					"x": 71.7,
					"y": 64.3
				},
				"2": {
					"x": 25.6,
					"y": 64.8
				},
				"3": {
					"x": 52.8,
					"y": 42.6
				},
				"4": {
					"x": 50.2,
					"y": 76.2
				},
				"5": {
					"x": 25.2,
					"y": 33.5
				},
				"6": {
					"x": 66.3,
					"y": 17.2
				}
			},
			"paths": [
				{
					"type": "caves",
					"clearings": [
						1,
						4
					]
				},
				{
					"type": "secret",
					"clearings": [
						1,
						6
					]
				},
				{
					"type": "caves",
					"clearings": [
						2,
						3
					]
				},
				{
					"type": "caves",
					"clearings": [
						3,
						4
					]
				},
				{
					"type": "caves",
					"clearings": [
						5,
						6
					]
				}
			],
			"exits": {
				"SE": 1,
				"SW": 2,
				"NW": 5
			}
		}
	},
	"Cavern": {
		"type": "cave",
		"normal": {
			"image": "./images/cavern-normal.gif",
			"offroad": {
				"x": 22.9,
				"y": 68.9
			},
			"clearings": {
				"1": {
					"x": 75.2,
					"y": 33.5
				},
				"2": {
					"x": 51,
					"y": 16
				},
				"3": {
					"x": 50.4,
					"y": 42.6
				},
				"4": {
					"x": 51.8,
					"y": 83.6
				},
				"5": {
					"x": 27.4,
					"y": 34.7
				},
				"6": {
					"x": 60.6,
					"y": 63.6
				}
			},
			"paths": [
				{
					"type": "caves",
					"clearings": [
						1,
						3
					]
				},
				{
					"type": "secret",
					"clearings": [
						1,
						4
					]
				},
				{
					"type": "caves",
					"clearings": [
						2,
						3
					]
				},
				{
					"type": "secret",
					"clearings": [
						3,
						5
					]
				},
				{
					"type": "caves",
					"clearings": [
						3,
						6
					]
				},
				{
					"type": "caves",
					"clearings": [
						4,
						5
					]
				},
				{
					"type": "caves",
					"clearings": [
						4,
						6
					]
				}
			],
			"exits": {
				"NE": 1,
				"N": 2,
				"NW": 5
			}
		},
		"enchanted": {
			"image": "./images/cavern-enchanted.gif",
			"offroad": {
				"x": 22.7,
				"y": 70.6
			},
			"clearings": {
				"1": {
					"x": 73.5,
					"y": 33.1
				},
				"2": {
					"x": 50.2,
					"y": 19.8
				},
				"3": {
					"x": 47.1,
					"y": 48
				},
				"4": {
					"x": 50.4,
					"y": 82
				},
				"5": {
					"x": 26.6,
					"y": 34.4
				},
				"6": {
					"x": 65.9,
					"y": 64.3
				}
			},
			"paths": [
				{
					"type": "secret",
					"clearings": [
						1,
						2
					]
				},
				{
					"type": "caves",
					"clearings": [
						1,
						4
					]
				},
				{
					"type": "caves",
					"clearings": [
						2,
						6
					]
				},
				{
					"type": "caves",
					"clearings": [
						3,
						5
					]
				},
				{
					"type": "caves",
					"clearings": [
						3,
						6
					]
				},
				{
					"type": "secret",
					"clearings": [
						4,
						5
					]
				},
				{
					"type": "caves",
					"clearings": [
						4,
						6
					]
				}
			],
			"exits": {
				"NE": 1,
				"N": 2,
				"NW": 5
			}
		}
	}
}

