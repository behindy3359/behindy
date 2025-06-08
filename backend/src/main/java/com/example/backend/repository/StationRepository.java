// StationRepository.java
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
     * 역명으로 조회
     */
    List<Station> findByStaName(String staName);

    /**
     * 노선별 역 조회
     */
    List<Station> findByStaLineOrderByStaName(Integer staLine);

    /**
     * 역명과 노선으로 정확한 역 조회
     */
    Optional<Station> findByStaNameAndStaLine(String staName, Integer staLine);

    /**
     * 모든 노선 번호 조회 (중복 제거)
     */
    @Query("SELECT DISTINCT s.staLine FROM Station s ORDER BY s.staLine")
    List<Integer> findAllLines();

    /**
     * 특정 노선의 역 개수 조회
     */
    @Query("SELECT COUNT(s) FROM Station s WHERE s.staLine = :lineNumber")
    Long countStationsByLine(@Param("lineNumber") Integer lineNumber);

    /**
     * 스토리가 있는 역들만 조회
     */
    @Query("SELECT DISTINCT s FROM Station s JOIN s.stories st")
    List<Station> findStationsWithStories();

    /**
     * 특정 노선에서 스토리가 있는 역들 조회
     */
    @Query("SELECT DISTINCT s FROM Station s JOIN s.stories st WHERE s.staLine = :lineNumber")
    List<Station> findStationsWithStoriesByLine(@Param("lineNumber") Integer lineNumber);

    /**
     * 역명 검색 (부분 일치)
     */
    @Query("SELECT s FROM Station s WHERE s.staName LIKE %:keyword%")
    List<Station> findByStaNameContaining(@Param("keyword") String keyword);

    /**
     * 전체 역 개수 조회
     */
    @Query("SELECT COUNT(s) FROM Station s")
    Long countAllStations();

    // === OpenAPI 연동을 위한 메서드들 (향후 사용) ===

    /**
     * OpenAPI 역 ID로 조회 (향후 사용)
     */
    // Optional<Station> findByApiStationId(String apiStationId);

    /**
     * OpenAPI 지하철 ID로 조회 (향후 사용)
     */
    // List<Station> findByApiSubwayId(String apiSubwayId);

    /**
     * OpenAPI ID 매핑이 없는 역 조회 (향후 사용)
     */
    // @Query("SELECT s FROM Station s WHERE s.apiStationId IS NULL")
    // List<Station> findStationsWithoutApiMapping();
}