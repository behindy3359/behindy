package com.example.backend.dto.metro;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class RealtimePositionResponse {

    @JsonProperty("realtimePositionList")
    private List<RealtimePositionInfo> realtimePositionList;

    @JsonProperty("errorMessage")
    private MetroErrorMessage metroErrorMessage;
}