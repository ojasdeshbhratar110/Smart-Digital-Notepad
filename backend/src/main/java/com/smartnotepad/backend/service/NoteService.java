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

    public NoteService(NoteRepository noteRepository, UserRepository userRepository) {
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
    }

    public Note createNote(Long userId, Note note) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        note.setUser(user);

        return noteRepository.save(note);
    }

    public List<Note> getUserNotes(Long userId) {
        return noteRepository.findByUserId(userId);
    }

    public Note getNoteById(Long noteId) {
        return noteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));
    }

    public Note updateNote(Long noteId, Note updatedNote) {

        Note note = getNoteById(noteId);

        note.setTitle(updatedNote.getTitle());
        note.setContent(updatedNote.getContent());
        note.setCategory(updatedNote.getCategory());

        return noteRepository.save(note);
    }

    public void deleteNote(Long noteId) {

        if (!noteRepository.existsById(noteId)) {
            throw new RuntimeException("Note not found");
        }

        noteRepository.deleteById(noteId);
    }

    public Note toggleFavorite(Long noteId) {

        Note note = getNoteById(noteId);

        note.setFavorite(!note.isFavorite());

        return noteRepository.save(note);
    }

    public Note toggleArchive(Long noteId) {

        Note note = getNoteById(noteId);

        note.setArchived(!note.isArchived());

        return noteRepository.save(note);
    }

    public List<Note> getFavoriteNotes(Long userId) {
        return noteRepository.findByUserIdAndFavoriteTrue(userId);
    }

    public List<Note> getNotesByCategory(Long userId, String category) {
        return noteRepository.findByUserIdAndCategoryIgnoreCase(userId, category);
    }

    public List<Note> searchNotes(Long userId, String keyword) {
        return noteRepository
                .findByUserIdAndTitleContainingIgnoreCaseOrUserIdAndContentContainingIgnoreCase(
                        userId,
                        keyword,
                        userId,
                        keyword
                );
    }
}
