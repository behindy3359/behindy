package com.example.backend.repository;

import com.example.backend.entity.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StationRepository extends JpaRepository<Station, Long> {

    /**
     * 역명과 노선으로 역 조회
     */
    Optional<Station> findByStaNameAndStaLine(String staName, Integer staLine);

    /**
     * 특정 노선의 모든 역 조회
     */
    List<Station> findByStaLineOrderByStaName(Integer staLine);

    /**
     * 역명으로 모든 노선 조회 (환승역 대응)
     */
    List<Station> findByStaNameOrderByStaLine(String staName);

    /**
     * API 역 ID로 조회
     */
    Optional<Station> findByApiStationId(String apiStationId);

    /**
     * 스토리가 있는 역들 조회
     */
    @Query("SELECT DISTINCT s.station FROM Story s")
    List<Station> findStationsWithStories();

    /**
     * 특정 노선에서 스토리가 있는 역들 조회
     */
    @Query("SELECT DISTINCT s.station FROM Story s WHERE s.station.staLine = :lineNumber")
    List<Station> findStationsWithStoriesByLine(@Param("lineNumber") Integer lineNumber);

    /**
     * 스토리 개수와 함께 역 정보 조회
     */
    @Query("SELECT s, COUNT(st) as storyCount FROM Station s LEFT JOIN Story st ON s = st.station GROUP BY s")
    List<Object[]> findStationsWithStoryCount();

    /**
     * 역명 검색 (부분 일치)
     */
    @Query("SELECT s FROM Station s WHERE s.staName LIKE %:keyword%")
    List<Station> findByStaNameContaining(@Param("keyword") String keyword);

    /**
     * 전체 역 수 조회
     */
    @Query("SELECT COUNT(s) FROM Station s")
    Long countAllStations();

    /**
     * 노선별 역 수 조회
     */
    @Query("SELECT COUNT(s) FROM Station s WHERE s.staLine = :lineNumber")
    Long countStationsByLine(@Param("lineNumber") Integer lineNumber);
}