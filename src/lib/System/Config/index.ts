import { IronConfig } from "./types";

export class Config {
	private static instance: Config;
	private constructor() {}
	static getInstance(): Config {
		if (this.instance === undefined) this.instance = new Config();
		return this.instance;
	}

	UpdateSettings(config: IronConfig) {
		this.UpdatesPerSecond = config.UpdatesPerSecond;
	}

	UpdatesPerSecond = 20;
}
