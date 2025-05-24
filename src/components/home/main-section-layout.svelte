<script lang="ts">
	let { title, children } = $props();
</script>

<div class="flex flex-col gap-2 w-full col-span-3 md:col-span-2">
	<h2 class="text-xl font-semibold">{title}</h2>
	{@render children()}
</div>
