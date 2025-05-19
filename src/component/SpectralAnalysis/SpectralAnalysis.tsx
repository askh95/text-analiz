import { Box } from "@mui/material";

import SpectralGraphs from "./Spectral/SpectralGraphs";
import { Enhanced3DVisualization } from "./Spectral/Spectral3DVisualization";

import { FrequencyAnalysis, SpectrumData } from "../../types";

interface SpectralAnalysisProps {
	data: SpectrumData;
	frequencies: FrequencyAnalysis;
}
export const SpectralAnalysis = ({
	data,
	frequencies,
}: SpectralAnalysisProps) => {
	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
			<Box
				sx={{
					display: "flex w-full",
					gap: 1,
					border: "3px solid blue",
					borderRadius: 1,
					p: 2,
				}}
			>
				<SpectralGraphs data={data} frequencies={frequencies} />
			</Box>

			<Enhanced3DVisualization data={data} />
		</Box>
	);
};
