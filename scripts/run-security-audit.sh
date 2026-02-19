#!/bin/bash
#
# Iron Rule Security Audit Script
#
# This script automates the verification of the "Iron Rule" of data isolation.
# It checks that a user cannot access or modify data belonging to another user.
#
# PRE-REQUISITES:
# 1. The backend API must be running.
# 2. You must have valid JWT tokens for two different users who have tasks.
#    - User A: The user performing the actions.
#    - User B: The user who owns the target task that User A should NOT be able to access.
# 3. You must have the ID of a task that belongs to User B.
#
# USAGE:
#   export API_URL="http://127.0.0.1:8000"
#   export TOKEN_USER_A="<JWT_TOKEN_FOR_USER_A>"
#   export TASK_ID_USER_B="<ID_OF_A_TASK_BELONGING_TO_USER_B>"
#   ./scripts/run-security-audit.sh
#

# --- Configuration ---
: "${API_URL?Please set API_URL (e.g., http://127.0.0.1:8000)}"
: "${TOKEN_USER_A?Please set TOKEN_USER_A with a valid JWT}"
: "${TASK_ID_USER_B?Please set TASK_ID_USER_B with a task ID from another user}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}--- Iron Rule Security Audit ---${NC}"
echo "API Server: $API_URL"
echo "Attacking User: User A (using provided token)"
echo "Target Task ID: $TASK_ID_USER_B (owned by User B)"
echo ""

# --- Test Functions ---

# Function to make a request and check the status code
# $1: Test Name
# $2: HTTP Method (GET, PUT, DELETE)
# $3: API Path
# $4: Expected HTTP Status Code
assert_status() {
    local test_name="$1"
    local method="$2"
    local path="$3"
    local expected_status="$4"

    echo -n "Running test: '$test_name'... "

    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
        -X "$method" \
        -H "Authorization: Bearer $TOKEN_USER_A" \
        -H "Content-Type: application/json" \
        -d '{"title": "test", "is_completed": true}' \
        "$API_URL$path")

    if [ "$RESPONSE" -eq "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} (Expected $expected_status, Got $RESPONSE)"
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Expected $expected_status, Got $RESPONSE)"
        return 1
    fi
}

# --- Execution ---
let "failures = 0"

# Test 1: User A tries to GET a task belonging to User B
assert_status "Deny READ access to other's task" "GET" "/api/v1/tasks/$TASK_ID_USER_B" 404 || failures=$((failures + 1))

# Test 2: User A tries to UPDATE a task belonging to User B
assert_status "Deny UPDATE access to other's task" "PUT" "/api/v1/tasks/$TASK_ID_USER_B" 404 || failures=$((failures + 1))

# Test 3: User A tries to DELETE a task belonging to User B
assert_status "Deny DELETE access to other's task" "DELETE" "/api/v1/tasks/$TASK_ID_USER_B" 404 || failures=$((failures + 1))

echo ""
if [ "$failures" -eq 0 ]; then
    echo -e "${GREEN}✓✓✓ All security audit tests passed! The Iron Rule is upheld. ✓✓✓${NC}"
    exit 0
else
    echo -e "${RED}✗✗✗ CRITICAL: $failures security audit test(s) failed! The Iron Rule is broken. ✗✗✗${NC}"
    exit 1
fi
