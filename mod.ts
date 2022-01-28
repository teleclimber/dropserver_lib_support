// Notice: This set of interfaces is used internally by Dropserver.
// There is no need to use them unless you are writing an alternative 
// to the dropserver_app library.

import type {ServerRequest} from "https://deno.land/std@0.106.0/http/server.ts";

// migrations:
export type migrationFunction = () => Promise<void>;

export type Migration = {
	direction: "up"|"down",
	schema: number,
	func: migrationFunction
}

export type GetMigrationsCallback = (() => Migration[])|(()=>Promise<Migration[]>)|undefined

interface migrations {
	setCallback(cb:GetMigrationsCallback) :void
}

// user stuff:
export type User = {
	proxyId: string,
	displayName: string,
	avatar: string
}

interface users {
	get(proxyId: string) :Promise<User>
	getAll() :Promise<User[]>
}

// Routes stuff:

export interface Context {
	req: ServerRequest
	params: Record<string, unknown>
	url: URL
	proxyId: string | null
}

export type Handler = (ctx:Context) => void;

export enum AuthAllow {
	authorized = "authorized",
	public = "public"
}

export type Auth = {
	allow: AuthAllow,
	permission?: string
}

export type Path = {
	path: string,
	end: boolean
}

export enum RouteType {
	function = "function",
	static = "static"
}

interface routeBase {
	method: string,
	path: Path,
	auth: Auth,
}
export interface sandboxRoute extends routeBase {
	type: RouteType.function,
	handler: Handler
}

export type staticOpts = {
	path: string
}

export interface staticRoute extends routeBase {
	type: RouteType.static,
	opts: staticOpts
}

export type appRoute = sandboxRoute|staticRoute;

export type GetAppRoutesCallback = () => appRoute[];

interface appRoutes {
	setCallback(cb:GetAppRoutesCallback) :void
}

export default interface libSupport {
	appPath:string,
	appspacePath:string,
	avatarsPath:string,

	migrations: migrations,
	users: users,
	appRoutes: appRoutes
}