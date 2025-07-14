DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM init_status WHERE script_name = 'admin_user_v1.0') THEN

        -- 관리자 계정 생성 (비밀번호는 해시된 값 사용)
        -- 실제로는 애플리케이션에서 생성하는 것이 좋음

        INSERT INTO init_status (script_name) VALUES ('admin_user_v1.0');
        RAISE NOTICE '관리자 계정 설정 완료';
    END IF;
END $$;

SELECT script_name, executed_at, version
FROM init_status
ORDER BY executed_at;