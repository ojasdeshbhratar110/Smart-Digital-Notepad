package com.smartnotepad.backend.controller;

import com.smartnotepad.backend.model.Note;
import com.smartnotepad.backend.service.NoteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(originPatterns = "http://localhost:*")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<?> createNote(
            @PathVariable Long userId,
            @RequestBody Note note
    ) {
        try {
            return ResponseEntity.ok(noteService.createNote(userId, note));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Note>> getUserNotes(@PathVariable Long userId) {
        return ResponseEntity.ok(noteService.getUserNotes(userId));
    }

    @GetMapping("/{noteId}")
    public ResponseEntity<?> getNote(@PathVariable Long noteId) {
        try {
            return ResponseEntity.ok(noteService.getNoteById(noteId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{noteId}")
    public ResponseEntity<?> updateNote(
            @PathVariable Long noteId,
            @RequestBody Note note
    ) {
        try {
            return ResponseEntity.ok(noteService.updateNote(noteId, note));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{noteId}")
    public ResponseEntity<?> deleteNote(@PathVariable Long noteId) {
        try {
            noteService.deleteNote(noteId);
            return ResponseEntity.ok("Note deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{noteId}/favorite")
    public ResponseEntity<?> toggleFavorite(@PathVariable Long noteId) {
        try {
            return ResponseEntity.ok(noteService.toggleFavorite(noteId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{noteId}/archive")
    public ResponseEntity<?> toggleArchive(@PathVariable Long noteId) {
        try {
            return ResponseEntity.ok(noteService.toggleArchive(noteId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}/favorites")
    public ResponseEntity<List<Note>> getFavorites(@PathVariable Long userId) {
        return ResponseEntity.ok(noteService.getFavoriteNotes(userId));
    }

    @GetMapping("/user/{userId}/category/{category}")
    public ResponseEntity<List<Note>> getByCategory(
            @PathVariable Long userId,
            @PathVariable String category
    ) {
        return ResponseEntity.ok(
                noteService.getNotesByCategory(userId, category)
        );
    }

    @GetMapping("/user/{userId}/search")
    public ResponseEntity<List<Note>> searchNotes(
            @PathVariable Long userId,
            @RequestParam String keyword
    ) {
        return ResponseEntity.ok(
                noteService.searchNotes(userId, keyword)
        );
    }
}