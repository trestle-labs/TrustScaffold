import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

import { isRecoverableSupabaseAuthErrorMessage } from '@/lib/auth/supabase-auth-errors';
import { getSupabasePublicConfig } from '@/lib/supabase-public-env';

export async function updateSession(request: NextRequest) {
  type CookieWrite = { name: string; value: string; options: CookieOptions };

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const { url, anonKey } = getSupabasePublicConfig();

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieWrite[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError && isRecoverableSupabaseAuthErrorMessage(authError.message)) {
    return { response, user: null };
  }

  let user = authUser;

  if (user) {
    const { error: membershipError } = await supabase
      .from('organization_members')
      .select('user_id')
      .eq('user_id', user.id)
      .limit(1);

    if (membershipError && isRecoverableSupabaseAuthErrorMessage(membershipError.message)) {
      user = null;
    }
  }

  return { response, user };
}
