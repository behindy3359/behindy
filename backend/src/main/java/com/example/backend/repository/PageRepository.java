package com.example.backend.repository;


import com.example.backend.entity.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PageRepository extends JpaRepository<Page, Long> {

    /**
     * 특정 스토리의 모든 페이지 조회 (페이지 번호 순)
     */
    List<Page> findByStoIdOrderByPageNumber(Long storyId);

    /**
     * 특정 스토리의 특정 페이지 조회
     */
    Optional<Page> findByStoIdAndPageNumber(Long storyId, long pageNumber); // ✅ long 타입

    /**
     * 특정 스토리의 첫 번째 페이지 조회
     */
    @Query("SELECT p FROM Page p WHERE p.stoId = :storyId AND p.pageNumber = 1")
    Optional<Page> findFirstPageByStoryId(@Param("storyId") Long storyId);

    /**
     * 특정 스토리의 마지막 페이지 조회
     */
    @Query("SELECT p FROM Page p WHERE p.stoId = :storyId AND p.pageNumber = (SELECT MAX(p2.pageNumber) FROM Page p2 WHERE p2.stoId = :storyId)")
    Optional<Page> findLastPageByStoryId(@Param("storyId") Long storyId);

    /**
     * 특정 스토리의 페이지 개수 조회
     */
    @Query("SELECT COUNT(p) FROM Page p WHERE p.stoId = :storyId")
    Long countPagesByStoryId(@Param("storyId") Long storyId);

    /**
     * 다음 페이지 존재 여부 확인
     */
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Page p WHERE p.stoId = :storyId AND p.pageNumber = :nextPageNumber")
    boolean existsNextPage(@Param("storyId") Long storyId, @Param("nextPageNumber") long nextPageNumber); // ✅ long 타입

    /**
     * 특정 페이지 범위 조회
     */
    @Query("SELECT p FROM Page p WHERE p.stoId = :storyId AND p.pageNumber BETWEEN :startPage AND :endPage ORDER BY p.pageNumber")
    List<Page> findPageRange(@Param("storyId") Long storyId, @Param("startPage") long startPage, @Param("endPage") long endPage); // ✅ long 타입
}