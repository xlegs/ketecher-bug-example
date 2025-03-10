

// Ketcher imports
import "ketcher-react/dist/index.css";

import { ButtonsConfig, Editor } from "ketcher-react";
import { Ketcher, OperationType } from "ketcher-core";
import { KetcherAPI } from "./ketcherAPI";

import { StandaloneStructServiceProvider } from "ketcher-standalone";

const KetcherEditor = () => {

	const structServiceProvider = new StandaloneStructServiceProvider();


	const _saveMolecule = async () => {
		const molData = await (global as any).KetcherFunctions.exportCtab()
		console.log(molData)
	}

	const clearSketcher = () => {
		ketcher.editor.clear();

	};

	return (
		<div style={{ width: '500px', height: '500px', padding: "1rem 0 0 0" }}>
			<Editor
				staticResourcesUrl={process.env.PUBLIC_URL!}
				structServiceProvider={structServiceProvider}
				errorHandler={function (_message: string): void {
					throw new Error("Function not implemented: " + _message);
				}}
				onInit={(ketcherInstance: Ketcher) => {
					// Set instance ref
					(global as any).ketcher = ketcherInstance;
					// (global as any).ketcher.logging.enabled = true;
					// (global as any).ketcher.logging.showTrace = true;
					(global as any).KetcherFunctions = KetcherAPI((global as any).ketcher)

					ketcherInstance.editor.subscribe("change", async (data) => {
						console.log(data)
						// ketcher doesn't have a straightforward change event
						// data returns a list of all operations
						// Filter out ones we don't care about
						const ops = data.filter(
							(d) => d.operation !== OperationType.CANVAS_LOAD
						);

						// Only set molData when an actual change occurs
						if (ops.length === 0) {
							console.log("Canvas load: NOOP");
							return;
						}

					});
				}}
			/>

			<div className="d-flex">
				<button onClick={clearSketcher}>
					Reset sketcher
				</button>
				<button
					onClick={() => {
						_saveMolecule();
					}}
				>
					Save to molecule list
				</button>
			</div>

		</div>
	);
};

export default KetcherEditor;
