import { isServer, createComponent, spread, useAssets, ssr, escape, delegateEvents, ssrElement, mergeProps as mergeProps$1, ssrHydrationKey, Dynamic, ssrAttribute, ssrStyleProperty, HydrationScript, NoHydration, renderToStringAsync } from 'solid-js/web';
import { createContext, sharedConfig, createUniqueId, useContext, createRenderEffect, onCleanup, createSignal, getOwner, runWithOwner, createMemo, untrack, createComponent as createComponent$1, on, startTransition, resetErrorBoundaries, mergeProps, splitProps, children, createRoot, Show, For, createResource, ErrorBoundary as ErrorBoundary$1, createEffect, Suspense } from 'solid-js';
import { createClient } from '@supabase/supabase-js';
import 'http';

const MetaContext = createContext();
const cascadingTags = ["title", "meta"];
const titleTagProperties = [];
const metaTagProperties = (
  // https://html.spec.whatwg.org/multipage/semantics.html#the-meta-element
  ["name", "http-equiv", "content", "charset", "media"].concat(["property"])
);
const getTagKey = (tag, properties) => {
  const tagProps = Object.fromEntries(Object.entries(tag.props).filter(([k]) => properties.includes(k)).sort());
  if (Object.hasOwn(tagProps, "name") || Object.hasOwn(tagProps, "property")) {
    tagProps.name = tagProps.name || tagProps.property;
    delete tagProps.property;
  }
  return tag.tag + JSON.stringify(tagProps);
};
function initClientProvider() {
  if (!sharedConfig.context) {
    const ssrTags = document.head.querySelectorAll(`[data-sm]`);
    Array.prototype.forEach.call(ssrTags, (ssrTag) => ssrTag.parentNode.removeChild(ssrTag));
  }
  const cascadedTagInstances = /* @__PURE__ */ new Map();
  function getElement(tag) {
    if (tag.ref) {
      return tag.ref;
    }
    let el = document.querySelector(`[data-sm="${tag.id}"]`);
    if (el) {
      if (el.tagName.toLowerCase() !== tag.tag) {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
        el = document.createElement(tag.tag);
      }
      el.removeAttribute("data-sm");
    } else {
      el = document.createElement(tag.tag);
    }
    return el;
  }
  return {
    addTag(tag) {
      if (cascadingTags.indexOf(tag.tag) !== -1) {
        const properties = tag.tag === "title" ? titleTagProperties : metaTagProperties;
        const tagKey = getTagKey(tag, properties);
        if (!cascadedTagInstances.has(tagKey)) {
          cascadedTagInstances.set(tagKey, []);
        }
        let instances = cascadedTagInstances.get(tagKey);
        let index = instances.length;
        instances = [...instances, tag];
        cascadedTagInstances.set(tagKey, instances);
        let element2 = getElement(tag);
        tag.ref = element2;
        spread(element2, tag.props);
        let lastVisited = null;
        for (var i = index - 1; i >= 0; i--) {
          if (instances[i] != null) {
            lastVisited = instances[i];
            break;
          }
        }
        if (element2.parentNode != document.head) {
          document.head.appendChild(element2);
        }
        if (lastVisited && lastVisited.ref && lastVisited.ref.parentNode) {
          document.head.removeChild(lastVisited.ref);
        }
        return index;
      }
      let element = getElement(tag);
      tag.ref = element;
      spread(element, tag.props);
      if (element.parentNode != document.head) {
        document.head.appendChild(element);
      }
      return -1;
    },
    removeTag(tag, index) {
      const properties = tag.tag === "title" ? titleTagProperties : metaTagProperties;
      const tagKey = getTagKey(tag, properties);
      if (tag.ref) {
        const t = cascadedTagInstances.get(tagKey);
        if (t) {
          if (tag.ref.parentNode) {
            tag.ref.parentNode.removeChild(tag.ref);
            for (let i = index - 1; i >= 0; i--) {
              if (t[i] != null) {
                document.head.appendChild(t[i].ref);
              }
            }
          }
          t[index] = null;
          cascadedTagInstances.set(tagKey, t);
        } else {
          if (tag.ref.parentNode) {
            tag.ref.parentNode.removeChild(tag.ref);
          }
        }
      }
    }
  };
}
function initServerProvider() {
  const tags = [];
  useAssets(() => ssr(renderTags(tags)));
  return {
    addTag(tagDesc) {
      if (cascadingTags.indexOf(tagDesc.tag) !== -1) {
        const properties = tagDesc.tag === "title" ? titleTagProperties : metaTagProperties;
        const tagDescKey = getTagKey(tagDesc, properties);
        const index = tags.findIndex((prev) => prev.tag === tagDesc.tag && getTagKey(prev, properties) === tagDescKey);
        if (index !== -1) {
          tags.splice(index, 1);
        }
      }
      tags.push(tagDesc);
      return tags.length;
    },
    removeTag(tag, index) {
    }
  };
}
const MetaProvider = (props) => {
  const actions = !isServer ? initClientProvider() : initServerProvider();
  return createComponent(MetaContext.Provider, {
    value: actions,
    get children() {
      return props.children;
    }
  });
};
const MetaTag = (tag, props, setting) => {
  useHead({
    tag,
    props,
    setting,
    id: createUniqueId(),
    get name() {
      return props.name || props.property;
    }
  });
  return null;
};
function useHead(tagDesc) {
  const c = useContext(MetaContext);
  if (!c)
    throw new Error("<MetaProvider /> should be in the tree");
  createRenderEffect(() => {
    const index = c.addTag(tagDesc);
    onCleanup(() => c.removeTag(tagDesc, index));
  });
}
function renderTags(tags) {
  return tags.map((tag) => {
    const keys = Object.keys(tag.props);
    const props = keys.map((k) => k === "children" ? "" : ` ${k}="${// @ts-expect-error
    escape(tag.props[k], true)}"`).join("");
    let children = tag.props.children;
    if (Array.isArray(children)) {
      children = children.join("");
    }
    if (tag.setting?.close) {
      return `<${tag.tag} data-sm="${tag.id}"${props}>${// @ts-expect-error
      tag.setting?.escape ? escape(children) : children || ""}</${tag.tag}>`;
    }
    return `<${tag.tag} data-sm="${tag.id}"${props}/>`;
  }).join("");
}
const Title = (props) => MetaTag("title", props, {
  escape: true,
  close: true
});
const Meta = (props) => MetaTag("meta", props);
const Link = (props) => MetaTag("link", props);

function bindEvent(target, type, handler) {
    target.addEventListener(type, handler);
    return () => target.removeEventListener(type, handler);
}
function intercept([value, setValue], get, set) {
    return [get ? () => get(value()) : value, set ? (v) => setValue(set(v)) : setValue];
}
function querySelector(selector) {
    if (selector === "#") {
        return null;
    }
    // Guard against selector being an invalid CSS selector
    try {
        return document.querySelector(selector);
    }
    catch (e) {
        return null;
    }
}
function scrollToHash(hash, fallbackTop) {
    const el = querySelector(`#${hash}`);
    if (el) {
        el.scrollIntoView();
    }
    else if (fallbackTop) {
        window.scrollTo(0, 0);
    }
}
function createIntegration(get, set, init, utils) {
    let ignore = false;
    const wrap = (value) => (typeof value === "string" ? { value } : value);
    const signal = intercept(createSignal(wrap(get()), { equals: (a, b) => a.value === b.value }), undefined, next => {
        !ignore && set(next);
        return next;
    });
    init &&
        onCleanup(init((value = get()) => {
            ignore = true;
            signal[1](wrap(value));
            ignore = false;
        }));
    return {
        signal,
        utils
    };
}
function normalizeIntegration(integration) {
    if (!integration) {
        return {
            signal: createSignal({ value: "" })
        };
    }
    else if (Array.isArray(integration)) {
        return {
            signal: integration
        };
    }
    return integration;
}
function staticIntegration(obj) {
    return {
        signal: [() => obj, next => Object.assign(obj, next)]
    };
}
function pathIntegration() {
    return createIntegration(() => ({
        value: window.location.pathname + window.location.search + window.location.hash,
        state: history.state
    }), ({ value, replace, scroll, state }) => {
        if (replace) {
            window.history.replaceState(state, "", value);
        }
        else {
            window.history.pushState(state, "", value);
        }
        scrollToHash(window.location.hash.slice(1), scroll);
    }, notify => bindEvent(window, "popstate", () => notify()), {
        go: delta => window.history.go(delta)
    });
}

function createBeforeLeave() {
    let listeners = new Set();
    function subscribe(listener) {
        listeners.add(listener);
        return () => listeners.delete(listener);
    }
    let ignore = false;
    function confirm(to, options) {
        if (ignore)
            return !(ignore = false);
        const e = {
            to,
            options,
            defaultPrevented: false,
            preventDefault: () => (e.defaultPrevented = true)
        };
        for (const l of listeners)
            l.listener({
                ...e,
                from: l.location,
                retry: (force) => {
                    force && (ignore = true);
                    l.navigate(to, options);
                }
            });
        return !e.defaultPrevented;
    }
    return {
        subscribe,
        confirm
    };
}

const hasSchemeRegex = /^(?:[a-z0-9]+:)?\/\//i;
const trimPathRegex = /^\/+|(\/)\/+$/g;
function normalizePath(path, omitSlash = false) {
    const s = path.replace(trimPathRegex, "$1");
    return s ? (omitSlash || /^[?#]/.test(s) ? s : "/" + s) : "";
}
function resolvePath(base, path, from) {
    if (hasSchemeRegex.test(path)) {
        return undefined;
    }
    const basePath = normalizePath(base);
    const fromPath = from && normalizePath(from);
    let result = "";
    if (!fromPath || path.startsWith("/")) {
        result = basePath;
    }
    else if (fromPath.toLowerCase().indexOf(basePath.toLowerCase()) !== 0) {
        result = basePath + fromPath;
    }
    else {
        result = fromPath;
    }
    return (result || "/") + normalizePath(path, !result);
}
function invariant(value, message) {
    if (value == null) {
        throw new Error(message);
    }
    return value;
}
function joinPaths(from, to) {
    return normalizePath(from).replace(/\/*(\*.*)?$/g, "") + normalizePath(to);
}
function extractSearchParams(url) {
    const params = {};
    url.searchParams.forEach((value, key) => {
        params[key] = value;
    });
    return params;
}
function createMatcher(path, partial, matchFilters) {
    const [pattern, splat] = path.split("/*", 2);
    const segments = pattern.split("/").filter(Boolean);
    const len = segments.length;
    return (location) => {
        const locSegments = location.split("/").filter(Boolean);
        const lenDiff = locSegments.length - len;
        if (lenDiff < 0 || (lenDiff > 0 && splat === undefined && !partial)) {
            return null;
        }
        const match = {
            path: len ? "" : "/",
            params: {}
        };
        const matchFilter = (s) => matchFilters === undefined ? undefined : matchFilters[s];
        for (let i = 0; i < len; i++) {
            const segment = segments[i];
            const locSegment = locSegments[i];
            const dynamic = segment[0] === ":";
            const key = dynamic ? segment.slice(1) : segment;
            if (dynamic && matchSegment(locSegment, matchFilter(key))) {
                match.params[key] = locSegment;
            }
            else if (dynamic || !matchSegment(locSegment, segment)) {
                return null;
            }
            match.path += `/${locSegment}`;
        }
        if (splat) {
            const remainder = lenDiff ? locSegments.slice(-lenDiff).join("/") : "";
            if (matchSegment(remainder, matchFilter(splat))) {
                match.params[splat] = remainder;
            }
            else {
                return null;
            }
        }
        return match;
    };
}
function matchSegment(input, filter) {
    const isEqual = (s) => s.localeCompare(input, undefined, { sensitivity: "base" }) === 0;
    if (filter === undefined) {
        return true;
    }
    else if (typeof filter === "string") {
        return isEqual(filter);
    }
    else if (typeof filter === "function") {
        return filter(input);
    }
    else if (Array.isArray(filter)) {
        return filter.some(isEqual);
    }
    else if (filter instanceof RegExp) {
        return filter.test(input);
    }
    return false;
}
function scoreRoute(route) {
    const [pattern, splat] = route.pattern.split("/*", 2);
    const segments = pattern.split("/").filter(Boolean);
    return segments.reduce((score, segment) => score + (segment.startsWith(":") ? 2 : 3), segments.length - (splat === undefined ? 0 : 1));
}
function createMemoObject(fn) {
    const map = new Map();
    const owner = getOwner();
    return new Proxy({}, {
        get(_, property) {
            if (!map.has(property)) {
                runWithOwner(owner, () => map.set(property, createMemo(() => fn()[property])));
            }
            return map.get(property)();
        },
        getOwnPropertyDescriptor() {
            return {
                enumerable: true,
                configurable: true
            };
        },
        ownKeys() {
            return Reflect.ownKeys(fn());
        }
    });
}
function expandOptionals$1(pattern) {
    let match = /(\/?\:[^\/]+)\?/.exec(pattern);
    if (!match)
        return [pattern];
    let prefix = pattern.slice(0, match.index);
    let suffix = pattern.slice(match.index + match[0].length);
    const prefixes = [prefix, (prefix += match[1])];
    // This section handles adjacent optional params. We don't actually want all permuations since
    // that will lead to equivalent routes which have the same number of params. For example
    // `/:a?/:b?/:c`? only has the unique expansion: `/`, `/:a`, `/:a/:b`, `/:a/:b/:c` and we can
    // discard `/:b`, `/:c`, `/:b/:c` by building them up in order and not recursing. This also helps
    // ensure predictability where earlier params have precidence.
    while ((match = /^(\/\:[^\/]+)\?/.exec(suffix))) {
        prefixes.push((prefix += match[1]));
        suffix = suffix.slice(match[0].length);
    }
    return expandOptionals$1(suffix).reduce((results, expansion) => [...results, ...prefixes.map(p => p + expansion)], []);
}

const MAX_REDIRECTS = 100;
const RouterContextObj = createContext();
const RouteContextObj = createContext();
const useRouter = () => invariant(useContext(RouterContextObj), "Make sure your app is wrapped in a <Router />");
let TempRoute;
const useRoute = () => TempRoute || useContext(RouteContextObj) || useRouter().base;
const useResolvedPath = (path) => {
    const route = useRoute();
    return createMemo(() => route.resolvePath(path()));
};
const useHref = (to) => {
    const router = useRouter();
    return createMemo(() => {
        const to_ = to();
        return to_ !== undefined ? router.renderPath(to_) : to_;
    });
};
const useLocation = () => useRouter().location;
function createRoutes(routeDef, base = "", fallback) {
    const { component, data, children } = routeDef;
    const isLeaf = !children || (Array.isArray(children) && !children.length);
    const shared = {
        key: routeDef,
        element: component
            ? () => createComponent$1(component, {})
            : () => {
                const { element } = routeDef;
                return element === undefined && fallback
                    ? createComponent$1(fallback, {})
                    : element;
            },
        preload: routeDef.component
            ? component.preload
            : routeDef.preload,
        data
    };
    return asArray(routeDef.path).reduce((acc, path) => {
        for (const originalPath of expandOptionals$1(path)) {
            const path = joinPaths(base, originalPath);
            const pattern = isLeaf ? path : path.split("/*", 1)[0];
            acc.push({
                ...shared,
                originalPath,
                pattern,
                matcher: createMatcher(pattern, !isLeaf, routeDef.matchFilters)
            });
        }
        return acc;
    }, []);
}
function createBranch(routes, index = 0) {
    return {
        routes,
        score: scoreRoute(routes[routes.length - 1]) * 10000 - index,
        matcher(location) {
            const matches = [];
            for (let i = routes.length - 1; i >= 0; i--) {
                const route = routes[i];
                const match = route.matcher(location);
                if (!match) {
                    return null;
                }
                matches.unshift({
                    ...match,
                    route
                });
            }
            return matches;
        }
    };
}
function asArray(value) {
    return Array.isArray(value) ? value : [value];
}
function createBranches(routeDef, base = "", fallback, stack = [], branches = []) {
    const routeDefs = asArray(routeDef);
    for (let i = 0, len = routeDefs.length; i < len; i++) {
        const def = routeDefs[i];
        if (def && typeof def === "object" && def.hasOwnProperty("path")) {
            const routes = createRoutes(def, base, fallback);
            for (const route of routes) {
                stack.push(route);
                const isEmptyArray = Array.isArray(def.children) && def.children.length === 0;
                if (def.children && !isEmptyArray) {
                    createBranches(def.children, route.pattern, fallback, stack, branches);
                }
                else {
                    const branch = createBranch([...stack], branches.length);
                    branches.push(branch);
                }
                stack.pop();
            }
        }
    }
    // Stack will be empty on final return
    return stack.length ? branches : branches.sort((a, b) => b.score - a.score);
}
function getRouteMatches$1(branches, location) {
    for (let i = 0, len = branches.length; i < len; i++) {
        const match = branches[i].matcher(location);
        if (match) {
            return match;
        }
    }
    return [];
}
function createLocation(path, state) {
    const origin = new URL("http://sar");
    const url = createMemo(prev => {
        const path_ = path();
        try {
            return new URL(path_, origin);
        }
        catch (err) {
            console.error(`Invalid path ${path_}`);
            return prev;
        }
    }, origin, {
        equals: (a, b) => a.href === b.href
    });
    const pathname = createMemo(() => url().pathname);
    const search = createMemo(() => url().search, true);
    const hash = createMemo(() => url().hash);
    const key = createMemo(() => "");
    return {
        get pathname() {
            return pathname();
        },
        get search() {
            return search();
        },
        get hash() {
            return hash();
        },
        get state() {
            return state();
        },
        get key() {
            return key();
        },
        query: createMemoObject(on(search, () => extractSearchParams(url())))
    };
}
function createRouterContext(integration, base = "", data, out) {
    const { signal: [source, setSource], utils = {} } = normalizeIntegration(integration);
    const parsePath = utils.parsePath || (p => p);
    const renderPath = utils.renderPath || (p => p);
    const beforeLeave = utils.beforeLeave || createBeforeLeave();
    const basePath = resolvePath("", base);
    const output = isServer && out
        ? Object.assign(out, {
            matches: [],
            url: undefined
        })
        : undefined;
    if (basePath === undefined) {
        throw new Error(`${basePath} is not a valid base path`);
    }
    else if (basePath && !source().value) {
        setSource({ value: basePath, replace: true, scroll: false });
    }
    const [isRouting, setIsRouting] = createSignal(false);
    const start = async (callback) => {
        setIsRouting(true);
        try {
            await startTransition(callback);
        }
        finally {
            setIsRouting(false);
        }
    };
    const [reference, setReference] = createSignal(source().value);
    const [state, setState] = createSignal(source().state);
    const location = createLocation(reference, state);
    const referrers = [];
    const baseRoute = {
        pattern: basePath,
        params: {},
        path: () => basePath,
        outlet: () => null,
        resolvePath(to) {
            return resolvePath(basePath, to);
        }
    };
    if (data) {
        try {
            TempRoute = baseRoute;
            baseRoute.data = data({
                data: undefined,
                params: {},
                location,
                navigate: navigatorFactory(baseRoute)
            });
        }
        finally {
            TempRoute = undefined;
        }
    }
    function navigateFromRoute(route, to, options) {
        // Untrack in case someone navigates in an effect - don't want to track `reference` or route paths
        untrack(() => {
            if (typeof to === "number") {
                if (!to) ;
                else if (utils.go) {
                    beforeLeave.confirm(to, options) && utils.go(to);
                }
                else {
                    console.warn("Router integration does not support relative routing");
                }
                return;
            }
            const { replace, resolve, scroll, state: nextState } = {
                replace: false,
                resolve: true,
                scroll: true,
                ...options
            };
            const resolvedTo = resolve ? route.resolvePath(to) : resolvePath("", to);
            if (resolvedTo === undefined) {
                throw new Error(`Path '${to}' is not a routable path`);
            }
            else if (referrers.length >= MAX_REDIRECTS) {
                throw new Error("Too many redirects");
            }
            const current = reference();
            if (resolvedTo !== current || nextState !== state()) {
                if (isServer) {
                    if (output) {
                        output.url = resolvedTo;
                    }
                    setSource({ value: resolvedTo, replace, scroll, state: nextState });
                }
                else if (beforeLeave.confirm(resolvedTo, options)) {
                    const len = referrers.push({ value: current, replace, scroll, state: state() });
                    start(() => {
                        setReference(resolvedTo);
                        setState(nextState);
                        resetErrorBoundaries();
                    }).then(() => {
                        if (referrers.length === len) {
                            navigateEnd({
                                value: resolvedTo,
                                state: nextState
                            });
                        }
                    });
                }
            }
        });
    }
    function navigatorFactory(route) {
        // Workaround for vite issue (https://github.com/vitejs/vite/issues/3803)
        route = route || useContext(RouteContextObj) || baseRoute;
        return (to, options) => navigateFromRoute(route, to, options);
    }
    function navigateEnd(next) {
        const first = referrers[0];
        if (first) {
            if (next.value !== first.value || next.state !== first.state) {
                setSource({
                    ...next,
                    replace: first.replace,
                    scroll: first.scroll
                });
            }
            referrers.length = 0;
        }
    }
    createRenderEffect(() => {
        const { value, state } = source();
        // Untrack this whole block so `start` doesn't cause Solid's Listener to be preserved
        untrack(() => {
            if (value !== reference()) {
                start(() => {
                    setReference(value);
                    setState(state);
                });
            }
        });
    });
    if (!isServer) {
        function handleAnchorClick(evt) {
            if (evt.defaultPrevented ||
                evt.button !== 0 ||
                evt.metaKey ||
                evt.altKey ||
                evt.ctrlKey ||
                evt.shiftKey)
                return;
            const a = evt
                .composedPath()
                .find(el => el instanceof Node && el.nodeName.toUpperCase() === "A");
            if (!a || !a.hasAttribute("link"))
                return;
            const href = a.href;
            if (a.target || (!href && !a.hasAttribute("state")))
                return;
            const rel = (a.getAttribute("rel") || "").split(/\s+/);
            if (a.hasAttribute("download") || (rel && rel.includes("external")))
                return;
            const url = new URL(href);
            if (url.origin !== window.location.origin ||
                (basePath && url.pathname && !url.pathname.toLowerCase().startsWith(basePath.toLowerCase())))
                return;
            const to = parsePath(url.pathname + url.search + url.hash);
            const state = a.getAttribute("state");
            evt.preventDefault();
            navigateFromRoute(baseRoute, to, {
                resolve: false,
                replace: a.hasAttribute("replace"),
                scroll: !a.hasAttribute("noscroll"),
                state: state && JSON.parse(state)
            });
        }
        // ensure delegated events run first
        delegateEvents(["click"]);
        document.addEventListener("click", handleAnchorClick);
        onCleanup(() => document.removeEventListener("click", handleAnchorClick));
    }
    return {
        base: baseRoute,
        out: output,
        location,
        isRouting,
        renderPath,
        parsePath,
        navigatorFactory,
        beforeLeave
    };
}
function createRouteContext(router, parent, child, match, params) {
    const { base, location, navigatorFactory } = router;
    const { pattern, element: outlet, preload, data } = match().route;
    const path = createMemo(() => match().path);
    preload && preload();
    const route = {
        parent,
        pattern,
        get child() {
            return child();
        },
        path,
        params,
        data: parent.data,
        outlet,
        resolvePath(to) {
            return resolvePath(base.path(), to, path());
        }
    };
    if (data) {
        try {
            TempRoute = route;
            route.data = data({ data: parent.data, params, location, navigate: navigatorFactory(route) });
        }
        finally {
            TempRoute = undefined;
        }
    }
    return route;
}

const Router = (props) => {
  const {
    source,
    url,
    base,
    data,
    out
  } = props;
  const integration = source || (isServer ? staticIntegration({
    value: url || ""
  }) : pathIntegration());
  const routerState = createRouterContext(integration, base, data, out);
  return createComponent(RouterContextObj.Provider, {
    value: routerState,
    get children() {
      return props.children;
    }
  });
};
const Routes$1 = (props) => {
  const router = useRouter();
  const parentRoute = useRoute();
  const routeDefs = children(() => props.children);
  const branches = createMemo(() => createBranches(routeDefs(), joinPaths(parentRoute.pattern, props.base || ""), Outlet));
  const matches = createMemo(() => getRouteMatches$1(branches(), router.location.pathname));
  const params = createMemoObject(() => {
    const m = matches();
    const params2 = {};
    for (let i = 0; i < m.length; i++) {
      Object.assign(params2, m[i].params);
    }
    return params2;
  });
  if (router.out) {
    router.out.matches.push(matches().map(({
      route,
      path,
      params: params2
    }) => ({
      originalPath: route.originalPath,
      pattern: route.pattern,
      path,
      params: params2
    })));
  }
  const disposers = [];
  let root;
  const routeStates = createMemo(on(matches, (nextMatches, prevMatches, prev) => {
    let equal = prevMatches && nextMatches.length === prevMatches.length;
    const next = [];
    for (let i = 0, len = nextMatches.length; i < len; i++) {
      const prevMatch = prevMatches && prevMatches[i];
      const nextMatch = nextMatches[i];
      if (prev && prevMatch && nextMatch.route.key === prevMatch.route.key) {
        next[i] = prev[i];
      } else {
        equal = false;
        if (disposers[i]) {
          disposers[i]();
        }
        createRoot((dispose) => {
          disposers[i] = dispose;
          next[i] = createRouteContext(router, next[i - 1] || parentRoute, () => routeStates()[i + 1], () => matches()[i], params);
        });
      }
    }
    disposers.splice(nextMatches.length).forEach((dispose) => dispose());
    if (prev && equal) {
      return prev;
    }
    root = next[0];
    return next;
  }));
  return createComponent(Show, {
    get when() {
      return routeStates() && root;
    },
    keyed: true,
    children: (route) => createComponent(RouteContextObj.Provider, {
      value: route,
      get children() {
        return route.outlet();
      }
    })
  });
};
const Outlet = () => {
  const route = useRoute();
  return createComponent(Show, {
    get when() {
      return route.child;
    },
    keyed: true,
    children: (child) => createComponent(RouteContextObj.Provider, {
      value: child,
      get children() {
        return child.outlet();
      }
    })
  });
};
function A(props) {
  props = mergeProps({
    inactiveClass: "inactive",
    activeClass: "active"
  }, props);
  const [, rest] = splitProps(props, ["href", "state", "class", "activeClass", "inactiveClass", "end"]);
  const to = useResolvedPath(() => props.href);
  const href = useHref(to);
  const location = useLocation();
  const isActive = createMemo(() => {
    const to_ = to();
    if (to_ === void 0)
      return false;
    const path = normalizePath(to_.split(/[?#]/, 1)[0]).toLowerCase();
    const loc = normalizePath(location.pathname).toLowerCase();
    return props.end ? path === loc : loc.startsWith(path);
  });
  return ssrElement("a", mergeProps$1({
    link: true
  }, rest, {
    get href() {
      return href() || props.href;
    },
    get state() {
      return JSON.stringify(props.state);
    },
    get classList() {
      return {
        ...props.class && {
          [props.class]: true
        },
        [props.inactiveClass]: !isActive(),
        [props.activeClass]: isActive(),
        ...rest.classList
      };
    },
    get ["aria-current"]() {
      return isActive() ? "page" : void 0;
    }
  }), void 0, true);
}

var _tmpl$$a = ["<div", ' class="min-h-screen flex flex-col items-center justify-center px-4 text-center"><div class="max-w-2xl mx-auto space-y-8"><h1 class="text-6xl md:text-7xl font-bold mb-4"><span class="neon-green">404</span></h1><p class="text-xl opacity-80 mb-8">Page not found</p><!--$-->', "<!--/--></div></div>"];
function NotFound() {
  return ssr(_tmpl$$a, ssrHydrationKey(), escape(createComponent(A, {
    href: "/",
    "class": "bg-accent text-black px-8 py-4 rounded-lg font-semibold hover:bg-green-300 transition-all duration-200",
    children: "Go Home"
  })));
}

const defaultAttributes = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': 2,
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
};
const defaultAttributes$1 = defaultAttributes;

const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const Icon = (props) => {
  const [localProps, rest] = splitProps(props, ["color", "size", "strokeWidth", "children", "class", "name", "iconNode", "absoluteStrokeWidth"]);
  return ssrElement("svg", mergeProps$1(defaultAttributes$1, {
    get width() {
      return localProps.size ?? defaultAttributes$1.width;
    },
    get height() {
      return localProps.size ?? defaultAttributes$1.height;
    },
    get stroke() {
      return localProps.color ?? defaultAttributes$1.stroke;
    },
    get ["stroke-width"]() {
      return localProps.absoluteStrokeWidth ? Number(localProps.strokeWidth ?? defaultAttributes$1["stroke-width"]) * 24 / Number(localProps.size) : Number(localProps.strokeWidth ?? defaultAttributes$1["stroke-width"]);
    },
    get ["class"]() {
      return `lucide lucide-${toKebabCase(localProps?.name ?? "icon")} ${localProps.class != null ? localProps.class : ""}`;
    }
  }, rest), () => escape(createComponent(For, {
    get each() {
      return localProps.iconNode;
    },
    children: ([elementName, attrs]) => {
      return createComponent(Dynamic, mergeProps$1({
        component: elementName
      }, attrs));
    }
  })), true);
};
const Icon$1 = Icon;

const iconNode$4 = [["path", {
  d: "m12 19-7-7 7-7",
  key: "1l729n"
}], ["path", {
  d: "M19 12H5",
  key: "x3x0zl"
}]];
const ArrowLeft = (props) => createComponent(Icon$1, mergeProps$1(props, {
  name: "ArrowLeft",
  iconNode: iconNode$4
}));
const ArrowLeft$1 = ArrowLeft;

const iconNode$3 = [["circle", {
  cx: "12",
  cy: "12",
  r: "10",
  key: "1mglay"
}], ["path", {
  d: "m9 12 2 2 4-4",
  key: "dzmm74"
}]];
const CheckCircle2 = (props) => createComponent(Icon$1, mergeProps$1(props, {
  name: "CheckCircle2",
  iconNode: iconNode$3
}));
const CheckCircle2$1 = CheckCircle2;

const iconNode$2 = [["path", {
  d: "M21 12a9 9 0 1 1-6.219-8.56",
  key: "13zald"
}]];
const Loader2 = (props) => createComponent(Icon$1, mergeProps$1(props, {
  name: "Loader2",
  iconNode: iconNode$2
}));
const Loader2$1 = Loader2;

const iconNode$1 = [["polygon", {
  points: "5 3 19 12 5 21 5 3",
  key: "191637"
}]];
const Play = (props) => createComponent(Icon$1, mergeProps$1(props, {
  name: "Play",
  iconNode: iconNode$1
}));
const Play$1 = Play;

const iconNode = [["path", {
  d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
  key: "ih7n3h"
}], ["polyline", {
  points: "17 8 12 3 7 8",
  key: "t8dd8p"
}], ["line", {
  x1: "12",
  x2: "12",
  y1: "3",
  y2: "15",
  key: "widbto"
}]];
const Upload$1 = (props) => createComponent(Icon$1, mergeProps$1(props, {
  name: "Upload",
  iconNode
}));
const Upload$2 = Upload$1;

var _tmpl$$9 = ["<div", ' class="min-h-screen flex flex-col items-center justify-center px-4 text-center"><div class="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700"><h1 class="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-accent to-green-300 bg-clip-text text-transparent">Monetize Your Sports Videos</h1><p class="text-xl md:text-2xl mb-8 opacity-80 max-w-2xl mx-auto">Upload your training or match footage. AI startups pay for your data.</p><div class="flex flex-col sm:flex-row gap-4 justify-center items-center"><!--$-->', "<!--/--><!--$-->", '<!--/--></div><div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"><div class="glass-card p-6"><div class="text-3xl mb-3">📹</div><h3 class="text-lg font-semibold mb-2">Upload Videos</h3><p class="text-sm opacity-70">Share your sports footage with the AI community</p></div><div class="glass-card p-6"><div class="text-3xl mb-3">💰</div><h3 class="text-lg font-semibold mb-2">Get Paid</h3><p class="text-sm opacity-70">Set your price and earn from every sale</p></div><div class="glass-card p-6"><div class="text-3xl mb-3">🚀</div><h3 class="text-lg font-semibold mb-2">Help AI Grow</h3><p class="text-sm opacity-70">Your data powers the next generation of AI models</p></div></div></div></div>'];
function Home() {
  return ssr(_tmpl$$9, ssrHydrationKey(), escape(createComponent(A, {
    href: "/upload",
    "class": "bg-accent text-black px-8 py-4 rounded-lg font-semibold hover:bg-green-300 transition-all duration-200 neon-glow flex items-center gap-2 text-lg",
    get children() {
      return [createComponent(Play$1, {
        "class": "w-5 h-5"
      }), "Start Uploading"];
    }
  })), escape(createComponent(A, {
    href: "/marketplace",
    "class": "border border-accent text-accent px-8 py-4 rounded-lg font-semibold hover:bg-accent/10 transition-all duration-200",
    children: "Browse Marketplace"
  })));
}

const supabase = createClient(
  "your_supabase_url_here",
  "your_supabase_anon_key_here"
);

var _tmpl$$8 = ["<div", ' class="rounded-xl glass-card p-4 hover:bg-white/10 transition-all duration-300 relative cursor-pointer overflow-hidden group"><div class="relative mb-3 rounded-lg overflow-hidden bg-black/20"><!--$-->', '<!--/--><div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div></div><h3 class="text-lg font-semibold mb-1 text-text">', '</h3><p class="text-sm opacity-70 text-accent font-medium">$<!--$-->', "<!--/--></p><!--$-->", "<!--/--></div>"], _tmpl$2$3 = ["<img", ' class="w-full aspect-video object-cover">'], _tmpl$3$3 = ["<video", ' class="w-full aspect-video object-cover" muted preload="metadata"></video>'], _tmpl$4$2 = ["<a", ' target="_blank" rel="noopener noreferrer" class="absolute inset-0 flex items-center justify-center text-accent bg-black/80 backdrop-blur-sm rounded-lg font-semibold text-lg neon-glow animate-in fade-in duration-200">Buy Dataset</a>'];
const VideoCard = (props) => {
  const [hover, setHover] = createSignal(false);
  return ssr(_tmpl$$8, ssrHydrationKey(), props.thumbnail ? ssr(_tmpl$2$3, ssrHydrationKey() + ssrAttribute("src", escape(props.thumbnail, true), false) + ssrAttribute("alt", escape(props.title, true), false)) : ssr(_tmpl$3$3, ssrHydrationKey() + ssrAttribute("src", escape(props.videoUrl, true), false)), escape(props.title), escape(props.price), hover() && ssr(_tmpl$4$2, ssrHydrationKey() + ssrAttribute("href", escape(props.checkoutUrl, true), false)));
};

const getCheckoutUrl = (videoId, price) => {
  return `https://buy.stripe.com/your-payment-link?client_reference_id=${videoId}`;
};

var _tmpl$$7 = ["<div", ' class="min-h-screen py-12 px-4"><div class="max-w-7xl mx-auto"><div class="flex items-center justify-between mb-8">', '</div><h1 class="text-4xl md:text-5xl font-bold mb-4 text-center"><span class="neon-green">Marketplace</span></h1><p class="text-center opacity-70 mb-12 text-lg">Browse and purchase sports video datasets</p><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div></div>"], _tmpl$2$2 = ["<div", ' class="flex justify-center items-center py-20">', "</div>"], _tmpl$3$2 = ["<div", ' class="text-center py-20"><p class="text-red-400 mb-4">Error loading videos</p><p class="text-sm opacity-70">', "</p></div>"], _tmpl$4$1 = ["<div", ' class="text-center py-20"><p class="text-xl opacity-70 mb-4">No videos available yet</p><!--$-->', "<!--/--></div>"], _tmpl$5 = ["<div", ' class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">', "</div>"];
async function fetchVideos() {
  const {
    data,
    error
  } = await supabase.from("videos").select("*").order("created_at", {
    ascending: false
  });
  if (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
  return (data || []).map((video) => ({
    ...video,
    public_url: video.public_url || supabase.storage.from("videos").getPublicUrl(video.file_url).data.publicUrl
  }));
}
function Marketplace() {
  const [videos] = createResource(fetchVideos);
  return ssr(_tmpl$$7, ssrHydrationKey(), escape(createComponent(A, {
    href: "/",
    "class": "inline-flex items-center gap-2 text-accent hover:text-green-300 transition-colors",
    get children() {
      return [createComponent(ArrowLeft$1, {
        "class": "w-5 h-5"
      }), "Back to Home"];
    }
  })), videos.loading && ssr(_tmpl$2$2, ssrHydrationKey(), escape(createComponent(Loader2$1, {
    "class": "w-8 h-8 text-accent animate-spin"
  }))), videos.error && ssr(_tmpl$3$2, ssrHydrationKey(), escape(videos.error.message)), videos() && videos().length === 0 && ssr(_tmpl$4$1, ssrHydrationKey(), escape(createComponent(A, {
    href: "/upload",
    "class": "text-accent hover:text-green-300 transition-colors",
    children: "Be the first to upload!"
  }))), videos() && videos().length > 0 && ssr(_tmpl$5, ssrHydrationKey(), escape(createComponent(For, {
    get each() {
      return videos();
    },
    children: (video) => createComponent(VideoCard, {
      get videoUrl() {
        return video.public_url || "";
      },
      get title() {
        return video.title;
      },
      get price() {
        return video.price;
      },
      get checkoutUrl() {
        return getCheckoutUrl(video.id, video.price);
      }
    })
  }))));
}

var _tmpl$$6 = ["<div", ' class="min-h-screen flex flex-col items-center justify-center px-4 text-center"><div class="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700"><div class="flex justify-center"><div class="rounded-full bg-accent/20 p-6 neon-glow">', '</div></div><h1 class="text-4xl md:text-5xl font-bold mb-4"><span class="neon-green">Payment Successful!</span></h1><p class="text-xl opacity-80 mb-8">Thank you for your purchase. Your download link will be sent to your email shortly.</p><div class="flex flex-col sm:flex-row gap-4 justify-center"><!--$-->', "<!--/--><!--$-->", "<!--/--></div></div></div>"];
function Success() {
  return ssr(_tmpl$$6, ssrHydrationKey(), escape(createComponent(CheckCircle2$1, {
    "class": "w-16 h-16 text-accent"
  })), escape(createComponent(A, {
    href: "/marketplace",
    "class": "bg-accent text-black px-8 py-4 rounded-lg font-semibold hover:bg-green-300 transition-all duration-200 neon-glow",
    children: "Browse More"
  })), escape(createComponent(A, {
    href: "/",
    "class": "border border-accent text-accent px-8 py-4 rounded-lg font-semibold hover:bg-accent/10 transition-all duration-200",
    children: "Go Home"
  })));
}

const Button = (props) => {
  const [local, others] = splitProps(props, ["variant", "size", "class", "children"]);
  const variantClasses = {
    default: "bg-accent text-black hover:bg-green-300 font-semibold",
    outline: "border border-accent text-accent hover:bg-accent/10",
    ghost: "text-accent hover:bg-white/5"
  };
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  return ssrElement("button", mergeProps$1({
    get ["class"]() {
      return `rounded-lg transition-all duration-200 ${variantClasses[local.variant || "default"]} ${sizeClasses[local.size || "md"]} ${local.class || ""}`;
    }
  }, others), () => escape(local.children), true);
};

const Input = (props) => {
  const [local, others] = splitProps(props, ["class"]);
  return ssrElement("input", mergeProps$1({
    get ["class"]() {
      return `w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-text placeholder:text-gray-500 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all ${local.class || ""}`;
    }
  }, others), void 0, true);
};

var _tmpl$$5 = ["<div", ' class="glass-card p-8 shadow-xl max-w-lg mx-auto text-text"><h2 class="text-2xl font-semibold mb-6 text-center">Upload your sports clip</h2><div class="space-y-4"><div><label class="block text-sm font-medium mb-2 opacity-80">Title</label><!--$-->', '<!--/--></div><div><label class="block text-sm font-medium mb-2 opacity-80">Price ($)</label><!--$-->', '<!--/--></div><div><label class="block text-sm font-medium mb-2 opacity-80">Video File</label><label class="flex flex-col items-center justify-center w-full h-32 border-2 border-white/10 border-dashed rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition"><div class="flex flex-col items-center justify-center pt-5 pb-6"><!--$-->', '<!--/--><p class="text-sm text-gray-400">', '</p></div><input type="file" accept="video/*" class="hidden"></label></div><!--$-->', "<!--/--><!--$-->", "<!--/--><!--$-->", "<!--/--></div></div>"], _tmpl$2$1 = ["<div", ' class="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">', "</div>"], _tmpl$3$1 = ["<div", ' class="bg-accent/20 border border-accent/50 text-accent px-4 py-3 rounded-lg text-sm">Upload successful! Your video is now available in the marketplace.</div>'], _tmpl$4 = ["<svg", ' class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>'];
function UploadForm() {
  const [file, setFile] = createSignal(null);
  const [title, setTitle] = createSignal("");
  const [price, setPrice] = createSignal("20");
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");
  const [success, setSuccess] = createSignal(false);
  async function handleUpload() {
    setLoading(true);
    setError("");
    setSuccess(false);
    const f = file();
    if (!f) {
      setError("Please select a file");
      setLoading(false);
      return;
    }
    if (!title().trim()) {
      setError("Please enter a title");
      setLoading(false);
      return;
    }
    try {
      const fileName = `${Date.now()}-${f.name}`;
      const {
        data: uploadData,
        error: uploadError
      } = await supabase.storage.from("videos").upload(fileName, f, {
        cacheControl: "3600",
        upsert: false
      });
      if (uploadError) {
        setError(uploadError.message);
        setLoading(false);
        return;
      }
      const {
        data: urlData
      } = supabase.storage.from("videos").getPublicUrl(uploadData.path);
      const {
        error: dbError
      } = await supabase.from("videos").insert({
        title: title(),
        price: parseFloat(price()),
        file_url: uploadData.path,
        public_url: urlData.publicUrl,
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      });
      if (dbError) {
        setError(dbError.message);
        setLoading(false);
        return;
      }
      setSuccess(true);
      setFile(null);
      setTitle("");
      setPrice("20");
      setTimeout(() => {
        setSuccess(false);
      }, 3e3);
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }
  return ssr(_tmpl$$5, ssrHydrationKey(), escape(createComponent(Input, {
    placeholder: "Enter video title",
    get value() {
      return title();
    },
    onInput: (e) => setTitle(e.currentTarget.value)
  })), escape(createComponent(Input, {
    type: "number",
    placeholder: "20.00",
    get value() {
      return price();
    },
    onInput: (e) => setPrice(e.currentTarget.value),
    min: "0",
    step: "0.01"
  })), escape(createComponent(Upload$2, {
    "class": "w-8 h-8 mb-2 text-accent"
  })), file() ? escape(file().name) : "Click to upload or drag and drop", error() && ssr(_tmpl$2$1, ssrHydrationKey(), escape(error())), success() && _tmpl$3$1[0] + ssrHydrationKey() + _tmpl$3$1[1], escape(createComponent(Button, {
    get disabled() {
      return loading();
    },
    onClick: handleUpload,
    "class": "w-full flex items-center justify-center gap-2",
    get children() {
      return loading() ? [ssr(_tmpl$4, ssrHydrationKey()), "Uploading..."] : [createComponent(Upload$2, {
        "class": "w-5 h-5"
      }), "Upload"];
    }
  })));
}

var _tmpl$$4 = ["<div", ' class="min-h-screen py-12 px-4"><div class="max-w-4xl mx-auto"><!--$-->', "<!--/--><!--$-->", "<!--/--></div></div>"];
function Upload() {
  return ssr(_tmpl$$4, ssrHydrationKey(), escape(createComponent(A, {
    href: "/",
    "class": "inline-flex items-center gap-2 text-accent hover:text-green-300 mb-8 transition-colors",
    get children() {
      return [createComponent(ArrowLeft$1, {
        "class": "w-5 h-5"
      }), "Back to Home"];
    }
  })), escape(createComponent(UploadForm, {})));
}

const fileRoutes = [{
  component: NotFound,
  path: "/*404"
}, {
  component: Home,
  path: "/"
}, {
  component: Marketplace,
  path: "/marketplace"
}, {
  component: Success,
  path: "/success"
}, {
  component: Upload,
  path: "/upload"
}];
const FileRoutes = () => {
  return fileRoutes;
};

const routeLayouts = {
  "/*404": {
    "id": "/*404",
    "layouts": []
  },
  "/": {
    "id": "/",
    "layouts": []
  },
  "/marketplace": {
    "id": "/marketplace",
    "layouts": []
  },
  "/success": {
    "id": "/success",
    "layouts": []
  },
  "/upload": {
    "id": "/upload",
    "layouts": []
  }
};
var layouts = routeLayouts;

function flattenIslands(match, manifest, islands) {
  let result = [...match];
  match.forEach((m) => {
    if (m.type !== "island")
      return;
    const islandManifest = manifest[m.href];
    if (islandManifest) {
      const res = flattenIslands(islandManifest.assets, manifest);
      result.push(...res);
    }
  });
  return result;
}
function getAssetsFromManifest(event, matches) {
  let match = matches.reduce((memo, m) => {
    if (m.length) {
      const fullPath = m.reduce((previous, match2) => previous + match2.originalPath, "");
      const route = layouts[fullPath];
      if (route) {
        memo.push(...event.env.manifest?.[route.id]?.assets || []);
        const layoutsManifestEntries = route.layouts.flatMap((manifestKey) => event.env.manifest?.[manifestKey]?.assets || []);
        memo.push(...layoutsManifestEntries);
      }
    }
    return memo;
  }, []);
  match.push(...event.env.manifest?.["entry-client"]?.assets || []);
  match = flattenIslands(match, event.env.manifest, event.$islands);
  return match;
}

const FETCH_EVENT = "$FETCH";

const ServerContext = /* @__PURE__ */ createContext({
  $type: FETCH_EVENT
});
const useRequest = () => {
  return useContext(ServerContext);
};

const Routes = Routes$1;

const XSolidStartLocationHeader = "x-solidstart-location";
const LocationHeader = "Location";
const ContentTypeHeader = "content-type";
const XSolidStartResponseTypeHeader = "x-solidstart-response-type";
const XSolidStartContentTypeHeader = "x-solidstart-content-type";
const XSolidStartOrigin = "x-solidstart-origin";
const JSONResponseType = "application/json";
function redirect(url, init = 302) {
  let responseInit = init;
  if (typeof responseInit === "number") {
    responseInit = { status: responseInit };
  } else if (typeof responseInit.status === "undefined") {
    responseInit.status = 302;
  }
  if (url === "") {
    url = "/";
  }
  let headers = new Headers(responseInit.headers);
  headers.set(LocationHeader, url);
  const response = new Response(null, {
    ...responseInit,
    headers
  });
  return response;
}
const redirectStatusCodes = /* @__PURE__ */ new Set([204, 301, 302, 303, 307, 308]);
function isRedirectResponse(response) {
  return response && response instanceof Response && redirectStatusCodes.has(response.status);
}

class ServerError extends Error {
  status;
  constructor(message, {
    status,
    stack
  } = {}) {
    super(message);
    this.name = "ServerError";
    this.status = status || 400;
    if (stack) {
      this.stack = stack;
    }
  }
}
class FormError extends ServerError {
  formError;
  fields;
  fieldErrors;
  constructor(message, {
    fieldErrors = {},
    form,
    fields,
    stack
  } = {}) {
    super(message, {
      stack
    });
    this.formError = message;
    this.name = "FormError";
    this.fields = fields || Object.fromEntries(typeof form !== "undefined" ? form.entries() : []) || {};
    this.fieldErrors = fieldErrors;
  }
}

var _tmpl$$3 = ["<div", ' style="', '"><div style="', '"><p style="', '" id="error-message">', '</p><button id="reset-errors" style="', '">Clear errors and retry</button><pre style="', '">', "</pre></div></div>"];
function ErrorBoundary(props) {
  return createComponent(ErrorBoundary$1, {
    fallback: (e, reset) => {
      return createComponent(Show, {
        get when() {
          return !props.fallback;
        },
        get fallback() {
          return props.fallback && props.fallback(e, reset);
        },
        get children() {
          return createComponent(ErrorMessage, {
            error: e
          });
        }
      });
    },
    get children() {
      return props.children;
    }
  });
}
function ErrorMessage(props) {
  createEffect(() => console.error(props.error));
  console.log(props.error);
  return ssr(_tmpl$$3, ssrHydrationKey(), ssrStyleProperty("padding:", "16px"), ssrStyleProperty("background-color:", "rgba(252, 165, 165)") + ssrStyleProperty(";color:", "rgb(153, 27, 27)") + ssrStyleProperty(";border-radius:", "5px") + ssrStyleProperty(";overflow:", "scroll") + ssrStyleProperty(";padding:", "16px") + ssrStyleProperty(";margin-bottom:", "8px"), ssrStyleProperty("font-weight:", "bold"), escape(props.error.message), ssrStyleProperty("color:", "rgba(252, 165, 165)") + ssrStyleProperty(";background-color:", "rgb(153, 27, 27)") + ssrStyleProperty(";border-radius:", "5px") + ssrStyleProperty(";padding:", "4px 8px"), ssrStyleProperty("margin-top:", "8px") + ssrStyleProperty(";width:", "100%"), escape(props.error.stack));
}

var _tmpl$$2 = ["<link", ' rel="stylesheet"', ">"], _tmpl$2 = ["<link", ' rel="modulepreload"', ">"];
function Links() {
  const context = useRequest();
  useAssets(() => {
    let match = getAssetsFromManifest(context, context.routerContext.matches);
    const links = match.reduce((r, src) => {
      let el = src.type === "style" ? ssr(_tmpl$$2, ssrHydrationKey(), ssrAttribute("href", escape(src.href, true), false)) : src.type === "script" ? ssr(_tmpl$2, ssrHydrationKey(), ssrAttribute("href", escape(src.href, true), false)) : void 0;
      if (el)
        r[src.href] = el;
      return r;
    }, {});
    return Object.values(links);
  });
  return null;
}

var _tmpl$3 = ["<script", ' type="module" async', "><\/script>"];
const isDev = "production" === "development";
const isIslands = false;
function IslandsScript() {
  return isIslands ;
}
function DevScripts() {
  return isDev ;
}
function ProdScripts() {
  const context = useRequest();
  return [createComponent(HydrationScript, {}), createComponent(NoHydration, {
    get children() {
      return [createComponent(IslandsScript, {}), isServer && (ssr(_tmpl$3, ssrHydrationKey(), ssrAttribute("src", escape(context.env.manifest?.["entry-client"].script.href, true), false)) )];
    }
  })];
}
function Scripts() {
  return [createComponent(DevScripts, {}), createComponent(ProdScripts, {})];
}

function Html(props) {
  {
    return ssrElement("html", props, void 0, false);
  }
}
function Head(props) {
  {
    return ssrElement("head", props, () => [escape(props.children), createComponent(Links, {})], false);
  }
}
function Body(props) {
  {
    return ssrElement("body", props, () => escape(props.children) , false);
  }
}

var _tmpl$$1 = ["<nav", ' class="flex justify-between items-center p-4 glass-nav sticky top-0 z-50"><!--$-->', '<!--/--><div class="space-x-6 flex items-center"><!--$-->', "<!--/--><!--$-->", "<!--/--></div></nav>"];
function Navbar() {
  return ssr(_tmpl$$1, ssrHydrationKey(), escape(createComponent(A, {
    href: "/",
    "class": "text-2xl font-bold neon-green hover:opacity-80 transition",
    children: "SportsDataDrop"
  })), escape(createComponent(A, {
    href: "/marketplace",
    "class": "text-text hover:text-accent transition-colors duration-200",
    children: "Marketplace"
  })), escape(createComponent(A, {
    href: "/upload",
    "class": "text-text hover:text-accent transition-colors duration-200",
    children: "Upload"
  })));
}

const globals = '';

var _tmpl$ = ["<div", ' class="min-h-screen bg-background"><!--$-->', "<!--/--><!--$-->", "<!--/--></div>"];
function Root() {
  return createComponent(Html, {
    lang: "en",
    get children() {
      return [createComponent(Head, {
        get children() {
          return [createComponent(Title, {
            children: "SportsDataDrop - Monetize Your Sports Videos"
          }), createComponent(Meta, {
            charset: "utf-8"
          }), createComponent(Meta, {
            name: "viewport",
            content: "width=device-width, initial-scale=1"
          }), createComponent(Meta, {
            name: "description",
            content: "Monetize your sports videos - AI startups pay for your data"
          }), createComponent(Link, {
            rel: "preconnect",
            href: "https://fonts.googleapis.com"
          }), createComponent(Link, {
            rel: "preconnect",
            href: "https://fonts.gstatic.com",
            crossOrigin: "anonymous"
          })];
        }
      }), createComponent(Body, {
        get children() {
          return [ssr(_tmpl$, ssrHydrationKey(), escape(createComponent(Navbar, {})), escape(createComponent(Suspense, {
            get children() {
              return createComponent(ErrorBoundary, {
                get children() {
                  return createComponent(Routes, {
                    get children() {
                      return createComponent(FileRoutes, {});
                    }
                  });
                }
              });
            }
          }))), createComponent(Scripts, {})];
        }
      })];
    }
  });
}

const rootData = Object.values(/* #__PURE__ */ Object.assign({

}))[0];
const dataFn = rootData ? rootData.default : void 0;
const composeMiddleware = (exchanges) => ({
  forward
}) => exchanges.reduceRight((forward2, exchange) => exchange({
  forward: forward2
}), forward);
function createHandler(...exchanges) {
  const exchange = composeMiddleware(exchanges);
  return async (event) => {
    return await exchange({
      forward: async (op) => {
        return new Response(null, {
          status: 404
        });
      }
    })(event);
  };
}
function StartRouter(props) {
  return createComponent(Router, props);
}
const docType = ssr("<!DOCTYPE html>");
function StartServer({
  event
}) {
  const parsed = new URL(event.request.url);
  const path = parsed.pathname + parsed.search;
  sharedConfig.context.requestContext = event;
  return createComponent(ServerContext.Provider, {
    value: event,
    get children() {
      return createComponent(MetaProvider, {
        get children() {
          return createComponent(StartRouter, {
            url: path,
            get out() {
              return event.routerContext;
            },
            location: path,
            get prevLocation() {
              return event.prevUrl;
            },
            data: dataFn,
            routes: fileRoutes,
            get children() {
              return [docType, createComponent(Root, {})];
            }
          });
        }
      });
    }
  });
}

function getRouteMatches(routes, path, method) {
  const segments = path.split("/").filter(Boolean);
  routeLoop:
    for (const route of routes) {
      const matchSegments = route.matchSegments;
      if (segments.length < matchSegments.length || !route.wildcard && segments.length > matchSegments.length) {
        continue;
      }
      for (let index = 0; index < matchSegments.length; index++) {
        const match = matchSegments[index];
        if (!match) {
          continue;
        }
        if (segments[index] !== match) {
          continue routeLoop;
        }
      }
      const handler = route[method];
      if (handler === "skip" || handler === void 0) {
        return;
      }
      const params = {};
      for (const { type, name, index } of route.params) {
        if (type === ":") {
          params[name] = segments[index];
        } else {
          params[name] = segments.slice(index).join("/");
        }
      }
      return { handler, params };
    }
}

let apiRoutes$1;
const registerApiRoutes = (routes) => {
  apiRoutes$1 = routes;
};
async function internalFetch(route, init, env = {}, locals = {}) {
  if (route.startsWith("http")) {
    return await fetch(route, init);
  }
  let url = new URL(route, "http://internal");
  const request = new Request(url.href, init);
  const handler = getRouteMatches(apiRoutes$1, url.pathname, request.method.toUpperCase());
  if (!handler) {
    throw new Error(`No handler found for ${request.method} ${request.url}`);
  }
  let apiEvent = Object.freeze({
    request,
    params: handler.params,
    clientAddress: "127.0.0.1",
    env,
    locals,
    $type: FETCH_EVENT,
    fetch: internalFetch
  });
  const response = await handler.handler(apiEvent);
  return response;
}

const api = [
  {
    GET: "skip",
    path: "/*404"
  },
  {
    GET: "skip",
    path: "/"
  },
  {
    GET: "skip",
    path: "/marketplace"
  },
  {
    GET: "skip",
    path: "/success"
  },
  {
    GET: "skip",
    path: "/upload"
  }
];
function expandOptionals(pattern) {
  let match = /(\/?\:[^\/]+)\?/.exec(pattern);
  if (!match)
    return [pattern];
  let prefix = pattern.slice(0, match.index);
  let suffix = pattern.slice(match.index + match[0].length);
  const prefixes = [prefix, prefix += match[1]];
  while (match = /^(\/\:[^\/]+)\?/.exec(suffix)) {
    prefixes.push(prefix += match[1]);
    suffix = suffix.slice(match[0].length);
  }
  return expandOptionals(suffix).reduce(
    (results, expansion) => [...results, ...prefixes.map((p) => p + expansion)],
    []
  );
}
function routeToMatchRoute(route) {
  const segments = route.path.split("/").filter(Boolean);
  const params = [];
  const matchSegments = [];
  let score = 0;
  let wildcard = false;
  for (const [index, segment] of segments.entries()) {
    if (segment[0] === ":") {
      const name = segment.slice(1);
      score += 3;
      params.push({
        type: ":",
        name,
        index
      });
      matchSegments.push(null);
    } else if (segment[0] === "*") {
      score -= 1;
      params.push({
        type: "*",
        name: segment.slice(1),
        index
      });
      wildcard = true;
    } else {
      score += 4;
      matchSegments.push(segment);
    }
  }
  return {
    ...route,
    score,
    params,
    matchSegments,
    wildcard
  };
}
const allRoutes = api.flatMap((route) => {
  const paths = expandOptionals(route.path);
  return paths.map((path) => ({ ...route, path }));
}).map(routeToMatchRoute).sort((a, b) => b.score - a.score);
registerApiRoutes(allRoutes);
function getApiHandler(url, method) {
  return getRouteMatches(allRoutes, url.pathname, method.toUpperCase());
}

const apiRoutes = ({ forward }) => {
  return async (event) => {
    let apiHandler = getApiHandler(new URL(event.request.url), event.request.method);
    if (apiHandler) {
      let apiEvent = Object.freeze({
        request: event.request,
        httpServer: event.httpServer,
        clientAddress: event.clientAddress,
        locals: event.locals,
        params: apiHandler.params,
        env: event.env,
        $type: FETCH_EVENT,
        fetch: event.fetch
      });
      try {
        return await apiHandler.handler(apiEvent);
      } catch (error) {
        if (error instanceof Response) {
          return error;
        }
        return new Response(
          JSON.stringify({
            error: error.message
          }),
          {
            headers: {
              "Content-Type": "application/json"
            },
            status: 500
          }
        );
      }
    }
    return await forward(event);
  };
};

const server$ = (_fn) => {
  throw new Error("Should be compiled away");
};
async function parseRequest(event) {
  let request = event.request;
  let contentType = request.headers.get(ContentTypeHeader);
  let name = new URL(request.url).pathname, args = [];
  if (contentType) {
    if (contentType === JSONResponseType) {
      let text = await request.text();
      try {
        args = JSON.parse(
          text,
          (key, value) => {
            if (!value) {
              return value;
            }
            if (value.$type === "fetch_event") {
              return event;
            }
            return value;
          }
        );
      } catch (e) {
        throw new Error(`Error parsing request body: ${text}`);
      }
    } else if (contentType.includes("form")) {
      let formData = await request.clone().formData();
      args = [formData, event];
    }
  }
  return [name, args];
}
function respondWith(request, data, responseType) {
  if (data instanceof Response) {
    if (isRedirectResponse(data) && request.headers.get(XSolidStartOrigin) === "client") {
      let headers = new Headers(data.headers);
      headers.set(XSolidStartOrigin, "server");
      headers.set(XSolidStartLocationHeader, data.headers.get(LocationHeader) ?? "/");
      headers.set(XSolidStartResponseTypeHeader, responseType);
      headers.set(XSolidStartContentTypeHeader, "response");
      return new Response(null, {
        status: 204,
        statusText: "Redirected",
        headers
      });
    } else if (data.status === 101) {
      return data;
    } else {
      let headers = new Headers(data.headers);
      headers.set(XSolidStartOrigin, "server");
      headers.set(XSolidStartResponseTypeHeader, responseType);
      headers.set(XSolidStartContentTypeHeader, "response");
      return new Response(data.body, {
        status: data.status,
        statusText: data.statusText,
        headers
      });
    }
  } else if (data instanceof FormError) {
    return new Response(
      JSON.stringify({
        error: {
          message: data.message,
          stack: "",
          formError: data.formError,
          fields: data.fields,
          fieldErrors: data.fieldErrors
        }
      }),
      {
        status: 400,
        headers: {
          [XSolidStartResponseTypeHeader]: responseType,
          [XSolidStartContentTypeHeader]: "form-error"
        }
      }
    );
  } else if (data instanceof ServerError) {
    return new Response(
      JSON.stringify({
        error: {
          message: data.message,
          stack: ""
        }
      }),
      {
        status: data.status,
        headers: {
          [XSolidStartResponseTypeHeader]: responseType,
          [XSolidStartContentTypeHeader]: "server-error"
        }
      }
    );
  } else if (data instanceof Error) {
    console.error(data);
    return new Response(
      JSON.stringify({
        error: {
          message: "Internal Server Error",
          stack: "",
          status: data.status
        }
      }),
      {
        status: data.status || 500,
        headers: {
          [XSolidStartResponseTypeHeader]: responseType,
          [XSolidStartContentTypeHeader]: "error"
        }
      }
    );
  } else if (typeof data === "object" || typeof data === "string" || typeof data === "number" || typeof data === "boolean") {
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        [ContentTypeHeader]: "application/json",
        [XSolidStartResponseTypeHeader]: responseType,
        [XSolidStartContentTypeHeader]: "json"
      }
    });
  }
  return new Response("null", {
    status: 200,
    headers: {
      [ContentTypeHeader]: "application/json",
      [XSolidStartContentTypeHeader]: "json",
      [XSolidStartResponseTypeHeader]: responseType
    }
  });
}
async function handleServerRequest(event) {
  const url = new URL(event.request.url);
  if (server$.hasHandler(url.pathname)) {
    try {
      let [name, args] = await parseRequest(event);
      let handler = server$.getHandler(name);
      if (!handler) {
        throw {
          status: 404,
          message: "Handler Not Found for " + name
        };
      }
      const data = await handler.call(event, ...Array.isArray(args) ? args : [args]);
      return respondWith(event.request, data, "return");
    } catch (error) {
      return respondWith(event.request, error, "throw");
    }
  }
  return null;
}
const handlers = /* @__PURE__ */ new Map();
server$.createHandler = (_fn, hash, serverResource) => {
  let fn = function(...args) {
    let ctx;
    if (typeof this === "object") {
      ctx = this;
    } else if (sharedConfig.context && sharedConfig.context.requestContext) {
      ctx = sharedConfig.context.requestContext;
    } else {
      ctx = {
        request: new URL(hash, `http://localhost:${process.env.PORT ?? 3e3}`).href,
        responseHeaders: new Headers()
      };
    }
    const execute = async () => {
      try {
        return serverResource ? _fn.call(ctx, args[0], ctx) : _fn.call(ctx, ...args);
      } catch (e) {
        if (e instanceof Error && /[A-Za-z]+ is not defined/.test(e.message)) {
          const error = new Error(
            e.message + "\n You probably are using a variable defined in a closure in your server function."
          );
          error.stack = e.stack;
          throw error;
        }
        throw e;
      }
    };
    return execute();
  };
  fn.url = hash;
  fn.action = function(...args) {
    return fn.call(this, ...args);
  };
  return fn;
};
server$.registerHandler = function(route, handler) {
  handlers.set(route, handler);
};
server$.getHandler = function(route) {
  return handlers.get(route);
};
server$.hasHandler = function(route) {
  return handlers.has(route);
};
server$.fetch = internalFetch;

const inlineServerFunctions = ({ forward }) => {
  return async (event) => {
    const url = new URL(event.request.url);
    if (server$.hasHandler(url.pathname)) {
      let contentType = event.request.headers.get(ContentTypeHeader);
      let origin = event.request.headers.get(XSolidStartOrigin);
      let formRequestBody;
      if (contentType != null && contentType.includes("form") && !(origin != null && origin.includes("client"))) {
        let [read1, read2] = event.request.body.tee();
        formRequestBody = new Request(event.request.url, {
          body: read2,
          headers: event.request.headers,
          method: event.request.method,
          duplex: "half"
        });
        event.request = new Request(event.request.url, {
          body: read1,
          headers: event.request.headers,
          method: event.request.method,
          duplex: "half"
        });
      }
      let serverFunctionEvent = Object.freeze({
        request: event.request,
        clientAddress: event.clientAddress,
        locals: event.locals,
        fetch: event.fetch,
        $type: FETCH_EVENT,
        env: event.env
      });
      const serverResponse = await handleServerRequest(serverFunctionEvent);
      if (serverResponse) {
        let responseContentType = serverResponse.headers.get(XSolidStartContentTypeHeader);
        if (formRequestBody && responseContentType !== null && responseContentType.includes("error")) {
          const formData = await formRequestBody.formData();
          let entries = [...formData.entries()];
          return new Response(null, {
            status: 302,
            headers: {
              Location: new URL(event.request.headers.get("referer")).pathname + "?form=" + encodeURIComponent(
                JSON.stringify({
                  url: url.pathname,
                  entries,
                  ...await serverResponse.json()
                })
              )
            }
          });
        }
        return serverResponse;
      }
    }
    const response = await forward(event);
    return response;
  };
};

function renderAsync$1(fn, options) {
  return () => async (event) => {
    let pageEvent = createPageEvent(event);
    let markup = await renderToStringAsync(() => fn(pageEvent), options);
    if (pageEvent.routerContext && pageEvent.routerContext.url) {
      return redirect(pageEvent.routerContext.url, {
        headers: pageEvent.responseHeaders
      });
    }
    markup = handleIslandsRouting(pageEvent, markup);
    return new Response(markup, {
      status: pageEvent.getStatusCode(),
      headers: pageEvent.responseHeaders
    });
  };
}
function createPageEvent(event) {
  let responseHeaders = new Headers({
    "Content-Type": "text/html"
  });
  const prevPath = event.request.headers.get("x-solid-referrer");
  const mutation = event.request.headers.get("x-solid-mutation") === "true";
  let statusCode = 200;
  function setStatusCode(code) {
    statusCode = code;
  }
  function getStatusCode() {
    return statusCode;
  }
  const pageEvent = {
    request: event.request,
    prevUrl: prevPath || "",
    routerContext: {},
    mutation,
    tags: [],
    env: event.env,
    clientAddress: event.clientAddress,
    locals: event.locals,
    $type: FETCH_EVENT,
    responseHeaders,
    setStatusCode,
    getStatusCode,
    $islands: /* @__PURE__ */ new Set(),
    fetch: event.fetch
  };
  return pageEvent;
}
function handleIslandsRouting(pageEvent, markup) {
  if (pageEvent.mutation) {
    pageEvent.routerContext.replaceOutletId = "outlet-0";
    pageEvent.routerContext.newOutletId = "outlet-0";
  }
  return markup;
}

const renderAsync = (fn, options) => composeMiddleware([apiRoutes, inlineServerFunctions, renderAsync$1(fn, options)]);

const entryServer = createHandler(renderAsync((event) => createComponent(StartServer, {
  event
})));

export { entryServer as default };
