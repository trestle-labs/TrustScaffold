#!/usr/bin/env bash
# setup.sh — Cold-fork bootstrap for TrustScaffold local development.
# Runs everything in test plan sections 0.1-0.5 unattended.
# Usage: bash scripts/setup.sh

set -euo pipefail

# ── Colours ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✓${NC} $*"; }
warn() { echo -e "${YELLOW}⚠${NC}  $*"; }
fail() { echo -e "${RED}✗${NC} $*"; exit 1; }
step() { echo -e "\n${CYAN}▶ $*${NC}"; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

# ── 1. Node version ───────────────────────────────────────────────────────────
step "Checking Node.js"
NODE_MAJOR=$(node -e "process.stdout.write(process.versions.node.split('.')[0])" 2>/dev/null) || fail "Node.js not found. Install Node 20+."
[[ "$NODE_MAJOR" -ge 20 ]] || fail "Node $NODE_MAJOR detected — Node 20+ required."
ok "Node $(node --version)"

# ── 2. npm install ────────────────────────────────────────────────────────────
step "Installing dependencies"
npm install --prefer-offline --no-audit --no-fund 2>&1 | tail -3
ok "npm install complete"

# ── 3. Supabase CLI ───────────────────────────────────────────────────────────
step "Checking Supabase CLI"
if ! command -v supabase &>/dev/null && ! npx supabase --version &>/dev/null 2>&1; then
  fail "Supabase CLI not available. Run: npm install -g supabase"
fi
SUPA_CMD="npx supabase"
ok "Supabase CLI ready"

# ── 4. Start Supabase ─────────────────────────────────────────────────────────
step "Starting Supabase local stack"
$SUPA_CMD start 2>&1 | grep -E '(Starting|Applying|Seeding|Started|Error|failed)' || true
ok "Supabase stack started"

# ── 5. Parse supabase status → .env.local ─────────────────────────────────────
step "Generating .env.local from supabase status"

PROJECT_URL=""; ANON_KEY=""; SERVICE_KEY=""

# Strategy 1: --output env (Supabase CLI v2 native, most reliable)
if ENV_OUT=$($SUPA_CMD status --output env 2>/dev/null) && [[ -n "$ENV_OUT" ]]; then
  PROJECT_URL=$(echo "$ENV_OUT" | grep -i 'API_URL\|SUPABASE_URL\|PROJECT_URL'  | head -1 | cut -d= -f2- | tr -d '[:space:]"')
  ANON_KEY=$(echo    "$ENV_OUT" | grep -i 'ANON_KEY'                            | head -1 | cut -d= -f2- | tr -d '[:space:]"')
  SERVICE_KEY=$(echo "$ENV_OUT" | grep -i 'SERVICE_ROLE_KEY\|SERVICE_KEY'       | head -1 | cut -d= -f2- | tr -d '[:space:]"')
fi

# Strategy 2: grep patterns against the human-readable table (strips box chars)
if [[ -z "$PROJECT_URL" || -z "$ANON_KEY" || -z "$SERVICE_KEY" ]]; then
  STATUS=$($SUPA_CMD status 2>/dev/null)
  [[ -z "$PROJECT_URL" ]] && PROJECT_URL=$(echo "$STATUS" | grep -i "Project URL\|api_url" | grep -oE 'https?://[^[:space:]]+' | head -1)
  [[ -z "$ANON_KEY" ]]    && ANON_KEY=$(echo    "$STATUS" | grep -i "Publishable\|anon_key" | grep -oE 'sb_publishable_[A-Za-z0-9_-]+' | head -1)
  [[ -z "$SERVICE_KEY" ]] && SERVICE_KEY=$(echo "$STATUS" | grep -i "Secret\|service_role"  | grep -oE 'sb_secret_[A-Za-z0-9_-]+'      | head -1)
fi

# Strategy 3: well-known local dev defaults (always correct for stock config)
[[ -z "$PROJECT_URL" ]] && { warn "Falling back to default local Supabase URL"; PROJECT_URL="http://127.0.0.1:54321"; }
[[ -z "$ANON_KEY" ]]    && fail "Could not determine anon key. Run: npx supabase status"
[[ -z "$SERVICE_KEY" ]] && fail "Could not determine service role key. Run: npx supabase status"

# Compare against any existing .env.local and warn on drift
if [[ -f .env.local ]]; then
  EXISTING_URL=$(grep -i 'NEXT_PUBLIC_SUPABASE_URL'     .env.local | cut -d= -f2- | tr -d '[:space:]"' || true)
  EXISTING_ANON=$(grep -i 'NEXT_PUBLIC_SUPABASE_ANON_KEY' .env.local | cut -d= -f2- | tr -d '[:space:]"' || true)
  EXISTING_SVC=$(grep -i 'SUPABASE_SERVICE_ROLE_KEY'    .env.local | cut -d= -f2- | tr -d '[:space:]"' || true)

  DRIFT=0
  [[ "$EXISTING_URL"  != "$PROJECT_URL" ]] && { warn "URL mismatch:  existing=$EXISTING_URL  new=$PROJECT_URL";   DRIFT=1; }
  [[ "$EXISTING_ANON" != "$ANON_KEY" ]]    && { warn "Anon key mismatch — keys have rotated or env is stale";     DRIFT=1; }
  [[ "$EXISTING_SVC"  != "$SERVICE_KEY" ]] && { warn "Service key mismatch — keys have rotated or env is stale";  DRIFT=1; }

  if [[ "$DRIFT" -eq 0 ]]; then
    ok ".env.local already correct — no changes needed"
  else
    warn "Overwriting .env.local with values from running Supabase instance"
    printf 'NEXT_PUBLIC_SUPABASE_URL=%s\nNEXT_PUBLIC_SUPABASE_ANON_KEY=%s\nSUPABASE_SERVICE_ROLE_KEY=%s\n' \
      "$PROJECT_URL" "$ANON_KEY" "$SERVICE_KEY" > .env.local
    ok ".env.local updated"
  fi
else
  # Write fresh — printf ensures Unix line endings, no quotes, no backslashes
  printf 'NEXT_PUBLIC_SUPABASE_URL=%s\nNEXT_PUBLIC_SUPABASE_ANON_KEY=%s\nSUPABASE_SERVICE_ROLE_KEY=%s\n' \
    "$PROJECT_URL" "$ANON_KEY" "$SERVICE_KEY" > .env.local
  ok ".env.local created"
fi

echo "  NEXT_PUBLIC_SUPABASE_URL=$PROJECT_URL"
echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY=$ANON_KEY"
echo "  SUPABASE_SERVICE_ROLE_KEY=${SERVICE_KEY:0:12}…"

# ── 6. Create evidence storage bucket ─────────────────────────────────────────
step "Creating evidence storage bucket"
BUCKET_RESPONSE=$(curl -s -X POST "${PROJECT_URL}/storage/v1/bucket" \
  -H "Authorization: Bearer ${SERVICE_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"id":"evidence","name":"evidence","public":false}' 2>/dev/null)

if echo "$BUCKET_RESPONSE" | grep -q '"name"'; then
  ok "Storage bucket 'evidence' created"
elif echo "$BUCKET_RESPONSE" | grep -qi "already exists"; then
  ok "Storage bucket 'evidence' already exists"
else
  warn "Storage bucket creation returned: $BUCKET_RESPONSE"
  warn "Evidence ingestion (test plan §6) will be unavailable — wizard flow unaffected."
fi

# ── 7. Verify template seed ───────────────────────────────────────────────────
step "Verifying template seed"
DB_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
TEMPLATE_COUNT=$(PGPASSWORD=postgres psql "$DB_URL" -t -c "SELECT COUNT(*) FROM public.templates;" 2>/dev/null | tr -d '[:space:]')

if [[ -z "$TEMPLATE_COUNT" ]]; then
  warn "Could not query template count — psql may not be installed. Skipping."
elif [[ "$TEMPLATE_COUNT" -ge 16 ]]; then
  ok "Template seed verified: $TEMPLATE_COUNT templates"
else
  fail "Expected ≥16 templates, found $TEMPLATE_COUNT. Run: npx supabase db reset"
fi

# ── 8. Production build ───────────────────────────────────────────────────────
step "Running production build"
npm run build 2>&1 | grep -E '(Compiled|error|Error|warn|✓|✗|Route)' | grep -v '^$' || true

# Confirm build succeeded by checking for .next/
[[ -d ".next" ]] || fail "Build failed — .next/ directory not created."
ok "Build passed"

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Setup complete. Start the dev server with:${NC}"
echo -e "${GREEN}    npm run dev${NC}"
echo -e "${GREEN}  Then open: http://localhost:3000/signup${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
