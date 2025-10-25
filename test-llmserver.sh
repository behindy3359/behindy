#!/bin/bash

echo "🧪 LLM Server 테스트 실행..."
cd llmserver

# conftest.py 임시 제거 (의존성 문제 회피)
if [ -f "tests/conftest.py" ]; then
    mv tests/conftest.py tests/conftest.py.bak
fi

pytest tests/test_utils.py -v

# conftest.py 복원
if [ -f "tests/conftest.py.bak" ]; then
    mv tests/conftest.py.bak tests/conftest.py
fi
