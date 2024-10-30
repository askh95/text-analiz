import { TextMatrix, FrequencyAnalysis, SpectralPoint } from "../types";

export const createTextMatrix = (text: string): TextMatrix => {
	const formatText = (input: string): string => {
		let formatted = input
			.replace(/\s+/g, " ")
			.trim()
			.replace(/\s+([.,!?])/g, "$1");

		return formatted;
	};

	const formattedText = formatText(text);
	const chars = formattedText.split("");
	const size = Math.ceil(Math.sqrt(chars.length));
	const matrix: string[][] = [];

	for (let i = 0; i < size; i++) {
		const row: string[] = [];
		for (let j = 0; j < size; j++) {
			const index = i * size + j;
			row.push(index < chars.length ? chars[index] : " ");
		}
		matrix.push(row);
	}

	return matrix;
};

export const calculateFrequencies = (text: string): FrequencyAnalysis => {
	const frequencies: FrequencyAnalysis = {};
	const total = text.length;

	for (const char of text) {
		if (!frequencies[char]) {
			frequencies[char] = { count: 0, probability: 0, information: 0 };
		}
		frequencies[char].count++;
	}
	Object.keys(frequencies).forEach((char) => {
		const probability = frequencies[char].count / total;
		frequencies[char].probability = probability;
		frequencies[char].information = Math.log2(1 / probability);
	});

	return frequencies;
};

export const calculateSpectrum = (sequence: number[]): SpectralPoint[] => {
	return sequence.map((value, index) => ({
		index,
		value: Math.abs(value),
	}));
};
