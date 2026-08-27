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


    // =====================================================
    // AI NOTE SUMMARY
    // =====================================================

    @PostMapping("/summary/{noteId}")
    public ResponseEntity<?> summarizeNote(
            @PathVariable Long noteId
    ) {

        try {

            Note note =
                    noteService.getNoteById(noteId);

            String content =
                    note.getContent();

            if (
                    content == null ||
                    content.trim().isEmpty()
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "This note has no content to summarize."
                        );
            }





            String prompt =
                    "You are an intelligent study assistant. " +

                    "Summarize the following student's note in a clear, concise, " +
                    "easy-to-revise format. " +

                    "Use bullet points when useful. " +
                    "Preserve all important concepts. " +

                    "Do not add unnecessary explanations.\n\n" +

                    "NOTE TITLE:\n" +
                    note.getTitle() +

                    "\n\nNOTE CONTENT:\n" +
                    content;


            String aiResult =
                    callOpenAI(prompt);


            if (
                    aiResult == null ||
                    aiResult.isBlank()
            ) {

                return ResponseEntity.ok(
                        createFallbackSummary(note)
                );
            }


            return ResponseEntity.ok(
                    aiResult.trim()
            );


        } catch (Exception e) {

            System.out.println(
                    "OpenAI summary unavailable."
            );

            System.out.println(
                    "Reason: " + e.getMessage()
            );


            try {

                Note note =
                        noteService.getNoteById(noteId);

                return ResponseEntity.ok(
                        createFallbackSummary(note)
                );

            } catch (Exception fallbackError) {

                return ResponseEntity
                        .internalServerError()
                        .body(
                                "Unable to summarize this note."
                        );
            }
        }
    }



    // =====================================================
    // AUTOMATIC CATEGORY SUGGESTION
    // =====================================================

    @PostMapping("/category/{noteId}")
    public ResponseEntity<?> suggestCategory(
            @PathVariable Long noteId
    ) {

        try {

            Note note =
                    noteService.getNoteById(noteId);

            String title =
                    note.getTitle();

            String content =
                    note.getContent();


            if (
                    (title == null || title.isBlank())
                    &&
                    (content == null || content.isBlank())
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "This note has no content to categorize."
                        );
            }


            String prompt =
                    "You are an intelligent note organizer. " +

                    "Determine the most appropriate category for this note. " +

                    "Return ONLY ONE short category name. " +

                    "Do not return sentences, explanations, quotes or punctuation. " +

                    "Possible examples include Java, Programming, DBMS, " +
                    "Data Science, Artificial Intelligence, Mathematics, " +
                    "College, Personal, Work, Ideas, Study or General.\n\n" +

                    "NOTE TITLE:\n" +
                    title +

                    "\n\nNOTE CONTENT:\n" +
                    content;


            String result =
                    callOpenAI(prompt);


            if (
                    result == null ||
                    result.isBlank()
            ) {

                return ResponseEntity.ok(
                        createFallbackCategory(
                                title,
                                content
                        )
                );
            }


            result =
                    result
                            .replace("\"", "")
                            .replace("'", "")
                            .replace("\n", " ")
                            .trim();


            return ResponseEntity.ok(result);


        } catch (Exception e) {

            System.out.println(
                    "AI category suggestion unavailable."
            );

            System.out.println(
                    "Reason: " + e.getMessage()
            );


            try {

                Note note =
                        noteService.getNoteById(noteId);


                return ResponseEntity.ok(
                        createFallbackCategory(
                                note.getTitle(),
                                note.getContent()
                        )
                );


            } catch (Exception fallbackError) {

                return ResponseEntity.ok(
                        "General"
                );
            }
        }
    }



    // =====================================================
    // AI WRITING ASSISTANT
    // =====================================================

    @PostMapping("/writing/{noteId}")
    public ResponseEntity<?> assistWriting(
            @PathVariable Long noteId,
            @RequestParam String action
    ) {

        try {

            Note note =
                    noteService.getNoteById(noteId);

            String content =
                    note.getContent();


            if (
                    content == null ||
                    content.trim().isEmpty()
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "This note has no content to improve."
                        );
            }


            String normalizedAction =
                    action
                            .trim()
                            .toLowerCase();


            String instruction;


            switch (normalizedAction) {


                // -----------------------------------------
                // FIX GRAMMAR
                // -----------------------------------------

                case "grammar":

                    instruction =
                            "Rewrite the note and correct every grammar, " +
                            "spelling and punctuation mistake. " +

                            "Keep the original meaning and information. " +

                            "Return the complete corrected note.";

                    break;



                // -----------------------------------------
                // IMPROVE WRITING
                // -----------------------------------------

                case "improve":

                    instruction =
                            "Rewrite the entire note so that it is clearer, " +
                            "better structured, more professional and easier to understand. " +

                            "Improve sentence structure and readability. " +

                            "Preserve the original meaning and important information.";

                    break;



                // -----------------------------------------
                // MAKE SHORTER
                // -----------------------------------------

                case "shorter":

                    instruction =
                            "Rewrite the note into a MUCH SHORTER version. " +

                            "Remove repetition, unnecessary words and minor details. " +

                            "Keep only the most important information. " +

                            "The rewritten result should be noticeably shorter " +
                            "than the original note. " +

                            "Return only the shortened note.";

                    break;



                // -----------------------------------------
                // EXPAND
                // -----------------------------------------

                case "expand":

                    instruction =
                            "Expand this note significantly. " +

                            "Add useful explanations, definitions, examples and context " +
                            "that help a student understand the topic better. " +

                            "Keep the same topic and original meaning. " +

                            "The final response MUST be noticeably longer " +
                            "and more detailed than the original note. " +

                            "Return only the expanded note.";

                    break;



                // -----------------------------------------
                // BULLET POINTS
                // -----------------------------------------

                case "bullets":

                    instruction =
                            "Convert the ENTIRE note into organized bullet points. " +

                            "Every important idea must appear on a separate line. " +

                            "Every line MUST begin with the bullet character •. " +

                            "Do not write paragraphs. " +

                            "Do not add introductions such as " +
                            "'Here are the bullet points'. " +

                            "Return only the bullet-point version.";

                    break;



                default:

                    return ResponseEntity
                            .badRequest()
                            .body(
                                    "Invalid writing assistant action."
                            );
            }


            String prompt =
                    "You are the AI Writing Assistant inside NoteX, " +
                    "a Smart Digital Notepad.\n\n" +

                    "TASK:\n" +
                    instruction +

                    "\n\nIMPORTANT RULES:\n" +

                    "Return ONLY the rewritten note.\n" +

                    "Do not say 'Here is the rewritten note'.\n" +

                    "Do not explain what you changed.\n" +

                    "Do not include quotation marks around the answer.\n\n" +

                    "NOTE TITLE:\n" +
                    note.getTitle() +

                    "\n\nORIGINAL NOTE:\n" +
                    content;


            String rewrittenText =
                    callOpenAI(prompt);


            if (
                    rewrittenText == null ||
                    rewrittenText.isBlank()
            ) {

                return ResponseEntity.ok(
                        createFallbackWriting(
                                content,
                                normalizedAction
                        )
                );
            }


            rewrittenText =
                    rewrittenText.trim();


            /*
             * Extra protection:
             *
             * If AI accidentally returns exactly
             * the same text for an action where
             * visible transformation is expected,
             * use local fallback instead.
             */

            if (
                    rewrittenText.equals(content.trim())
                    &&
                    (
                            normalizedAction.equals("shorter")
                            ||
                            normalizedAction.equals("expand")
                            ||
                            normalizedAction.equals("bullets")
                    )
            ) {

                return ResponseEntity.ok(
                        createFallbackWriting(
                                content,
                                normalizedAction
                        )
                );
            }


            return ResponseEntity.ok(
                    rewrittenText
            );


        } catch (Exception e) {

            System.out.println(
                    "AI Writing Assistant unavailable."
            );

            System.out.println(
                    "Reason: " + e.getMessage()
            );


            /*
             * IMPORTANT:
             *
             * Instead of returning the unchanged
             * original note, NoteX now performs
             * a local transformation.
             */

            try {

                Note note =
                        noteService.getNoteById(noteId);


                return ResponseEntity.ok(
                        createFallbackWriting(
                                note.getContent(),
                                action
                                        .trim()
                                        .toLowerCase()
                        )
                );


            } catch (Exception fallbackError) {

                return ResponseEntity
                        .internalServerError()
                        .body(
                                "Unable to process this note."
                        );
            }
        }
    }

// =====================================================
// AI FLASHCARDS
// =====================================================

@PostMapping("/flashcards/{noteId}")
public ResponseEntity<?> generateFlashcards(
        @PathVariable Long noteId
) {

    try {

        Note note =
                noteService.getNoteById(noteId);

        String content =
                note.getContent();

        if (
                content == null ||
                content.trim().isEmpty()
        ) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "This note has no content to create flashcards."
                    );
        }


        String prompt =
                "You are a study assistant inside NoteX. " +

                "Create useful revision flashcards from the student's note. " +

                "Generate around 5 to 8 flashcards. " +

                "Each flashcard must be on ONE line using this exact format:\n" +

                "Question: <question> | Answer: <answer>\n\n" +

                "Do not add headings, numbering, introductions or explanations.\n\n" +

                "NOTE TITLE:\n" +
                note.getTitle() +

                "\n\nNOTE CONTENT:\n" +
                content;


        String result =
                callOpenAI(prompt);


        if (
                result == null ||
                result.isBlank()
        ) {

            return ResponseEntity.ok(
                    createFallbackFlashcards(note)
            );
        }


        return ResponseEntity.ok(
                result.trim()
        );


    } catch (Exception e) {

        System.out.println(
                "AI flashcards unavailable."
        );

        System.out.println(
                "Reason: " + e.getMessage()
        );


        try {

            Note note =
                    noteService.getNoteById(noteId);

            return ResponseEntity.ok(
                    createFallbackFlashcards(note)
            );


        } catch (Exception fallbackError) {

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Unable to create flashcards."
                    );
        }
    }
}
// =====================================================
// LOCAL FLASHCARD FALLBACK
// =====================================================

private String createFallbackFlashcards(Note note) {

    String content = note.getContent();

    if (content == null || content.trim().isEmpty()) {
        return "No content available for flashcards.";
    }

    String clean = content.trim();

    String[] sentences =
            clean.split("(?<=[.!?])\\s+");

    StringBuilder flashcards =
            new StringBuilder();

    int limit = Math.min(sentences.length, 5);

    for (int i = 0; i < limit; i++) {

        String sentence = sentences[i].trim();

        if (!sentence.isEmpty()) {

            flashcards
                    .append("Q: What is an important point from this note?\n")
                    .append("A: ")
                    .append(sentence)
                    .append("\n\n");
        }
    }

    return flashcards.toString().trim();
}

// =====================================================
// AI QUIZ
// =====================================================

@PostMapping("/quiz/{noteId}")
public ResponseEntity<?> generateQuiz(
        @PathVariable Long noteId
) {

    try {

        Note note =
                noteService.getNoteById(noteId);

        String content =
                note.getContent();

        if (content == null || content.trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("This note has no content to create a quiz.");
        }
int wordCount =
        content.trim().split("\\s+").length;

int questionCount;

if (wordCount < 50) {

    questionCount = 3;

} else if (wordCount < 150) {

    questionCount = 5;

} else if (wordCount < 300) {

    questionCount = 8;

} else {

    questionCount = 10;

}
        String prompt =
                "You are a study assistant inside NoteX.\n\n" +

                "Create exactly " + questionCount + " multiple-choice questions " +
                "using the following student's note.\n\n" +

                "Use EXACTLY this format for every question:\n\n" +

                "Question: question text\n" +
                "A: first option\n" +
                "B: second option\n" +
                "C: third option\n" +
                "D: fourth option\n" +
                "Answer: A\n\n" +

                "The Answer must contain only A, B, C or D.\n" +
                "Do not add explanations.\n" +
                "Do not add headings.\n\n" +

                "NOTE TITLE:\n" +
                note.getTitle() +

                "\n\nNOTE CONTENT:\n" +
                content;
System.out.println("WORD COUNT = " + wordCount);
System.out.println("QUESTION COUNT = " + questionCount);
        String result =
                callOpenAI(prompt);

        if (result == null || result.isBlank()) {

            return ResponseEntity.ok(
                    createFallbackQuiz(note)
            );
        }

        return ResponseEntity.ok(
                result.trim()
        );

    } catch (Exception e) {

        System.out.println(
                "AI quiz unavailable."
        );

        System.out.println(
                "Reason: " + e.getMessage()
        );

        try {

            Note note =
                    noteService.getNoteById(noteId);

            return ResponseEntity.ok(
                    createFallbackQuiz(note)
            );

        } catch (Exception fallbackError) {

            return ResponseEntity
                    .internalServerError()
                    .body("Unable to create quiz.");
        }
    }
}

// =====================================================
// LOCAL QUIZ FALLBACK
// =====================================================

private String createFallbackQuiz(
        Note note
) {

    String content = note.getContent();

    if (content == null || content.trim().isEmpty()) {

        return
                "Question: What is this note about?\n" +
                "A: No content available\n" +
                "B: Java\n" +
                "C: DBMS\n" +
                "D: AI\n" +
                "Answer: A";
    }

    String clean =
            content
                    .trim()
                    .replaceAll("\\s+", " ");

    int wordCount =
            clean.split("\\s+").length;

    int questionCount;

    if (wordCount < 50) {
        questionCount = 3;
    } else if (wordCount < 150) {
        questionCount = 5;
    } else if (wordCount < 300) {
        questionCount = 8;
    } else {
        questionCount = 10;
    }

    String[] sentences =
            clean.split("(?<=[.!?])\\s+");

    StringBuilder quiz =
            new StringBuilder();

    for (int i = 0; i < questionCount; i++) {

        String correctAnswer =
                sentences.length > 0
                        ? sentences[i % sentences.length].trim()
                        : clean;

        quiz
                .append("Question: Which statement is supported by the note?\n")
                .append("A: ")
                .append(correctAnswer)
                .append("\n")
                .append("B: This statement is unrelated to the note.\n")
                .append("C: The note contains no useful information.\n")
                .append("D: None of the above.\n")
                .append("Answer: A");

        if (i < questionCount - 1) {
            quiz.append("\n\n");
        }
    }

    return quiz
            .toString()
            .trim();
}
// =====================================================
// AI QUIZ
// =====================================================

    // =====================================================
    // OPENAI HELPER
    // =====================================================

    private String callOpenAI(
            String prompt
    ) {

        OpenAIClient openAIClient =
                OpenAIOkHttpClient.fromEnv();


        ResponseCreateParams params =
                ResponseCreateParams
                        .builder()
                        .input(prompt)
                        .model(ChatModel.GPT_5_2)
                        .build();


        Response response =
                openAIClient
                        .responses()
                        .create(params);


        StringBuilder result =
                new StringBuilder();


        response.output()
                .stream()

                .flatMap(item ->
                        item.message().stream()
                )

                .flatMap(message ->
                        message.content().stream()
                )

                .flatMap(contentItem ->
                        contentItem.outputText().stream()
                )

                .forEach(outputText ->

                        result.append(
                                outputText.text()
                        )

                );


        return result
                .toString()
                .trim();
    }



    // =====================================================
    // LOCAL FALLBACK WRITING ASSISTANT
    // =====================================================

    private String createFallbackWriting(
            String content,
            String action
    ) {

        if (
                content == null ||
                content.trim().isEmpty()
        ) {

            return "This note has no content.";
        }


        String clean =
                content
                        .trim()
                        .replaceAll("\\s+", " ");


        String normalizedAction =
                action == null
                        ? "improve"
                        : action
                                .trim()
                                .toLowerCase();


        switch (normalizedAction) {


            // =================================================
            // GRAMMAR FALLBACK
            // =================================================

            case "grammar": {

                String corrected =
                        capitalizeFirstLetter(clean);


                if (
                        !corrected.endsWith(".")
                        &&
                        !corrected.endsWith("!")
                        &&
                        !corrected.endsWith("?")
                ) {

                    corrected += ".";
                }


                corrected =
                        corrected
                                .replaceAll("\\bi\\b", "I")
                                .replaceAll("\\s+([,.!?])", "$1");


                return corrected;
            }



            // =================================================
            // IMPROVE FALLBACK
            // =================================================

            case "improve": {

                String improved =
                        capitalizeFirstLetter(clean);


                if (
                        !improved.endsWith(".")
                        &&
                        !improved.endsWith("!")
                        &&
                        !improved.endsWith("?")
                ) {

                    improved += ".";
                }


                return improved;
            }



            // =================================================
            // SHORTER FALLBACK
            // =================================================

            case "shorter": {

                String[] sentences =
                        clean.split(
                                "(?<=[.!?])\\s+"
                        );


                StringBuilder shorter =
                        new StringBuilder();


                /*
                 * Keep approximately half of
                 * the sentences.
                 */

                int keep =
                        Math.max(
                                1,
                                (int) Math.ceil(
                                        sentences.length / 2.0
                                )
                        );


                for (
                        int i = 0;
                        i < keep &&
                        i < sentences.length;
                        i++
                ) {

                    if (
                            !sentences[i]
                                    .trim()
                                    .isEmpty()
                    ) {

                        shorter
                                .append(
                                        sentences[i]
                                                .trim()
                                )
                                .append(" ");
                    }
                }


                String result =
                        shorter
                                .toString()
                                .trim();


                /*
                 * If there was only one very
                 * long sentence, shorten using
                 * character length.
                 */

                if (
                        sentences.length <= 1
                        &&
                        clean.length() > 180
                ) {

                    int targetLength =
                            Math.min(
                                    180,
                                    clean.length()
                            );


                    int lastSpace =
                            clean.lastIndexOf(
                                    " ",
                                    targetLength
                            );


                    if (lastSpace > 0) {

                        result =
                                clean.substring(
                                        0,
                                        lastSpace
                                ) + "...";

                    } else {

                        result =
                                clean.substring(
                                        0,
                                        targetLength
                                ) + "...";
                    }
                }


                return result;
            }



            // =================================================
            // EXPAND FALLBACK
            // =================================================

            case "expand": {

                StringBuilder expanded =
                        new StringBuilder();


                expanded
                        .append(
                                capitalizeFirstLetter(
                                        clean
                                )
                        );


                if (
                        !clean.endsWith(".")
                        &&
                        !clean.endsWith("!")
                        &&
                        !clean.endsWith("?")
                ) {

                    expanded.append(".");
                }


                expanded.append(
                        "\n\nKey Explanation:\n"
                );


                expanded.append(
                        "This topic can be understood more clearly " +
                        "by focusing on its main concepts, purpose, " +
                        "working process and practical importance."
                );


                expanded.append(
                        "\n\nImportant Points:\n"
                );


                String[] sentences =
                        clean.split(
                                "(?<=[.!?])\\s+"
                        );


                for (String sentence : sentences) {

                    String point =
                            sentence.trim();


                    if (!point.isEmpty()) {

                        expanded
                                .append("• ")
                                .append(
                                        capitalizeFirstLetter(
                                                point
                                        )
                                )
                                .append("\n");
                    }
                }


                expanded.append(
                        "\nUnderstanding these concepts helps connect " +
                        "theoretical knowledge with practical applications " +
                        "and makes the topic easier to revise."
                );


                return expanded
                        .toString()
                        .trim();
            }



            // =================================================
            // BULLET POINT FALLBACK
            // =================================================

            case "bullets": {

                String[] sentences =
                        clean.split(
                                "(?<=[.!?])\\s+"
                        );


                StringBuilder bullets =
                        new StringBuilder();


                if (sentences.length > 1) {

                    for (String sentence : sentences) {

                        String point =
                                sentence.trim();


                        if (!point.isEmpty()) {

                            bullets
                                    .append("• ")
                                    .append(point)
                                    .append("\n");
                        }
                    }

                } else {

                    /*
                     * If the note does not contain
                     * punctuation, separate phrases
                     * using commas.
                     */

                    String[] phrases =
                            clean.split(
                                    "[,;]"
                            );


                    if (phrases.length > 1) {

                        for (String phrase : phrases) {

                            String point =
                                    phrase.trim();


                            if (!point.isEmpty()) {

                                bullets
                                        .append("• ")
                                        .append(
                                                capitalizeFirstLetter(
                                                        point
                                                )
                                        )
                                        .append("\n");
                            }
                        }

                    } else {

                        bullets
                                .append("• ")
                                .append(clean);
                    }
                }


                return bullets
                        .toString()
                        .trim();
            }



            default:

                return clean;
        }
    }



    // =====================================================
    // LOCAL CATEGORY FALLBACK
    // =====================================================

    private String createFallbackCategory(
            String title,
            String content
    ) {

        String combined =
                (
                        (title == null ? "" : title)
                        +
                        " "
                        +
                        (content == null ? "" : content)
                )
                        .toLowerCase();


        if (
                combined.contains("java")
                ||
                combined.contains("spring")
                ||
                combined.contains("oop")
                ||
                combined.contains("object oriented")
        ) {

            return "Java";
        }


        if (
                combined.contains("database")
                ||
                combined.contains("dbms")
                ||
                combined.contains("mysql")
                ||
                combined.contains("sql")
        ) {

            return "DBMS";
        }


        if (
                combined.contains("machine learning")
                ||
                combined.contains("data science")
                ||
                combined.contains("regression")
                ||
                combined.contains("dataset")
        ) {

            return "Data Science";
        }


        if (
                combined.contains("artificial intelligence")
                ||
                combined.contains(" ai ")
                ||
                combined.contains("openai")
                ||
                combined.contains("neural network")
        ) {

            return "Artificial Intelligence";
        }


        if (
                combined.contains("math")
                ||
                combined.contains("calculus")
                ||
                combined.contains("algebra")
                ||
                combined.contains("equation")
        ) {

            return "Mathematics";
        }


        if (
                combined.contains("meeting")
                ||
                combined.contains("project")
                ||
                combined.contains("deadline")
                ||
                combined.contains("task")
        ) {

            return "Work";
        }


        if (
                combined.contains("exam")
                ||
                combined.contains("assignment")
                ||
                combined.contains("lecture")
                ||
                combined.contains("study")
        ) {

            return "Study";
        }


        return "General";
    }



    // =====================================================
    // LOCAL SUMMARY FALLBACK
    // =====================================================

    private String createFallbackSummary(
            Note note
    ) {

        String content =
                note.getContent();


        if (
                content == null ||
                content.trim().isEmpty()
        ) {

            return "This note has no content to summarize.";
        }


        content =
                content.trim();


        String[] sentences =
                content.split(
                        "(?<=[.!?])\\s+"
                );


        StringBuilder summary =
                new StringBuilder();


        summary.append(
                "Note Summary\n\n"
        );


        summary
                .append("Title: ")
                .append(
                        note.getTitle()
                )
                .append("\n\n");


        summary.append(
                "Key Points:\n"
        );


        int sentenceLimit =
                Math.min(
                        sentences.length,
                        4
                );


        for (
                int i = 0;
                i < sentenceLimit;
                i++
        ) {

            String sentence =
                    sentences[i]
                            .trim();


            if (!sentence.isEmpty()) {

                summary
                        .append("• ")
                        .append(sentence)
                        .append("\n");
            }
        }


        if (
                sentences.length == 0
        ) {

            String shortContent =
                    content.length() > 300

                            ? content.substring(
                                    0,
                                    300
                            ) + "..."

                            : content;


            summary
                    .append("• ")
                    .append(shortContent);
        }


        summary.append(
                "\n\nGenerated using NoteX local summarization " +
                "because the AI service is currently unavailable."
        );


        return summary
                .toString()
                .trim();
    }



    // =====================================================
    // SMALL TEXT HELPER
    // =====================================================

    private String capitalizeFirstLetter(
            String text
    ) {

        if (
                text == null ||
                text.isBlank()
        ) {

            return "";
        }


        String trimmed =
                text.trim();


        return Character
                .toUpperCase(
                        trimmed.charAt(0)
                )
                +
                trimmed.substring(1);
    }
}