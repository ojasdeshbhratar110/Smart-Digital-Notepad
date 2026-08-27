package com.smartnotepad.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notes")
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String category;
private String tags;
    private boolean favorite = false;

    private boolean archived = false;


    // =====================================================
    // SMART REMINDER
    // =====================================================

    @Column(name = "reminder_at")
    private LocalDateTime reminderAt;

    @Column(name = "reminder_done")
    private boolean reminderDone = false;


    // =====================================================
    // FILE / IMAGE ATTACHMENT
    // =====================================================

    @Column(name = "attachment_name")
    private String attachmentName;

    @Column(name = "attachment_url", columnDefinition = "TEXT")
    private String attachmentUrl;

    @Column(name = "attachment_type")
    private String attachmentType;


    // =====================================================
    // TIMESTAMPS
    // =====================================================

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;


    // =====================================================
    // USER
    // =====================================================

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;


    // =====================================================
    // CONSTRUCTORS
    // =====================================================

    public Note() {

        this.createdAt =
                LocalDateTime.now();

        this.updatedAt =
                LocalDateTime.now();
    }


    public Note(
            String title,
            String content,
            String category,
            User user
    ) {

        this.title =
                title;

        this.content =
                content;

        this.category =
                category;

        this.user =
                user;

        this.favorite =
                false;

        this.archived =
                false;

        this.reminderDone =
                false;

        this.createdAt =
                LocalDateTime.now();

        this.updatedAt =
                LocalDateTime.now();
    }


    // =====================================================
    // AUTO UPDATE TIMESTAMP
    // =====================================================

    @PreUpdate
    public void updateTimestamp() {

        this.updatedAt =
                LocalDateTime.now();
    }


    // =====================================================
    // ID
    // =====================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    // =====================================================
    // TITLE
    // =====================================================

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }


    // =====================================================
    // CONTENT
    // =====================================================

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }


    // =====================================================
    // CATEGORY
    // =====================================================

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
public String getTags() {
    return tags;
}

public void setTags(String tags) {
    this.tags = tags;
}

    // =====================================================
    // FAVORITE
    // =====================================================

    public boolean isFavorite() {
        return favorite;
    }

    public void setFavorite(boolean favorite) {
        this.favorite = favorite;
    }


    // =====================================================
    // ARCHIVED
    // =====================================================

    public boolean isArchived() {
        return archived;
    }

    public void setArchived(boolean archived) {
        this.archived = archived;
    }


    // =====================================================
    // REMINDER
    // =====================================================

    public LocalDateTime getReminderAt() {
        return reminderAt;
    }

    public void setReminderAt(
            LocalDateTime reminderAt
    ) {

        this.reminderAt =
                reminderAt;
    }


    public boolean isReminderDone() {
        return reminderDone;
    }

    public void setReminderDone(
            boolean reminderDone
    ) {

        this.reminderDone =
                reminderDone;
    }


    // =====================================================
    // ATTACHMENT NAME
    // =====================================================

    public String getAttachmentName() {
        return attachmentName;
    }

    public void setAttachmentName(
            String attachmentName
    ) {

        this.attachmentName =
                attachmentName;
    }


    // =====================================================
    // ATTACHMENT URL
    // =====================================================

    public String getAttachmentUrl() {
        return attachmentUrl;
    }

    public void setAttachmentUrl(
            String attachmentUrl
    ) {

        this.attachmentUrl =
                attachmentUrl;
    }


    // =====================================================
    // ATTACHMENT TYPE
    // =====================================================

    public String getAttachmentType() {
        return attachmentType;
    }

    public void setAttachmentType(
            String attachmentType
    ) {

        this.attachmentType =
                attachmentType;
    }


    // =====================================================
    // CREATED AT
    // =====================================================

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt
    ) {

        this.createdAt =
                createdAt;
    }


    // =====================================================
    // UPDATED AT
    // =====================================================

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(
            LocalDateTime updatedAt
    ) {

        this.updatedAt =
                updatedAt;
    }


    // =====================================================
    // USER
    // =====================================================

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}