<script lang="ts"></script>
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let animationId: number;

	// Simulation modes
	type SimulationMode = 'wave-interference' | 'pendulum-chaos' | 'standing-waves' | 'fourier-transform';
	let currentMode: SimulationMode = 'wave-interference';

	// Common parameters
	let isRunning = false;
	let time = 0;

	// Wave Interference parameters
	let waveAmplitude = 30;
	let waveFrequency = 0.02;
	let waveSpeed = 2;
	let source1X = 150;
	let source1Y = 200;
	let source2X = 450;
	let source2Y = 200;

	// Pendulum parameters
	let pendulum1Length = 150;
	let pendulum2Length = 120;
	let pendulum1Angle = Math.PI / 2;
	let pendulum2Angle = Math.PI / 2;
	let pendulum1Velocity = 0;
	let pendulum2Velocity = 0;
	let gravity = 0.5;
	let dampening = 0.999;
	let trailPoints = [];

	// Standing Wave parameters
	let standingWaveAmplitude = 50;
	let standingWaveFrequency = 0.05;
	let harmonics = 3;

	// Fourier Transform parameters
	let fourierComponents = 5;
	let baseFrequency = 0.02;
	let fourierAmplitudes = [50, 25, 15, 10, 8];

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		resetSimulation();
		drawScene();
	});

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
		
		// Reset pendulum
		pendulum1Angle = Math.PI / 2;
		pendulum2Angle = Math.PI / 2;
		pendulum1Velocity = 0;
		pendulum2Velocity = 0;
		trailPoints = [];
		
		drawScene();
	}

	function changeMode(mode: SimulationMode) {
		currentMode = mode;
		resetSimulation();
	}

	function animate() {
		if (!isRunning) return;

		time += 0.05;

		if (currentMode === 'pendulum-chaos') {
			updatePendulum();
		}

		drawScene();
		animationId = requestAnimationFrame(animate);
	}

	function updatePendulum() {
		// Double pendulum physics
		const m1 = 1, m2 = 1; // masses
		const L1 = pendulum1Length / 100, L2 = pendulum2Length / 100; // lengths in meters
		const g = gravity;

		const θ1 = pendulum1Angle;
		const θ2 = pendulum2Angle;
		const ω1 = pendulum1Velocity;
		const ω2 = pendulum2Velocity;

		// Complex double pendulum equations
		const Δθ = θ2 - θ1;
		const den1 = (m1 + m2) * L1 - m2 * L1 * Math.cos(Δθ) * Math.cos(Δθ);
		const den2 = (L2 / L1) * den1;

		// First pendulum angular acceleration
		const num1 = -m2 * L1 * ω1 * ω1 * Math.sin(Δθ) * Math.cos(Δθ)
					+ m2 * g * Math.sin(θ2) * Math.cos(Δθ)
					+ m2 * L2 * ω2 * ω2 * Math.sin(Δθ)
					- (m1 + m2) * g * Math.sin(θ1);

		const α1 = num1 / den1;

		// Second pendulum angular acceleration
		const num2 = -m2 * L2 * ω2 * ω2 * Math.sin(Δθ) * Math.cos(Δθ)
					+ (m1 + m2) * g * Math.sin(θ1) * Math.cos(Δθ)
					- (m1 + m2) * L1 * ω1 * ω1 * Math.sin(Δθ)
					- (m1 + m2) * g * Math.sin(θ2);

		const α2 = num2 / den2;

		// Update velocities and angles
		pendulum1Velocity += α1 * 0.1;
		pendulum2Velocity += α2 * 0.1;
		pendulum1Velocity *= dampening;
		pendulum2Velocity *= dampening;
		pendulum1Angle += pendulum1Velocity * 0.1;
		pendulum2Angle += pendulum2Velocity * 0.1;

		// Calculate second pendulum position for trail
		const x1 = 300 + pendulum1Length * Math.sin(pendulum1Angle);
		const y1 = 100 + pendulum1Length * Math.cos(pendulum1Angle);
		const x2 = x1 + pendulum2Length * Math.sin(pendulum2Angle);
		const y2 = y1 + pendulum2Length * Math.cos(pendulum2Angle);

		trailPoints.push({x: x2, y: y2});
		if (trailPoints.length > 500) {
			trailPoints.shift();
		}
	}

	function drawScene() {
		if (!ctx) return;

		// Clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		switch (currentMode) {
			case 'wave-interference':
				drawWaveInterference();
				break;
			case 'pendulum-chaos':
				drawPendulum();
				break;
			case 'standing-waves':
				drawStandingWaves();
				break;
			case 'fourier-transform':
				drawFourierTransform();
				break;
		}
	}

	function drawWaveInterference() {
		const gridSize = 8;
		const width = canvas.width;
		const height = canvas.height;

		for (let x = 0; x < width; x += gridSize) {
			for (let y = 0; y < height; y += gridSize) {
				// Distance from sources
				const dist1 = Math.sqrt((x - source1X) ** 2 + (y - source1Y) ** 2);
				const dist2 = Math.sqrt((x - source2X) ** 2 + (y - source2Y) ** 2);

				// Wave equations
				const wave1 = waveAmplitude * Math.sin(waveFrequency * dist1 - waveSpeed * time);
				const wave2 = waveAmplitude * Math.sin(waveFrequency * dist2 - waveSpeed * time);
				const interference = wave1 + wave2;

				// Color based on interference
				const intensity = Math.abs(interference) / (2 * waveAmplitude);
				const hue = interference > 0 ? 220 : 0; // Blue for positive, red for negative
				const alpha = Math.min(intensity, 1);

				ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${alpha * 0.8})`;
				ctx.fillRect(x, y, gridSize, gridSize);
			}
		}

		// Draw sources
		ctx.fillStyle = '#3b6ec1';
		ctx.beginPath();
		ctx.arc(source1X, source1Y, 8, 0, 2 * Math.PI);
		ctx.fill();

		ctx.fillStyle = '#ef4444';
		ctx.beginPath();
		ctx.arc(source2X, source2Y, 8, 0, 2 * Math.PI);
		ctx.fill();
	}

	function drawPendulum() {
		const pivotX = 300;
		const pivotY = 100;

		// Calculate positions
		const x1 = pivotX + pendulum1Length * Math.sin(pendulum1Angle);
		const y1 = pivotY + pendulum1Length * Math.cos(pendulum1Angle);
		const x2 = x1 + pendulum2Length * Math.sin(pendulum2Angle);
		const y2 = y1 + pendulum2Length * Math.cos(pendulum2Angle);

		// Draw trail
		if (trailPoints.length > 1) {
			for (let i = 1; i < trailPoints.length; i++) {
				const alpha = i / trailPoints.length;
				ctx.strokeStyle = `rgba(239, 68, 68, ${alpha * 0.8})`;
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(trailPoints[i-1].x, trailPoints[i-1].y);
				ctx.lineTo(trailPoints[i].x, trailPoints[i].y);
				ctx.stroke();
			}
		}

		// Draw rods
		ctx.strokeStyle = '#b2becd';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(pivotX, pivotY);
		ctx.lineTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();

		// Draw pivot
		ctx.fillStyle = '#284b63';
		ctx.beginPath();
		ctx.arc(pivotX, pivotY, 6, 0, 2 * Math.PI);
		ctx.fill();

		// Draw masses
		ctx.fillStyle = '#3b6ec1';
		ctx.beginPath();
		ctx.arc(x1, y1, 12, 0, 2 * Math.PI);
		ctx.fill();

		ctx.fillStyle = '#ef4444';
		ctx.beginPath();
		ctx.arc(x2, y2, 10, 0, 2 * Math.PI);
		ctx.fill();
	}

	function drawStandingWaves() {
		const width = canvas.width;
		const height = canvas.height;
		const centerY = height / 2;

		// Draw string
		ctx.strokeStyle = '#b2becd';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(0, centerY);
		ctx.lineTo(width, centerY);
		ctx.stroke();

		// Draw standing wave
		ctx.strokeStyle = '#3b6ec1';
		ctx.lineWidth = 3;
		ctx.beginPath();

		let firstPoint = true;
		for (let x = 0; x <= width; x += 2) {
			let amplitude = 0;
			
			// Sum of harmonics
			for (let n = 1; n <= harmonics; n++) {
				const waveNumber = (n * Math.PI) / width;
				const frequency = standingWaveFrequency * n;
				amplitude += (standingWaveAmplitude / n) * 
					Math.sin(waveNumber * x) * 
					Math.cos(frequency * time);
			}

			const y = centerY + amplitude;

			if (firstPoint) {
				ctx.moveTo(x, y);
				firstPoint = false;
			} else {
				ctx.lineTo(x, y);
			}
		}
		ctx.stroke();

		// Draw nodes
		for (let n = 1; n <= harmonics; n++) {
			for (let k = 1; k < n; k++) {
				const nodeX = (k * width) / n;
				ctx.fillStyle = '#ef4444';
				ctx.beginPath();
				ctx.arc(nodeX, centerY, 4, 0, 2 * Math.PI);
				ctx.fill();
			}
		}
	}

	function drawFourierTransform() {
		const width = canvas.width;
		const height = canvas.height;
		const centerY = height / 2;

		// Draw individual components (top half)
		const componentHeight = centerY / fourierComponents;
		
		for (let i = 0; i < fourierComponents; i++) {
			const y = i * componentHeight + 20;
			const amplitude = fourierAmplitudes[i] || 10;
			const frequency = baseFrequency * (i + 1);

			ctx.strokeStyle = `hsl(${i * 60}, 70%, 60%)`;
			ctx.lineWidth = 2;
			ctx.beginPath();

			let firstPoint = true;
			for (let x = 0; x <= width; x += 2) {
				const waveY = y + amplitude * Math.sin(frequency * x + time);
				
				if (firstPoint) {
					ctx.moveTo(x, waveY);
					firstPoint = false;
				} else {
					ctx.lineTo(x, waveY);
				}
			}
			ctx.stroke();
		}

		// Draw separator line
		ctx.strokeStyle = '#b2becd';
		ctx.lineWidth = 2;
		ctx.setLineDash([5, 5]);
		ctx.beginPath();
		ctx.moveTo(0, centerY);
		ctx.lineTo(width, centerY);
		ctx.stroke();
		ctx.setLineDash([]);

		// Draw composite wave (bottom half)
		ctx.strokeStyle = '#3b6ec1';
		ctx.lineWidth = 4;
		ctx.beginPath();

		let firstPoint = true;
		for (let x = 0; x <= width; x += 2) {
			let compositeY = centerY + 20;
			
			// Sum all components
			for (let i = 0; i < fourierComponents; i++) {
				const amplitude = fourierAmplitudes[i] || 10;
				const frequency = baseFrequency * (i + 1);
				compositeY += amplitude * Math.sin(frequency * x + time);
			}

			if (firstPoint) {
				ctx.moveTo(x, compositeY);
				firstPoint = false;
			} else {
				ctx.lineTo(x, compositeY);
			}
		}
		ctx.stroke();

		// Labels
		ctx.fillStyle = '#b2becd';
		ctx.font = '12px Arial';
		ctx.fillText('Individual Components', 10, 15);
		ctx.fillText('Composite Wave', 10, centerY + 15);
	}

	// Reactive updates
	$: if (!isRunning && ctx) {
		drawScene();
	}
</script>

<svelte:head>
	<title>Wave & Oscillation Simulation</title>
</svelte:head>

<div class="max-w-6xl mx-auto p-8 font-alegreya">
	<h1 class="text-3xl md:text-4xl text-center text-white mb-8 font-mochiy">
		WAVE & OSCILLATION SIMULATION
	</h1>

	<!-- Mode Selection -->
	<div class="flex flex-wrap justify-center gap-2 mb-6">
		<button
			on:click={() => changeMode('wave-interference')}
			class="px-4 py-2 rounded font-semibold transition-colors duration-200
				   {currentMode === 'wave-interference' ? 'bg-blue text-white' : 'bg-gray6 text-gray hover:bg-gray'}"
		>
			Wave Interference
		</button>
		<button
			on:click={() => changeMode('pendulum-chaos')}
			class="px-4 py-2 rounded font-semibold transition-colors duration-200
				   {currentMode === 'pendulum-chaos' ? 'bg-blue text-white' : 'bg-gray6 text-gray hover:bg-gray'}"
		>
			Pendulum Chaos
		</button>
		<button
			on:click={() => changeMode('standing-waves')}
			class="px-4 py-2 rounded font-semibold transition-colors duration-200
				   {currentMode === 'standing-waves' ? 'bg-blue text-white' : 'bg-gray6 text-gray hover:bg-gray'}"
		>
			Standing Waves
		</button>
		<button
			on:click={() => changeMode('fourier-transform')}
			class="px-4 py-2 rounded font-semibold transition-colors duration-200
				   {currentMode === 'fourier-transform' ? 'bg-blue text-white' : 'bg-gray6 text-gray hover:bg-gray'}"
		>
			Fourier Transform
		</button>
	</div>

	<!-- Parameters Panel -->
	<div class="bg-background/50 rounded-lg p-4 mb-6">
		{#if currentMode === 'wave-interference'}
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div>
					<label class="block text-gray mb-1">Wave Amplitude:</label>
					<input type="range" bind:value={waveAmplitude} min="10" max="50" step="1" 
						   class="w-full" disabled={isRunning} />
					<span class="text-sm text-gray">{waveAmplitude}</span>
				</div>
				<div>
					<label class="block text-gray mb-1">Frequency:</label>
					<input type="range" bind:value={waveFrequency} min="0.01" max="0.05" step="0.001" 
						   class="w-full" disabled={isRunning} />
					<span class="text-sm text-gray">{waveFrequency.toFixed(3)}</span>
				</div>
				<div>
					<label class="block text-gray mb-1">Wave Speed:</label>
					<input type="range" bind:value={waveSpeed} min="0.5" max="5" step="0.1" 
						   class="w-full" disabled={isRunning} />
					<span class="text-sm text-gray">{waveSpeed}</span>
				</div>
			</div>
		{:else if currentMode === 'pendulum-chaos'}
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div>
					<label class="block text-gray mb-1">Pendulum 1 Length:</label>
					<input type="range" bind:value={pendulum1Length} min="50" max="200" step="5" 
						   class="w-full" disabled={isRunning} />
					<span class="text-sm text-gray">{pendulum1Length}px</span>
				</div>
				<div>
					<label class="block text-gray mb-1">Pendulum 2 Length:</label>
					<input type="range" bind:value={pendulum2Length} min="50" max="200" step="5" 
						   class="w-full" disabled={isRunning} />
					<span class="text-sm text-gray">{pendulum2Length}px</span>
				</div>
				<div>
					<label class="block text-gray mb-1">Gravity:</label>
					<input type="range" bind:value={gravity} min="0.1" max="1" step="0.1" 
						   class="w-full" disabled={isRunning} />
					<span class="text-sm text-gray">{gravity}</span>
				</div>
			</div>
		{:else if currentMode === 'standing-waves'}
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div>
					<label class="block text-gray mb-1">Amplitude:</label>
					<input type="range" bind:value={standingWaveAmplitude} min="20" max="80" step="5" 
						   class="w-full" disabled={isRunning} />
					<span class="text-sm text-gray">{standingWaveAmplitude}</span>
				</div>
				<div>
					<label class="block text-gray mb-1">Frequency:</label>
					<input type="range" bind:value={standingWaveFrequency} min="0.01" max="0.1" step="0.01" 
						   class="w-full" disabled={isRunning} />
					<span class="text-sm text-gray">{standingWaveFrequency.toFixed(2)}</span>
				</div>
				<div>
					<label class="block text-gray mb-1">Harmonics:</label>
					<input type="range" bind:value={harmonics} min="1" max="6" step="1" 
						   class="w-full" disabled={isRunning} />
					<span class="text-sm text-gray">{harmonics}</span>
				</div>
			</div>
		{:else if currentMode === 'fourier-transform'}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label class="block text-gray mb-1">Components:</label>
					<input type="range" bind:value={fourierComponents} min="2" max="8" step="1" 
						   class="w-full" disabled={isRunning} />
					<span class="text-sm text-gray">{fourierComponents}</span>
				</div>
				<div>
					<label class="block text-gray mb-1">Base Frequency:</label>
					<input type="range" bind:value={baseFrequency} min="0.01" max="0.05" step="0.001" 
						   class="w-full" disabled={isRunning} />
					<span class="text-sm text-gray">{baseFrequency.toFixed(3)}</span>
				</div>
			</div>
		{/if}
	</div>

	<!-- Control Buttons -->
	<div class="flex justify-center gap-4 mb-6">
		<button
			on:click={startSimulation}
			disabled={isRunning}
			class="px-6 py-2 rounded font-semibold transition-colors duration-200
				   disabled:bg-gray disabled:text-gray6 disabled:cursor-not-allowed
				   enabled:bg-blue enabled:text-white enabled:hover:bg-blue/80"
		>
			Start Simulation
		</button>
		<button
			on:click={stopSimulation}
			disabled={!isRunning}
			class="px-6 py-2 rounded font-semibold transition-colors duration-200
				   disabled:bg-gray disabled:text-gray6 disabled:cursor-not-allowed
				   enabled:bg-red enabled:text-white enabled:hover:bg-red/80"
		>
			Stop
		</button>
		<button
			on:click={resetSimulation}
			class="px-6 py-2 rounded font-semibold transition-colors duration-200
				   bg-orange text-white hover:bg-orange/80"
		>
			Reset
		</button>
	</div>

	<!-- Status Display -->
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
		<div class="text-center">
			<strong class="text-white">Status:</strong>
			<span class="text-gray ml-2">{isRunning ? 'Running' : 'Stopped'}</span>
		</div>
		<div class="text-center">
			<strong class="text-white">Mode:</strong>
			<span class="text-blue ml-2 capitalize">{currentMode.replace('-', ' ')}</span>
		</div>
		<div class="text-center">
			<strong class="text-white">Time:</strong>
			<span class="text-green ml-2">{time.toFixed(1)}s</span>
		</div>
	</div>

	<!-- Canvas -->
	<canvas
		bind:this={canvas}
		width="800"
		height="400"
		class="w-full max-w-[800px] h-[400px] rounded-lg block mx-auto bg-transparent border border-gray/30"
	></canvas>

	<!-- Mode Descriptions -->
	<div class="mt-6 bg-background/30 rounded-lg p-4">
		{#if currentMode === 'wave-interference'}
			<h3 class="text-lg font-semibold text-white mb-2">Wave Interference</h3>
			<p class="text-gray">
				Two wave sources (blue and red dots) create circular waves that interfere with each other. 
				Bright areas show constructive interference (waves adding up), while dark areas show destructive interference (waves canceling out).
			</p>
		{:else if currentMode === 'pendulum-chaos'}
			<h3 class="text-lg font-semibold text-white mb-2">Double Pendulum Chaos</h3>
			<p class="text-gray">
				A double pendulum demonstrates chaos theory - small changes in initial conditions lead to dramatically different outcomes. 
				The red trail shows the path of the second pendulum, creating beautiful chaotic patterns.
			</p>
		{:else if currentMode === 'standing-waves'}
			<h3 class="text-lg font-semibold text-white mb-2">Standing Waves</h3>
			<p class="text-gray">
				Standing waves form when waves reflect and interfere with themselves. Red dots mark the nodes (points that never move), 
				while the blue wave shows the sum of multiple harmonics creating complex wave patterns.
			</p>
		{:else if currentMode === 'fourier-transform'}
			<h3 class="text-lg font-semibold text-white mb-2">Fourier Transform Visualization</h3>
			<p class="text-gray">
				Any complex wave can be decomposed into simple sine waves of different frequencies and amplitudes. 
				The top shows individual components, the bottom shows their sum - demonstrating how complex signals are built from simple parts.
			</p>
		{/if}
	</div>
</div>

<style>
	/* Custom range slider styling */
	input[type="range"] {
		@apply appearance-none bg-gray6 rounded-full h-2;
	}
	
	input[type="range"]::-webkit-slider-thumb {
		@apply appearance-none w-4 h-4 bg-blue rounded-full cursor-pointer;
	}
	
	input[type="range"]::-moz-range-thumb {
		@apply w-4 h-4 bg-blue rounded-full cursor-pointer border-0;
	}

	@media (max-width: 768px) {
		canvas {
			width: 100% !important;
			height: auto !important;
		}
	}
</style>
