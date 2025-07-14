-- Station 테이블 초기화 데이터
-- 프론트엔드 stationsData.ts와 동기화됨

-- 기존 데이터 삭제 (테스트용)
-- DELETE FROM station;

-- 1호선 역들
INSERT INTO station (api_station_id, sta_name, sta_line) VALUES
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
('1001000140', '신도림', 1);

-- 2호선 역들
INSERT INTO station (api_station_id, sta_name, sta_line) VALUES
('1002000201', '시청', 2),
('1002000202', '을지로입구', 2),
('1002000203', '을지로3가', 2),
('1002000204', '을지로4가', 2),
('1002000205', '동대문역사문화공원', 2),
('1002000206', '신당', 2),
('1002000207', '상왕십리', 2),
('1002000208', '왕십리', 2),
('1002000209', '한양대', 2),
('1002000210', '뚝섬', 2),
('1002000211', '성수', 2),
('1002000212', '건대입구', 2),
('1002000213', '구의', 2),
('1002000214', '강변', 2),
('1002000215', '잠실나루', 2),
('1002000216', '잠실', 2),
('1002000217', '잠실새내', 2),
('1002000218', '종합운동장', 2),
('1002000219', '삼성', 2),
('1002000220', '선릉', 2),
('1002000221', '역삼', 2),
('1002000222', '강남', 2),
('1002000223', '교대', 2),
('1002000224', '서초', 2),
('1002000225', '방배', 2),
('1002000226', '사당', 2),
('1002000227', '낙성대', 2),
('1002000228', '서울대입구', 2),
('1002000229', '봉천', 2),
('1002000230', '신림', 2),
('1002000231', '신대방', 2),
('1002000232', '구로디지털단지', 2),
('1002000233', '대림', 2),
('1002000234', '신도림', 2),
('1002000235', '문래', 2),
('1002000236', '영등포구청', 2),
('1002000237', '당산', 2),
('1002000238', '합정', 2),
('1002000239', '홍대입구', 2),
('1002000240', '신촌', 2),
('1002000241', '이대', 2),
('1002000242', '아현', 2),
('1002000243', '충정로', 2),
('1002002111', '용답', 2),
('1002002112', '신답', 2),
('1002002113', '용두', 2),
('1002002114', '신설동', 2),
('1002002341', '도림천', 2),
('1002002342', '양천구청', 2),
('1002002343', '신정네거리', 2),
('1002002344', '까치산', 2);

-- 3호선 역들
INSERT INTO station (api_station_id, sta_name, sta_line) VALUES
('1003000320', '구파발', 3),
('1003000321', '연신내', 3),
('1003000322', '불광', 3),
('1003000323', '녹번', 3),
('1003000324', '홍제', 3),
('1003000325', '무악재', 3),
('1003000326', '독립문', 3),
('1003000327', '경복궁', 3),
('1003000328', '안국', 3),
('1003000329', '종로3가', 3),
('1003000330', '을지로3가', 3),
('1003000331', '충무로', 3),
('1003000332', '동대입구', 3),
('1003000333', '약수', 3),
('1003000334', '금고', 3),
('1003000335', '옥수', 3),
('1003000336', '압구정', 3),
('1003000337', '신사', 3),
('1003000338', '잠원', 3),
('1003000339', '고속터미널', 3),
('1003000340', '교대', 3),
('1003000341', '남부터미널', 3),
('1003000342', '양재', 3),
('1003000343', '매봉', 3),
('1003000344', '도곡', 3),
('1003000345', '대치', 3),
('1003000346', '학여울', 3),
('1003000347', '대청', 3),
('1003000348', '일원', 3),
('1003000349', '수서', 3),
('1003000350', '가락시장', 3),
('1003000351', '경찰병원', 3),
('1003000352', '오금', 3);

-- 4호선 역들
INSERT INTO station (api_station_id, sta_name, sta_line) VALUES
('1004000409', '불암산', 4),
('1004000410', '상계', 4),
('1004000411', '노원', 4),
('1004000412', '창동', 4),
('1004000413', '쌍문', 4),
('1004000414', '수유', 4),
('1004000415', '미아', 4),
('1004000416', '미아사거리', 4),
('1004000417', '길음', 4),
('1004000418', '성신여대입구', 4),
('1004000419', '한성대입구', 4),
('1004000420', '혜화', 4),
('1004000421', '동대문', 4),
('1004000422', '동대문역사문화공원', 4),
('1004000423', '충무로', 4),
('1004000424', '명동', 4),
('1004000425', '회현', 4),
('1004000426', '서울역', 4),
('1004000427', '숙대입구', 4),
('1004000428', '삼각지', 4),
('1004000429', '신용산', 4),
('1004000430', '이촌', 4),
('1004000431', '동작', 4),
('1004000432', '이수', 4),
('1004000433', '사당', 4),
('1004000434', '남태령', 4);

-- 환승역 정보 확인을 위한 쿼리 (참고용)
-- SELECT sta_name, COUNT(*) as line_count, GROUP_CONCAT(sta_line) as lines
-- FROM station
-- GROUP BY sta_name
-- HAVING COUNT(*) > 1
-- ORDER BY sta_name;


-- =====================================
-- 2. 스토리 생성
-- =====================================
INSERT INTO sto (sta_id, sto_title, sto_length) VALUES
((SELECT sta_id FROM station WHERE sta_name = '옥수' AND sta_line = 3),
 '옥수역의 잃어버린 시간', 8);

-- 스토리 ID 변수 설정 (PostgreSQL)
-- 실제로는 위에서 생성된 sto_id를 사용해야 함

-- =====================================
-- 3. 페이지 데이터
-- =====================================

-- 페이지 1: 프롤로그
INSERT INTO page (sto_id, page_number, page_contents) VALUES
((SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간'), 1,
'늦은 밤 옥수역 승강장. 마지막 열차를 기다리는 당신 앞에 낡은 회중시계가 떨어져 있다.
시계는 멈춰있지만, 뒷면에는 "시간을 되돌릴 수 있다면..."이라는 글귀가 새겨져 있다.
갑자기 주변이 고요해지고, 역 안의 시계들이 모두 멈춰버린다.');

-- 페이지 2: 시계를 주운 경우
INSERT INTO page (sto_id, page_number, page_contents) VALUES
((SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간'), 2,
'회중시계를 주워든 순간, 주변 풍경이 흐릿해진다.
옥수역이 1980년대의 모습으로 변하고, 낡은 제복을 입은 역무원이 당신을 쳐다본다.
"또 시간여행자군요. 이번엔 무엇을 바꾸려고 하시나요?"');

-- 페이지 3: 시계를 무시한 경우
INSERT INTO page (sto_id, page_number, page_contents) VALUES
((SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간'), 3,
'시계를 무시하고 지나치려 하지만, 발걸음이 무거워진다.
뒤돌아보니 시계에서 희미한 빛이 새어나오고 있다.
역 전체가 점점 어두워지면서 이상한 기운이 감돈다.');

-- 페이지 4: 역무원과 대화
INSERT INTO page (sto_id, page_number, page_contents) VALUES
((SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간'), 4,
'역무원이 말한다. "매일 밤 같은 일이 반복됩니다.
누군가 시계를 찾아가지만, 결국 후회만 안고 돌아오죠.
당신은 무엇을 후회하고 있나요?"');

-- 페이지 5: 시간의 균열 발견
INSERT INTO page (sto_id, page_number, page_contents) VALUES
((SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간'), 5,
'승강장 끝에서 시공간의 균열을 발견한다.
그 너머로 과거의 모습들이 스쳐 지나간다.
어릴 적 친구, 첫사랑, 돌아가신 할머니... 모든 기억이 되살아난다.');

-- 페이지 6: 과거로의 여행
INSERT INTO page (sto_id, page_number, page_contents) VALUES
((SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간'), 6,
'시계를 돌리자 시간이 역행한다.
10년 전, 이 역에서 친구와 헤어졌던 그날로 돌아갔다.
이번엔 다른 선택을 할 수 있을까?');

-- 페이지 7: 깨달음의 순간
INSERT INTO page (sto_id, page_number, page_contents) VALUES
((SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간'), 7,
'과거를 바꾸려 했지만, 결국 같은 결과가 반복된다.
역무원이 미소를 지으며 말한다. "후회는 바꿀 수 없어요.
하지만 앞으로의 선택은 바꿀 수 있답니다."');

-- 페이지 8: 에필로그
INSERT INTO page (sto_id, page_number, page_contents) VALUES
((SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간'), 8,
'현재로 돌아온 당신. 회중시계는 사라지고 평범한 옥수역이다.
하지만 마음은 가벼워졌다. 과거에 얽매이지 않고,
지금 이 순간부터 새로운 선택을 하면 된다는 것을 깨달았다.');

-- =====================================
-- 4. 선택지 데이터
-- =====================================

-- 페이지 1의 선택지
INSERT INTO options (page_id, opt_contents, opt_effect, opt_amount, next_page_id) VALUES
((SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 1),
 '회중시계를 주워든다', 'sanity', -5,
 (SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 2)),

((SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 1),
 '시계를 무시하고 지나간다', 'health', -3,
 (SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 3)),

((SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 1),
 '주변을 둘러보며 상황을 파악한다', 'sanity', +2,
 (SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 2));

-- 페이지 2의 선택지
INSERT INTO options (page_id, opt_contents, opt_effect, opt_amount, next_page_id) VALUES
((SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 2),
 '역무원에게 무슨 일인지 묻는다', 'sanity', +3,
 (SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 4)),

((SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 2),
 '시계를 되돌려 본다', 'health', -5,
 (SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 6)),

((SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 2),
 '역 안을 탐색한다', 'sanity', 0,
 (SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 5));

-- 페이지 3의 선택지
INSERT INTO options (page_id, opt_contents, opt_effect, opt_amount, next_page_id) VALUES
((SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 3),
 '다시 시계로 돌아간다', 'sanity', -3,
 (SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 2)),

((SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 3),
 '계속 무시하고 출구를 찾는다', 'health', -8,
 (SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 5));

-- 페이지 4의 선택지
INSERT INTO options (page_id, opt_contents, opt_effect, opt_amount, next_page_id) VALUES
((SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 4),
 '"과거를 바꾸고 싶어요"라고 답한다', 'sanity', -5,
 (SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 6)),

((SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 4),
 '"후회는 없습니다"라고 답한다', 'health', +5,
 (SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 7)),

((SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 4),
 '대답 대신 다른 질문을 한다', 'sanity', +2,
 (SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 5));

-- 페이지 5의 선택지
INSERT INTO options (page_id, opt_contents, opt_effect, opt_amount, next_page_id) VALUES
((SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 5),
 '균열로 들어간다', 'health', -10,
 (SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 6)),

((SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 5),
 '균열을 관찰만 한다', 'sanity', +3,
 (SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 7));

-- 페이지 6의 선택지
INSERT INTO options (page_id, opt_contents, opt_effect, opt_amount, next_page_id) VALUES
((SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 6),
 '과거를 바꾸려 시도한다', 'sanity', -10,
 (SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 7)),

((SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 6),
 '과거를 받아들인다', 'health', +5,
 (SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 7));

-- 페이지 7의 선택지 (마지막으로 이어짐)
INSERT INTO options (page_id, opt_contents, opt_effect, opt_amount, next_page_id) VALUES
((SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 7),
 '역무원에게 감사를 표한다', 'sanity', +10,
 (SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 8)),

((SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 7),
 '조용히 깨달음을 받아들인다', 'health', +5,
 (SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 8));

-- 페이지 8의 선택지 (게임 종료)
INSERT INTO options (page_id, opt_contents, opt_effect, opt_amount, next_page_id) VALUES
((SELECT page_id FROM page WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간') AND page_number = 8),
 '새로운 하루를 맞이한다', 'health', +10, NULL);

-- =====================================
-- 5. 데이터 확인 쿼리
-- =====================================

-- 생성된 스토리 확인
SELECT s.sto_id, s.sto_title, s.sto_length, st.sta_name, st.sta_line
FROM sto s
JOIN station st ON s.sta_id = st.sta_id
WHERE s.sto_title = '옥수역의 잃어버린 시간';

-- 페이지 확인
SELECT page_id, page_number, LEFT(page_contents, 100) as preview
FROM page
WHERE sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간')
ORDER BY page_number;

-- 선택지 확인
SELECT p.page_number, o.opt_contents, o.opt_effect, o.opt_amount
FROM options o
JOIN page p ON o.page_id = p.page_id
WHERE p.sto_id = (SELECT sto_id FROM sto WHERE sto_title = '옥수역의 잃어버린 시간')
ORDER BY p.page_number, o.opt_id;