(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/sdk/src/config/api.config.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "applicationsApiUrl",
    ()=>applicationsApiUrl,
    "authApiUrl",
    ()=>authApiUrl,
    "bagsApiUrl",
    ()=>bagsApiUrl,
    "baseUrlByEnvironment",
    ()=>baseUrlByEnvironment,
    "billingApiUrl",
    ()=>billingApiUrl,
    "bulkcreationApiUrl",
    ()=>bulkcreationApiUrl,
    "cronJobsApiUrl",
    ()=>cronJobsApiUrl,
    "functionsApiUrl",
    ()=>functionsApiUrl,
    "grantsApiUrl",
    ()=>grantsApiUrl,
    "groupsApiUrl",
    ()=>groupsApiUrl,
    "invitationsApiUrl",
    ()=>invitationsApiUrl,
    "masterTemplatesApiUrl",
    ()=>masterTemplatesApiUrl,
    "masterdataApiUrl",
    ()=>masterdataApiUrl,
    "notificationsApiUrl",
    ()=>notificationsApiUrl,
    "outputConfigurationsApiUrl",
    ()=>outputConfigurationsApiUrl,
    "permissionsApiUrl",
    ()=>permissionsApiUrl,
    "pipelinesApiUrl",
    ()=>pipelinesApiUrl,
    "prodApiUrl",
    ()=>prodApiUrl,
    "requestTimeout",
    ()=>requestTimeout,
    "signatureRulesApiUrl",
    ()=>signatureRulesApiUrl,
    "subscribersApiUrl",
    ()=>subscribersApiUrl,
    "templatesApiUrl",
    ()=>templatesApiUrl,
    "tenantSettingsApiUrl",
    ()=>tenantSettingsApiUrl,
    "tenantsApiUrl",
    ()=>tenantsApiUrl,
    "tenantsV2ApiUrl",
    ()=>tenantsV2ApiUrl,
    "testApiUrl",
    ()=>testApiUrl,
    "textComponentsApiUrl",
    ()=>textComponentsApiUrl,
    "userinfoApiUrl",
    ()=>userinfoApiUrl,
    "workflowsApiUrl",
    ()=>workflowsApiUrl
]);
const requestTimeout = 10000;
const prodApiUrl = 'https://api.docugate.cloud';
const testApiUrl = 'https://api.docugatetest.cloud';
const permissionsApiUrl = 'v1/permissions';
const groupsApiUrl = 'v1/groups';
const grantsApiUrl = 'v1/grants';
const applicationsApiUrl = 'v2/applications';
const authApiUrl = 'v2/auth';
const billingApiUrl = 'v1/billing';
const userinfoApiUrl = 'v1/users';
const invitationsApiUrl = 'v1/invitations';
const bulkcreationApiUrl = 'v1/bulkdocumentcreation/jobs';
const workflowsApiUrl = 'v2/workflows';
const bagsApiUrl = 'v1/bags';
const templatesApiUrl = 'v2/templates';
const masterTemplatesApiUrl = 'v1/mastertemplates';
const masterdataApiUrl = 'v2/masterdata';
const functionsApiUrl = 'v2/functions';
const pipelinesApiUrl = 'v2/pipelines';
const outputConfigurationsApiUrl = 'v1/outputconfigurations';
const textComponentsApiUrl = 'v1/textcomponents';
const tenantsApiUrl = 'v1/tenants';
const tenantsV2ApiUrl = 'v2/tenants';
const tenantSettingsApiUrl = 'v1/tenantsettings';
const notificationsApiUrl = 'v2/notifications';
const signatureRulesApiUrl = 'v1/signaturerules';
const cronJobsApiUrl = 'v1/cronjobs';
const subscribersApiUrl = 'v2/subscribers';
const baseUrlByEnvironment = {
    dev: testApiUrl,
    test: testApiUrl,
    prod: prodApiUrl
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/config/index.ts [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/config/api.config.ts [client] (ecmascript)");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/types/application.types.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/types/bag.types.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/types/billing.types.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/types/bulkcreation.types.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/types/cronjob.types.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CronJobTypes",
    ()=>CronJobTypes
]);
const CronJobTypes = {
    'entra-users': 'Entra Users',
    'entra-groups': 'Entra Groups',
    'sharepoint-data': 'Sharepoint Data'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/types/formfield.types.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/types/function.types.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * A paged result with multiple functions
 */ /**
 * Function instance
 */ /**
 * Unsaved function which can be post-ed to create a new Function
 */ /**
 * Updated function which can be put-ed to update a Function
 */ /**
 * The type of the function
 */ __turbopack_context__.s([
    "DocugateFunctionType",
    ()=>DocugateFunctionType
]);
let DocugateFunctionType = /*#__PURE__*/ function(DocugateFunctionType) {
    DocugateFunctionType["Query"] = "functions.docugate.ch/v1alpha1/types/query";
    DocugateFunctionType["Mapping"] = "functions.docugate.ch/v1alpha1/types/mapping";
    DocugateFunctionType["BuildTask"] = "functions.docugate.ch/v1alpha1/types/buildtask";
    return DocugateFunctionType;
}({}); /**
 * Key-value mapping for field-based filtering
 */  /**
 * Response from invoking a function with filters
 */  /**
 * A wrapper for paged interfaces specific for masterdata section
 */  /**
 * A paged result with multiple function resources
 */  /**
 * Metadata of function resource
 */ 
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/types/invitation.types.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/types/request.types.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/types/superadmin.types.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/types/template.types.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * A paged result with multiple templates
 */ /**
 * A mapping function of a template
 */ /**
 * A single resource of a template
 */ /**
 * A local template resource which contains the newly-attribute
 */ /**
 * Compact form of template metadata
 */ /**
 * Single template structure
 */ /**
 * Single FormFields structure
 */ /**
 * Metadata of a template
 */ /**
 * A single Text component which is assigned to a Template
 */ /**
 * A rule of a Text component
 */ /**
 * Environment of a template
 */ /**
 * Environment key of a template
 */ __turbopack_context__.s([
    "CompilerTasksForEnvironment",
    ()=>CompilerTasksForEnvironment,
    "ExcelCompilerTasks",
    ()=>ExcelCompilerTasks,
    "Fields",
    ()=>Fields,
    "PowerPointCompilerTasks",
    ()=>PowerPointCompilerTasks,
    "TemplateEnvironmentKey",
    ()=>TemplateEnvironmentKey,
    "TemplateGrants",
    ()=>TemplateGrants,
    "VisioCompilerTasks",
    ()=>VisioCompilerTasks,
    "WordCompilerTasks",
    ()=>WordCompilerTasks
]);
let TemplateEnvironmentKey = /*#__PURE__*/ function(TemplateEnvironmentKey) {
    TemplateEnvironmentKey["Word"] = "docugate.ch/environments/word/v1";
    TemplateEnvironmentKey["PowerPoint"] = "docugate.ch/environments/ppt/v1";
    TemplateEnvironmentKey["Excel"] = "docugate.ch/environments/excel/v1";
    TemplateEnvironmentKey["Visio"] = "docugate.ch/environments/visio/v1";
    TemplateEnvironmentKey["Pdf"] = "docugate.ch/environments/pdf/v1";
    TemplateEnvironmentKey["Latex"] = "docugate.ch/environments/tex/v1";
    TemplateEnvironmentKey["Typst"] = "docugate.ch/environments/typst/v1";
    return TemplateEnvironmentKey;
}({});
let TemplateGrants = /*#__PURE__*/ function(TemplateGrants) {
    TemplateGrants[TemplateGrants["NONE"] = 0] = "NONE";
    TemplateGrants[TemplateGrants["EXECUTE"] = 1] = "EXECUTE";
    TemplateGrants[TemplateGrants["VIEW"] = 2] = "VIEW";
    TemplateGrants[TemplateGrants["EDIT"] = 3] = "EDIT";
    TemplateGrants[TemplateGrants["EDIT_LABELS"] = 4] = "EDIT_LABELS";
    return TemplateGrants;
}({});
const WordCompilerTasks = {
    'Docugate.Compiler.Word.Build.DocPropertyInsertTask,Docugate.Compiler.Word': 'Insert Document Property',
    'Docugate.Compiler.Word.Build.DocPropertyRefreshTask,Docugate.Compiler.Word': 'Refresh Document Property',
    'Docugate.Compiler.Word.Build.TextComponentInsertTask,Docugate.Compiler.Word': 'Insert Text Component',
    'Docugate.Compiler.Word.Build.ImageReplaceTask,Docugate.Compiler.Word': 'Replace Image',
    'Docugate.Compiler.Word.Build.TableInsertTask,Docugate.Compiler.Word': 'Insert Table',
    'Docugate.Compiler.Word.Build.BulletListInsertTask,Docugate.Compiler.Word': 'Insert Bullet List',
    'Docugate.Compiler.Word.Build.FormFieldReplaceTask,Docugate.Compiler.Word': 'Replace Form Field',
    'Docugate.Compiler.Word.Build.PlaceholderReplaceTask,Docugate.Compiler.Word': 'Replace Placeholder',
    'Docugate.Compiler.Word.Build.DocumentSettingTask,Docugate.Compiler.Word': 'Document Setting',
    'Docugate.Compiler.Word.Build.CustomXmlPartInsertTask,Docugate.Compiler.Word': 'Insert Custom XML Part'
};
const PowerPointCompilerTasks = {
    'Docugate.Compiler.PowerPoint.Build.Tasks.DocPropertyInsertTask,Docugate.Compiler.PowerPoint': 'Insert Document Property',
    'Docugate.Compiler.PowerPoint.Build.Tasks.DocPropertyRefreshTask,Docugate.Compiler.PowerPoint': 'Refresh Document Property',
    'Docugate.Compiler.PowerPoint.Build.Tasks.TextComponentInsertTask,Docugate.Compiler.PowerPoint': 'Insert Text Component'
};
const ExcelCompilerTasks = {
    'Docugate.Compiler.Excel.Build.Tasks.DocPropertyInsertTask,Docugate.Compiler.Excel': 'Insert Document Property',
    'Docugate.Compiler.Excel.Build.Tasks.DocPropertyRefreshTask,Docugate.Compiler.Excel': 'Refresh Document Property'
};
const VisioCompilerTasks = {
    'Docugate.Compiler.Visio.Build.DocPropertyInsertTask,Docugate.Compiler.Visio': 'Insert Document Property',
    'Docugate.Compiler.Visio.Build.DocPropertyRefreshTask,Docugate.Compiler.Visio': 'Refresh Document Property'
};
const CompilerTasksForEnvironment = {
    [TemplateEnvironmentKey.Word]: WordCompilerTasks,
    [TemplateEnvironmentKey.PowerPoint]: PowerPointCompilerTasks,
    [TemplateEnvironmentKey.Excel]: ExcelCompilerTasks,
    [TemplateEnvironmentKey.Visio]: VisioCompilerTasks,
    [TemplateEnvironmentKey.Pdf]: undefined,
    [TemplateEnvironmentKey.Latex]: undefined,
    [TemplateEnvironmentKey.Typst]: undefined
};
let Fields = /*#__PURE__*/ function(Fields) {
    Fields["Array"] = "select";
    Fields["Boolean"] = "checkbox";
    Fields["Date"] = "datepicker";
    Fields["Datepicker"] = "datepicker-date";
    Fields["Input"] = "input";
    Fields["Complex"] = "complex";
    Fields["Select"] = "select-select";
    Fields["Textarea"] = "textarea";
    Fields["Checkbox"] = "checkbox-checkbox";
    Fields["Number"] = "number";
    return Fields;
}({}); /**
 * interface of template fields
 */  /**
 * interface for template fields components
 */ 
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/types/textcomponent.types.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AllowedTextComponentContentTypesForEnvironmentAndInsertMode",
    ()=>AllowedTextComponentContentTypesForEnvironmentAndInsertMode,
    "TextComponentContentTypesForEnvironment",
    ()=>TextComponentContentTypesForEnvironment,
    "TextComponentInsertionTypesForEnvironmentAndContentType",
    ()=>TextComponentInsertionTypesForEnvironmentAndContentType,
    "TextComponentInsertionTypesForTemplateEnvironment",
    ()=>TextComponentInsertionTypesForTemplateEnvironment
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/types/template.types.ts [client] (ecmascript)");
;
const TextComponentContentTypesForEnvironment = {
    [__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].Word]: [
        'text/markdown',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    [__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].PowerPoint]: [
        'text/markdown',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ],
    [__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].Excel]: [],
    [__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].Visio]: [],
    [__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].Pdf]: [],
    [__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].Latex]: [],
    [__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].Typst]: []
};
const TextComponentInsertionTypesForTemplateEnvironment = {
    [__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].Word]: [
        'StartOfDocument',
        'EndOfDocument',
        'Bookmark'
    ],
    [__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].PowerPoint]: [
        'StartOfDocument',
        'EndOfDocument',
        'Placeholder'
    ],
    [__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].Excel]: [],
    [__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].Visio]: [],
    [__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].Pdf]: [],
    [__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].Latex]: [],
    [__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].Typst]: []
};
const TextComponentInsertionTypesForEnvironmentAndContentType = {
    [__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].Word]: {
        ['text/markdown']: [
            'StartOfDocument',
            'EndOfDocument',
            'Bookmark'
        ],
        ['application/vnd.openxmlformats-officedocument.wordprocessingml.document']: [
            'StartOfDocument',
            'EndOfDocument',
            'Bookmark'
        ]
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].PowerPoint]: {
        ['text/markdown']: [
            'Placeholder'
        ],
        ['application/vnd.openxmlformats-officedocument.presentationml.presentation']: [
            'StartOfDocument',
            'EndOfDocument'
        ]
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].Excel]: {},
    [__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].Visio]: {},
    [__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].Pdf]: {},
    [__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].Latex]: {},
    [__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].Typst]: {}
};
const AllowedTextComponentContentTypesForEnvironmentAndInsertMode = {
    [__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].Word]: {
        ['StartOfDocument']: [
            'text/markdown',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ],
        ['EndOfDocument']: [
            'text/markdown',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ],
        ['Bookmark']: [
            'text/markdown',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].PowerPoint]: {
        ['StartOfDocument']: [
            'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ],
        ['EndOfDocument']: [
            'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ],
        ['Placeholder']: [
            'text/markdown'
        ]
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].Excel]: {},
    [__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].Visio]: {},
    [__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].Pdf]: {},
    [__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].Latex]: {},
    [__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].Typst]: {}
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/types/userinfo.types.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/types/workflow.types.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/types/masterdata.types.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usersIndexEmailFieldName",
    ()=>usersIndexEmailFieldName,
    "usersIndexName",
    ()=>usersIndexName
]);
const usersIndexName = 'users';
const usersIndexEmailFieldName = 'email'; /**
 * A state of a unit of an index
 */  /**
 * An index of a tenant
 */  /**
 * Unsaved index which can be sent to the api post endpoint
 */  /**
 * Updated index which can be sent to the api put endpoint
 */  /**
 * All available indices in a paged list
 */  /**
 * The structure of a master data form
 */  /**
 * All available master data form field types
 */  /**
 * The available options for a master data form field
 */  /**
 * All available records for an index in a paged list
 */  /**
 * Structure of a single record in an index
 */  /**
 * User data structure
 */ 
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/types/mastertemplate.types.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/types/outputconfig.type.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/types/permission.types.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/types/pipeline.types.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/types/versioning.types.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/types/common.types.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/types/signaturerules.types.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/types/index.ts [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$application$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/types/application.types.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$bag$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/types/bag.types.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$billing$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/types/billing.types.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$bulkcreation$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/types/bulkcreation.types.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$cronjob$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/types/cronjob.types.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$formfield$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/types/formfield.types.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$function$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/types/function.types.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$invitation$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/types/invitation.types.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$request$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/types/request.types.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$superadmin$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/types/superadmin.types.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/types/template.types.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$textcomponent$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/types/textcomponent.types.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$userinfo$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/types/userinfo.types.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$workflow$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/types/workflow.types.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$masterdata$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/types/masterdata.types.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$mastertemplate$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/types/mastertemplate.types.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$outputconfig$2e$type$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/types/outputconfig.type.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$permission$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/types/permission.types.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$pipeline$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/types/pipeline.types.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$versioning$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/types/versioning.types.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$common$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/types/common.types.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$signaturerules$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/types/signaturerules.types.ts [client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/requests/base.request.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authAxiosInstance",
    ()=>authAxiosInstance,
    "axiosInstance",
    ()=>axiosInstance,
    "getAccessTokenFromSessionStorage",
    ()=>getAccessTokenFromSessionStorage,
    "getRequestErrors",
    ()=>getRequestErrors,
    "setAccessTokenGetter",
    ()=>setAccessTokenGetter,
    "setBaseApiUrl",
    ()=>setBaseApiUrl,
    "setBaseApiUrlByEnvironment",
    ()=>setBaseApiUrlByEnvironment,
    "setStoreRequestErrors",
    ()=>setStoreRequestErrors,
    "storeRequestErrors",
    ()=>storeRequestErrors
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/node_modules/axios/lib/axios.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$node_modules$2f$axios$2d$retry$2f$dist$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/node_modules/axios-retry/dist/esm/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$https$2d$browserify$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/https-browserify/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/config/api.config.ts [client] (ecmascript)");
;
;
;
;
const setBaseApiUrlByEnvironment = (env)=>{
    setBaseApiUrl(__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["baseUrlByEnvironment"][env]);
};
const setBaseApiUrl = (url)=>{
    axiosInstance.defaults.baseURL = url;
    authAxiosInstance.defaults.baseURL = url;
};
let storeRequestErrorsEnabled = true;
const setStoreRequestErrors = (storeErrors)=>{
    storeRequestErrorsEnabled = storeErrors;
};
let getAccessToken = ()=>getAccessTokenFromSessionStorage();
const setAccessTokenGetter = (getter)=>{
    getAccessToken = getter;
};
const authAxiosInstance = __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].create();
const axiosInstance = __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].create({
    timeoutErrorMessage: 'Timed Out',
    timeout: __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["requestTimeout"],
    ...("TURBOPACK compile-time value", "object") === 'undefined' && {
        httpsAgent: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$https$2d$browserify$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Agent"]({
            rejectUnauthorized: true
        }) // reject non-ssl requests (only if running on server side)
    }
});
if (typeof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"] !== 'undefined' && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"]?.env?.NEXT_PUBLIC_GET_REQUEST_RETRY_COUNT) {
    const getRequestRetryCount = Number(("TURBOPACK compile-time value", "3"));
    if (getRequestRetryCount && getRequestRetryCount > 0) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$node_modules$2f$axios$2d$retry$2f$dist$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(axiosInstance, {
            retries: getRequestRetryCount,
            retryDelay: __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$node_modules$2f$axios$2d$retry$2f$dist$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].exponentialDelay,
            // for 3 retries: 1. 100ms, 2. 200ms, 3. 400ms
            retryCondition: (error)=>{
                const method = error.config?.method.toUpperCase();
                const status = error.response?.status;
                return method === 'GET' && (status === 404 || status === 500);
            }
        });
    }
}
axiosInstance.interceptors.request.use(async (request)=>{
    const accessToken = await getAccessToken();
    if (!accessToken) {
        // Abort every request which tries to authenticate but hasn't gotten
        // a valid bearer token from getAuthorizationToken()
        const controller = new AbortController();
        controller.abort();
        return {
            ...request,
            signal: controller.signal,
            headers: {
                ...request.headers,
                reason: 'Missing Access Token'
            }
        };
    }
    request.headers.Authorization = `Bearer ${accessToken}`;
    return request;
});
axiosInstance.interceptors.response.use((response)=>response, async (error)=>{
    const returnableError = {
        name: 'AxiosError',
        trace: error.response?.headers?.traceparent || '',
        path: error.config?.url,
        timestamp: Date.now(),
        message: "This error isn't known to the client",
        code: 'UNKNOWN_ERROR',
        errorCode: 'UnknownError'
    };
    const isCancelled = __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].isCancel(error);
    if (isCancelled) {
        returnableError.code = error.code;
        returnableError.message = error.message;
    } else if (!error?.response) {
        returnableError.code = error?.code || 'UNKNOWN_ERROR_OR_TIMED_OUT';
        returnableError.message = error?.message || 'Unknown error or timed out';
    } else if (typeof error.response === 'string') {
        returnableError.code = error.code || 'UNKNOWN_ERROR';
        returnableError.message = error.response;
    }
    if (error.response) {
        const response = error.response;
        returnableError.message = response.message || 'No error message';
        returnableError.code = response.status;
        if (error.response.data) {
            const errorResponse = error.response.data;
            returnableError.errorCode = errorResponse.errorCode;
            returnableError.message = errorResponse.message;
            returnableError.data = errorResponse.data;
        }
    }
    if (storeRequestErrorsEnabled) {
        // append the error to the localstorage
        storeRequestErrors(returnableError);
    }
    return Promise.reject(returnableError);
});
const getAccessTokenFromSessionStorage = async ()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const token = sessionStorage.getItem('access_token');
    if (!token || token === 'undefined') {
        await new Promise((f)=>setTimeout(f, 50));
        const updatedToken = sessionStorage.getItem('access_token');
        if (!updatedToken || updatedToken === 'undefined') {
            sessionStorage.setItem('access_token', 'undefined');
            return undefined;
        }
    }
    return sessionStorage.getItem('access_token');
};
const storeRequestErrors = (...errors)=>{
    const old = getRequestErrors();
    const all = [
        ...errors,
        ...old
    ].sort((a, b)=>b.timestamp - a.timestamp);
    localStorage.setItem('request_errors', JSON.stringify(all.slice(0, 5)));
};
const getRequestErrors = ()=>{
    return JSON.parse(localStorage.getItem('request_errors') || '[]');
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/utils/Logger.class.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Class providing integrated logging functions for a
 * better overview in the logs
 */ __turbopack_context__.s([
    "Logger",
    ()=>Logger
]);
class Logger {
    /**
   * Integrated logger
   * @param args output arguments
   */ static log(...args) {
        const prefix = '[%cLog%c]';
        console.log(prefix, 'color: #4287f5', 'color: initial', ...args);
    }
    /**
   * Integrated info logger
   * @param args output arguments
   */ static info(...args) {
        const prefix = '[%cInfo%c]';
        console.log(prefix, 'color: #4287f5', 'color: initial', ...args);
    }
    /**
   * Integrated warning logger
   * @param args output arguments
   */ static warn(...args) {
        const prefix = '[%cWarning%c]';
        console.log(prefix, 'color: #f5b942', 'color: initial', ...args);
    }
    /**
   * Integrated error logger
   * @param args output arguments
   */ static error(...args) {
        const prefix = '[%cError%c]';
        console.log(prefix, 'color: #f54242', 'color: initial', ...args);
    }
    /**
   * Integrated event logger
   * @param args output arguments
   */ static event(...args) {
        const prefix = '[%cEvent%c]';
        console.log(prefix, 'color: #c842f5', 'color: initial', ...args);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/requests/application.request.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getApplicationToken",
    ()=>getApplicationToken,
    "getApplications",
    ()=>getApplications
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/config/api.config.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/base.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/utils/Logger.class.ts [client] (ecmascript)");
;
;
;
const getApplications = async (skipTake = {}, searchTerm)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["applicationsApiUrl"]}`, {
            params: {
                search: searchTerm,
                ...skipTake
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get all created applications');
        throw e;
    }
};
const getApplicationToken = async (clientId, secret)=>{
    try {
        const formData = new FormData();
        formData.append('client_id', clientId);
        formData.append('client_secret', secret);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["authAxiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["authApiUrl"]}/connect/token`, formData);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get application token');
        throw e;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/requests/bag.request.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addBagEntry",
    ()=>addBagEntry,
    "createBag",
    ()=>createBag,
    "deleteBag",
    ()=>deleteBag,
    "deleteBagEntry",
    ()=>deleteBagEntry,
    "deleteBagEntryResource",
    ()=>deleteBagEntryResource,
    "getAllBags",
    ()=>getAllBags,
    "getBag",
    ()=>getBag,
    "getBagEntry",
    ()=>getBagEntry,
    "getBagEntryResource",
    ()=>getBagEntryResource,
    "getBagResults",
    ()=>getBagResults,
    "startBag",
    ()=>startBag,
    "updateBag",
    ()=>updateBag,
    "updateBagEntry",
    ()=>updateBagEntry,
    "updateBagEntryResources",
    ()=>updateBagEntryResources
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/config/api.config.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/base.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/utils/Logger.class.ts [client] (ecmascript)");
;
;
;
const getAllBags = async (skipTake = {}, searchTerm)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bagsApiUrl"]}`, {
            params: {
                search: searchTerm,
                ...skipTake
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get all bags');
        throw e;
    }
};
const getBag = async (bagId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bagsApiUrl"]}/${bagId}`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get bag');
        throw e;
    }
};
const createBag = async (bag)=>{
    try {
        const formData = new FormData();
        const bagJson = new Blob([
            JSON.stringify(bag)
        ], {
            type: 'application/json'
        });
        formData.append('bag.json', bagJson, 'bag.json');
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bagsApiUrl"], formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to create bag', e);
        throw e;
    }
};
const updateBag = async (bagId, bag)=>{
    try {
        const formData = new FormData();
        formData.append('bag.json', JSON.stringify(bag));
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bagsApiUrl"]}/${bagId}`, formData);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update bag');
        throw e;
    }
};
const deleteBag = async (bagId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bagsApiUrl"]}/${bagId}`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to delete bag');
        throw e;
    }
};
const startBag = async (bagId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bagsApiUrl"]}/${bagId}/start`, {});
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to start bag');
        throw e;
    }
};
const getBagResults = async (bagId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bagsApiUrl"]}/${bagId}/results`, {
            responseType: 'blob'
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get bag results');
        throw e;
    }
};
const addBagEntry = async (bagId, entry)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bagsApiUrl"]}/${bagId}/entries`, entry, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to add bag entry', e);
        throw e;
    }
};
const getBagEntry = async (bagId, entryId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bagsApiUrl"]}/${bagId}/entries/${entryId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get bag entry', e);
        throw e;
    }
};
const updateBagEntry = async (bagId, entryId, updateData)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bagsApiUrl"]}/${bagId}/entries/${entryId}`, updateData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update bag entry', e);
        throw e;
    }
};
const deleteBagEntry = async (bagId, entryId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bagsApiUrl"]}/${bagId}/entries/${entryId}`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to delete bag entry', e);
        throw e;
    }
};
const updateBagEntryResources = async (bagId, entryId, files)=>{
    try {
        const formData = new FormData();
        Array.from(files).forEach((file, index)=>{
            formData.append(file.name, file);
        });
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bagsApiUrl"]}/${bagId}/entries/${entryId}/resources`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update bag entry resources', e);
        throw e;
    }
};
const getBagEntryResource = async (bagId, entryId, resourceKey)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bagsApiUrl"]}/${bagId}/entries/${entryId}/resources/${encodeURIComponent(resourceKey)}`, {
            responseType: 'blob'
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get bag entry resource', e);
        throw e;
    }
};
const deleteBagEntryResource = async (bagId, entryId, resourceKey)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bagsApiUrl"]}/${bagId}/entries/${entryId}/resources/${encodeURIComponent(resourceKey)}`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to delete bag entry resource', e);
        throw e;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/requests/billing.request.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addSubscriptionAdmins",
    ()=>addSubscriptionAdmins,
    "addSubscriptionTenants",
    ()=>addSubscriptionTenants,
    "createSubscription",
    ()=>createSubscription,
    "deleteSubscription",
    ()=>deleteSubscription,
    "getBillingEvents",
    ()=>getBillingEvents,
    "getMySubscriptions",
    ()=>getMySubscriptions,
    "getTenantBillingReport",
    ()=>getTenantBillingReport,
    "getTimerangedBillingEvents",
    ()=>getTimerangedBillingEvents,
    "removeSubscriptionAdmins",
    ()=>removeSubscriptionAdmins,
    "removeSubscriptionTenants",
    ()=>removeSubscriptionTenants,
    "updateSubscriptionStatus",
    ()=>updateSubscriptionStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/config/api.config.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/base.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/utils/Logger.class.ts [client] (ecmascript)");
;
;
;
const createSubscription = async (subscription)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["billingApiUrl"]}`, subscription);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to create new subscription');
        throw e;
    }
};
const getMySubscriptions = async ()=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["billingApiUrl"]}/me`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error("Unable to get the logged in user's subscriptions");
        throw e;
    }
};
const deleteSubscription = async (subscriptionId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["billingApiUrl"]}/${subscriptionId}`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to delete subscription');
        throw e;
    }
};
const updateSubscriptionStatus = async (subscriptionId, status)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["billingApiUrl"]}/${subscriptionId}/status`, status);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update subscription status');
        throw e;
    }
};
const addSubscriptionAdmins = async (subscriptionId, admins)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["billingApiUrl"]}/${subscriptionId}/admins`, admins);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to add new admins to the subscription');
        throw e;
    }
};
const removeSubscriptionAdmins = async (subscriptionId, admins)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["billingApiUrl"]}/${subscriptionId}/admins`, {
            data: admins
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to remove admins from the subscription');
        throw e;
    }
};
const addSubscriptionTenants = async (subscriptionId, tenants)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["billingApiUrl"]}/${subscriptionId}/tenants`, tenants);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to add tenants to subscription');
        throw e;
    }
};
const removeSubscriptionTenants = async (subscriptionId, tenants)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["billingApiUrl"]}/${subscriptionId}/tenants`, {
            data: tenants
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to remove tenants from subscription');
        throw e;
    }
};
const getBillingEvents = async (article, skipTake = {})=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["billingApiUrl"]}/events`, {
            params: {
                article: article,
                ...skipTake
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get billing event info');
        throw e;
    }
};
const getTimerangedBillingEvents = async (start, end, article, action, skipTake)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["billingApiUrl"]}/events/timerange`, {
            params: {
                start: start,
                end: end,
                article: article,
                action: action,
                ...skipTake
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get time ranged billing event info');
        throw e;
    }
};
const getTenantBillingReport = async (start, end, article, action)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["billingApiUrl"]}/report`, {
            params: {
                'billing-period': start,
                'billing-period-end': end,
                article: article,
                action: action
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get time ranged billing report');
        throw e;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/requests/bulkcreation.request.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cancelBulkcreationJob",
    ()=>cancelBulkcreationJob,
    "createBulkcreation",
    ()=>createBulkcreation,
    "deleteBulkcreationJob",
    ()=>deleteBulkcreationJob,
    "deleteBulkcreationJobRecords",
    ()=>deleteBulkcreationJobRecords,
    "getBulkcreationJob",
    ()=>getBulkcreationJob,
    "getBulkcreationJobRecord",
    ()=>getBulkcreationJobRecord,
    "getBulkcreationJobRecords",
    ()=>getBulkcreationJobRecords,
    "getBulkcreationJobStatus",
    ()=>getBulkcreationJobStatus,
    "getBulkcreationJobs",
    ()=>getBulkcreationJobs,
    "getBulkcreationResultResources",
    ()=>getBulkcreationResultResources,
    "pauseBulkcreationJob",
    ()=>pauseBulkcreationJob,
    "publishBulkcreationJob",
    ()=>publishBulkcreationJob,
    "resetFailedBulkcreationJobRecords",
    ()=>resetFailedBulkcreationJobRecords,
    "resumeBulkcreationJob",
    ()=>resumeBulkcreationJob,
    "unPublishBulkcreationJob",
    ()=>unPublishBulkcreationJob,
    "updateBulkcreationJob",
    ()=>updateBulkcreationJob,
    "updateBulkcreationJobCsvFiles",
    ()=>updateBulkcreationJobCsvFiles,
    "updateBulkcreationJobRecords",
    ()=>updateBulkcreationJobRecords
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/base.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/config/api.config.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/utils/Logger.class.ts [client] (ecmascript)");
;
;
;
const getBulkcreationJobs = async (skipTake = {})=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bulkcreationApiUrl"]}/`, {
            params: {
                ...skipTake
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get Bulk creation jobs');
        throw e;
    }
};
const createBulkcreation = async (BulkcreationJob)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bulkcreationApiUrl"]}/`, BulkcreationJob);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to create Bulk creation job');
        throw e;
    }
};
const getBulkcreationJob = async (id)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bulkcreationApiUrl"]}/${id}`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get Bulk creation job');
        throw e;
    }
};
const updateBulkcreationJob = async (id, BulkcreationJob)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bulkcreationApiUrl"]}/${id}`, BulkcreationJob);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update Bulk creation job');
        throw e;
    }
};
const deleteBulkcreationJob = async (id)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bulkcreationApiUrl"]}/${id}`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to delete Bulk creation job');
        throw e;
    }
};
const publishBulkcreationJob = async (id)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bulkcreationApiUrl"]}/${id}/publish`, {});
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to publish Bulk creation job');
        throw e;
    }
};
const unPublishBulkcreationJob = async (id)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bulkcreationApiUrl"]}/${id}/unpublish`, {});
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to unpublish Bulk creation job');
        throw e;
    }
};
const pauseBulkcreationJob = async (id)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bulkcreationApiUrl"]}/${id}/pause`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to pause Bulk creation job');
        throw e;
    }
};
const resumeBulkcreationJob = async (id)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bulkcreationApiUrl"]}/${id}/resume`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to resume Bulk creation job');
        throw e;
    }
};
const cancelBulkcreationJob = async (id)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bulkcreationApiUrl"]}/${id}/cancel`, {});
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to cancel Bulk creation job');
        throw e;
    }
};
const getBulkcreationJobStatus = async (id)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bulkcreationApiUrl"]}/${id}/status`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get Bulk creation job status');
        throw e;
    }
};
const getBulkcreationJobRecords = async (id, skipTake)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bulkcreationApiUrl"]}/${id}/records`, {
            params: {
                ...skipTake
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get Bulk creation job records');
        throw e;
    }
};
const updateBulkcreationJobRecords = async (id, records)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bulkcreationApiUrl"]}/${id}/records`, records);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to import Bulk creation job records');
        throw e;
    }
};
const resetFailedBulkcreationJobRecords = async (id)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bulkcreationApiUrl"]}/${id}/resetfailures`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to reset failed records of Bulk creation job');
        throw e;
    }
};
const deleteBulkcreationJobRecords = async (id)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bulkcreationApiUrl"]}/${id}/records`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to delete Bulk creation job records');
        throw e;
    }
};
const updateBulkcreationJobCsvFiles = async (id, files)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bulkcreationApiUrl"]}/${id}/records/csv`, files);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update Bulk creation job CSV files');
        throw e;
    }
};
const getBulkcreationJobRecord = async (id, recordId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bulkcreationApiUrl"]}/${id}/records/${recordId}`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get Bulk creation job record');
        throw e;
    }
};
const getBulkcreationResultResources = async (id, page)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["bulkcreationApiUrl"]}/${id}/results.tar`, {
            responseType: 'blob',
            params: {
                page: page
            }
        });
        const totalFiles = parseInt(response.headers['compilationresults-totalcount'] || '0');
        const pageSize = parseInt(response.headers['compilationresults-pagesize'] || '0');
        const currentPage = parseInt(response.headers['compilationresults-page'] || '0');
        const totalPages = parseInt(response.headers['compilationresults-totalpage'] || '0');
        return {
            blob: response.data,
            metadata: {
                totalFiles: totalFiles,
                pageSize: pageSize,
                currentPage: currentPage,
                totalPages: totalPages
            }
        };
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get Bulk creation job result resources');
        throw e;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/requests/cronjob.request.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createCronJob",
    ()=>createCronJob,
    "deleteCronJob",
    ()=>deleteCronJob,
    "getAllCronJobs",
    ()=>getAllCronJobs,
    "getCronJob",
    ()=>getCronJob,
    "getCronJobExecutions",
    ()=>getCronJobExecutions,
    "resetCronJob",
    ()=>resetCronJob,
    "triggerCronJob",
    ()=>triggerCronJob,
    "updateCronJob",
    ()=>updateCronJob,
    "updateCronJobSecrets",
    ()=>updateCronJobSecrets
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/config/api.config.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/base.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/utils/Logger.class.ts [client] (ecmascript)");
;
;
;
const getAllCronJobs = async (skipTake = {}, searchTerm, labels)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["cronJobsApiUrl"]}`, {
            params: {
                search: searchTerm,
                labels,
                ...skipTake
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get all cron jobs');
        throw e;
    }
};
const getCronJob = async (cronJobId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["cronJobsApiUrl"]}/${cronJobId}`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get cron job');
        throw e;
    }
};
const createCronJob = async (cronJob)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["cronJobsApiUrl"], cronJob);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to create cron job', e);
        throw e;
    }
};
const updateCronJob = async (cronJobId, cronJob)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["cronJobsApiUrl"]}/${cronJobId}`, cronJob);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update cron job');
        throw e;
    }
};
const deleteCronJob = async (cronJobId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["cronJobsApiUrl"]}/${cronJobId}`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to delete cron job');
        throw e;
    }
};
const updateCronJobSecrets = async (cronJobId, entraClientSecret, docugateClientSecret)=>{
    try {
        const secrets = {
            entraClientSecret: entraClientSecret || undefined,
            docugateClientSecret: docugateClientSecret || undefined
        };
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["cronJobsApiUrl"]}/${cronJobId}/secrets`, secrets);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update cron job secrets');
        throw e;
    }
};
const getCronJobExecutions = async (cronJobId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["cronJobsApiUrl"]}/${cronJobId}/logs`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get cron job executions');
        throw e;
    }
};
const triggerCronJob = async (cronJobId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["cronJobsApiUrl"]}/${cronJobId}/trigger`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to trigger cron job');
        throw e;
    }
};
const resetCronJob = async (cronJobId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["cronJobsApiUrl"]}/${cronJobId}/reset`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to reset cron job');
        throw e;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/requests/function.request.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createFunction",
    ()=>createFunction,
    "deleteFunction",
    ()=>deleteFunction,
    "deleteFunctionResource",
    ()=>deleteFunctionResource,
    "getAllFunctionResources",
    ()=>getAllFunctionResources,
    "getAllFunctions",
    ()=>getAllFunctions,
    "getFunction",
    ()=>getFunction,
    "getFunctionResource",
    ()=>getFunctionResource,
    "getFunctionsByLabels",
    ()=>getFunctionsByLabels,
    "invokeFunctionWithFilters",
    ()=>invokeFunctionWithFilters,
    "invokeQueryFunction",
    ()=>invokeQueryFunction,
    "invokeQueryFunctionWithItem",
    ()=>invokeQueryFunctionWithItem,
    "updateFunction",
    ()=>updateFunction,
    "updateFunctionResource",
    ()=>updateFunctionResource,
    "upsertFunctionResources",
    ()=>upsertFunctionResources
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/config/api.config.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/base.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/utils/Logger.class.ts [client] (ecmascript)");
;
;
;
const getAllFunctions = async (skipTake = {})=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["functionsApiUrl"]}`, {
            params: skipTake
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get all functions');
        throw e;
    }
};
const createFunction = async (func)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["functionsApiUrl"]}`, func);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to create function');
        throw e;
    }
};
const getFunctionsByLabels = async (labels, skipTake = {})=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].options(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["functionsApiUrl"]}`, {
            data: labels,
            params: skipTake
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get functions by labels');
        throw e;
    }
};
const getFunction = async (functionId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["functionsApiUrl"]}/${functionId}`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get function');
        throw e;
    }
};
const updateFunction = async (functionId, updated)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["functionsApiUrl"]}/${functionId}`, updated);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update function');
        throw e;
    }
};
const deleteFunction = async (functionId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["functionsApiUrl"]}/${functionId}`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to delete function');
        throw e;
    }
};
const invokeQueryFunction = async (functionId, text, skipTake = {})=>{
    try {
        const params = {
            text,
            ...skipTake
        };
        if (!text) delete params.text;
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["functionsApiUrl"]}/${functionId}/invoke`, {
            params
        });
        return {
            items: response.data.results,
            key: response.data.key,
            page: {
                skip: response.data.skip,
                take: response.data.take,
                results: response.data.results.length,
                total: undefined
            }
        };
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to invoke query function');
        throw e;
    }
};
const invokeQueryFunctionWithItem = async (functionId, identifier)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["functionsApiUrl"]}/${functionId}/invoke/${identifier}`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to invoke query function with item');
        throw e;
    }
};
const getAllFunctionResources = async (skipTake = {}, searchTerm)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["functionsApiUrl"]}/resources`, {
            params: {
                search: searchTerm,
                ...skipTake
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get all function resources');
        throw e;
    }
};
const getFunctionResource = async (resourceKey)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["functionsApiUrl"]}/resources/${resourceKey}`, {
            responseType: 'blob'
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get function resource');
        throw e;
    }
};
const upsertFunctionResources = async (formData)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["functionsApiUrl"]}/resources`, formData);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to upsert function resources');
        throw e;
    }
};
const updateFunctionResource = async (resourceKey, content)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].patch(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["functionsApiUrl"]}/resources/${resourceKey}`, content);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update function resource');
        throw e;
    }
};
const deleteFunctionResource = async (resourceKey)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["functionsApiUrl"]}/resources/${resourceKey}`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to delete function resource');
        throw e;
    }
};
const invokeFunctionWithFilters = async (functionId, filters = {}, skipTake = {})=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["functionsApiUrl"]}/${functionId}/invoke/filter`, filters, {
            params: skipTake
        });
        return {
            items: response.data.results,
            page: {
                skip: response.data.skip,
                take: response.data.take,
                results: response.data.results.length,
                total: undefined
            }
        };
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to invoke function with filters');
        throw e;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/requests/identity.request.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "unassignSubscriber",
    ()=>unassignSubscriber
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/utils/Logger.class.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/base.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/config/api.config.ts [client] (ecmascript)");
;
;
;
const unassignSubscriber = async (subscriberId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["subscribersApiUrl"]}/${subscriberId}/assignment`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to unassign subscriber');
        throw e;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/requests/invitation.request.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createInvitation",
    ()=>createInvitation,
    "deleteInvitation",
    ()=>deleteInvitation,
    "getInvitations",
    ()=>getInvitations,
    "updateInvitation",
    ()=>updateInvitation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/base.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/config/api.config.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/utils/Logger.class.ts [client] (ecmascript)");
;
;
;
const getInvitations = async ()=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["invitationsApiUrl"]}`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get invitations');
        throw e;
    }
};
const createInvitation = async (invitation)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["invitationsApiUrl"]}`, invitation);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to create new invitation');
        throw e;
    }
};
const updateInvitation = async (invitationId, groups)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["invitationsApiUrl"]}/${invitationId}`, {
            groups
        });
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update invitation');
        throw e;
    }
};
const deleteInvitation = async (invitationId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["invitationsApiUrl"]}/${invitationId}`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to delete invitation');
        throw e;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/requests/superadmin.request.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createApplicationForTenant",
    ()=>createApplicationForTenant,
    "deleteApplicationForTenant",
    ()=>deleteApplicationForTenant,
    "deleteTenant",
    ()=>deleteTenant,
    "getAllTenants",
    ()=>getAllTenants,
    "getApplicationsForTenant",
    ()=>getApplicationsForTenant,
    "getBillingReport",
    ()=>getBillingReport,
    "getTenant",
    ()=>getTenant
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/utils/Logger.class.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/base.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/config/api.config.ts [client] (ecmascript)");
;
;
;
const getAllTenants = async (skipTake = {}, searchTerm)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["tenantsApiUrl"], {
            params: {
                search: searchTerm,
                ...skipTake
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get all tenants');
        throw e;
    }
};
const getTenant = async (tenantId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["tenantsApiUrl"]}/${tenantId}`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get tenant');
        throw e;
    }
};
const deleteTenant = async (tenantId, identifier)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["tenantsApiUrl"]}/${tenantId}`, {
            params: {
                identifier: identifier
            }
        });
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to delete the tenant');
        throw e;
    }
};
const getBillingReport = async (tenantId, action, billingPeriod, billingPeriodEnd)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["billingApiUrl"]}/admin/report`, {
            params: {
                article: 'docugate.ch/articles/workflow/v2',
                action: action,
                'billing-period': billingPeriod,
                'billing-period-end': billingPeriodEnd,
                'tenant-id': tenantId
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get billing report');
        throw e;
    }
};
const getApplicationsForTenant = async (tenantId, skipTake = {}, searchTerm)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["tenantsV2ApiUrl"]}/${tenantId}/applications`, {
            params: {
                search: searchTerm,
                ...skipTake
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to list applications');
        throw e;
    }
};
const createApplicationForTenant = async (tenantId, name)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["tenantsV2ApiUrl"]}/${tenantId}/applications`, {
            name
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to create new application');
        throw e;
    }
};
const deleteApplicationForTenant = async (tenantId, applicationId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["tenantsV2ApiUrl"]}/${tenantId}/applications/${applicationId}`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to delete the application');
        throw e;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/requests/permission.request.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addGroupMembers",
    ()=>addGroupMembers,
    "addGroupPermissions",
    ()=>addGroupPermissions,
    "checkGrants",
    ()=>checkGrants,
    "createNewGroup",
    ()=>createNewGroup,
    "deleteGroup",
    ()=>deleteGroup,
    "deleteGroupMembers",
    ()=>deleteGroupMembers,
    "getAllGroups",
    ()=>getAllGroups,
    "getAllMembers",
    ()=>getAllMembers,
    "getGroupMembers",
    ()=>getGroupMembers,
    "getGroupPermissions",
    ()=>getGroupPermissions,
    "getSpecificGroup",
    ()=>getSpecificGroup,
    "getSpecificGroups",
    ()=>getSpecificGroups,
    "getSpecificUserGrants",
    ()=>getSpecificUserGrants,
    "getSpecificUserPermissions",
    ()=>getSpecificUserPermissions,
    "getTenantPermissions",
    ()=>getTenantPermissions,
    "getTenantSettings",
    ()=>getTenantSettings,
    "getUserGrants",
    ()=>getUserGrants,
    "getUserPermissions",
    ()=>getUserPermissions,
    "removeGroupPermissions",
    ()=>removeGroupPermissions,
    "updateSpecificGroup",
    ()=>updateSpecificGroup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/config/api.config.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/base.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/utils/Logger.class.ts [client] (ecmascript)");
;
;
;
const getTenantPermissions = async ()=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["permissionsApiUrl"]}/tenant`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get tenant permissions');
        throw e;
    }
};
const getUserPermissions = async ()=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["permissionsApiUrl"]}/user`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get user permissions');
        throw e;
    }
};
const getSpecificUserPermissions = async (userId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["permissionsApiUrl"]}/user/${userId}`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get specific user permissions');
        throw e;
    }
};
const getAllGroups = async ()=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["groupsApiUrl"]}`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get all tenant groups');
        throw e;
    }
};
const createNewGroup = async (group)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["groupsApiUrl"]}`, group);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to create new tenant group');
        throw e;
    }
};
const getSpecificGroup = async (groupId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["groupsApiUrl"]}/${groupId}`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get specific group');
        throw e;
    }
};
const getSpecificGroups = async (groupIds)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["groupsApiUrl"]}/batch`, groupIds);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get specific groups');
        throw e;
    }
};
const updateSpecificGroup = async (groupId, changes)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["groupsApiUrl"]}/${groupId}`, changes);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update specific group');
        throw e;
    }
};
const deleteGroup = async (groupId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["groupsApiUrl"]}/${groupId}`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to delete group');
        throw e;
    }
};
const getGroupMembers = async (groupId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["groupsApiUrl"]}/${groupId}/members`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get group members');
        throw e;
    }
};
const getAllMembers = async ()=>{
    try {
        const allGroups = await getAllGroups();
        const groupMembersPromises = allGroups.map(async (group)=>{
            try {
                return await getGroupMembers(group.id);
            } catch (error) {
                console.error(`Failed to fetch members for group ${group.id}:`, error);
                return [];
            }
        });
        const groupMembersResults = await Promise.all(groupMembersPromises);
        return [
            ...new Set(groupMembersResults.flat())
        ];
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to fetch all group members');
        throw e;
    }
};
const addGroupMembers = async (groupId, members)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["groupsApiUrl"]}/${groupId}/members`, members);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to add group members');
        throw e;
    }
};
const deleteGroupMembers = async (groupId, members)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["groupsApiUrl"]}/${groupId}/members`, {
            data: members
        });
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to delete group members');
        throw e;
    }
};
const getGroupPermissions = async (groupId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["groupsApiUrl"]}/${groupId}/permissions`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get group permissions');
        throw e;
    }
};
const addGroupPermissions = async (groupId, permissions)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["groupsApiUrl"]}/${groupId}/permissions`, permissions);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to add group permissions');
        throw e;
    }
};
const removeGroupPermissions = async (groupId, permissions)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["groupsApiUrl"]}/${groupId}/permissions`, {
            data: permissions
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to remove group permissions');
        throw e;
    }
};
const checkGrants = async (action, resource, apiGroup)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].head(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["grantsApiUrl"]}`, {
            params: {
                action: action,
                resource: resource,
                apiGroup: apiGroup
            }
        });
        return true;
    } catch (e) {
        return false;
    }
};
const getUserGrants = async ()=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["grantsApiUrl"]}/user`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get user grants');
        throw e;
    }
};
const getSpecificUserGrants = async (userId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["grantsApiUrl"]}/user/${userId}`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get specific user grants');
        throw e;
    }
};
const getTenantSettings = async ()=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["tenantSettingsApiUrl"]);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get tenant setting information');
        throw e;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/utils/entitlement.utils.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hasEntitlement",
    ()=>hasEntitlement
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/sdk/src/requests/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$permission$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/permission.request.ts [client] (ecmascript)");
;
const hasEntitlement = async (feature)=>{
    const tenantSettings = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$permission$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getTenantSettings"])();
    const featureEntitlement = tenantSettings.protected?.featureEntitlements?.find((entitlement)=>entitlement.feature === feature);
    return featureEntitlement?.active ?? false;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/utils/index.ts [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$entitlement$2e$utils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/utils/entitlement.utils.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/utils/Logger.class.ts [client] (ecmascript)");
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/requests/template.request.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cloneTemplate",
    ()=>cloneTemplate,
    "createTemplate",
    ()=>createTemplate,
    "createTemplateGroup",
    ()=>createTemplateGroup,
    "deleteTemplate",
    ()=>deleteTemplate,
    "deleteTemplateDraft",
    ()=>deleteTemplateDraft,
    "deleteTemplateGroup",
    ()=>deleteTemplateGroup,
    "deleteTemplateResource",
    ()=>deleteTemplateResource,
    "getAllTemplateFavorites",
    ()=>getAllTemplateFavorites,
    "getAllTemplateGroups",
    ()=>getAllTemplateGroups,
    "getAllTemplates",
    ()=>getAllTemplates,
    "getCurrentUserTemplateGroupPermissions",
    ()=>getCurrentUserTemplateGroupPermissions,
    "getCurrentUserTemplatePermissions",
    ()=>getCurrentUserTemplatePermissions,
    "getFormsVisibility",
    ()=>getFormsVisibility,
    "getTemplate",
    ()=>getTemplate,
    "getTemplateEnviornments",
    ()=>getTemplateEnviornments,
    "getTemplateGroup",
    ()=>getTemplateGroup,
    "getTemplateGroupTemplates",
    ()=>getTemplateGroupTemplates,
    "getTemplateResource",
    ()=>getTemplateResource,
    "getTemplateVersions",
    ()=>getTemplateVersions,
    "getTemplatesBatch",
    ()=>getTemplatesBatch,
    "publishTemplate",
    ()=>publishTemplate,
    "recoverTemplate",
    ()=>recoverTemplate,
    "resetScheduledTemplate",
    ()=>resetScheduledTemplate,
    "updateTemplateGroup",
    ()=>updateTemplateGroup,
    "updateTemplateMetadata",
    ()=>updateTemplateMetadata,
    "updateTemplateResource",
    ()=>updateTemplateResource,
    "updateTemplateResources",
    ()=>updateTemplateResources
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/sdk/src/config/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/config/api.config.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/base.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/sdk/src/utils/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/utils/Logger.class.ts [client] (ecmascript)");
;
;
;
const getAllTemplates = async (searchTerm, labels, skipTake = {}, modes)=>{
    try {
        const templateModes = modes ? modes.join(',') : '';
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["templatesApiUrl"]}`, {
            params: {
                search: searchTerm,
                labels: labels,
                ...skipTake,
                modes: templateModes
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get all templates');
        throw e;
    }
};
const getTemplatesBatch = async (templateIds)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["templatesApiUrl"]}/batch`, templateIds);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get templates batch');
        throw e;
    }
};
const createTemplate = async (metadata, forms, document, template)=>{
    try {
        const formData = new FormData();
        if (metadata) formData.append('metadata.json', new Blob([
            JSON.stringify(metadata)
        ]));
        if (forms) formData.append('forms.json', new Blob([
            JSON.stringify(forms)
        ]));
        if (document) formData.append('document.json', new Blob([
            JSON.stringify(document)
        ]));
        if (template) {
            const extension = template.name.split('.').pop();
            formData.append(`template.${extension}`, template);
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["templatesApiUrl"]}`, formData);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to create template');
        throw e;
    }
};
const getTemplate = async (templateId, version, modes)=>{
    try {
        const params = {};
        if (version) params.version = version;
        if (modes && modes.length > 0) params.modes = modes.join(',');
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["templatesApiUrl"]}/${templateId}`, {
            params
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get template');
        throw e;
    }
};
const updateTemplateMetadata = async (templateId, metadata)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["templatesApiUrl"]}/${templateId}`, metadata);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update template metadata');
        throw e;
    }
};
const deleteTemplate = async (templateId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["templatesApiUrl"]}/${templateId}`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to delete template');
        throw e;
    }
};
const getTemplateEnviornments = async ()=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["templatesApiUrl"]}/environments`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get template environments');
        throw e;
    }
};
const cloneTemplate = async (templateId, resources = {})=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["templatesApiUrl"]}/${templateId}/clone`, resources);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to clone template');
        throw e;
    }
};
const getCurrentUserTemplatePermissions = async ()=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["templatesApiUrl"]}/permissions/me`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get template permissions for logged-in user');
        throw e;
    }
};
const getCurrentUserTemplateGroupPermissions = async ()=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["templatesApiUrl"]}/groups/permissions/me`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get template group permissions for logged-in user');
        throw e;
    }
};
const getTemplateResource = async (templateId, resourceKey, responseType = 'blob', version, modes)=>{
    try {
        const params = {};
        if (version) params.version = version;
        if (modes && modes.length > 0) params.modes = modes.join(',');
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["templatesApiUrl"]}/${templateId}/resources/${resourceKey}`, {
            responseType,
            params
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get template resource');
        throw e;
    }
};
const deleteTemplateResource = async (templateId, resourceKey)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["templatesApiUrl"]}/${templateId}/resources/${resourceKey}`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to delete template resource');
        throw e;
    }
};
const updateTemplateResource = async (templateId, resourceKey, content)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].patch(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["templatesApiUrl"]}/${templateId}/resources/${resourceKey}`, content);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update template resource');
        throw e;
    }
};
const updateTemplateResources = async (templateId, formData)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["templatesApiUrl"]}/${templateId}/resources`, formData);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update template resources');
        throw e;
    }
};
const getAllTemplateGroups = async (skipTake = {})=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["templatesApiUrl"]}/groups`, {
            params: {
                ...skipTake
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get all template groups');
        throw e;
    }
};
const updateTemplateGroup = async (templateGroupId, templateGroup)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["templatesApiUrl"]}/groups/${templateGroupId}`, templateGroup);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update template group');
        throw e;
    }
};
const createTemplateGroup = async (templateGroup)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["templatesApiUrl"]}/groups`, templateGroup);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to create template group');
        throw e;
    }
};
const deleteTemplateGroup = async (templateGroupId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["templatesApiUrl"]}/groups/${templateGroupId}`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to delete template group');
        throw e;
    }
};
const getTemplateGroup = async (templateGroupId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["templatesApiUrl"]}/groups/${encodeURIComponent(templateGroupId)}`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get template group');
        throw e;
    }
};
const getTemplateGroupTemplates = async (templateGroupId, searchTerm, labels, skipTake = {})=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["templatesApiUrl"]}/groups/${encodeURIComponent(templateGroupId)}/templates`, {
            params: {
                search: searchTerm,
                labels: labels,
                ...skipTake
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get templates of a template group');
        throw e;
    }
};
const getAllTemplateFavorites = async (searchTerm, labels, skipTake = {})=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["templatesApiUrl"]}/favorites/users/me`, {
            params: {
                search: searchTerm,
                labels: labels,
                ...skipTake
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get all template favorites');
        throw e;
    }
};
const getFormsVisibility = async (templateId, content)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["templatesApiUrl"]}/${templateId}/resources/forms.json/visibility`, content);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update template resource');
        throw e;
    }
};
const publishTemplate = async (templateId, schedulePublishFor, comment)=>{
    try {
        const params = {};
        const body = {};
        if (schedulePublishFor) params.schedulePublishFor = schedulePublishFor;
        if (comment) body.comment = comment;
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["templatesApiUrl"]}/${templateId}/publish`, body, {
            params
        });
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to publish template');
        throw e;
    }
};
const recoverTemplate = async (templateId, version)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["templatesApiUrl"]}/${templateId}/recover`, {}, {
            params: {
                version
            }
        });
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to recover template version');
        throw e;
    }
};
const getTemplateVersions = async (templateId, version, modes)=>{
    try {
        const params = {};
        if (version) params.version = version;
        if (modes && modes.length > 0) params.modes = modes.join(',');
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["templatesApiUrl"]}/${templateId}/versions`, {
            params
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error(`Unable to get versions for template: ${templateId}`);
        throw e;
    }
};
const deleteTemplateDraft = async (templateId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["templatesApiUrl"]}/${templateId}/draft`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error(`Unable to delete draft version for template: ${templateId}`);
        throw e;
    }
};
const resetScheduledTemplate = async (templateId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["templatesApiUrl"]}/${templateId}/scheduled/reset`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to reset scheduled template version');
        throw e;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/requests/textcomponent.request.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createTextComponent",
    ()=>createTextComponent,
    "deleteTextComponent",
    ()=>deleteTextComponent,
    "deleteTextComponentDraft",
    ()=>deleteTextComponentDraft,
    "getAllTextComponents",
    ()=>getAllTextComponents,
    "getTemplatesUsingTextComponent",
    ()=>getTemplatesUsingTextComponent,
    "getTextComponent",
    ()=>getTextComponent,
    "getTextComponentContent",
    ()=>getTextComponentContent,
    "getTextComponentGroups",
    ()=>getTextComponentGroups,
    "getTextComponentVersions",
    ()=>getTextComponentVersions,
    "getTextComponents",
    ()=>getTextComponents,
    "publishTextComponent",
    ()=>publishTextComponent,
    "recoverTextComponent",
    ()=>recoverTextComponent,
    "resetScheduledTextComponent",
    ()=>resetScheduledTextComponent,
    "updateTextComponent",
    ()=>updateTextComponent,
    "updateTextComponentContent",
    ()=>updateTextComponentContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/sdk/src/config/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/config/api.config.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/base.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/sdk/src/utils/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/utils/Logger.class.ts [client] (ecmascript)");
;
;
;
const getAllTextComponents = async (skipTake = {}, searchTerm, labels = '', modes)=>{
    try {
        const textComponentModes = modes ? modes.join(',') : '';
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["textComponentsApiUrl"]}`, {
            params: {
                search: searchTerm,
                ...skipTake,
                labels,
                modes: textComponentModes
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get all created text components');
        throw e;
    }
};
const getTextComponents = async (ids)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["textComponentsApiUrl"]}/batch`, ids);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get created text components');
        throw e;
    }
};
const getTextComponentGroups = async ()=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["textComponentsApiUrl"]}/groups`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get text component');
        throw e;
    }
};
const createTextComponent = async (metadata, content)=>{
    try {
        const formData = new FormData();
        formData.append('metadata.json', new Blob([
            JSON.stringify(metadata)
        ]));
        if (content) {
            const extension = content.name.split('.').pop();
            formData.append(`content.${extension}`, content);
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["textComponentsApiUrl"]}`, formData);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to created text component');
        throw e;
    }
};
const getTextComponent = async (textComponentId, version, modes)=>{
    try {
        const params = {};
        if (version) params.version = version;
        if (modes && modes.length > 0) params.modes = modes.join(',');
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["textComponentsApiUrl"]}/${textComponentId}`, {
            params
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get text component');
        throw e;
    }
};
const updateTextComponent = async (textComponentId, metadata)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["textComponentsApiUrl"]}/${textComponentId}`, metadata);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update text component');
        throw e;
    }
};
const deleteTextComponent = async (textComponentId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["textComponentsApiUrl"]}/${textComponentId}`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to delete text component');
        throw e;
    }
};
const getTextComponentContent = async (textComponentId, version, modes)=>{
    try {
        const params = {};
        if (version) params.version = version;
        if (modes && modes.length > 0) params.modes = modes.join(',');
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["textComponentsApiUrl"]}/${textComponentId}/content`, {
            responseType: 'blob',
            params
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get text component content');
        throw e;
    }
};
const updateTextComponentContent = async (textComponentId, content, contentType, version, mode)=>{
    try {
        const params = {};
        if (version) params.version = version;
        if (mode) params.modes = mode;
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["textComponentsApiUrl"]}/${textComponentId}/content`, content, {
            headers: {
                'Content-Type': contentType
            },
            transformRequest: [
                (data)=>data
            ],
            params
        });
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update text component content');
        throw e;
    }
};
const getTemplatesUsingTextComponent = async (textComponentId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["textComponentsApiUrl"]}/${textComponentId}/templates`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get templates using text component');
        throw e;
    }
};
const getTextComponentVersions = async (textComponentId, version, modes)=>{
    try {
        const params = {};
        if (version) params.version = version;
        if (modes && modes.length > 0) params.modes = modes.join(',');
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["textComponentsApiUrl"]}/${textComponentId}/versions`, {
            params
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error(`Unable to get versions for text component: ${textComponentId}`);
        throw e;
    }
};
const publishTextComponent = async (textComponentId, schedulePublishFor, comment)=>{
    try {
        const params = {};
        const body = {};
        if (schedulePublishFor) params.schedulePublishFor = schedulePublishFor;
        if (comment) body.comment = comment;
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["textComponentsApiUrl"]}/${textComponentId}/publish`, body, {
            params
        });
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error(`Unable to publish text component: ${textComponentId}`);
        throw e;
    }
};
const recoverTextComponent = async (textComponentId, version)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["textComponentsApiUrl"]}/${textComponentId}/recover`, {}, {
            params: {
                version
            }
        });
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error(`Unable to recover text component version: ${textComponentId} (${version})`);
        throw e;
    }
};
const deleteTextComponentDraft = async (textComponentId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["textComponentsApiUrl"]}/${textComponentId}/draft`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error(`Unable to delete draft version for text component: ${textComponentId}`);
        throw e;
    }
};
const resetScheduledTextComponent = async (textComponentId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["textComponentsApiUrl"]}/${textComponentId}/scheduled/reset`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to reset scheduled template version');
        throw e;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/requests/userinfo.request.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addFunctionRecordToFavorites",
    ()=>addFunctionRecordToFavorites,
    "addTemplateToFavorites",
    ()=>addTemplateToFavorites,
    "createOrUpdateUserInput",
    ()=>createOrUpdateUserInput,
    "deleteUserInput",
    ()=>deleteUserInput,
    "getCurrentUser",
    ()=>getCurrentUser,
    "getFunctionFavoriteIds",
    ()=>getFunctionFavoriteIds,
    "getMyDiscoveredTenants",
    ()=>getMyDiscoveredTenants,
    "getMyTenants",
    ()=>getMyTenants,
    "getSpecificUser",
    ()=>getSpecificUser,
    "getSpecificUsers",
    ()=>getSpecificUsers,
    "getTemplateFavoriteIds",
    ()=>getTemplateFavoriteIds,
    "getUserInput",
    ()=>getUserInput,
    "getUsers",
    ()=>getUsers,
    "removeFunctionRecordFromFavorites",
    ()=>removeFunctionRecordFromFavorites,
    "removeTemplateFromFavorites",
    ()=>removeTemplateFromFavorites
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/config/api.config.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/base.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/utils/Logger.class.ts [client] (ecmascript)");
;
;
;
const getUsers = async (search, skipTake = {})=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["userinfoApiUrl"]}`, {
            params: {
                term: search,
                ...skipTake
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get users by search');
        throw e;
    }
};
const getSpecificUsers = async (users = [], skipTake = {})=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["userinfoApiUrl"]}`, users, {
            params: skipTake
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get specific users');
        throw e;
    }
};
const getCurrentUser = async ()=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["userinfoApiUrl"]}/me`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get current user');
        throw e;
    }
};
const getMyTenants = async ()=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["userinfoApiUrl"]}/me/tenants`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get tenants of the logged in user');
        throw e;
    }
};
const getMyDiscoveredTenants = async ()=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["userinfoApiUrl"]}/me/discoveredtenants`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get discovered tenants of the logged in user');
        throw e;
    }
};
const getSpecificUser = async (subscriberId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["userinfoApiUrl"]}/${subscriberId}`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get specific user');
        throw e;
    }
};
const getUserInput = async (templateId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["userinfoApiUrl"]}/me/templates/${templateId}/input`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get user input');
        throw e;
    }
};
const createOrUpdateUserInput = async (templateId, userInput)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["userinfoApiUrl"]}/me/templates/${templateId}/input`, userInput);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to save user input');
        throw e;
    }
};
const deleteUserInput = async (templateId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["userinfoApiUrl"]}/me/templates/${templateId}/input`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to delete user input');
        throw e;
    }
};
const addFunctionRecordToFavorites = async (functionId, recordId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["userinfoApiUrl"]}/me/functions/${functionId}/favorites/${recordId}`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to add function record to favorites');
        throw e;
    }
};
const getFunctionFavoriteIds = async (functionId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["userinfoApiUrl"]}/me/functions/${functionId}/favorites`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get Function favorites');
        throw e;
    }
};
const removeFunctionRecordFromFavorites = async (functionId, recordId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["userinfoApiUrl"]}/me/functions/${functionId}/favorites/${recordId}`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to remove Function favorite');
        throw e;
    }
};
const addTemplateToFavorites = async (templateId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["userinfoApiUrl"]}/me/templates/favorites/${templateId}`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to add template to favorites');
        throw e;
    }
};
const getTemplateFavoriteIds = async ()=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["userinfoApiUrl"]}/me/templates/favorites/`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get template to favorites');
        throw e;
    }
};
const removeTemplateFromFavorites = async (templateId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["userinfoApiUrl"]}/me/templates/favorites/${templateId}`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to remove template from favorites');
        throw e;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/requests/workflow.request.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createWorkflow",
    ()=>createWorkflow,
    "deleteWorkflow",
    ()=>deleteWorkflow,
    "deleteWorkflowResource",
    ()=>deleteWorkflowResource,
    "deleteWorkflows",
    ()=>deleteWorkflows,
    "getAllWorkflows",
    ()=>getAllWorkflows,
    "getWorkflow",
    ()=>getWorkflow,
    "getWorkflowCompiler",
    ()=>getWorkflowCompiler,
    "getWorkflowContent",
    ()=>getWorkflowContent,
    "getWorkflowErrors",
    ()=>getWorkflowErrors,
    "getWorkflowResource",
    ()=>getWorkflowResource,
    "getWorkflowResult",
    ()=>getWorkflowResult,
    "startWorkflow",
    ()=>startWorkflow,
    "startWorkflows",
    ()=>startWorkflows,
    "updateWorkflow",
    ()=>updateWorkflow,
    "updateWorkflows",
    ()=>updateWorkflows
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/config/api.config.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/base.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/utils/Logger.class.ts [client] (ecmascript)");
;
;
;
const getAllWorkflows = async (labels, skipTake = {})=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["workflowsApiUrl"]}`, {
            params: {
                labels: labels,
                ...skipTake
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get all workflow');
        throw e;
    }
};
const createWorkflow = async (workflow, overriddenTextComponents)=>{
    try {
        const formData = new FormData();
        formData.append('workflow.json', JSON.stringify(workflow));
        if (overriddenTextComponents?.length) {
            for (const tc of overriddenTextComponents){
                const markdownBlob = new Blob([
                    tc.content
                ], {
                    type: 'text/markdown'
                });
                formData.append(`${tc.id}.md`, markdownBlob, `${tc.id}.md`);
            }
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["workflowsApiUrl"]}`, formData);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to create new workflow');
        throw e;
    }
};
const updateWorkflows = async (labels, data, mergeStrategy = 'replace')=>{
    try {
        const formData = new FormData();
        formData.append('workflow.json', JSON.stringify(data));
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["workflowsApiUrl"]}`, formData, {
            params: {
                labels: labels,
                'array-merge-strategy': mergeStrategy
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update workflows');
        throw e;
    }
};
const deleteWorkflows = async (labels)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["workflowsApiUrl"]}`, {
            params: {
                labels: labels
            }
        });
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to delete workflows');
        throw e;
    }
};
const getWorkflow = async (workflowId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["workflowsApiUrl"]}/${workflowId}`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get workflow');
        throw e;
    }
};
const updateWorkflow = async (workflowId, data, mergeStrategy = 'replace')=>{
    try {
        const formData = new FormData();
        formData.append('workflow.json', JSON.stringify(data));
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["workflowsApiUrl"]}/${workflowId}`, formData, {
            params: {
                'array-merge-strategy': mergeStrategy
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update workflow');
        throw e;
    }
};
const deleteWorkflow = async (workflowId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["workflowsApiUrl"]}/${workflowId}`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to delete workflow');
        throw e;
    }
};
const startWorkflow = async (workflowId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["workflowsApiUrl"]}/${workflowId}/start`, {});
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to start workflow');
        throw e;
    }
};
const startWorkflows = async (labels, skipTake = {})=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["workflowsApiUrl"]}/start`, {}, {
            params: {
                labels: labels,
                ...skipTake
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to start workflows');
        throw e;
    }
};
const getWorkflowContent = async (workflowId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["workflowsApiUrl"]}/${workflowId}/content`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get workflow content');
        throw e;
    }
};
const getWorkflowCompiler = async (workflowId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["workflowsApiUrl"]}/${workflowId}/compiler.tar`, {
            responseType: 'blob'
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get workflow compiler');
        throw e;
    }
};
const getWorkflowResource = async (workflowId, resourceKey, responseType = 'blob')=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["workflowsApiUrl"]}/${workflowId}/resources/${resourceKey}`, {
            responseType
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get workflow resource');
        throw e;
    }
};
const deleteWorkflowResource = async (workflowId, resourceKey)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["workflowsApiUrl"]}/${workflowId}/resources/${resourceKey}`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to delete workflow resource');
        throw e;
    }
};
const getWorkflowResult = async (workflowId, resourceKey, responseType = 'blob')=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["workflowsApiUrl"]}/${workflowId}/results/${resourceKey}`, {
            responseType: responseType
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to download workflow result');
        throw e;
    }
};
const getWorkflowErrors = async (workflowId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["workflowsApiUrl"]}/${workflowId}/errors`, {});
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get workflow errors');
        throw e;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/requests/masterdata.request.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "assignIndexForms",
    ()=>assignIndexForms,
    "createIndex",
    ()=>createIndex,
    "createIndexRecord",
    ()=>createIndexRecord,
    "deleteIndex",
    ()=>deleteIndex,
    "deleteIndexForms",
    ()=>deleteIndexForms,
    "deleteIndexRecord",
    ()=>deleteIndexRecord,
    "getIndex",
    ()=>getIndex,
    "getIndexForms",
    ()=>getIndexForms,
    "getIndexRecord",
    ()=>getIndexRecord,
    "getIndexRecords",
    ()=>getIndexRecords,
    "getIndices",
    ()=>getIndices,
    "getSubscriberForRecord",
    ()=>getSubscriberForRecord,
    "getUserData",
    ()=>getUserData,
    "getUserDataForms",
    ()=>getUserDataForms,
    "getUserIndex",
    ()=>getUserIndex,
    "updateIndex",
    ()=>updateIndex,
    "updateIndexRecord",
    ()=>updateIndexRecord,
    "updateUserData",
    ()=>updateUserData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/utils/Logger.class.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/base.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/config/api.config.ts [client] (ecmascript)");
;
;
;
const getIndices = async ()=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["masterdataApiUrl"]}/indices`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get all indices');
        throw e;
    }
};
const createIndex = async (index)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["masterdataApiUrl"]}/indices`, index);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to create new index');
        throw e;
    }
};
const getIndex = async (indexId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["masterdataApiUrl"]}/indices/${indexId}`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get specific index');
        throw e;
    }
};
const updateIndex = async (indexId, index)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["masterdataApiUrl"]}/indices/${indexId}`, index);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update specific index');
        throw e;
    }
};
const deleteIndex = async (indexId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["masterdataApiUrl"]}/indices/${indexId}`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to delete specific index');
        throw e;
    }
};
const getIndexForms = async (indexId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["masterdataApiUrl"]}/indices/${indexId}/forms`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get specific index forms definition');
        throw e;
    }
};
const assignIndexForms = async (indexId, forms)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["masterdataApiUrl"]}/indices/${indexId}/forms`, forms);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to assign form definition to specific index');
        throw e;
    }
};
const deleteIndexForms = async (indexId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["masterdataApiUrl"]}/indices/${indexId}/forms`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to delete form definition of specific index');
        throw e;
    }
};
const getIndexRecords = async (indexId, skipTake = {}, searchValue = '')=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["masterdataApiUrl"]}/indices/${indexId}/records`, {
            params: {
                skip: skipTake.skip,
                take: skipTake.take,
                search: searchValue
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get all index records');
        throw e;
    }
};
const createIndexRecord = async (indexId, record)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["masterdataApiUrl"]}/indices/${indexId}/records`, record);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to insert record into specific index');
        throw e;
    }
};
const getIndexRecord = async (indexId, recordId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["masterdataApiUrl"]}/indices/${indexId}/records/${recordId}`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get index record content');
        throw e;
    }
};
const updateIndexRecord = async (indexId, recordId, content)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["masterdataApiUrl"]}/indices/${indexId}/records/${recordId}`, content);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update index record');
        throw e;
    }
};
const deleteIndexRecord = async (indexId, recordId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["masterdataApiUrl"]}/indices/${indexId}/records/${recordId}`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to delete index record');
        throw e;
    }
};
const getUserData = async ()=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["masterdataApiUrl"]}/users/me`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get user data');
        throw e;
    }
};
const updateUserData = async (content)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["masterdataApiUrl"]}/users/me`, content);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update user data');
        throw e;
    }
};
const getUserDataForms = async ()=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["masterdataApiUrl"]}/users/forms`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get user data forms definition');
        throw e;
    }
};
const getUserIndex = async ()=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["masterdataApiUrl"]}/users/index`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get user index data');
        throw e;
    }
};
const getSubscriberForRecord = async (recordId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["masterdataApiUrl"]}/users/${recordId}/subscriber`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get subscriber for specific record');
        throw e;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/requests/mastertemplate.request.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createMasterTemplate",
    ()=>createMasterTemplate,
    "deleteMasterTemplate",
    ()=>deleteMasterTemplate,
    "getAllMasterTemplates",
    ()=>getAllMasterTemplates,
    "getMasterTemplate",
    ()=>getMasterTemplate,
    "getMasterTemplateResource",
    ()=>getMasterTemplateResource,
    "getTemplatesUsingMasterTemplate",
    ()=>getTemplatesUsingMasterTemplate,
    "updateMasterTemplateMetadata",
    ()=>updateMasterTemplateMetadata,
    "updateMasterTemplateResource",
    ()=>updateMasterTemplateResource,
    "updateMasterTemplateResources",
    ()=>updateMasterTemplateResources
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/sdk/src/config/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/config/api.config.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/base.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/sdk/src/utils/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/utils/Logger.class.ts [client] (ecmascript)");
;
;
;
const getAllMasterTemplates = async (searchTerm, labels, skipTake = {})=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["masterTemplatesApiUrl"]}`, {
            params: {
                search: searchTerm,
                labels: labels,
                ...skipTake
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get all master templates');
        throw e;
    }
};
const createMasterTemplate = async (metadata, document, masterTemplate)=>{
    try {
        const formData = new FormData();
        if (metadata) formData.append('metadata.json', new Blob([
            JSON.stringify(metadata)
        ]));
        if (document) formData.append('document.json', new Blob([
            JSON.stringify(document)
        ]));
        if (masterTemplate) {
            const extension = masterTemplate.name.split('.').pop();
            formData.append(`master_template.${extension}`, masterTemplate);
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["masterTemplatesApiUrl"]}`, formData);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to create master template');
        throw e;
    }
};
const getMasterTemplate = async (masterTemplateId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["masterTemplatesApiUrl"]}/${masterTemplateId}`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get master template');
        throw e;
    }
};
const updateMasterTemplateMetadata = async (masterTemplateId, metadata)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["masterTemplatesApiUrl"]}/${masterTemplateId}`, metadata);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update master template metadata');
        throw e;
    }
};
const deleteMasterTemplate = async (masterTemplateId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["masterTemplatesApiUrl"]}/${masterTemplateId}`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to delete master template');
        throw e;
    }
};
const getMasterTemplateResource = async (masterTemplateId, resourceKey, responseType = 'blob')=>{
    try {
        const params = {};
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["masterTemplatesApiUrl"]}/${masterTemplateId}/resources/${resourceKey}`, {
            responseType,
            params
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get master template resource');
        throw e;
    }
};
const updateMasterTemplateResource = async (masterTemplateId, resourceKey, content)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].patch(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["masterTemplatesApiUrl"]}/${masterTemplateId}/resources/${resourceKey}`, content);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update master template resource');
        throw e;
    }
};
const updateMasterTemplateResources = async (masterTemplateId, formData)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["masterTemplatesApiUrl"]}/${masterTemplateId}/resources`, formData);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update master template resources');
        throw e;
    }
};
const getTemplatesUsingMasterTemplate = async (masterTemplateId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["masterTemplatesApiUrl"]}/${masterTemplateId}/templates`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get templates using master template');
        throw e;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/requests/outputconfig.request.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createOutputConfig",
    ()=>createOutputConfig,
    "deleteOutputConfig",
    ()=>deleteOutputConfig,
    "getOutputConfig",
    ()=>getOutputConfig,
    "listOutputConfigs",
    ()=>listOutputConfigs,
    "updateOutputConfig",
    ()=>updateOutputConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/config/api.config.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/base.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/utils/Logger.class.ts [client] (ecmascript)");
;
;
;
const listOutputConfigs = async (skipTake = {})=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["outputConfigurationsApiUrl"], {
            params: skipTake
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to list output configurations');
        throw e;
    }
};
const createOutputConfig = async (outputConfig)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["outputConfigurationsApiUrl"], outputConfig);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to create output configuration');
        throw e;
    }
};
const getOutputConfig = async (outputConfigId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["outputConfigurationsApiUrl"]}/${outputConfigId}`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get output configuration');
        throw e;
    }
};
const updateOutputConfig = async (outputConfigId, updatedOutputConfig)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["outputConfigurationsApiUrl"]}/${outputConfigId}`, updatedOutputConfig);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update output configuration');
        throw e;
    }
};
const deleteOutputConfig = async (outputConfigId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["outputConfigurationsApiUrl"]}/${outputConfigId}`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to delete output configuration');
        throw e;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/requests/pipeline.request.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createPipeline",
    ()=>createPipeline,
    "createUserPipeline",
    ()=>createUserPipeline,
    "deletePipeline",
    ()=>deletePipeline,
    "deletePipelineResource",
    ()=>deletePipelineResource,
    "getAllPipelineResources",
    ()=>getAllPipelineResources,
    "getAllPipelines",
    ()=>getAllPipelines,
    "getPipeline",
    ()=>getPipeline,
    "getPipelineResource",
    ()=>getPipelineResource,
    "updatePipeline",
    ()=>updatePipeline,
    "updatePipelineResources",
    ()=>updatePipelineResources
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/base.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/utils/Logger.class.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/config/api.config.ts [client] (ecmascript)");
;
;
;
const getAllPipelines = async (skipTake = {})=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["pipelinesApiUrl"]}`, {
            params: {
                ...skipTake
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get all pipelines');
        throw e;
    }
};
const createPipeline = async (pipeline)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["pipelinesApiUrl"]}`, pipeline);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to create pipeline');
        throw e;
    }
};
const createUserPipeline = async (pipeline, userId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["pipelinesApiUrl"]}/user/${userId}`, pipeline);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to create user pipeline');
        throw e;
    }
};
const updatePipeline = async (pipeline, pipelineId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["pipelinesApiUrl"]}/${pipelineId}`, pipeline);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update pipeline');
        throw e;
    }
};
const deletePipeline = async (pipelineId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["pipelinesApiUrl"]}/${pipelineId}`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to delete pipeline');
        throw e;
    }
};
const getPipeline = async (pipelineId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["pipelinesApiUrl"]}/${pipelineId}`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get pipeline');
        throw e;
    }
};
const updatePipelineResources = async (pipelineId, formData)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["pipelinesApiUrl"]}/${pipelineId}/resources`, formData);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update pipeline resources');
        throw e;
    }
};
const getPipelineResource = async (pipelineId, resourceKey)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["pipelinesApiUrl"]}/${pipelineId}/resources/${resourceKey}`, {
            responseType: 'blob'
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get pipeline resource');
        throw e;
    }
};
const deletePipelineResource = async (pipelineId, resourceKey)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["pipelinesApiUrl"]}/${pipelineId}/resources/${resourceKey}`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to delete pipeline resource');
        throw e;
    }
};
const getAllPipelineResources = async (pipelineId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["pipelinesApiUrl"]}/${pipelineId}/resources`, {
            responseType: 'blob'
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get all pipeline resources');
        throw e;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/requests/signaturerules.requests.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addAlternativeSignatureRule",
    ()=>addAlternativeSignatureRule,
    "addDefaultSignatureRule",
    ()=>addDefaultSignatureRule,
    "getAlternativeSignatureRule",
    ()=>getAlternativeSignatureRule,
    "getDefaultSignatureRule",
    ()=>getDefaultSignatureRule,
    "getMatchedAlternativeSignatures",
    ()=>getMatchedAlternativeSignatures,
    "getMatchedAlternativeSignaturesForCurrentUser",
    ()=>getMatchedAlternativeSignaturesForCurrentUser,
    "getMatchedDefaultSignatures",
    ()=>getMatchedDefaultSignatures,
    "getMatchedDefaultSignaturesForCurrentUser",
    ()=>getMatchedDefaultSignaturesForCurrentUser,
    "getSignatureRulesConfiguration",
    ()=>getSignatureRulesConfiguration,
    "removeAlternativeSignatureRule",
    ()=>removeAlternativeSignatureRule,
    "removeDefaultSignatureRule",
    ()=>removeDefaultSignatureRule,
    "updateAlternativeSignatureRule",
    ()=>updateAlternativeSignatureRule,
    "updateDefaultSignatureRule",
    ()=>updateDefaultSignatureRule
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/utils/Logger.class.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/base.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/sdk/src/config/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/config/api.config.ts [client] (ecmascript)");
;
;
;
const getSignatureRulesConfiguration = async ()=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["signatureRulesApiUrl"]}`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get signature rules configuration');
        throw e;
    }
};
const getDefaultSignatureRule = async (ruleCategory, ruleId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["signatureRulesApiUrl"]}/default/${ruleCategory}/${ruleId}`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get default signature rule');
        throw e;
    }
};
const addDefaultSignatureRule = async (ruleCategory, rule, sort)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["signatureRulesApiUrl"]}/default/${ruleCategory}`, rule, {
            params: {
                sort
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to add default signature rule');
        throw e;
    }
};
const updateDefaultSignatureRule = async (ruleCategory, ruleId, rule, sort)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["signatureRulesApiUrl"]}/default/${ruleCategory}/${ruleId}`, rule, {
            params: {
                sort
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update default signature rule');
        throw e;
    }
};
const removeDefaultSignatureRule = async (ruleCategory, ruleId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["signatureRulesApiUrl"]}/default/${ruleCategory}/${ruleId}`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to remove default signature rule');
        throw e;
    }
};
const getAlternativeSignatureRule = async (ruleCategory, ruleId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["signatureRulesApiUrl"]}/alternative/${ruleCategory}/${ruleId}`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get alternative signature rule');
        throw e;
    }
};
const addAlternativeSignatureRule = async (rule, sort)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["signatureRulesApiUrl"]}/alternative/signatures`, rule, {
            params: {
                sort
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to add alternative signature rule');
        throw e;
    }
};
const updateAlternativeSignatureRule = async (ruleId, rule, sort)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["signatureRulesApiUrl"]}/alternative/signatures/${ruleId}`, rule, {
            params: {
                sort
            }
        });
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to update alternative signature rule');
        throw e;
    }
};
const removeAlternativeSignatureRule = async (ruleId)=>{
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].delete(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["signatureRulesApiUrl"]}/alternative/signatures/${ruleId}`);
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to remove alternative signature rule');
        throw e;
    }
};
const getMatchedDefaultSignatures = async (userId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["signatureRulesApiUrl"]}/default/templates/user/${userId}`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get matched default signatures');
        throw e;
    }
};
const getMatchedAlternativeSignatures = async (userId)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["signatureRulesApiUrl"]}/alternative/templates/user/${userId}`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get matched alternative signatures');
        throw e;
    }
};
const getMatchedDefaultSignaturesForCurrentUser = async ()=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["signatureRulesApiUrl"]}/default/templates`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get matched default signatures');
        throw e;
    }
};
const getMatchedAlternativeSignaturesForCurrentUser = async ()=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["axiosInstance"].get(`${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["signatureRulesApiUrl"]}/alternative/templates`);
        return response.data;
    } catch (e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$utils$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get matched alternative signatures');
        throw e;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/sdk/src/requests/index.ts [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$application$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/application.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$bag$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/bag.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/base.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$billing$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/billing.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$bulkcreation$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/bulkcreation.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$cronjob$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/cronjob.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$function$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/function.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$identity$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/identity.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$invitation$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/invitation.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$superadmin$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/superadmin.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$template$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/template.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$textcomponent$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/textcomponent.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$userinfo$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/userinfo.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$workflow$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/workflow.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$masterdata$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/masterdata.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$mastertemplate$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/mastertemplate.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$outputconfig$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/outputconfig.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$permission$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/permission.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$pipeline$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/pipeline.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$signaturerules$2e$requests$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/signaturerules.requests.ts [client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=sdk_src_be36b9fb._.js.map