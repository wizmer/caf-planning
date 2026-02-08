export const grades = [
	'4c',
	'4c+',
	'5a',
	'5a+',
	'5b',
	'5b+',
	'5c',
	'5c+',
	'6a',
	'6a+',
	'6b',
	'6b+',
	'6c',
	'6c+',
	'7a',
	'7a+',
	'7b',
	'7b+',
	'7c',
	'7c+',
	'8a',
	'8a+',
	'8b',
	'8b+',
	'8c',
	'8c+',
	'9a'
];

export const gradeOptions = grades.map((grade, index) => ({ label: grade, value: index }));
export const gradeToIndex = (grade: string) => grades.indexOf(grade);

export const maxGradeIndex = grades.length - 1;
