package com.smartnotepad.backend.controller;

import com.smartnotepad.backend.model.Note;
import com.smartnotepad.backend.service.NoteService;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(
        originPatterns = {
                "http://localhost:*",
                "https://*.vercel.app"
        }
)
public class NoteController {

    private final NoteService noteService;

    /*
     * Files uploaded while developing locally
     * will be stored inside:
     *
     * backend/uploads/
     */
    private final Path uploadDirectory =
            Paths.get("uploads")
                    .toAbsolutePath()
                    .normalize();


    public NoteController(
            NoteService noteService
    ) {

        this.noteService =
                noteService;

        try {

            Files.createDirectories(
                    uploadDirectory
            );

        } catch (IOException e) {

            throw new RuntimeException(
                    "Could not create upload directory.",
                    e
            );
        }
    }


    // =====================================================
    // CREATE NOTE
    // =====================================================

    @PostMapping("/user/{userId}")
    public ResponseEntity<?> createNote(
            @PathVariable Long userId,
            @RequestBody Note note
    ) {

        try {

            return ResponseEntity.ok(
                    noteService.createNote(
                            userId,
                            note
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }


    // =====================================================
    // GET USER NOTES
    // =====================================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Note>> getUserNotes(
            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(
                noteService.getUserNotes(
                        userId
                )
        );
    }


    // =====================================================
    // GET NOTE
    // =====================================================

    @GetMapping("/{noteId}")
    public ResponseEntity<?> getNote(
            @PathVariable Long noteId
    ) {

        try {

            return ResponseEntity.ok(
                    noteService.getNoteById(
                            noteId
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }


    // =====================================================
    // UPDATE NOTE
    // =====================================================

    @PutMapping("/{noteId}")
    public ResponseEntity<?> updateNote(
            @PathVariable Long noteId,
            @RequestBody Note note
    ) {

        try {

            return ResponseEntity.ok(
                    noteService.updateNote(
                            noteId,
                            note
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }


    // =====================================================
    // DELETE NOTE
    // =====================================================

    @DeleteMapping("/{noteId}")
    public ResponseEntity<?> deleteNote(
            @PathVariable Long noteId
    ) {

        try {

            noteService.deleteNote(
                    noteId
            );

            return ResponseEntity.ok(
                    "Note deleted successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }


    // =====================================================
    // FAVORITE
    // =====================================================

    @PatchMapping("/{noteId}/favorite")
    public ResponseEntity<?> toggleFavorite(
            @PathVariable Long noteId
    ) {

        try {

            return ResponseEntity.ok(
                    noteService.toggleFavorite(
                            noteId
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }


    // =====================================================
    // ARCHIVE
    // =====================================================

    @PatchMapping("/{noteId}/archive")
    public ResponseEntity<?> toggleArchive(
            @PathVariable Long noteId
    ) {

        try {

            return ResponseEntity.ok(
                    noteService.toggleArchive(
                            noteId
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }


    // =====================================================
    // FAVORITES
    // =====================================================

    @GetMapping("/user/{userId}/favorites")
    public ResponseEntity<List<Note>> getFavorites(
            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(
                noteService.getFavoriteNotes(
                        userId
                )
        );
    }


    // =====================================================
    // CATEGORY
    // =====================================================

    @GetMapping(
            "/user/{userId}/category/{category}"
    )
    public ResponseEntity<List<Note>> getByCategory(
            @PathVariable Long userId,
            @PathVariable String category
    ) {

        return ResponseEntity.ok(
                noteService.getNotesByCategory(
                        userId,
                        category
                )
        );
    }


    // =====================================================
    // SEARCH
    // =====================================================

    @GetMapping("/user/{userId}/search")
    public ResponseEntity<List<Note>> searchNotes(
            @PathVariable Long userId,
            @RequestParam String keyword
    ) {

        return ResponseEntity.ok(
                noteService.searchNotes(
                        userId,
                        keyword
                )
        );
    }


    // =====================================================
    // UPLOAD ATTACHMENT
    // =====================================================

    @PostMapping(
            value = "/{noteId}/attachment",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> uploadAttachment(
            @PathVariable Long noteId,
            @RequestParam("file") MultipartFile file
    ) {

        try {

            if (
                    file == null ||
                    file.isEmpty()
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Please select a file."
                        );
            }


            /*
             * 10 MB maximum size
             */
            long maximumSize =
                    50L * 1024 * 1024;

            if (
                    file.getSize() >
                    maximumSize
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "File must be smaller than 10 MB."
                        );
            }


            String originalFileName =
                    file.getOriginalFilename();


            if (
                    originalFileName == null ||
                    originalFileName.isBlank()
            ) {

                originalFileName =
                        "attachment";
            }


            /*
             * Prevent directory traversal such as:
             *
             * ../../something.txt
             */
            originalFileName =
                    Paths
                            .get(originalFileName)
                            .getFileName()
                            .toString();


            String extension =
                    getFileExtension(
                            originalFileName
                    );


            if (
                    !isAllowedExtension(
                            extension
                    )
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Unsupported file type. " +
                                "Use images, PDF, DOC, DOCX or TXT."
                        );
            }


            /*
             * Generate unique server filename.
             *
             * Example:
             * 902c8f...-lecture.pdf
             */
            String storedFileName =
                    UUID.randomUUID()
                            +
                            "-"
                            +
                            originalFileName;


            Path targetPath =
                    uploadDirectory
                            .resolve(
                                    storedFileName
                            )
                            .normalize();


            /*
             * Extra security check.
             */
            if (
                    !targetPath.startsWith(
                            uploadDirectory
                    )
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Invalid file path."
                        );
            }


            Files.copy(
                    file.getInputStream(),
                    targetPath,
                    StandardCopyOption.REPLACE_EXISTING
            );


            Note note =
                    noteService.getNoteById(
                            noteId
                    );


            note.setAttachmentName(
                    originalFileName
            );


            note.setAttachmentType(
                    file.getContentType()
            );


            /*
             * Store relative URL in MySQL.
             *
             * The frontend will combine this
             * with BACKEND_URL.
             */
            note.setAttachmentUrl(
                    "/api/notes/attachments/"
                            +
                            storedFileName
            );


            Note savedNote =
                    noteService.updateNote(
                            noteId,
                            note
                    );


            return ResponseEntity.ok(
                    savedNote
            );


        } catch (Exception e) {

            System.out.println(
                    "Attachment upload failed."
            );

            System.out.println(
                    "Reason: "
                            +
                            e.getMessage()
            );


            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Could not upload attachment."
                    );
        }
    }


    // =====================================================
    // VIEW / DOWNLOAD ATTACHMENT
    // =====================================================

    @GetMapping(
            "/attachments/{fileName:.+}"
    )
    public ResponseEntity<Resource> getAttachment(
            @PathVariable String fileName
    ) {

        try {

            Path filePath =
                    uploadDirectory
                            .resolve(fileName)
                            .normalize();


            if (
                    !filePath.startsWith(
                            uploadDirectory
                    )
            ) {

                return ResponseEntity
                        .badRequest()
                        .build();
            }


            Resource resource =
                    new UrlResource(
                            filePath.toUri()
                    );


            if (
                    !resource.exists() ||
                    !resource.isReadable()
            ) {

                return ResponseEntity
                        .notFound()
                        .build();
            }


            String contentType =
                    Files.probeContentType(
                            filePath
                    );


            if (
                    contentType == null ||
                    contentType.isBlank()
            ) {

                contentType =
                        MediaType
                                .APPLICATION_OCTET_STREAM_VALUE;
            }


            return ResponseEntity
                    .ok()
                    .contentType(
                            MediaType.parseMediaType(
                                    contentType
                            )
                    )
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\""
                                    +
                                    resource.getFilename()
                                    +
                                    "\""
                    )
                    .body(
                            resource
                    );


        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .build();
        }
    }


    // =====================================================
    // REMOVE ATTACHMENT
    // =====================================================

    @DeleteMapping(
            "/{noteId}/attachment"
    )
    public ResponseEntity<?> removeAttachment(
            @PathVariable Long noteId
    ) {

        try {

            Note note =
                    noteService.getNoteById(
                            noteId
                    );


            String attachmentUrl =
                    note.getAttachmentUrl();


            /*
             * Delete the physical file
             * if it exists.
             */
            if (
                    attachmentUrl != null &&
                    !attachmentUrl.isBlank()
            ) {

                String fileName =
                        attachmentUrl.substring(
                                attachmentUrl
                                        .lastIndexOf("/")
                                        +
                                        1
                        );


                Path filePath =
                        uploadDirectory
                                .resolve(fileName)
                                .normalize();


                if (
                        filePath.startsWith(
                                uploadDirectory
                        )
                ) {

                    Files.deleteIfExists(
                            filePath
                    );
                }
            }


            note.setAttachmentName(
                    null
            );

            note.setAttachmentUrl(
                    null
            );

            note.setAttachmentType(
                    null
            );


            return ResponseEntity.ok(
                    noteService.updateNote(
                            noteId,
                            note
                    )
            );


        } catch (Exception e) {

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Could not remove attachment."
                    );
        }
    }


    // =====================================================
    // FILE EXTENSION HELPER
    // =====================================================

    private String getFileExtension(
            String fileName
    ) {

        int index =
                fileName.lastIndexOf(".");


        if (
                index == -1 ||
                index ==
                fileName.length() - 1
        ) {

            return "";
        }


        return fileName
                .substring(
                        index + 1
                )
                .toLowerCase();
    }


    // =====================================================
    // ALLOWED FILE TYPES
    // =====================================================

    private boolean isAllowedExtension(
            String extension
    ) {

        return extension.equals("jpg")
                ||
                extension.equals("jpeg")
                ||
                extension.equals("png")
                ||
                extension.equals("gif")
                ||
                extension.equals("webp")
                ||
                extension.equals("pdf")
                ||
                extension.equals("doc")
                ||
                extension.equals("docx")
                ||
                extension.equals("txt");
    }
}