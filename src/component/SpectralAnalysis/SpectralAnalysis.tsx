import { Box } from "@mui/material";

import { SpectralGraphs } from "./Spectral/SpectralGraphs";
import { Enhanced3DVisualization } from "./Spectral/Spectral3DVisualization";
import { CorrelationAnalysis } from "./Spectral/CorrelationAnalysis";

import { SpectrumData } from "../../types";

interface SpectralAnalysisProps {
	data: SpectrumData;
}

export const SpectralAnalysis = ({ data }: SpectralAnalysisProps) => {
	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
			<SpectralGraphs data={data} />
			<Enhanced3DVisualization data={data} />
			<CorrelationAnalysis data={data} />
		</Box>
	);
};
