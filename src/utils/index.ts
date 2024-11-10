import { TextMatrix, FrequencyAnalysis, SpectralPoint } from "../types";

export const createTextMatrix = (
	text: string,
	rows?: number,
	cols?: number
): TextMatrix => {
	const formatText = (input: string): string => {
		let formatted = input
			.replace(/\s+/g, " ")
			.trim()
			.replace(/\s+([.,!?])/g, "$1");
		return formatted;
	};

	const formattedText = formatText(text);
	const chars = formattedText.split("");

	const sqrt = Math.ceil(Math.sqrt(chars.length));
	const finalRows = rows || sqrt;
	const finalCols = cols || sqrt;

	const matrix: string[][] = [];

	for (let i = 0; i < finalRows; i++) {
		const row: string[] = [];
		for (let j = 0; j < finalCols; j++) {
			const index = i * finalCols + j;
			row.push(index < chars.length ? chars[index] : " ");
		}
		matrix.push(row);
	}

	return matrix;
};

export const calculateFrequencies = (matrix: TextMatrix): FrequencyAnalysis => {
	const frequencies: FrequencyAnalysis = {};
	let total = 0;

	for (const row of matrix) {
		for (const char of row) {
			if (!frequencies[char]) {
				frequencies[char] = { count: 0, probability: 0, information: 0 };
			}
			frequencies[char].count++;
			total++;
		}
	}

	Object.keys(frequencies).forEach((char) => {
		const probability = frequencies[char].count / total;
		frequencies[char].probability = probability;
		frequencies[char].information = Math.log2(1 / probability);
	});

	return frequencies;
};

const calculateSequenceInformation = (
	sequence: string[],
	frequencies: FrequencyAnalysis
): number => {
	return sequence.reduce((sum, char) => {
		return sum + (frequencies[char]?.information || 0);
	}, 0);
};

export const calculateRowSpectrum = (
	matrix: TextMatrix,
	frequencies: FrequencyAnalysis
): SpectralPoint[] => {
	return matrix.map((row, index) => ({
		index,
		value: calculateSequenceInformation(row, frequencies),
	}));
};

export const calculateColumnSpectrum = (
	matrix: TextMatrix,
	frequencies: FrequencyAnalysis
): SpectralPoint[] => {
	const cols = matrix[0].length;
	const spectrum: SpectralPoint[] = [];

	for (let j = 0; j < cols; j++) {
		const column = matrix.map((row) => row[j]);
		spectrum.push({
			index: j,
			value: calculateSequenceInformation(column, frequencies),
		});
	}

	return spectrum;
};

export const normalizeSpectrum = (
	spectrum: SpectralPoint[]
): SpectralPoint[] => {
	const maxValue = Math.max(...spectrum.map((point) => point.value));
	return spectrum.map((point) => ({
		index: point.index,
		value: point.value / maxValue,
	}));
};
