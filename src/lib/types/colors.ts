export const colorClasses = {
	green: 'bg-green',
	purple: 'bg-purple text-white',
	red: 'bg-red',
	yellow: 'bg-yellow text-background',
	blue: 'bg-blue text-white',
	gray: 'bg-gray/40',
	brown: 'bg-brown',
	pink: 'bg-pink text-white',
	default: 'bg-blue2 text-white',
	orange: 'bg-orange'
};

export type Color = keyof typeof colorClasses;
