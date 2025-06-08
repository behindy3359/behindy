package com.example.backend.repository;

import com.example.backend.entity.Station;
import com.example.backend.entity.Story;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StoryRepository extends JpaRepository<Story, Long> {

    /**
     * 특정 역의 모든 스토리 조회
     */
    List<Story> findByStation(Station station);

    /**
     * 노선별 스토리 조회
     */
    @Query("SELECT s FROM Story s WHERE s.station.staLine = :lineNumber")
    List<Story> findByStationLine(@Param("lineNumber") Integer lineNumber);

    /**
     * 특정 역명으로 스토리 조회
     */
    @Query("SELECT s FROM Story s WHERE s.station.staName = :stationName")
    List<Story> findByStationName(@Param("stationName") String stationName);

    /**
     * 특정 역과 노선으로 스토리 조회 (정확한 매칭)
     */
    @Query("SELECT s FROM Story s WHERE s.station.staName = :stationName AND s.station.staLine = :lineNumber")
    List<Story> findByStationNameAndLine(@Param("stationName") String stationName, @Param("lineNumber") Integer lineNumber);

    /**
     * 스토리 길이별 조회 (난이도 구분용)
     */
    @Query("SELECT s FROM Story s WHERE s.stoLength BETWEEN :minLength AND :maxLength")
    List<Story> findByLengthRange(@Param("minLength") Integer minLength, @Param("maxLength") Integer maxLength);

    /**
     * 짧은 스토리 조회 (5페이지 이하)
     */
    @Query("SELECT s FROM Story s WHERE s.stoLength <= 5")
    List<Story> findShortStories();

    /**
     * 긴 스토리 조회 (10페이지 이상)
     */
    @Query("SELECT s FROM Story s WHERE s.stoLength >= 10")
    List<Story> findLongStories();

    /**
     * 랜덤 스토리 조회 (특정 개수)
     */
    @Query(value = "SELECT * FROM STO ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    List<Story> findRandomStories(@Param("limit") Integer limit);

    /**
     * 특정 노선의 랜덤 스토리 조회
     */
    @Query(value = "SELECT s.* FROM STO s JOIN STA st ON s.sta_id = st.sta_id WHERE st.sta_line = :lineNumber ORDER BY RANDOM() LIMIT :limit", nativeQuery = true)
    List<Story> findRandomStoriesByLine(@Param("lineNumber") Integer lineNumber, @Param("limit") Integer limit);
}