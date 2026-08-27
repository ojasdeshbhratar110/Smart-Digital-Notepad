package com.smartnotepad.backend.service;

import com.smartnotepad.backend.model.Note;
import com.smartnotepad.backend.model.User;
import com.smartnotepad.backend.repository.NoteRepository;
import com.smartnotepad.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final UserRepository userRepository;

    public NoteService(
            NoteRepository noteRepository,
            UserRepository userRepository
    ) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
    }


    // =====================================================
    // CREATE NOTE
    // =====================================================

    public Note createNote(
            Long userId,
            Note note
    ) {

        User user = userRepository
                .findById(userId)
                .orElseThrow(
                        () -> new RuntimeException("User not found")
                );

        note.setUser(user);

        if (note.getReminderAt() != null) {
            note.setReminderDone(false);
        }

        return noteRepository.save(note);
    }


    // =====================================================
    // GET USER NOTES
    // =====================================================

    public List<Note> getUserNotes(Long userId) {
        return noteRepository.findByUserId(userId);
    }


    // =====================================================
    // GET NOTE BY ID
    // =====================================================

    public Note getNoteById(Long noteId) {

        return noteRepository
                .findById(noteId)
                .orElseThrow(
                        () -> new RuntimeException("Note not found")
                );
    }


    // =====================================================
    // UPDATE NOTE
    // =====================================================

    public Note updateNote(
            Long noteId,
            Note updatedNote
    ) {

        Note note =
                getNoteById(noteId);

        note.setTitle(
                updatedNote.getTitle()
        );

        note.setContent(
                updatedNote.getContent()
        );

        note.setCategory(
                updatedNote.getCategory()
        );


        // =================================================
        // SMART REMINDER
        // =================================================

        note.setReminderAt(
                updatedNote.getReminderAt()
        );

        note.setReminderDone(
                updatedNote.isReminderDone()
        );


        // =================================================
        // FILE / IMAGE ATTACHMENT
        // =================================================

        note.setAttachmentName(
                updatedNote.getAttachmentName()
        );

        note.setAttachmentUrl(
                updatedNote.getAttachmentUrl()
        );

        note.setAttachmentType(
                updatedNote.getAttachmentType()
        );


        return noteRepository.save(note);
    }


    // =====================================================
    // DELETE NOTE
    // =====================================================

    public void deleteNote(Long noteId) {

        if (!noteRepository.existsById(noteId)) {

            throw new RuntimeException(
                    "Note not found"
            );
        }

        noteRepository.deleteById(noteId);
    }


    // =====================================================
    // FAVORITE
    // =====================================================

    public Note toggleFavorite(Long noteId) {

        Note note =
                getNoteById(noteId);

        note.setFavorite(
                !note.isFavorite()
        );

        return noteRepository.save(note);
    }


    // =====================================================
    // ARCHIVE
    // =====================================================

    public Note toggleArchive(Long noteId) {

        Note note =
                getNoteById(noteId);

        note.setArchived(
                !note.isArchived()
        );

        return noteRepository.save(note);
    }


    // =====================================================
    // FAVORITE NOTES
    // =====================================================

    public List<Note> getFavoriteNotes(
            Long userId
    ) {

        return noteRepository
                .findByUserIdAndFavoriteTrue(userId);
    }


    // =====================================================
    // CATEGORY FILTER
    // =====================================================

    public List<Note> getNotesByCategory(
            Long userId,
            String category
    ) {

        return noteRepository
                .findByUserIdAndCategoryIgnoreCase(
                        userId,
                        category
                );
    }


    // =====================================================
    // SEARCH
    // =====================================================

    public List<Note> searchNotes(
            Long userId,
            String keyword
    ) {

        return noteRepository
                .findByUserIdAndTitleContainingIgnoreCaseOrUserIdAndContentContainingIgnoreCase(
                        userId,
                        keyword,
                        userId,
                        keyword
                );
    }
}