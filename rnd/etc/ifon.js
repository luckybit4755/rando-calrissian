#!/usr/bin/env node 

/**
 *
 *
 * Generate a 3x5 alphanumeric font with a few punctuation characters
 *
 * const int CHARACTERS[] = int[26](748125039,1942975463,2043632585,1918007791,2077195247,2075098093,1802402087,2045016551,1542289775,309294231,1227316141,2070765549,2078571375,2065988561,1955756495,1532124015,1521310717,1923570322,634519554,178782656,88085156,612503096,690123394,2032607818,188772943,1513034368);
 *
 * see https://www.shadertoy.com/view/3X2GD1
 *
 * Also 5x6
 *
 * const int CHARACTERS[] = int[60](488166958,432148639,487701279,487786030,73759815,1057949230,261047854,1041317000,488064558,488160324,145292849,1025459774,488129070,1025033790,1057964575,1057964560,488132142,589284913,1044517023,505645644,594303537,554189343,599643697,597481075,488162862,1025047056,488166989,1025047121,487983662,1044516996,588826158,588589188,588830378,581052977,588583044,1041441311,198,139432064,31744,18157905,35787024,4539392,32506848,149360644,487657476,142876932,136382532,478421262,471926862,10813440,4333568,10813998,31,6212,545394753,490397199,589435185,368409920,145118798,138547332);
 *
 * see https://www.shadertoy.com/view/wXBGWw
 *
 */
class Ifon {
	constructor() {
		this.v = [0];
	}

	main() {
		return this.dig56();
		return this.dig35();
	}

	dig35() {
		this.dig(`###
				  #_#
				  #_#
				  #_#
				  ###`)

		this.dig(`_#_
				  ##_
				  _#_
				  _#_
				  ###`)

		this.dig(`###
				  __#
				  ###
				  #__
				  ###`)

		this.dig(`###
				  __#
				  ###
				  __#
				  ###`)

		this.dig(`#_#
				  #_#
				  ###
				  __#
				  __#`)

		this.dig(`###
				  #__
				  ###
				  __#
				  ###`)

		this.dig(`###
				  #__
				  ###
				  #_#
				  ###`)

		this.dig(`###
				  __#
				  __#
				  _#_
				  _#_`)

		this.dig(`###
				  #_#
				  ###
				  #_#
				  ###`)

		this.dig(`###
				  #_#
				  ###
				  __#
				  ###`)

		this.dig(`###
				  #_#
				  ###
				  #_#
				  #_#`)

		this.dig(`###
				  #_#
				  ##_
				  #_#
				  ###`)

		this.dig(`###
				  #__
				  #__
				  #__
				  ###`)

		this.dig(`##_
				  #_#
				  #_#
				  #_#
				  ##_`)

		this.dig(`###
				  #__
				  ###
				  #__
				  ###`)

		this.dig(`###
				  #__
				  ###
				  #__
				  #__`)

		this.dig(`###
				  #__
				  #_#
				  #_#
				  ###`)

		this.dig(`#_#
				  #_#
				  ###
				  #_#
				  #_#`)

		this.dig(`###
				  _#_
				  _#_
				  _#_
				  ###`)

		this.dig(`__#
				  __#
				  __#
				  #_#
				  ###`)

		this.dig(`#_#
				  #_#
				  ##_
				  #_#
				  #_#`)

		this.dig(`#__
				  #__
				  #__
				  #__
				  ###`)

		this.dig(`#_#
				  ###
				  ###
				  #_#
				  #_#`)

		this.dig(`###
				  #_#
				  #_#
				  #_#
				  #_#`)

		this.dig(`###
				  #_#
				  #_#
				  #_#
				  ###`)

		this.dig(`###
				  #_#
				  ###
				  #__
				  #__`)

		this.dig(`###
				  #_#
				  ###
				  _#_
				  __#`)

		this.dig(`###
				  #_#
				  #__
				  #__
				  #__`)

		this.dig(`###
				  #__
				  ###
				  __#
				  ###`)

		this.dig(`###
				  _#_
				  _#_
				  _#_
				  _#_`)

		this.dig(`#_#
				  #_#
				  #_#
				  #_#
				  ###`)

		this.dig(`#_#
				  #_#
				  #_#
				  _#_
				  _#_`)

		this.dig(`#_#
				  #_#
				  ###
				  ###
				  #_#`)

		this.dig(`#_#
				  #_#
				  _#_
				  #_#
				  #_#`)

		this.dig(`#_#
				  #_#
				  _#_
				  _#_
				  _#_`)

		this.dig(`###
				  __#
				  _#_
				  #__
				  ###`)

		this.dig(`___
				  ___
				  ___
				  ___
				  _#_`)

		this.dig(`___
				  _#_
				  ###
				  _#_
				  ___`)

		this.dig(`___
				  ___
				  ###
				  ___
				  ___`)

		this.dig(`___
				  #_#
				  _#_
				  #_#
				  ___`)

		this.dig(`__#
				  __#
				  _#_
				  #__
				  #__`)

		this.dig(`___
				  _#_
				  #_#
				  ___
				  ___`)

		this.dig(`___
				  ###
				  ___
				  ###
				  ___`)

		this.dig(`_#_
				  _#_
				  _#_
				  ___
				  _#_`)

		this.dig(`###
				  ._#
				  _#.
				  ___
				  _#_`)

		this.dig(`_#_
				  #__
				  #__
				  #__
				  _#_`)

		this.dig(`_#_
				  __#
				  __#
				  __#
				  _#_`)

		this.dig(`###
				  #__
				  #__
				  #__
				  ###`)

		this.dig(`###
				  __#
				  __#
				  __#
				  ###`)

		this.dig(`___
				  #_#
				  #_#
				  ___
				  ___`)

		this.dig(`__#
				  __#
				  _#_
				  ___
				  ___`)

		this.dig(`#_#
				  #_#
				  ___
				  #_#
				  ###`)

		this.dig(`#_#
				  #_#
				  ___
				  ###
				  #_#`)

		this.dig(`...
				  .#.
				  ...
				  .#.
				  ...`)
/*

		this.dig(`###
				  ###
				  ###
				  ###
				  ###`)
*/

		this.spew()
	}

	dig56() {

		this.v.push(this.it(`.###.
				             #...#
				             #...#
				             #.#.#
				             #...#
				             .###.`).i)

		this.v.push(this.it(`.##..
				             ###..
				             ..#..
				             ..#..
				             ..#..
				             #####`).i)

		this.v.push(this.it(`.###.
				             #...#
				             ...##
				             .###.
				             ##...
				             #####`).i)

		this.v.push(this.it(`.###.
				             #...#
				             ..##.
				             ....#
				             #...#
				             .###.`).i)

		this.v.push(this.it(`...#.
				             ..##.
				             .#.#.
				             #####
				             ...#.
				             ..###`).i)

		this.v.push(this.it(`#####
				             #....
				             ####.
				             ....#
				             #...#
				             .###.`).i)

		this.v.push(this.it(`.####
				             #... 
				             ####.
				             #...#
				             #...#
				             .###.`).i)

		this.v.push(this.it(`#####
				             ....#
				             ...#.
				             .####
				             ..#..
				             .#...`).i)

		this.v.push(this.it(`.###.
				             #...#
				             .###.
				             #...#
				             #...#
				             .###.`).i)

		this.v.push(this.it(`.###.
				             #...#
				             #...#
				             .####
				             ...#.
				             ..#..`).i)

		this.v.push(this.it(`..#..
				             .#.#.
				             #...#
				             #####
				             #...#
				             #...#`).i)

		this.v.push(this.it(`####.
				             #...#
				             ####.
				             #...#
				             #...#
				             ####.`).i)

		this.v.push(this.it(`.###.
				             #...#
				             #....
				             #....
				             #...#
				             .###.`).i)

		this.v.push(this.it(`####.
				             #...#
				             #...#
				             #...#
				             #...#
				             ####.`).i)

		this.v.push(this.it(`#####
				             #....
				             ####.
				             #....
				             #.... 
				             #####`).i)

		this.v.push(this.it(`#####
				             #....
				             ####.
				             #....
				             #.... 
				             #....`).i)

		this.v.push(this.it(`.###.
				             #...#
				             #....
				             #..##
				             #...#
				             .###.`).i)

		this.v.push(this.it(`#...#
				             #...#
				             #####
				             #...#
				             #...# 
				             #...#`).i)

		this.v.push(this.it(`#####
				             ..#..
				             ..#..
				             ..#..
				             ..#..
				             #####`).i)

		this.v.push(this.it(`.####
				             ...#.
				             ..###
				             ...#.
				             #..#.
				             .##..`).i)

		this.v.push(this.it(`#...#
				             #.##.
				             ##...
				             #.##.
				             #...# 
				             #...#`).i)

		this.v.push(this.it(`#....
				             #....
				             #....
				             #....
				             #....
				             #####`).i)

		this.v.push(this.it(`#...#
				             ##.##
				             ##.##
				             #.#.#
				             #...#
				             #...#`).i)

		this.v.push(this.it(`#...#
				             ##..#
				             ##..#
				             #.#.#
				             #..##
				             #..##`).i)

		this.v.push(this.it(`.###.
				             #...#
				             #...#
				             #...#
				             #...#
				             .###.`).i)

		this.v.push(this.it(`####.
				             #...#
				             #...#
				             ####.
				             #....
				             #....`).i)

		this.v.push(this.it(`.###.
				             #...#
				             #...#
				             #.#.#
				             #..#.
				             .##.#`).i)

		this.v.push(this.it(`####.
				             #...#
				             #...#
				             ####.
				             #..#.
				             #...#`).i)

		this.v.push(this.it(`.###.
				             #...#
				             .##..
				             ...#.
				             #...#
				             .###.`).i)

		this.v.push(this.it(`#####
				             ..#..
				             ..#..
				             ..#..
				             ..#..
				             ..#..`).i)

		this.v.push(this.it(`#...#
				             #...#
				             #...#
				             #...#
				             #...#
				             .###.`).i)

		this.v.push(this.it(`#...#
				             #...#
				             .#.#.
				             .#.#.
				             ..#..
				             ..#..`).i)

		this.v.push(this.it(`#...#
				             #...#
				             #...#
				             #.#.#
				             #.#.#
				             .#.#.`).i)

		this.v.push(this.it(`#...#
				             .#.#.
				             ..#..
				             .#.#.
				             #...#
				             #...#`).i)


		this.v.push(this.it(`#...#
				             #...#
				             .#.#.
				             ..#..
				             ..#..
				             ..#..`).i)

		this.v.push(this.it(`#####
				             ....#
				             ..##.
				             .#...
				             #....
				             #####`).i)

		this.v.push(this.it(`.....
				             .....
				             .....
				             .. ..
				             ..##.
				             ..##.`).i)

		this.v.push(this.it(`..#..
				             ..#..
				             #####
				             ..#..
				             ..#..
				             .....`).i)

		this.v.push(this.it(`.....
				             .....
				             .....
				             #####
				             .....
				             .....`).i)

		this.v.push(this.it(`.....
				             #...#
				             .#.#.
				             ..#..
				             .#.#.
				             #...#`).i)

		this.v.push(this.it(`....#
				             ...#.
				             ..#..
				             ..#..
				             .#...
				             #....`).i)

		this.v.push(this.it(`.....
				             ..#..
				             .#.#.
				             #...#
				             .....
				             .....`).i)

		this.v.push(this.it(`.....
				             #####
				             .....
				             .....
				             #####
				             .....`).i)

		this.v.push(this.it(`..#..
				             .###.
				             .###.
				             ..#..
				             .....
				             ..#..`).i)

		this.v.push(this.it(`.###.
				             #...#
				             ...#.
				             ..#..
				             .....
				             ..#..`).i)

		this.v.push(this.it(`..#..
				             .#...
				             .#...
				             .#...
				             .#...
				             ..#..`).i)

		this.v.push(this.it(`..#..
				             ...#.
				             ...#.
				             ...#.
				             ...#.
				             ..#..`).i)

		this.v.push(this.it(`.###.
				             .#...
				             .#...
				             .#...
				             .#...
				             .###.`).i)

		this.v.push(this.it(`.###.
				             ...#.
				             ...#.
				             ...#.
				             ...#.
				             .###.`).i)

		this.v.push(this.it(`.....
				             .#.#.
				             .#.#.
				             .....
				             .....
				             .....`).i)

		this.v.push(this.it(`.....
				             ..#..
				             ..#..
				             .#...
				             .....
				             .....`).i)

		this.v.push(this.it(`.....
				             .#.#.
				             .#.#.
				             .....
				             #...#
				             .###.`).i)


		this.v.push(this.it(`.....
				             .....
				             .....
				             .....
				             .....
				             #####`).i)

		this.v.push(this.it(`.....
				             .....
				             .....
				             ..##.
				             ...#.
				             ..#..`).i)

		this.v.push(this.it(`#....
				             .#...
				             ..#..
				             ..#..
				             ...#.
				             ....#`).i)


		this.v.push(this.it(`.###.
				             #..##
				             #.#.#
				             #.###
				             #....
				             .####`).i)

		this.v.push(this.it(`#...#
				             #..#.
				             ..#..
				             ..#..
				             .#..#
				             #...#`).i)

		this.v.push(this.it(`.#.#.
				             #####
				             .#.#.
				             #####
				             .#.#.
				             .....`).i)

		this.v.push(this.it(`..#..
				             .#.#.
				             .##..
				             #.#.#
				             #..#.
				             .###.`).i)

		this.v.push(this.it(`..#..
				             ..#..
				             ..#..
				             ..#..
				             ..#..
				             ..#..`).i)


/*

		this.v.push(this.it(`..#..
				             .####
				             #.#..
				             ..#.#
				             ####.
				             ..#..`).i)

		this.v.push(this.it(`#####
				             #####
				             #####
				             #####
				             #####
				             #####`).i)
*/
		this.spew();
	}

	dig(s) {
		const {b, i} = this.it(s)
		const e = this.v.length - 1;
		const l = this.v[e]

		const n = l ? (((i & 0xFFFF) << 16) >>> 0) | (l & 0xFFFF) : i
		this.v[e] = n;
		if (l) this.v.push(0);

		//console.log(i.toString().padStart(6), b, b.length, 'at', e, 'is', l, 'so', n, 'vs', (l<<16)|i);

		return i;
	}

	it(s) {
		const b = '0' + s
			.replace(/\s/g,'')
			.replace(/[^#]/g,'0')
			.replace(/#/g,'1');
		const i = parseInt(b, 2);
		return {b, i};
	}

	spew() {
		const w = this.v.filter(i=>i)
		if (!false) {
			console.log(`const int CHARACTERS[] = int[${w.length}](${w.join(',')});`)
		} else {
			console.log(`const int CHARACTERS[] = int[${w.length}](${w.map(i=>'0x'+i.toString(16)).join(',')});`)
		}
	}
};

new Ifon().main()
