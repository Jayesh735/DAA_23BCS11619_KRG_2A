package com.searchsense.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "search_terms")
@Data
@NoArgsConstructor
public class SearchTerm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String term;

    @Column(nullable = false)
    private String category;

    private boolean trending = false;

    // --- NEW FIELD ---
    // We add a default value of 0, so it's never null
    @Column(name = "popularity", nullable = false, columnDefinition = "integer default 0") // [!code ++]
    private int popularity = 0; // [!code ++]
    // --- END OF NEW FIELD ---

    // A custom constructor to make it easy to create new terms
    public SearchTerm(String term, String category, boolean trending) {
        this.term = term;
        this.category = category;
        this.trending = trending;
        // Popularity will default to 0
    }
}