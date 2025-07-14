DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM init_status WHERE script_name = 'admin_user_v1.0') THEN

        -- 🔧 수정: USERS 테이블 존재 확인 (대문자)
        IF EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_schema = 'public' AND UPPER(table_name) = 'USERS'
        ) THEN

            -- 관리자 계정이 이미 있는지 확인
            IF NOT EXISTS (SELECT 1 FROM USERS WHERE user_email = 'admin@behindy.com') THEN

                -- 🔧 수정: 실제 관리자 계정 생성 (암호화된 비밀번호 사용)
                -- 비밀번호는 애플리케이션에서 BCrypt로 암호화해야 함
                -- 여기서는 placeholder로 제공
                RAISE NOTICE '관리자 계정은 애플리케이션 시작 후 별도 생성이 필요합니다';

            ELSE
                RAISE NOTICE '관리자 계정이 이미 존재합니다';
            END IF;

        ELSE
            RAISE NOTICE 'USERS 테이블이 아직 생성되지 않았습니다';
        END IF;

        INSERT INTO init_status (script_name, description)
        VALUES ('admin_user_v1.0', '관리자 계정 설정 스크립트 실행 완료');

    ELSE
        RAISE NOTICE '관리자 계정 설정은 이미 완료되었습니다';
    END IF;
END $$;

-- 초기화 상태 최종 확인
SELECT script_name, executed_at, version, description
FROM init_status
ORDER BY executed_at;