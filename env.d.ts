/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_HOST: string;
	readonly VITE_PORT: number;
	readonly VITE_SERVER_HOST: string;
	readonly VITE_SERVER_PORT: number;
	readonly VITE_SOCKET_HOST: string;
	readonly VITE_SOCKET_PORT: number;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
