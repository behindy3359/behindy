package com.example.backend.repository;

import com.example.backend.entity.Character;
import com.example.backend.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CharacterRepository extends JpaRepository<Character, Long> {

    /**
     * 사용자의 살아있는 캐릭터 조회
     */
    Optional<Character> findByUserAndDeletedAtIsNull(Users users);

    /**
     * 캐릭터 이름 중복 확인 (전체 유저, 살아있는 캐릭터만)
     */
    boolean existsByCharNameAndDeletedAtIsNull(String charName);

    /**
     * 사용자의 살아있는 캐릭터 존재 여부 확인
     */
    boolean existsByUserAndDeletedAtIsNull(Users users);

    /**
     * 사용자의 모든 캐릭터 조회 (사망한 것 포함, 최신순)
     */
    List<Character> findByUserOrderByCreatedAtDesc(Users users);

    /**
     * 사용자의 살아있는 캐릭터들만 조회
     */
    List<Character> findByUserAndDeletedAtIsNullOrderByCreatedAtDesc(Users users);

    /**
     * 위험 상태 캐릭터 조회
     */
    @Query("SELECT c FROM Character c WHERE c.deletedAt IS NULL AND " +
            "(c.charHealth <= :threshold OR c.charSanity <= :threshold)")
    List<Character> findCharactersInDanger(@Param("threshold") Integer threshold);

    /**
     * 자동 사망 대상 캐릭터 조회 (체력이나 정신력이 0 이하)
     */
    @Query("SELECT c FROM Character c WHERE c.deletedAt IS NULL AND " +
            "(c.charHealth <= 0 OR c.charSanity <= 0)")
    List<Character> findCharactersToKill();

    /**
     * 특정 캐릭터 ID로 살아있는 캐릭터 조회
     */
    @Query("SELECT c FROM Character c WHERE c.charId = :charId AND c.deletedAt IS NULL")
    Optional<Character> findAliveCharacterById(@Param("charId") Long charId);
}