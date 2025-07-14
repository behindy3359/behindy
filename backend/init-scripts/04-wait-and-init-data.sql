-- 04-wait-and-init-data.sql
-- JPA 테이블 생성 후 실행할 데이터 초기화 스크립트

-- 테이블 존재 대기 함수 생성
CREATE OR REPLACE FUNCTION wait_for_table(table_name TEXT, max_wait_seconds INTEGER DEFAULT 300)
RETURNS BOOLEAN AS $$
DECLARE
    wait_count INTEGER := 0;
    table_exists BOOLEAN := FALSE;
BEGIN
    WHILE wait_count < max_wait_seconds AND NOT table_exists LOOP
        SELECT EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_schema = 'public'
            AND UPPER(table_name) = UPPER($1)
        ) INTO table_exists;

        IF NOT table_exists THEN
            PERFORM pg_sleep(1);
            wait_count := wait_count + 1;
        END IF;
    END LOOP;

    RETURN table_exists;
END;
$$ LANGUAGE plpgsql;

-- =====================================
-- 지연된 데이터 초기화 (테이블 생성 후)
-- =====================================
DO $$
DECLARE
    tables_ready BOOLEAN := FALSE;
BEGIN
    -- 이미 초기화되었는지 확인
    IF NOT EXISTS (SELECT 1 FROM init_status WHERE script_name = 'delayed_data_init_v1.0') THEN

        RAISE NOTICE '=== JPA 테이블 생성 대기 중 ===';

        -- 필요한 테이블들이 모두 생성될 때까지 대기
        IF wait_for_table('STA', 60) AND
           wait_for_table('STO', 60) AND
           wait_for_table('PAGE', 60) AND
           wait_for_table('OPTIONS', 60) THEN

            tables_ready := TRUE;
            RAISE NOTICE '모든 테이블이 준비되었습니다. 데이터 초기화를 시작합니다.';

        ELSE
            RAISE NOTICE '테이블 대기 시간 초과. 스크립트를 종료합니다.';
            RETURN;
        END IF;

        -- 테이블이 준비되면 데이터 삽입 시작
        IF tables_ready THEN

            -- 역 데이터가 없는 경우에만 삽입
            IF (SELECT COUNT(*) FROM STA) = 0 THEN
                RAISE NOTICE '=== 역 데이터 초기화 시작 ===';

                INSERT INTO STA (api_station_id, sta_name, sta_line) VALUES
                ('1001000113', '도봉산', 1),
                ('1001000114', '도봉', 1),
                ('1001000115', '방학', 1),
                ('1001000116', '창동', 1),
                ('1001000117', '녹천', 1),
                ('1001000118', '월계', 1),
                ('1001000119', '광운대', 1),
                ('1001000120', '석계', 1),
                ('1001000121', '신이문', 1),
                ('1001000122', '외대앞', 1),
                ('1001000123', '회기', 1),
                ('1001000124', '청량리', 1),
                ('1001000125', '제기동', 1),
                ('1001000126', '신설동', 1),
                ('1001000127', '동묘앞', 1),
                ('1001000129', '종로5가', 1),
                ('1001000130', '종로3가', 1),
                ('1001000131', '종각', 1),
                ('1001000132', '시청', 1),
                ('1001000133', '서울역', 1),
                ('1001000134', '남영', 1),
                ('1001000135', '용산', 1),
                ('1001000136', '노량진', 1),
                ('1001000137', '대방', 1),
                ('1001000138', '신길', 1),
                ('1001000139', '영등포', 1),
                ('1001000141', '구로', 1),
                ('1001000142', '구일', 1),
                ('1001000143', '개봉', 1),
                ('1001000144', '오류동', 1),
                ('1001000145', '온수', 1),
                ('1001080142', '가산디지털단지', 1),
                ('1001080143', '독산', 1),
                ('1001000128', '동대문', 1),
                ('1001000140', '신도림', 1),
                -- 2호선
                ('1002000201', '시청', 2),
                ('1002000202', '을지로입구', 2),
                ('1002000205', '동대문역사문화공원', 2),
                ('1002000212', '건대입구', 2),
                ('1002000216', '잠실', 2),
                ('1002000219', '삼성', 2),
                ('1002000222', '강남', 2),
                ('1002000223', '교대', 2),
                ('1002000226', '사당', 2),
                ('1002000230', '신림', 2),
                ('1002000234', '신도림', 2),
                ('1002000239', '홍대입구', 2),
                ('1002000240', '신촌', 2),
                -- 3호선
                ('1003000301', '구파발', 3),
                ('1003000303', '불광', 3),
                ('1003000307', '독립문', 3),
                ('1003000310', '종로3가', 3),
                ('1003000328', '충무로', 3),
                ('1003000324', '옥수', 3),
                ('1003000323', '압구정', 3),
                ('1003000319', '교대', 3),
                ('1003000344', '양재', 3),
                ('1003000351', '수서', 3),
                ('1003000352', '오금', 3),
                -- 4호선
                ('1004000401', '당고개', 4),
                ('1004000411', '노원', 4),
                ('1004000412', '창동', 4),
                ('1004000420', '혜화', 4),
                ('1004000421', '동대문', 4),
                ('1004000423', '충무로', 4),
                ('1004000424', '명동', 4),
                ('1004000426', '서울역', 4),
                ('1004000433', '사당', 4)
                ON CONFLICT (api_station_id) DO NOTHING;

                RAISE NOTICE '역 데이터 초기화 완료: % 개 역', (SELECT COUNT(*) FROM STA);
            ELSE
                RAISE NOTICE '역 데이터가 이미 존재합니다 (% 개)', (SELECT COUNT(*) FROM STA);
            END IF;

            -- 스토리 데이터 초기화
            IF (SELECT COUNT(*) FROM STO) = 0 THEN
                RAISE NOTICE '=== 스토리 데이터 초기화 시작 ===';

                -- 옥수역 스토리 생성
                INSERT INTO STO (sta_id, sto_title, sto_length) VALUES
                ((SELECT sta_id FROM STA WHERE sta_name = '옥수' AND sta_line = 3),
                 '옥수역의 잃어버린 시간', 8);

                -- 페이지들 생성
                WITH story_info AS (
                    SELECT sto_id FROM STO WHERE sto_title = '옥수역의 잃어버린 시간'
                )
                INSERT INTO PAGE (sto_id, page_number, page_contents)
                SELECT si.sto_id, p.page_number, p.page_contents
                FROM story_info si,
                (VALUES
                    (1, '늦은 밤 옥수역 승강장. 마지막 열차를 기다리는 당신 앞에 낡은 회중시계가 떨어져 있다.'),
                    (2, '회중시계를 주워든 순간, 주변 풍경이 흐릿해진다. 옥수역이 1980년대의 모습으로 변한다.'),
                    (3, '시계를 무시하고 지나치려 하지만, 발걸음이 무거워진다.'),
                    (4, '역무원이 말한다. "매일 밤 같은 일이 반복됩니다."'),
                    (5, '승강장 끝에서 시공간의 균열을 발견한다.'),
                    (6, '시계를 돌리자 시간이 역행한다.'),
                    (7, '과거를 바꾸려 했지만, 결국 같은 결과가 반복된다.'),
                    (8, '현재로 돌아온 당신. 회중시계는 사라지고 평범한 옥수역이다.')
                ) AS p(page_number, page_contents);

                -- 선택지들 생성
                WITH story_pages AS (
                    SELECT page_id, page_number
                    FROM PAGE
                    WHERE sto_id = (SELECT sto_id FROM STO WHERE sto_title = '옥수역의 잃어버린 시간')
                )
                INSERT INTO OPTIONS (page_id, opt_contents, opt_effect, opt_amount, next_page_id)
                SELECT
                    sp1.page_id,
                    opts.opt_contents,
                    opts.opt_effect,
                    opts.opt_amount,
                    sp2.page_id as next_page_id
                FROM story_pages sp1
                LEFT JOIN story_pages sp2 ON sp2.page_number = sp1.page_number + 1
                CROSS JOIN (
                    VALUES
                        ('시계를 주워든다', 'sanity', -5),
                        ('상황을 관찰한다', 'health', 2)
                ) AS opts(opt_contents, opt_effect, opt_amount)
                WHERE sp1.page_number < 8;

                -- 마지막 페이지 선택지
                INSERT INTO OPTIONS (page_id, opt_contents, opt_effect, opt_amount, next_page_id)
                SELECT page_id, '새로운 시작을 다짐한다', 'health', 10, NULL
                FROM story_pages
                WHERE page_number = 8;

                RAISE NOTICE '스토리 데이터 초기화 완료';
            ELSE
                RAISE NOTICE '스토리 데이터가 이미 존재합니다';
            END IF;

            -- 완료 기록
            INSERT INTO init_status (script_name, description)
            VALUES ('delayed_data_init_v1.0', '지연된 데이터 초기화 완료');

            RAISE NOTICE '=== 모든 데이터 초기화 완료 ===';

        END IF;
    ELSE
        RAISE NOTICE '지연된 데이터 초기화는 이미 완료되었습니다';
    END IF;
END $$;

-- 대기 함수 삭제
DROP FUNCTION IF EXISTS wait_for_table(TEXT, INTEGER);