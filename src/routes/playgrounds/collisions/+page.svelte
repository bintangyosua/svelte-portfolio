<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let animationId: number;

	// Input parameters
	let mass1 = 1; // kg untuk blok kiri
	let mass2 = 1; // kg untuk blok kanan
	let initialVelocity = 5; // m/s untuk blok kanan

	// Block properties dengan ukuran maksimal 80px
	let block1 = {
		x: 100,
		y: 300 - Math.min(30 + mass1 * 20, 80), // Posisi pada garis dasar dengan batas maksimal
		width: Math.min(30 + mass1 * 20, 80), // Ukuran berdasarkan massa dengan batas maksimal 80px
		height: Math.min(30 + mass1 * 20, 80),
		vx: 0,
		mass: mass1,
		color: '#3b6ec1' // blue dari app.css
	};

	let block2 = {
		x: 400,
		y: 300 - Math.min(30 + mass2 * 20, 80), // Posisi pada garis dasar dengan batas maksimal
		width: Math.min(30 + mass2 * 20, 80), // Ukuran berdasarkan massa dengan batas maksimal 80px
		height: Math.min(30 + mass2 * 20, 80),
		vx: -initialVelocity,
		mass: mass2,
		color: '#ef4444' // red dari app.css
	};

	let isRunning = false;
	let hasCollided = false;
	let collisionCount = 0;

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		drawScene();
	});

	function startSimulation() {
		if (isRunning) return;

		// Reset blocks dengan ukuran maksimal
		block1.x = 100;
		block1.width = Math.min(30 + mass1 * 20, 80);
		block1.height = Math.min(30 + mass1 * 20, 80);
		block1.y = 300 - block1.height;
		block1.vx = 0;
		block1.mass = mass1;

		block2.x = 400;
		block2.width = Math.min(30 + mass2 * 20, 80);
		block2.height = Math.min(30 + mass2 * 20, 80);
		block2.y = 300 - block2.height;
		block2.vx = -initialVelocity;
		block2.mass = mass2;

		hasCollided = false;
		collisionCount = 0;
		isRunning = true;

		animate();
	}

	function stopSimulation() {
		isRunning = false;
		if (animationId) {
			cancelAnimationFrame(animationId);
		}
	}

	function resetSimulation() {
		stopSimulation();

		block1.x = 100;
		block1.width = Math.min(30 + mass1 * 20, 80);
		block1.height = Math.min(30 + mass1 * 20, 80);
		block1.y = 300 - block1.height;
		block1.vx = 0;
		block1.mass = mass1;

		block2.x = 400;
		block2.width = Math.min(30 + mass2 * 20, 80);
		block2.height = Math.min(30 + mass2 * 20, 80);
		block2.y = 300 - block2.height;
		block2.vx = -initialVelocity;
		block2.mass = mass2;

		hasCollided = false;
		collisionCount = 0;
		drawScene();
	}

	function animate() {
		if (!isRunning) return;

		// Update positions
		block1.x += block1.vx;
		block2.x += block2.vx;

		// Check for collision between blocks
		if (
			block1.x + block1.width >= block2.x &&
			block1.x <= block2.x + block2.width &&
			((block1.vx > 0 && block2.vx < 0) ||
				(block1.vx > block2.vx && block1.vx > 0) ||
				(block2.vx < block1.vx && block2.vx < 0))
		) {
			// Elastic collision calculation
			const v1 = block1.vx;
			const v2 = block2.vx;
			const m1 = block1.mass;
			const m2 = block2.mass;

			// Conservation of momentum and energy
			const newV1 = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
			const newV2 = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);

			block1.vx = newV1;
			block2.vx = newV2;

			// Separate blocks to prevent overlap
			const overlap = block1.x + block1.width - block2.x;
			if (overlap > 0) {
				block1.x -= overlap / 2;
				block2.x += overlap / 2;
			}

			collisionCount++;
		}

		// Boundary collision - hanya dinding kiri
		if (block1.x <= 0) {
			block1.x = 0;
			block1.vx = -block1.vx * 0.8; // Some energy loss
			collisionCount++; // Hitung collision dengan dinding
		}
		if (block2.x <= 0) {
			block2.x = 0;
			block2.vx = -block2.vx * 0.8;
			collisionCount++; // Hitung collision dengan dinding
		}
		// Dinding kanan dihilangkan - blok bisa keluar ke kanan

		drawScene();

		// Simulasi terus berjalan tanpa berhenti otomatis
		animationId = requestAnimationFrame(animate);
	}

	function drawScene() {
		if (!ctx) return;

		// Clear canvas dengan background yang lebih gelap
		ctx.fillStyle = '#ffffff'; // gray6 dari app.css
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Draw ground line dengan warna blue2
		ctx.strokeStyle = '#284b63'; // blue2 dari app.css
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(0, 300);
		ctx.lineTo(canvas.width, 300);
		ctx.stroke();

		// Draw walls - hanya dinding kiri dengan warna gray
		ctx.strokeStyle = '#b2becd'; // gray dari app.css
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(0, 200);
		ctx.lineTo(0, 300);
		ctx.stroke();

		// Draw blocks
		ctx.fillStyle = block1.color;
		ctx.fillRect(block1.x, block1.y, block1.width, block1.height);

		ctx.fillStyle = block2.color;
		ctx.fillRect(block2.x, block2.y, block2.width, block2.height);

		// Draw mass labels dengan warna yang kontras
		ctx.fillStyle = '#b2becd'; // gray dari app.css untuk text
		ctx.font = 'bold 12px Arial';
		ctx.textAlign = 'center';
		ctx.fillText(`${block1.mass}kg`, block1.x + block1.width / 2, block1.y + block1.height / 2 + 4);
		ctx.fillText(`${block2.mass}kg`, block2.x + block2.width / 2, block2.y + block2.height / 2 + 4);

		// Draw velocity vectors
		if (isRunning || Math.abs(block1.vx) > 0.1) {
			drawVelocityVector(block1.x + block1.width / 2, block1.y - 10, block1.vx * 10, '#3b6ec1'); // blue
		}
		if (isRunning || Math.abs(block2.vx) > 0.1) {
			drawVelocityVector(block2.x + block2.width / 2, block2.y - 10, block2.vx * 10, '#ef4444'); // red
		}
	}

	function drawVelocityVector(x: number, y: number, vx: number, color: string) {
		if (Math.abs(vx) < 1) return;

		ctx.strokeStyle = color;
		ctx.lineWidth = 3; // Lebih tebal agar lebih terlihat
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + vx, y);
		ctx.stroke();

		// Arrow head dengan ukuran yang lebih besar
		if (vx > 0) {
			ctx.beginPath();
			ctx.moveTo(x + vx, y);
			ctx.lineTo(x + vx - 8, y - 4);
			ctx.lineTo(x + vx - 8, y + 4);
			ctx.closePath();
			ctx.fillStyle = color;
			ctx.fill();
		} else if (vx < 0) {
			ctx.beginPath();
			ctx.moveTo(x + vx, y);
			ctx.lineTo(x + vx + 8, y - 4);
			ctx.lineTo(x + vx + 8, y + 4);
			ctx.closePath();
			ctx.fillStyle = color;
			ctx.fill();
		}
	}

	// Update block properties when inputs change
	$: {
		if (block1) {
			block1.mass = mass1;
			block1.width = Math.min(30 + mass1 * 20, 80);
			block1.height = Math.min(30 + mass1 * 20, 80);
			// Adjust Y position to keep block on ground line (y=300)
			block1.y = 300 - block1.height;
		}
		if (block2) {
			block2.mass = mass2;
			block2.width = Math.min(30 + mass2 * 20, 80);
			block2.height = Math.min(30 + mass2 * 20, 80);
			// Adjust Y position to keep block on ground line (y=300)
			block2.y = 300 - block2.height;
		}
		if (!isRunning) {
			drawScene();
		}
	}
</script>

<svelte:head>
	<title>Collision Simulation</title>
</svelte:head>

<div class="max-w-4xl mx-auto p-8 font-alegreya">
	<h1 class="text-3xl md:text-4xl text-center text-white mb-8 font-mochiy">
		COLLISIONS PHYSICS SIMULATION
	</h1>

	<div class="flex flex-wrap gap-4 mb-6 p-4rounded-lg">
		<div class="flex flex-col min-w-[200px]">
			<label for="mass1" class="font-semibold mb-1 text-gray">Massa Blok Kiri (kg):</label>
			<input
				id="mass1"
				type="number"
				bind:value={mass1}
				min="0.1"
				max="10"
				step="0.1"
				disabled={isRunning}
				class="p-2 border border-gray/50 rounded bg-background text-gray disabled:bg-gray6 disabled:cursor-not-allowed"
			/>
		</div>

		<div class="flex flex-col min-w-[200px]">
			<label for="mass2" class="font-semibold mb-1 text-gray">Massa Blok Kanan (kg):</label>
			<input
				id="mass2"
				type="number"
				bind:value={mass2}
				min="0.1"
				max="10"
				step="0.1"
				disabled={isRunning}
				class="p-2 border border-gray/50 rounded bg-background text-gray disabled:bg-gray6 disabled:cursor-not-allowed"
			/>
		</div>

		<div class="flex flex-col min-w-[200px]">
			<label for="velocity" class="font-semibold mb-1 text-gray"
				>Kecepatan Awal Blok Kanan (m/s):</label
			>
			<input
				id="velocity"
				type="number"
				bind:value={initialVelocity}
				min="1"
				max="20"
				step="0.5"
				disabled={isRunning}
				class="p-2 border border-gray/50 rounded bg-background text-gray disabled:bg-gray6 disabled:cursor-not-allowed"
			/>
		</div>

		<div class="flex gap-2 items-end">
			<button
				on:click={startSimulation}
				disabled={isRunning}
				class="px-4 py-2 rounded font-semibold transition-colors duration-200
					   disabled:bg-gray disabled:text-gray6 disabled:cursor-not-allowed
					   enabled:bg-blue enabled:text-white enabled:hover:bg-blue/80"
			>
				Mulai Simulasi
			</button>
			<button
				on:click={stopSimulation}
				disabled={!isRunning}
				class="px-4 py-2 rounded font-semibold transition-colors duration-200
					   disabled:bg-gray disabled:text-gray6 disabled:cursor-not-allowed
					   enabled:bg-red enabled:text-white enabled:hover:bg-red/80"
			>
				Stop
			</button>
			<button
				on:click={resetSimulation}
				class="px-4 py-2 rounded font-semibold transition-colors duration-200
					   bg-orange text-white hover:bg-orange/80"
			>
				Reset
			</button>
		</div>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-4 p-4">
		<p class="m-0 text-sm">
			<strong class="text-white">Status:</strong>
			<span class="text-gray">{isRunning ? 'Berjalan' : 'Berhenti'}</span>
		</p>
		<p class="m-0 text-sm">
			<strong class="text-white">Jumlah Collision:</strong>
			<span class="text-purple">{collisionCount}</span>
		</p>
		<p class="m-0 text-sm">
			<strong class="text-white">Kecepatan Blok Kiri:</strong>
			<span class="text-green">{block1?.vx.toFixed(2) || 0} m/s</span>
		</p>
		<p class="m-0 text-sm">
			<strong class="text-white">Kecepatan Blok Kanan:</strong>
			<span class="text-green">{block2?.vx.toFixed(2) || 0} m/s</span>
		</p>
	</div>

	<canvas
		bind:this={canvas}
		width="600"
		height="400"
		class="w-full max-w-[600px] h-[400px] rounded-lg block mx-auto mb-8"
	></canvas>
</div>

<style>
	/* Hanya CSS yang diperlukan untuk responsive canvas */
	@media (max-width: 768px) {
		canvas {
			width: 100% !important;
			height: auto !important;
		}
	}
</style>
