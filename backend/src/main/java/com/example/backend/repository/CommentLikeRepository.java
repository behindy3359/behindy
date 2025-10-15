package com.example.backend.repository;

import com.example.backend.entity.Comment;
import com.example.backend.entity.CommentLike;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommentLikeRepository extends JpaRepository<CommentLike, Long> {

    /**
     * 특정 사용자가 특정 댓글에 좋아요를 눌렀는지 확인
     */
    boolean existsByCommentAndUser(Comment comment, User user);

    /**
     * 사용자의 댓글 좋아요 조회
     */
    Optional<CommentLike> findByCommentAndUser(Comment comment, User user);

    /**
     * 특정 댓글의 좋아요 수 카운트
     */
    long countByComment(Comment comment);

    /**
     * 댓글 ID로 좋아요 수 카운트
     */
    @Query("SELECT COUNT(cl) FROM CommentLike cl WHERE cl.comment.cmtId = :commentId")
    long countByCommentId(@Param("commentId") Long commentId);

    /**
     * 사용자가 댓글에 좋아요를 눌렀는지 확인
     */
    @Query("SELECT CASE WHEN COUNT(cl) > 0 THEN true ELSE false END " +
           "FROM CommentLike cl WHERE cl.comment.cmtId = :commentId AND cl.user.userId = :userId")
    boolean existsByCommentIdAndUserId(@Param("commentId") Long commentId, @Param("userId") Long userId);
}
