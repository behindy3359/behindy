package com.example.backend.repository;


import com.example.backend.entity.Options;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OptionsRepository extends JpaRepository<Options, Long> {

    /**
     * 특정 페이지의 모든 선택지 조회
     */
    List<Options> findByPageId(Long pageId);

    /**
     * 특정 페이지의 선택지 개수 조회
     */
    @Query("SELECT COUNT(o) FROM Options o WHERE o.pageId = :pageId")
    Long countOptionsByPageId(@Param("pageId") Long pageId);

    /**
     * 체력에 영향을 주는 선택지 조회
     */
    @Query("SELECT o FROM Options o WHERE o.pageId = :pageId AND o.optEffect = 'health'")
    List<Options> findHealthOptionsByPageId(@Param("pageId") Long pageId);

    /**
     * 정신력에 영향을 주는 선택지 조회
     */
    @Query("SELECT o FROM Options o WHERE o.pageId = :pageId AND o.optEffect = 'sanity'")
    List<Options> findSanityOptionsByPageId(@Param("pageId") Long pageId);

    /**
     * 긍정적 효과 선택지 조회 (수치가 양수)
     */
    @Query("SELECT o FROM Options o WHERE o.pageId = :pageId AND o.optAmount > 0")
    List<Options> findPositiveOptionsByPageId(@Param("pageId") Long pageId);

    /**
     * 부정적 효과 선택지 조회 (수치가 음수)
     */
    @Query("SELECT o FROM Options o WHERE o.pageId = :pageId AND o.optAmount < 0")
    List<Options> findNegativeOptionsByPageId(@Param("pageId") Long pageId);

    /**
     * 효과 없는 선택지 조회 (수치가 0)
     */
    @Query("SELECT o FROM Options o WHERE o.pageId = :pageId AND o.optAmount = 0")
    List<Options> findNeutralOptionsByPageId(@Param("pageId") Long pageId);

    /**
     * 특정 효과량 범위의 선택지 조회
     */
    @Query("SELECT o FROM Options o WHERE o.pageId = :pageId AND o.optAmount BETWEEN :minAmount AND :maxAmount")
    List<Options> findOptionsByAmountRange(@Param("pageId") Long pageId, @Param("minAmount") Integer minAmount, @Param("maxAmount") Integer maxAmount);
}