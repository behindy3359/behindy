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
public class RealtimePositionInfo {

    @JsonProperty("subwayId")
    private String subwayId;          // 지하철호선ID

    @JsonProperty("subwayNm")
    private String subwayNm;          // 지하철호선명

    @JsonProperty("statnId")
    private String statnId;           // 지하철역ID

    @JsonProperty("statnNm")
    private String statnNm;           // 지하철역명

    @JsonProperty("trainNo")
    private String trainNo;           // 열차번호

    @JsonProperty("lastRecptnDt")
    private String lastRecptnDt;      // 최종 수신시간

    @JsonProperty("recptnDt")
    private String recptnDt;          // 수신시간

    @JsonProperty("updnLine")
    private String updnLine;          // 상하행선구분

    @JsonProperty("statnTid")
    private String statnTid;          // 역순번

    @JsonProperty("directAt")
    private String directAt;          // 직통여부

    @JsonProperty("lstcarAt")
    private String lstcarAt;          // 막차여부
}