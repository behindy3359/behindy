package com.example.backend.controller;

import com.example.backend.dto.game.StoryListResponse;
import com.example.backend.dto.game.StoryResponse;
import com.example.backend.service.StoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stories")
@RequiredArgsConstructor
public class StoryController {

    private final StoryService storyService;

    /**
     * 전체 스토리 목록 조회
     */
    @GetMapping
    public ResponseEntity<List<StoryResponse>> getAllStories() {
        List<StoryResponse> stories = storyService.getAllStories();
        return ResponseEntity.ok(stories);
    }

    /**
     * 노선별 스토리 조회
     */
    @GetMapping("/line/{lineNumber}")
    public ResponseEntity<List<StoryResponse>> getStoriesByLine(@PathVariable Integer lineNumber) {
        List<StoryResponse> stories = storyService.getStoriesByLine(lineNumber);
        return ResponseEntity.ok(stories);
    }

    /**
     * 특정 역의 스토리 조회
     */
    @GetMapping("/station/{stationName}")
    public ResponseEntity<StoryListResponse> getStoriesByStation(@PathVariable String stationName) {
        StoryListResponse response = storyService.getStoriesByStation(stationName);
        return ResponseEntity.ok(response);
    }

    /**
     * 특정 역 + 노선의 스토리 조회
     */
    @GetMapping("/station/{stationName}/line/{lineNumber}")
    public ResponseEntity<StoryListResponse> getStoriesByStationAndLine(
            @PathVariable String stationName,
            @PathVariable Integer lineNumber) {
        StoryListResponse response = storyService.getStoriesByStationAndLine(stationName, lineNumber);
        return ResponseEntity.ok(response);
    }

    /**
     * 단일 스토리 상세 조회
     */
    @GetMapping("/{storyId}")
    public ResponseEntity<StoryResponse> getStoryById(@PathVariable Long storyId) {
        StoryResponse story = storyService.getStoryById(storyId);
        return ResponseEntity.ok(story);
    }

    /**
     * 랜덤 스토리 추천
     */
    @GetMapping("/random")
    public ResponseEntity<List<StoryResponse>> getRandomStories(
            @RequestParam(defaultValue = "3") Integer count) {
        List<StoryResponse> stories = storyService.getRandomStories(count);
        return ResponseEntity.ok(stories);
    }

    /**
     * 특정 노선의 랜덤 스토리 추천
     */
    @GetMapping("/random/line/{lineNumber}")
    public ResponseEntity<List<StoryResponse>> getRandomStoriesByLine(
            @PathVariable Integer lineNumber,
            @RequestParam(defaultValue = "3") Integer count) {
        List<StoryResponse> stories = storyService.getRandomStoriesByLine(lineNumber, count);
        return ResponseEntity.ok(stories);
    }

    /**
     * 난이도별 스토리 조회
     */
    @GetMapping("/difficulty/{difficulty}")
    public ResponseEntity<List<StoryResponse>> getStoriesByDifficulty(@PathVariable String difficulty) {
        List<StoryResponse> stories = storyService.getStoriesByDifficulty(difficulty);
        return ResponseEntity.ok(stories);
    }
}