<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let animationId: number;

	// Input parameters
	let mass1 = 1; // kg untuk blok kiri
	let mass2 = 1; // kg untuk blok kanan
	let initialVelocity = 5; // m/s untuk blok kanan
	let simulationSpeed = 1; // Multiplier untuk kecepatan simulasi

	// Block properties dengan skala logaritmik untuk massa besar
	let block1 = {
		x: 100,
		y: 300 - Math.min(30 + Math.log10(mass1 + 1) * 20, 80), // Logarithmic scaling
		width: Math.min(30 + Math.log10(mass1 + 1) * 20, 80),
		height: Math.min(30 + Math.log10(mass1 + 1) * 20, 80),
		vx: 0,
		mass: mass1,
		color: '#3b6ec1' // blue dari app.css
	};

	let block2 = {
		x: 400,
		y: 300 - Math.min(30 + Math.log10(mass2 + 1) * 20, 80), // Logarithmic scaling
		width: Math.min(30 + Math.log10(mass2 + 1) * 20, 80),
		height: Math.min(30 + Math.log10(mass2 + 1) * 20, 80),
		vx: -initialVelocity,
		mass: mass2,
		color: '#ef4444' // red dari app.css
	};

	let isRunning = false;
	let hasCollided = false;
	let collisionCount = 0;
	let finalPhaseStartTime = 0; // Waktu mulai fase final
	let isInFinalPhase = false; // Flag untuk fase final 5 detik
	let remainingTime = 5; // Sisa waktu countdown

	// Trail tracking
	let trailPoints: Array<{ x: number; block1X: number; block2X: number }> = [];
	let maxTrailLength = 200; // Maximum number of trail points

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		drawScene();
	});

	function startSimulation() {
		if (isRunning) return;

		// Reset blocks dengan skala logaritmik
		block1.x = 100;
		block1.width = Math.min(30 + Math.log10(mass1 + 1) * 20, 80);
		block1.height = Math.min(30 + Math.log10(mass1 + 1) * 20, 80);
		block1.y = 300 - block1.height;
		block1.vx = 0;
		block1.mass = mass1;

		block2.x = 400;
		block2.width = Math.min(30 + Math.log10(mass2 + 1) * 20, 80);
		block2.height = Math.min(30 + Math.log10(mass2 + 1) * 20, 80);
		block2.y = 300 - block2.height;
		block2.vx = -initialVelocity;
		block2.mass = mass2;

		hasCollided = false;
		collisionCount = 0;
		finalPhaseStartTime = 0;
		isInFinalPhase = false;
		remainingTime = 5;
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
		block1.width = Math.min(30 + Math.log10(mass1 + 1) * 20, 80);
		block1.height = Math.min(30 + Math.log10(mass1 + 1) * 20, 80);
		block1.y = 300 - block1.height;
		block1.vx = 0;
		block1.mass = mass1;

		block2.x = 400;
		block2.width = Math.min(30 + Math.log10(mass2 + 1) * 20, 80);
		block2.height = Math.min(30 + Math.log10(mass2 + 1) * 20, 80);
		block2.y = 300 - block2.height;
		block2.vx = -initialVelocity;
		block2.mass = mass2;

		hasCollided = false;
		collisionCount = 0;
		finalPhaseStartTime = 0;
		isInFinalPhase = false;
		remainingTime = 5;
		trailPoints = []; // Reset trail
		drawScene();
	}

	// Helper functions for collision physics (dari referensi)
	function checkSpeeds(v1: number, v2: number): boolean {
		// Simulasi berhenti ketika kedua blok bergerak ke kanan dan blok 2 lebih cepat dari blok 1
		if (v1 >= 0 && v2 >= 0) {
			return Math.abs(v2) < Math.abs(v1); // Continue if block1 faster than block2
		}
		return true; // Continue in other cases
	}

	function calculateKineticEnergy(): number {
		return 0.5 * block1.mass * block1.vx * block1.vx + 0.5 * block2.mass * block2.vx * block2.vx;
	}

	function calculateMomentum(): number {
		return block1.mass * block1.vx + block2.mass * block2.vx;
	}

	function animate() {
		if (!isRunning) return;

		// Check stopping condition based on physics (seperti referensi)
		if (!checkSpeeds(block1.vx, block2.vx) && !isInFinalPhase) {
			// Mulai fase final 5 detik
			isInFinalPhase = true;
			finalPhaseStartTime = Date.now();
		}

		// Jika dalam fase final, cek apakah sudah 5 detik
		if (isInFinalPhase) {
			const elapsedTime = (Date.now() - finalPhaseStartTime) / 1000; // dalam detik
			remainingTime = Math.max(0, 5 - Math.floor(elapsedTime));
			if (elapsedTime >= 5) {
				stopSimulation();
				return;
			}
		}

		// Adaptive timestep berdasarkan kecepatan dan massa
		let baseTimestep = 0.5; // Timestep dasar yang lebih besar

		// Untuk massa yang sangat besar, gunakan timestep yang lebih kecil untuk presisi
		if (mass2 > 1000) {
			baseTimestep = 0.1;
		}
		if (mass2 > 100000) {
			baseTimestep = 0.05;
		}

		const timestep = baseTimestep * simulationSpeed;
		let timeRemaining = timestep;

		// Loop untuk handle multiple collisions dalam satu frame
		while (timeRemaining > 0 && isRunning) {
			// Calculate time to next collision
			let timeToCollision = timeRemaining;
			let collisionType = 'none';

			// Time to block-block collision
			const relativeVelocity = block1.vx - block2.vx;
			const distance = block2.x - (block1.x + block1.width);

			if (relativeVelocity > 0 && distance > 0) {
				const timeToBlockCollision = distance / relativeVelocity;
				if (timeToBlockCollision > 0 && timeToBlockCollision < timeToCollision) {
					timeToCollision = timeToBlockCollision;
					collisionType = 'blocks';
				}
			}

			// Time to wall collision for block1
			if (block1.vx < 0) {
				const timeToWallCollision = -block1.x / block1.vx;
				if (timeToWallCollision > 0 && timeToWallCollision < timeToCollision) {
					timeToCollision = timeToWallCollision;
					collisionType = 'wall1';
				}
			}

			// Time to wall collision for block2
			if (block2.vx < 0) {
				const timeToWallCollision = -block2.x / block2.vx;
				if (timeToWallCollision > 0 && timeToWallCollision < timeToCollision) {
					timeToCollision = timeToWallCollision;
					collisionType = 'wall2';
				}
			}

			// Move blocks to collision point (or end of timestep)
			block1.x += block1.vx * timeToCollision;
			block2.x += block2.vx * timeToCollision;

			// Handle collision
			if (collisionType === 'blocks') {
				// Perfect elastic collision between blocks
				const v1 = block1.vx;
				const v2 = block2.vx;
				const m1 = block1.mass;
				const m2 = block2.mass;
				const totalMass = m1 + m2;

				// Conservation of momentum and energy (dari referensi)
				block1.vx = ((m1 - m2) * v1 + 2 * m2 * v2) / totalMass;
				block2.vx = ((m2 - m1) * v2 + 2 * m1 * v1) / totalMass;

				// Ensure exact positioning to prevent overlap
				block1.x = block2.x - block1.width;

				collisionCount++;
				hasCollided = true;
			} else if (collisionType === 'wall1') {
				// Block1 hits wall - perfect elastic reflection
				block1.x = 0;
				block1.vx = -block1.vx;
				collisionCount++;
			} else if (collisionType === 'wall2') {
				// Block2 hits wall - perfect elastic reflection
				block2.x = 0;
				block2.vx = -block2.vx;
				collisionCount++;
			}

			timeRemaining -= timeToCollision;

			// Safety check to prevent infinite loops
			if (timeToCollision < 1e-10) {
				break;
			}
		}

		// Add trail points for visualization
		if (Math.abs(block1.vx) > 0.01 || Math.abs(block2.vx) > 0.01) {
			trailPoints.push({
				x: Date.now(),
				block1X: block1.x + block1.width / 2,
				block2X: block2.x + block2.width / 2
			});

			if (trailPoints.length > maxTrailLength) {
				trailPoints.shift();
			}
		}

		drawScene();

		// Continue animation
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
			block1.width = Math.min(30 + Math.log10(mass1 + 1) * 20, 80);
			block1.height = Math.min(30 + Math.log10(mass1 + 1) * 20, 80);
			// Adjust Y position to keep block on ground line (y=300)
			block1.y = 300 - block1.height;
		}
		if (block2) {
			block2.mass = mass2;
			block2.width = Math.min(30 + Math.log10(mass2 + 1) * 20, 80);
			block2.height = Math.min(30 + Math.log10(mass2 + 1) * 20, 80);
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
				max="1000"
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
				max="1000000"
				step="1"
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
				min="-50"
				max="50"
				step="0.1"
				disabled={isRunning}
				class="p-2 border border-gray/50 rounded bg-background text-gray disabled:bg-gray6 disabled:cursor-not-allowed"
			/>
		</div>

		<div class="flex flex-col min-w-[150px]">
			<label for="speed" class="font-semibold mb-1 text-gray">Kecepatan Simulasi:</label>
			<select
				id="speed"
				bind:value={simulationSpeed}
				disabled={isRunning}
				class="p-2 border border-gray/50 rounded bg-background text-gray disabled:bg-gray6 disabled:cursor-not-allowed"
			>
				<option value={0.25}>0.25x (Lambat)</option>
				<option value={0.5}>0.5x</option>
				<option value={1}>1x (Normal)</option>
				<option value={2}>2x (Cepat)</option>
				<option value={4}>4x (Sangat Cepat)</option>
			</select>
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

	<!-- Preset massa untuk menghitung π (seperti referensi 3Blue1Brown) -->
	<div class="flex flex-wrap gap-2 mb-4">
		<span class="text-white font-semibold">Preset Massa (untuk π):</span>
		<button
			on:click={() => {
				mass1 = 1;
				mass2 = 100;
				initialVelocity = -1;
			}}
			disabled={isRunning}
			class="px-2 py-1 text-xs rounded bg-blue/20 text-blue hover:bg-blue/40 disabled:opacity-50"
		>
			π ≈ 3.14 (1kg, 100kg)
		</button>
		<button
			on:click={() => {
				mass1 = 1;
				mass2 = 10000;
				initialVelocity = -1;
			}}
			disabled={isRunning}
			class="px-2 py-1 text-xs rounded bg-blue/20 text-blue hover:bg-blue/40 disabled:opacity-50"
		>
			π ≈ 3.141 (1kg, 10⁴kg)
		</button>
		<button
			on:click={() => {
				mass1 = 1;
				mass2 = 1000000;
				initialVelocity = -1;
			}}
			disabled={isRunning}
			class="px-2 py-1 text-xs rounded bg-blue/20 text-blue hover:bg-blue/40 disabled:opacity-50"
		>
			π ≈ 3.1415 (1kg, 10⁶kg)
		</button>
	</div>

	<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-4">
		<p class="m-0 text-sm">
			<strong class="text-white">Status:</strong>
			<span class="text-gray">
				{#if isRunning}
					{#if isInFinalPhase}
						<span class="text-orange"
							>Fase Final ({Math.max(
								0,
								5 - Math.floor((Date.now() - finalPhaseStartTime) / 1000)
							)}s)</span
						>
					{:else}
						Berjalan
					{/if}
				{:else}
					Berhenti
				{/if}
			</span>
		</p>
		<p class="m-0 text-sm">
			<strong class="text-white">Collisions:</strong>
			<span class="text-purple">{collisionCount}</span>
		</p>
		<p class="m-0 text-sm">
			<strong class="text-white">V1:</strong>
			<span class="text-blue">{block1?.vx.toFixed(3) || 0} m/s</span>
		</p>
		<p class="m-0 text-sm">
			<strong class="text-white">V2:</strong>
			<span class="text-red">{block2?.vx.toFixed(3) || 0} m/s</span>
		</p>
		<p class="m-0 text-sm">
			<strong class="text-white">Energi Kinetik:</strong>
			<span class="text-green">{isRunning ? calculateKineticEnergy().toFixed(2) : '0.00'} J</span>
		</p>
		<p class="m-0 text-sm">
			<strong class="text-white">Momentum:</strong>
			<span class="text-orange">{isRunning ? calculateMomentum().toFixed(3) : '0.000'} kg⋅m/s</span>
		</p>
	</div>

	<canvas
		bind:this={canvas}
		width="600"
		height="400"
		class="w-full max-w-[600px] h-[400px] rounded-lg block mx-auto mb-8 bg-transparent"
	></canvas>

	<!-- Informasi edukatif tentang counting π -->
	<!-- <div class="bg-gray6/10 rounded-lg p-4 mb-4">
		<h3 class="text-white text-lg font-semibold mb-2">💡 Fenomena Counting π</h3>
		<p class="text-gray text-sm mb-2">
			Ketika massa blok kedua adalah 100^n kali massa blok pertama (dimana n adalah bilangan bulat),
			maka jumlah collision akan mendekati π × 10^n!
		</p>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
			<div class="bg-blue/10 p-3 rounded">
				<div class="text-blue font-semibold">Ratio 100:1</div>
				<div class="text-gray">Collisions ≈ 31 (π × 10¹)</div>
				<div class="text-gray text-xs">Menghasilkan sekitar 3.1 digit π</div>
			</div>
			<div class="bg-blue/10 p-3 rounded">
				<div class="text-blue font-semibold">Ratio 10,000:1</div>
				<div class="text-gray">Collisions ≈ 314 (π × 10²)</div>
				<div class="text-gray text-xs">Menghasilkan sekitar 3.14 digit π</div>
			</div>
			<div class="bg-blue/10 p-3 rounded">
				<div class="text-blue font-semibold">Ratio 1,000,000:1</div>
				<div class="text-gray">Collisions ≈ 3141 (π × 10³)</div>
				<div class="text-gray text-xs">Menghasilkan sekitar 3.141 digit π</div>
			</div>
		</div>
		<p class="text-gray text-xs mt-2">
			<strong>Catatan:</strong> Algoritma ini menggunakan presisi tinggi untuk memastikan akurasi dalam
			menghitung collision dengan massa yang sangat besar. Berdasarkan penelitian G. Galperin dan dipopulerkan
			oleh 3Blue1Brown.
		</p>
		<p class="text-gray text-xs mt-2">
			<strong>Fase Final:</strong> Simulasi akan menampilkan countdown 5 detik setelah collision terakhir 
			untuk menunjukkan bahwa blok masih bergerak namun tidak akan collision lagi karena kondisi fisika sudah terpenuhi.
		</p>
	</div> -->
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
