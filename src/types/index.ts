// src/types/index.ts

// Типы для анализа частот
export interface FrequencyData {
	count: number;
	probability: number;
	information: number;
}

export interface FrequencyAnalysis {
	[char: string]: FrequencyData;
}

// Типы для матриц
export type TextMatrix = string[][];
export type InformationMatrix = number[][];

// Типы для спектрального анализа
export interface SpectralPoint {
	index: number;
	value: number;
}

export interface SpectrumData {
	rowSpectrum: SpectralPoint[];
	columnSpectrum: SpectralPoint[];
}

// Общий тип результатов анализа
export interface AnalysisResults {
	textMatrix: TextMatrix;
	informationMatrix: InformationMatrix;
	frequencyData: FrequencyAnalysis;
	spectrumData: SpectrumData;
}
