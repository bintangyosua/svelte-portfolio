<script lang="ts">
	import { colorClasses, type Color } from '$lib/types/colors';

	export let children;
	export let color: Color;
</script>

<span class={`${colorClasses[color]} px-2 py-1 rounded-lg font-extrabold w-fit`}
	>{@render children()}</span
>
