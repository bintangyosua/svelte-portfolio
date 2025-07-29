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

	// Trail tracking
	let trailPoints: Array<{ x: number; block1X: number; block2X: number }> = [];
	let maxTrailLength = 200; // Maximum number of trail points

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
		trailPoints = []; // Reset trail
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
		trailPoints = []; // Reset trail
		drawScene();
	}

	function animate() {
		if (!isRunning) return;

		// Smaller timestep for better precision
		const timestep = 0.5;

		// Update positions
		block1.x += block1.vx * timestep;
		block2.x += block2.vx * timestep;

		// Check for collision between blocks (more precise detection)
		if (block1.x + block1.width > block2.x && block1.x < block2.x + block2.width && !hasCollided) {
			// Elastic collision calculation
			const v1 = block1.vx;
			const v2 = block2.vx;
			const m1 = block1.mass;
			const m2 = block2.mass;

			// Conservation of momentum and energy (perfect elastic collision)
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

			hasCollided = true;
			collisionCount++;
		} else if (block1.x + block1.width < block2.x || block1.x > block2.x + block2.width) {
			hasCollided = false; // Reset collision flag when blocks are separated
		}

		// Boundary collision - hanya dinding kiri (elastic collision, no energy loss)
		if (block1.x <= 0) {
			block1.x = 0;
			block1.vx = -block1.vx; // Perfect elastic collision, no energy loss
			collisionCount++; // Hitung collision dengan dinding
		}
		if (block2.x <= 0) {
			block2.x = 0;
			block2.vx = -block2.vx; // Perfect elastic collision, no energy loss
			collisionCount++; // Hitung collision dengan dinding
		}
		// Dinding kanan dihilangkan - blok bisa keluar ke kanan

		// Add trail point every few frames (when any block is moving)
		if (Math.abs(block1.vx) > 0.1 || Math.abs(block2.vx) > 0.1) {
			trailPoints.push({
				x: Date.now(), // Use timestamp for smoother trail
				block1X: block1.x + block1.width / 2,
				block2X: block2.x + block2.width / 2
			});

			// Keep trail length manageable
			if (trailPoints.length > maxTrailLength) {
				trailPoints.shift();
			}
		}
		drawScene();

		// Simulasi terus berjalan tanpa berhenti otomatis
		animationId = requestAnimationFrame(animate);
	}

	function drawScene() {
		if (!ctx) return;

		// Clear canvas tanpa background, biarkan transparan
		ctx.clearRect(0, 0, canvas.width, canvas.height);

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
		ctx.moveTo(0, 50);
		ctx.lineTo(0, 300);
		ctx.stroke();

		// Draw blocks - always draw them even if outside canvas bounds
		// Block 1 (blue)
		ctx.fillStyle = block1.color;
		ctx.fillRect(block1.x, block1.y, block1.width, block1.height);

		// Draw mass label for block1
		ctx.fillStyle = '#b2becd';
		ctx.font = 'bold 12px Arial';
		ctx.textAlign = 'center';
		ctx.fillText(`${block1.mass}kg`, block1.x + block1.width / 2, block1.y + block1.height / 2 + 4);

		// Block 2 (red)
		ctx.fillStyle = block2.color;
		ctx.fillRect(block2.x, block2.y, block2.width, block2.height);

		// Draw mass label for block2
		ctx.fillStyle = '#b2becd';
		ctx.font = 'bold 12px Arial';
		ctx.textAlign = 'center';
		ctx.fillText(`${block2.mass}kg`, block2.x + block2.width / 2, block2.y + block2.height / 2 + 4);

		// Draw position indicators for blocks outside canvas
		drawOffScreenIndicators();

		// Draw trail visualization di bawah simulasi
		drawTrail();
	}

	function drawOffScreenIndicators() {
		// Draw arrows or indicators for blocks that are off-screen
		ctx.fillStyle = '#b2becd';
		ctx.font = '10px Arial';
		ctx.textAlign = 'center';

		// Block 1 off-screen indicator
		if (block1.x + block1.width < 0) {
			// Block1 is to the left of canvas
			ctx.fillStyle = block1.color;
			ctx.fillRect(10, 50, 15, 15);
			ctx.fillStyle = '#b2becd';
			ctx.fillText('←', 17, 45);
			ctx.fillText(`${block1.mass}kg`, 17, 75);
		} else if (block1.x > canvas.width) {
			// Block1 is to the right of canvas
			ctx.fillStyle = block1.color;
			ctx.fillRect(canvas.width - 25, 50, 15, 15);
			ctx.fillStyle = '#b2becd';
			ctx.fillText('→', canvas.width - 17, 45);
			ctx.fillText(`${block1.mass}kg`, canvas.width - 17, 75);
		}

		// Block 2 off-screen indicator
		if (block2.x + block2.width < 0) {
			// Block2 is to the left of canvas
			ctx.fillStyle = block2.color;
			ctx.fillRect(10, 80, 15, 15);
			ctx.fillStyle = '#b2becd';
			ctx.fillText('←', 17, 105);
			ctx.fillText(`${block2.mass}kg`, 17, 115);
		} else if (block2.x > canvas.width) {
			// Block2 is to the right of canvas
			ctx.fillStyle = block2.color;
			ctx.fillRect(canvas.width - 25, 80, 15, 15);
			ctx.fillStyle = '#b2becd';
			ctx.fillText('→', canvas.width - 17, 105);
			ctx.fillText(`${block2.mass}kg`, canvas.width - 17, 115);
		}
	}

	function drawTrail() {
		if (trailPoints.length < 2) return;

		const trailY = 350; // Position trail below the main simulation
		const trailStartX = 50;
		const trailWidth = canvas.width - 100;

		// Draw trail background line
		ctx.strokeStyle = '#b2becd';
		ctx.lineWidth = 2;
		ctx.setLineDash([5, 5]);
		ctx.beginPath();
		ctx.moveTo(trailStartX, trailY);
		ctx.lineTo(trailStartX + trailWidth, trailY);
		ctx.stroke();
		ctx.setLineDash([]); // Reset dash

		// Calculate scale for trail - use actual position progression
		const allPositions = trailPoints.flatMap((p) => [p.block1X, p.block2X]);
		const minX = Math.min(...allPositions);
		const maxX = Math.max(...allPositions);
		const range = Math.max(maxX - minX, 300); // Minimum range increased

		// Draw trail points for both blocks
		trailPoints.forEach((point, index) => {
			const alpha = 0.3 + (index / trailPoints.length) * 0.7; // Fade older points

			// Scale positions to trail width - ensure proper mapping
			const block1TrailX =
				trailStartX +
				Math.max(0, Math.min(trailWidth, ((point.block1X - minX) / range) * trailWidth));
			const block2TrailX =
				trailStartX +
				Math.max(0, Math.min(trailWidth, ((point.block2X - minX) / range) * trailWidth));

			// Draw block1 trail point (blue) - hanya jika dalam range yang masuk akal
			if (block1TrailX >= trailStartX && block1TrailX <= trailStartX + trailWidth) {
				ctx.fillStyle = `rgba(59, 110, 193, ${alpha})`; // blue with alpha
				ctx.beginPath();
				ctx.arc(block1TrailX, trailY - 10, 3, 0, 2 * Math.PI);
				ctx.fill();
			}

			// Draw block2 trail point (red) - hanya jika dalam range yang masuk akal
			if (block2TrailX >= trailStartX && block2TrailX <= trailStartX + trailWidth) {
				ctx.fillStyle = `rgba(239, 68, 68, ${alpha})`; // red with alpha
				ctx.beginPath();
				ctx.arc(block2TrailX, trailY + 10, 3, 0, 2 * Math.PI);
				ctx.fill();
			}

			// Connect points with lines
			if (index > 0) {
				const prevPoint = trailPoints[index - 1];
				const prevBlock1X =
					trailStartX +
					Math.max(0, Math.min(trailWidth, ((prevPoint.block1X - minX) / range) * trailWidth));
				const prevBlock2X =
					trailStartX +
					Math.max(0, Math.min(trailWidth, ((prevPoint.block2X - minX) / range) * trailWidth));

				// Blue line for block1
				if (
					block1TrailX >= trailStartX &&
					prevBlock1X >= trailStartX &&
					block1TrailX <= trailStartX + trailWidth &&
					prevBlock1X <= trailStartX + trailWidth
				) {
					ctx.strokeStyle = `rgba(59, 110, 193, ${alpha * 0.5})`;
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.moveTo(prevBlock1X, trailY - 10);
					ctx.lineTo(block1TrailX, trailY - 10);
					ctx.stroke();
				}

				// Red line for block2
				if (
					block2TrailX >= trailStartX &&
					prevBlock2X >= trailStartX &&
					block2TrailX <= trailStartX + trailWidth &&
					prevBlock2X <= trailStartX + trailWidth
				) {
					ctx.strokeStyle = `rgba(239, 68, 68, ${alpha * 0.5})`;
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.moveTo(prevBlock2X, trailY + 10);
					ctx.lineTo(block2TrailX, trailY + 10);
					ctx.stroke();
				}
			}
		});

		// Draw labels
		ctx.fillStyle = '#b2becd';
		ctx.font = '10px Arial';
		ctx.textAlign = 'left';
		ctx.fillText('Blue trail', trailStartX, trailY - 20);
		ctx.fillText('Red trail', trailStartX, trailY + 30);
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
			<span class="text-blue">{block1?.vx.toFixed(2) || 0} m/s</span>
		</p>
		<p class="m-0 text-sm">
			<strong class="text-white">Kecepatan Blok Kanan:</strong>
			<span class="text-red">{block2?.vx.toFixed(2) || 0} m/s</span>
		</p>
	</div>

	<canvas
		bind:this={canvas}
		width="600"
		height="400"
		class="w-full max-w-[600px] h-[400px] rounded-lg block mx-auto mb-8 bg-transparent"
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
