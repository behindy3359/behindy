
DO $$
BEGIN
    -- 스토리 데이터 초기화 체크
    IF NOT EXISTS (SELECT 1 FROM init_status WHERE script_name = 'story_data_v1.0') THEN

        -- 옥수역 스토리 생성
        INSERT INTO sto (sta_id, sto_title, sto_length) VALUES
        ((SELECT sta_id FROM station WHERE sta_name = '옥수' AND sta_line = 3),
         '옥수역의 잃어버린 시간', 8);

        -- 페이지들 생성
        WITH story_info AS (
            SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간'
        )
        INSERT INTO page (sto_id, page_number, page_contents)
        SELECT si.sto_id, p.page_number, p.page_contents
        FROM story_info si,
        (VALUES
            (1, '늦은 밤 옥수역 승강장. 마지막 열차를 기다리는 당신 앞에 낡은 회중시계가 떨어져 있다. 시계는 멈춰있지만, 뒷면에는 "시간을 되돌릴 수 있다면..."이라는 글귀가 새겨져 있다. 갑자기 주변이 고요해지고, 역 안의 시계들이 모두 멈춰버린다.'),
            (2, '회중시계를 주워든 순간, 주변 풍경이 흐릿해진다. 옥수역이 1980년대의 모습으로 변하고, 낡은 제복을 입은 역무원이 당신을 쳐다본다. "또 시간여행자군요. 이번엔 무엇을 바꾸려고 하시나요?"'),
            (3, '시계를 무시하고 지나치려 하지만, 발걸음이 무거워진다. 뒤돌아보니 시계에서 희미한 빛이 새어나오고 있다. 역 전체가 점점 어두워지면서 이상한 기운이 감돈다.'),
            (4, '역무원이 말한다. "매일 밤 같은 일이 반복됩니다. 누군가 시계를 찾아가지만, 결국 후회만 안고 돌아오죠. 당신은 무엇을 후회하고 있나요?"'),
            (5, '승강장 끝에서 시공간의 균열을 발견한다. 그 너머로 과거의 모습들이 스쳐 지나간다. 어릴 적 친구, 첫사랑, 돌아가신 할머니... 모든 기억이 되살아난다.'),
            (6, '시계를 돌리자 시간이 역행한다. 10년 전, 이 역에서 친구와 헤어졌던 그날로 돌아갔다. 이번엔 다른 선택을 할 수 있을까?'),
            (7, '과거를 바꾸려 했지만, 결국 같은 결과가 반복된다. 역무원이 미소를 지으며 말한다. "후회는 바꿀 수 없어요. 하지만 앞으로의 선택은 바꿀 수 있답니다."'),
            (8, '현재로 돌아온 당신. 회중시계는 사라지고 평범한 옥수역이다. 하지만 마음은 가벼워졌다. 과거에 얽매이지 않고, 지금 이 순간부터 새로운 선택을 하면 된다는 것을 깨달았다.')
        ) AS p(page_number, page_contents);

        -- 선택지들 생성 (간소화된 버전)
        WITH story_pages AS (
            SELECT page_id, page_number
            FROM page
            WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간')
        )
        INSERT INTO options (page_id, opt_contents, opt_effect, opt_amount, next_page_id)
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
        WHERE sp1.page_number < 8;  -- 마지막 페이지 제외

        -- 마지막 페이지 선택지 (게임 종료)
        INSERT INTO options (page_id, opt_contents, opt_effect, opt_amount, next_page_id)
        SELECT page_id, '새로운 시작을 다짐한다', 'health', 10, NULL
        FROM story_pages
        WHERE page_number = 8;

        -- 실행 완료 기록
        INSERT INTO init_status (script_name) VALUES ('story_data_v1.0');

        RAISE NOTICE '스토리 데이터 초기화 완료';
    ELSE
        RAISE NOTICE '스토리 데이터는 이미 초기화되었습니다';
    END IF;
END $$;
