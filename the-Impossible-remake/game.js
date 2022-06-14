import kaboom from 'kaboom';

kaboom({
	// width: window.screen.width,
	// height: window.screen.height,
	background: [2, 83, 115, 0],
	// canvas: document.querySelector('#myCanvas'),
	scale: 0.7,
});
// Sprites
loadSpriteAtlas('./assets/images/player.png', {
	cube: {
		x: 0,
		y: 0,
		sliceX: 9,
		sliceY: 1,
		height: 110,
		width: 990,
		anims: {
			idle: 0,
			jump: { from: 0, to: 8, speed: 18 },
			dead: { from: 0, to: 0, speed: 16 },
		},
	},
});
loadSpriteAtlas('./assets/images/portal.png', {
	portal: {
		x: 0,
		y: 0,
		sliceX: 8,
		sliceY: 3,
		height: 192,
		width: 512,
		anims: {
			idle: { from: 0, to: 7, loop: true },
		},
	},
});
loadSpriteAtlas('./assets/images/end-portal.png', {
	endPortal: {
		x: 0,
		y: 0,
		sliceX: 11,
		sliceY: 1,
		height: 100,
		width: 1100,
		anims: {
			idle: { from: 0, to: 10, loop: true },
		},
	},
});
loadSpriteAtlas('./assets/images/trampolin.png', {
	trampolin: {
		x: 0,
		y: 0,
		sliceX: 7,
		sliceY: 1,
		height: 50,
		width: 700,
		anims: {
			idle: { from: 0, to: 6, loop: true },
		},
	},
});
loadSprite('floor-level', './assets/images/floor-level2.png');
loadSprite('floor-level2', './assets/images/floor-level3.png');
loadSprite('spike', './assets/images/spike3.png');
loadSprite('floor', './assets/images/floor2.png');
loadSprite('toxic', './assets/images/toxic.png');
// Sound
loadSound('explode', './assets/sounds/explode.wav');
loadSound('theme', './assets/sounds/theme.mp3');

const SPEED = 900;
const FALL_DEATH = 2400;
const JUMP_FORCE = 1050;
const GRAVITY = 4000;
let jumpIndex = 0;
// 4 spaces between jumps up
// 3 spaces on slide down
const LEVELS = [
	[''],
	[
		'                                                                                                                                                                        ^',
		'                                                                                                                                                                        =',
		'                                                                                                                                                                    =',
		'                                                                                                                                                                =',
		'                                                                                                                                                            =              ^                                  &',
		'                                                                                                                                                        =              =====            =    =    =    ========',
		'                                                                                                                                                    =                       ====    =',
		'                                                                                                                                                =',
		'                                                                                                                                            =',
		'                                                                                                                 ^^     ^               =',
		'                                                                                                            ====================    =',
		'                                                                                                       ==                                                             ',
		'                                                                                                  ==                               ',
		'                                                                     ^                       ==                                     ',
		'                                                                     =                  ==                                            ',
		'@             ^                   ^^     ^              =^^^=              =^      ==',
		'---------------------------------------------------------___------------------------__________________________________________________________________________________________________________________________________',
	],
	[
		'                                                                                                                                                     ',
		'                                                                                                                                                     ',
		'                                                                                                                                                 ',
		'                                                                                                                                             ',
		'                                                                                                                                         ',
		'                                                                                                                                     ',
		'                                                                            =                   ======      =      =      =      ',
		'                              ^           ^^^                           =      =    ^       =           =      =      =      =                               ^^',
		'                            = =  =  ^     ===        =    =    =    =             =======                                       =                ====      ====       =    =    =    ^^^',
		'@             ^^^       =           =            =                                                                                 =    =    =         =       ====                ======   =     &',
		'-------------------------___________--------------__________________________________________________________________________________________________________________________________________-------',
	],
	//? Might remove triple spike
	[
		'@',
		'',
		'',
		'',
		'',
		'',
		'                                       =========================',
		'                                       vvvvvvvvvvvvvvvvvvvvvvvvv                                                                         ',
		'                                                                                                                                      =====   =======',
		'     ==                                                                            =                                                 =     = =       =',
		'                                                                                                                                    =       =         =',
		'                                               o     o     o                                  =              o              ========            ^      ===',
		'                                       =========================            =      =      =      =          ^=^^^^^^                   ^============             ^    ^    ^    ^       &',
		'                    o^^^^^           o                                  =      =      =             =====================================================================================',
		'_____________-------------------------                            -----',
	],
	['@                   #', '---------------------'],
];
const levelConfig = {
	width: 100,
	height: 100,
	// pos: vec2(100, 700),
	'@': () => [
		sprite('cube', { flipX: true }),
		move(RIGHT, SPEED),
		z(1000),
		area({ height: 100, width: 100 }),
		rotate(0),
		body(),
		// spin(),
		origin('center'),
		'player',
	],
	'=': () => [
		sprite('floor-level'),
		area({ height: 50 }),
		solid(),
		z(900),
		origin('bot'),
		'ground',
	],
	'#': () => [
		sprite('endPortal', { anim: 'idle' }),
		area(scale(0.2, 1)),
		scale(3),
		origin('bot'),
		'endPortal',
	],
	'^': () => [
		sprite('spike'),
		scale(1, 0.6),
		z(901),
		area({ width: 25, height: 75 }),
		solid(),
		origin('center'),
		'danger',
	],
	v: () => [
		sprite('spike', { flipY: true }),
		area({ width: 25, height: 75 }),
		solid(),
		origin('bot'),
		'danger',
	],
	'-': () => [sprite('floor'), z(900), area({ height: 50 }), solid(), origin('bot')],
	_: () => [sprite('toxic'), z(900), area(), solid(), origin('bot'), 'toxic'],
	'&': () => [
		sprite('portal', { anim: 'idle' }),
		area(scale(0.2, 1)),
		scale(3),
		origin('bot'),
		'portal',
	],
	o: () => [sprite('trampolin', { anim: 'idle' }), z(950), area(), origin('center'), 'trampolin'],
};

scene('game', ({ levelId, music } = { levelId: 0, music: null }) => {
	gravity(GRAVITY);
	addLevel(LEVELS[levelId ?? 0], levelConfig);
	addButton(levelId < 1 ? 'Start game:)' : 'Quit', vec2(10, 10), () => {
		if (music) music.stop();
		levelId < 1
			? go('game', {
					levelId: levelId + 1,
					music: music,
			  })
			: go('game', {
					levelId: 0,
					music: null,
			  });
	});
	if (levelId < 1) {
		return;
	}
	const player = get('player')[0];

	if (!music) {
		music = play('theme', {
			volume: 0.5,
			loop: true,
			seek: 130,
		});
	}

	player.onUpdate(() => {
		camPos(player.pos);
		if (player.pos.y >= FALL_DEATH) {
			restartLvl();
		}
	});

	onUpdate('spike', (b) => {
		b.solid = b.pos.dist(player.pos) <= 64;
	});
	onUpdate('doubleJumpGround', (b) => {
		b.solid = b.pos.dist(player.pos) <= 64;
	});
	onUpdate('danger', (b) => {
		b.solid = b.pos.dist(player.pos) <= 64;
	});
	onUpdate('toxic', (b) => {
		b.solid = b.pos.dist(player.pos) <= 64;
	});
	onUpdate('trampolin', (b) => {
		b.solid = b.pos.dist(player.pos) <= 64;
	});
	onUpdate('portal', (b) => {
		b.solid = b.pos.dist(player.pos) <= 64;
	});
	onUpdate('endPortal', (b) => {
		b.solid = b.pos.dist(player.pos) <= 64;
	});

	player.onCollide('ground', (e, col) => {
		if (!col.isBottom()) {
			restartLvl();
		}
	});
	// player.onCollide('doubleJumpGround', (e, col) => {
	// 	window.parent.postMessage('nextLevel');
	// 	// if (!col.isBottom()) {
	// 	// 	restartLvl();
	// 	// }
	// });

	player.onCollide('endPortal', () => {
		go('win');
	});

	player.onCollide('danger', () => {
		restartLvl();
	});

	player.onCollide('toxic', () => {
		restartLvl();
	});

	player.onCollide('trampolin', () => {
		player.jump(JUMP_FORCE * 1.7);
	});

	player.onCollide('portal', () => {
		if (levelId < LEVELS.length - 1) {
			go('game', {
				levelId: levelId + 1,
				music: music,
			});
		}
	});

	// onKeyDown('right', () => {
	// 	player.move(SPEED, 0);
	// });
	// onKeyDown('left', () => {
	// 	player.move(-SPEED, 0);
	// });

	onKeyPress('space', () => {
		if (player.isGrounded()) {
			// jumpIndex = 1;
			player.jump(JUMP_FORCE);
			player.play('jump');
		}
		// } else if (jumpIndex <= 1) {
		// 	player.jump();
		// }
		// jumpIndex++;
	});

	onKeyDown('space', () => {
		if (player.isGrounded()) {
			player.jump(JUMP_FORCE);
			player.play('jump');
		}
	});

	function addButton(txt, p, f) {
		const btn = add([
			text(txt),
			area({ cursor: 'pointer' }),
			pos(p),
			scale(1),
			origin('topleft'),
			fixed(),
		]);

		btn.onClick(f);

		btn.onUpdate(() => {
			if (btn.isHovering()) {
				btn.scale = vec2(1.2);
			} else {
				btn.scale = vec2(1);
				btn.color = rgb();
			}
		});
	}

	function restartLvl() {
		const dead = add([
			sprite('cube', { flipX: true }),
			z(1000),
			pos(player.pos),
			origin('center'),
			area(),
		]);
		player.destroy();
		music.stop();
		play('explode', {
			volume: 0.5,
			detune: 600,
		});
		shake(10);
		dead.play('dead');
		wait(1.5, () => {
			go('game', {
				levelId: 1,
				music: null,
			});
		});
	}
});

go('game');

scene('win', () => {
	addButton('You Win, click here to continue :)', vec2(100, 100), () => {
		window.parent.postMessage('nextLevel');
	});
	function addButton(txt, p, f) {
		const btn = add([
			text(txt),
			area({ cursor: 'pointer' }),
			pos(p),
			scale(1),
			origin('topleft'),
			fixed(),
		]);

		btn.onClick(f);

		btn.onUpdate(() => {
			if (btn.isHovering()) {
				btn.scale = vec2(1.2);
			} else {
				btn.scale = vec2(1);
				btn.color = rgb();
			}
		});
	}
});
