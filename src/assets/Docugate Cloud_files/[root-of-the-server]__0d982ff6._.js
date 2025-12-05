(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/src/styles/modules/Footer.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "footer-container": "Footer-module-scss-module__HhZdaG__footer-container",
  "footer-content-container": "Footer-module-scss-module__HhZdaG__footer-content-container",
  "footer-item": "Footer-module-scss-module__HhZdaG__footer-item",
});
}),
"[project]/src/styles/modules/system/Link.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "link-container": "Link-module-scss-module__Gp7oXq__link-container",
  "link-label": "Link-module-scss-module__Gp7oXq__link-label",
});
}),
"[project]/src/styles/modules/system/MaterialIcon.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "icon-container": "MaterialIcon-module-scss-module__0DpFQG__icon-container",
  "icons-container": "MaterialIcon-module-scss-module__0DpFQG__icons-container",
});
}),
"[project]/src/hooks/AccessibilityHook.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AccessibilityProvider",
    ()=>AccessibilityProvider,
    "useAccessibility",
    ()=>useAccessibility
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/v4.js [client] (ecmascript) <export default as v4>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
const defaultValue = {
    focusable: ()=>null
};
const AccessibilityContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])(defaultValue);
const AccessibilityProvider = ({ children })=>{
    _s();
    const mounted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AccessibilityProvider.useEffect": ()=>{
            mounted.current = true;
            return ({
                "AccessibilityProvider.useEffect": ()=>{
                    mounted.current = false;
                }
            })["AccessibilityProvider.useEffect"];
        }
    }["AccessibilityProvider.useEffect"], []);
    /**
   * Register an element as focusable in order to be able to focus
   * it with tabbing through the page. The element can be "clicked"
   * through pressing space or enter
   * @param id id to identify the target element
   * @param options optional options to adjust the behaviour of focusable
   */ const focusable = (id, options = {})=>{
        const { handler, clickable = true, disabled = false } = options;
        const handleKeyDown = (event)=>{
            if (handler) handler(event);
            if (disabled) return;
            if (clickable && (event.code === 'Enter' || event.code === 'Space')) {
                event.preventDefault();
                const element = document.querySelector(`[data-focus-id="${id}"]`);
                if (element) element.click();
            }
        };
        return {
            tabIndex: disabled ? undefined : 0,
            onKeyDown: handleKeyDown,
            'data-focus-id': id
        };
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(AccessibilityContext.Provider, {
        value: {
            focusable
        },
        children: children
    });
};
_s(AccessibilityProvider, "K6RcWNPnAJ1smoz1e676pCSIO08=");
_c = AccessibilityProvider;
const useAccessibility = ()=>{
    _s1();
    const elementId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])('');
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(AccessibilityContext);
    if (!context) throw new Error('useAccessibility must be used within an AccessibilityProvider');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAccessibility.useEffect": ()=>{
            // Only set the id on the client side to prevent
            // client-server mismatches
            elementId.current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])();
        }
    }["useAccessibility.useEffect"], []);
    /**
   * Method to append the element id to the focusable method
   */ const handleFocusable = (id, options)=>{
        return context.focusable(`${elementId.current}-${id}`, options);
    };
    return {
        focusable: handleFocusable
    };
};
_s1(useAccessibility, "dftkH6vXc6xlBshgdIyTaiPjWr4=");
var _c;
__turbopack_context__.k.register(_c, "AccessibilityProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/system/MaterialIcon.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IconContainer",
    ()=>IconContainer,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$MaterialIcon$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/modules/system/MaterialIcon.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$AccessibilityHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/AccessibilityHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Link$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Link.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
/**
 * MaterialIcon system component which can be used to display icons from the material icon set
 * @see https://kolibri.docugate.ch/docs/components/system/MaterialIcon
 * @see https://fonts.google.com/icons?icon.set=Material+Icons
 */ const MaterialIcon = ({ outlined = false, clickable = false, href, icon, iconSize = 'normal', onClick, color, useSymbols = false, ...props })=>{
    _s();
    const { focusable } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$AccessibilityHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useAccessibility"])();
    const canBeFocused = !!href || !!onClick;
    const getIconClass = ()=>{
        if (useSymbols) {
            return 'material-symbols-outlined';
        }
        return outlined ? 'material-icons-outlined' : 'material-icons';
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("span", {
        "data-cy": 'icon',
        "data-cy-icon": icon,
        className: `${getIconClass()} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$MaterialIcon$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['icon-container']}`,
        "data-size": iconSize,
        "data-color": color,
        "data-clickable": !!onClick || clickable || !!href,
        children: href ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Link$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            noDecoration: true,
            href: href,
            children: icon
        }) : icon,
        onClick: onClick,
        ...focusable(0, {
            disabled: !canBeFocused
        }),
        ...props
    });
};
_s(MaterialIcon, "NFmxomNyFuZjsW46h4AtNtj4lIg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$AccessibilityHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useAccessibility"]
    ];
});
_c = MaterialIcon;
const IconContainer = ({ children })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$MaterialIcon$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['icons-container'],
        children: children
    });
};
_c1 = IconContainer;
const __TURBOPACK__default__export__ = MaterialIcon;
var _c, _c1;
__turbopack_context__.k.register(_c, "MaterialIcon");
__turbopack_context__.k.register(_c1, "IconContainer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/system/Link.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Link$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/modules/system/Link.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$MaterialIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/MaterialIcon.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$AccessibilityHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/AccessibilityHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
;
;
;
/**
 * Link system component which can be used to navigate between pages or to execute actions on a click event
 * @see https://kolibri.docugate.ch/docs/components/system/Link
 */ const Link = ({ icon, children, ...props })=>{
    _s();
    const { disabled = false, hoverAnimation = false, green, weight = 'normal', asText = false, external = false, onClick, noDecoration = false, fullWidth = false, href, size = 'small', ...rest } = props;
    const { focusable } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$AccessibilityHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useAccessibility"])();
    const ChildrenWithIcon = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("span", {
                "data-cy": 'link-label',
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Link$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['link-label'],
                children: children
            }),
            icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$MaterialIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                icon: icon,
                iconSize: size,
                outlined: true
            })
        ]
    });
    const sharedProps = {
        'data-decoration': !noDecoration,
        'data-text': asText,
        'data-disabled': disabled,
        'data-cy': 'link',
        'data-cy-link': external ? 'external' : disabled || onClick || !href ? 'button' : 'internal',
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Link$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['link-container'],
        children: ChildrenWithIcon
    };
    const handleClick = (event)=>{
        if (!disabled && onClick) onClick(event);
    };
    if (!external && href && !disabled && !onClick) {
        // the link should act as internal link
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("span", {
            "data-full-width": fullWidth,
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Link$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['link-container'],
            "data-cy": 'link',
            "data-cy-link": 'internal',
            "data-weight": weight,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(InternalLink, {
                href: href,
                children: ChildrenWithIcon,
                hoverAnimation: hoverAnimation,
                ...props
            })
        });
    } else if (disabled || onClick || !href) {
        // the link should act as a button
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("span", {
            "data-animated": hoverAnimation,
            "data-green": green,
            "data-weight": weight,
            onClick: handleClick,
            ...sharedProps,
            ...rest,
            ...focusable(0, {
                handler: rest.onKeyDown
            })
        });
    } else {
        // the link should act as an external link
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("a", {
            "data-green": green,
            "data-weight": weight,
            "data-animated": hoverAnimation,
            href: href,
            ...sharedProps,
            ...rest
        });
    }
};
_s(Link, "NFmxomNyFuZjsW46h4AtNtj4lIg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$AccessibilityHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useAccessibility"]
    ];
});
_c = Link;
/**
 * The InternalLink is a special version of the <Link /> component which is only used for navigating
 * between pages of the current application
 */ const InternalLink = ({ asText = false, disabled = false, href, noDecoration, hoverAnimation, children, fullWidth = false, prefetch = false, ...props })=>{
    _s1();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { focusable } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$AccessibilityHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useAccessibility"])();
    const prefetched = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InternalLink.useEffect": ()=>{
            if (prefetch && !prefetched.current) {
                router.prefetch(href).then({
                    "InternalLink.useEffect": ()=>prefetched.current = true
                }["InternalLink.useEffect"]).catch({
                    "InternalLink.useEffect": ()=>prefetched.current = false
                }["InternalLink.useEffect"]);
            }
        }
    }["InternalLink.useEffect"], [
        prefetch
    ]);
    const handleClick = async (event)=>{
        event.preventDefault();
        await router.push(href);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("a", {
        onClick: handleClick,
        href: href,
        "data-full-width": fullWidth,
        "data-disabled": disabled,
        "data-text": asText,
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Link$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['link-container'],
        "data-decoration": !noDecoration,
        "data-animated": hoverAnimation,
        children: children,
        ...props,
        ...focusable(0, {
            handler: props.onKeyDown
        })
    });
};
_s1(InternalLink, "yE790KV8m712zuL7QFN9PvMQ4OA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$AccessibilityHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useAccessibility"]
    ];
});
_c1 = InternalLink;
const __TURBOPACK__default__export__ = Link;
var _c, _c1;
__turbopack_context__.k.register(_c, "Link");
__turbopack_context__.k.register(_c1, "InternalLink");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Footer.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$Footer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/modules/Footer.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Link$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Link.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$i18next$2f$dist$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-i18next/dist/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
const Footer = /*#__PURE__*/ _s(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].memo(_c = _s(()=>{
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"])([
        'common'
    ]);
    const emojis = [
        '🎄',
        '🎅',
        '🦌',
        '🛷',
        '🎁',
        '🕯️',
        '❄️',
        '⛄',
        '✨',
        '🔔',
        '🧝'
    ];
    const [emoji, setEmoji] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Footer.useEffect": ()=>{
            const index = Math.floor(Math.random() * emojis.length);
            setEmoji(emojis[index]);
        }
    }["Footer.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("footer", {
        "data-cy": 'footer',
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$Footer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['footer-container'],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("section", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$Footer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['footer-content-container'],
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$Footer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['footer-item'],
                    children: `© ${new Date().getFullYear()} Docugate ${emoji}`
                }),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$Footer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['footer-item'],
                    children: t('common:company-declaration')
                }),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$Footer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['footer-item'],
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Link$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        asText: true,
                        href: "mailto:servicedesk@docugate.ch",
                        children: 'servicedesk@docugate.ch'
                    })
                })
            ]
        })
    });
}, "8VWfCEjex6hrGY9sxDwXlIvVyvs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
})), "8VWfCEjex6hrGY9sxDwXlIvVyvs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c1 = Footer;
const __TURBOPACK__default__export__ = Footer;
var _c, _c1;
__turbopack_context__.k.register(_c, "Footer$React.memo");
__turbopack_context__.k.register(_c1, "Footer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/styles/modules/Header.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "header-container": "Header-module-scss-module__Yi2Z3W__header-container",
  "interaction-container": "Header-module-scss-module__Yi2Z3W__interaction-container",
  "logo-box": "Header-module-scss-module__Yi2Z3W__logo-box",
  "logo-container": "Header-module-scss-module__Yi2Z3W__logo-container",
  "nav-container": "Header-module-scss-module__Yi2Z3W__nav-container",
  "user": "Header-module-scss-module__Yi2Z3W__user",
});
}),
"[project]/src/assets/logo.svg (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/logo.07eb4e40.svg");}),
"[project]/src/assets/logo.svg.mjs { IMAGE => \"[project]/src/assets/logo.svg (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$logo$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/assets/logo.svg (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$logo$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 51,
    height: 51,
    blurWidth: 0,
    blurHeight: 0
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
"[project]/src/common/global.config.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ACCEPT_LANGUAGE_REGEX",
    ()=>ACCEPT_LANGUAGE_REGEX,
    "APPLICATION_NAME_VALIDATION",
    ()=>APPLICATION_NAME_VALIDATION,
    "BAG_RESULT_NAME_REGEX",
    ()=>BAG_RESULT_NAME_REGEX,
    "CONTAINS_NOT_CONTAINS_REGEX",
    ()=>CONTAINS_NOT_CONTAINS_REGEX,
    "DATE_FORMAT_REGEX",
    ()=>DATE_FORMAT_REGEX,
    "DATE_REGEX",
    ()=>DATE_REGEX,
    "DOCS_PATH",
    ()=>DOCS_PATH,
    "DOCS_SYNTAX_STYLESHEET",
    ()=>DOCS_SYNTAX_STYLESHEET,
    "EMAIL_REGEX",
    ()=>EMAIL_REGEX,
    "EQ_NOT_EQ_REGEX",
    ()=>EQ_NOT_EQ_REGEX,
    "EXISTS_NOT_EXISTS_REGEX",
    ()=>EXISTS_NOT_EXISTS_REGEX,
    "INDEX_NAME_VALIDATION",
    ()=>INDEX_NAME_VALIDATION,
    "IN_NOT_IN_REGEX",
    ()=>IN_NOT_IN_REGEX,
    "NAME_VALIDATION",
    ()=>NAME_VALIDATION,
    "NUMBER_REGEX",
    ()=>NUMBER_REGEX,
    "PATH_VARIABLE_REGEX",
    ()=>PATH_VARIABLE_REGEX,
    "PROPERTY_INTERNAL_NAME_VALIDATION",
    ()=>PROPERTY_INTERNAL_NAME_VALIDATION,
    "SELECTOR_SEGMENT_REGEX",
    ()=>SELECTOR_SEGMENT_REGEX,
    "UUID_REGEX",
    ()=>UUID_REGEX,
    "authorizationContainer",
    ()=>authorizationContainer,
    "baseApiUrl",
    ()=>baseApiUrl,
    "delayTimeout",
    ()=>delayTimeout,
    "feedbackDuration",
    ()=>feedbackDuration,
    "homePath",
    ()=>homePath,
    "minQueryLength",
    ()=>minQueryLength,
    "requestTimeout",
    ()=>requestTimeout,
    "requestTimeoutWorkflow",
    ()=>requestTimeoutWorkflow,
    "templateDesignerUrl",
    ()=>templateDesignerUrl
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/sdk/src/config/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/config/api.config.ts [client] (ecmascript)");
;
const requestTimeout = 10000;
const requestTimeoutWorkflow = 20000;
const feedbackDuration = 5000; // when this constant is edited it has to be edited in the feedback scss file too
const delayTimeout = 150; // amount ms to wait for changes to take place
const homePath = '/template';
const minQueryLength = 4; // minimum amount of characters to invoke a query function
const authorizationContainer = 'https://identity:443';
const DOCS_PATH = './docs';
const DOCS_SYNTAX_STYLESHEET = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/atom-one-dark.min.css';
const NUMBER_REGEX = new RegExp(/^([+-])?[0-9]+((\.)[0-9]+)?$/);
const DATE_FORMAT_REGEX = new RegExp(/^(dd.mm.yyyy)|(mm.dd.yyyy)$/);
const UUID_REGEX = new RegExp(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i);
const DATE_REGEX = new RegExp(/^(\d{2}.\d{2}.\d{4}|\d{2}\/\d{2}\/\d{4})$/);
const ACCEPT_LANGUAGE_REGEX = new RegExp(/([a-z]{1,8}(-[a-z]{1,8})?)\s*(;\s*q\s*=\s*(1|0\.[0-9]+))?/i);
const INDEX_NAME_VALIDATION = new RegExp(/^[a-z0-9\-_]+$/i);
const APPLICATION_NAME_VALIDATION = new RegExp(/^[a-z0-9\-_]+$/i);
const PROPERTY_INTERNAL_NAME_VALIDATION = new RegExp(/^[\p{L}0-9\-_]+$/iu);
const NAME_VALIDATION = new RegExp(/^(?!(\..*|.*\.$))[^<>:""/\\|?*\x00-\x1F]{0,255}$/);
const EMAIL_REGEX = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
const IN_NOT_IN_REGEX = new RegExp(/(?<label>[\w\p{L}\-_\.\/]*)\s*(?<in>in|notin)\s*\((?<values>(:?[\w\p{L},\s$_\-]*(:?,)?)+)\)/iu);
const EQ_NOT_EQ_REGEX = new RegExp(/(?<label>[\w\p{L}\-_\.\/]*)\s*(?<eq>=|!=)\s*(?<value>[\w\p{L},\s$_\-\.]*)(?=(,|$))/iu);
const EXISTS_NOT_EXISTS_REGEX = new RegExp(/(?<=(^|,))(?<ex>!)?(?<label>[\w\p{L}\-_\.\/]+)(?=(,|$))/iu);
const CONTAINS_NOT_CONTAINS_REGEX = /^(?<label>.+?)(?<op>~|!~)(?<value>.+)$/;
const SELECTOR_SEGMENT_REGEX = new RegExp(/,(?![^(]*\))/g);
const PATH_VARIABLE_REGEX = new RegExp(/\[(?<name>\w\p{L}+)\]/gu);
const BAG_RESULT_NAME_REGEX = /\.(?<extractedTemplateId>[^.]+)\.[^.]+\.(?<fileExtension>[^.]+)$/;
const templateDesignerUrl = 'https://appsource.microsoft.com/en-us/product/office/WA200002864?src=office&tab=Overview';
const baseApiUrl = __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["baseUrlByEnvironment"]["TURBOPACK compile-time value", "dev"] ?? 'api.docugate.cloud';
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/styles/modules/system/Menu.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "menu-paper-container": "Menu-module-scss-module__AlRZha__menu-paper-container",
  "menuitem-container": "Menu-module-scss-module__AlRZha__menuitem-container",
  "menuitem-content": "Menu-module-scss-module__AlRZha__menuitem-content",
  "menuitem-focus": "Menu-module-scss-module__AlRZha__menuitem-focus",
  "menuitem-root": "Menu-module-scss-module__AlRZha__menuitem-root",
  "menuitem-selected": "Menu-module-scss-module__AlRZha__menuitem-selected",
  "menuitem-subtitle": "Menu-module-scss-module__AlRZha__menuitem-subtitle",
  "menuitem-title": "Menu-module-scss-module__AlRZha__menuitem-title",
});
}),
"[project]/src/styles/modules/system/AssetIcon.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "asset-icon": "AssetIcon-module-scss-module__6lYj2W__asset-icon",
  "asset-icon-container": "AssetIcon-module-scss-module__6lYj2W__asset-icon-container",
});
}),
"[project]/src/assets/generic_file.png (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/generic_file.96ea80e6.png");}),
"[project]/src/assets/generic_file.png.mjs { IMAGE => \"[project]/src/assets/generic_file.png (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$generic_file$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/assets/generic_file.png (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$generic_file$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 128,
    height: 128,
    blurWidth: 8,
    blurHeight: 8,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAz0lEQVR42kWPPQqDUBCEX1ATcgo7L5A2B/EIniClVVSwUfwXy1SWIa/OBQzWgqL4jx4im+yTkIVhh5mPhSUcx+0VRbkmSfJEmaZ5lyTpTAjZERye54+2bdOiKACV5/nbsqyXKIonBiHgOA4tyxKqqmJQlmVvVVVv3+sHBnieR5umgZ/qugbXdR/YMSAIAtp1HfR9D7jbtgXf9zdAEIRjFEV0HEeYpolpGAYIw/APxHFM53mGdV1hWRZA/802AN+UZfmiaVpqGEaq63qKHjPsPqN4h5dbzMXkAAAAAElFTkSuQmCC"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/assets/docugate.png (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/docugate.5a0763ec.png");}),
"[project]/src/assets/docugate.png.mjs { IMAGE => \"[project]/src/assets/docugate.png (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$docugate$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/assets/docugate.png (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$docugate$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 50,
    height: 50,
    blurWidth: 8,
    blurHeight: 8,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAA0UlEQVR42kWPPw/BQBjGr/7FQCymSky1SDcLpbWUoZOpqURSrf8LCQOLoWMbiUUMFnwAi11iYCUxSXyL+wKv65X2kveGe977Pc+DkHsi8QRi+SbK1/d0WF6jb3+RyUlOSGhjJBhAp6RjxImOt0R+ZhtT3LcPUDAs4NQF1CYrSMlDTEkuMlbtQcvawfXxhvvrAwP7COFKB6idezEEm5RHsDld4Hx7Esrcs6ILBBOXuliZrUFdbiGtjD2xqP8s3CAkUFQ0MVM2A9EPGdTU/JqZoOYXmB5SUBmuEwIAAAAASUVORK5CYII="
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/assets/docugate.svg (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/docugate.30769d10.svg");}),
"[project]/src/assets/docugate.svg.mjs { IMAGE => \"[project]/src/assets/docugate.svg (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$docugate$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/assets/docugate.svg (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$docugate$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 189,
    height: 189,
    blurWidth: 0,
    blurHeight: 0
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/assets/word.svg (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/word.34f7672d.svg");}),
"[project]/src/assets/word.svg.mjs { IMAGE => \"[project]/src/assets/word.svg (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$word$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/assets/word.svg (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$word$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 35,
    height: 36,
    blurWidth: 0,
    blurHeight: 0
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/assets/powerpoint.svg (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/powerpoint.e8fb363f.svg");}),
"[project]/src/assets/powerpoint.svg.mjs { IMAGE => \"[project]/src/assets/powerpoint.svg (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$powerpoint$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/assets/powerpoint.svg (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$powerpoint$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 581,
    height: 563,
    blurWidth: 0,
    blurHeight: 0
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/assets/pdf.png (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/pdf.6b216371.png");}),
"[project]/src/assets/pdf.png.mjs { IMAGE => \"[project]/src/assets/pdf.png (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$pdf$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/assets/pdf.png (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$pdf$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 1061,
    height: 1023,
    blurWidth: 8,
    blurHeight: 8,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAmElEQVR42oWPuwrCQBREN6K1j9QKaqegglZaKAgKChaC1pZil1YsBBs/IVW+Il93Z8NkF/JgSZHiFnPnMMwo3M+x9JqQtqJz5mc9JX5uesR2SUz6JWQ8VYiORx08icveSXKBd0Bcj5RuowpgOmAShdS/D/XrQexWJYDFmMn/S9xOlKFPbGbEfJQBpogVOKxNqZa7xJasm5kCiqmNaLCeLaYAAAAASUVORK5CYII="
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/assets/excel.svg (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/excel.bb22d589.svg");}),
"[project]/src/assets/excel.svg.mjs { IMAGE => \"[project]/src/assets/excel.svg (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$excel$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/assets/excel.svg (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$excel$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 486,
    height: 500,
    blurWidth: 0,
    blurHeight: 0
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/assets/laTex.png (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/laTex.758d0a61.png");}),
"[project]/src/assets/laTex.png.mjs { IMAGE => \"[project]/src/assets/laTex.png (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$laTex$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/assets/laTex.png (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$laTex$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 512,
    height: 512,
    blurWidth: 8,
    blurHeight: 8,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIEAYAAACUn2LIAAABOklEQVR42pWRv0vDQBTHH9REoYRq6SQqBLM5tA6CSiCLUMgPX8Glc6gtRAqBdmihtEJB2qlQLBQyBvonOGYQUug/oIM4OxQMWUV5npBokSL23vA5jnufx90XALgm1xT2APRQD71ngDJb9BGRGKWyRFkANafm7vYBkoVkYfsVANZYbTDyBm+kDABUUfXNhcZfLIWl8F0AkIfycPQEkEgn0uvnKwhiooKKr7C+PJ9PyT+CG3TQ8c2DzjUrotN2v9NnzL50pa5EJN236q06ExyhhdbXoHhwvDnEClZ881jsZXoZoqvExJk4RJcnruiKRBdv49l4xgQjdNFdJoiewN9aRatItNm2NVsj2tLsqT0lSgbVQXXABGdYw9ofgn/8QXTvW8A1uIawy2Kc63PvcUmMi2TneqAH3kMU/84nNGC5KjSj7y8AAAAASUVORK5CYII="
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/assets/logo.png (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/logo.bbf5163d.png");}),
"[project]/src/assets/logo.png.mjs { IMAGE => \"[project]/src/assets/logo.png (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$logo$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/assets/logo.png (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$logo$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 37,
    height: 29,
    blurWidth: 8,
    blurHeight: 6,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAGCAYAAAD+Bd/7AAAAwUlEQVR42jWNLQ7CMACFGzCQICYIIUEhUBgUFs0BEHhOAAkn4AIcAEE4BwrBCQABCUs29lvG2m1d160t3ZKJZ95733vg8bLm96e18754zFjREkI2gjAZmXYwcyEegCihQ8dHRxylN9sLDyEmSxhEl4/zW8WEdoCUEsQJ7SUk2ysThYhgx0O+AqdlVhVKkZT13wY8F5xTD+JTSplWFYQQDc5FW00vXB9d1dU6Y3m3BkEUU0034EY34TbL8okCmnVY6g/0zpeYa5McPgAAAABJRU5ErkJggg=="
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/assets/image.png (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/image.a75f2e05.png");}),
"[project]/src/assets/image.png.mjs { IMAGE => \"[project]/src/assets/image.png (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$image$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/assets/image.png (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$image$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 512,
    height: 512,
    blurWidth: 8,
    blurHeight: 8,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAA90lEQVR42m3Kv0sCcQAF8O9kmgQN4ZfW49agBiEhjrh+QBFSQtHaEA0O9Qe0NQbVkFA5NIdQhCh4Hg4uB6JfPR1ERL8o56B3/trcnt4N4uDw4fF4j/h8lAqCIC5jb0RRVa3EsrxYYryoV+bYjKJmNNI3G5jo1xgZCqzhGLVOE/mmjt5g6HRiDUyY7QTqRgHlVhXhn3tcRC+RLKedEzGsLqLsG3epMG5itwi8Sth92UPwK4RfFgd5y70j9H+Fs79znMaCkD5k52A7ipyASM+yJn8e84MZO/cjh9z/FOA7j36+9bCtkZV1N/VuesVFHroqujc8omvNRaeB6I0XH/p4+wAAAABJRU5ErkJggg=="
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/assets/json.png (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/json.276809c6.png");}),
"[project]/src/assets/json.png.mjs { IMAGE => \"[project]/src/assets/json.png (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$json$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/assets/json.png (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$json$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 512,
    height: 512,
    blurWidth: 8,
    blurHeight: 8,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAdklEQVR42lXPIQqFQBSF4fswvfLCA4N7UDBYDBaD3WC0mHQbCmLVHdg0uUV/4SjjwFfOPTPMNTPzUKLHgAkxPqbzx4wUCXasiO6Cr1tfvTbiwIafWwgQIkeGRbOn0KCVRtmrUKOT2i3cnyxQSaHsmr3WdF2ZdwLTThP2hfus/gAAAABJRU5ErkJggg=="
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/assets/pipeline_gray.svg (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/pipeline_gray.da815795.svg");}),
"[project]/src/assets/pipeline_gray.svg.mjs { IMAGE => \"[project]/src/assets/pipeline_gray.svg (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$pipeline_gray$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/assets/pipeline_gray.svg (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$pipeline_gray$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 24,
    height: 24,
    blurWidth: 0,
    blurHeight: 0
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/assets/pipeline_blue.svg (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/pipeline_blue.3ae338f0.svg");}),
"[project]/src/assets/pipeline_blue.svg.mjs { IMAGE => \"[project]/src/assets/pipeline_blue.svg (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$pipeline_blue$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/assets/pipeline_blue.svg (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$pipeline_blue$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 24,
    height: 24,
    blurWidth: 0,
    blurHeight: 0
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/assets/visio.png (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/visio.2991dfb5.png");}),
"[project]/src/assets/visio.png.mjs { IMAGE => \"[project]/src/assets/visio.png (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$visio$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/assets/visio.png (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$visio$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 300,
    height: 286,
    blurWidth: 8,
    blurHeight: 8,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAABE0lEQVR42gEIAff+AAAAAAAAAAAAAgYJCCNYf4Eyfra+CRgiIgAAAAAAAAAAAAQNGB4EDhohGUFkbTmS2fA/n+f8LHGjqwkZKCsFDxoeACBbq9wmX67fJ2e98yZrw/81itP/OZXi+yhywOQmbLjcACprxP9ql9X/X4/S/zJtwf8qdsP/LYDV/yt80/8rfNP/AB1gv/9rltX/f6LZ/xxXtf8UR5f/IGK3/yt70v8rfNP/ABlauv0xacD+O23A/xRMrv8PPYz/E0aY/CNotuUmbLjcAAkiSWMJIktoDC5pug44gv8OOoX/DjiB3wcWKzsFDxoeAAAAAAAAAAAABA4gOg00eNgPPInyCB9JewABAwUAAAAA0JdmYwr5GAAAAAAASUVORK5CYII="
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/assets/typst.png (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/typst.23f4ac9f.png");}),
"[project]/src/assets/typst.png.mjs { IMAGE => \"[project]/src/assets/typst.png (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$typst$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/assets/typst.png (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$typst$2e$png__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 512,
    height: 512,
    blurWidth: 8,
    blurHeight: 8,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAABE0lEQVR42gEIAff+ADWJaaNTzKP5WMqq/1vBrv9buLD/W6+w/1Ojq/ktaHCiAFLKnvlWyqb/WcSr/2rCtv9gs7T/WKiy/1Shsf9Dmqv4AFTGof9Vwab/a8O1/87p5/+YytH/XKW4/0+as/9BmbD/AFK8o/9Ttqf/Zri2/9fr7f+Eusz/UJm4/0aUtf85lrL/AE+xpv9Oq6r/Wau2/8/l6/9pp8X/Q4+4/zqQtv8wlbL/AEamqf9HoK7/UJ63/8Xe6P+Ywtn/Spi//y+RtP8plrH/ADaaqfg5mbD/OpO0/1Sgwf9XpMT/MZO2/yiVsv8llav4AB1jcKIslKz4LZSy/yuSs/8okrP/JpWx/ySVq/gXY3CivYGo42ERwooAAAAASUVORK5CYII="
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/assets/textComponentIcon.svg (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/textComponentIcon.c7cbef44.svg");}),
"[project]/src/assets/textComponentIcon.svg.mjs { IMAGE => \"[project]/src/assets/textComponentIcon.svg (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$textComponentIcon$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/assets/textComponentIcon.svg (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$textComponentIcon$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 157,
    height: 164,
    blurWidth: 0,
    blurHeight: 0
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/assets/markdown.svg (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/markdown.96a81343.svg");}),
"[project]/src/assets/markdown.svg.mjs { IMAGE => \"[project]/src/assets/markdown.svg (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$markdown$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/assets/markdown.svg (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$markdown$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 64,
    height: 64,
    blurWidth: 0,
    blurHeight: 0
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/assets/html.svg (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/html.26abc6bb.svg");}),
"[project]/src/assets/html.svg.mjs { IMAGE => \"[project]/src/assets/html.svg (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$html$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/assets/html.svg (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$html$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 108,
    height: 123,
    blurWidth: 0,
    blurHeight: 0
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/assets/docugateLogoBlue.svg (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/docugateLogoBlue.be5d8e85.svg");}),
"[project]/src/assets/docugateLogoBlue.svg.mjs { IMAGE => \"[project]/src/assets/docugateLogoBlue.svg (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$docugateLogoBlue$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/assets/docugateLogoBlue.svg (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$docugateLogoBlue$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 189,
    height: 189,
    blurWidth: 0,
    blurHeight: 0
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/assets/crownIcon.svg (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/crownIcon.de6a71c7.svg");}),
"[project]/src/assets/crownIcon.svg.mjs { IMAGE => \"[project]/src/assets/crownIcon.svg (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$crownIcon$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/assets/crownIcon.svg (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$crownIcon$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 24,
    height: 24,
    blurWidth: 0,
    blurHeight: 0
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/system/AssetIcon.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$AssetIcon$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/modules/system/AssetIcon.module.scss [client] (css module)");
// import assets
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$generic_file$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$generic_file$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/generic_file.png.mjs { IMAGE => "[project]/src/assets/generic_file.png (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$docugate$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$docugate$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/docugate.png.mjs { IMAGE => "[project]/src/assets/docugate.png (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$docugate$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$docugate$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/docugate.svg.mjs { IMAGE => "[project]/src/assets/docugate.svg (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$word$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$word$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/word.svg.mjs { IMAGE => "[project]/src/assets/word.svg (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$powerpoint$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$powerpoint$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/powerpoint.svg.mjs { IMAGE => "[project]/src/assets/powerpoint.svg (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$pdf$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$pdf$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/pdf.png.mjs { IMAGE => "[project]/src/assets/pdf.png (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$excel$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$excel$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/excel.svg.mjs { IMAGE => "[project]/src/assets/excel.svg (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$laTex$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$laTex$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/laTex.png.mjs { IMAGE => "[project]/src/assets/laTex.png (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$logo$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$logo$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/logo.svg.mjs { IMAGE => "[project]/src/assets/logo.svg (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$logo$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$logo$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/logo.png.mjs { IMAGE => "[project]/src/assets/logo.png (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$image$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$image$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/image.png.mjs { IMAGE => "[project]/src/assets/image.png (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$json$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$json$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/json.png.mjs { IMAGE => "[project]/src/assets/json.png (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$pipeline_gray$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$pipeline_gray$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/pipeline_gray.svg.mjs { IMAGE => "[project]/src/assets/pipeline_gray.svg (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$pipeline_blue$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$pipeline_blue$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/pipeline_blue.svg.mjs { IMAGE => "[project]/src/assets/pipeline_blue.svg (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$visio$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$visio$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/visio.png.mjs { IMAGE => "[project]/src/assets/visio.png (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$typst$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$typst$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/typst.png.mjs { IMAGE => "[project]/src/assets/typst.png (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$textComponentIcon$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$textComponentIcon$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/textComponentIcon.svg.mjs { IMAGE => "[project]/src/assets/textComponentIcon.svg (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$markdown$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$markdown$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/markdown.svg.mjs { IMAGE => "[project]/src/assets/markdown.svg (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$html$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$html$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/html.svg.mjs { IMAGE => "[project]/src/assets/html.svg (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$docugateLogoBlue$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$docugateLogoBlue$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/docugateLogoBlue.svg.mjs { IMAGE => "[project]/src/assets/docugateLogoBlue.svg (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$crownIcon$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$crownIcon$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/crownIcon.svg.mjs { IMAGE => "[project]/src/assets/crownIcon.svg (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
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
;
/**
 * AssetIcon system component which can be used to render statically loaded assets which are defined at /src/assets
 * @see https://kolibri.docugate.ch/docs/components/system/AssetIcon
 */ const AssetIcon = ({ icon, size = 'big', placeholder = false })=>{
    let effSize;
    switch(size){
        case 'extra-small':
            effSize = 16;
            break;
        case 'small':
            effSize = 24;
            break;
        case 'normal':
            effSize = 28;
            break;
        case 'big':
            effSize = 42;
            break;
        case 'bigger':
            effSize = 60;
            break;
        case 'huge':
            effSize = 66;
            break;
        default:
            effSize = 72;
    }
    if (placeholder) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("span", {
        "data-cy": 'asset-icon',
        "data-size": size,
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$AssetIcon$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['asset-icon-container'],
        style: {
            width: `${effSize}px`
        }
    });
    let source;
    switch(icon){
        case 'word':
            source = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$word$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$word$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"];
            break;
        case 'powerpoint':
            source = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$powerpoint$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$powerpoint$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"];
            break;
        case 'pdf':
            source = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$pdf$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$pdf$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"];
            break;
        case 'logo-svg':
            source = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$logo$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$logo$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"];
            break;
        case 'logo':
            source = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$logo$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$logo$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"];
            break;
        case 'docugate':
            source = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$docugate$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$docugate$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"];
            break;
        case 'docugate-svg':
            source = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$docugate$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$docugate$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"];
            break;
        case 'excel':
            source = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$excel$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$excel$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"];
            break;
        case 'latex':
            source = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$laTex$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$laTex$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"];
            break;
        case 'image':
            source = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$image$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$image$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"];
            break;
        case 'json':
            source = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$json$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$json$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"];
            break;
        case 'pipeline_gray':
            source = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$pipeline_gray$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$pipeline_gray$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"];
            break;
        case 'pipeline_blue':
            source = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$pipeline_blue$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$pipeline_blue$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"];
            break;
        case 'visio':
            source = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$visio$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$visio$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"];
            break;
        case 'text_components':
            source = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$textComponentIcon$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$textComponentIcon$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"];
            break;
        case 'blueLogo':
            source = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$docugateLogoBlue$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$docugateLogoBlue$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"];
            break;
        case 'markdown':
            source = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$markdown$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$markdown$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"];
            break;
        case 'html':
            source = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$html$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$html$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"];
            break;
        case 'crown':
            source = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$crownIcon$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$crownIcon$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"];
            break;
        case 'typst':
            source = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$typst$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$typst$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"];
            break;
        default:
            source = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$generic_file$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$generic_file$2e$png__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"];
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("span", {
        "data-cy": 'asset-icon',
        "data-cy-icon": icon,
        "data-size": size,
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$AssetIcon$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['asset-icon-container'],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("img", {
            width: effSize,
            height: effSize,
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$AssetIcon$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['asset-icon'],
            src: source.src,
            alt: `Icon: ${icon}`
        })
    });
};
_c = AssetIcon;
const __TURBOPACK__default__export__ = AssetIcon;
var _c;
__turbopack_context__.k.register(_c, "AssetIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/system/Menu.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MenuItem",
    ()=>MenuItem,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Menu$2f$Menu$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Menu/Menu.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/MenuItem/MenuItem.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Menu$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/modules/system/Menu.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Link$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Link.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$MaterialIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/MaterialIcon.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$AssetIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/AssetIcon.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
;
;
;
;
;
;
;
;
/**
 * Menu system component which can be used to launch dropdown menus anywhere on the page
 * @see https://kolibri.docugate.ch/docs/components/system/Menu
 */ const Menu = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Menu$2f$Menu$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        "data-cy": 'menu',
        ref: ref,
        classes: {
            paper: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Menu$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['menu-paper-container']
        },
        ...props
    });
});
_c1 = Menu;
const MenuItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c2 = (props, ref)=>{
    const { title, subtitle, hidden, href, icon, asset, minWidth, children, shortened = false, disabled = false, useSymbols = false, ...restProps } = props;
    if (hidden) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {});
    const BaseItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("section", {
        "data-cy": 'menu-item',
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Menu$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['menuitem-container'],
        "data-shortened": shortened,
        "data-disabled": disabled,
        children: [
            icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$MaterialIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                iconSize: 'small',
                outlined: !useSymbols,
                icon: icon,
                useSymbols: useSymbols
            }),
            asset && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$AssetIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                size: 'extra-small',
                icon: asset
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("section", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Menu$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['menuitem-content'],
                children: [
                    title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                        "data-cy": 'menu-item-title',
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Menu$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['menuitem-title'],
                        title: title,
                        children: title
                    }),
                    subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                        "data-cy": 'menu-item-subtitle',
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Menu$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['menuitem-subtitle'],
                        title: subtitle,
                        children: subtitle
                    }),
                    !title && !subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                        "data-cy": 'menu-item-title',
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Menu$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['menuitem-title'],
                        title: typeof children === 'string' ? children : undefined,
                        children: children,
                        style: {
                            minWidth: minWidth
                        }
                    })
                ]
            })
        ]
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$MenuItem$2f$MenuItem$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        ref: ref,
        "data-selected": restProps.selected,
        "data-disabled": disabled,
        disabled: disabled,
        classes: {
            root: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Menu$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['menuitem-root'],
            focusVisible: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Menu$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['menuitem-focus'],
            disabled: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Menu$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['menuitem-disabled'],
            selected: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Menu$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['menuitem-selected']
        },
        ...restProps,
        children: href && !restProps.onClick ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Link$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            noDecoration: true,
            children: BaseItem,
            href: href,
            disabled: disabled
        }) : BaseItem
    });
});
_c3 = MenuItem;
const __TURBOPACK__default__export__ = Menu;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "Menu$forwardRef");
__turbopack_context__.k.register(_c1, "Menu");
__turbopack_context__.k.register(_c2, "MenuItem$forwardRef");
__turbopack_context__.k.register(_c3, "MenuItem");
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
"[project]/src/types/auth.types.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Errors which can be returned from an auth session
 */ __turbopack_context__.s([
    "AuthError",
    ()=>AuthError
]);
let AuthError = /*#__PURE__*/ function(AuthError) {
    AuthError["REFRESH_TOKEN_ERROR"] = "RefreshTokenError";
    AuthError["TOKEN_EXPIRED"] = "TokenExpiredError";
    return AuthError;
}({}); /**
 * Auth session structure
 */ 
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/AuthHook.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$auth$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/auth.types.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$utils$2f$debounce$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__debounce$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/utils/debounce.js [client] (ecmascript) <export default as debounce>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$global$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/common/global.config.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
const defaultValue = {
    token: '',
    hasToken: false,
    status: 'loading',
    login: ()=>null
};
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])(defaultValue);
const AuthProvider = ({ children, auth })=>{
    _s();
    const { status, data = {}, update } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useSession"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const session = data || {};
    const refreshTimeout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const currentStatus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(status);
    const canAuthenticate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(auth && status !== 'loading');
    const currentToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(session.token);
    const [authStatus, setAuthStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(status);
    const [token, setToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            if (!session.expires) return;
            if (refreshTimeout.current) {
                clearTimeout(refreshTimeout.current);
                refreshTimeout.current = null;
            }
            if (!canAuthenticate) return;
            // automatically refresh the token 10s before it expires
            refreshTimeout.current = setTimeout({
                "AuthProvider.useEffect": ()=>{
                    update();
                }
            }["AuthProvider.useEffect"], session.expires - Date.now() + -10 * 1000);
        }
    }["AuthProvider.useEffect"], [
        session.expires
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            if (session.error === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$auth$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["AuthError"].TOKEN_EXPIRED && canAuthenticate.current) login();
        }
    }["AuthProvider.useEffect"], [
        session.error
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            currentStatus.current = status;
            canAuthenticate.current = getCanAuthenticate();
            getAndValidateToken();
            if (hasError() && canAuthenticate.current) setAuthStatus('loading');
            else if (status === 'unauthenticated' && data === null && canAuthenticate.current) setAuthStatus('loading');
            else setAuthStatus(status);
        }
    }["AuthProvider.useEffect"], [
        status,
        auth
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$utils$2f$debounce$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__debounce$3e$__["debounce"])({
        "AuthProvider.useEffect": ()=>setToken(currentToken.current)
    }["AuthProvider.useEffect"]), [
        currentToken.current
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            if (("TURBOPACK compile-time value", "object") !== 'undefined' && session.token) sessionStorage.setItem('access_token', session.token);
            currentToken.current = session.token;
        }
    }["AuthProvider.useEffect"], [
        session.token
    ]);
    /**
   * Get whether it's currently allowed to try
   * to reauthenticate
   * @returns boolean whether a signin can be attempted
   */ const getCanAuthenticate = ()=>{
        return status !== 'loading' && auth && currentStatus.current !== 'loading';
    };
    /**
   * Get whether the server identified the session to have an error
   * @returns boolean whether the server responded with an error in the session
   */ const hasError = ()=>{
        return !!session.error;
    };
    /**
   * Check whether the active session is still valid
   * @returns boolean whether the session is valid or not
   */ const isSessionValid = ()=>{
        const isSameHost = session.hostname === window.location.hostname;
        const isExpired = Date.now() >= session.expires;
        return data && !isExpired && isSameHost;
    };
    /**
   * Get the access token which is currently stored in the session storage
   * @returns stored access token
   */ const getStoredToken = ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return sessionStorage.getItem('access_token') || '';
    };
    /**
   * Get the current token <br>
   * The token gets validated and refreshed on the fly should
   * the page require auth
   * @returns access token
   */ const getAndValidateToken = ()=>{
        if (status === 'loading') return currentToken.current || '';
        if (!canAuthenticate.current || session.token && !getStoredToken()) {
            currentToken.current = '';
        } else if (!isSessionValid()) {
            currentStatus.current = 'loading';
            currentToken.current = '';
            login();
        } else {
            currentToken.current = session.token;
        }
        if (token !== currentToken.current) setToken(currentToken.current);
        return currentToken.current;
    };
    /**
   * Log the user in when the current page conditions allow it
   */ const login = ()=>{
        const callbackUrl = router.pathname === '/auth' && !!router.query.error ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$global$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["homePath"] : router.asPath;
        if (canAuthenticate.current) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["signIn"])('zitadel', {
            callbackUrl: callbackUrl
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(AuthContext.Provider, {
        value: {
            token: getAndValidateToken(),
            hasToken: !!token,
            status: authStatus,
            login
        },
        children: children
    });
};
_s(AuthProvider, "vfISDcisBHZslfld1c0zsxXzA8M=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useSession"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthProvider;
const useAuth = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/common/Logger.class.ts [client] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/src/data/ErrorBoundary.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/common/Logger.class.ts [client] (ecmascript)");
;
;
;
// the default logging behaviour of the ErrorBoundary is a
// bit annoying but the functionality is great. Therefore,
// stay up to date until it's possible to hide the error
// messages from the error boundary
// see: https://github.com/facebook/react/issues/15069
/**
 * The ErrorBoundary can be wrapped around components to handle errors which
 * are thrown inside the component. Should an error occur the ErrorBoundary shows
 * the <ErrorContainer /> component
 */ class ErrorBoundary extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].Component {
    constructor(props){
        super(props);
        this.state = {
            error: null
        };
    }
    /**
   * Remove the error state when the route changes
   * @param prevProps previous props
   * @param prevState previous state
   */ componentDidUpdate(prevProps, prevState) {
        if (prevProps.router.asPath !== this.props.router.asPath) this.setState({
            error: null
        });
    }
    /**
   * Get the new boundary state after an error occurred inside the component tree
   * @param error error which occurred
   * @returns new state of the component
   */ static getDerivedStateFromError(error) {
        return {
            error
        };
    }
    /**
   * Function which gets called when an error is thrown inside the component tree
   * @param error error which was thrown
   * @param errorInfo stack trace of the error
   */ componentDidCatch(error, errorInfo) {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Received error:', error);
        if (typeof this.props.code !== 'undefined' && error.code !== this.props.code) {
            throw error;
        }
    }
    /**
   * Render the component
   */ render() {
        if (this.state.error) {
            const fallback = this.props.fallback(this.state.error);
            return fallback || this.props.children;
        }
        return this.props.children;
    }
}
const __TURBOPACK__default__export__ = _c = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["withRouter"])(ErrorBoundary);
var _c;
__turbopack_context__.k.register(_c, "%default%");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/styles/modules/system/containers/Container.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "arrow-back": "Container-module-scss-module__ycn52q__arrow-back",
  "container-buttons-container": "Container-module-scss-module__ycn52q__container-buttons-container",
  "container-container": "Container-module-scss-module__ycn52q__container-container",
  "container-content": "Container-module-scss-module__ycn52q__container-content",
  "container-content-container": "Container-module-scss-module__ycn52q__container-content-container",
  "container-section-container": "Container-module-scss-module__ycn52q__container-section-container",
  "container-title": "Container-module-scss-module__ycn52q__container-title",
  "container-title-container": "Container-module-scss-module__ycn52q__container-title-container",
  "container-title-icon": "Container-module-scss-module__ycn52q__container-title-icon",
  "container-title-right": "Container-module-scss-module__ycn52q__container-title-right",
  "header-container": "Container-module-scss-module__ycn52q__header-container",
  "menu": "Container-module-scss-module__ycn52q__menu",
  "title": "Container-module-scss-module__ycn52q__title",
  "title-component-container": "Container-module-scss-module__ycn52q__title-component-container",
  "trace-container": "Container-module-scss-module__ycn52q__trace-container",
  "with-back": "Container-module-scss-module__ycn52q__with-back",
  "with-back-container": "Container-module-scss-module__ycn52q__with-back-container",
});
}),
"[project]/src/styles/modules/system/Loader.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "linear-load-root": "Loader-module-scss-module__-A30uq__linear-load-root",
  "loader-root": "Loader-module-scss-module__-A30uq__loader-root",
});
}),
"[project]/src/components/system/Loader.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LinearLoader",
    ()=>LinearLoader,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$LinearProgress$2f$LinearProgress$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/LinearProgress/LinearProgress.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$CircularProgress$2f$CircularProgress$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/CircularProgress/CircularProgress.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Loader$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/modules/system/Loader.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
;
;
;
;
/**
 * Loader system component which is used to display a circular loading spinner in different sizes
 * @see https://kolibri.docugate.ch/docs/components/system/Loader
 */ const Loader = ({ variant = 'big' })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$CircularProgress$2f$CircularProgress$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        "data-cy": 'circular-loader',
        "data-variant": variant,
        classes: {
            root: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Loader$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['loader-root']
        }
    });
};
_c = Loader;
const LinearLoader = ({ variant = 'blue' })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$LinearProgress$2f$LinearProgress$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        "data-cy": 'linear-loader',
        "data-variant": variant
    });
};
_c1 = LinearLoader;
const __TURBOPACK__default__export__ = Loader;
var _c, _c1;
__turbopack_context__.k.register(_c, "Loader");
__turbopack_context__.k.register(_c1, "LinearLoader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/styles/modules/system/Button.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "action-button-container": "Button-module-scss-module__R6agOa__action-button-container",
  "button-container": "Button-module-scss-module__R6agOa__button-container",
  "button-container-container": "Button-module-scss-module__R6agOa__button-container-container",
  "button-label": "Button-module-scss-module__R6agOa__button-label",
  "buttongroup-container": "Button-module-scss-module__R6agOa__buttongroup-container",
  "buttongroup-option": "Button-module-scss-module__R6agOa__buttongroup-option",
  "create-container": "Button-module-scss-module__R6agOa__create-container",
  "favorite-button": "Button-module-scss-module__R6agOa__favorite-button",
  "icon-container": "Button-module-scss-module__R6agOa__icon-container",
  "spin": "Button-module-scss-module__R6agOa__spin",
  "tooltip-container": "Button-module-scss-module__R6agOa__tooltip-container",
});
}),
"[project]/src/styles/modules/system/Tooltip.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "tooltip-container": "Tooltip-module-scss-module__w88zDq__tooltip-container",
  "tooltip-container-container": "Tooltip-module-scss-module__w88zDq__tooltip-container-container",
  "tooltip-info-icon": "Tooltip-module-scss-module__w88zDq__tooltip-info-icon",
  "tooltip-text": "Tooltip-module-scss-module__w88zDq__tooltip-text",
});
}),
"[project]/src/components/system/Tooltip.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Tooltip$2f$Tooltip$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Tooltip/Tooltip.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Tooltip$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/modules/system/Tooltip.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Link$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Link.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$i18next$2f$dist$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-i18next/dist/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$MaterialIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/MaterialIcon.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
/**
 * Tooltip system component to easily add tooltips to any element
 * @see https://kolibri.docugate.ch/docs/components/system/Tooltip
 */ const Tooltip = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = _s(({ text, hidden, position = '', more, size = 'small', icon = 'info', outlined = true, error = false, ...props }, ref)=>{
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"])([
        'common'
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Tooltip$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['tooltip-container-container'],
        "data-position": position,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Tooltip$2f$Tooltip$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            enterDelay: 150,
            leaveDelay: 150,
            title: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                "data-cy": 'tooltip-text',
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Tooltip$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['tooltip-text'],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("span", {
                        children: text
                    }),
                    more && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Link$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        external: true,
                        target: '_blank',
                        asText: true,
                        children: t('common:docs'),
                        href: more
                    })
                ]
            }),
            ref: ref,
            placement: 'right',
            classes: {
                tooltip: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Tooltip$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['tooltip-container']
            },
            "data-cy": 'tooltip',
            ...props,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("span", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$MaterialIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    iconSize: size,
                    outlined: outlined,
                    icon: icon,
                    color: error ? 'red' : 'darkblue'
                })
            })
        })
    });
}, "vu2xTFBfHkv41zWfADiErp1aWcA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
})), "vu2xTFBfHkv41zWfADiErp1aWcA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c1 = Tooltip;
const __TURBOPACK__default__export__ = Tooltip;
var _c, _c1;
__turbopack_context__.k.register(_c, "Tooltip$forwardRef");
__turbopack_context__.k.register(_c1, "Tooltip");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/MenuHook.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MenuProvider",
    ()=>MenuProvider,
    "useMenu",
    ()=>useMenu,
    "useMenuContent",
    ()=>useMenuContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Menu$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Menu.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
;
;
;
const defaultValue = {
    openMenu: ()=>{},
    isMenuOpen: false
};
const isMenuAnchorPosition = (anchor)=>{
    return Object.keys(anchor).length === 2 && typeof anchor.x === 'number' && typeof anchor.y === 'number';
};
const MenuContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])(defaultValue);
const defaultContentValue = {
    close: ()=>null
};
const MenuContentContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])(defaultContentValue);
const MenuProvider = ({ children })=>{
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [anchorElement, setAnchorElement] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [anchorPosition, setAnchorPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        x: 0,
        y: 0
    });
    const menuItems = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const options = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    /**
   * Open a menu at any given position/element target
   * @param anchor anchor position/element
   * @param items items to be renders as menu items
   * @param menuOptions menu options which get applied to the <Menu /> element
   */ const openMenu = (anchor, items, menuOptions = null)=>{
        if (items.length === 0) return;
        options.current = menuOptions;
        menuItems.current = items;
        if (isMenuAnchorPosition(anchor)) {
            setAnchorPosition(anchor);
        } else setAnchorElement(anchor);
        setOpen(true);
    };
    /**
   * Handler which gets called when a menu gets closed
   */ const handleMenuClose = ()=>{
        setOpen(false);
        options.current = null;
        setAnchorElement(null);
        setAnchorPosition({
            x: 0,
            y: 0
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])(MenuContext.Provider, {
        value: {
            openMenu,
            isMenuOpen: open
        },
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(MenuContentContext.Provider, {
                value: {
                    close: handleMenuClose
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Menu$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    onClose: handleMenuClose,
                    open: open,
                    onClick: options.current?.closeOnClick ? handleMenuClose : undefined,
                    anchorReference: anchorElement ? 'anchorEl' : 'anchorPosition',
                    anchorPosition: {
                        left: anchorPosition.x,
                        top: anchorPosition.y
                    },
                    anchorEl: anchorElement,
                    children: menuItems.current,
                    anchorOrigin: {
                        horizontal: 'right',
                        vertical: 'bottom'
                    }
                })
            })
        ]
    });
};
_s(MenuProvider, "b/RZgfTaoyGPU/GwhNPucqHIyE8=");
_c = MenuProvider;
const useMenu = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(MenuContext);
    if (!context) throw new Error('useMenu must be used within a MenuProvider');
    return context;
};
_s1(useMenu, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
const useMenuContent = ()=>{
    _s2();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(MenuContentContext);
    if (!context) throw new Error('useMenuContent must be used within a MenuContentProvider');
    return context;
};
_s2(useMenuContent, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "MenuProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/system/Button.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ButtonContainer",
    ()=>ButtonContainer,
    "ButtonGroup",
    ()=>ButtonGroup,
    "ContainerCreateButton",
    ()=>ContainerCreateButton,
    "FavoriteButton",
    ()=>FavoriteButton,
    "MenuButton",
    ()=>MenuButton,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Button$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/modules/system/Button.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Loader$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Loader.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$MaterialIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/MaterialIcon.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Menu$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Menu.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Link$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Link.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Tooltip$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Tooltip.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$MenuHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/MenuHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature();
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
/**
 * Button system component which can be used to make the user click something
 * @see https://kolibri.docugate.ch/docs/components/system/Button
 */ const Button = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = (props, ref)=>{
    const { variant = 'red', disabled = false, loading = false, onClick, appearance, href, icon = false, size = 'normal', children, hoverspin = false, iconOutlined = false, useSymbols = false, external = false, target, ...restProps } = props;
    const iconElement = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$MaterialIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        outlined: iconOutlined,
        icon: icon || '',
        iconSize: size,
        useSymbols: useSymbols
    });
    const BaseButton = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("button", {
        "data-cy": 'button',
        "data-cy-role": href ? 'link' : 'button',
        "data-cy-button": 'button',
        ref: ref,
        "data-disabled": disabled || loading,
        disabled: disabled || loading,
        "data-variant": variant,
        "data-hoverspin": hoverspin,
        "data-size": size,
        "data-icon": !!icon,
        "data-appearance": appearance ? appearance : icon ? 'icon' : 'button',
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Button$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['button-container'],
        type: "button",
        onClick: onClick,
        ...restProps,
        children: [
            children,
            icon && !loading && iconElement,
            loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Loader$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                variant: "button"
            })
        ]
    });
    if (href && !disabled) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Link$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        noDecoration: true,
        href: href,
        external: external,
        target: target,
        children: BaseButton
    });
    return BaseButton;
});
_c1 = Button;
const MenuButton = ({ value, children, onClick, locked = false, ...props })=>{
    _s();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { openMenu } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$MenuHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useMenu"])();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleClick = (event)=>{
        if (props.disabled) return;
        // only forward click events which come directly from the button and not from the menu items
        if (onClick && event.target instanceof HTMLButtonElement) onClick(event);
        if (children) openMenu(event.currentTarget, children, {
            closeOnClick: true
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])(Button, {
        "data-cy-button": 'menu-button',
        ref: ref,
        onClick: handleClick,
        ...props,
        children: [
            value,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Menu$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                "data-cy-role": 'menu-button',
                onClick: (e)=>locked && e.stopPropagation(),
                closeAfterTransition: true,
                onClose: ()=>setOpen(false),
                open: open,
                anchorEl: ref.current,
                children: children
            })
        ]
    });
};
_s(MenuButton, "BX1vkvkgV7nQI/3FFCQlh5b2Qj0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$MenuHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useMenu"]
    ];
});
_c2 = MenuButton;
const ContainerCreateButton = ({ onClick, disabled = false, children, icon = 'add', appearance = 'roundedIcon', variant = 'green', size = 'big', padding = true, tooltip })=>{
    _s1();
    const [mouseOver, setMouseOver] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const checkIfDisabled = ()=>{
        setMouseOver(!disabled);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("span", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Button$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['create-container'],
        "data-padding": padding,
        "data-cy": 'container-create',
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                "data-cy": 'add-button',
                onClick: disabled ? null : onClick,
                "data-disabled": disabled,
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Button$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['action-button-container'],
                onMouseLeave: ()=>setMouseOver(false),
                onMouseEnter: checkIfDisabled,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Button$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['button-label'],
                        children: children,
                        "data-hovered": mouseOver,
                        "data-disabled": disabled
                    }),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("span", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(Button, {
                            disabled: disabled,
                            "data-hovered": mouseOver,
                            icon: icon,
                            appearance: appearance,
                            variant: variant,
                            size: size
                        })
                    })
                ]
            }),
            tooltip && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Tooltip$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                text: tooltip.text,
                more: tooltip.more,
                size: "big"
            })
        ]
    });
};
_s1(ContainerCreateButton, "WGkgYAF/KHjgYvhoRBbHveckBQU=");
_c3 = ContainerCreateButton;
const FavoriteButton = ({ onClick, isFavorite = false, visible = true })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Button$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['favorite-button'],
        "data-isfavorite": isFavorite,
        "data-visible": visible,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$MaterialIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            outlined: !isFavorite,
            icon: 'grade',
            onClick: onClick
        })
    });
_c4 = FavoriteButton;
const ButtonGroup = ({ size = 'normal', fullWidth = false, options, navGap })=>{
    _s2();
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [flexDirection, setFlexDirection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('row');
    const singleNodeWidth = 100; // each node has at least 100px width
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ButtonGroup.useEffect": ()=>{
            if (!ref.current) return;
            if (ref.current.clientWidth <= singleNodeWidth * ref.current.childElementCount) setFlexDirection('column');
            else setFlexDirection('row');
        }
    }["ButtonGroup.useEffect"], [
        ref.current
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ButtonGroup.useEffect": ()=>{
            // set flex-direction to row or column depending on the width and the child node amount
            const handler = {
                "ButtonGroup.useEffect.handler": ()=>{
                    if (ref.current.clientWidth <= singleNodeWidth * ref.current.childElementCount) setFlexDirection('column');
                    else setFlexDirection('row');
                }
            }["ButtonGroup.useEffect.handler"];
            window.addEventListener('resize', handler);
            return ({
                "ButtonGroup.useEffect": ()=>{
                    window.removeEventListener('resize', handler);
                }
            })["ButtonGroup.useEffect"];
        }
    }["ButtonGroup.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("section", {
        "data-cy": 'button-group',
        "data-direction": flexDirection,
        ref: ref,
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Button$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['buttongroup-container'],
        "data-nav-gap": navGap,
        "data-fullwidth": fullWidth,
        children: options.map((optionProps, index)=>{
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(ButtonGroupOption, {
                size: size,
                ...optionProps
            }, index);
        })
    });
};
_s2(ButtonGroup, "18uV2c9gwFb09O4CFPLioc5YX2E=");
_c5 = ButtonGroup;
/**
 * A single option of a <ButtonGroup />
 */ const ButtonGroupOption = ({ size = 'normal', selected, disabled, label, href, onClick })=>{
    _s3();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const sharedProps = {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Button$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['buttongroup-option'],
        'data-disabled': disabled,
        'data-size': size,
        'data-selected': selected,
        'data-cy-button': 'button-group-option',
        onClick: !selected ? onClick : undefined,
        children: label
    };
    const handleClick = async (event)=>{
        event.preventDefault();
        if (selected) return;
        await router.push(href);
        if (onClick) onClick();
    };
    if (href && router.asPath !== href && !disabled) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("a", {
        href: href,
        ...sharedProps,
        onClick: handleClick
    });
    else return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("button", {
        type: 'button',
        disabled: disabled,
        ...sharedProps
    });
};
_s3(ButtonGroupOption, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c6 = ButtonGroupOption;
const ButtonContainer = ({ children, hidden = false, spread = true, ...props })=>{
    const { marginTop = false } = props;
    if (hidden) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {});
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("section", {
        "data-cy": 'button-container',
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Button$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['button-container-container'],
        "data-spread": spread,
        "data-margin-top": marginTop,
        children: children
    });
};
_c7 = ButtonContainer;
const __TURBOPACK__default__export__ = Button;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7;
__turbopack_context__.k.register(_c, "Button$forwardRef");
__turbopack_context__.k.register(_c1, "Button");
__turbopack_context__.k.register(_c2, "MenuButton");
__turbopack_context__.k.register(_c3, "ContainerCreateButton");
__turbopack_context__.k.register(_c4, "FavoriteButton");
__turbopack_context__.k.register(_c5, "ButtonGroup");
__turbopack_context__.k.register(_c6, "ButtonGroupOption");
__turbopack_context__.k.register(_c7, "ButtonContainer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/DocugateTranslateHook.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DocugateTranslateProvider",
    ()=>DocugateTranslateProvider,
    "useDocugateTranslate",
    ()=>useDocugateTranslate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
const defaultValue = {
    translate: ()=>''
};
const DocugateTranslateContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])(defaultValue);
const DocugateTranslateProvider = ({ children })=>{
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    /**
   * Translate an internationalized object
   * @param values object with translations
   * @param dynamic if true, the most matching translation will be returned, otherwise the invariant translation
   * @returns the current translation
   */ const translate = (values, dynamic = false)=>{
        if (typeof values === 'string') return values;
        if (!values || Object.keys(values).length === 0) return '';
        if (dynamic) {
            const locale = router.locale || 'en';
            const matching = Object.entries(values).find(([key, _])=>key.toLowerCase().startsWith(locale))?.at(0);
            return values[locale] || values[matching] || values['inv'] || Object.values(values)[0] || '';
        }
        return values['inv'] || '';
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(DocugateTranslateContext.Provider, {
        value: {
            translate
        },
        children: children
    });
};
_s(DocugateTranslateProvider, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = DocugateTranslateProvider;
const useDocugateTranslate = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(DocugateTranslateContext);
    if (!context) throw new Error('useDocugateTranslate must be used within a DocugateTranslateProvider');
    return context;
};
_s1(useDocugateTranslate, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "DocugateTranslateProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/common/error.config.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "defaultError",
    ()=>defaultError,
    "mappedErrors",
    ()=>mappedErrors
]);
const mappedErrors = {
    500: {
        title: {
            inv: 'Server side error',
            en: 'Server side error',
            de: 'Serverseitiger Fehler',
            fr: 'Erreur côté serveur'
        },
        description: {
            inv: 'A server side error has occured. Please try again later or contact your system administrator should the error persist.',
            en: 'A server side error has occured. Please try again later or contact your system administrator should the error persist.',
            de: 'Ein serverseitiger Fehler ist aufgetreten. Versuchen Sie es später erneut oder kontaktieren Sie Ihren Systemadministrator sollte das Problem längerfristig auftreten',
            fr: "Une erreur côté serveur s'est produite. Veuillez réessayer plus tard ou contacter votre administrateur système si l'erreur persiste."
        }
    },
    404: {
        title: {
            inv: 'Resource not found',
            en: 'Resource not found',
            de: 'Ressource nicht gefunden',
            fr: 'Ressource non trouvée'
        },
        description: {
            inv: "The requested resource couldn't be found. Please ensure the provided url exists, try again later or contact your system administrator.",
            en: "The requested resource couldn't be found. Please ensure the provided url exists, try again later or contact your system administrator.",
            de: 'Die angeforderte Ressource konnte nicht gefunden werden. Versichern Sie sich, dass die eingegebene url existiert, versuchen Sie es später erneut oder kontaktieren Sie Ihren Systemadministrator',
            fr: "La ressource demandée n'a pas pu être trouvée. Veuillez vous assurer que l'url fournie existe, réessayez plus tard ou contactez votre administrateur système."
        }
    },
    403: {
        title: {
            inv: 'Forbidden',
            en: 'Forbidden',
            de: 'Verboten',
            fr: 'Interdit'
        },
        description: {
            inv: 'You are lacking the permissions to access the requested resource.',
            en: 'You are lacking the permissions to access the requested resource.',
            de: 'Ihnen fehlen die nötigen Berechtigungen, um auf die angeforderte Ressource zuzugreifen',
            fr: "Vous n'avez pas les autorisations nécessaires pour accéder à la ressource demandée."
        }
    },
    401: {
        title: {
            inv: 'Unauthorized',
            en: 'Unauthorized',
            de: 'Unbefugt',
            fr: 'Non autorisé'
        },
        description: {
            inv: 'The authorization is missing or an error occured during the login process. Please try later or contact your system administrator.',
            en: 'The authorization is missing or an error occured during the login process. Please try later or contact your system administrator.',
            de: 'Die Befugnis ist unzureichend oder ein Fehler ist während dem Authorizieren aufgetreten. Versuchen Sie es später erneut oder kontaktieren Sie Ihren Systemadministrator.',
            fr: "L'autorisation est manquante ou une erreur s'est produite pendant le processus de connexion. Veuillez essayer plus tard ou contacter votre administrateur système."
        }
    }
};
const defaultError = {
    title: {
        inv: 'Error',
        en: 'Error',
        de: 'Fehler',
        fr: 'Erreur'
    },
    description: {
        inv: 'An error has occured. Please try again later or contact your system administrator.',
        en: 'An error has occured. Please try again later or contact your system administrator.',
        de: 'Es ist ein Fehler aufgetreten. Versuchen Sie es später erneut oder kontaktieren Sie Ihren Systemadministrator.',
        fr: "Une erreur s'est produite. Veuillez réessayer plus tard ou contacter votre administrateur système."
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/styles/modules/system/ContainerSection.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "container-section-container": "ContainerSection-module-scss-module__ZndbhW__container-section-container",
  "container-section-title-container": "ContainerSection-module-scss-module__ZndbhW__container-section-title-container",
  "creatable-section-content-container": "ContainerSection-module-scss-module__ZndbhW__creatable-section-content-container",
  "creatable-section-header-container": "ContainerSection-module-scss-module__ZndbhW__creatable-section-header-container",
  "expandable-container-section-container": "ContainerSection-module-scss-module__ZndbhW__expandable-container-section-container",
  "info-icon": "ContainerSection-module-scss-module__ZndbhW__info-icon",
  "label-container": "ContainerSection-module-scss-module__ZndbhW__label-container",
});
}),
"[project]/src/styles/modules/system/Form.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "form-container": "Form-module-scss-module__OdjesW__form-container",
  "form-row-container": "Form-module-scss-module__OdjesW__form-row-container",
  "form-section-container": "Form-module-scss-module__OdjesW__form-section-container",
});
}),
"[project]/src/components/system/Form.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FormRow",
    ()=>FormRow,
    "FormSection",
    ()=>FormSection,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Form$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/modules/system/Form.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Tooltip$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Tooltip.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
/**
 * Form system component can be used as a wrapper for a form
 */ const Form = ({ className = '', gapSize = 'normal', onSubmit, onKeyDown, ...props })=>{
    _s();
    const locked = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const handleSubmit = (event)=>{
        // This prevents the form from being submitted on enter press
        // When the enter key was pressed less than 10ms before the submit event
        // then the submit event was caused by this key-event and should be
        // prevented
        if (Date.now() - locked.current <= 10) event.preventDefault();
        else if (onSubmit) onSubmit(event);
    };
    const handleKeyDown = (event)=>{
        if (event.code === 'Enter') locked.current = Date.now();
        if (onKeyDown) onKeyDown(event);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("form", {
        "data-cy": 'form',
        onSubmit: handleSubmit,
        onKeyDown: handleKeyDown,
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Form$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['form-container']} ${className}`,
        "data-gap-size": gapSize,
        ...props
    });
};
_s(Form, "lCKaUxU6qyb9YnQqCzTcVElmE/A=");
_c = Form;
const FormRow = ({ children, gapSize = 'big', spread = false })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
        "data-cy": 'form-row',
        "data-spread": spread,
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Form$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['form-row-container'],
        "data-gap-size": gapSize,
        children: children
    });
};
_c1 = FormRow;
const FormSection = ({ children, label, tooltip, gapSize = 'normal' })=>{
    const preparedLabel = label ? `${label}`.endsWith(':') ? `${label}` : `${label}:` : '';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Form$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['form-section-container'],
        "data-gap-size": gapSize,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("label", {
                children: [
                    preparedLabel,
                    tooltip && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Tooltip$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        ...tooltip
                    })
                ]
            }),
            children
        ]
    });
};
_c2 = FormSection;
const __TURBOPACK__default__export__ = Form;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "Form");
__turbopack_context__.k.register(_c1, "FormRow");
__turbopack_context__.k.register(_c2, "FormSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/system/ContainerSection.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ContainerSectionForm",
    ()=>ContainerSectionForm,
    "ContainerSectionTitle",
    ()=>ContainerSectionTitle,
    "CreatableSection",
    ()=>CreatableSection,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Tooltip$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Tooltip.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$ContainerSection$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/modules/system/ContainerSection.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Form$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Form.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$MaterialIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/MaterialIcon.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Button.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
/**
 * ContainerSection system component which contains a section of the content of a container which can be visually differentiated from other sections
 */ const ContainerSection = ({ children, background, gap, padding, ...rest })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("section", {
        "data-cy": 'container-section',
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$ContainerSection$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['container-section-container'],
        "data-gap": gap,
        "data-padding": padding,
        "data-background": background,
        children: children,
        ...rest
    });
};
_c = ContainerSection;
const CreatableSection = ({ children, onClick, expanded = false, ...rest })=>{
    _s();
    const [isExpanded, setIsExpanded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(expanded);
    const handleClick = async ()=>{
        if (onClick) {
            const result = await onClick(isExpanded);
            if (result != isExpanded) setIsExpanded(result);
        } else {
            setIsExpanded(!isExpanded);
        }
    };
    const variant = isExpanded ? 'blue' : 'green';
    const appearance = isExpanded ? 'roundedIconTransparent' : 'roundedIcon';
    const icon = isExpanded ? 'delete' : 'add';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$ContainerSection$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['creatable-section-header-container'],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(ContainerSectionTitle, {
                        ...rest
                    }),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        variant: variant,
                        appearance: appearance,
                        icon: icon,
                        iconOutlined: true,
                        onClick: handleClick
                    })
                ]
            }),
            isExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$ContainerSection$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['creatable-section-content-container'],
                children: children
            })
        ]
    });
};
_s(CreatableSection, "RMFlZSDZtFF+H26TEQMXP7pVvZw=");
_c1 = CreatableSection;
const ContainerSectionForm = ({ padding = true, gap, ...rest })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Form$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        "data-cy": 'container-section',
        "data-padding": padding,
        "data-gap": gap,
        "data-cy-form": true,
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$ContainerSection$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['container-section-container'],
        ...rest
    });
};
_c2 = ContainerSectionForm;
const ContainerSectionTitle = ({ label, disabled = false, tooltip = {} })=>{
    const { text } = tooltip;
    const preparedLabel = text ? label.endsWith(':') ? label : `${label}:` : label.endsWith(':') ? label.substring(0, label.length - 2) : label;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("section", {
        "data-cy": 'container-section-title',
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$ContainerSection$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['container-section-title-container'],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$ContainerSection$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['label-container'],
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("span", {
                    "data-cy": 'container-section-title-label',
                    "data-tab": true,
                    children: preparedLabel
                }),
                text && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Tooltip$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    ...tooltip,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$MaterialIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        outlined: true,
                        icon: "info",
                        iconSize: "small"
                    })
                })
            ]
        })
    });
};
_c3 = ContainerSectionTitle;
const __TURBOPACK__default__export__ = ContainerSection;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "ContainerSection");
__turbopack_context__.k.register(_c1, "CreatableSection");
__turbopack_context__.k.register(_c2, "ContainerSectionForm");
__turbopack_context__.k.register(_c3, "ContainerSectionTitle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/styles/modules/system/Copyable.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "copyable": "Copyable-module-scss-module__c0dGwG__copyable",
});
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
"[project]/src/common/helper.common.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addRandomSuffix",
    ()=>addRandomSuffix,
    "constructSelectorString",
    ()=>constructSelectorString,
    "deepMerge",
    ()=>deepMerge,
    "delay",
    ()=>delay,
    "downloadResource",
    ()=>downloadResource,
    "getFileMime",
    ()=>getFileMime,
    "getFunctionTypes",
    ()=>getFunctionTypes,
    "getMappingFunctions",
    ()=>getMappingFunctions,
    "getMimeEnvironment",
    ()=>getMimeEnvironment,
    "getMimeExtensions",
    ()=>getMimeExtensions,
    "getNamePlaceholder",
    ()=>getNamePlaceholder,
    "getQueryFunctions",
    ()=>getQueryFunctions,
    "getQueryInvocation",
    ()=>getQueryInvocation,
    "getRequestErrors",
    ()=>getRequestErrors,
    "getTemplateEnvironments",
    ()=>getTemplateEnvironments,
    "getTemplateExtension",
    ()=>getTemplateExtension,
    "getTemplateMime",
    ()=>getTemplateMime,
    "isJSONEqual",
    ()=>isJSONEqual,
    "isJWTExpired",
    ()=>isJWTExpired,
    "isNumberLimitReached",
    ()=>isNumberLimitReached,
    "isSameOperatorGroup",
    ()=>isSameOperatorGroup,
    "isValidUUID",
    ()=>isValidUUID,
    "parseDateValue",
    ()=>parseDateValue,
    "parseErrorLogs",
    ()=>parseErrorLogs,
    "parseJWT",
    ()=>parseJWT,
    "parseJsonLiteralKey",
    ()=>parseJsonLiteralKey,
    "parseLanguageHeader",
    ()=>parseLanguageHeader,
    "parseSelector",
    ()=>parseSelector,
    "sortTemplateResources",
    ()=>sortTemplateResources,
    "storeQueryInvocation",
    ()=>storeQueryInvocation,
    "storeRequestErrors",
    ()=>storeRequestErrors,
    "throwRequestError",
    ()=>throwRequestError,
    "toggleElementInArray",
    ()=>toggleElementInArray,
    "transformFieldError",
    ()=>transformFieldError,
    "updateJsonLiteralKey",
    ()=>updateJsonLiteralKey,
    "validateDate",
    ()=>validateDate,
    "validateInternalName",
    ()=>validateInternalName,
    "validateJson",
    ()=>validateJson
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/compiled/buffer/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/sdk/src/types/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/types/template.types.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$global$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/common/global.config.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/moment/moment.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/common/Logger.class.ts [client] (ecmascript)");
;
;
;
;
const downloadResource = (resource, name)=>{
    const url = typeof resource === 'string' ? resource : URL.createObjectURL(resource);
    const fileName = name || resource.name || 'Unnamed Download';
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.setAttribute('download', fileName);
    anchor.click();
};
const transformFieldError = (error, locale)=>{
    const hasError = !!error;
    let helperText;
    if (locale) {
        const parsedError = error || {};
        helperText = parsedError[locale]?.message || parsedError[locale]?.type;
    } else helperText = error?.message || error?.type;
    return {
        error: hasError,
        helperText: helperText
    };
};
const isNumberLimitReached = (input)=>{
    return input >= Number.MAX_SAFE_INTEGER || input <= Number.MIN_SAFE_INTEGER ? 'numberLimit' : true;
};
const delay = (milliseconds)=>{
    return new Promise((resolve)=>setTimeout(()=>resolve(), milliseconds));
};
const getTemplateMime = (environment)=>{
    const environments = getTemplateEnvironments();
    const currentEnvironment = environments.find((value)=>environment === value.key);
    // should no environments be returned from getTemplateEnvironments() the request was probably
    // not finished yet. To ensure in this case the icons are displayed properly the description
    // gets defaulted to the environment in order to "search" for the mime type inside the
    // environment string
    const description = currentEnvironment?.description?.toLowerCase() || environment;
    if (!description) return 'unknown';
    else if (description.includes('word')) return 'word';
    else if (description.includes('powerpoint') || description.includes('ppt') || description.includes('presentation')) return 'powerpoint';
    else if (description.includes('excel')) return 'excel';
    else if (description.includes('pdf')) return 'pdf';
    else if (description.includes('text')) return 'markdown';
    else if (description.includes('visio')) return 'visio';
    else if (description.includes('typst')) return 'typst';
    else if (description.includes('tex')) return 'latex'; // !! Need to be last because text includes also tex
    else return 'unknown';
};
const getMimeExtensions = (mime)=>{
    switch(mime){
        case 'word':
            return [
                '.docx'
            ];
        case 'powerpoint':
            return [
                '.pptx'
            ];
        case 'excel':
            return [
                '.xlsx',
                '.xlsm'
            ];
        case 'pdf':
            return [
                '.pdf'
            ];
        case 'latex':
            return [
                '.tex'
            ];
        case 'visio':
            return [
                '.vsdx',
                '.vsdm'
            ];
        case 'markdown':
            return [
                '.md'
            ];
        case 'typst':
            return [
                '.typ'
            ];
    }
    return [];
};
const getFileMime = (filename)=>{
    switch(filename?.toLowerCase().split('.').pop()?.trim()){
        case 'docx':
        case 'doc':
            return 'word';
        case 'pptx':
        case 'pptm':
        case 'ppt':
            return 'powerpoint';
        case 'xlsx':
        case 'xlsm':
        case 'xlsb':
        case 'xltx':
            return 'excel';
        case 'pdf':
            return 'pdf';
        case 'png':
        case 'jpg':
        case 'tiff':
        case 'svg':
            return 'image';
        case 'json':
            return 'json';
        case 'tex':
        case 'latex':
            return 'latex';
        case 'vsdx':
        case 'vsdm':
            return 'visio';
        case 'md':
        case 'text/markdown':
            return 'markdown';
        case 'typ':
            return 'typst';
        default:
            return 'unknown';
    }
};
const getMimeEnvironment = (mime)=>{
    switch(mime){
        case 'word':
            return __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].Word;
        case 'excel':
            return __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].Excel;
        case 'powerpoint':
            return __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].PowerPoint;
        case 'visio':
            return __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].Visio;
        case 'pdf':
            return __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].Pdf;
        case 'latex':
            return __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].Latex;
        case 'typst':
            return __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$types$2f$template$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["TemplateEnvironmentKey"].Typst;
        default:
            return '';
    }
};
const getTemplateEnvironments = ()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const parsed = JSON.parse(sessionStorage.getItem('template_environments') || '[]');
    if (!Array.isArray(parsed)) {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].warn("Template environments aren't an array but instead of type " + typeof parsed);
        return [];
    } else return parsed;
};
const getTemplateExtension = (template)=>{
    return template?.resources?.filter(({ key })=>key.toLowerCase().startsWith('template.') || key.toLowerCase().startsWith('master_template.')).map(({ key })=>key.split('.').pop())[0];
};
const getMappingFunctions = (functions)=>{
    return functions.filter((func)=>func.type === 'functions.docugate.ch/v1alpha1/types/mapping');
};
const getQueryFunctions = (functions)=>{
    return functions.filter((func)=>func.type === 'functions.docugate.ch/v1alpha1/types/query');
};
const isValidUUID = (uuid)=>{
    return uuid && !!uuid.match(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$global$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["UUID_REGEX"]);
};
const isJSONEqual = (first, second)=>{
    return JSON.stringify(first) === JSON.stringify(second);
};
const parseJWT = (token)=>{
    const split = (token || '').split('.');
    if (split.length !== 3) return {};
    return JSON.parse(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$buffer$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Buffer"].from(split[1], 'base64').toString());
};
const isJWTExpired = (token)=>{
    const jwt = parseJWT(token);
    return !jwt.exp || Date.now() / 1000 > jwt.exp;
};
const sortTemplateResources = (resources)=>{
    return resources.sort((a, b)=>{
        return a.key.localeCompare(b.key, undefined, {
            numeric: true
        });
    });
};
const getFunctionTypes = ()=>{
    return [
        'functions.docugate.ch/v1alpha1/types/mapping',
        'functions.docugate.ch/v1alpha1/types/query',
        'functions.docugate.ch/v1alpha1/types/buildtask'
    ];
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
const storeQueryInvocation = (uuid, invocation)=>{
    const storage = JSON.parse(localStorage.getItem('query_invocations') || '{}');
    storage[uuid] = invocation;
    localStorage.setItem('query_invocations', JSON.stringify(storage));
};
const getQueryInvocation = (uuid)=>{
    const storage = JSON.parse(localStorage.getItem('query_invocations') || '{}');
    return storage[uuid];
};
const throwRequestError = (error)=>{
    throw {
        ...error,
        timestamp: Date.now(),
        path: '',
        trace: ''
    };
};
const validateDate = (value)=>{
    if (value === '') return true;
    if (value && typeof value === 'string') {
        const date = parseDateValue(value);
        return date?.year() > 1000 && date?.year() < 3000 || 'invalidDate';
    } else if (!value || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].isMoment(value) && value?.isValid() && value?.year() > 1000 && value?.year() < 3000) return true;
    return 'invalidDate';
};
const validateJson = (value)=>{
    try {
        return !!JSON.parse(value) || 'invalidJson';
    } catch (e) {
        return 'invalidJson';
    }
};
const validateInternalName = (name)=>{
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$global$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["PROPERTY_INTERNAL_NAME_VALIDATION"].test(name)) return 'patternNameNotValid';
    else return true;
};
const getNamePlaceholder = (name = '')=>{
    const words = name.split(' ');
    return words.map((word)=>word.length > 0 ? word.substring(0, 1) : '').join('');
};
const parseLanguageHeader = (raw = '')=>{
    const match = raw?.match(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$global$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["ACCEPT_LANGUAGE_REGEX"]);
    if (match) return match[0]?.split('-')[0];
    else return undefined;
};
const parseSelector = (selector)=>{
    const tryParseIn = (segment)=>{
        const match = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$global$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["IN_NOT_IN_REGEX"].exec(segment);
        if (!match) return undefined;
        return {
            key: match.groups.label,
            operator: match.groups.in === 'in' ? 'In' : 'notIn',
            value: match.groups.values.split(',').map((value)=>value.trim())
        };
    };
    const tryParseEquals = (segment)=>{
        const match = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$global$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EQ_NOT_EQ_REGEX"].exec(segment);
        if (!match) return undefined;
        return {
            key: match.groups.label,
            operator: match.groups.eq === '=' ? 'Eq' : 'notEq',
            value: [
                match.groups.value
            ]
        };
    };
    const tryParseExists = (segment)=>{
        const match = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$global$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["EXISTS_NOT_EXISTS_REGEX"].exec(segment);
        if (!match) return undefined;
        return {
            key: match.groups.label,
            operator: match.groups.ex === '!' ? 'notExists' : 'Exists'
        };
    };
    const tryParseContains = (segment)=>{
        const match = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$global$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["CONTAINS_NOT_CONTAINS_REGEX"].exec(segment);
        if (!match) return undefined;
        return {
            key: match.groups.label,
            operator: match.groups.op === '~' ? 'Contains' : 'notContains',
            value: [
                match.groups.value
            ]
        };
    };
    return selector.split(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$global$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["SELECTOR_SEGMENT_REGEX"]).map((segment)=>{
        return tryParseIn(segment) || tryParseContains(segment) || tryParseEquals(segment) || tryParseExists(segment);
    }).filter(Boolean);
};
const constructSelectorString = (selectors)=>{
    return selectors.map((selector)=>{
        if (!selector) return '';
        if (selector.operator === 'Exists') return `${selector.key}`;
        else if (selector.operator === 'notExists') return `!${selector.key}`;
        else if (selector.operator === 'Contains' && selector.value) return `${selector.key} ~ ${selector.value[0]}`;
        else if (selector.operator === 'notContains' && selector.value) return `${selector.key} !~ ${selector.value[0]}`;
        else if (selector.operator === 'In' && selector.value) return `${selector.key} in (${selector.value.join(',')})`;
        else if (selector.operator === 'notIn' && selector.value) return `${selector.key} notin (${selector.value.join(',')})`;
        else if (selector.operator === 'Eq' && selector.value) return `${selector.key} = ${selector.value[0]}`;
        else if (selector.operator === 'notEq' && selector.value) return `${selector.key} != ${selector.value[0]}`;
        else return '';
    }).join(',');
};
const isSameOperatorGroup = (operator1, operator2)=>{
    if (operator1 === operator2) return true;
    if (operator1 === 'Eq' && operator2 === 'notEq') return true;
    if (operator1 === 'notEq' && operator2 === 'Eq') return true;
    if (operator1 === 'Exists' && operator2 === 'notExists') return true;
    if (operator1 === 'notExists' && operator2 === 'Exists') return true;
    if (operator1 === 'In' && operator2 === 'notIn') return true;
    return operator1 === 'notIn' && operator2 === 'In';
};
const parseJsonLiteralKey = (key, json)=>{
    const keys = key.split('.');
    const value = keys.reduce((obj, key)=>{
        if (obj && typeof obj === 'object') return obj[key];
        else return undefined;
    }, json);
    return value;
};
const updateJsonLiteralKey = (key, value, json)=>{
    const keys = key.split('.');
    const lastKey = keys.pop();
    const obj = keys.reduce((obj, key)=>{
        if (obj && typeof obj === 'object') return obj[key];
        else return undefined;
    }, json);
    if (!obj) {
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].warn(`Could not find object for key ${key} in json ${JSON.stringify(json)}`);
        return obj;
    }
    obj[lastKey] = value;
    return json;
};
const toggleElementInArray = (array, element)=>{
    const index = array.indexOf(element);
    if (index === -1) {
        return [
            ...array,
            element
        ];
    } else {
        const newArray = [
            ...array
        ];
        newArray.splice(index, 1);
        return newArray;
    }
};
const isObject = (item)=>{
    return !!item && typeof item === 'object' && !Array.isArray(item);
};
const deepMerge = (target, ...sources)=>{
    if (!sources.length) return target;
    const source = sources.shift();
    if (source && isObject(target) && isObject(source)) {
        for(const key in source){
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, {
                    [key]: {}
                });
                deepMerge(target[key], source[key]);
            } else {
                Object.assign(target, {
                    [key]: source[key]
                });
            }
        }
    }
    return sources.length ? deepMerge(target, ...sources) : target;
};
const parseDateValue = (value, customFormat)=>{
    if (!value) return null;
    const formatsToTry = [
        'DD.MM.YYYY',
        'DD/MM/YYYY',
        'DD-MM-YYYY',
        customFormat
    ];
    const initialParsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(value, true);
    if (initialParsed.isValid()) {
        return initialParsed;
    }
    for (const format of formatsToTry){
        const parsed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(value, format, true);
        if (parsed.isValid()) {
            return parsed;
        }
    }
    return null;
};
const parseErrorLogs = (error)=>{
    if (!error) {
        return undefined;
    } else if (Array.isArray(error)) {
        return error;
    } else if (typeof error === 'string') {
        return [
            error
        ];
    } else if (typeof error === 'object') {
        const { code, errorCode, message, trace } = error;
        const codeLog = [
            code,
            errorCode
        ].filter(Boolean).join(' - ') || undefined;
        const traceLog = trace && `Trace ID: ${trace}`;
        const logs = [
            codeLog,
            message,
            traceLog
        ].filter(Boolean);
        return logs.length ? logs : undefined;
    }
};
const addRandomSuffix = (fileName, charactersCount = 8)=>{
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    let suffix = '_';
    for(let i = 0; i < charactersCount; i++){
        suffix += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    const dotIndex = fileName.lastIndexOf('.');
    if (dotIndex === -1) {
        return fileName + suffix;
    }
    const name = fileName.slice(0, dotIndex);
    const extension = fileName.slice(dotIndex);
    return `${name}${suffix}${extension}`;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/system/Copyable.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Tooltip$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Tooltip.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Copyable$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/modules/system/Copyable.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$i18next$2f$dist$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-i18next/dist/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$helper$2e$common$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/common/helper.common.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
/**
 * Copyable system component which can be used to make some text copyable on click
 */ const Copyable = ({ text, children, position })=>{
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"])([
        'common'
    ]);
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const mounted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Copyable.useEffect": ()=>{
            mounted.current = true;
            return ({
                "Copyable.useEffect": ()=>{
                    mounted.current = false;
                }
            })["Copyable.useEffect"];
        }
    }["Copyable.useEffect"]);
    const handleCopyClick = async ()=>{
        if (navigator.clipboard) await navigator.clipboard.writeText(text);
        else {
            // fallback for browsers which don't support clipboard api (e.g. Firefox)
            const el = document.createElement('textarea');
            el.value = text;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
        }
        if (mounted.current) setCopied(true);
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$helper$2e$common$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["delay"])(100);
        if (mounted.current) setCopied(false);
    };
    const tooltip = copied ? t('common:copied-to-clipboard') : t('common:copy-to-clipboard');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Tooltip$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                text: tooltip,
                position: position
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("span", {
                "data-cy": 'copyable',
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Copyable$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['copyable'],
                onClick: handleCopyClick,
                children: children
            })
        ]
    });
};
_s(Copyable, "niMTXi+sVJKFvpd2BmD9lhvExqg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c = Copyable;
const __TURBOPACK__default__export__ = Copyable;
var _c;
__turbopack_context__.k.register(_c, "Copyable");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/styles/modules/system/BaseDrawer.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "basedrawer-backdrop": "BaseDrawer-module-scss-module__FJg-DW__basedrawer-backdrop",
  "basedrawer-container": "BaseDrawer-module-scss-module__FJg-DW__basedrawer-container",
  "basedrawer-content": "BaseDrawer-module-scss-module__FJg-DW__basedrawer-content",
  "basedrawer-heading": "BaseDrawer-module-scss-module__FJg-DW__basedrawer-heading",
  "basedrawer-title": "BaseDrawer-module-scss-module__FJg-DW__basedrawer-title",
  "left-slide-in": "BaseDrawer-module-scss-module__FJg-DW__left-slide-in",
  "left-slide-out": "BaseDrawer-module-scss-module__FJg-DW__left-slide-out",
  "right-slide-in": "BaseDrawer-module-scss-module__FJg-DW__right-slide-in",
  "right-slide-out": "BaseDrawer-module-scss-module__FJg-DW__right-slide-out",
});
}),
"[project]/src/components/system/BaseDrawer.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$BaseDrawer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/modules/system/BaseDrawer.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$MaterialIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/MaterialIcon.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DrawerHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/DrawerHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$utils$2f$debounce$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__debounce$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/utils/debounce.js [client] (ecmascript) <export default as debounce>");
/**
 * BaseDrawer system component which is used as a wrapper for all drawers defined at /src/components/drawers
 * https://kolibri.docugate.ch/docs/modals-and-drawers
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
const BaseDrawer = /*#__PURE__*/ _s(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].memo(_c = _s(({ children })=>{
    _s();
    const { title, onClose, open, orientation, uuid } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DrawerHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useDrawerContent"])();
    const [next, setNext] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(orientation || 'unset');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$utils$2f$debounce$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__debounce$3e$__["debounce"])({
        "BaseDrawer.useEffect": ()=>{
            setNext(orientation || 'unset');
        }
    }["BaseDrawer.useEffect"], 200), [
        orientation
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BaseDrawer.useEffect": ()=>{
            const handleKeyPress = {
                "BaseDrawer.useEffect.handleKeyPress": (event)=>{
                    if (event.key === 'Escape') {
                        event.preventDefault();
                        handleClose();
                    }
                }
            }["BaseDrawer.useEffect.handleKeyPress"];
            window.addEventListener('keydown', handleKeyPress);
            return ({
                "BaseDrawer.useEffect": ()=>{
                    window.removeEventListener('keydown', handleKeyPress);
                }
            })["BaseDrawer.useEffect"];
        }
    }["BaseDrawer.useEffect"]);
    const handleClose = ()=>onClose(uuid);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("section", {
                "data-cy": 'drawer',
                id: uuid,
                "data-open": open,
                "data-orientation": next,
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$BaseDrawer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['basedrawer-container'],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                        "data-cy": 'drawer-heading',
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$BaseDrawer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['basedrawer-heading'],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("span", {
                                "data-cy": 'drawer-title',
                                "data-tab": true,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$BaseDrawer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['basedrawer-title'],
                                children: title
                            }),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("span", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$MaterialIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                    iconSize: 'big',
                                    clickable: true,
                                    onClick: handleClose,
                                    icon: 'close'
                                })
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("section", {
                        "data-cy": 'drawer-content',
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$BaseDrawer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['basedrawer-content'],
                        children: next !== 'unset' && children
                    })
                ]
            }),
            next !== 'unset' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                "data-cy": 'drawer-backdrop',
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$BaseDrawer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['basedrawer-backdrop'],
                onClick: handleClose
            })
        ]
    });
}, "+UmTSZSCSLPqsLiUy5cMJG+0t/o=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DrawerHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useDrawerContent"]
    ];
})), "+UmTSZSCSLPqsLiUy5cMJG+0t/o=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DrawerHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useDrawerContent"]
    ];
});
_c1 = BaseDrawer;
const __TURBOPACK__default__export__ = BaseDrawer;
var _c, _c1;
__turbopack_context__.k.register(_c, "BaseDrawer$React.memo");
__turbopack_context__.k.register(_c1, "BaseDrawer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/DrawerHook.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DrawerProvider",
    ()=>DrawerProvider,
    "useDrawer",
    ()=>useDrawer,
    "useDrawerContent",
    ()=>useDrawerContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/v4.js [client] (ecmascript) <export default as v4>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$BaseDrawer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/BaseDrawer.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
;
;
;
;
const defaultValue = {
    openDrawer: ()=>'',
    awaitDrawerResult: ()=>undefined,
    currentDrawer: null
};
const DrawerContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])(defaultValue);
const defaultContentValue = {
    title: null,
    uuid: null,
    open: false,
    setTitle: ()=>null,
    onClose: ()=>null,
    onCallback: ()=>null,
    hasCallback: false
};
const DrawerContentContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])(defaultContentValue);
const DrawerProvider = ({ children })=>{
    _s();
    const [currentDrawer, setCurrentDrawer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(undefined);
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DrawerProvider.useEffect": ()=>{
            setOpen(!!currentDrawer?.uuid);
        }
    }["DrawerProvider.useEffect"], [
        currentDrawer?.uuid
    ]);
    /**
   * Open a drawer instance
   * @param drawer drawer to open
   */ const openDrawer = (drawer)=>{
        const uuid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])();
        if (drawer.title) setTitle(drawer.title);
        setCurrentDrawer({
            ...drawer,
            uuid
        });
        return uuid;
    };
    /**
   * Open a drawer instance and wait for its result
   * @param drawer drawer to open
   */ const awaitDrawerResult = (drawer)=>{
        return new Promise((resolve)=>{
            openDrawer({
                ...drawer,
                onCallback: resolve
            });
        });
    };
    /**
   * Handle the closure of a drawer
   */ const handleDrawerClose = ()=>{
        setOpen(false);
        if (currentDrawer?.onClose) currentDrawer.onClose();
        setCurrentDrawer(undefined);
    };
    /**
   * Handle the callback value of a drawer
   * @param uuid uuid of the drawer
   * @param args callback arguments of the drawer
   */ const handleDrawerCallback = (uuid, ...args)=>{
        handleDrawerClose();
        if (currentDrawer?.onCallback) currentDrawer.onCallback(...args);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])(DrawerContext.Provider, {
        value: {
            openDrawer,
            currentDrawer,
            awaitDrawerResult
        },
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(DrawerContentContext.Provider, {
                value: {
                    open,
                    title,
                    setTitle,
                    onCallback: handleDrawerCallback,
                    hasCallback: !!currentDrawer?.onCallback,
                    onClose: handleDrawerClose,
                    uuid: currentDrawer?.uuid,
                    orientation: currentDrawer?.orientation
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$BaseDrawer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    children: currentDrawer?.element && currentDrawer.element
                })
            })
        ]
    });
};
_s(DrawerProvider, "xT8fMxNk819jZJyTrsuOrFLuKvg=");
_c = DrawerProvider;
const useDrawer = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(DrawerContext);
    if (!context) throw new Error('useDrawer must be used within a DrawerProvider');
    return context;
};
_s1(useDrawer, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
const useDrawerContent = (title)=>{
    _s2();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(DrawerContentContext);
    if (!context) throw new Error('useDrawerContent must be used within a DrawerContentProvider');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useDrawerContent.useEffect": ()=>{
            if (title) context.setTitle(title);
        }
    }["useDrawerContent.useEffect"], [
        title,
        context.uuid
    ]);
    return context;
};
_s2(useDrawerContent, "wqnYpdjMkT3eDhbBjwDmfBO/TFg=");
var _c;
__turbopack_context__.k.register(_c, "DrawerProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/system/containers/Container.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ContainerContent",
    ()=>ContainerContent,
    "NavigationButtons",
    ()=>NavigationButtons,
    "TitleComponent",
    ()=>TitleComponent,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$i18next$2f$dist$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-i18next/dist/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$global$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/common/global.config.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$ErrorBoundary$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/ErrorBoundary.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$container$2f$ErrorContainer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/container/ErrorContainer.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$containers$2f$Container$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/modules/system/containers/Container.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Loader$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Loader.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Button.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$AssetIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/AssetIcon.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DocugateTranslateHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/DocugateTranslateHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$error$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/common/error.config.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$ContainerSection$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/ContainerSection.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Copyable$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Copyable.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$MaterialIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/MaterialIcon.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DrawerHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/DrawerHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Menu$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Menu.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
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
/**
 * Container system container which can be used as page container
 * @see https://kolibri.docugate.ch/docs/components/container/Container
 */ const Container = /*#__PURE__*/ _s(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].memo(_c = _s((props)=>{
    _s();
    const { className = '', background = false, children, withBackDisabled = false, ...rest } = props;
    let withBack = rest.withBack || false;
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { currentDrawer } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DrawerHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useDrawer"])();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"])([
        'common'
    ]);
    const backPath = typeof withBack === 'string' ? withBack : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$global$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["homePath"];
    if (router.pathname === backPath) withBack = false;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$ErrorBoundary$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        fallback: (error)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$container$2f$ErrorContainer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                trace: error.trace,
                code: error.code
            }),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Suspense"], {
            fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("section", {
                "data-cy": 'container',
                "data-cy-role": 'fallback',
                "data-drawer": !!currentDrawer,
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$containers$2f$Container$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['container-container']} ${className || ''}`,
                "data-background": background,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Loader$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["LinearLoader"], {})
            }),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("section", {
                "data-cy": 'container',
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$containers$2f$Container$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['container-container']} ${!withBack ? className : ''}`,
                "data-withback": withBack,
                "data-drawer": !!currentDrawer,
                "data-background": background,
                children: [
                    !withBack && children,
                    withBack && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("section", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$containers$2f$Container$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['with-back-container'],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$containers$2f$Container$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['with-back'],
                                "data-cy": 'container-back',
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                    children: t('common:back'),
                                    size: 'small',
                                    variant: 'blue',
                                    href: backPath,
                                    disabled: withBackDisabled
                                })
                            }),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("section", {
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$containers$2f$Container$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['container-content']} ${className}`,
                                children: children
                            })
                        ]
                    })
                ]
            })
        })
    });
}, "3jNIw8KLSmwrj37wvt5NmaIZiN0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DrawerHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useDrawer"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
})), "3jNIw8KLSmwrj37wvt5NmaIZiN0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DrawerHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useDrawer"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c1 = Container;
const NavigationButtons = ({ options })=>{
    if (options.length <= 1) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {});
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["ButtonGroup"], {
        options: options,
        fullWidth: true,
        size: "small",
        navGap: true
    });
};
_c2 = NavigationButtons;
const ContainerContent = ({ children })=>{
    _s1();
    const { translate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DocugateTranslateHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useDocugateTranslate"])();
    const handleError = (error)=>{
        const translated = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$error$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["mappedErrors"][error.code] || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$error$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["defaultError"];
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$ContainerSection$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            background: 'background-container',
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$ContainerSection$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["ContainerSectionTitle"], {
                    label: translate(translated.title)
                }),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                    "data-menu": true,
                    children: translate(translated.description)
                }),
                error.trace && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$containers$2f$Container$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['trace-container'],
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Copyable$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        text: error.trace,
                        children: error.trace
                    })
                })
            ]
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$ErrorBoundary$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        fallback: handleError,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Suspense"], {
            fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Loader$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["LinearLoader"], {}),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("section", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$containers$2f$Container$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['container-content-container'],
                children: children
            })
        })
    });
};
_s1(ContainerContent, "m1XhUcaWh+nJTE56Hiwrh3qCszY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DocugateTranslateHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useDocugateTranslate"]
    ];
});
_c3 = ContainerContent;
const TitleComponent = ({ title, iconSize = 'big', icon, menuItems = [], href, asset, additionalContent, onBackClick })=>{
    _s2();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const showBackButton = !!href || !!onBackClick;
    const handleClickBack = ()=>{
        if (onBackClick) {
            onBackClick();
        } else {
            router.push(href);
        }
    };
    const handleClick = (event)=>{
        const element = event.target;
        element.querySelector('button')?.click();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("section", {
        "data-cy": 'container-content-title',
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$containers$2f$Container$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['title-component-container'],
        children: [
            showBackButton && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                onClick: handleClickBack,
                "data-cy": 'container-back',
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$containers$2f$Container$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['arrow-back'],
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$MaterialIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    icon: 'arrow_back_ios_new'
                })
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$containers$2f$Container$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['title'],
                "data-cy": 'container-title',
                children: [
                    icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$MaterialIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        icon: icon,
                        iconSize: 'huge'
                    }),
                    asset && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$AssetIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        icon: asset,
                        size: iconSize
                    }),
                    title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$containers$2f$Container$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['textbox'],
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("h2", {
                            children: title
                        })
                    }),
                    additionalContent
                ]
            }),
            menuItems.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$containers$2f$Container$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['menu'],
                onClick: handleClick,
                "data-cy": 'container-menu-button',
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["MenuButton"], {
                    "data-cy-button": 'container-content-links',
                    onClick: (event)=>event.stopPropagation(),
                    icon: "more_vert",
                    variant: "transparent",
                    children: menuItems.map(({ label, icon, href, onClick, disabled = false })=>{
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Menu$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["MenuItem"], {
                            icon: icon,
                            href: href,
                            children: label,
                            onClick: onClick,
                            disabled: disabled
                        }, label);
                    })
                })
            })
        ]
    });
};
_s2(TitleComponent, "fN7XvhJ+p5oE6+Xlo0NJmXpxjC8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c4 = TitleComponent;
const __TURBOPACK__default__export__ = Container;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "Container$React.memo");
__turbopack_context__.k.register(_c1, "Container");
__turbopack_context__.k.register(_c2, "NavigationButtons");
__turbopack_context__.k.register(_c3, "ContainerContent");
__turbopack_context__.k.register(_c4, "TitleComponent");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/styles/modules/container/ErrorContainer.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "back-button": "ErrorContainer-module-scss-module__EhaEIa__back-button",
  "bird": "ErrorContainer-module-scss-module__EhaEIa__bird",
  "error-code": "ErrorContainer-module-scss-module__EhaEIa__error-code",
  "error-container": "ErrorContainer-module-scss-module__EhaEIa__error-container",
  "error-content": "ErrorContainer-module-scss-module__EhaEIa__error-content",
  "error-description": "ErrorContainer-module-scss-module__EhaEIa__error-description",
  "error-icon-container": "ErrorContainer-module-scss-module__EhaEIa__error-icon-container",
  "error-title": "ErrorContainer-module-scss-module__EhaEIa__error-title",
  "trace-container": "ErrorContainer-module-scss-module__EhaEIa__trace-container",
});
}),
"[project]/src/assets/comicBird1.svg (static in ecmascript, tag client)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/comicBird1.3135f533.svg");}),
"[project]/src/assets/comicBird1.svg.mjs { IMAGE => \"[project]/src/assets/comicBird1.svg (static in ecmascript, tag client)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$comicBird1$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__ = __turbopack_context__.i("[project]/src/assets/comicBird1.svg (static in ecmascript, tag client)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$comicBird1$2e$svg__$28$static__in__ecmascript$2c$__tag__client$29$__["default"],
    width: 719,
    height: 294,
    blurWidth: 0,
    blurHeight: 0
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/container/ErrorContainer.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$containers$2f$Container$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/containers/Container.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$container$2f$ErrorContainer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/modules/container/ErrorContainer.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Copyable$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Copyable.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$comicBird1$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$comicBird1$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/comicBird1.svg.mjs { IMAGE => "[project]/src/assets/comicBird1.svg (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Button.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$i18next$2f$dist$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-i18next/dist/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
const Error = ({ code, withBack = true, trace })=>{
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"])([
        'common'
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$containers$2f$Container$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        background: true,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$container$2f$ErrorContainer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['error-container'],
                "data-cy": 'error',
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("h1", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$container$2f$ErrorContainer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['error-code'],
                        "data-localization": code?.toString().length === 3,
                        children: code && code.toString().split('').map((char, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                                children: char
                            }, index))
                    }),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$container$2f$ErrorContainer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['error-icon-container'],
                        children: code?.toString().length < 4 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$comicBird1$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$comicBird1$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$container$2f$ErrorContainer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['bird'],
                            alt: `Icon: 'error-bird'`
                        })
                    })
                ]
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$container$2f$ErrorContainer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['error-content'],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("h2", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$container$2f$ErrorContainer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['error-title'],
                        "data-cy": 'error',
                        "data-cy-error": code,
                        "data-cy-role": 'title',
                        children: t(`common:error.${code}-title`, {
                            defaultValue: t(`common:error.error`)
                        })
                    }),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$container$2f$ErrorContainer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['error-description'],
                        "data-cy-role": 'description',
                        "data-menu": true,
                        children: t(`common:error.${code}-description`, {
                            defaultValue: t(`common:error.description`)
                        })
                    }),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$container$2f$ErrorContainer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['back-button'],
                        children: withBack && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                            children: t('common:back-to-mainpage'),
                            size: 'normal',
                            variant: 'red',
                            href: '/template',
                            disabled: false
                        })
                    })
                ]
            }),
            trace && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                "data-cy-role": 'trace',
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$container$2f$ErrorContainer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['trace-container'],
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Copyable$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    text: trace,
                    children: trace
                })
            })
        ]
    });
};
_s(Error, "vu2xTFBfHkv41zWfADiErp1aWcA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c = Error;
const __TURBOPACK__default__export__ = Error;
var _c;
__turbopack_context__.k.register(_c, "Error");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/PermissionHook.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PermissionProvider",
    ()=>PermissionProvider,
    "usePermission",
    ()=>usePermission
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$immutable$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/swr/dist/immutable/index.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/sdk/src/requests/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$permission$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/permission.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$AuthHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/AuthHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layouts$2f$GlobalLayout$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layouts/GlobalLayout.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$container$2f$ErrorContainer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/container/ErrorContainer.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
const defaultValue = {
    tenantPermissions: [],
    userPermissions: [],
    hasPermission: ()=>false,
    hasGrant: ()=>false,
    grantsReady: false,
    versioningEnabled: false,
    isReady: false
};
const getActionKey = (action)=>{
    return `${action.verb}@${action.resource}`;
};
const PermissionContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])(defaultValue);
const PermissionProvider = ({ children })=>{
    _s();
    const { hasToken } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$AuthHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { isFallback } = router;
    const [grantsReady, setGrantsReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const userPermissions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$immutable$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"])(!isFallback && hasToken && 'user_permissions', {
        "PermissionProvider.useSWRImmutable[userPermissions]": ()=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$permission$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getUserPermissions"])();
        }
    }["PermissionProvider.useSWRImmutable[userPermissions]"]);
    const userGrants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$immutable$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"])(!isFallback && hasToken && 'user_grants', {
        "PermissionProvider.useSWRImmutable[userGrants]": ()=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$permission$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getUserGrants"])();
        }
    }["PermissionProvider.useSWRImmutable[userGrants]"]);
    const hasTenantPermission = hasGrant('get@permissions', 'v1alpha1.authorization.docugate.ch');
    const tenantPermissions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$immutable$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"])(hasTenantPermission && 'tenant_permissions', {
        "PermissionProvider.useSWRImmutable[tenantPermissions]": ()=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$permission$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getTenantPermissions"])();
        }
    }["PermissionProvider.useSWRImmutable[tenantPermissions]"]);
    const tenantSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$immutable$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"])(!isFallback && hasToken ? 'tenant_setting' : null, {
        "PermissionProvider.useSWRImmutable[tenantSettings]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$permission$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getTenantSettings"])()
    }["PermissionProvider.useSWRImmutable[tenantSettings]"], {
        suspense: false
    });
    const tenantSettingsLoaded = tenantSettings.data !== undefined || tenantSettings.error !== undefined;
    const versioningFeature = tenantSettings.data?.protected?.featureEntitlements?.find((entitlement)=>entitlement.feature === 'v2.template.versioning.docugate.ch');
    const versioningEnabled = tenantSettingsLoaded ? versioningFeature?.active ?? false : defaultValue.versioningEnabled;
    const isReady = tenantSettingsLoaded && grantsReady;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PermissionProvider.useEffect": ()=>{
            if (userGrants.data) setGrantsReady(true);
        }
    }["PermissionProvider.useEffect"], [
        userGrants.data
    ]);
    if (tenantSettings.error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layouts$2f$GlobalLayout$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            auth: false,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$container$2f$ErrorContainer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                code: tenantSettings.error.code || 500,
                trace: tenantSettings.error.trace,
                withBack: false
            })
        });
    }
    /**
   * Check whether the logged-in user has a given permission
   * @param permission permission to check
   * @returns boolean whether the logged-in user has this permission
   */ const hasPermission = (permission)=>{
        return !!userPermissions.data?.find(({ permissionid })=>permissionid === permission.id);
    };
    /**
   * Function to check whether a user has a given action granted
   * @param grant combined verb and resource of the action
   * @param apigroup api group of the resource
   * @returns boolean whether the action is granted
   */ function hasGrant(grant, apigroup) {
        if (!grantsReady) return false;
        const cachedGrant = userGrants.data?.find((action)=>{
            return grant === getActionKey(action) && apigroup === action.apigroup;
        });
        return !!cachedGrant;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(PermissionContext.Provider, {
        value: {
            hasGrant,
            tenantPermissions: tenantPermissions.data || [],
            userPermissions: userPermissions.data || [],
            hasPermission,
            grantsReady,
            versioningEnabled,
            isReady
        },
        children: children
    });
};
_s(PermissionProvider, "sWGPobUnAwBprJfqNOoEV8GgTpg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$AuthHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$immutable$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$immutable$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$immutable$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$immutable$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"]
    ];
});
_c = PermissionProvider;
const usePermission = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(PermissionContext);
    if (!context) throw new Error('usePermission must be used within a PermissionProvider');
    return context;
};
_s1(usePermission, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "PermissionProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/swr/AuthMiddleware.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addAuth",
    ()=>addAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$AuthHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/AuthHook.tsx [client] (ecmascript)");
;
const addAuth = (useSWRNext)=>{
    var _s = __turbopack_context__.k.signature();
    return _s((key, fetcher, config)=>{
        _s();
        const { hasToken, token } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$AuthHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useAuth"])();
        return useSWRNext(hasToken && key, fetcher, config);
    }, "bcnIWlhrjOQTzNkbFLWN+PI6gdk=", false, function() {
        return [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$AuthHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useAuth"],
            useSWRNext
        ];
    });
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/swr/JsonMiddleware.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "parseJSON",
    ()=>parseJSON
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
;
const parseJSON = (useSWRNext)=>{
    var _s = __turbopack_context__.k.signature();
    return _s((key, fetcher, config)=>{
        _s();
        const [validating, setValidating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
        const [jsonData, setJsonData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(undefined);
        const mounted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(false);
        // invoke the hook
        const data = useSWRNext(key, fetcher, config);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
            "parseJSON.useEffect": ()=>{
                mounted.current = true;
                return ({
                    "parseJSON.useEffect": ()=>{
                        mounted.current = false;
                    }
                })["parseJSON.useEffect"];
            }
        }["parseJSON.useEffect"], []);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
            "parseJSON.useEffect": ()=>{
                if (data.isValidating) setValidating(true);
                else if (data.data) setValidating(true);
                else setValidating(false);
            }
        }["parseJSON.useEffect"], [
            data.isValidating
        ]);
        // parse the received json blob to an object
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
            "parseJSON.useEffect": ()=>{
                if (data.data instanceof Blob) {
                    data.data.text().then({
                        "parseJSON.useEffect": (text)=>{
                            if (mounted.current) setJsonData(JSON.parse(text));
                        }
                    }["parseJSON.useEffect"]).catch({
                        "parseJSON.useEffect": ()=>{}
                    }["parseJSON.useEffect"]).finally({
                        "parseJSON.useEffect": ()=>{
                            if (mounted.current) setValidating(false);
                        }
                    }["parseJSON.useEffect"]);
                }
            }
        }["parseJSON.useEffect"], [
            data.data
        ]);
        return {
            ...data,
            isValidating: data.isValidating || validating,
            data: jsonData
        };
    }, "8pfdhtf6bePRBl2+jcijiZH8pss=", false, function() {
        return [
            useSWRNext
        ];
    });
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/swr/UuidMiddleware.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "validUUID",
    ()=>validUUID
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$helper$2e$common$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/common/helper.common.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
;
;
const validUUID = (useSWRNext)=>{
    var _s = __turbopack_context__.k.signature();
    return _s((key, fetcher, config)=>{
        _s();
        const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
        const validUuid = isKeyValidUuid(key);
        const data = useSWRNext(validUuid && key, fetcher, config);
        if (!validUuid && key && router.query.uuid) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$helper$2e$common$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["throwRequestError"])({
                code: 400,
                name: 'Invalid UUID',
                message: 'The provided path uuid is invalid'
            });
        }
        return data;
    }, "/Y3zcqnEO81RGl2yZYRckFv1o+I=", false, function() {
        return [
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
            useSWRNext
        ];
    });
};
/**
 * Check whether a provided key contains a valid uuid
 * @param key key to be checked
 * @returns boolean whether there is a valid uuid
 */ const isKeyValidUuid = (key)=>{
    if (Array.isArray(key) && key.length > 0) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$helper$2e$common$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["isValidUUID"])(key[0]);
    else if (typeof key === 'string') return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$helper$2e$common$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["isValidUUID"])(key);
    else return false;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/swr/index.ts [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$swr$2f$AuthMiddleware$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/swr/AuthMiddleware.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$swr$2f$JsonMiddleware$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/swr/JsonMiddleware.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$swr$2f$UuidMiddleware$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/swr/UuidMiddleware.tsx [client] (ecmascript)");
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/UserHook.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UserProvider",
    ()=>UserProvider,
    "useUser",
    ()=>useUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/swr/dist/index/index.mjs [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/sdk/src/requests/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$masterdata$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/masterdata.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$swr$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/data/swr/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$swr$2f$AuthMiddleware$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/swr/AuthMiddleware.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
;
;
;
const defaultValue = null;
const UserContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])(defaultValue);
const UserProvider = ({ children })=>{
    _s();
    const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useSession"])().data;
    const { data, error } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])(`userdata`, __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$masterdata$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getUserData"], {
        use: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$swr$2f$AuthMiddleware$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["addAuth"]
        ],
        shouldRetryOnError: true
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(UserContext.Provider, {
        value: !error ? data : session?.user,
        children: children
    });
};
_s(UserProvider, "UL7ZkX/A7bSoK9hdFURXedmZCVE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useSession"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"]
    ];
});
_c = UserProvider;
const useUser = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(UserContext);
    if (!context) return null;
    return context;
};
_s1(useUser, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "UserProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/masterdata/UserIndexHook.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UserIndexProvider",
    ()=>UserIndexProvider,
    "useUserIndex",
    ()=>useUserIndex
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/sdk/src/requests/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$masterdata$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/masterdata.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$swr$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/src/data/swr/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$swr$2f$AuthMiddleware$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/swr/AuthMiddleware.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$immutable$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/swr/dist/immutable/index.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
;
;
const defaultValue = null;
const UserIndexContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])(defaultValue);
const UserIndexProvider = ({ children })=>{
    _s();
    const { data } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$immutable$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"])(`userIndexData`, __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$masterdata$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getUserIndex"], {
        use: [
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$swr$2f$AuthMiddleware$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["addAuth"]
        ],
        shouldRetryOnError: true
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(UserIndexContext.Provider, {
        value: data,
        children: children
    });
};
_s(UserIndexProvider, "lPTj/P3gKBCxBlpt3iJY5xgxa8Q=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$immutable$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["default"]
    ];
});
_c = UserIndexProvider;
const useUserIndex = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(UserIndexContext);
    if (!context) return null;
    return context;
};
_s1(useUserIndex, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "UserIndexProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/styles/modules/system/Divider.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "separating-line": "Divider-module-scss-module__xeHxna__separating-line",
});
}),
"[project]/src/components/system/Divider.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Divider$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/modules/system/Divider.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
;
;
const Divider = ({ orientation = 'horizontal' })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Divider$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['separating-line'],
        "data-orientation": orientation
    });
_c = Divider;
const __TURBOPACK__default__export__ = Divider;
var _c;
__turbopack_context__.k.register(_c, "Divider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/styles/modules/system/Drawer.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "footer-of-drawer-content": "Drawer-module-scss-module__pYd1ta__footer-of-drawer-content",
  "nav-footer-container": "Drawer-module-scss-module__pYd1ta__nav-footer-container",
  "nav-item-content": "Drawer-module-scss-module__pYd1ta__nav-item-content",
  "separating-line": "Drawer-module-scss-module__pYd1ta__separating-line",
  "side-nav-container": "Drawer-module-scss-module__pYd1ta__side-nav-container",
  "side-nav-heading-container": "Drawer-module-scss-module__pYd1ta__side-nav-heading-container",
});
}),
"[project]/src/components/drawers/SideDrawerContainer.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FooterOfDrawer",
    ()=>FooterOfDrawer,
    "NavigationItems",
    ()=>NavigationItems,
    "SideNavContainer",
    ()=>SideNavContainer,
    "SideNavContainerContent",
    ()=>SideNavContainerContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Divider$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Divider.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Drawer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/modules/system/Drawer.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$AssetIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/AssetIcon.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$i18next$2f$dist$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-i18next/dist/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Link$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Link.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
const NavigationItems = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].memo(_c = ({ items, onItemClick, uuid, showDivider })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            showDivider && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Divider$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}),
            items.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                    onClick: ()=>onItemClick(uuid),
                    children: item
                }, `nav-group-${index}`))
        ]
    }));
_c1 = NavigationItems;
const SideNavContainerContent = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].memo(_c2 = ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("nav", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Drawer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['side-nav-heading-container'],
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$AssetIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    icon: 'blueLogo',
                    size: 'huge'
                })
            }),
            children
        ]
    }));
_c3 = SideNavContainerContent;
const SideNavContainer = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].memo(_c4 = ({ children })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Drawer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['side-nav-container'],
        children: children,
        "data-cy": 'menu'
    }));
_c5 = SideNavContainer;
const FooterOfDrawer = /*#__PURE__*/ _s(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].memo(_c6 = _s(()=>{
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"])('common');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Drawer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['nav-footer-container'],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Divider$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Drawer$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['footer-of-drawer-content'],
                children: t('common:need-help')
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Link$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                asText: true,
                href: "https://docs.docugate.cloud/",
                children: t('common:docs')
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("br", {}),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Link$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                asText: true,
                href: "mailto:servicedesk@docugate.ch",
                children: 'servicedesk@docugate.ch'
            })
        ]
    });
}, "vu2xTFBfHkv41zWfADiErp1aWcA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
})), "vu2xTFBfHkv41zWfADiErp1aWcA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c7 = FooterOfDrawer;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7;
__turbopack_context__.k.register(_c, "NavigationItems$React.memo");
__turbopack_context__.k.register(_c1, "NavigationItems");
__turbopack_context__.k.register(_c2, "SideNavContainerContent$React.memo");
__turbopack_context__.k.register(_c3, "SideNavContainerContent");
__turbopack_context__.k.register(_c4, "SideNavContainer$React.memo");
__turbopack_context__.k.register(_c5, "SideNavContainer");
__turbopack_context__.k.register(_c6, "FooterOfDrawer$React.memo");
__turbopack_context__.k.register(_c7, "FooterOfDrawer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/drawers/SideNavigationDrawer.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DrawerHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/DrawerHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$drawers$2f$SideDrawerContainer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/drawers/SideDrawerContainer.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
const SideNavigationDrawer = /*#__PURE__*/ _s(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].memo(_c = _s(({ navItems })=>{
    _s();
    const { onClose, uuid } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DrawerHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useDrawerContent"])(' '); // keep the space
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$drawers$2f$SideDrawerContainer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["SideNavContainer"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$drawers$2f$SideDrawerContainer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["SideNavContainerContent"], {
                children: navItems?.map((items, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$drawers$2f$SideDrawerContainer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["NavigationItems"], {
                        items: items,
                        onItemClick: onClose,
                        uuid: uuid,
                        showDivider: index > 0
                    }, `nav-item-${index}`))
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$drawers$2f$SideDrawerContainer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["FooterOfDrawer"], {})
        ]
    });
}, "l7LN6hETwdZQYj7OHN4iqfX4Bq8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DrawerHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useDrawerContent"]
    ];
})), "l7LN6hETwdZQYj7OHN4iqfX4Bq8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DrawerHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useDrawerContent"]
    ];
});
_c1 = SideNavigationDrawer;
const __TURBOPACK__default__export__ = SideNavigationDrawer;
var _c, _c1;
__turbopack_context__.k.register(_c, "SideNavigationDrawer$React.memo");
__turbopack_context__.k.register(_c1, "SideNavigationDrawer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/styles/modules/ProfileMenu.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "actions-container": "ProfileMenu-module-scss-module__X90lQa__actions-container",
  "email": "ProfileMenu-module-scss-module__X90lQa__email",
  "profile-menu-container": "ProfileMenu-module-scss-module__X90lQa__profile-menu-container",
  "profile-section": "ProfileMenu-module-scss-module__X90lQa__profile-section",
  "tenants-container": "ProfileMenu-module-scss-module__X90lQa__tenants-container",
  "user-data-container": "ProfileMenu-module-scss-module__X90lQa__user-data-container",
});
}),
"[project]/src/components/ProfileMenu.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$ProfileMenu$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/modules/ProfileMenu.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Link$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Link.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$i18next$2f$dist$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-i18next/dist/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$UserHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/UserHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$masterdata$2f$UserIndexHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/masterdata/UserIndexHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Divider$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Divider.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DrawerHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/DrawerHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
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
const ProfileMenu = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("section", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$ProfileMenu$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['profile-menu-container'],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(ProfileUserData, {}),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Divider$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(ProfileActions, {})
        ]
    });
};
_c = ProfileMenu;
const ProfileSection = ({ className = '', children })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("section", {
        "data-cy": 'profile-section',
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$ProfileMenu$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['profile-section']} ${className}`,
        children: children
    });
};
_c1 = ProfileSection;
const ProfileUserData = ()=>{
    _s();
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$UserHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useUser"])();
    const userIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$masterdata$2f$UserIndexHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useUserIndex"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])(ProfileSection, {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$ProfileMenu$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['user-data-container'],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("h3", {
                children: user?.[userIndex?.titleField] || ''
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("span", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$ProfileMenu$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['email'],
                children: user?.[userIndex?.subtitleField] || ''
            })
        ]
    });
};
_s(ProfileUserData, "0bIh018D8PmieunvEIa3xa/SiaI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$UserHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useUser"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$masterdata$2f$UserIndexHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useUserIndex"]
    ];
});
_c2 = ProfileUserData;
const ProfileActions = ()=>{
    _s1();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"])([
        'common'
    ]);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { onClose, uuid } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DrawerHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useDrawerContent"])();
    const handleSignOut = async ()=>{
        const redirectUrl = 'https://docugate.leuchterag.ch/themen';
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["signOut"])({
            redirect: true
        });
        router.push(redirectUrl);
        onClose(uuid);
    };
    const handleOpenProfile = async ()=>{
        router.push('/masterdata/profile');
        onClose(uuid);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])(ProfileSection, {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$ProfileMenu$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['actions-container'],
        onClick: close,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Link$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                hoverAnimation: true,
                href: '/masterdata/profile',
                children: t('common:profile.my'),
                onClick: handleOpenProfile
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Link$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                hoverAnimation: true,
                onClick: handleSignOut,
                children: t('common:profile.signOut')
            })
        ]
    });
};
_s1(ProfileActions, "bVmPlTHDGg1YLsGqP6SycH4QCrs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DrawerHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useDrawerContent"]
    ];
});
_c3 = ProfileActions;
const __TURBOPACK__default__export__ = ProfileMenu;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "ProfileMenu");
__turbopack_context__.k.register(_c1, "ProfileSection");
__turbopack_context__.k.register(_c2, "ProfileUserData");
__turbopack_context__.k.register(_c3, "ProfileActions");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/drawers/ProfilMenuDrawer.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProfileMenu$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ProfileMenu.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$drawers$2f$SideDrawerContainer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/drawers/SideDrawerContainer.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
;
;
;
;
const ProfilMenuDrawer = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].memo(_c = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$drawers$2f$SideDrawerContainer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["SideNavContainer"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$drawers$2f$SideDrawerContainer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["SideNavContainerContent"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProfileMenu$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {})
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$drawers$2f$SideDrawerContainer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["FooterOfDrawer"], {})
        ]
    });
});
_c1 = ProfilMenuDrawer;
const __TURBOPACK__default__export__ = ProfilMenuDrawer;
var _c, _c1;
__turbopack_context__.k.register(_c, "ProfilMenuDrawer$React.memo");
__turbopack_context__.k.register(_c1, "ProfilMenuDrawer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/styles/modules/system/WhatsNewPopUp.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "close-container": "WhatsNewPopUp-module-scss-module__arzeeW__close-container",
  "closing": "WhatsNewPopUp-module-scss-module__arzeeW__closing",
  "content-container": "WhatsNewPopUp-module-scss-module__arzeeW__content-container",
  "logo-container": "WhatsNewPopUp-module-scss-module__arzeeW__logo-container",
  "whats-new-pop-up-container": "WhatsNewPopUp-module-scss-module__arzeeW__whats-new-pop-up-container",
});
}),
"[project]/src/config/featureAnnouncement.json (json)", ((__turbopack_context__) => {

__turbopack_context__.v({"example":{"title":{"de":"","en":"","fr":""},"text_short":{"de":"","en":"","fr":""},"text_long":{"de":"","en":"","fr":""},"button_text":{"de":"","en":"","fr":""},"url":"","date_stamp":"dd.mm.yyyy"},"features":[]});}),
"[project]/src/hooks/common/WhatsNewPopUpHook.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useWhatsNewPopUp",
    ()=>useWhatsNewPopUp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$featureAnnouncement$2e$json__$28$json$29$__ = __turbopack_context__.i("[project]/src/config/featureAnnouncement.json (json)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/moment/moment.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
const parseDate = (dateStr)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$moment$2f$moment$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(dateStr, 'DD.MM.YYYY').toDate();
};
const getNewestFeature = (features)=>{
    if (features.length < 1) return null;
    return features.reduce((newest, current)=>{
        const newestDate = parseDate(newest.date_stamp);
        const currentDate = parseDate(current.date_stamp);
        return currentDate > newestDate ? current : newest;
    });
};
const useWhatsNewPopUp = ()=>{
    _s();
    const [isClosing, setIsClosing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isVisible, setIsVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const newestFeature = getNewestFeature(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$featureAnnouncement$2e$json__$28$json$29$__["default"].features);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useWhatsNewPopUp.useEffect": ()=>{
            if (!newestFeature) return;
            const hasSeenFeature = localStorage.getItem('last-seen-feature-announcement') === newestFeature.date_stamp;
            setIsVisible(!hasSeenFeature);
            window.dispatchEvent(new CustomEvent('whatsNewVisible', {
                detail: {
                    date_stamp: newestFeature.date_stamp
                }
            }));
        }
    }["useWhatsNewPopUp.useEffect"], [
        newestFeature?.date_stamp
    ]);
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$featureAnnouncement$2e$json__$28$json$29$__["default"]?.features || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$featureAnnouncement$2e$json__$28$json$29$__["default"].features.length === 0 || !newestFeature) {
        return {
            isVisible: false,
            isClosing: false,
            title: {},
            text: {},
            buttonText: undefined,
            url: '',
            handleClose: ()=>{},
            dateStamp: ''
        };
    }
    const handleClose = ()=>{
        setIsClosing(true);
        setTimeout(()=>{
            setIsVisible(false);
            localStorage.setItem('last-seen-feature-announcement', newestFeature.date_stamp);
            window.dispatchEvent(new CustomEvent('whatsNewClosed', {
                detail: {
                    date_stamp: newestFeature.date_stamp
                }
            }));
        }, 300);
    };
    return {
        isVisible,
        isClosing,
        title: newestFeature.title,
        text: newestFeature.text_short,
        buttonText: newestFeature.button_text,
        url: newestFeature.url,
        handleClose,
        dateStamp: newestFeature.date_stamp
    };
};
_s(useWhatsNewPopUp, "QCDD7tG0WwaAr6gyYdiPwaXJo/8=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/system/WhatsNewPopUp.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$WhatsNewPopUp$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/modules/system/WhatsNewPopUp.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$AssetIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/AssetIcon.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Button.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$MaterialIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/MaterialIcon.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$common$2f$WhatsNewPopUpHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/common/WhatsNewPopUpHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DocugateTranslateHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/DocugateTranslateHook.tsx [client] (ecmascript)");
/*
 * Title should be between 1-3 words (for best look in the ui) and not go over 5 words or 25 characters
 * description text should no be longer than 100 character
 * button text should not be longer than 20 characters
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
const WhatsNewPopUp = ()=>{
    _s();
    const { isVisible, isClosing, title, text, buttonText, url, handleClose } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$common$2f$WhatsNewPopUpHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useWhatsNewPopUp"])();
    const { translate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DocugateTranslateHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useDocugateTranslate"])();
    if (!isVisible) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("div", {
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$WhatsNewPopUp$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['whats-new-pop-up-container']} ${isClosing ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$WhatsNewPopUp$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['closing'] : ''}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("span", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$WhatsNewPopUp$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['logo-container'],
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$AssetIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    icon: 'blueLogo',
                    size: 'bigger'
                })
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$WhatsNewPopUp$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['content-container'],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("h3", {
                        style: {
                            fontWeight: 'normal',
                            fontSize: '23px'
                        },
                        children: translate(title, true)
                    }),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("p", {
                        children: translate(text, true)
                    }),
                    url && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        style: {
                            fontWeight: 'bold'
                        },
                        size: 'small',
                        variant: 'blue',
                        external: true,
                        href: url,
                        target: '_blank',
                        children: translate(buttonText, true) || 'show more'
                    })
                ]
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$WhatsNewPopUp$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['close-container'],
                onClick: handleClose,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$MaterialIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    icon: 'close'
                })
            })
        ]
    });
};
_s(WhatsNewPopUp, "ppc9CXyxNJqzwqeSzG30hexo2aQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$common$2f$WhatsNewPopUpHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useWhatsNewPopUp"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DocugateTranslateHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useDocugateTranslate"]
    ];
});
_c = WhatsNewPopUp;
const __TURBOPACK__default__export__ = WhatsNewPopUp;
var _c;
__turbopack_context__.k.register(_c, "WhatsNewPopUp");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/styles/modules/system/ChristmasDecorations.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "christmas-lights-container": "ChristmasDecorations-module-scss-module__pbwExa__christmas-lights-container",
  "close-container": "ChristmasDecorations-module-scss-module__pbwExa__close-container",
  "fall": "ChristmasDecorations-module-scss-module__pbwExa__fall",
  "glow": "ChristmasDecorations-module-scss-module__pbwExa__glow",
  "light": "ChristmasDecorations-module-scss-module__pbwExa__light",
  "light-1": "ChristmasDecorations-module-scss-module__pbwExa__light-1",
  "light-2": "ChristmasDecorations-module-scss-module__pbwExa__light-2",
  "light-3": "ChristmasDecorations-module-scss-module__pbwExa__light-3",
  "light-4": "ChristmasDecorations-module-scss-module__pbwExa__light-4",
  "lights-wrapper": "ChristmasDecorations-module-scss-module__pbwExa__lights-wrapper",
  "sadEmoji": "ChristmasDecorations-module-scss-module__pbwExa__sadEmoji",
  "snowflake": "ChristmasDecorations-module-scss-module__pbwExa__snowflake",
  "snowflakes-container": "ChristmasDecorations-module-scss-module__pbwExa__snowflakes-container",
  "twinkle-1": "ChristmasDecorations-module-scss-module__pbwExa__twinkle-1",
  "twinkle-2": "ChristmasDecorations-module-scss-module__pbwExa__twinkle-2",
  "twinkle-3": "ChristmasDecorations-module-scss-module__pbwExa__twinkle-3",
  "twinkle-4": "ChristmasDecorations-module-scss-module__pbwExa__twinkle-4",
});
}),
"[project]/src/components/system/ChristmasDecorations.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChristmasDecorations",
    ()=>ChristmasDecorations,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$ChristmasDecorations$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/modules/system/ChristmasDecorations.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
const ChristmasDecorations = ()=>{
    _s();
    const [isVisible, setIsVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const getSubdomain = ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const hostname = window.location.hostname;
        const parts = hostname.split('.');
        if (parts.length > 2) return parts[0];
        return '';
    };
    const subdomain = getSubdomain();
    const excludedTenants = []; // Add tenants to exclude from the Christmas theme in this array
    const isAllowedToShine = !excludedTenants.includes(subdomain);
    if (!isAllowedToShine) return null;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChristmasDecorations.useEffect": ()=>{
            const isInStorage = localStorage.getItem('christmas-decoration');
            if (isInStorage === 'do not show again') {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
        }
    }["ChristmasDecorations.useEffect"], []);
    const handleClose = ()=>{
        setIsVisible(false);
        localStorage.setItem('christmas-decoration', 'do not show again');
    };
    if (!isVisible) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(ChristmasLights, {
                handleClose: handleClose
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(ChristmasSnowflakes, {})
        ]
    });
};
_s(ChristmasDecorations, "J3yJOyGdBT4L7hs1p1XQYVGMdrY=");
_c = ChristmasDecorations;
const ChristmasLights = ({ handleClose })=>{
    const lights = Array.from({
        length: 13
    }, (_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$ChristmasDecorations$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['light']} ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$ChristmasDecorations$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"][`light-${index % 4 + 1}`]}`,
            style: {
                animationDelay: `${Math.random() * 2}s`
            }
        }, index));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$ChristmasDecorations$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['christmas-lights-container'],
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$ChristmasDecorations$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['lights-wrapper'],
                    children: lights
                })
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$ChristmasDecorations$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['close-container'],
                onClick: handleClose,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$ChristmasDecorations$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['closeEmoji'],
                        children: "\u274C"
                    }),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$ChristmasDecorations$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['sadEmoji'],
                        children: "\uD83D\uDE22"
                    })
                ]
            })
        ]
    });
};
_c1 = ChristmasLights;
const ChristmasSnowflakes = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$ChristmasDecorations$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['snowflakes-container'],
            children: Array.from({
                length: 20
            }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$ChristmasDecorations$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['snowflake'],
                    children: "\u2744\uFE0F"
                }, i))
        })
    });
};
_c2 = ChristmasSnowflakes;
const __TURBOPACK__default__export__ = ChristmasDecorations;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ChristmasDecorations");
__turbopack_context__.k.register(_c1, "ChristmasLights");
__turbopack_context__.k.register(_c2, "ChristmasSnowflakes");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Header.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$Header$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/modules/Header.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$logo$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$logo$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/src/assets/logo.svg.mjs { IMAGE => "[project]/src/assets/logo.svg (static in ecmascript, tag client)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$global$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/common/global.config.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Menu$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Menu.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$i18next$2f$dist$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-i18next/dist/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$PermissionHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/PermissionHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Link$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Link.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$UserHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/UserHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$masterdata$2f$UserIndexHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/masterdata/UserIndexHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DrawerHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/DrawerHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$MaterialIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/MaterialIcon.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$drawers$2f$SideNavigationDrawer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/drawers/SideNavigationDrawer.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$drawers$2f$ProfilMenuDrawer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/drawers/ProfilMenuDrawer.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Divider$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Divider.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$WhatsNewPopUp$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/WhatsNewPopUp.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$ChristmasDecorations$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/ChristmasDecorations.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
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
const Header = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].memo(_c = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$WhatsNewPopUp$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$ChristmasDecorations$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("header", {
                "data-cy": 'header',
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$Header$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['header-container'],
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$Header$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['nav-container'],
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(HamburgerMenu, {}),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Divider$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                orientation: 'vertical'
                            }),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(Logo, {})
                        ]
                    }),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(Interaction, {})
                ]
            })
        ]
    });
});
_c1 = Header;
const Logo = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("section", {
        "data-cy": 'header-logo',
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$Header$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['logo-container'],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Link$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            noDecoration: true,
            prefetch: true,
            href: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$global$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["homePath"],
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                src: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$assets$2f$logo$2e$svg$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$src$2f$assets$2f$logo$2e$svg__$28$static__in__ecmascript$2c$__tag__client$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
                alt: "logo"
            })
        })
    });
};
_c2 = Logo;
const HamburgerMenu = ()=>{
    _s();
    const { openDrawer } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DrawerHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useDrawer"])();
    const { hasGrant } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$PermissionHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["usePermission"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"])([
        'common'
    ]);
    const canReadMasterTemplate = hasGrant('read@master-templates', 'v1alpha1.templating.docugate.ch');
    const canReadTemplateGroups = hasGrant('read@template-groups', 'v1alpha1.templating.docugate.ch');
    const canReadTextComponents = hasGrant('read@text-components', 'v1alpha1.templating.docugate.ch');
    const canReadBags = hasGrant('read@bags', 'v1alpha1.build.docugate.ch');
    const canReadBulkCreation = hasGrant('read@job', 'v1alpha1.bulkdocumentcreation.docugate.ch');
    const canReadGroups = hasGrant('read@groups', 'v1alpha1.authorization.docugate.ch');
    const canReadMasterdata = hasGrant('read@index', 'v1alpha1.masterdata.docugate.ch') && hasGrant('read@index-record', 'v1alpha1.masterdata.docugate.ch');
    const canReadSignatureRules = hasGrant('read@signature-rules', 'v1alpha1.templating.docugate.ch');
    const canReadFunctions = hasGrant('list@functions', 'v1alpha1.function.docugate.ch');
    const canReadFunctionResources = hasGrant('read@function-resources', 'v1alpha1.function.docugate.ch');
    const canReadBuildPipelines = hasGrant('read@buildpipelines', 'v1alpha1.build.docugate.ch');
    const canReadOutputConfig = hasGrant('read@outputconfiguration', 'v1alpha1.documentdistribution.docugate.ch');
    const canReadBilling = hasGrant('read@events', 'v1alpha1.billing.docugate.ch');
    const route = router.pathname.toLowerCase().split('/')[1];
    const templateItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Menu$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["MenuItem"], {
        icon: 'description',
        href: '/template',
        children: t('common:wheel.templates'),
        selected: route === 'template'
    }, 'template');
    const masterTemplateItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Menu$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["MenuItem"], {
        icon: 'crown',
        useSymbols: true,
        href: '/mastertemplate',
        children: t('common:wheel.mastertemplate'),
        selected: route === 'mastertemplate'
    }, 'mastertemplate');
    const textComponentsListItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Menu$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["MenuItem"], {
        asset: 'text_components',
        href: '/textcomponent',
        children: t('common:wheel.textcomponents'),
        selected: route === 'textcomponent'
    }, 'textComponent');
    const bagListItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Menu$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["MenuItem"], {
        icon: 'difference',
        href: '/bag',
        children: t('common:wheel.bag'),
        selected: route === 'bag'
    }, 'bag');
    const bulkCreationListItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Menu$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["MenuItem"], {
        icon: 'mail',
        href: '/bulkcreation',
        children: t('common:wheel.bulkcreation'),
        selected: route === 'bulkcreation'
    }, 'bulkcreation');
    const templateGroupItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Menu$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["MenuItem"], {
        icon: 'topic',
        href: '/templategroup',
        children: t('common:wheel.templategroup'),
        selected: route === 'templategroup'
    }, 'templategroup');
    const groupsItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Menu$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["MenuItem"], {
        icon: 'groups',
        href: '/group',
        children: t('common:wheel.groups'),
        selected: route === 'group'
    }, 'groups');
    const masterdataItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Menu$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["MenuItem"], {
        icon: 'format_list_bulleted',
        href: `/masterdata`,
        children: t('common:wheel.masterdata'),
        selected: route === 'masterdata'
    }, 'masterdata');
    const signatureRulesItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Menu$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["MenuItem"], {
        icon: 'rule',
        href: `/signaturerules/new`,
        children: t('common:wheel.signaturerules'),
        selected: route === 'signaturerules'
    }, 'signatureRules');
    const functionsItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Menu$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["MenuItem"], {
        icon: 'data_object',
        href: '/function',
        children: t('common:wheel.functions'),
        selected: route === 'function'
    }, 'functions');
    const functionResourcesItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Menu$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["MenuItem"], {
        icon: 'image',
        href: '/functionresource',
        children: t('common:wheel.function-resources'),
        selected: route === 'functionresource'
    }, 'functionresource');
    const pipelineListItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Menu$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["MenuItem"], {
        asset: 'pipeline_blue',
        href: '/pipeline',
        children: t('common:wheel.pipelines'),
        selected: route === 'pipeline'
    }, 'pipelines');
    const outputConfigItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Menu$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["MenuItem"], {
        icon: 'drive_folder_upload',
        href: '/outputconfig',
        children: t('common:wheel.outputconfiguration'),
        selected: route === 'outputconfig'
    }, 'outputconfig');
    const tenantUsageItem = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Menu$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["MenuItem"], {
        icon: 'query_stats',
        href: '/tenantoverview',
        children: t('common:wheel.tenant-overview'),
        selected: route === 'tenantusage'
    }, 'tenantusage');
    const templateSection = [];
    const templateAdminSection = [];
    const tenantAdminSection = [];
    templateSection.push(templateItem);
    if (canReadTemplateGroups) templateSection.push(templateGroupItem);
    if (canReadTextComponents) templateSection.push(textComponentsListItem);
    if (canReadMasterTemplate) templateSection.push(masterTemplateItem);
    if (canReadBags) templateSection.push(bagListItem);
    if (canReadBulkCreation) templateSection.push(bulkCreationListItem);
    if (canReadGroups) templateAdminSection.push(groupsItem);
    if (canReadMasterdata) templateAdminSection.push(masterdataItem);
    if (canReadSignatureRules) templateAdminSection.push(signatureRulesItem);
    if (canReadFunctions) templateAdminSection.push(functionsItem);
    if (canReadFunctionResources) templateAdminSection.push(functionResourcesItem);
    if (canReadBuildPipelines) templateAdminSection.push(pipelineListItem);
    if (canReadOutputConfig) templateAdminSection.push(outputConfigItem);
    if (canReadBilling) tenantAdminSection.push(tenantUsageItem);
    const groups = [
        templateSection,
        templateAdminSection,
        tenantAdminSection
    ];
    const handleMenuOpen = async ()=>{
        openDrawer({
            element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$drawers$2f$SideNavigationDrawer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                navItems: groups
            }),
            orientation: 'left'
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("section", {
        "data-cy": 'hamburger-menu',
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$Header$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['hamburger-menu-container'],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$MaterialIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            icon: 'menu',
            iconSize: 'huge',
            onClick: handleMenuOpen
        })
    });
};
_s(HamburgerMenu, "Aw8s+wZM0yo9Va8oe+spYoCKfDQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DrawerHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useDrawer"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$PermissionHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["usePermission"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c3 = HamburgerMenu;
const Interaction = ()=>{
    _s1();
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$UserHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useUser"])();
    const userIndex = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$masterdata$2f$UserIndexHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useUserIndex"])();
    const { openDrawer } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DrawerHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useDrawer"])();
    const handleUserMenuOpen = async ()=>{
        openDrawer({
            element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$drawers$2f$ProfilMenuDrawer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}),
            orientation: 'right'
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("section", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$Header$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['interaction-container'],
        children: user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
            "data-cy": 'profile',
            onClick: handleUserMenuOpen,
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$Header$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['user'],
            children: user[userIndex?.titleField]
        })
    });
};
_s1(Interaction, "WI8ig2mLIIVIWS07/UUEkiv60J0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$UserHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useUser"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$masterdata$2f$UserIndexHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useUserIndex"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DrawerHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useDrawer"]
    ];
});
_c4 = Interaction;
const __TURBOPACK__default__export__ = Header;
var _c, _c1, _c2, _c3, _c4;
__turbopack_context__.k.register(_c, "Header$React.memo");
__turbopack_context__.k.register(_c1, "Header");
__turbopack_context__.k.register(_c2, "Logo");
__turbopack_context__.k.register(_c3, "HamburgerMenu");
__turbopack_context__.k.register(_c4, "Interaction");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/styles/modules/layouts/GlobalLayout.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "feedback-container": "GlobalLayout-module-scss-module__OqEila__feedback-container",
  "feedback-placeholder": "GlobalLayout-module-scss-module__OqEila__feedback-placeholder",
  "layout-container": "GlobalLayout-module-scss-module__OqEila__layout-container",
  "layout-content-container": "GlobalLayout-module-scss-module__OqEila__layout-content-container",
});
}),
"[project]/src/styles/modules/Authenticate.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "authenticate-container": "Authenticate-module-scss-module__0m1eAq__authenticate-container",
  "authenticate-content": "Authenticate-module-scss-module__0m1eAq__authenticate-content",
});
}),
"[project]/src/hooks/MetaHook.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MetaProvider",
    ()=>MetaProvider,
    "useMeta",
    ()=>useMeta
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/v4.js [client] (ecmascript) <export default as v4>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
;
const defaultValue = {
    title: 'Docugate Cloud',
    description: 'A page of Docugate Cloud',
    setTitle: ()=>null,
    setDescription: ()=>null,
    setMetadata: ()=>null,
    unmountMetadata: ()=>null,
    mountMetadata: ()=>null
};
const defaultMetadata = {
    priority: -1,
    title: defaultValue.title,
    description: defaultValue.description
};
const MetaContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])(defaultValue);
const MetaProvider = ({ children })=>{
    _s();
    const [metadata, setCurrentMetadata] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        '': defaultMetadata
    });
    /**
   * Update the page title
   * @param id id of the useMeta instance
   * @param title new title of the page
   * @param priority priority of the metadata
   */ const setTitle = (id, title, priority = 1)=>{
        setCurrentMetadata((current)=>({
                ...current,
                [id]: {
                    ...current[id],
                    title,
                    priority
                }
            }));
    };
    /**
   * Update the page description
   * @param id id of the useMeta instance
   * @param description new description of the page
   * @param priority priority of the metadata
   */ const setDescription = (id, description, priority = 1)=>{
        setCurrentMetadata((current)=>({
                ...current,
                [id]: {
                    ...current[id],
                    description,
                    priority
                }
            }));
    };
    /**
   * Update the page metadata
   * @param id id of the use meta instance
   * @param metadata updated metadata
   * @param priority priority of the metadata
   */ const setMetadata = (id, metadata, priority = 1)=>{
        setCurrentMetadata((current)=>({
                ...current,
                [id]: {
                    ...metadata,
                    priority
                }
            }));
    };
    /**
   * Get the current highest prioritized metadata
   * @returns prioritized metadata
   */ const getCurrentMetadata = ()=>{
        return Object.values(metadata).sort((a, b)=>b.priority - a.priority)[0] || defaultMetadata;
    };
    /**
   * Unmount the metadata from a specific useMeta
   * @param id id of the useMeta instance
   */ const unmountMetadata = (id)=>{
        setCurrentMetadata((current)=>{
            const updatedMetadata = {
                ...current
            };
            delete updatedMetadata[id];
            if (Object.keys(updatedMetadata).length === 0) updatedMetadata[''] = defaultMetadata;
            return updatedMetadata;
        });
    };
    /**
   * Mount the metadata from a specific useMeta
   * @param id id of the useMeta instance
   * @param metadata metadata of the useMeta instance
   * @param priority priority of the metadata
   */ const mountMetadata = (id, metadata, priority = 1)=>{
        const priorized = {
            ...metadata,
            priority
        };
        setCurrentMetadata((current)=>({
                ...current,
                [id]: priorized
            }));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])(MetaContext.Provider, {
        value: {
            ...getCurrentMetadata(),
            mountMetadata,
            setMetadata,
            setTitle,
            setDescription,
            unmountMetadata
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("title", {
                        children: getCurrentMetadata().title
                    }),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("meta", {
                        name: 'description',
                        content: getCurrentMetadata().description
                    }),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("meta", {
                        name: 'robots',
                        content: 'noindex, nofollow, noarchive, nosnippet, noimageindex'
                    })
                ]
            }),
            children
        ]
    });
};
_s(MetaProvider, "DK/MiFVNz7kU/RpEWjl9KJAO1gI=");
_c = MetaProvider;
const useMeta = (title, description, priority = 1)=>{
    _s1();
    const metaId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])('');
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(MetaContext);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useMeta.useEffect": ()=>{
            if (!metaId.current) {
                metaId.current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])();
                const metadata = {
                    title: title || defaultMetadata.title,
                    description: description || defaultMetadata.description
                };
                context?.mountMetadata(metaId.current, metadata, priority);
            }
            return ({
                "useMeta.useEffect": ()=>{
                    context?.unmountMetadata(metaId.current);
                }
            })["useMeta.useEffect"];
        }
    }["useMeta.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useMeta.useEffect": ()=>{
            const metadata = {
                title: title || defaultMetadata.title,
                description: description || defaultMetadata.description
            };
            context?.setMetadata(metaId.current, metadata, priority);
        }
    }["useMeta.useEffect"], [
        title,
        description
    ]);
    if (!context) throw new Error('useMetadata must be used withing a MetaProvider');
    return {
        ...context,
        setMetadata: (...args)=>context.setMetadata(metaId.current, ...args),
        setTitle: (...args)=>context.setTitle(metaId.current, ...args),
        setDescription: (...args)=>context.setDescription(metaId.current, ...args)
    };
};
_s1(useMeta, "mEs/edf2zksDqbZ5U+gUNUNIQfA=");
var _c;
__turbopack_context__.k.register(_c, "MetaProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Authenticate.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$Authenticate$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/modules/Authenticate.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$MetaHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/MetaHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Loader$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Loader.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$i18next$2f$dist$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-i18next/dist/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
const Authenticate = ()=>{
    _s();
    const [hidden, setHidden] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"])([
        'common'
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$MetaHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useMeta"])(t('common:pages.authenticate'), undefined, 0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Authenticate.useEffect": ()=>{
            let mounted = true;
            setTimeout({
                "Authenticate.useEffect": ()=>{
                    if (mounted) setHidden(false);
                }
            }["Authenticate.useEffect"], 500);
            return ({
                "Authenticate.useEffect": ()=>{
                    mounted = false;
                }
            })["Authenticate.useEffect"];
        }
    }["Authenticate.useEffect"], []);
    if (hidden) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {});
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("section", {
        "data-cy": 'authenticate',
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$Authenticate$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['authenticate-container'],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("section", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$Authenticate$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['authenticate-content'],
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("h1", {
                    children: t('common:authenticate-title')
                }),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                    "data-tab": true,
                    children: t('common:authenticate-description')
                }),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Loader$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["LinearLoader"], {})
            ]
        })
    });
};
_s(Authenticate, "HFbbY4npDUmlb+VRIXEQuvSOOpM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$MetaHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useMeta"]
    ];
});
_c = Authenticate;
const __TURBOPACK__default__export__ = Authenticate;
var _c;
__turbopack_context__.k.register(_c, "Authenticate");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/styles/modules/system/Feedback.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "expand": "Feedback-module-scss-module__Ikr24G__expand",
  "feedback-action": "Feedback-module-scss-module__Ikr24G__feedback-action",
  "feedback-container": "Feedback-module-scss-module__Ikr24G__feedback-container",
  "feedback-content": "Feedback-module-scss-module__Ikr24G__feedback-content",
  "feedback-list-container": "Feedback-module-scss-module__Ikr24G__feedback-list-container",
  "feedback-placeholder": "Feedback-module-scss-module__Ikr24G__feedback-placeholder",
});
}),
"[project]/src/styles/modules/system/BaseModal.module.scss [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "basemodal-container": "BaseModal-module-scss-module__vcDARq__basemodal-container",
  "basemodal-content": "BaseModal-module-scss-module__vcDARq__basemodal-content",
  "basemodal-content-container": "BaseModal-module-scss-module__vcDARq__basemodal-content-container",
  "basemodal-heading": "BaseModal-module-scss-module__vcDARq__basemodal-heading",
  "basemodal-title": "BaseModal-module-scss-module__vcDARq__basemodal-title",
});
}),
"[project]/src/components/system/BaseModal.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Modal$2f$Modal$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/Modal/Modal.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$BaseModal$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/modules/system/BaseModal.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$MaterialIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/MaterialIcon.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$ModalHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/ModalHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
/**
 * BaseModal system component which is used as a wrapper for all modals defined at /src/components/modals
 * @see https://kolibri.docugate.ch/docs/modals-and-drawers
 */ const BaseModal = ({ children, styling = true })=>{
    _s();
    const { open, uuid, title, size, onClose } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$ModalHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useModalContent"])();
    const handleClose = ()=>onClose(uuid);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$Modal$2f$Modal$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        "data-cy": 'modal',
        classes: {
            root: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$BaseModal$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['basemodal-container']
        },
        open: open,
        onClose: handleClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("section", {
            "data-size": size,
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$BaseModal$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['basemodal-content-container'],
            children: [
                styling && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("div", {
                    "data-cy": 'modal-heading',
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$BaseModal$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['basemodal-heading'],
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("span", {
                            "data-cy": 'modal-title',
                            "data-tab": true,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$BaseModal$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['basemodal-title'],
                            children: title
                        }),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("span", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$MaterialIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                iconSize: "big",
                                icon: "close",
                                clickable: true,
                                onClick: handleClose
                            })
                        })
                    ]
                }),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("section", {
                    "data-cy": 'modal-content',
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$BaseModal$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['basemodal-content'],
                    children: children
                })
            ]
        })
    });
};
_s(BaseModal, "x5eHksVX7Ew3baRpqfV7eIQmx/Q=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$ModalHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useModalContent"]
    ];
});
_c = BaseModal;
const __TURBOPACK__default__export__ = BaseModal;
var _c;
__turbopack_context__.k.register(_c, "BaseModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/ModalHook.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ModalProvider",
    ()=>ModalProvider,
    "useModal",
    ()=>useModal,
    "useModalContent",
    ()=>useModalContent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/v4.js [client] (ecmascript) <export default as v4>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$BaseModal$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/BaseModal.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$MenuHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/MenuHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
;
;
;
;
;
const defaultValue = {
    openModal: ()=>'',
    awaitModalResult: ()=>undefined,
    currentModal: null
};
const ModalContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])(defaultValue);
const defaultContentValue = {
    size: null,
    title: null,
    open: false,
    uuid: null,
    setTitle: ()=>null,
    onCallback: ()=>null,
    onClose: ()=>null,
    hasCallback: false,
    filter: null
};
const ModalContentContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])(defaultContentValue);
const ModalProvider = ({ children })=>{
    _s();
    const [currentModal, setCurrentModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(undefined);
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ModalProvider.useEffect": ()=>{
            setOpen(!!currentModal?.uuid);
        }
    }["ModalProvider.useEffect"], [
        currentModal?.uuid
    ]);
    /**
   * Open a new modal
   * @param modal modal instance to open
   * @returns uuid of the modal
   */ const openModal = (modal)=>{
        const uuid = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])();
        if (modal.title) setTitle(modal.title);
        setCurrentModal({
            ...modal,
            uuid
        });
        return uuid;
    };
    /**
   * Await the result of a modal
   * @param modal modal to get the result of
   * @returns result of the modal
   */ const awaitModalResult = (modal)=>{
        return new Promise((resolve)=>{
            openModal({
                ...modal,
                onCallback: resolve
            });
        });
    };
    /**
   * Handler which gets called when a modal gets closed
   */ const handleModalClose = ()=>{
        setOpen(false);
        if (currentModal?.onClose) currentModal.onClose();
        setCurrentModal(undefined);
    };
    /**
   * Handler which gets called when a modal gets closed with callback values
   * @param uuid uuid of the modal
   * @param args callback values of the modal
   */ const handleModalCallback = (uuid, ...args)=>{
        handleModalClose();
        if (currentModal?.onCallback) currentModal.onCallback(...args);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])(ModalContext.Provider, {
        value: {
            openModal,
            currentModal,
            awaitModalResult
        },
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(ModalContentContext.Provider, {
                value: {
                    open,
                    title,
                    setTitle,
                    onCallback: handleModalCallback,
                    hasCallback: !!currentModal?.onCallback,
                    onClose: handleModalClose,
                    uuid: currentModal?.uuid,
                    size: currentModal?.size || 'normal'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$BaseModal$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    styling: !(currentModal?.noBaseStyling ?? false),
                    children: open && currentModal?.element && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$MenuHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["MenuProvider"], {
                        children: currentModal.element
                    })
                })
            })
        ]
    });
};
_s(ModalProvider, "5fxDBaNDAZNiRQ3alZ9dOEMVjhI=");
_c = ModalProvider;
const useModal = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(ModalContext);
    if (!context) throw new Error('useModal must be used within an ModalProvider');
    return context;
};
_s1(useModal, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
const useModalContent = (title)=>{
    _s2();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(ModalContentContext);
    if (!context) throw new Error('useModalContent must be used within a ModalContentProvider');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useModalContent.useEffect": ()=>{
            if (title) context.setTitle(title);
        }
    }["useModalContent.useEffect"], [
        title,
        context.uuid
    ]);
    return context;
};
_s2(useModalContent, "wqnYpdjMkT3eDhbBjwDmfBO/TFg=");
var _c;
__turbopack_context__.k.register(_c, "ModalProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/modals/ErrorLogsModal.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Button.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$i18next$2f$dist$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-i18next/dist/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$ModalHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/ModalHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$ContainerSection$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/ContainerSection.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Copyable$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Copyable.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
const ErrorLogsModal = ({ errorLogs })=>{
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"])();
    const { onClose, uuid } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$ModalHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useModalContent"])(t('common:dialogs.error-logs-title'));
    const errorLogsText = errorLogs.reduce((x, y)=>`${x}\n${y}`);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$ContainerSection$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        padding: false,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Copyable$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                text: errorLogsText,
                position: "nextTo",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                    children: errorLogs.map((log, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                            children: log
                        }, index))
                })
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["ButtonContainer"], {
                marginTop: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Button$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    children: t('common:close'),
                    onClick: ()=>onClose?.(uuid)
                })
            })
        ]
    });
};
_s(ErrorLogsModal, "Ci2q+9HAdSCXYYkPWxxUhddMuiE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$ModalHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useModalContent"]
    ];
});
_c = ErrorLogsModal;
const __TURBOPACK__default__export__ = ErrorLogsModal;
var _c;
__turbopack_context__.k.register(_c, "ErrorLogsModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/system/Feedback.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Feedback$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/modules/system/Feedback.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$MaterialIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/MaterialIcon.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$ModalHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/ModalHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$modals$2f$ErrorLogsModal$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/modals/ErrorLogsModal.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$helper$2e$common$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/common/helper.common.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$i18next$2f$dist$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-i18next/dist/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
/**
 * Feedback system component which can be used to add feedbacks to actions or infos  to a page
 * @see https://kolibri.docugate.ch/docs/components/system/Feedback
 */ const Feedback = /*#__PURE__*/ _s(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].memo(_c = _s(({ variant = 'success', label, expand = false, error = undefined })=>{
    _s();
    const { openModal } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$ModalHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useModal"])();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"])();
    const getVariantIcon = ()=>{
        switch(variant){
            case 'success':
                return 'check';
            case 'error':
                return 'error_outline';
            case 'warning':
                return 'warning';
            case 'info':
                return 'info';
        }
    };
    const errorLogs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$helper$2e$common$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["parseErrorLogs"])(error);
    const handleOpenErrorLogs = ()=>{
        openModal({
            element: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$modals$2f$ErrorLogsModal$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                errorLogs: errorLogs
            })
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("section", {
        "data-cy": 'feedback',
        "data-cy-feedback": variant,
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Feedback$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['feedback-placeholder'],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("section", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Feedback$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['feedback-container'],
            "data-expand": expand,
            "data-variant": variant,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$MaterialIcon$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    icon: getVariantIcon(),
                    outlined: true
                }),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Feedback$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['feedback-content'],
                    children: label
                }),
                errorLogs && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("button", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$system$2f$Feedback$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['feedback-action'],
                    onClick: handleOpenErrorLogs,
                    children: t('common:tooltip-more')
                })
            ]
        })
    });
}, "8coDe+RrDPDx2qTrurzbtF7xuW4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$ModalHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useModal"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
})), "8coDe+RrDPDx2qTrurzbtF7xuW4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$ModalHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useModal"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c1 = Feedback;
const __TURBOPACK__default__export__ = Feedback;
var _c, _c1;
__turbopack_context__.k.register(_c, "Feedback$React.memo");
__turbopack_context__.k.register(_c1, "Feedback");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/FeedbackHook.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FeedbackProvider",
    ()=>FeedbackProvider,
    "useFeedback",
    ()=>useFeedback
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Feedback$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Feedback.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$global$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/common/global.config.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__ = __turbopack_context__.i("[project]/node_modules/uuid/dist/v4.js [client] (ecmascript) <export default as v4>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
;
;
const defaultValue = {
    active: {
        all: {},
        list: []
    },
    showFeedback: ()=>null
};
const FeedbackContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])(defaultValue);
const feedbackReducer = (state, action)=>{
    switch(action.type){
        case 'hide':
            {
                if (!state.list.find(([id])=>id === action.entry)) return;
                const list = state.list.filter(([id])=>id !== action.entry);
                return {
                    ...state,
                    list
                };
            }
        case 'remove':
            {
                const list = state.list.filter(([key])=>key !== action.entry);
                const all = {
                    ...state.all,
                    [action.id]: state.all[action.id]?.filter(({ id })=>id !== action.entry) || []
                };
                if (all[action.id]?.length === 0) delete all[action.id];
                return {
                    all,
                    list
                };
            }
        case 'show':
            {
                const entry = {
                    ...action,
                    id: action.entry
                };
                let list = [];
                if (action.view === 'ghost') {
                    list = [];
                } else {
                    if (state.list.length == 3) list = [
                        ...state.list.slice(1),
                        [
                            action.entry,
                            entry.element
                        ]
                    ];
                    else list = [
                        ...state.list,
                        [
                            action.entry,
                            entry.element
                        ]
                    ];
                }
                const all = [
                    ...state.all[action.id] || [],
                    entry
                ];
                return {
                    list,
                    all: {
                        ...state.all,
                        [action.id]: all
                    }
                };
            }
    }
};
const FeedbackProvider = ({ children })=>{
    _s();
    const mounted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(true);
    const [state, dispatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useReducer"])(feedbackReducer, {
        all: {},
        list: []
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FeedbackProvider.useEffect": ()=>{
            mounted.current = true;
            return ({
                "FeedbackProvider.useEffect": ()=>{
                    mounted.current = false;
                }
            })["FeedbackProvider.useEffect"];
        }
    }["FeedbackProvider.useEffect"], []);
    const showFeedback = (id, message, view = 'success', error = undefined)=>{
        const entry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])();
        dispatch({
            type: 'show',
            id,
            view,
            entry,
            element: getFeedbackElement(message, entry, view, error)
        }); // add the feedback bar to the state
        setTimeout(()=>{
            dispatch({
                type: 'remove',
                id,
                entry
            });
        }, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$global$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["feedbackDuration"]);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "FeedbackProvider.useEffect": ()=>{}
    }["FeedbackProvider.useEffect"], [
        state
    ]);
    const getFeedbackElement = (message, entry, view, error)=>{
        if (view === 'ghost') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].Fragment, {}, entry);
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Feedback$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
            label: message,
            variant: view,
            expand: true,
            error: error
        }, entry);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(FeedbackContext.Provider, {
        value: {
            showFeedback,
            active: state
        },
        children: children
    });
};
_s(FeedbackProvider, "DXRZNVRqelorVjHRK2CdJmMgo2Q=");
_c = FeedbackProvider;
const useFeedback = ()=>{
    _s1();
    const feedbackId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])('');
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(FeedbackContext);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useFeedback.useEffect": ()=>{
            feedbackId.current = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uuid$2f$dist$2f$v4$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__v4$3e$__["v4"])();
        }
    }["useFeedback.useEffect"], []);
    if (!context) throw new Error('useFeedback must be used within a FeedbackProvider');
    const handleShowFeedback = (message, view = 'success', error = undefined)=>{
        context.showFeedback(feedbackId.current, message, view, error);
    };
    const hasSuccess = !!context.active.all[feedbackId.current]?.find(({ view })=>view === 'success' || view === 'ghost');
    return {
        feedbacks: context.active,
        showFeedback: handleShowFeedback,
        isSuccess: hasSuccess,
        isError: !hasSuccess
    };
};
_s1(useFeedback, "MxNZ+8gJxp8K9IrGJVcvxaykDF8=");
var _c;
__turbopack_context__.k.register(_c, "FeedbackProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/layouts/GlobalLayout.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Footer.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Header.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$layouts$2f$GlobalLayout$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/styles/modules/layouts/GlobalLayout.module.scss [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Authenticate$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Authenticate.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$AuthHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/AuthHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$container$2f$ErrorContainer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/container/ErrorContainer.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$FeedbackHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/FeedbackHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DrawerHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/DrawerHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
const GlobalLayout = ({ children, auth })=>{
    _s();
    const { status } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$AuthHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { feedbacks } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$FeedbackHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useFeedback"])();
    const canShowContent = !auth || status === 'authenticated';
    const { currentDrawer } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DrawerHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useDrawer"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("main", {
        "data-cy": 'layout',
        "data-cy-role": 'global',
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$layouts$2f$GlobalLayout$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['layout-container'],
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("section", {
                "data-cy": 'layout-content',
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$layouts$2f$GlobalLayout$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['layout-content-container'],
                children: [
                    canShowContent && children,
                    status === 'loading' && !canShowContent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Authenticate$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {}),
                    status === 'unauthenticated' && !canShowContent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$container$2f$ErrorContainer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        code: 401
                    })
                ]
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("div", {
                "data-cy": 'feedbacks',
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$layouts$2f$GlobalLayout$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['feedback-placeholder'],
                "data-bottom": !!currentDrawer,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("section", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$styles$2f$modules$2f$layouts$2f$GlobalLayout$2e$module$2e$scss__$5b$client$5d$__$28$css__module$29$__["default"]['feedback-container'],
                    children: feedbacks.list.map(([, element])=>{
                        return element;
                    })
                })
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Footer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {})
        ]
    });
};
_s(GlobalLayout, "Quob0L/xEn5yh7DpbalBBPCENls=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$AuthHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$FeedbackHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useFeedback"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DrawerHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useDrawer"]
    ];
});
_c = GlobalLayout;
const __TURBOPACK__default__export__ = GlobalLayout;
var _c;
__turbopack_context__.k.register(_c, "GlobalLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/pages/_document.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createEmotionCache",
    ()=>createEmotionCache,
    "default",
    ()=>CustomDocument
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$document$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/document.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$cache$2f$dist$2f$emotion$2d$cache$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@emotion/cache/dist/emotion-cache.browser.development.esm.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$server$2f$create$2d$instance$2f$dist$2f$emotion$2d$server$2d$create$2d$instance$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@emotion/server/create-instance/dist/emotion-server-create-instance.browser.esm.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
;
;
;
;
;
const createEmotionCache = ()=>{
    let insertionPoint;
    if ("TURBOPACK compile-time truthy", 1) {
        const emotionInsertionPoint = document.querySelector("meta[name='mui-style-insertion']");
        insertionPoint = emotionInsertionPoint ?? undefined;
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$cache$2f$dist$2f$emotion$2d$cache$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])({
        key: 'css',
        prepend: true,
        insertionPoint: insertionPoint
    });
};
class CustomDocument extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$document$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"] {
    static async getInitialProps(ctx) {
        const originalRenderPage = ctx.renderPage;
        const cache = createEmotionCache();
        const { extractCriticalToChunks } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$server$2f$create$2d$instance$2f$dist$2f$emotion$2d$server$2d$create$2d$instance$2e$browser$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(cache);
        ctx.renderPage = ()=>originalRenderPage({
                enhanceApp: (App)=>(props)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(App, {
                            emotionCache: cache,
                            ...props
                        })
            });
        const initialProps = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$document$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].getInitialProps(ctx);
        const emotionStyle = extractCriticalToChunks(initialProps.html);
        const emotionStyleTags = emotionStyle.styles.map((style)=>{
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("style", {
                "data-emotion": `${style.key} ${style.ids.join(' ')}`,
                dangerouslySetInnerHTML: {
                    __html: style.css
                }
            }, style.key);
        });
        return {
            ...initialProps,
            styles: [
                ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].Children.toArray(initialProps.styles),
                ...emotionStyleTags
            ]
        };
    }
    render() {
        const themeLoaderScript = `
    var isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var preference = localStorage.preference;
    if(preference === "system") preference = isSystemDark ? "dark" : "light";
    else if(preference !== "light" && preference !== "dark") preference = isSystemDark ? "dark" : "light";
    document.documentElement.setAttribute("theme", preference);`;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$document$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Html"], {
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$document$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Head"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("meta", {
                            charSet: "utf-8"
                        }),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("meta", {
                            name: "mui-style-insertion"
                        }),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("link", {
                            rel: "shortcut icon",
                            href: "/favicon.ico"
                        }),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("link", {
                            rel: "preconnect",
                            href: "https://googleapis.com"
                        }),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("link", {
                            rel: "preconnect",
                            href: "https://fonts.gstatic.com",
                            crossOrigin: "anonymous"
                        }),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("link", {
                            href: "https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,400;0,600;1,400;1,600&display=swap",
                            rel: "stylesheet"
                        }),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("link", {
                            href: "https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined&display=swap",
                            rel: "stylesheet"
                        }),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("link", {
                            href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap",
                            rel: "stylesheet"
                        })
                    ]
                }),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxs"])("body", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])("script", {
                            id: "theme-loader",
                            dangerouslySetInnerHTML: {
                                __html: themeLoaderScript
                            }
                        }),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$document$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Main"], {}),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$document$2e$js__$5b$client$5d$__$28$ecmascript$29$__["NextScript"], {})
                    ]
                })
            ]
        });
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/common/mui.config.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "defaultTheme",
    ()=>defaultTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$createTheme$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__createTheme$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/styles/createTheme.js [client] (ecmascript) <export default as createTheme>");
;
const defaultTheme = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$createTheme$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__createTheme$3e$__["createTheme"])({
    typography: {
        fontFamily: [
            'Raleway',
            'sans-serif'
        ].join(','),
        fontWeightRegular: 400,
        fontWeightBold: 600,
        fontWeightLight: 400,
        fontWeightMedium: 600,
        fontSize: 12
    },
    components: {
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true,
                disableTouchRipple: true,
                focusRipple: false,
                centerRipple: false
            }
        },
        MuiIconButton: {
            defaultProps: {
                sx: {
                    '&:hover': {
                        backgroundColor: 'transparent'
                    }
                }
            }
        },
        MuiSwitch: {
            styleOverrides: {
                colorPrimary: {
                    color: 'var(--docugate-white)',
                    '&.Mui-checked': {
                        color: 'var(--docugate-darkblue)',
                        '& + .MuiSwitch-track': {
                            backgroundColor: 'var(--docugate-darkblue)',
                            opacity: 0.3
                        }
                    },
                    '& + .MuiSwitch-track': {
                        backgroundColor: 'var(--docugate-lightgray)'
                    }
                }
            }
        },
        MuiRadio: {
            defaultProps: {
                sx: {
                    '& .MuiSvgIcon-root': {
                        fontSize: 15
                    },
                    marginLeft: 0
                }
            },
            styleOverrides: {
                colorPrimary: {
                    color: 'var(--docugate-lightgray)',
                    '&.Mui-checked': {
                        color: 'var(--docugate-darkblue)'
                    }
                }
            }
        },
        MuiCheckbox: {
            defaultProps: {
                sx: {
                    '& .MuiSvgIcon-root': {
                        fontSize: 15
                    },
                    marginLeft: 0
                }
            },
            styleOverrides: {
                colorPrimary: {
                    color: 'var(--docugate-lightgray)',
                    '&.Mui-checked': {
                        color: 'var(--docugate-darkblue)'
                    }
                }
            }
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: 'var(--docugate-darkblue)',
                    color: 'var(--docugate-white)'
                },
                arrow: {
                    color: 'var(--docugate-darkblue)'
                }
            }
        }
    }
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/types/notification.types.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Basic notification message format
 */ /**
 * Notification for compiler and workflow messages
 */ /**
 * Notification payload for compiler and workflow messages
 */ /**
 * Notification for bag finished message
 */ /**
 * Notification payload for bag finished message
 */ /**
 * Message type of a notification message
 * @see https://docs.docugate.cloud/services/notification/docs/user/notification_messages.html#message-types
 */ __turbopack_context__.s([
    "MessageType",
    ()=>MessageType,
    "PayloadIdentifierByMessageType",
    ()=>PayloadIdentifierByMessageType
]);
let MessageType = /*#__PURE__*/ function(MessageType) {
    MessageType["SUBSCRIPTION"] = "Subscription";
    MessageType["UNSUBSCRIPTION"] = "Unsubscription";
    MessageType["JOB_CREATED"] = "docugate.io/v1alpha1/message/compiler/job.created";
    MessageType["JOB_COMPLETED"] = "docugate.io/v1alpha1/message/compiler/job.completed";
    MessageType["JOB_FAILED"] = "docugate.io/v1alpha1/message/compiler/job.failed";
    MessageType["RESULTS_UPDATED"] = "docugate.io/v1alpha1/message/workflow/results.updated";
    MessageType["BAG_JOB_FINISHED"] = "docugate.io/v1alpha1/message/bag/job.finished";
    return MessageType;
}({});
const PayloadIdentifierByMessageType = {
    [MessageType.JOB_CREATED]: 'workflowId',
    [MessageType.JOB_COMPLETED]: 'workflowId',
    [MessageType.JOB_FAILED]: 'workflowId',
    [MessageType.RESULTS_UPDATED]: 'workflowId',
    [MessageType.BAG_JOB_FINISHED]: 'bagId'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/NotificationHook.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NotificationProvider",
    ()=>NotificationProvider,
    "useNotification",
    ()=>useNotification
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$AuthHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/AuthHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$microsoft$2f$signalr$2f$dist$2f$esm$2f$HubConnectionBuilder$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@microsoft/signalr/dist/esm/HubConnectionBuilder.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$microsoft$2f$signalr$2f$dist$2f$esm$2f$ILogger$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@microsoft/signalr/dist/esm/ILogger.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cypress$2d$signalr$2d$mock$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/cypress-signalr-mock/dist/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/common/Logger.class.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$notification$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/types/notification.types.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$global$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/common/global.config.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/sdk/src/config/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/config/api.config.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
const workflowSubscriptionTypes = [
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$notification$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["MessageType"].JOB_CREATED,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$notification$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["MessageType"].RESULTS_UPDATED,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$notification$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["MessageType"].JOB_FAILED
];
const bagSubscriptionTypes = [
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$notification$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["MessageType"].BAG_JOB_FINISHED
];
const defaultValue = {
    waitForWorkflowResult: ()=>null,
    waitUntilBagFinishes: ()=>null
};
const NotificationContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])(defaultValue);
const NotificationProvider = ({ children })=>{
    _s();
    const { token } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$AuthHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const connection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const waiting = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])({});
    const cypressSignalRMock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cypress$2d$signalr$2d$mock$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCypressSignalRMock"])('notificationHub');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NotificationProvider.useEffect": ()=>{
            if (!token) return;
            connection.current = cypressSignalRMock ?? // the mock is used for cypress e2e tests. It will be null if cypress is not active.
            new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$microsoft$2f$signalr$2f$dist$2f$esm$2f$HubConnectionBuilder$2e$js__$5b$client$5d$__$28$ecmascript$29$__["HubConnectionBuilder"]().withUrl(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$global$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["baseApiUrl"]}/${__TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$config$2f$api$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["notificationsApiUrl"]}?access_token=${token}`, {
                logger: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$microsoft$2f$signalr$2f$dist$2f$esm$2f$ILogger$2e$js__$5b$client$5d$__$28$ecmascript$29$__["LogLevel"].Error,
                withCredentials: true
            }).withAutomaticReconnect().build();
            connection.current.start().then({
                "NotificationProvider.useEffect": ()=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].info('Connected to notifications hub');
                }
            }["NotificationProvider.useEffect"]).catch({
                "NotificationProvider.useEffect": ()=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to connect to notifications hub');
                }
            }["NotificationProvider.useEffect"]);
            connection.current.on('ReceiveMessage', handleNotification);
            connection.current.on('close', {
                "NotificationProvider.useEffect": ()=>{
                    connection.current.off('ReceiveMessage', handleNotification);
                    connection.current.stop().then({
                        "NotificationProvider.useEffect": ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].info('Closed connection to notifications hub due to server initiated close request');
                        }
                    }["NotificationProvider.useEffect"]).catch({
                        "NotificationProvider.useEffect": ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to close connection to notifications hub due to server initiated close reques');
                        }
                    }["NotificationProvider.useEffect"]);
                }
            }["NotificationProvider.useEffect"]);
            return ({
                "NotificationProvider.useEffect": ()=>{
                    connection.current.off('ReceiveMessage', handleNotification);
                    connection.current.stop().then({
                        "NotificationProvider.useEffect": ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].info('Closed connection to notifications hub');
                        }
                    }["NotificationProvider.useEffect"]).catch({
                        "NotificationProvider.useEffect": ()=>{
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to close connection to notifications hub');
                        }
                    }["NotificationProvider.useEffect"]);
                }
            })["NotificationProvider.useEffect"];
        }
    }["NotificationProvider.useEffect"], [
        token
    ]);
    /**
   * Handle an incoming notification
   * @param notification notification to handle
   */ const handleNotification = (notification)=>{
        const type = notification.type;
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].event(`Received notification of type ${type}`);
        const payloadIdentifier = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$notification$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["PayloadIdentifierByMessageType"][type];
        const handler = waiting.current[notification.payload[payloadIdentifier]];
        handler(notification);
    };
    /**
   * Subscribe to some notification types
   * @param types types of notifications to subscribe to
   */ const subscribe = async (types)=>{
        if (!connection.current) return;
        await connection.current.send('ReceiveMessage', {
            Type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$notification$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["MessageType"].SUBSCRIPTION,
            Payload: {
                types
            }
        });
    };
    /**
   * Unsubscribe from some notification types
   * @param types types of notifications to unsubscribe from
   */ const unsubscribe = async (types)=>{
        if (!connection.current) return;
        await connection.current.send('ReceiveMessage', {
            Type: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$notification$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["MessageType"].UNSUBSCRIPTION,
            Payload: {
                types
            }
        });
    };
    /**
   * Wait for a workflow to complete
   * @param workflowId id of the workflow to wait for
   * @returns a promise that resolves when the workflow completes
   */ const waitForWorkflowResult = async (workflowId)=>{
        await subscribe(workflowSubscriptionTypes);
        return await new Promise((resolve, reject)=>{
            let timeout = null;
            const handler = (notification)=>{
                if (notification.type === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$notification$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["MessageType"].RESULTS_UPDATED || notification.type === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$notification$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["MessageType"].JOB_FAILED) {
                    clearTimeout(timeout);
                    delete waiting.current[workflowId];
                    unsubscribe(workflowSubscriptionTypes);
                    resolve(notification);
                }
            };
            timeout = setTimeout(()=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].event('Timeout for notification message exceeded');
                reject('Timeout waiting for workflow result notification message exceeded');
            }, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$global$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["requestTimeoutWorkflow"]);
            waiting.current = {
                ...waiting.current,
                [workflowId]: handler
            };
        });
    };
    /**
   * Wait until a bag finishes
   * @param bagId id of the bag to wait for
   * @returns a promise that resolves when the bag completes
   */ const waitUntilBagFinishes = async (bagId)=>{
        await subscribe(bagSubscriptionTypes);
        return await new Promise((resolve, reject)=>{
            let timeout = null;
            const handler = (notification)=>{
                if (notification.type === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$types$2f$notification$2e$types$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["MessageType"].BAG_JOB_FINISHED) {
                    clearTimeout(timeout);
                    delete waiting.current[bagId];
                    unsubscribe(bagSubscriptionTypes);
                    resolve(notification);
                }
            };
            timeout = setTimeout(()=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].event('Timeout for notification message exceeded');
                reject('Timeout waiting for bag finished notification message exceeded');
            }, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$global$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["requestTimeoutWorkflow"]);
            waiting.current = {
                ...waiting.current,
                [bagId]: handler
            };
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(NotificationContext.Provider, {
        value: {
            waitForWorkflowResult,
            waitUntilBagFinishes
        },
        children: children
    });
};
_s(NotificationProvider, "H/cr/sUX4Sc4gCgGLaE4OgE5Xqk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$AuthHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$cypress$2d$signalr$2d$mock$2f$dist$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCypressSignalRMock"]
    ];
});
_c = NotificationProvider;
const useNotification = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(NotificationContext);
    if (!context) throw new Error('useNotification must be used within a NotificationProvider');
    return context;
};
_s1(useNotification, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "NotificationProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/ErrorHook.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ErrorProvider",
    ()=>ErrorProvider,
    "useError",
    ()=>useError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$i18next$2f$dist$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-i18next/dist/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-i18next/dist/es/useTranslation.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
;
const defaultValue = {
    transformFieldError: ()=>null
};
const ErrorContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])(defaultValue);
const ErrorProvider = ({ children })=>{
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"])([
        'common'
    ]);
    /**
   * Transform a react-hook-form field error into usable and spreadable input props
   * Additionally the field error gets translated with DocugateTranslateContext
   * @param error field error
   * @param key key of the field should the field be of type Record<string, any>
   * @returns spreadable props object
   */ const transformFieldError = (error)=>{
        const hasError = !!error;
        const errorMessages = {
            alreadyMember: t('common:error.alreadyMember'),
            default: t('common:error.default'),
            duplicateEntry: t('common:error.duplicateEntry'),
            invalidDate: t('common:error.invalidDate'),
            dateLowerThanNow: t('common:error.dateLowerThanNow'),
            invalidEmail: t('common:error.invalidEmail'),
            invalidJson: t('common:error.invalidJson'),
            invoke: t('common:error.invoke'),
            max: t('common:error.max'),
            maxLength: t('common:error.maxLength'),
            min: t('common:error.min'),
            minLength: t('common:error.minLength'),
            missingJsonKey: t('common:error.missingJsonKey'),
            noBigLetter: t('common:error.noBigLetter'),
            numberLimit: t('common:error.numberLimit'),
            pattern: t('common:error.pattern'),
            patternNameNotValid: t('common:error.patternNameNotValid'),
            patternFileName: t('common:error.patternFileName'),
            patternFileNameLong: t('common:error.patternFileNameLong'),
            pendingInvitation: t('common:error.pendingInvitation'),
            required: t('common:error.required'),
            unique: t('common:error.unique'),
            whiteSpaceNotAllowed: t('common:error.whiteSpaceNotAllowed'),
            invalidSecretsPattern: t('function:feedback.invalidSecretsPattern'),
            httpUnsupported: t('outputconfig:feedback.httpUnsupported'),
            invalidUrl: t('outputconfig:feedback.invalidUrl'),
            invalidRulePattern: t('template:feedback.invalidRulePattern'),
            systemReserved: t('common:error.systemReserved'),
            invalidJsonPointer: t('common:error.invalidJsonPointer'),
            invalidRange: t('common:error.invalidRange'),
            numberExceedsMax: t('common:error.numberExceedsMax'),
            numberExceedsDefault: t('common:error.numberExceedsDefault'),
            numberExceedsSample: t('common:error.numberExceedsSample'),
            numberBelowMin: t('common:error.numberBelowMin'),
            numberBelowDefault: t('common:error.numberBelowDefault'),
            numberBelowSample: t('common:error.numberBelowSample')
        };
        if (error?.message && errorMessages[error.message]) {
            return {
                error: hasError,
                helperText: hasError ? errorMessages[error.message] || t('common:error.invalidFieldValue') : undefined
            };
        } else if (error?.type && errorMessages[error.type]) {
            return {
                error: hasError,
                helperText: hasError ? errorMessages[error.type] || t('common:error.invalidFieldValue') : undefined
            };
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(ErrorContext.Provider, {
        value: {
            transformFieldError
        },
        children: children
    });
};
_s(ErrorProvider, "vu2xTFBfHkv41zWfADiErp1aWcA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c = ErrorProvider;
const useError = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(ErrorContext);
    if (!context) throw new Error('useError must be used within ErrorProvider');
    return context;
};
_s1(useError, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "ErrorProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/common/settings.common.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getDateFormat",
    ()=>getDateFormat,
    "getDateFormats",
    ()=>getDateFormats,
    "getDateTimeFormat",
    ()=>getDateTimeFormat,
    "setDateFormat",
    ()=>setDateFormat
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$global$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/common/global.config.ts [client] (ecmascript)");
;
const getDateFormat = ()=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const storageFormat = localStorage.getItem('date-format');
    if (storageFormat && typeof storageFormat === 'string' && storageFormat.toLowerCase().match(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$global$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["DATE_FORMAT_REGEX"])) {
        return storageFormat.toUpperCase();
    }
    const language = navigator.language;
    switch(language.toLowerCase()){
        case 'es-pa':
        case 'en-ph':
        case 'en-pr':
        case 'en-us':
            // United States of america
            return 'MM/DD/YYYY';
        default:
            return 'DD.MM.YYYY';
    }
};
const getDateTimeFormat = ()=>{
    return `${getDateFormat()} HH:mm`;
};
const setDateFormat = (format)=>{
    localStorage.setItem('date-format', format);
};
const getDateFormats = ()=>{
    return [
        'DD.MM.YYYY',
        'MM/DD/YYYY'
    ];
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/ThemeHook.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider,
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
const defaultValue = {
    preference: null,
    theme: null,
    setPreference: ()=>null
};
const ThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])(defaultValue);
const ThemeProvider = ({ children })=>{
    _s();
    const [preference, setPreference] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])();
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            if (!preference) return;
            const currentTheme = preference === 'system' ? getSystemTheme() : preference ?? 'light';
            setTheme(currentTheme);
            document.documentElement.setAttribute('theme', currentTheme);
            localStorage.setItem('preference', preference);
        }
    }["ThemeProvider.useEffect"], [
        preference
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            let storedPreference = 'light';
            storedPreference = localStorage?.getItem('mode');
            if (storedPreference === 'dark') setPreference(storedPreference);
            else setPreference('light');
        }
    }["ThemeProvider.useEffect"], []);
    /**
   * Get the theme based on the system preference of the current user
   * @returns theme
   */ const getSystemTheme = ()=>{
        if (("TURBOPACK compile-time value", "object") !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
        else return 'light';
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(ThemeContext.Provider, {
        value: {
            preference,
            theme,
            setPreference
        },
        children: children
    });
};
_s(ThemeProvider, "gWEau07XfnxNMMakD6IdaSAWuTQ=");
_c = ThemeProvider;
const useTheme = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};
_s1(useTheme, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/swr/SpreadArgumentsMiddleware.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Middleware to spread array swr keys to fetcher <br>
 * This middleware is necessary because swr introduced a breaking change in v2 where
 * array keys don't get spread to the fetcher anymore but instead get passed as an array
 * @param useSWRNext
 */ __turbopack_context__.s([
    "addSpreadKeys",
    ()=>addSpreadKeys
]);
var _s = __turbopack_context__.k.signature();
const addSpreadKeys = (useSWRNext)=>_s((key, fetcher, config)=>{
        _s();
        const effectiveKey = typeof key === 'function' ? key() : key;
        if (Array.isArray(effectiveKey)) return useSWRNext(key, {
            "addSpreadKeys.useSWRNext": ()=>fetcher(...effectiveKey)
        }["addSpreadKeys.useSWRNext"], config);
        else return useSWRNext(key, fetcher, config);
    }, "v9YCZfakGDYQxpoIEHv1qc+Se2s=", true);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/pages/_app.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layouts$2f$GlobalLayout$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/layouts/GlobalLayout.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$_document$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/pages/_document.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$dist$2f$emotion$2d$element$2d$489459f2$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__C__as__CacheProvider$3e$__ = __turbopack_context__.i("[project]/node_modules/@emotion/react/dist/emotion-element-489459f2.browser.development.esm.js [client] (ecmascript) <export C as CacheProvider>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$i18next$2f$dist$2f$esm$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-i18next/dist/esm/index.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$i18next$2f$dist$2f$esm$2f$appWithTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next-i18next/dist/esm/appWithTranslation.js [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/swr/dist/index/index.mjs [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$global$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/common/global.config.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$MetaHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/MetaHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$mui$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/common/mui.config.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$NotificationHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/NotificationHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$ModalHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/ModalHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DocugateTranslateHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/DocugateTranslateHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$helper$2e$common$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/common/helper.common.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$ThemeProvider$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ThemeProvider$3e$__ = __turbopack_context__.i("[project]/node_modules/@mui/material/esm/styles/ThemeProvider.js [client] (ecmascript) <export default as ThemeProvider>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$PermissionHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/PermissionHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$ErrorHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/ErrorHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$settings$2e$common$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/common/settings.common.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$cookie$2f$esm$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/react-cookie/esm/index.mjs [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$FeedbackHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/FeedbackHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$MenuHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/MenuHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DrawerHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/DrawerHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$AccessibilityHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/AccessibilityHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$AuthHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/AuthHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$ThemeHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/ThemeHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$ErrorBoundary$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/ErrorBoundary.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Loader$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/system/Loader.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/common/Logger.class.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$container$2f$ErrorContainer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/container/ErrorContainer.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$UserHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/UserHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$swr$2f$SpreadArgumentsMiddleware$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/swr/SpreadArgumentsMiddleware.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$masterdata$2f$UserIndexHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/masterdata/UserIndexHook.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/sdk/src/requests/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/sdk/src/requests/base.request.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-runtime.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
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
const GlobalAppWrapper = ({ Component, ...props })=>{
    _s();
    const [isAdmin, setIsAdmin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const clientSideEmotionCache = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$_document$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["createEmotionCache"])();
    const { emotionCache = clientSideEmotionCache, session, pageProps } = props;
    const pageWithAuthorization = pageProps?.auth ?? true;
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const version = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GlobalAppWrapper.useEffect": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$sdk$2f$src$2f$requests$2f$base$2e$request$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["setBaseApiUrlByEnvironment"])(("TURBOPACK compile-time value", "dev"));
            const currentURL = window.location.href;
            const regex = /\badmin\.docugate(test)?\b/;
            setIsAdmin(regex.test(currentURL));
            // Ensure the date format localstorage entry is accurate
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$settings$2e$common$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["setDateFormat"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$settings$2e$common$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getDateFormat"])());
        }
    }["GlobalAppWrapper.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GlobalAppWrapper.useEffect": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get('/api/version').then({
                "GlobalAppWrapper.useEffect": ({ data })=>{
                    if (version.current) return;
                    version.current = data;
                    if (version.current.image !== '?.?.?') __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].info(`Using frontend image ${version.current.image}`);
                }
            }["GlobalAppWrapper.useEffect"]).catch({
                "GlobalAppWrapper.useEffect": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$Logger$2e$class$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["Logger"].error('Unable to get current frontend version')
            }["GlobalAppWrapper.useEffect"]);
        }
    }["GlobalAppWrapper.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GlobalAppWrapper.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) localStorage.setItem('locale', router.locale);
        }
    }["GlobalAppWrapper.useEffect"], [
        router.locale
    ]);
    const handleError = (error)=>{
        if (!pageWithAuthorization || router.pathname === '/auth' && !!router.query.error) return;
        const isCancelled = error.code === 'ERR_CANCELED' && sessionStorage.getItem('access_token') === 'undefined';
        const isUnauthorized = error.code === 401;
        const isForbidden = error.code === 403;
        if (isCancelled) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["signIn"])('zitadel');
        } else if (isForbidden || isUnauthorized) {
            const errors = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$helper$2e$common$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getRequestErrors"])();
            const last = errors.filter(({ timestamp })=>timestamp !== error.timestamp).pop();
            const isSameError = error.code === last?.code && error.path === last?.path;
            // If the same error occurs on the same path in a timespan of 10sec
            // the request shouldn't be retried but instead the user should be redirected
            // to the /auth error page
            if (isSameError && Date.now() - last.timestamp < 10000) {
                router.push(`/auth?error=${error.code}`);
            } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$helper$2e$common$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["isJWTExpired"])(sessionStorage.getItem('access_token'))) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["signIn"])('zitadel');
            }
        }
    };
    const decideForRetry = (error)=>{
        if (error.code === 'ECONNABORTED' && sessionStorage.getItem('access_token') !== 'undefined') {
            // request timed out or was intentionally aborted by the client
            return false;
        } else if (error.code === 0) return false; // there is a network error (retry is useless)
        else if (error.code === 403) return false; // once forbidden, always forbidden
        else if (error.code === 500) return false; // server side error shouldn't be retried
        return true;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["SessionProvider"], {
        session: session,
        refetchInterval: 15000,
        children: isAdmin ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$AuthHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
            auth: pageWithAuthorization,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$cookie$2f$esm$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["CookiesProvider"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SWRConfig"], {
                    value: {
                        loadingTimeout: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$global$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["requestTimeout"],
                        onError: handleError,
                        shouldRetryOnError: decideForRetry,
                        use: [
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$swr$2f$SpreadArgumentsMiddleware$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["addSpreadKeys"]
                        ]
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$NotificationHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["NotificationProvider"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$dist$2f$emotion$2d$element$2d$489459f2$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__C__as__CacheProvider$3e$__["CacheProvider"], {
                            value: emotionCache,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$ThemeHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$ThemeProvider$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ThemeProvider$3e$__["ThemeProvider"], {
                                    theme: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$mui$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["defaultTheme"],
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DocugateTranslateHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["DocugateTranslateProvider"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$ErrorHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["ErrorProvider"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$FeedbackHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["FeedbackProvider"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$AccessibilityHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["AccessibilityProvider"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$ModalHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["ModalProvider"], {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$MenuHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["MenuProvider"], {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$MetaHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["MetaProvider"], {
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DrawerHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["DrawerProvider"], {
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layouts$2f$GlobalLayout$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                                        auth: pageWithAuthorization,
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$ErrorBoundary$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                                            fallback: (error)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$container$2f$ErrorContainer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                                                    trace: error.trace,
                                                                                    code: error.code
                                                                                }),
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Suspense"], {
                                                                                fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Loader$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["LinearLoader"], {}),
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(Component, {
                                                                                    ...pageProps
                                                                                })
                                                                            })
                                                                        })
                                                                    })
                                                                })
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        }) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$AuthHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
            auth: pageWithAuthorization,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$cookie$2f$esm$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["CookiesProvider"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$swr$2f$dist$2f$index$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SWRConfig"], {
                    value: {
                        loadingTimeout: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$global$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["requestTimeout"],
                        onError: handleError,
                        shouldRetryOnError: decideForRetry,
                        use: [
                            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$swr$2f$SpreadArgumentsMiddleware$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["addSpreadKeys"]
                        ]
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$NotificationHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["NotificationProvider"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$emotion$2f$react$2f$dist$2f$emotion$2d$element$2d$489459f2$2e$browser$2e$development$2e$esm$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__C__as__CacheProvider$3e$__["CacheProvider"], {
                            value: emotionCache,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$ThemeHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["ThemeProvider"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mui$2f$material$2f$esm$2f$styles$2f$ThemeProvider$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ThemeProvider$3e$__["ThemeProvider"], {
                                    theme: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$common$2f$mui$2e$config$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["defaultTheme"],
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DocugateTranslateHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["DocugateTranslateProvider"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$PermissionHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["PermissionProvider"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$ErrorHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["ErrorProvider"], {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$FeedbackHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["FeedbackProvider"], {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$AccessibilityHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["AccessibilityProvider"], {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$masterdata$2f$UserIndexHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["UserIndexProvider"], {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$UserHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["UserProvider"], {
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$ModalHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["ModalProvider"], {
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$MenuHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["MenuProvider"], {
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$MetaHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["MetaProvider"], {
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$DrawerHook$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["DrawerProvider"], {
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$layouts$2f$GlobalLayout$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                                                    auth: pageWithAuthorization,
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$ErrorBoundary$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                                                        fallback: (error)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$container$2f$ErrorContainer$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                                                                trace: error.trace,
                                                                                                code: error.code
                                                                                            }),
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Suspense"], {
                                                                                            fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$system$2f$Loader$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["LinearLoader"], {}),
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsx"])(Component, {
                                                                                                ...pageProps
                                                                                            })
                                                                                        })
                                                                                    })
                                                                                })
                                                                            })
                                                                        })
                                                                    })
                                                                })
                                                            })
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    });
};
_s(GlobalAppWrapper, "FzEeJQrk7JH7cXW2joDnRVnKy2c=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = GlobalAppWrapper;
const __TURBOPACK__default__export__ = _c1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$i18next$2f$dist$2f$esm$2f$appWithTranslation$2e$js__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["appWithTranslation"])(GlobalAppWrapper);
var _c, _c1;
__turbopack_context__.k.register(_c, "GlobalAppWrapper");
__turbopack_context__.k.register(_c1, "%default%");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/_app.tsx [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/_app";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/_app.tsx [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/src/pages/_app\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/_app.tsx [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__0d982ff6._.js.map