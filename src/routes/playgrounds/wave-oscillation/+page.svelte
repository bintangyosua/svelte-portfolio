<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let animationId: number;

	// Wave simulation modes
	type WaveMode = 'manual' | 'oscillate' | 'pulse';
	let currentMode: WaveMode = 'manual';

	// End conditions
	type EndType = 'fixed' | 'loose' | 'no-end';
	let leftEnd: EndType = 'fixed';
	let rightEnd: EndType = 'fixed';

	// Control parameters
	let isRunning = false;
	let time = 0;
	let damping = 0.02;
	let tension = 0.5;
	let showRulers = true;
	let showTimer = true;
	let showReferenceLine = true;
	let slowMotion = false;

	// Wave parameters
	let amplitude = 50;
	let frequency = 0.1;
	let pulseWidth = 20;

	// String simulation
	const stringLength = 700;
	const numPoints = 140;
	let stringPoints: number[] = [];
	let stringVelocities: number[] = [];
	let manualDragIndex = -1;
	let manualDragY = 0;

	// Initialize string
	function initializeString() {
		stringPoints = new Array(numPoints).fill(0);
		stringVelocities = new Array(numPoints).fill(0);
	}

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		initializeString();
		canvas.addEventListener('mousedown', handleMouseDown);
		canvas.addEventListener('mousemove', handleMouseMove);
		canvas.addEventListener('mouseup', handleMouseUp);
		drawScene();
	});

	function handleMouseDown(event: MouseEvent) {
		if (currentMode === 'manual') {
			const rect = canvas.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;

			// Convert to canvas coordinates
			const canvasX = (x / rect.width) * canvas.width;
			const canvasY = (y / rect.height) * canvas.height;

			// Find closest string point
			const index = Math.round((canvasX - 50) / (stringLength / numPoints));
			if (index >= 0 && index < numPoints) {
				manualDragIndex = index;
				manualDragY = canvasY - 200; // Center line at y=200
			}
		}
	}

	function handleMouseMove(event: MouseEvent) {
		if (manualDragIndex >= 0 && currentMode === 'manual') {
			const rect = canvas.getBoundingClientRect();
			const y = event.clientY - rect.top;
			const canvasY = (y / rect.height) * canvas.height;
			manualDragY = canvasY - 200;
			stringPoints[manualDragIndex] = Math.max(-100, Math.min(100, manualDragY));
			drawScene();
		}
	}

	function handleMouseUp() {
		manualDragIndex = -1;
	}

	function startSimulation() {
		if (isRunning) return;
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
		time = 0;
		initializeString();
		drawScene();
	}

	function changeMode(mode: WaveMode) {
		currentMode = mode;
		resetSimulation();
	}

	function animate() {
		if (!isRunning) return;

		const dt = slowMotion ? 0.01 : 0.05;
		time += dt;

		updateWave(dt);
		drawScene();
		animationId = requestAnimationFrame(animate);
	}

	function updateWave(dt: number) {
		const newVelocities = [...stringVelocities];
		const newPoints = [...stringPoints];

		// Apply boundary conditions
		if (leftEnd === 'fixed') {
			newPoints[0] = 0;
			newVelocities[0] = 0;
		} else if (leftEnd === 'loose') {
			newPoints[0] = newPoints[1];
		}

		if (rightEnd === 'fixed') {
			newPoints[numPoints - 1] = 0;
			newVelocities[numPoints - 1] = 0;
		} else if (rightEnd === 'loose') {
			newPoints[numPoints - 1] = newPoints[numPoints - 2];
		}

		// Wave equation: d²y/dt² = T/μ * d²y/dx²
		for (let i = 1; i < numPoints - 1; i++) {
			const acceleration =
				tension * (stringPoints[i - 1] - 2 * stringPoints[i] + stringPoints[i + 1]);
			newVelocities[i] += acceleration * dt;
			newVelocities[i] *= 1 - damping; // Apply damping
			newPoints[i] += newVelocities[i] * dt;
		}

		// Apply driving force based on mode
		if (currentMode === 'oscillate' && isRunning) {
			const driveAmplitude = amplitude * Math.sin(frequency * time);
			if (leftEnd !== 'fixed') {
				newPoints[0] = driveAmplitude;
			} else {
				newPoints[Math.floor(numPoints * 0.1)] = driveAmplitude;
			}
		} else if (currentMode === 'pulse' && time < 2) {
			const pulseIndex = Math.floor(numPoints * 0.1);
			const pulseMagnitude = amplitude * Math.exp(-Math.pow((time - 1) / 0.3, 2));
			newPoints[pulseIndex] = pulseMagnitude;
		}

		stringPoints = newPoints;
		stringVelocities = newVelocities;
	}

	function drawScene() {
		if (!ctx) return;

		// Clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const centerY = canvas.height / 2;

		// Draw reference line
		if (showReferenceLine) {
			ctx.strokeStyle = '#2a2e35';
			ctx.lineWidth = 1;
			ctx.setLineDash([5, 5]);
			ctx.beginPath();
			ctx.moveTo(50, centerY);
			ctx.lineTo(canvas.width - 50, centerY);
			ctx.stroke();
			ctx.setLineDash([]);
		}

		// Draw rulers
		if (showRulers) {
			drawRulers();
		}

		// Draw string/wave
		drawString();

		// Draw end constraints
		drawEndConstraints();

		// Draw timer
		if (showTimer) {
			ctx.fillStyle = '#b2becd';
			ctx.font = '16px Arial';
			ctx.fillText(`Time: ${time.toFixed(1)}s`, 20, 30);
		}

		// Draw mode indicator
		ctx.fillStyle = '#3b6ec1';
		ctx.font = '14px Arial';
		ctx.fillText(`Mode: ${currentMode.charAt(0).toUpperCase() + currentMode.slice(1)}`, 20, 50);
	}

	function drawString() {
		const centerY = canvas.height / 2;
		const startX = 50;
		const dx = stringLength / numPoints;

		// Draw string points
		ctx.strokeStyle = '#ef4444';
		ctx.lineWidth = 3;
		ctx.beginPath();

		for (let i = 0; i < numPoints; i++) {
			const x = startX + i * dx;
			const y = centerY + stringPoints[i];

			if (i === 0) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}
		}
		ctx.stroke();

		// Draw string beads/nodes
		ctx.fillStyle = '#ef4444';
		for (let i = 0; i < numPoints; i += 5) {
			const x = startX + i * dx;
			const y = centerY + stringPoints[i];
			ctx.beginPath();
			ctx.arc(x, y, 2, 0, 2 * Math.PI);
			ctx.fill();
		}
	}

	function drawEndConstraints() {
		const centerY = canvas.height / 2;
		const leftX = 50;
		const rightX = canvas.width - 50;

		// Left end
		if (leftEnd === 'fixed') {
			// Draw fixed support
			ctx.fillStyle = '#b2becd';
			ctx.strokeStyle = '#b2becd';
			ctx.lineWidth = 4;
			ctx.beginPath();
			ctx.moveTo(leftX - 20, centerY - 30);
			ctx.lineTo(leftX, centerY);
			ctx.lineTo(leftX - 20, centerY + 30);
			ctx.stroke();

			// Hatching
			for (let i = -3; i <= 3; i++) {
				ctx.beginPath();
				ctx.moveTo(leftX - 25, centerY + i * 8);
				ctx.lineTo(leftX - 15, centerY + i * 8);
				ctx.stroke();
			}
		} else if (leftEnd === 'loose') {
			// Draw loose end (ring)
			ctx.strokeStyle = '#22c55e';
			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.arc(leftX - 10, centerY, 8, 0, 2 * Math.PI);
			ctx.stroke();
		}

		// Right end
		if (rightEnd === 'fixed') {
			// Draw fixed support
			ctx.fillStyle = '#b2becd';
			ctx.strokeStyle = '#b2becd';
			ctx.lineWidth = 4;
			ctx.beginPath();
			ctx.moveTo(rightX + 20, centerY - 30);
			ctx.lineTo(rightX, centerY);
			ctx.lineTo(rightX + 20, centerY + 30);
			ctx.stroke();

			// Hatching
			for (let i = -3; i <= 3; i++) {
				ctx.beginPath();
				ctx.moveTo(rightX + 15, centerY + i * 8);
				ctx.lineTo(rightX + 25, centerY + i * 8);
				ctx.stroke();
			}
		} else if (rightEnd === 'loose') {
			// Draw loose end (ring)
			ctx.strokeStyle = '#22c55e';
			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.arc(rightX + 10, centerY, 8, 0, 2 * Math.PI);
			ctx.stroke();
		}
	}

	function drawRulers() {
		const centerY = canvas.height / 2;

		// Horizontal ruler
		ctx.strokeStyle = '#b2becd';
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(50, canvas.height - 30);
		ctx.lineTo(canvas.width - 50, canvas.height - 30);
		ctx.stroke();

		// Ruler marks
		for (let i = 0; i <= 10; i++) {
			const x = 50 + (i * stringLength) / 10;
			ctx.beginPath();
			ctx.moveTo(x, canvas.height - 35);
			ctx.lineTo(x, canvas.height - 25);
			ctx.stroke();

			if (i % 2 === 0) {
				ctx.fillStyle = '#b2becd';
				ctx.font = '10px Arial';
				ctx.textAlign = 'center';
				ctx.fillText(`${i}`, x, canvas.height - 15);
			}
		}

		// Vertical ruler (left side)
		ctx.beginPath();
		ctx.moveTo(20, centerY - 100);
		ctx.lineTo(20, centerY + 100);
		ctx.stroke();

		for (let i = -4; i <= 4; i++) {
			const y = centerY + i * 25;
			ctx.beginPath();
			ctx.moveTo(15, y);
			ctx.lineTo(25, y);
			ctx.stroke();

			if (i !== 0) {
				ctx.fillStyle = '#b2becd';
				ctx.font = '10px Arial';
				ctx.textAlign = 'right';
				ctx.fillText(`${-i}`, 12, y + 3);
			}
		}
	}

	// Reactive updates
	$: if (!isRunning && ctx) {
		drawScene();
	}
</script>

<svelte:head>
	<title>Wave String Simulation</title>
</svelte:head>

<div class="max-w-6xl mx-auto p-8 font-alegreya">
	<h1 class="text-3xl md:text-4xl text-center text-white mb-8 font-mochiy">
		WAVE STRING SIMULATION
	</h1>

	<div class="flex flex-wrap justify-center gap-8 mb-6">
		<!-- Left Control Panel -->
		<div class="bg-yellow/20 rounded-lg p-4 border border-yellow/30">
			<h3 class="text-white font-semibold mb-3">Wave Mode</h3>
			<div class="space-y-2">
				<label class="flex items-center space-x-2 text-white">
					<input
						type="radio"
						bind:group={currentMode}
						value="manual"
						class="text-blue"
						on:change={() => changeMode('manual')}
					/>
					<span>Manual</span>
				</label>
				<label class="flex items-center space-x-2 text-white">
					<input
						type="radio"
						bind:group={currentMode}
						value="oscillate"
						class="text-blue"
						on:change={() => changeMode('oscillate')}
					/>
					<span>Oscillate</span>
				</label>
				<label class="flex items-center space-x-2 text-white">
					<input
						type="radio"
						bind:group={currentMode}
						value="pulse"
						class="text-blue"
						on:change={() => changeMode('pulse')}
					/>
					<span>Pulse</span>
				</label>
			</div>
			<button
				on:click={resetSimulation}
				class="mt-4 px-4 py-2 bg-gray6 text-white rounded hover:bg-gray transition-colors"
			>
				Restart
			</button>
		</div>

		<!-- Right Control Panel -->
		<div class="bg-green/20 rounded-lg p-4 border border-green/30">
			<h3 class="text-white font-semibold mb-3">End Conditions</h3>
			<div class="mb-3">
				<span class="text-white text-sm">Left End:</span>
				<div class="space-y-1 mt-1">
					<label class="flex items-center space-x-2 text-white text-sm">
						<input type="radio" bind:group={leftEnd} value="fixed" class="text-blue" />
						<span>Fixed End</span>
					</label>
					<label class="flex items-center space-x-2 text-white text-sm">
						<input type="radio" bind:group={leftEnd} value="loose" class="text-blue" />
						<span>Loose End</span>
					</label>
					<label class="flex items-center space-x-2 text-white text-sm">
						<input type="radio" bind:group={leftEnd} value="no-end" class="text-blue" />
						<span>No End</span>
					</label>
				</div>
			</div>
			<div>
				<span class="text-white text-sm">Right End:</span>
				<div class="space-y-1 mt-1">
					<label class="flex items-center space-x-2 text-white text-sm">
						<input type="radio" bind:group={rightEnd} value="fixed" class="text-blue" />
						<span>Fixed End</span>
					</label>
					<label class="flex items-center space-x-2 text-white text-sm">
						<input type="radio" bind:group={rightEnd} value="loose" class="text-blue" />
						<span>Loose End</span>
					</label>
					<label class="flex items-center space-x-2 text-white text-sm">
						<input type="radio" bind:group={rightEnd} value="no-end" class="text-blue" />
						<span>No End</span>
					</label>
				</div>
			</div>
		</div>
	</div>

	<!-- Motion Controls -->
	<div class="flex justify-center gap-4 mb-6">
		<div class="flex items-center space-x-4">
			<label class="flex items-center space-x-2 text-white">
				<input type="radio" bind:group={slowMotion} value={false} class="text-blue" />
				<span>Normal</span>
			</label>
			<label class="flex items-center space-x-2 text-white">
				<input type="radio" bind:group={slowMotion} value={true} class="text-blue" />
				<span>Slow Motion</span>
			</label>
		</div>

		<button
			on:click={isRunning ? stopSimulation : startSimulation}
			class="px-6 py-2 rounded font-semibold transition-colors duration-200
				   {isRunning ? 'bg-orange text-white hover:bg-orange/80' : 'bg-blue text-white hover:bg-blue/80'}"
		>
			{isRunning ? '⏸️' : '▶️'}
		</button>
	</div>

	<!-- Parameters Panel -->
	<div class="bg-background/50 rounded-lg p-4 mb-6">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div>
				<label for="damping" class="block text-gray mb-1">Damping:</label>
				<input
					id="damping"
					type="range"
					bind:value={damping}
					min="0"
					max="0.1"
					step="0.01"
					class="w-full range-slider"
				/>
				<div class="flex justify-between text-xs text-gray mt-1">
					<span>None</span>
					<span>{damping.toFixed(2)}</span>
					<span>Lots</span>
				</div>
			</div>
			<div>
				<label for="tension" class="block text-gray mb-1">Tension:</label>
				<input
					id="tension"
					type="range"
					bind:value={tension}
					min="0.1"
					max="1.0"
					step="0.1"
					class="w-full range-slider"
				/>
				<div class="flex justify-between text-xs text-gray mt-1">
					<span>Low</span>
					<span>{tension.toFixed(1)}</span>
					<span>High</span>
				</div>
			</div>
			<div>
				<label for="amplitude" class="block text-gray mb-1">Amplitude:</label>
				<input
					id="amplitude"
					type="range"
					bind:value={amplitude}
					min="10"
					max="100"
					step="5"
					class="w-full range-slider"
				/>
				<span class="text-sm text-gray">{amplitude}</span>
			</div>
		</div>

		{#if currentMode === 'oscillate'}
			<div class="mt-4">
				<label for="frequency" class="block text-gray mb-1">Oscillation Frequency:</label>
				<input
					id="frequency"
					type="range"
					bind:value={frequency}
					min="0.05"
					max="0.5"
					step="0.05"
					class="w-full range-slider"
				/>
				<span class="text-sm text-gray">{frequency.toFixed(2)} Hz</span>
			</div>
		{/if}
	</div>

	<!-- Display Options -->
	<div class="flex justify-center gap-6 mb-6">
		<label class="flex items-center space-x-2 text-white">
			<input type="checkbox" bind:checked={showRulers} class="text-blue" />
			<span>Rulers</span>
		</label>
		<label class="flex items-center space-x-2 text-white">
			<input type="checkbox" bind:checked={showTimer} class="text-blue" />
			<span>Timer</span>
		</label>
		<label class="flex items-center space-x-2 text-white">
			<input type="checkbox" bind:checked={showReferenceLine} class="text-blue" />
			<span>Reference Line</span>
		</label>
	</div>

	<!-- Canvas -->
	<canvas
		bind:this={canvas}
		width="800"
		height="400"
		class="w-full max-w-[800px] h-[400px] rounded-lg block mx-auto bg-yellow/10 border border-gray/30 cursor-pointer"
	></canvas>

	<!-- Instructions -->
	<div class="mt-6 bg-background/30 rounded-lg p-4">
		{#if currentMode === 'manual'}
			<h3 class="text-lg font-semibold text-white mb-2">Manual Mode</h3>
			<p class="text-gray">
				Click and drag any point on the string to create waves manually. Try different end
				conditions to see how waves reflect differently.
			</p>
		{:else if currentMode === 'oscillate'}
			<h3 class="text-lg font-semibold text-white mb-2">Oscillate Mode</h3>
			<p class="text-gray">
				The left end oscillates continuously at the set frequency and amplitude. Observe how
				standing wave patterns form with different end conditions.
			</p>
		{:else if currentMode === 'pulse'}
			<h3 class="text-lg font-semibold text-white mb-2">Pulse Mode</h3>
			<p class="text-gray">
				A single pulse travels along the string. Watch how it reflects at different end types: fixed
				ends invert the pulse, loose ends don't, and no ends let it pass through.
			</p>
		{/if}
	</div>
</div>

<style>
	/* Custom range slider styling */
	.range-slider {
		appearance: none;
		background: #2a2e35;
		border-radius: 9999px;
		height: 8px;
		outline: none;
		width: 100%;
	}

	.range-slider::-webkit-slider-thumb {
		appearance: none;
		width: 16px;
		height: 16px;
		background: #3b6ec1;
		border-radius: 50%;
		cursor: pointer;
	}

	.range-slider::-moz-range-thumb {
		width: 16px;
		height: 16px;
		background: #3b6ec1;
		border-radius: 50%;
		cursor: pointer;
		border: none;
	}

	@media (max-width: 768px) {
		canvas {
			width: 100% !important;
			height: auto !important;
		}
	}
</style>
