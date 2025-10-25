#!/bin/bash

echo "🧪 Backend 테스트 실행..."
cd backend && ./gradlew test --no-daemon
