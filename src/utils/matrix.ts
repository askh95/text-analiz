// src/utils/matrix.ts
import { TextMatrix } from "../types";

export const createTextMatrix = (text: string): TextMatrix => {
	const chars = text.split("");
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

// src/utils/frequency.ts
import { FrequencyAnalysis } from "../types";

export const calculateFrequencies = (text: string): FrequencyAnalysis => {
	const frequencies: FrequencyAnalysis = {};
	const total = text.length;

	// Подсчет символов
	for (const char of text) {
		if (!frequencies[char]) {
			frequencies[char] = { count: 0, probability: 0, information: 0 };
		}
		frequencies[char].count++;
	}

	// Расчет вероятностей и информации
	Object.keys(frequencies).forEach((char) => {
		const probability = frequencies[char].count / total;
		frequencies[char].probability = probability;
		frequencies[char].information = Math.log2(1 / probability);
	});

	return frequencies;
};

// src/utils/spectrum.ts
import { SpectralPoint } from "../types";

export const calculateSpectrum = (sequence: number[]): SpectralPoint[] => {
	return sequence.map((value, index) => ({
		index,
		value: Math.abs(value),
	}));
};
