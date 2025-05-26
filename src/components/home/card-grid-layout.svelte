<script lang="ts">
	export let children;
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-10">
	{@render children()}
</div>
