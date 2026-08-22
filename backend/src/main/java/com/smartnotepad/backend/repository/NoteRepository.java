package com.smartnotepad.backend.repository;

import com.smartnotepad.backend.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoteRepository extends JpaRepository<Note, Long> {

    List<Note> findByUserId(Long userId);

    List<Note> findByUserIdAndFavoriteTrue(Long userId);

    List<Note> findByUserIdAndArchivedFalse(Long userId);

    List<Note> findByUserIdAndCategoryIgnoreCase(Long userId, String category);

    List<Note> findByUserIdAndTitleContainingIgnoreCaseOrUserIdAndContentContainingIgnoreCase(
            Long userId1,
            String title,
            Long userId2,
            String content
    );
}