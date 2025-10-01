package com.example.backend.repository;

import com.example.backend.entity.Character;
import com.example.backend.entity.Now;
import com.example.backend.entity.Page;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface NowRepository extends JpaRepository<Now, Long> {

    /**
     * 특정 캐릭터의 현재 위치 조회
     */
    Optional<Now> findByCharacter(Character character);

    /**
     * 특정 캐릭터의 현재 위치 조회 (비관적 락 - Race Condition 방지)
     * 게임 세션 생성/수정 시 동시성 문제를 방지하기 위해 사용
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT n FROM Now n WHERE n.character = :character")
    Optional<Now> findByCharacterForUpdate(@Param("character") Character character);

    /**
     * 캐릭터 ID로 현재 위치 조회
     */
    @Query("SELECT n FROM Now n WHERE n.character.charId = :charId")
    Optional<Now> findByCharacterId(@Param("charId") Long charId);

    /**
     * 특정 캐릭터의 현재 위치 존재 여부 확인
     */
    boolean existsByCharacter(Character character);

    /**
     * 특정 페이지에 있는 모든 캐릭터 조회
     */
    List<Now> findByPage(Page page);

    /**
     * 특정 페이지 ID에 있는 캐릭터 수 조회
     */
    @Query("SELECT COUNT(n) FROM Now n WHERE n.page.pageId = :pageId")
    Long countCharactersAtPage(@Param("pageId") Long pageId);

    /**
     * 게임 중인 모든 캐릭터 조회 (관리자용)
     */
    @Query("SELECT n FROM Now n JOIN FETCH n.character c JOIN FETCH n.page p WHERE c.deletedAt IS NULL")
    List<Now> findAllActiveGameSessions();

    /**
     * 특정 스토리를 플레이 중인 캐릭터들 조회
     */
    @Query("SELECT n FROM Now n JOIN FETCH n.character c JOIN n.page p WHERE p.stoId = :storyId AND c.deletedAt IS NULL")
    List<Now> findCharactersInStory(@Param("storyId") Long storyId);

    /**
     * 특정 캐릭터의 현재 위치 삭제 (게임 종료 시)
     */
    @Modifying
    @Transactional
    void deleteByCharacter(Character character);

    /**
     * 캐릭터 ID로 현재 위치 삭제
     */
    @Modifying
    @Transactional
    @Query("DELETE FROM Now n WHERE n.character.charId = :charId")
    void deleteByCharacterId(@Param("charId") Long charId);

    /**
     * 특정 캐릭터의 게임 진행 상태 조회 (페이지 정보 포함)
     */
    @Query("SELECT n FROM Now n JOIN FETCH n.page p WHERE n.character.charId = :charId")
    Optional<Now> findByCharacterIdWithPage(@Param("charId") Long charId);

    /**
     * 오래된 게임 세션 조회 (정리용)
     */
    @Query("SELECT n FROM Now n WHERE n.createdAt < :cutoffDate")
    List<Now> findOldGameSessions(@Param("cutoffDate") java.time.LocalDateTime cutoffDate);
}