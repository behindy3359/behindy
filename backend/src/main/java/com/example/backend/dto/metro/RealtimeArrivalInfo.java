package com.example.backend.dto.metro;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class RealtimeArrivalInfo {

    @JsonProperty("beginRow")
    private String beginRow;

    @JsonProperty("endRow")
    private String endRow;

    @JsonProperty("curPage")
    private String curPage;

    @JsonProperty("pageRow")
    private String pageRow;

    @JsonProperty("totalCount")
    private Integer totalCount;

    @JsonProperty("rowNum")
    private Integer rowNum;

    @JsonProperty("selectedCount")
    private Integer selectedCount;

    @JsonProperty("subwayId")
    private String subwayId;          // 지하철호선ID (1001:1호선)

    @JsonProperty("subwayNm")
    private String subwayNm;          // 지하철호선명

    @JsonProperty("statnId")
    private String statnId;           // 지하철역ID

    @JsonProperty("statnNm")
    private String statnNm;           // 지하철역명

    @JsonProperty("trainLineNm")
    private String trainLineNm;       // 도착지방면

    @JsonProperty("subwayHeading")
    private String subwayHeading;     // 상행/하행

    @JsonProperty("statnTid")
    private String statnTid;          // 열차종류

    @JsonProperty("statnTnm")
    private String statnTnm;          // 열차종류명

    @JsonProperty("trainCo")
    private String trainCo;           // 열차번호

    @JsonProperty("ordkey")
    private String ordkey;            // 도착코드

    @JsonProperty("subwayList")
    private String subwayList;        // 연계지하철노선

    @JsonProperty("statnList")
    private String statnList;         // 연계역명

    @JsonProperty("btrainSttus")
    private String btrainSttus;       // 첫번째도착메세지 (진입, 도착, 출발 등)

    @JsonProperty("barvlDt")
    private String barvlDt;           // 첫번째열차 남은시간(초)

    @JsonProperty("btrainNo")
    private String btrainNo;          // 첫번째열차 번호

    @JsonProperty("bstatnId")
    private String bstatnId;          // 첫번째열차 현재위치 역ID

    @JsonProperty("bstatnNm")
    private String bstatnNm;          // 첫번째열차 현재위치 역명

    @JsonProperty("recptnDt")
    private String recptnDt;          // 열차정보를 생성한 시각

    @JsonProperty("arvlMsg2")
    private String arvlMsg2;          // 두번째도착메세지

    @JsonProperty("arvlMsg3")
    private String arvlMsg3;          // 세번째도착메세지

    @JsonProperty("arvlCd")
    private String arvlCd;            // 도착코드
}