import type { Route } from 'next';

function buildRouteWithParams(basePath: string, params?: Record<string, string | null | undefined>): Route {
  if (!params) {
    return basePath as Route;
  }

  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === 'string' && value.length > 0) {
      searchParams.set(key, value);
    }
  }

  const query = searchParams.toString();
  return query ? `${basePath}?${query}` as never : basePath as Route;
}

export function buildGeneratedDocRoute(documentId: string, params?: Record<string, string | null | undefined>): Route {
  return buildRouteWithParams(`/generated-docs/${documentId}`, params);
}

export function buildGeneratedDocsRoute(params?: Record<string, string | null | undefined>): Route {
  return buildRouteWithParams('/generated-docs', params);
}

export function buildGeneratedDocErrorRoute(documentId: string, message: string): Route {
  return buildGeneratedDocRoute(documentId, { error: message });
}

export function buildGeneratedDocSuccessRoute(documentId: string, message: string): Route {
  return buildGeneratedDocRoute(documentId, { success: message });
}

export function buildGeneratedDocsErrorRoute(message: string): Route {
  return buildGeneratedDocsRoute({ error: message });
}

export function buildGeneratedDocsSuccessRoute(message: string): Route {
  return buildGeneratedDocsRoute({ success: message });
}
