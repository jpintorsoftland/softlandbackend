// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiURL: "http://softlandcloudbackendcert.azurewebsites.net/api/",
  urlAdmins: "admin/administradores",
  urlAdminsFilter: "admin/administradores_rol",
  urlApps: "aplicaciones",
  urlClients: "clientes",
  urlClientsFilter: "clientes/admin",
  urlCompanies: "empresas",
  urlCompaniesFilter: "empresas/admin",
  urlInstances: "instancias",
  urlInstancesFilter: "instancias/admin",
  urlLicenses: "licencias",
  urlLicensesFilter: "licencias/admin",
  urlLogin: "admin/login",
  urlModules: "modulos",
  urlPermissions: "tipos_permisos",
  urlProjects: "proyectos",
  urlRoles: "admin/roles",
  urlUsers: "usuarios",
  urlUsersFilter: "usuarios/admin",
  urlUsersAsigned: "admin/administradores_clientes"
};
