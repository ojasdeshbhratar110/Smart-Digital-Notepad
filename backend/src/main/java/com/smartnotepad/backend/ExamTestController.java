package com.smartnotepad.backend;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/exam-test")
@CrossOrigin(origins = "*")
public class ExamTestController {

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzePapers(
            @RequestParam("exam") String exam,
            @RequestParam("subject") String subject,
            @RequestParam("files") MultipartFile[] files
    ) {

        if (files == null || files.length == 0) {
            return ResponseEntity
                    .badRequest()
                    .body("Please upload at least one PDF.");
        }

        if (files.length > 5) {
            return ResponseEntity
                    .badRequest()
                    .body("Maximum 5 papers are allowed.");
        }

        try {

            List<Map<String, Object>> papers =
                    new ArrayList<>();

            int totalCharacters = 0;
List<Map<String, Object>> extractedQuestions =
        new ArrayList<>();
            for (MultipartFile file : files) {

                String text =
                        extractText(file);
                        System.out.println("\n==============================");
System.out.println("RAW PDF TEXT: " + file.getOriginalFilename());
System.out.println("==============================");
System.out.println(text);
System.out.println("==============================\n");
List<Map<String, Object>> questionsFromPaper =
        extractQuestions(
                text,
                file.getOriginalFilename()
        );
Map<Integer, String> answerKey =
        extractAnswerKey(text);

for (Map<String, Object> question : questionsFromPaper) {

    int questionNumber =
            ((Number) question.get("number")).intValue();

    String correctAnswer =
            answerKey.get(questionNumber);

    question.put(
            "correctAnswer",
            correctAnswer
    );
}
extractedQuestions.addAll(
        questionsFromPaper
);
                totalCharacters += text.length();

                Map<String, Object> paper =
                        new HashMap<>();

                paper.put(
                        "fileName",
                        file.getOriginalFilename()
                );

                paper.put(
                        "charactersExtracted",
                        text.length()
                );

                paper.put(
                        "text",
                        text
                );

                papers.add(paper);
            }
Map<String, Integer> topicFrequency =
        new HashMap<>();

String[] keywords = {
        "capacitor",
        "capacitance",
        "electrostatics",
        "current",
        "resistor",
        "resistance",
        "projectile",
        "mechanics",
        "photon",
        "photoelectric",
        "thermodynamics",
        "isothermal",
        "adiabatic",
        "magnetic",
        "magnetism"
};

for (Map<String, Object> paper : papers) {

    String text =
            paper.get("text")
                    .toString()
                    .toLowerCase();

    for (String keyword : keywords) {

        if (text.contains(keyword)) {

            topicFrequency.put(
                    keyword,
                    topicFrequency.getOrDefault(keyword, 0) + 1
            );
        }
    }
}
            Map<String, Object> result =
                    new HashMap<>();

            result.put("exam", exam);
            result.put("subject", subject);
            result.put("papersAnalyzed", files.length);
            result.put(
                    "totalCharactersExtracted",
                    totalCharacters
            );
            result.put("papers", papers);
result.put("topicFrequency", topicFrequency);
result.put(
        "questions",
        extractedQuestions
);

result.put(
        "questionsExtracted",
        extractedQuestions.size()
);
            return ResponseEntity.ok(result);

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "Failed to analyze PDFs: "
                                    + e.getMessage()
                    );
        }
    }


    private String extractText(
            MultipartFile file
    ) throws IOException {

        try (
                PDDocument document =
                        Loader.loadPDF(
                                file.getBytes()
                        )
        ) {

            PDFTextStripper stripper =
                    new PDFTextStripper();

            return stripper.getText(document);
        }
        
    }
    private List<Map<String, Object>> extractQuestions(
        String text,
        String sourceFile
) {

    List<Map<String, Object>> questions =
            new ArrayList<>();

        Pattern questionPattern =
        Pattern.compile(
                "(?ms)" +
                "^Q(\\d+)\\.\\s*" +
                "(.*?)" +
                "^A\\.\\s*(.*?)\\s*" +
                "^B\\.\\s*(.*?)\\s*" +
                "^C\\.\\s*(.*?)\\s*" +
                "^D\\.\\s*(.*?)\\s*" +
                "(?=^Q\\d+\\.|^Answer Key|\\z)"
        );

    Matcher matcher =
            questionPattern.matcher(text);

    while (matcher.find()) {

        Map<String, Object> question =
                new HashMap<>();
int questionNumber =
        Integer.parseInt(
                matcher.group(1)
        );

question.put(
        "number",
        questionNumber
);
        question.put(
                "question",
                matcher.group(2).trim()
        );

        Map<String, String> options =
                new HashMap<>();

        options.put("A", matcher.group(3).trim());
        options.put("B", matcher.group(4).trim());
        options.put("C", matcher.group(5).trim());
        options.put("D", matcher.group(6).trim());

        question.put("options", options);
        question.put("source", sourceFile);

        questions.add(question);
    }
System.out.println(
        "QUESTIONS FOUND IN " +
        sourceFile +
        " = " +
        questions.size()
);
    return questions;
}
private Map<Integer, String> extractAnswerKey(String text) {

    Map<Integer, String> answerKey =
            new HashMap<>();

    Pattern pattern =
            Pattern.compile(
                    "(?is)Answer\\s+Key\\s*" +
                    "Question\\s+([0-9\\s]+)\\s*" +
                    "Answer\\s+([A-D\\s]+)"
            );

    Matcher matcher =
            pattern.matcher(text);

    if (!matcher.find()) {
        return answerKey;
    }

    String[] numbers =
            matcher.group(1)
                    .trim()
                    .split("\\s+");

    String[] answers =
            matcher.group(2)
                    .trim()
                    .split("\\s+");

    int count =
            Math.min(
                    numbers.length,
                    answers.length
            );

    for (int i = 0; i < count; i++) {

        try {

            int questionNumber =
                    Integer.parseInt(numbers[i]);

            answerKey.put(
                    questionNumber,
                    answers[i].toUpperCase()
            );

        } catch (NumberFormatException ignored) {
        }
    }

    return answerKey;
}
}