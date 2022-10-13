// Notice: This set of interfaces is used internally by Dropserver.
// There is no need to use them unless you are writing an alternative 
// to the dropserver_app library.

// Migrations:
// App code creates migrations.
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

// Users:

export type User = {
	proxyId: string,
	displayName: string,
	avatar: string
}

interface users {
	get(proxyId: string) :Promise<User>
	getAll() :Promise<User[]>
}

// App Routes:
// App code creates app routes

export interface Context {
	req: Deno.RequestEvent
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

interface RouteBase {
	method: string,
	path: Path,
	auth: Auth,
}
export interface SandboxRoute extends RouteBase {
	type: RouteType.function,
	handler: Handler,
	handlerName: string
}

export type StaticOpts = {
	path: string
}

export interface StaticRoute extends RouteBase {
	type: RouteType.static,
	opts: StaticOpts
}

export type AppRoute = SandboxRoute|StaticRoute;

export type GetAppRoutesCallback = () => AppRoute[];

interface AppRoutesIface {
	setCallback(cb:GetAppRoutesCallback) :void
}

// libSupport interface is implemented by sandbox runner
// and used by app code to connect the app code to the runner.
export default interface libSupport {
	appPath:string,
	appspacePath:string,
	avatarsPath:string,

	migrations: migrations,
	users: users,
	appRoutes: AppRoutesIface
}