package com.smartnotepad.backend.controller;

import com.smartnotepad.backend.model.Note;
import com.smartnotepad.backend.service.NoteService;

import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.ChatModel;
import com.openai.models.responses.Response;
import com.openai.models.responses.ResponseCreateParams;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(originPatterns = "http://localhost:*")
public class AIController {

    private final NoteService noteService;

    public AIController(NoteService noteService) {
        this.noteService = noteService;
    }

    @PostMapping("/summary/{noteId}")
    public ResponseEntity<?> summarizeNote(@PathVariable Long noteId) {

        try {

            Note note = noteService.getNoteById(noteId);

            String content = note.getContent();

            if (content == null || content.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("This note has no content to summarize.");
            }

            String prompt =
                    "You are an intelligent study assistant. " +
                    "Summarize the following student's note in a clear, concise, " +
                    "easy-to-revise format. Use bullet points when useful and " +
                    "preserve the important concepts.\n\n" +
                    "NOTE TITLE: " + note.getTitle() + "\n\n" +
                    "NOTE CONTENT:\n" + content;

            /*
             * OPENAI_API_KEY is read from the environment.
             * The API key is NEVER stored in frontend code.
             */
            OpenAIClient openAIClient =
                    OpenAIOkHttpClient.fromEnv();

            ResponseCreateParams params =
                    ResponseCreateParams.builder()
                            .input(prompt)
                            .model(ChatModel.GPT_5_2)
                            .build();

            Response response =
                    openAIClient.responses().create(params);

            StringBuilder summary = new StringBuilder();

            response.output().stream()
                    .flatMap(item -> item.message().stream())
                    .flatMap(message -> message.content().stream())
                    .flatMap(contentItem ->
                            contentItem.outputText().stream())
                    .forEach(outputText ->
                            summary.append(outputText.text())
                    );

            if (summary.isEmpty()) {
                return ResponseEntity.ok(
                        createFallbackSummary(note)
                );
            }

            return ResponseEntity.ok(
                    summary.toString()
            );

        } catch (Exception e) {

            System.out.println(
                    "OpenAI unavailable. Using local fallback summary."
            );

            System.out.println(
                    "Reason: " + e.getMessage()
            );

            try {

                Note note = noteService.getNoteById(noteId);

                return ResponseEntity.ok(
                        createFallbackSummary(note)
                );

            } catch (Exception fallbackError) {

                return ResponseEntity
                        .internalServerError()
                        .body("Unable to summarize this note.");
            }
        }
    }


    /*
     * FALLBACK SUMMARY
     *
     * Used automatically when:
     * - API quota is exceeded
     * - API key is unavailable
     * - Internet connection fails
     * - OpenAI service cannot be reached
     */
    private String createFallbackSummary(Note note) {

        String content = note.getContent();

        if (content == null || content.trim().isEmpty()) {
            return "This note has no content to summarize.";
        }

        content = content.trim();

        String[] sentences =
                content.split("(?<=[.!?])\\s+");

        StringBuilder summary = new StringBuilder();

        summary.append("Demo Summary\n\n");

        summary.append("Title: ")
                .append(note.getTitle())
                .append("\n\n");

        summary.append("Key Points:\n");

        int sentenceLimit =
                Math.min(sentences.length, 4);

        for (int i = 0; i < sentenceLimit; i++) {

            if (!sentences[i].isBlank()) {

                summary.append("• ")
                        .append(sentences[i].trim())
                        .append("\n");
            }
        }

        /*
         * If the note contains no proper sentences,
         * use a shortened version of the content.
         */
        if (sentenceLimit == 0) {

            String shortContent =
                    content.length() > 300
                            ? content.substring(0, 300) + "..."
                            : content;

            summary.append("• ")
                    .append(shortContent);
        }

        summary.append(
                "\n\nNote: Local fallback summary used because the AI service is currently unavailable."
        );

        return summary.toString();
    }
}