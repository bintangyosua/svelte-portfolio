import type { ProjectType } from '$lib/types';

export const projects: ProjectType[] = [
	{
		name: 'Credit Risk Classification',
		start: 'May, 2024',
		end: 'June, 2024',
		details: [
			'Developed a machine learning model using Artificial Neural Network to classify loan approval status based on applicant data, resulting in 95% model accuracy with short training time.'
		],
		tags: [
			'Python',
			'Pandas',
			'Numpy',
			'Matplotlib',
			'Seaborn',
			'Scikit-learn',
			'tensorflow',
			'Optuna'
		]
	},
	{
		name: 'Kreasikita',
		start: 'May, 2024',
		end: 'June, 2024',
		details: [
			'Developed a website for a startup company using Next.js and Tailwind CSS, resulting in 100% client satisfaction and 100% user engagement.'
		],
		tags: ['Nextjs', 'Nestjs', 'Midtrans', 'Tailwindcss', 'Nginx', 'MySQL']
	}
];
