export const colorClasses = {
	green: 'bg-green',
	purple: 'bg-purple',
	red: 'bg-red',
	yellow: 'bg-yellow text-background',
	blue: 'bg-blue text-white',
	gray: 'bg-gray/40',
	brown: 'bg-brown',
	pink: 'bg-pink text-background',
	default: 'bg-background',
	orange: 'bg-orange'
};

export type Color = keyof typeof colorClasses;
