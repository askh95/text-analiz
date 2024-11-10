export interface FrequencyData {
	count: number;
	probability: number;
	information: number;
}

export interface FrequencyAnalysis {
	[char: string]: FrequencyData;
}

export type TextMatrix = string[][];

export type InformationMatrix = number[][];

export interface SpectralPoint {
	index: number;
	value: number;
}

export interface SpectrumData {
	rowSpectrum: SpectralPoint[];
	columnSpectrum: SpectralPoint[];
}

export interface MatrixDimensions {
	rows: number;
	cols: number;
}

export interface AnalysisResults {
	textMatrix: TextMatrix;
	informationMatrix: InformationMatrix;
	frequencyData: FrequencyAnalysis;
	spectrumData: SpectrumData;
	dimensions?: MatrixDimensions; // Заменяем matrixSize на dimensions
}
